#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# These could be made configurable via a .env file for the script itself if needed
PROJECT_DIR=$(git rev-parse --show-toplevel) # Get root directory of the Git repository
NGINX_CONF_TEMPLATE_PATH="$PROJECT_DIR/infra/nginx/default.conf.template"
NGINX_CONF_PATH="$PROJECT_DIR/infra/nginx/default.conf"
DOCKER_COMPOSE_FILE="$PROJECT_DIR/docker-compose.yml"

# --- Helper Functions ---
log() {
  echo "[DEPLOY] $(date +'%Y-%m-%d %H:%M:%S') - $1"
}

usage() {
  echo "Usage: $0 <environment> --domain <your_domain.com> --email <your_email@example.com>"
  echo "  <environment> : Currently 'production' is the primary target."
  echo "  --domain      : Your fully qualified domain name (e.g., dms-industries.ma)."
  echo "  --email       : Email address for Let's Encrypt registration."
  exit 1
}

# --- Argument Parsing ---
if [ "$#" -ne 5 ]; then
  usage
fi

ENVIRONMENT=$1
DOMAIN=""
EMAIL=""

# Parse named arguments
shift # remove environment
while [ "$#" -gt 0 ]; do
  case "$1" in
    --domain)
      DOMAIN="$2"
      shift 2
      ;;
    --email)
      EMAIL="$2"
      shift 2
      ;;
    *)
      log "Error: Unknown option: $1"
      usage
      ;;
  esac
done

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
  log "Error: Domain and Email are required."
  usage
fi

log "Starting deployment for environment: $ENVIRONMENT"
log "Domain: $DOMAIN"
log "Email: $EMAIL"

# --- Deployment Steps ---

# 1. Navigate to Project Directory
cd "$PROJECT_DIR"
log "Changed directory to $PROJECT_DIR"

# 2. Stop existing services (optional, good for clean slate but might cause downtime)
# Check if docker-compose is available before trying to use it
if command -v docker-compose &> /dev/null; then
    log "Stopping existing Docker services (if any)..."
    docker-compose -f "$DOCKER_COMPOSE_FILE" down || log "No services were running or docker-compose down failed (continuing)."
elif command -v docker compose &> /dev/null; then # Docker Compose V2 syntax
    log "Stopping existing Docker services (if any) using 'docker compose'..."
    docker compose -f "$DOCKER_COMPOSE_FILE" down || log "No services were running or docker compose down failed (continuing)."
else
    log "Warning: docker-compose (V1 or V2) not found. Skipping 'down' command."
fi


# 3. Pull latest changes from Git (assuming current branch is the deployment branch)
log "Pulling latest changes from Git..."
git pull origin $(git rev-parse --abbrev-ref HEAD) # Pull from current branch's remote

# 4. Prepare Nginx Configuration
# For this subtask, we will directly modify default.conf as per the fallback logic.
# A template approach is generally better for more complex substitutions.
log "Updating existing Nginx config $NGINX_CONF_PATH with domain $DOMAIN..."
if [ ! -f "$NGINX_CONF_PATH" ]; then
    log "Error: Nginx configuration file $NGINX_CONF_PATH not found!"
    exit 1
fi
# Create a backup
cp "$NGINX_CONF_PATH" "$NGINX_CONF_PATH.bak.$(date +%F_%T)"
# Replace placeholder. Using a different delimiter for sed in case domain contains slashes.
sed -i.bak "s|your_domain_placeholder.com|$DOMAIN|g" "$NGINX_CONF_PATH"
log "Nginx config updated. Original backup suffixed with .bak"


# 5. Build/Rebuild Docker images
DOCKER_COMPOSE_CMD=""
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
elif command -v docker compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
else
    log "Error: docker-compose (V1 or V2) not found. Cannot proceed with build."
    exit 1
fi

log "Building Docker images using '$DOCKER_COMPOSE_CMD'..."
$DOCKER_COMPOSE_CMD -f "$DOCKER_COMPOSE_FILE" build --no-cache # --no-cache for fresh build

# 6. Start services
log "Starting Docker services in detached mode using '$DOCKER_COMPOSE_CMD'..."
$DOCKER_COMPOSE_CMD -f "$DOCKER_COMPOSE_FILE" up -d

# 7. Initial Certbot Certificate Issuance (if needed)
HOST_CERT_DIR="$PROJECT_DIR/infra/nginx/letsencrypt/live/$DOMAIN"

if [ ! -d "$HOST_CERT_DIR" ] || [ ! -s "$HOST_CERT_DIR/fullchain.pem" ]; then
  log "Certificates for $DOMAIN not found or empty. Attempting to obtain them..."
  log "Make sure your DNS records for $DOMAIN are pointing to this server's IP address."
  log "Waiting a few seconds for Nginx to be ready for Certbot challenges..."
  sleep 15 # Increased sleep time

  # Ensure infra/nginx/letsencrypt and infra/nginx/certbot_webroot directories exist on host
  mkdir -p "$PROJECT_DIR/infra/nginx/letsencrypt"
  mkdir -p "$PROJECT_DIR/infra/nginx/certbot_webroot"
  # Docker Compose should create these if mapped in volumes, but good to be sure for Certbot tool.

  log "Running Certbot..."
  $DOCKER_COMPOSE_CMD -f "$DOCKER_COMPOSE_FILE" run --rm certbot certonly \
    --webroot -w /var/www/certbot \
    -d "$DOMAIN" -d "www.$DOMAIN" \
    --email "$EMAIL" \
    --agree-tos --no-eff-email --non-interactive \
    --logs-dir /etc/letsencrypt/logs \
    --preferred-challenges http-01 || log "Certbot failed to obtain certificates. Check DNS and Nginx logs."

  # Check again if certs were created after running certbot
  if [ -d "$HOST_CERT_DIR" ] && [ -s "$HOST_CERT_DIR/fullchain.pem" ]; then
    log "Certificates obtained successfully. Reloading Nginx..."
    $DOCKER_COMPOSE_CMD -f "$DOCKER_COMPOSE_FILE" exec nginx nginx -s reload
  else
    log "Certificates still not found after Certbot run. Please check Certbot logs and DNS setup."
    log "Nginx config points to these certificate paths. HTTPS might not work until certs are valid."
  fi
else
  log "Certificates for $DOMAIN already exist. Skipping issuance."
  log "To renew, run '$DOCKER_COMPOSE_CMD -f $DOCKER_COMPOSE_FILE run --rm certbot renew' periodically."
  # Ensure Nginx is reloaded to pick up existing certs if it was just restarted
  log "Reloading Nginx to ensure it uses existing certificates..."
  $DOCKER_COMPOSE_CMD -f "$DOCKER_COMPOSE_FILE" exec nginx nginx -s reload || log "Nginx reload failed or Nginx not running."
fi

log "Deployment for $DOMAIN completed!"
echo "---------------------------------------------------------------------"
echo "Your site should be accessible at https://$DOMAIN"
echo "If HTTPS is not working, check Nginx logs and Certbot certificate paths."
echo "Remember to set up a cron job for certificate renewal:"
echo "  0 1 * * * $DOCKER_COMPOSE_CMD -f $DOCKER_COMPOSE_FILE run --rm certbot renew --post-hook \"$DOCKER_COMPOSE_CMD -f $DOCKER_COMPOSE_FILE exec nginx nginx -s reload\""
echo "---------------------------------------------------------------------"

exit 0

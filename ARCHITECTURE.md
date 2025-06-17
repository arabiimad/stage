# DentalTech Pro - System Architecture

## 1. Introduction

This document provides a high-level overview of the DentalTech Pro application architecture. It outlines the main components, their responsibilities, and how they interact. The system is designed as a modern web application with a decoupled frontend and backend, containerized for production deployment.

## 2. Components

### 2.1. Frontend (Client Application)

-   **Directory:** `dental-website/`
-   **Technology:** React 19 (using Vite for bundling and development server).
-   **Styling:** Tailwind CSS with Shadcn/ui for pre-built, accessible components.
-   **Routing:** `react-router-dom` for client-side navigation.
-   **State Management:** React Context API (e.g., `AuthContext`, `CartContext`). For more complex global state, Zustand or Redux Toolkit could be considered.
-   **API Communication:** `axios` for making HTTP requests to the backend API.
-   **Key Responsibilities:**
    -   Rendering the user interface for both public users and administrators.
    -   Handling user interactions (browsing products, managing cart, submitting forms).
    -   Client-side validation and dynamic UI updates.
    -   Securely communicating with the backend API for data and authentication.
    -   Displaying administrative interfaces for managing products, orders, and articles.

### 2.2. Backend (API Server)

-   **Directory:** `dental-api/`
-   **Technology:** Flask 3 (Python web framework).
-   **Database Interaction:** SQLAlchemy as the ORM.
-   **Authentication:** JWT-based using `Flask-JWT-Extended`, supporting roles (`client`, `admin`). Passwords hashed with `bcrypt`.
-   **Production Server:** Gunicorn (WSGI server).
-   **Real-time Features:** Server-Sent Events (SSE) for features like low stock alerts.
-   **Key Responsibilities:**
    -   Providing RESTful API endpoints for all application functionalities.
    -   Handling business logic (product management, order processing, user authentication, article management).
    -   Interacting with the database for data persistence.
    -   Managing user roles and permissions for protected resources.
    -   Serving uploaded files (e.g., article images).

### 2.3. Database

-   **Production:** PostgreSQL (containerized via Docker).
-   **Local Development:** SQLite (default, for ease of setup).
-   **Schema Management:** SQLAlchemy models define the database schema. `db.create_all()` initializes tables.
-   **Key Models:**
    -   `User`: Stores user credentials, roles, and profile information.
    -   `Product`: Product details, pricing, stock, category, images.
    -   `ProductReview`: (If implemented) User reviews for products.
    -   `Order`: Customer orders, items, total amount, status, WhatsApp message preview.
    -   `Article`: Content for blog/news section, including title, slug, content, author, image.
    -   `CaseStudy`: (If implemented) Detailed case studies or showcases.
-   **Seeding:** A Python script (`dental-api/src/utils/seed.py`) is provided to populate the database with initial/sample data.

### 2.4. Admin Dashboard

-   **Access:** Integrated within the React frontend, available at `/admin` routes.
-   **Protection:** Secured using `ProtectedRoute` component, requiring 'admin' role via JWT.
-   **Features:**
    -   **Product Management:** Create, Read, Update, Delete (CRUD) products.
    -   **Order Management:** View list of orders, update order status, export orders to CSV.
    -   **Article Management:** CRUD operations for articles, including image uploads.
    -   **Low Stock Alerts:** Real-time display of products with low stock via SSE.

## 3. Key Workflows

### 3.1. Authentication Flow

1.  User registers or logs in via frontend forms.
2.  Frontend sends credentials to backend `/auth/register` or `/auth/login` endpoints.
3.  Backend validates credentials, creates user (if registering), and generates JWT access and refresh tokens. The JWT includes the user's role.
4.  Tokens are sent back to the frontend.
5.  Frontend stores tokens (e.g., `localStorage`) and uses the access token in Authorization headers for subsequent API requests.
6.  Backend API endpoints protected by `@jwt_required()` or `@admin_required` (which also checks role) validate the token.

### 3.2. WhatsApp Checkout Flow

1.  User adds products to cart on the frontend.
2.  User proceeds to checkout from the cart sidebar.
3.  Frontend prompts for customer name if user is not logged in.
4.  Frontend constructs a summary message for WhatsApp.
5.  Frontend sends cart details, total price, customer name, and the WhatsApp message to the backend `/api/orders/whatsapp_checkout` endpoint.
6.  Backend creates an `Order` record in the database with status 'En attente' and stores the WhatsApp message preview.
7.  Backend responds with success.
8.  Frontend clears the cart and redirects the user to WhatsApp using a `wa.me` link, pre-filling the generated message.

### 3.3. Real-time Stock Alerts Flow

1.  Admin user navigates to the Admin Dashboard.
2.  Frontend establishes an SSE connection to `/api/admin/stock_alerts`. (Authentication for SSE is handled by passing JWT as a query parameter, requiring backend adjustment to the standard decorator).
3.  Backend SSE endpoint periodically checks product stock levels.
4.  If products with stock quantity below a threshold (e.g., < 10) are found, the backend sends an SSE message of type `low_stock` containing details of these products.
5.  If previously alerted products are restocked, a `stock_ok` message is sent.
6.  Frontend receives these messages and updates the Admin Dashboard UI to display/remove alerts.

## 4. Docker Infrastructure (Production Setup)

The production environment is orchestrated using `docker-compose.yml`.

-   **Nginx (`nginx` service):**
    -   Acts as a reverse proxy.
    -   Serves the static build of the React frontend.
    -   Handles SSL termination (HTTPS) using certificates from Let's Encrypt (managed by Certbot).
    -   Forwards API requests (`/api/*`) and static asset requests (`/static/uploads/*`) to the backend service.
    -   Redirects HTTP traffic to HTTPS.
    -   Serves ACME challenge files for Certbot.
-   **Backend Application (`backend` service):**
    -   Runs the Flask application using Gunicorn as the WSGI server.
    -   Connects to the PostgreSQL database.
    -   Manages file uploads to a shared volume (for article images).
-   **Database (`postgres` service):**
    -   Runs a PostgreSQL server.
    -   Uses a named volume (`pgdata`) for persistent database storage.
-   **Frontend Builder (`frontend` service):**
    -   This service is only used at build time (`docker-compose build`).
    -   It builds the React application and outputs the static files to a named volume (`dental-website-dist`). Nginx then serves from this volume.
-   **Certbot (`certbot` service):**
    -   Manages SSL certificate issuance and renewal with Let's Encrypt.
    -   Uses a shared volume (`./infra/nginx/certbot_webroot`) for webroot challenges and another (`./infra/nginx/letsencrypt`) for storing certificates.
-   **Volumes:**
    -   `pgdata`: PostgreSQL data.
    -   `dental-website-dist`: Frontend static build artifacts.
    -   `./dental-api/src/static/uploads`: Article images, shared with the backend container.
    -   `./infra/nginx/letsencrypt`: SSL certificates.
    -   `./infra/nginx/certbot_webroot`: Certbot challenge files.
-   **Network:** A custom bridge network (`dentalnet`) allows services to communicate.

## 5. CI/CD (GitHub Actions)

The project uses GitHub Actions for Continuous Integration and Continuous Deployment.

-   **`lint_test.yml` Workflow:**
    -   Triggered on pushes and pull requests to `main` and `develop` branches.
    -   **Linting:** Performs static code analysis on both frontend (ESLint) and backend (Flake8) code.
    -   **Testing:** (Placeholders for future implementation) Intended to run automated tests for frontend and backend.
-   **`build_push_deploy.yml` Workflow:**
    -   Triggered on pushes to the `main` branch.
    -   **Build & Push Backend Image:**
        -   Builds the backend Docker image.
        -   Tags the image (with Git SHA and `latest`).
        -   Pushes the image to GitHub Container Registry (GHCR).
    -   **Deploy to Production:**
        -   Connects to the production server via SSH.
        -   Executes the `infra/deploy.sh` script on the server.
        -   The `deploy.sh` script handles:
            -   Pulling the latest code.
            -   Updating Nginx configuration with the production domain and email (for Let's Encrypt).
            -   Stopping, rebuilding (if necessary), and restarting services using `docker-compose`. This includes pulling the latest backend image from GHCR.
            -   Initiating SSL certificate issuance with Certbot if certificates are not found or need renewal.

## 6. Diagram (Conceptual Text-Based)

```
User Browser
    |
    v
Internet -> [ Nginx (HTTPS Reverse Proxy, Frontend Static Files, Certbot Challenges) ]
                |    |                                  ^
                |    | (ACME Challenge)                  | (Certs)
                |    v                                  |
                |  [ Certbot ] --------------------------
                |
                |-----> [ Frontend (React served by Nginx) ]
                |         |
                |         v (API Calls: /api/*)
                |-----> [ Backend (Flask/Gunicorn API on :5000) ]---------------------> [ PostgreSQL DB ]
                          |   ^
                          |   | (SSE: /api/admin/stock_alerts)
                          |   v
                          | [ Static Uploads (e.g. /static/uploads/articles/* served by Flask) ]
                          |
                          v (Admin user specific interaction)
                        Admin User Browser (accessing /admin routes via Nginx -> Frontend)


GitHub Actions CI/CD:
  [ GitHub Repo ] --(push/PR)--> [ Lint & Test Workflow ]
                  --(push to main)--> [ Build & Push Image Workflow ] --(Docker Image)--> [ GHCR ]
                                                                         |
                                                                         v (SSH Trigger)
                                                                       [ Production Server (runs deploy.sh) ]
                                                                           |
                                                                           v (Pulls image from GHCR)
                                                                         [ Docker Compose Stack (Nginx, Backend, DB, Certbot) ]
```

This architecture aims for a balance of modern practices, scalability, and maintainability for the DentalTech Pro platform.

# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and pnpm-lock.yaml (or package-lock.json if using npm)
COPY package.json pnpm-lock.yaml ./

# Enable pnpm and install dependencies
RUN corepack enable && pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Set build-time environment variables if needed, e.g., for VITE_API_BASE_URL
# These can be passed during the `docker build` command or set in docker-compose.yml build args
# ARG VITE_API_BASE_URL
# ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
# ARG VITE_IMAGE_BASE_URL
# ENV VITE_IMAGE_BASE_URL=$VITE_IMAGE_BASE_URL
# ARG VITE_WHATSAPP_NUMBER
# ENV VITE_WHATSAPP_NUMBER=$VITE_WHATSAPP_NUMBER

# Build the application for production
RUN pnpm build

# Stage 2: This stage is just to make the build artifacts available.
# Nginx will serve these files from a volume.
# We don't need a separate Nginx server in this Dockerfile.
FROM alpine:latest
WORKDIR /app
COPY --from=build /app/dist ./dist
# No CMD or EXPOSE needed, as this image's purpose is to provide the /app/dist artifact.
# The docker-compose.yml will copy this 'dist' folder to a named volume
# which Nginx will then use.

# DentalTech Pro - E-commerce and Admin Platform

## Overview

DentalTech Pro is a comprehensive web application designed for a dental equipment and supplies company. It features a public-facing e-commerce frontend for customers and a robust admin dashboard for managing products, orders, articles, and more. The platform is built with a modern technology stack, emphasizing scalability and maintainability, and is designed for production deployment using Docker and CI/CD with GitHub Actions.

## Features

-   **JWT Authentication:** Secure authentication system with distinct roles for `client` and `admin`.
-   **Product Showcase & Details:** Customers can browse products, view detailed descriptions, images, and prices.
-   **Shopping Cart System:** Fully functional cart for adding/updating/removing products.
-   **WhatsApp Checkout:** Streamlined checkout process redirecting users to WhatsApp for order finalization.
-   **Admin Dashboard:**
    -   **Product Management:** Full CRUD (Create, Read, Update, Delete) operations for products.
    -   **Order Management:** View orders, update their status (En attente, Confirmée, Expédiée, Annulée, Livrée), and export orders to CSV.
    -   **Article Management:** Full CRUD operations for articles/blog posts, including image uploads.
    -   **Real-time Low Stock Alerts:** Server-Sent Events (SSE) provide real-time notifications on the dashboard for products with low stock.
-   **Database Seeding:** Script to populate the database with initial/sample data for development and testing.
-   **Dockerized Production Environment:**
    -   Services orchestrated with `docker-compose.yml`.
    -   Includes Nginx (reverse proxy, serving frontend), Flask/Gunicorn (backend API), PostgreSQL (database).
    -   Automated SSL certificate management with Certbot for HTTPS.
-   **CI/CD Pipeline (GitHub Actions):**
    -   Automated linting for backend and frontend.
    -   Automated building of the backend Docker image and pushing to GitHub Container Registry (GHCR).
    -   Automated deployment to a production server via SSH using a deployment script.

## Technologies Used

-   **Frontend:**
    -   React 19 (Vite)
    -   Tailwind CSS
    -   React Router
    -   State Management: React Context (Zustand could be an alternative)
    -   Axios (for API communication)
    -   Shadcn/ui (UI components)
    -   Framer Motion (animations)
    -   `react-hook-form` & `zod` (form handling and validation)
    -   `sonner` (toast notifications)
    -   `date-fns` (date formatting)
-   **Backend:**
    -   Flask 3 (Python)
    -   SQLAlchemy (ORM)
    -   Flask-JWT-Extended (JWT authentication)
    -   Bcrypt (password hashing)
    -   Gunicorn (WSGI server for production)
    -   Server-Sent Events (SSE) for real-time features
-   **Database:**
    -   PostgreSQL (production)
    -   SQLite (local development default)
-   **DevOps:**
    -   Docker & Docker Compose
    -   Nginx
    -   Certbot (Let's Encrypt for HTTPS)
    -   GitHub Actions (CI/CD)

## Prerequisites for Local Development

-   Node.js (v18 or v20 recommended) and pnpm (v8 or v9 recommended)
-   Python (v3.11 or higher) and pip
-   Docker and Docker Compose (optional, for running production-like setup locally or if you prefer not to set up local Python/Node environments)

## Local Development Setup

1.  **Clone Repository:**
    ```bash
    git clone <repository_url>
    cd dentaltech-pro
    ```

2.  **Backend (`dental-api`):**
    -   Navigate to `dental-api/`: `cd dental-api`
    -   Create a virtual environment: `python -m venv .venv`
    -   Activate the virtual environment:
        -   Windows: `.venv\Scripts\activate`
        -   macOS/Linux: `source .venv/bin/activate`
    -   Install dependencies: `pip install -r requirements.txt`
    -   **Environment Variables:** Create a `.env` file in the `dental-api/` directory (this file is gitignored).
        ```env
        FLASK_APP=src.main:app
        FLASK_ENV=development
        FLASK_DEBUG=1
        # DATABASE_URL=postgresql://user:pass@host:port/dbname # Optional, defaults to SQLite
        # SQLALCHEMY_ECHO=True # Optional: for debugging SQL queries
        JWT_SECRET_KEY=your_local_jwt_secret_key_123! # Use a strong, unique key
        UPLOAD_FOLDER=src/static/uploads/articles # Default, already set in app config
        ```
    -   Initialize database & seed data: `python src/utils/seed.py`
        *(Ensure the database (e.g., `dental-api/src/database/app.db` for SQLite) is writable or your PostgreSQL instance is running if `DATABASE_URL` is set).*
    -   Run backend server: `flask run` or `python src/main.py`
        *(Typically runs on `http://localhost:5000`)*

3.  **Frontend (`dental-website`):**
    -   Navigate to `dental-website/`: `cd ../dental-website` (from `dental-api`) or `cd dental-website` (from root)
    -   Install dependencies: `pnpm install --frozen-lockfile`
    -   **Environment Variables:** Create a `.env.development` file in `dental-website/` (this file is gitignored). It should already exist from previous steps.
        ```env
        # For local development, pointing directly to Flask backend
        VITE_API_BASE_URL=http://localhost:5000/api
        VITE_IMAGE_BASE_URL=http://localhost:5000
        # (Backend serves static files from /static, so /static/uploads/... becomes http://localhost:5000/static/uploads/...)
        VITE_WHATSAPP_NUMBER=212600000000 # Replace with your test WhatsApp number
        ```
    -   Run frontend development server: `pnpm dev`
        *(Typically runs on `http://localhost:5173`)*

## Running with Docker (Production-like Environment)

1.  **Prerequisites:** Docker and Docker Compose installed.
2.  **Environment Variables for Docker Compose:**
    Create a `.env` file in the project root directory (where `docker-compose.yml` is located). This file is gitignored.
    ```env
    # .env (for docker-compose)
    POSTGRES_USER=dentaluser
    POSTGRES_PASSWORD=dentalpass
    POSTGRES_DB=dentaldb
    JWT_SECRET_KEY_DOCKER=a_very_strong_and_different_jwt_secret_for_docker_!@# # Use a strong key

    # These are needed by deploy.sh and might be used by docker-compose if configured to do so
    # For local docker-compose up, Nginx will use placeholder domain from its default.conf
    # DOMAIN_PROD=localhost
    # EMAIL_LETSENCRYPT_PROD=test@example.com
    ```
3.  **Build and Run Containers:**
    ```bash
    docker-compose build
    docker-compose up -d
    ```
4.  **Accessing the Application:**
    -   The application should be accessible at `http://localhost` (Nginx on port 80).
    -   If you've configured a domain and obtained SSL certificates (via `deploy.sh` or manually running certbot commands with `docker-compose run certbot ...`), it would be `https://yourdomain.com`.
5.  **Seeding Data in Docker:**
    After the containers are running, to seed the PostgreSQL database:
    ```bash
    docker-compose exec backend python src/utils/seed.py
    ```
6.  **Stopping Services:**
    ```bash
    docker-compose down
    ```

## Deployment

Deployment to a production server is automated via the `infra/deploy.sh` script. This script handles:
-   Pulling latest code.
-   Updating Nginx configuration with the production domain.
-   Building and restarting Docker containers using `docker-compose`.
-   Initial SSL certificate issuance via Certbot (Let's Encrypt) if certificates are not found.

For more details on the CI/CD pipeline and overall architecture, please refer to `ARCHITECTURE.md`.

## .gitignore notice
Ensure that `.env` files at both root and service level (`dental-api/.env`, `dental-website/.env.development`) are included in your `.gitignore` to prevent committing sensitive information. The provided project `.gitignore` should already cover this.
The `dental-api/src/static/uploads/` directory is also gitignored.

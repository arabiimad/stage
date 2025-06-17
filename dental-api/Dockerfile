FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV FLASK_APP=src.main:app
ENV FLASK_ENV=production

WORKDIR /app

# Install system dependencies that might be needed by some Python packages
# Example: RUN apt-get update && apt-get install -y some-lib some-other-lib && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Install Python dependencies
# Consider using a virtual environment inside Docker for better isolation, though not strictly necessary for basic setups
RUN pip install --no-cache-dir -r requirements.txt
# Add psycopg2 for PostgreSQL and gunicorn for serving
RUN pip install --no-cache-dir gunicorn psycopg2-binary

COPY . .

# Create the upload folder within the container if it doesn't exist
# The UPLOAD_FOLDER env var will be used by Flask app, this just ensures path exists
# This path should match what's specified for UPLOAD_FOLDER in docker-compose.yml for the backend service
RUN mkdir -p /app/src/static/uploads/articles

# Expose the port the app runs on
EXPOSE 5000

# Run the application
# Use Gunicorn for production. Adjust workers as needed.
CMD ["gunicorn", "--workers", "2", "--bind", "0.0.0.0:5000", "src.main:app"]

import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify # Added jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from src.database import db
from src.routes.products import products_bp
from src.routes.cart import cart_bp
from src.routes.orders import orders_bp
from src.routes.auth import auth_bp


app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# File Upload Configuration
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'static/uploads/articles')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
app.config['JWT_SECRET_KEY'] = 'super-secret-jwt-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 604800


# Enable CORS for specific origins
# For development, this allows the Vite dev server (default port 5173)
# In production, this should be configured to the actual frontend domain.
CORS(app, origins=['http://localhost:5173'], supports_credentials=True)


# Initialize JWTManager
jwt = JWTManager(app)

# Helper function for file uploads
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Register API blueprints
app.register_blueprint(products_bp, url_prefix='/api')
app.register_blueprint(cart_bp, url_prefix='/api')
app.register_blueprint(orders_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')


# Database configuration
# Use DATABASE_URL from environment if available (for PostgreSQL in Docker),
# otherwise fall back to SQLite for local development without Docker.
database_dir = os.path.join(os.path.dirname(__file__), 'database')
os.makedirs(database_dir, exist_ok=True) # Ensure 'database' directory exists for SQLite fallback
sqlite_db_path = os.path.join(database_dir, 'app.db')

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', f"sqlite:///{sqlite_db_path}")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()
    # Initialize sample data (Now handled by dental-api/src/utils/seed.py manually)
    # from src.models.product import Product
    # if Product.query.count() == 0:
    #     from src.utils.seed_data import seed_products
    #     seed_products()

# Global Error Handlers
@app.errorhandler(405)
def method_not_allowed(e):
    # current_app.logger.warning(f"Method Not Allowed (405): {request.method} {request.path} - {e}") # Optional: log request details
    return jsonify(error="Method Not Allowed On This Endpoint"), 405

@app.errorhandler(404) # Optional: Add a JSON 404 handler too for API consistency
def not_found_error(e):
    # current_app.logger.warning(f"Not Found (404): {request.path} - {e}")
    # Check if the request path starts with /api to only affect API calls
    # from flask import request # Import request if using it here
    # if request.path.startswith('/api/'):
    #    return jsonify(error="Resource not found"), 404
    # else:
    #    # For non-API routes, you might want Flask's default HTML 404 or your frontend's 404
    #    # This part needs careful consideration based on how frontend handles 404s for non-API paths
    return jsonify(error="The requested URL was not found on the server."), 404


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


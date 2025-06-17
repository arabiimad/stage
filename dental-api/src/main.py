import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager # Import JWTManager
from src.models import db # Corrected db import
from src.routes.products import products_bp
from src.routes.cart import cart_bp
from src.routes.orders import orders_bp
from src.routes.auth import auth_bp # Import auth_bp
from src.routes.admin.products_admin import products_admin_bp # Import admin products blueprint
from src.routes.admin.orders_admin import orders_admin_bp # Import admin orders blueprint
from src.routes.admin.articles_admin import articles_admin_bp # Import admin articles blueprint
from src.routes.admin.stock_alerts_sse import stock_alerts_sse_bp # Import SSE blueprint
# Keep os import at the top if it was already there, otherwise ensure it is imported.
# import os # Already imported at the top by default in this project

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))

# File Upload Configuration
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'static/uploads/articles')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif'}
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
app.config['JWT_SECRET_KEY'] = 'your-jwt-secret-key-please-change' # Configure JWT_SECRET_KEY

# Enable CORS for all routes
CORS(app, origins=['*'])

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
app.register_blueprint(auth_bp, url_prefix='/api') # Register auth_bp
app.register_blueprint(products_admin_bp, url_prefix='/api/admin') # Register admin products blueprint
app.register_blueprint(orders_admin_bp, url_prefix='/api/admin') # Register admin orders blueprint
app.register_blueprint(articles_admin_bp, url_prefix='/api/admin') # Register admin articles blueprint
app.register_blueprint(stock_alerts_sse_bp, url_prefix='/api/admin') # Register SSE blueprint

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


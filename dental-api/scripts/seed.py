import os
import sys
import random
from datetime import datetime
# No re import needed for this script's current functionality

# Adjust path to import app and models from src
# This assumes the script is run from the project root (e.g., python dental-api/scripts/seed.py)
# or that the dental-api directory is in PYTHONPATH.
# For direct execution from dental-api/scripts/, this path adjustment is crucial.
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from src.main import app # To get app context
    from src.models import db
    from src.models.user import User
    from src.models.product import Product
    # Import other models if you plan to seed them here as well
    # from src.models.article import Article
    # from src.models.casestudy import CaseStudy
except ImportError as e:
    print(f"Error importing modules: {e}")
    print("Please ensure you are running this script from the project root,")
    print("or that the 'dental-api' directory is in your PYTHONPATH.")
    print("Example: python dental-api/scripts/seed.py")
    sys.exit(1)


# Define product categories
CATEGORIES = ['equipments', 'consumables', 'cadcam', 'implantology', 'orthodontics']

def get_random_image_url(seed_word="dental", width=400, height=300):
    # Using a more unique seed per image to get different images from picsum.photos
    return f"https://picsum.photos/seed/{seed_word}_{random.randint(1, 10000)}/{width}/{height}"

def seed_database():
    with app.app_context():
        # Drop and recreate tables for a clean seed
        # This is destructive. Be careful in environments other than development.
        # Consider commenting this out if you want to append data or manage schema manually.
        # db.drop_all()
        # db.create_all()
        # For the purpose of this task, let's assume tables are created by main.py's db.create_all()
        # and we just want to clear and add data to User and Product.
        # A more robust script might have options for --drop or --clear-data.

        # Clear existing data from tables we are about to seed
        print("Clearing existing User and Product data...")
        Product.query.delete() # Clear all products
        User.query.filter(User.email != 'admin@dentaltech.pro').delete() # Clear non-admin users
        # Or User.query.delete() if you want to recreate admin too, but the logic below handles admin update/create
        db.session.commit() # Commit deletions

        print("Database tables cleared of relevant data.")


        # Seed Admin User
        admin_email = 'admin@dentaltech.pro'
        admin_username = 'admin'
        admin_password = 'Admin123!' # As per new spec from user feedback
        admin_role = 'admin'

        admin_user = User.query.filter_by(email=admin_email).first()
        if not admin_user:
            admin_user = User(username=admin_username, email=admin_email, role=admin_role)
            admin_user.set_password(admin_password) # Uses Werkzeug hashing from User model
            db.session.add(admin_user)
            print(f"Admin user '{admin_email}' created with password '{admin_password}'.")
        else:
            admin_user.username = admin_username
            admin_user.set_password(admin_password) # Ensure password is updated
            admin_user.role = admin_role # Ensure role is admin
            print(f"Admin user '{admin_email}' updated with password '{admin_password}' and role '{admin_role}'.")

        # Seed Products (~100)
        print("Seeding products...")
        product_names_prefixes = ["Pro", "Elite", "Advanced", "Ortho", "Implant", "Dental", "Surgical", "Digital", "Max", "Uni", "Alpha", "Beta", "Gamma"]
        product_names_suffixes = ["Scanner", "Unit", "Kit", "System", "Forceps", "Drill", "Resin", "Wire", "Bracket", "Aligner", "Cement", "Gloves", "Masks", "Sterilizer", "X-Ray", "CAD Software", "3D Printer", "Curette", "Scaler", "Mirror"]

        products_to_seed = []
        # Ensure we have unique names if DB has unique constraint on name, or handle it
        # For this seeding, names might not be strictly unique with random generation.
        # If name needs to be unique, add a check or use a different generation strategy.

        for i in range(100):
            category = random.choice(CATEGORIES)
            name_prefix = random.choice(product_names_prefixes)
            name_suffix = random.choice(product_names_suffixes)
            # Make product name more unique for seeding to avoid potential future unique constraints
            product_name = f"{name_prefix} {category.capitalize()} {name_suffix} Series {random.randint(100,999)+i}"

            # Ensure price is always greater than original_price if original_price exists
            base_price = round(random.uniform(10.99, 25000.99), 2)
            make_original_pricier = random.random() > 0.7 # 30% chance to have an original_price

            if make_original_pricier:
                price = base_price
                original_price = round(base_price * random.uniform(1.15, 1.5), 2) # Original is 15-50% higher
            else:
                price = base_price
                original_price = None


            product = Product(
                name=product_name,
                description=f"High quality {product_name} for all your dental needs. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                short_description=f"Top-tier {name_prefix} {name_suffix}, ideal for modern clinics.",
                category=category,
                price=price,
                original_price=original_price,
                stock_quantity=random.randint(0, 200), # Includes 0 for potential out-of-stock items
                is_active=True, # Ensure products are active
                badge=random.choice([None, "Nouveau", "Promotion", "Populaire", "Fin de stock"]) if random.random() > 0.6 else None,
                image_url=get_random_image_url(f"{category.replace(' ','_')}_{i+1}"),
                specifications={
                    "Material": random.choice(["Titanium Grade 5", "Stainless Steel Surgical", "Advanced Polymer Composite", "High-Impact Ceramic", "Latex-Free Nitrile"]),
                    "Warranty": f"{random.randint(1,5)} years",
                    "Origin": random.choice(["Germany", "USA", "Switzerland", "Japan", "Local"]),
                    "Power": random.choice(["220V", "110V", "Battery Operated", "N/A"]) if category == 'equipments' else None
                },
                features=[
                    f"Feature {j+1} for {product_name.split(' Series')[0]}" for j in range(random.randint(2,5))
                ] + [random.choice(["Eco-friendly packaging", "Autoclavable", "Digital Integration Ready", "Ergonomic Design"])]
            )
            products_to_seed.append(product)

        db.session.add_all(products_to_seed)
        print(f"Added {len(products_to_seed)} products to session.")

        # Commit session
        try:
            db.session.commit()
            print("Successfully seeded database with admin user and products.")
        except Exception as e:
            db.session.rollback()
            print(f"Error seeding database: {e}")
            # For more detailed error, especially during development:
            # import traceback
            # traceback.print_exc()

if __name__ == '__main__':
    # This check ensures that the script is being run directly and not imported.
    # It also implies that the Flask app context needs to be available.
    # Running this script standalone (python dental-api/scripts/seed.py) requires
    # the app context to be correctly set up, which `from src.main import app` and
    # `with app.app_context():` handles.

    # Before running, ensure your .env file (if used by Flask for DB config) is correct,
    # or that DATABASE_URL env var is set if using PostgreSQL for seeding.
    # If using default SQLite, ensure 'dental-api/src/database/' directory is writable.

    print("Starting database seeding process...")
    seed_database()
    print("Database seeding process finished.")

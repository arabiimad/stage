import os
from faker import Faker
from src.database import db
from src.models.product import Product
from src.models.user import User
from flask import Flask

fake = Faker('fr_FR')

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///dental-api/src/database/app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

NUM_PRODUCTS = 100
NUM_USERS = 5

with app.app_context():
    db.drop_all()
    db.create_all()

    for _ in range(NUM_PRODUCTS):
        product = Product(
            name=fake.sentence(nb_words=3),
            description=fake.paragraph(nb_sentences=5),
            short_description=fake.sentence(),
            category=fake.random_element(elements=['equipments','consumables','cadcam','implantology','orthodontics']),
            price=round(fake.random_number(digits=4)/10, 2),
            stock_quantity=fake.random_int(min=0, max=50),
            image_url='/api/placeholder/600/600'
        )
        db.session.add(product)

    admin = User(username='admin', email='admin@example.com', role='admin')
    admin.set_password('admin123')
    db.session.add(admin)

    db.session.commit()
    print(f"Seeded {NUM_PRODUCTS} products and admin user")

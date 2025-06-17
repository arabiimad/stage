import os
import sys
import random
from datetime import datetime
import re

# Adjust sys.path to allow imports from the 'src' directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

try:
    from main import app # Import app for context
    from models import db
    from models.user import User
    from models.product import Product
    from models.article import Article
    from models.casestudy import CaseStudy
except ImportError as e:
    print(f"Error importing modules: {e}")
    print("Ensure your PYTHONPATH is set correctly or run this script from the project root if needed.")
    sys.exit(1)

def slugify(text):
    """Generate a slug from text."""
    text = re.sub(r'[^\w\s-]', '', text).strip().lower()
    text = re.sub(r'[-\s]+', '-', text)
    return text

def seed_all():
    """Seeds the database with initial data."""
    with app.app_context():
        print("Dropping all existing tables...")
        db.drop_all()
        print("Creating all tables...")
        db.create_all()
        print("Tables created successfully.")

        # 1. Seed Admin User
        print("Seeding admin user...")
        admin_email = 'admin@dentaltech.pro'
        admin_username = 'admin' # Ensure username is consistent
        admin_password = 'admin123' # Updated password to all lowercase as per current subtask
        admin_role = 'admin'

        admin_user = User.query.filter_by(email=admin_email).first()
        if not admin_user:
            admin_user = User(
                username=admin_username,
                email=admin_email,
                role=admin_role
            )
            admin_user.set_password(admin_password) # Uses werkzeug via set_password
            db.session.add(admin_user)
            print(f"Admin user '{admin_user.email}' created with new password.")
        else:
            admin_user.username = admin_username # Ensure username is also consistent
            admin_user.set_password(admin_password) # Update password
            admin_user.role = admin_role # Ensure role is admin
            print(f"Admin user '{admin_user.email}' updated with new password and role '{admin_user.role}'.")

        # print(f"Admin user '{admin_user.username}' (role: {admin_user.role}) configured.") # Redundant with above

        # 2. Seed Products
        print("Seeding products...")
        product_categories = ['equipments', 'consumables', 'cadcam', 'implantology', 'orthodontics']
        product_data = [
            {"name": "Unit Dentaire X5000", "category": "equipments", "price_range": (15000, 20000), "stock": (5, 20)},
            {"name": "Autoclave Classe B 18L", "category": "equipments", "price_range": (3000, 5000), "stock": (10, 30)},
            {"name": "Scanner Intraoral ProScan 3", "category": "cadcam", "price_range": (8000, 12000), "stock": (3, 10)},
            {"name": "Compresseur Dentaire Silencieux 50L", "category": "equipments", "price_range": (1000, 2500), "stock": (8, 15)},
            {"name": "Lampe à Photopolymériser LED ProCure", "category": "equipments", "price_range": (200, 500), "stock": (20, 50)},
            {"name": "Kit d'Implants Dentaires TitanGrade5", "category": "implantology", "price_range": (500, 1500), "stock": (10, 40)},
            {"name": "Resine Composite Universelle OptiFill", "category": "consumables", "price_range": (50, 150), "stock": (50, 200)},
            {"name": "Fraises Dentaires Carbure de Tungstène (Kit)", "category": "consumables", "price_range": (80, 200), "stock": (30, 100)},
            {"name": "Logiciel de Planification CAD/CAM DentalPlan Pro", "category": "cadcam", "price_range": (1000, 3000), "stock": (1, 5)},
            {"name": "Imprimante 3D Résine DentalPrint 4K", "category": "cadcam", "price_range": (2500, 4500), "stock": (2, 8)},
            {"name": "Système de Radiographie Panoramique DigiPan X", "category": "equipments", "price_range": (10000, 18000), "stock": (1, 5)},
            {"name": "Moteur d'Endodontie EndoMaster", "category": "equipments", "price_range": (800, 1600), "stock": (4, 12)},
            {"name": "Kit de Blanchiment Dentaire ProWhite", "category": "consumables", "price_range": (100, 300), "stock": (15, 35)},
            {"name": "Brackets Orthodontiques Auto-ligaturants (Set)", "category": "orthodontics", "price_range": (200, 600), "stock": (10, 25)},
            {"name": "Fils Orthodontiques NiTi (Assortiment)", "category": "orthodontics", "price_range": (50, 120), "stock": (20, 60)},
            {"name": "Ciments de Scellement Dentaire (Kit)", "category": "consumables", "price_range": (70, 180), "stock": (25, 70)},
            {"name": "Localisateur d'Apex ApexFinder Pro", "category": "equipments", "price_range": (300, 700), "stock": (5, 15)},
            {"name": "Digue Dentaire (Rouleau)", "category": "consumables", "price_range": (20, 50), "stock": (50, 150)},
            {"name": "Gants d'Examen Nitrile (Boîte de 100)", "category": "consumables", "price_range": (10, 30), "stock": (100, 300)},
            {"name": "Masques Chirurgicaux (Boîte de 50)", "category": "consumables", "price_range": (5, 20), "stock": (100, 250)},
        ]

        for i, p_data in enumerate(product_data):
            price = round(random.uniform(p_data["price_range"][0], p_data["price_range"][1]), 2)
            original_price = round(price * random.uniform(1.1, 1.3), 2) if random.choice([True, False]) else None
            stock = random.randint(p_data["stock"][0], p_data["stock"][1])

            product = Product(
                name=p_data["name"],
                description=f"Description détaillée pour {p_data['name']}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                short_description=f"Courte description pour {p_data['name']}.",
                category=p_data["category"],
                price=price,
                original_price=original_price,
                stock_quantity=stock,
                image_url=f"https://picsum.photos/seed/{slugify(p_data['name'])}/300/300",
                badge="Nouveau" if i % 5 == 0 else ("Promotion" if original_price else None),
                specifications={"Voltage": "220V", "Poids": f"{random.randint(1,200)}kg"} if p_data["category"] == "equipments" else {"Matériau": "Titane Grade 5"},
                features=["Écran tactile", "Lampe LED intégrée", "Connectivité Wifi"] if p_data["category"] == "equipments" else ["Usage unique", "Stérile"]
            )
            db.session.add(product)
        print(f"{len(product_data)} products prepared.")

        # 3. Seed Articles
        print("Seeding articles...")
        article_titles = [
            "Les dernières innovations en implantologie dentaire",
            "Guide complet pour choisir votre équipement CAD/CAM",
            "Optimisation du flux de travail numérique au cabinet dentaire",
            "Maintenance préventive de vos équipements : Guide pratique",
            "L'importance de l'ergonomie pour les professionnels dentaires"
        ]
        article_authors = ["Dr. Alain Dupont", "Dr. Sophie Dubois", "Prof. Jean Martin", "Dr. Claire Petit"]
        article_categories = ["Technologie", "Conseils Cliniques", "Gestion de Cabinet", "Innovation"]

        for i, title in enumerate(article_titles):
            article_slug = slugify(title)
            article = Article(
                title=title,
                slug=article_slug,
                content=f"Contenu de l'article '{title}'. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Section {i+1}.",
                author=random.choice(article_authors),
                image_url=f"https://picsum.photos/seed/{article_slug}/400/250",
                category=random.choice(article_categories)
            )
            db.session.add(article)
        print(f"{len(article_titles)} articles prepared.")

        # 4. Seed Case Studies
        print("Seeding case studies...")
        case_study_data = [
            {
                "title": "Transformation Numérique du Cabinet Dr. Eva Martin avec DentalTech Pro",
                "summary": "Découvrez comment le Dr. Eva Martin a modernisé son cabinet grâce aux solutions CAD/CAM et de gestion de DentalTech Pro.",
                "challenge": "Le cabinet du Dr. Martin faisait face à des processus manuels lents, une gestion de patient inefficace et une incapacité à offrir des traitements modernes comme les restaurations en un jour.",
                "solution": "DentalTech Pro a fourni un scanner intraoral, une unité d'usinage et un logiciel de gestion de cabinet intégré. Une formation complète a été dispensée à toute l'équipe.",
                "results": "Réduction de 50% du temps de traitement pour les couronnes, augmentation de 30% de la satisfaction patient, et retour sur investissement en 18 mois."
            },
            {
                "title": "Optimisation des Protocoles d'Implantologie au Centre Dentaire Horizon",
                "summary": "Le Centre Dentaire Horizon a amélioré la précision et l'efficacité de ses chirurgies implantaires en adoptant les guides chirurgicaux et les implants de DentalTech Pro.",
                "challenge": "Le centre cherchait à réduire les complications post-opératoires et à améliorer la prévisibilité des résultats implantaires, tout en optimisant le temps passé au fauteuil.",
                "solution": "Utilisation de guides chirurgicaux imprimés en 3D basés sur la planification numérique, combinée à des implants DentalTech Pro reconnus pour leur ostéointégration rapide.",
                "results": "Diminution de 90% des ajustements nécessaires post-chirurgie, augmentation significative du taux de succès des implants, et amélioration de la confiance des praticiens."
            }
        ]

        for cs_data in case_study_data:
            cs_slug = slugify(cs_data["title"])
            case_study = CaseStudy(
                title=cs_data["title"],
                slug=cs_slug,
                summary=cs_data["summary"],
                challenge=cs_data["challenge"],
                solution=cs_data["solution"],
                results=cs_data["results"],
                image_url=f"https://picsum.photos/seed/{cs_slug}/400/200"
            )
            db.session.add(case_study)
        print(f"{len(case_study_data)} case studies prepared.")

        # Commit all changes to the database
        try:
            db.session.commit()
            print("All data successfully seeded to the database!")
        except Exception as e:
            db.session.rollback()
            print(f"Error committing to database: {e}")

if __name__ == '__main__':
    seed_all()

from src.models.product import Product, ProductReview, db

def seed_products():
    """Seed the database with sample dental products"""
    
    products_data = [
        {
            'name': 'Unit dentaire premium X1',
            'description': '''
                <h3>Description complète</h3>
                <p>L'Unit dentaire premium X1 représente le summum de la technologie dentaire moderne. Conçu pour les praticiens exigeants, cet équipement combine performance, ergonomie et esthétique dans un design épuré.</p>
                
                <h4>Caractéristiques principales :</h4>
                <ul>
                    <li>Éclairage LED haute performance avec température de couleur ajustable</li>
                    <li>Système de stérilisation automatique intégré</li>
                    <li>Interface tactile intuitive de 12 pouces</li>
                    <li>Moteurs électriques silencieux et précis</li>
                    <li>Système d'aspiration haute performance</li>
                </ul>
            ''',
            'short_description': 'Unit dentaire haut de gamme avec technologie LED intégrée et système de stérilisation automatique.',
            'category': 'equipments',
            'price': 15999.0,
            'original_price': 17999.0,
            'rating': 4.8,
            'reviews_count': 24,
            'stock_quantity': 5,
            'badge': 'Promotion',
            'image_url': '/api/placeholder/600/600',
            'specifications': {
                'Dimensions': '180 x 165 x 200 cm',
                'Poids': '320 kg',
                'Alimentation': '230V / 50Hz',
                'Consommation': '2.5 kW',
                'Éclairage': 'LED 50,000 lux',
                'Garantie': '5 ans',
                'Certification': 'CE, ISO 13485',
                'Origine': 'Allemagne'
            },
            'features': [
                'Livraison et installation incluses',
                'Formation du personnel offerte',
                'Maintenance préventive 1 an',
                'Support technique 24/7',
                'Garantie pièces et main d\'œuvre'
            ]
        },
        {
            'name': 'Scanner intra-oral 3D',
            'description': '''
                <h3>Scanner haute précision</h3>
                <p>Scanner intra-oral de dernière génération pour empreintes numériques ultra-précises. Révolutionnez votre pratique avec cette technologie de pointe.</p>
                
                <h4>Avantages :</h4>
                <ul>
                    <li>Précision micrométrique</li>
                    <li>Rapidité d'acquisition</li>
                    <li>Confort patient optimal</li>
                    <li>Intégration CAD/CAM</li>
                </ul>
            ''',
            'short_description': 'Scanner haute précision pour empreintes numériques',
            'category': 'cadcam',
            'price': 8999.0,
            'rating': 4.9,
            'reviews_count': 18,
            'stock_quantity': 8,
            'badge': 'Nouveau',
            'image_url': '/api/placeholder/600/600',
            'specifications': {
                'Résolution': '20 microns',
                'Vitesse': '15 images/seconde',
                'Connectivité': 'USB 3.0, WiFi',
                'Poids': '250g',
                'Garantie': '3 ans'
            },
            'features': [
                'Formation incluse',
                'Logiciel professionnel',
                'Support technique',
                'Mises à jour gratuites'
            ]
        },
        {
            'name': 'Compresseur silencieux',
            'description': '''
                <h3>Compresseur ultra-silencieux</h3>
                <p>Compresseur d'air médical ultra-silencieux, idéal pour les cabinets dentaires modernes. Performance et discrétion garanties.</p>
            ''',
            'short_description': 'Compresseur ultra-silencieux pour cabinet dentaire',
            'category': 'equipments',
            'price': 2499.0,
            'rating': 4.7,
            'reviews_count': 32,
            'stock_quantity': 12,
            'image_url': '/api/placeholder/600/600',
            'specifications': {
                'Niveau sonore': '< 40 dB',
                'Débit': '120 L/min',
                'Pression': '8 bars',
                'Réservoir': '50L',
                'Garantie': '2 ans'
            },
            'features': [
                'Installation incluse',
                'Maintenance préventive',
                'Pièces détachées disponibles'
            ]
        },
        {
            'name': 'Kit d\'instruments chirurgicaux',
            'description': '''
                <h3>Set complet d'instruments</h3>
                <p>Kit professionnel d'instruments chirurgicaux en acier inoxydable de qualité médicale.</p>
            ''',
            'short_description': 'Set complet d\'instruments pour chirurgie dentaire',
            'category': 'consumables',
            'price': 299.0,
            'rating': 4.6,
            'reviews_count': 45,
            'stock_quantity': 25,
            'image_url': '/api/placeholder/600/600',
            'specifications': {
                'Matériau': 'Acier inoxydable 316L',
                'Nombre d\'instruments': '15',
                'Stérilisation': 'Autoclave compatible',
                'Garantie': '1 an'
            },
            'features': [
                'Qualité chirurgicale',
                'Étui de transport inclus',
                'Instruments marqués CE'
            ]
        },
        {
            'name': 'Lampe de polymérisation LED',
            'description': '''
                <h3>Lampe LED haute performance</h3>
                <p>Lampe de polymérisation LED dernière génération pour composite dentaire.</p>
            ''',
            'short_description': 'Lampe LED haute performance pour composite',
            'category': 'equipments',
            'price': 899.0,
            'rating': 4.8,
            'reviews_count': 28,
            'stock_quantity': 15,
            'image_url': '/api/placeholder/600/600',
            'specifications': {
                'Puissance': '1200 mW/cm²',
                'Longueur d\'onde': '420-480 nm',
                'Batterie': 'Lithium rechargeable',
                'Autonomie': '4 heures',
                'Garantie': '2 ans'
            },
            'features': [
                'Chargeur inclus',
                'Guides de lumière',
                'Minuteur intégré'
            ]
        },
        {
            'name': 'Gants nitrile premium (100pcs)',
            'description': '''
                <h3>Gants de protection</h3>
                <p>Gants nitrile sans poudre, haute résistance pour usage médical.</p>
            ''',
            'short_description': 'Gants nitrile sans poudre, haute résistance',
            'category': 'consumables',
            'price': 24.99,
            'rating': 4.5,
            'reviews_count': 156,
            'stock_quantity': 200,
            'image_url': '/api/placeholder/600/600',
            'specifications': {
                'Matériau': 'Nitrile 100%',
                'Épaisseur': '0.12 mm',
                'Longueur': '240 mm',
                'Norme': 'EN 455',
                'Sans latex': 'Oui'
            },
            'features': [
                'Sans poudre',
                'Hypoallergénique',
                'Résistant aux perforations'
            ]
        }
    ]
    
    # Create products
    for product_data in products_data:
        product = Product(**product_data)
        db.session.add(product)
    
    db.session.commit()
    
    # Add sample reviews
    reviews_data = [
        {
            'product_id': 1,
            'author_name': 'Dr. Sophie Martin',
            'rating': 5,
            'comment': 'Excellent équipement, très satisfaite de mon achat. La qualité est au rendez-vous et l\'installation s\'est parfaitement déroulée.'
        },
        {
            'product_id': 1,
            'author_name': 'Dr. Pierre Dubois',
            'rating': 5,
            'comment': 'Unit dentaire de très haute qualité. Mes patients apprécient le confort et moi la précision des instruments.'
        },
        {
            'product_id': 1,
            'author_name': 'Dr. Marie Lefevre',
            'rating': 4,
            'comment': 'Très bon produit, quelques réglages nécessaires au début mais le support technique est très réactif.'
        },
        {
            'product_id': 2,
            'author_name': 'Dr. Jean Moreau',
            'rating': 5,
            'comment': 'Scanner révolutionnaire ! La précision est impressionnante et mes patients adorent ne plus avoir d\'empreintes traditionnelles.'
        },
        {
            'product_id': 2,
            'author_name': 'Dr. Claire Rousseau',
            'rating': 5,
            'comment': 'Investissement rentabilisé en quelques mois. La qualité des empreintes numériques est exceptionnelle.'
        }
    ]
    
    for review_data in reviews_data:
        review = ProductReview(**review_data)
        db.session.add(review)
    
    db.session.commit()
    print("Sample products and reviews have been seeded successfully!")


# Documentation technique - DentalTech Pro

## Architecture du système

### Vue d'ensemble
DentalTech Pro est une application web moderne construite avec une architecture découplée:
- **Frontend:** Single Page Application (SPA) en React
- **Backend:** API REST en Flask
- **Base de données:** SQLite (développement) / PostgreSQL (production)
- **Déploiement:** Containerisé avec Docker

### Diagramme d'architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   React + Vite  │◄──►│   Flask + API   │◄──►│   SQLite/PG     │
│   Port 5173     │    │   Port 5000     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend - React Application

### Structure des composants
```
src/
├── components/           # Composants React
│   ├── Header.jsx       # Navigation principale
│   ├── Hero.jsx         # Section hero
│   ├── About.jsx        # Section à propos
│   ├── Achievements.jsx # Réalisations
│   ├── Contact.jsx      # Formulaire contact
│   ├── Footer.jsx       # Pied de page
│   ├── Shop.jsx         # Catalogue produits
│   ├── ProductDetail.jsx# Page produit
│   └── CartSidebar.jsx  # Panier latéral
├── context/             # Gestion d'état
│   └── CartContext.jsx  # Context du panier
├── utils/               # Utilitaires
│   ├── seo.js          # Fonctions SEO
│   ├── accessibility.jsx# Composants accessibilité
│   ├── performance.jsx  # Optimisations performance
│   └── imageOptimization.jsx # Gestion images
└── assets/              # Ressources statiques
    ├── images/          # Images du site
    └── icons/           # Icônes
```

### Gestion d'état
Le state management utilise React Context API:

```javascript
// CartContext.jsx
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const addToCart = (product) => {
    // Logique d'ajout au panier
  };
  
  const removeFromCart = (productId) => {
    // Logique de suppression
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};
```

### Routing
Navigation gérée par React Router:

```javascript
// App.jsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/boutique" element={<Shop />} />
  <Route path="/product/:id" element={<ProductDetail />} />
</Routes>
```

### Performance optimizations

#### Code Splitting
```javascript
// Lazy loading des composants
const Shop = lazy(() => import('./components/Shop'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));

// Utilisation avec Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Shop />
</Suspense>
```

#### Image Optimization
```javascript
// LazyImage component
const LazyImage = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={className}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
    </div>
  );
};
```

## Backend - Flask API

### Structure de l'API
```
src/
├── main.py              # Point d'entrée Flask
├── models/              # Modèles de données
│   ├── product.py       # Modèle Product
│   └── review.py        # Modèle Review
├── routes/              # Routes API
│   ├── products.py      # Endpoints produits
│   ├── cart.py          # Endpoints panier
│   └── orders.py        # Endpoints commandes
└── utils/               # Utilitaires
    └── seed_data.py     # Données de test
```

### Modèles de données

#### Product Model
```python
# models/product.py
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100))
    stock = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)
    image_url = db.Column(db.String(500))
    features = db.Column(db.JSON)
    specifications = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    reviews = db.relationship('ProductReview', backref='product', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'stock': self.stock,
            'rating': self.rating,
            'image_url': self.image_url,
            'features': self.features,
            'specifications': self.specifications,
            'reviews_count': len(self.reviews)
        }
```

### Endpoints API

#### Products API
```python
# routes/products.py
@products_bp.route('/api/products', methods=['GET'])
def get_products():
    # Paramètres de requête
    category = request.args.get('category')
    search = request.args.get('search')
    sort_by = request.args.get('sort_by', 'name')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 12))
    
    # Construction de la requête
    query = Product.query
    
    if category and category != 'all':
        query = query.filter(Product.category == category)
    
    if search:
        query = query.filter(Product.name.contains(search))
    
    # Tri
    if sort_by == 'price_asc':
        query = query.order_by(Product.price.asc())
    elif sort_by == 'price_desc':
        query = query.order_by(Product.price.desc())
    elif sort_by == 'rating':
        query = query.order_by(Product.rating.desc())
    else:
        query = query.order_by(Product.name.asc())
    
    # Pagination
    products = query.paginate(
        page=page, 
        per_page=per_page, 
        error_out=False
    )
    
    return jsonify({
        'products': [p.to_dict() for p in products.items],
        'total': products.total,
        'pages': products.pages,
        'current_page': page
    })

@products_bp.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())
```

#### Cart API
```python
# routes/cart.py
@cart_bp.route('/api/cart', methods=['GET'])
def get_cart():
    cart_items = session.get('cart', [])
    total = sum(item['price'] * item['quantity'] for item in cart_items)
    
    return jsonify({
        'items': cart_items,
        'total': total,
        'count': len(cart_items)
    })

@cart_bp.route('/api/cart', methods=['POST'])
def add_to_cart():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    product = Product.query.get_or_404(product_id)
    
    if 'cart' not in session:
        session['cart'] = []
    
    # Vérifier si le produit est déjà dans le panier
    for item in session['cart']:
        if item['product_id'] == product_id:
            item['quantity'] += quantity
            break
    else:
        session['cart'].append({
            'product_id': product_id,
            'name': product.name,
            'price': product.price,
            'quantity': quantity,
            'image_url': product.image_url
        })
    
    session.modified = True
    return jsonify({'message': 'Produit ajouté au panier'})
```

### Configuration et sécurité

#### Configuration Flask
```python
# main.py
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///dental.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# CORS configuration
CORS(app, origins=[
    'http://localhost:5173',  # Développement
    'https://dentaltech-pro.vercel.app'  # Production
])

# Session configuration
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
```

#### Validation des données
```python
from marshmallow import Schema, fields, validate

class ProductSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    description = fields.Str(validate=validate.Length(max=1000))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    category = fields.Str(validate=validate.OneOf(['equipment', 'consumables', 'cadcam']))
    stock = fields.Int(validate=validate.Range(min=0))

# Utilisation
@products_bp.route('/api/products', methods=['POST'])
def create_product():
    schema = ProductSchema()
    try:
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400
    
    # Création du produit...
```

## Base de données

### Schéma de base de données
```sql
-- Table products
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price FLOAT NOT NULL,
    category VARCHAR(100),
    stock INTEGER DEFAULT 0,
    rating FLOAT DEFAULT 0.0,
    image_url VARCHAR(500),
    features JSON,
    specifications JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table product_reviews
CREATE TABLE product_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products (id)
);

-- Index pour les performances
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_reviews_product ON product_reviews(product_id);
```

### Migrations
```python
# migrations/001_initial.py
from flask_migrate import Migrate

def upgrade():
    # Création des tables
    op.create_table('products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('price', sa.Float(), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('stock', sa.Integer(), nullable=True),
        sa.Column('rating', sa.Float(), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('features', sa.JSON(), nullable=True),
        sa.Column('specifications', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('products')
```

## Optimisations et performance

### Frontend optimizations

#### Bundle splitting
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
});
```

#### Service Worker
```javascript
// public/sw.js
const CACHE_NAME = 'dentaltech-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/images/hero-dental-tool-3d.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

### Backend optimizations

#### Caching
```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@products_bp.route('/api/products')
@cache.cached(timeout=300)  # Cache 5 minutes
def get_products():
    # Logique de récupération des produits
    pass
```

#### Database optimization
```python
# Requêtes optimisées avec jointures
def get_products_with_reviews():
    return db.session.query(Product)\
        .options(joinedload(Product.reviews))\
        .all()

# Pagination efficace
def get_paginated_products(page, per_page):
    return Product.query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
```

## Sécurité

### Protection CSRF
```python
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect(app)

# Exemption pour les API
@csrf.exempt
@api_bp.route('/api/products', methods=['POST'])
def create_product():
    pass
```

### Validation et sanitization
```python
import bleach
from markupsafe import escape

def sanitize_input(text):
    # Nettoyer le HTML
    clean_text = bleach.clean(text, tags=[], strip=True)
    # Échapper les caractères spéciaux
    return escape(clean_text)

@products_bp.route('/api/reviews', methods=['POST'])
def create_review():
    data = request.get_json()
    comment = sanitize_input(data.get('comment', ''))
    # Traitement...
```

### Rate limiting
```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@products_bp.route('/api/products')
@limiter.limit("10 per minute")
def get_products():
    pass
```

## Tests

### Tests Frontend (Jest + React Testing Library)
```javascript
// __tests__/components/Header.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';

test('renders navigation links', () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  );
  
  expect(screen.getByText('Accueil')).toBeInTheDocument();
  expect(screen.getByText('Boutique')).toBeInTheDocument();
});
```

### Tests Backend (pytest)
```python
# tests/test_products.py
import pytest
from app import create_app, db
from models.product import Product

@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
            yield client
            db.drop_all()

def test_get_products(client):
    # Créer un produit de test
    product = Product(name='Test Product', price=100.0)
    db.session.add(product)
    db.session.commit()
    
    # Tester l'endpoint
    response = client.get('/api/products')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['products']) == 1
    assert data['products'][0]['name'] == 'Test Product'
```

## Monitoring et logging

### Logging configuration
```python
import logging
from logging.handlers import RotatingFileHandler

if not app.debug:
    file_handler = RotatingFileHandler('logs/dentaltech.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.setLevel(logging.INFO)
    app.logger.info('DentalTech startup')
```

### Performance monitoring
```javascript
// utils/analytics.js
export const trackPageView = (page) => {
  if (typeof gtag !== 'undefined') {
    gtag('config', 'GA_MEASUREMENT_ID', {
      page_title: document.title,
      page_location: window.location.href
    });
  }
};

export const trackEvent = (action, category, label) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
};
```

## Déploiement

### Docker configuration
```dockerfile
# Dockerfile.frontend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]

# Dockerfile.backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "src/main.py"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build:
      context: ./dental-website
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    depends_on:
      - backend
  
  backend:
    build:
      context: ./dental-api
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=postgresql://user:pass@db:5432/dentaltech
    depends_on:
      - db
  
  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=dentaltech
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Cette documentation technique fournit tous les détails nécessaires pour comprendre, maintenir et faire évoluer l'application DentalTech Pro.


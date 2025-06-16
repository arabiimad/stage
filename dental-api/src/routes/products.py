from flask import Blueprint, request, jsonify
from src.models.product import Product, ProductReview, db
from sqlalchemy import or_

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    """Get all products with optional filtering and pagination"""
    try:
        # Get query parameters
        category = request.args.get('category', 'all')
        search = request.args.get('search', '')
        sort_by = request.args.get('sort', 'name')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 20))
        
        # Build query
        query = Product.query.filter(Product.is_active == True)
        
        # Apply category filter
        if category != 'all':
            query = query.filter(Product.category == category)
        
        # Apply search filter
        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Product.name.ilike(search_term),
                    Product.description.ilike(search_term),
                    Product.short_description.ilike(search_term)
                )
            )
        
        # Apply sorting
        if sort_by == 'price-asc':
            query = query.order_by(Product.price.asc())
        elif sort_by == 'price-desc':
            query = query.order_by(Product.price.desc())
        elif sort_by == 'rating':
            query = query.order_by(Product.rating.desc())
        else:  # default to name
            query = query.order_by(Product.name.asc())
        
        # Paginate
        products = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'products': [product.to_dict() for product in products.items],
            'total': products.total,
            'pages': products.pages,
            'current_page': page,
            'per_page': per_page,
            'has_next': products.has_next,
            'has_prev': products.has_prev
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a single product by ID"""
    try:
        product = Product.query.get_or_404(product_id)
        
        # Get product reviews
        reviews = ProductReview.query.filter_by(product_id=product_id).order_by(
            ProductReview.created_at.desc()
        ).all()
        
        product_data = product.to_dict()
        product_data['reviews'] = [review.to_dict() for review in reviews]
        
        return jsonify(product_data)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/categories', methods=['GET'])
def get_categories():
    """Get all product categories with counts"""
    try:
        categories = db.session.query(
            Product.category,
            db.func.count(Product.id).label('count')
        ).filter(Product.is_active == True).group_by(Product.category).all()
        
        # Calculate total count
        total_count = Product.query.filter(Product.is_active == True).count()
        
        result = [{'id': 'all', 'name': 'Tous les produits', 'count': total_count}]
        
        category_names = {
            'equipments': 'Équipements',
            'consumables': 'Consommables',
            'cadcam': 'CAD/CAM',
            'implantology': 'Implantologie',
            'orthodontics': 'Orthodontie'
        }
        
        for category, count in categories:
            result.append({
                'id': category,
                'name': category_names.get(category, category.title()),
                'count': count
            })
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@products_bp.route('/products/<int:product_id>/reviews', methods=['POST'])
def add_review(product_id):
    """Add a review for a product"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['author_name', 'rating', 'comment']):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Validate rating
        if not isinstance(data['rating'], int) or data['rating'] < 1 or data['rating'] > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
        
        # Check if product exists
        product = Product.query.get_or_404(product_id)
        
        # Create review
        review = ProductReview(
            product_id=product_id,
            author_name=data['author_name'],
            rating=data['rating'],
            comment=data['comment']
        )
        
        db.session.add(review)
        
        # Update product rating
        reviews = ProductReview.query.filter_by(product_id=product_id).all()
        if reviews:
            avg_rating = sum(r.rating for r in reviews) / len(reviews)
            product.rating = round(avg_rating, 1)
            product.reviews_count = len(reviews)
        
        db.session.commit()
        
        return jsonify(review.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


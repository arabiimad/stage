from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt # get_jwt might not be needed directly in routes if decorator handles it
from src.models import db
from src.models.product import Product
from src.utils.decorators import admin_required # Import the new decorator
from sqlalchemy import desc, asc # For sorting

products_admin_bp = Blueprint('products_admin', __name__)

# GET /api/admin/products
@products_admin_bp.route('', methods=['GET'])
@admin_required
def get_admin_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    sort_by = request.args.get('sort_by', 'id') # Default sort by id
    sort_order = request.args.get('sort_order', 'asc') # Default sort order asc

    # Validate sort_by to prevent arbitrary column sorting
    allowed_sort_fields = ['id', 'name', 'price', 'stock_quantity', 'category', 'is_active', 'created_at']
    if sort_by not in allowed_sort_fields:
        sort_by = 'id'

    query = Product.query

    # Sorting logic
    if sort_order.lower() == 'desc':
        query = query.order_by(desc(getattr(Product, sort_by)))
    else:
        query = query.order_by(asc(getattr(Product, sort_by)))

    paginated_products = query.paginate(page=page, per_page=per_page, error_out=False)

    products_data = [product.to_dict() for product in paginated_products.items]

    return jsonify({
        "products": products_data,
        "total_pages": paginated_products.pages,
        "current_page": paginated_products.page,
        "total_products": paginated_products.total
    }), 200

# POST /api/admin/products
@products_admin_bp.route('', methods=['POST'])
@admin_required
def create_product():
    data = request.get_json()
    if not data:
        return jsonify({"msg": "Request body is missing"}), 400

    required_fields = ['name', 'price', 'category', 'stock_quantity']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({"msg": f"Missing fields: {', '.join(missing_fields)}"}), 400

    try:
        new_product = Product(
            name=data['name'],
            description=data.get('description', ''),
            short_description=data.get('short_description', ''),
            category=data['category'], # Consider validating category against a predefined list or table
            price=float(data['price']),
            original_price=float(data.get('original_price')) if data.get('original_price') else None,
            stock_quantity=int(data['stock_quantity']),
            is_active=data.get('is_active', True), # Default to active
            badge=data.get('badge'),
            image_url=data.get('image_url'),
            specifications=data.get('specifications', {}), # Ensure this is JSON or dict
            features=data.get('features', []) # Ensure this is JSON or list
        )
        db.session.add(new_product)
        db.session.commit()
        return jsonify(new_product.to_dict()), 201
    except ValueError as ve: # Catch errors from float/int conversion
        return jsonify({"msg": f"Invalid data type: {str(ve)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to create product", "error": str(e)}), 500


# PUT /api/admin/products/<int:product_id>
@products_admin_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    if not data:
        return jsonify({"msg": "Request body is missing"}), 400

    try:
        for field, value in data.items():
            if hasattr(product, field):
                if field == 'price' or field == 'original_price':
                    setattr(product, field, float(value) if value is not None else None)
                elif field == 'stock_quantity':
                    setattr(product, field, int(value) if value is not None else 0)
                elif field == 'is_active' and isinstance(value, bool):
                     setattr(product, field, value)
                elif field in ['specifications', 'features'] and not isinstance(value, (dict, list)) and value is not None:
                    # Basic check, more robust validation might be needed for JSON fields
                    return jsonify({"msg": f"Field '{field}' must be a valid JSON object/array or null."}), 400
                elif field not in ['id', 'created_at', 'updated_at']: # Prevent updating immutable fields
                    setattr(product, field, value)

        db.session.commit()
        return jsonify(product.to_dict()), 200
    except ValueError as ve:
        return jsonify({"msg": f"Invalid data type: {str(ve)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to update product", "error": str(e)}), 500

# DELETE /api/admin/products/<int:product_id> (Soft Delete)
@products_admin_bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    try:
        product.is_active = False # Soft delete
        db.session.commit()
        return jsonify({"msg": f"Product '{product.name}' marked as inactive."}), 200 # Or 204 No Content
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to deactivate product", "error": str(e)}), 500

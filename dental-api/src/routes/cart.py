from flask import Blueprint, request, jsonify, session
from src.models.product import Product, db
import uuid

cart_bp = Blueprint('cart', __name__)

def get_session_id():
    """Get or create a session ID for cart management"""
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
    return session['session_id']

@cart_bp.route('/cart', methods=['GET'])
def get_cart():
    """Get current cart contents"""
    try:
        session_id = get_session_id()
        
        # For simplicity, we'll store cart in session
        # In production, you might want to use a database table
        cart_items = session.get('cart_items', [])
        
        # Enrich cart items with current product data
        enriched_items = []
        total_price = 0
        
        for item in cart_items:
            product = Product.query.get(item['product_id'])
            if product and product.is_active:
                enriched_item = {
                    'id': item['product_id'],
                    'name': product.name,
                    'price': product.price,
                    'image_url': product.image_url,
                    'quantity': item['quantity'],
                    'subtotal': product.price * item['quantity']
                }
                enriched_items.append(enriched_item)
                total_price += enriched_item['subtotal']
        
        return jsonify({
            'items': enriched_items,
            'total_items': sum(item['quantity'] for item in enriched_items),
            'total_price': total_price,
            'session_id': session_id
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/cart/add', methods=['POST'])
def add_to_cart():
    """Add item to cart"""
    try:
        data = request.get_json()
        
        if not data or 'product_id' not in data:
            return jsonify({'error': 'Product ID is required'}), 400
        
        product_id = data['product_id']
        quantity = data.get('quantity', 1)
        
        # Validate product exists and is active
        product = Product.query.get_or_404(product_id)
        if not product.is_active:
            return jsonify({'error': 'Product is not available'}), 400
        
        # Check stock
        if product.stock_quantity < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400
        
        session_id = get_session_id()
        cart_items = session.get('cart_items', [])
        
        # Check if item already exists in cart
        existing_item = next((item for item in cart_items if item['product_id'] == product_id), None)
        
        if existing_item:
            # Update quantity
            new_quantity = existing_item['quantity'] + quantity
            if product.stock_quantity < new_quantity:
                return jsonify({'error': 'Insufficient stock'}), 400
            existing_item['quantity'] = new_quantity
        else:
            # Add new item
            cart_items.append({
                'product_id': product_id,
                'quantity': quantity
            })
        
        session['cart_items'] = cart_items
        
        return jsonify({'message': 'Item added to cart successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/cart/update', methods=['PUT'])
def update_cart_item():
    """Update cart item quantity"""
    try:
        data = request.get_json()
        
        if not data or 'product_id' not in data or 'quantity' not in data:
            return jsonify({'error': 'Product ID and quantity are required'}), 400
        
        product_id = data['product_id']
        quantity = data['quantity']
        
        if quantity < 0:
            return jsonify({'error': 'Quantity cannot be negative'}), 400
        
        # Validate product exists
        product = Product.query.get_or_404(product_id)
        
        # Check stock
        if quantity > 0 and product.stock_quantity < quantity:
            return jsonify({'error': 'Insufficient stock'}), 400
        
        cart_items = session.get('cart_items', [])
        
        if quantity == 0:
            # Remove item from cart
            cart_items = [item for item in cart_items if item['product_id'] != product_id]
        else:
            # Update quantity
            existing_item = next((item for item in cart_items if item['product_id'] == product_id), None)
            if existing_item:
                existing_item['quantity'] = quantity
            else:
                return jsonify({'error': 'Item not found in cart'}), 404
        
        session['cart_items'] = cart_items
        
        return jsonify({'message': 'Cart updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/cart/remove/<int:product_id>', methods=['DELETE'])
def remove_from_cart(product_id):
    """Remove item from cart"""
    try:
        cart_items = session.get('cart_items', [])
        cart_items = [item for item in cart_items if item['product_id'] != product_id]
        session['cart_items'] = cart_items
        
        return jsonify({'message': 'Item removed from cart successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@cart_bp.route('/cart/clear', methods=['DELETE'])
def clear_cart():
    """Clear all items from cart"""
    try:
        session['cart_items'] = []
        return jsonify({'message': 'Cart cleared successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


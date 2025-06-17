from flask import Blueprint, request, jsonify, session
from src.models.product import Product, db
from datetime import datetime
import uuid

orders_bp = Blueprint('orders', __name__)

# Simple in-memory order storage for demo purposes
# In production, you would use a proper database table
orders_storage = {}

@orders_bp.route('/checkout/whatsapp', methods=['POST'])
def checkout_whatsapp():
    try:
        data = request.get_json()
        if not data or 'customer' not in data:
            return jsonify({'error': 'customer info required'}), 400

        cart_items = session.get('cart_items', [])
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400

        order_items = []
        total = 0
        for item in cart_items:
            product = Product.query.get(item['product_id'])
            if not product:
                return jsonify({'error': 'Product not found'}), 404
            subtotal = product.price * item['quantity']
            order_items.append({'product_id': product.id, 'name': product.name, 'qty': item['quantity'], 'subtotal': subtotal})
            total += subtotal

        order_id = str(uuid.uuid4())
        order = {
            'id': order_id,
            'items': order_items,
            'total_amount': total,
            'status': 'pending',
            'customer': data['customer'],
            'created_at': datetime.utcnow().isoformat()
        }
        orders_storage[order_id] = order
        session['cart_items'] = []

        # Build WhatsApp message
        message_lines = [f"{i['name']} x{i['qty']} = {i['subtotal']} MAD" for i in order_items]
        message_lines.append(f"Total: {total} MAD")
        if 'name' in data['customer']:
            message_lines.append(f"Client: {data['customer']['name']}")
        msg = '\n'.join(message_lines)
        return jsonify({'order_id': order_id, 'message': msg}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/orders', methods=['POST'])
def create_order():
    """Create a new order from cart contents"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['customer_info', 'shipping_address']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Get cart items
        cart_items = session.get('cart_items', [])
        if not cart_items:
            return jsonify({'error': 'Cart is empty'}), 400
        
        # Validate cart items and calculate total
        order_items = []
        total_amount = 0
        
        for item in cart_items:
            product = Product.query.get(item['product_id'])
            if not product or not product.is_active:
                return jsonify({'error': f'Product {item["product_id"]} is not available'}), 400
            
            if product.stock_quantity < item['quantity']:
                return jsonify({'error': f'Insufficient stock for {product.name}'}), 400
            
            item_total = product.price * item['quantity']
            order_items.append({
                'product_id': product.id,
                'product_name': product.name,
                'price': product.price,
                'quantity': item['quantity'],
                'subtotal': item_total
            })
            total_amount += item_total
        
        # Generate order ID
        order_id = str(uuid.uuid4())
        
        # Create order
        order = {
            'id': order_id,
            'customer_info': data['customer_info'],
            'shipping_address': data['shipping_address'],
            'billing_address': data.get('billing_address', data['shipping_address']),
            'items': order_items,
            'total_amount': total_amount,
            'status': 'pending',
            'created_at': datetime.utcnow().isoformat(),
            'notes': data.get('notes', '')
        }
        
        # Store order (in production, save to database)
        orders_storage[order_id] = order
        
        # Update product stock (in production, this should be in a transaction)
        for item in cart_items:
            product = Product.query.get(item['product_id'])
            product.stock_quantity -= item['quantity']
        
        db.session.commit()
        
        # Clear cart
        session['cart_items'] = []
        
        return jsonify({
            'order_id': order_id,
            'message': 'Order created successfully',
            'order': order
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/orders/<order_id>', methods=['GET'])
def get_order(order_id):
    """Get order details by ID"""
    try:
        order = orders_storage.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        return jsonify(order)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/orders', methods=['GET'])
def get_orders():
    """Get all orders (for admin purposes)"""
    try:
        # In production, you would add authentication and authorization
        orders = list(orders_storage.values())
        orders.sort(key=lambda x: x['created_at'], reverse=True)
        
        return jsonify({
            'orders': orders,
            'total': len(orders)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/orders/<order_id>/status', methods=['PUT'])
def update_order_status(order_id):
    """Update order status"""
    try:
        data = request.get_json()
        
        if not data or 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        valid_statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
        if data['status'] not in valid_statuses:
            return jsonify({'error': 'Invalid status'}), 400
        
        order = orders_storage.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        order['status'] = data['status']
        order['updated_at'] = datetime.utcnow().isoformat()
        
        return jsonify({
            'message': 'Order status updated successfully',
            'order': order
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/contact', methods=['POST'])
def submit_contact_form():
    """Handle contact form submissions"""
    try:
        data = request.get_json()
        
        required_fields = ['name', 'email', 'message']
        if not data or not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # In production, you would save this to database and/or send email
        contact_submission = {
            'id': str(uuid.uuid4()),
            'name': data['name'],
            'email': data['email'],
            'phone': data.get('phone', ''),
            'company': data.get('company', ''),
            'message': data['message'],
            'submitted_at': datetime.utcnow().isoformat()
        }
        
        # For demo purposes, just return success
        return jsonify({
            'message': 'Contact form submitted successfully',
            'submission_id': contact_submission['id']
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


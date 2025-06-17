from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.models import db
from src.models.order import Order
from src.models.user import User # Optional, if fetching user details for the order
from datetime import datetime

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders/whatsapp_checkout', methods=['POST'])
@jwt_required(optional=True) # Allow anonymous or authenticated users
def whatsapp_checkout():
    """
    Creates a new order based on WhatsApp checkout data.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Request body cannot be empty'}), 400

        cart_items = data.get('cart_items')
        total_price = data.get('total_price')
        customer_name = data.get('customer_name')
        whatsapp_message = data.get('whatsapp_message') # The pre-formatted message

        required_fields = {
            'cart_items': cart_items,
            'total_price': total_price,
            'customer_name': customer_name,
            'whatsapp_message': whatsapp_message
        }

        missing_fields = [key for key, value in required_fields.items() if value is None]
        if missing_fields:
            return jsonify({'error': f'Missing required fields: {", ".join(missing_fields)}'}), 400

        if not isinstance(cart_items, list) or not cart_items:
            return jsonify({'error': 'cart_items must be a non-empty list'}), 400
        
        for item in cart_items:
            if not all(k in item for k in ['id', 'name', 'quantity', 'price']):
                 return jsonify({'error': 'Each cart item must include id, name, quantity, and price'}), 400

        if not isinstance(total_price, (int, float)) or total_price <= 0:
            return jsonify({'error': 'total_price must be a positive number'}), 400
        
        if not isinstance(customer_name, str) or not customer_name.strip():
            return jsonify({'error': 'customer_name must be a non-empty string'}), 400

        user_id = None
        current_user_identity = get_jwt_identity()
        if current_user_identity:
            user = User.query.filter_by(id=current_user_identity).first()
            if user:
                user_id = user.id
                # If user is logged in, their name can override/supplement the customer_name from form
                # customer_name = user.username or customer_name
            else:
                # This case should ideally not happen if JWT is valid and refers to an existing user
                return jsonify({'error': 'User from token not found'}), 404


        new_order = Order(
            user_id=user_id,
            customer_name=customer_name,
            items=cart_items, # Stored as JSON
            total_amount=float(total_price),
            status='En attente', # Default status
            whatsapp_message_preview=whatsapp_message
        )

        db.session.add(new_order)
        db.session.commit()

        return jsonify({
            'message': 'Order created successfully via WhatsApp checkout',
            'order_id': new_order.id,
            'order_details': new_order.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        # Log the exception e for debugging
        print(f"Error in whatsapp_checkout: {str(e)}")
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

# TODO: The following routes are from the original orders.py and used in-memory storage.
# They need to be refactored to use the Order model and database if they are to be kept.
# For now, they are commented out to avoid conflicts with the new db structure and focus on whatsapp_checkout.

# Simple in-memory order storage for demo purposes
# In production, you would use a proper database table
# orders_storage = {}

# @orders_bp.route('/orders', methods=['POST'])
# def create_order():
#     """Create a new order from cart contents"""
#     pass # Implementation removed

# @orders_bp.route('/orders/<order_id>', methods=['GET'])
# def get_order(order_id):
#     """Get order details by ID"""
#     pass # Implementation removed

# @orders_bp.route('/orders', methods=['GET'])
# def get_orders():
#     """Get all orders (for admin purposes)"""
#     pass # Implementation removed

# @orders_bp.route('/orders/<order_id>/status', methods=['PUT'])
# def update_order_status(order_id):
#     """Update order status"""
#     pass # Implementation removed

# @orders_bp.route('/contact', methods=['POST'])
# def submit_contact_form():
#    """Handle contact form submissions"""
#    pass # Implementation removed

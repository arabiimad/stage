from flask import Blueprint, request, jsonify, Response
from src.utils.decorators import admin_required
from src.models import db
from src.models.order import Order
from sqlalchemy import desc
import io
import csv
from datetime import datetime

orders_admin_bp = Blueprint('orders_admin', __name__)

# GET /api/admin/orders
@orders_admin_bp.route('/orders', methods=['GET'])
@admin_required
def get_admin_orders():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status_filter = request.args.get('status', None, type=str)

    query = Order.query

    if status_filter:
        query = query.filter(Order.status == status_filter)

    query = query.order_by(desc(Order.created_at))

    paginated_orders = query.paginate(page=page, per_page=per_page, error_out=False)

    orders_data = [order.to_dict() for order in paginated_orders.items]

    return jsonify({
        "orders": orders_data,
        "total_pages": paginated_orders.pages,
        "current_page": paginated_orders.page,
        "total_orders": paginated_orders.total
    }), 200

# PUT /api/admin/orders/<int:order_id>/status
@orders_admin_bp.route('/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.get_json()

    if not data or 'status' not in data:
        return jsonify({"msg": "Missing 'status' in request body"}), 400

    new_status = data['status']
    valid_statuses = ['En attente', 'Confirmée', 'Expédiée', 'Annulée', 'Livrée'] # Added 'Livrée'
    if new_status not in valid_statuses:
        return jsonify({"msg": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}), 400

    try:
        order.status = new_status
        order.updated_at = datetime.utcnow() # Manually update timestamp if not auto-updated by DB
        db.session.commit()
        return jsonify(order.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to update order status", "error": str(e)}), 500

# GET /api/admin/orders/export_csv
@orders_admin_bp.route('/orders/export_csv', methods=['GET'])
@admin_required
def export_orders_csv():
    try:
        orders = Order.query.order_by(desc(Order.created_at)).all()

        output = io.StringIO()
        writer = csv.writer(output)

        # CSV Header
        headers = [
            'ID', 'Customer Name', 'User ID', 'Status', 'Total Amount (MAD)',
            'Items', 'WhatsApp Message Preview', 'Created At', 'Updated At'
        ]
        writer.writerow(headers)

        for order in orders:
            items_list = []
            if isinstance(order.items, list): # Check if order.items is a list
                items_list = [
                    f"{item.get('name', 'N/A')} (Qty: {item.get('quantity', 0)}, Price: {item.get('price', 0)} MAD)"
                    for item in order.items
                ]
            elif isinstance(order.items, dict): # Handle if it's a single item dict (though less likely for 'items')
                 items_list = [f"{order.items.get('name', 'N/A')} (Qty: {order.items.get('quantity',0)}, Price: {order.items.get('price',0)} MAD)"]

            items_summary = "; ".join(items_list) if items_list else "No items listed"

            row = [
                order.id,
                order.customer_name,
                order.user_id if order.user_id else 'N/A',
                order.status,
                order.total_amount,
                items_summary,
                order.whatsapp_message_preview if order.whatsapp_message_preview else '',
                order.created_at.strftime('%Y-%m-%d %H:%M:%S') if order.created_at else '',
                order.updated_at.strftime('%Y-%m-%d %H:%M:%S') if order.updated_at else ''
            ]
            writer.writerow(row)

        output.seek(0)

        return Response(
            output,
            mimetype="text/csv",
            headers={"Content-Disposition": "attachment;filename=orders_export.csv"}
        )
    except Exception as e:
        # Log the error e
        return jsonify({"msg": "Failed to export orders", "error": str(e)}), 500

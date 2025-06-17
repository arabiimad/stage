import time
import json
from flask import Blueprint, Response, current_app, copy_current_request_context
from src.utils.decorators import admin_required # Assumes this works for SSE, might need adjustment
from src.models.product import Product # Assuming this is the correct path to your Product model
from src.models import db # To ensure SQLAlchemy sessions are handled correctly if needed within the generator

stock_alerts_sse_bp = Blueprint('stock_alerts_sse', __name__)

@stock_alerts_sse_bp.route('/stock_alerts')
@admin_required # This decorator will be tried first. If it fails with EventSource, further notes will be made.
def sse_stock_alerts():

    # @copy_current_request_context # May be needed if complex operations happen inside generate_stock_alerts
    def generate_stock_alerts():
        # It's generally better to handle DB sessions per request or task.
        # For a long-running SSE, how the session is managed is important.
        # A simple approach: query within the loop, relying on Flask's context if possible,
        # or create a new session scope per iteration if absolutely necessary (can be inefficient).
        # For this example, we'll query directly.

        # Send a connection confirmation message (optional)
        yield f"data: {json.dumps({'type': 'connection_ack', 'message': 'Connected to stock alerts.'})}\n\n"

        last_alerted_products = {} # To avoid sending same alert repeatedly if stock doesn't change

        try:
            while True:
                # current_app.logger.info("SSE: Checking for low stock products.") # For debugging

                # It's critical that database operations within this loop are efficient
                # and don't hold locks for too long or exhaust resources.
                # Using with db.session.no_autoflush: (if applicable) or specific session handling might be needed in complex scenarios.
                # For this example, assuming Product.query works within the app context preserved by Flask for the generator.

                # This query needs to be efficient. Consider if Product.query.with_session(db.session) is needed
                # or if the app context handles it. Flask generally provides an app context for the duration of the request,
                # which for SSE, is the lifetime of the connection.
                try:
                    # Explicitly use the app context for the database query
                    with current_app.app_context():
                        low_stock_products = Product.query.filter(Product.stock_quantity < 10, Product.is_active == True).all()
                except Exception as e:
                    # current_app.logger.error(f"SSE: DB query error: {str(e)}")
                    # Yield an error message to the client, or just log and continue/break
                    error_message = {"type": "error", "message": "Error querying database for stock levels."}
                    yield f"data: {json.dumps(error_message)}\n\n"
                    time.sleep(30) # Wait longer before retrying on DB error
                    continue


                current_low_stock_map = {p.id: {"id": p.id, "name": p.name, "stock_quantity": p.stock_quantity} for p in low_stock_products}

                alerts_to_send = []

                for product_id, product_data in current_low_stock_map.items():
                    if product_id not in last_alerted_products or \
                       last_alerted_products[product_id]['stock_quantity'] != product_data['stock_quantity']:
                        alerts_to_send.append(product_data)

                if alerts_to_send:
                    message_data = {"type": "low_stock", "products": alerts_to_send}
                    # current_app.logger.info(f"SSE: Sending low stock alert: {alerts_to_send}")
                    yield f"data: {json.dumps(message_data)}\n\n"
                    # Update last alerted products state
                    for p_data in alerts_to_send:
                        last_alerted_products[p_data['id']] = {'stock_quantity': p_data['stock_quantity']}

                # Check for products that were low stock but are no longer
                cleared_alerts = []
                for product_id in list(last_alerted_products.keys()): # Iterate over a copy of keys
                    if product_id not in current_low_stock_map:
                        cleared_alerts.append({"id": product_id, "status": "stock_ok"})
                        del last_alerted_products[product_id] # Remove from alerted list

                if cleared_alerts:
                    message_data = {"type": "stock_ok", "products": cleared_alerts}
                    # current_app.logger.info(f"SSE: Sending stock OK alert: {cleared_alerts}")
                    yield f"data: {json.dumps(message_data)}\n\n"

                time.sleep(10)  # Check every 10 seconds
        except GeneratorExit:
            # This happens when the client disconnects
            # current_app.logger.info("SSE: Client disconnected.")
            pass # Perform any cleanup if necessary
        except Exception as e:
            # current_app.logger.error(f"SSE: Unhandled exception in generator: {str(e)}")
            # Optionally yield a final error message to the client if possible
            try:
                error_message = {"type": "error", "message": "An unexpected error occurred on the server."}
                yield f"data: {json.dumps(error_message)}\n\n"
            except: # If yield fails (e.g. client already gone)
                pass
        finally:
            # current_app.logger.info("SSE: Closing generate_stock_alerts generator.")
            pass


    return Response(generate_stock_alerts(), mimetype='text/event-stream')

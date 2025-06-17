from sqlalchemy import Column, Integer, String, Text, DateTime, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from src.models import db # Import db from src.models (centralized instance)
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)  # For registered users
    customer_name = Column(String(150), nullable=False) # For guest or registered user's name
    items = Column(JSON, nullable=False)  # Store cart items: [{product_id, name, quantity, price_at_purchase}, ...]
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), nullable=False, default='En attente') # e.g., 'En attente', 'Confirmée', 'Expédiée', 'Annulée'
    whatsapp_message_preview = Column(Text, nullable=True) # Store the generated WA message for reference
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship to User model
    user = relationship('User', backref=db.backref('orders', lazy=True))

    def to_dict(self):
        order_dict = {
            'id': self.id,
            'user_id': self.user_id,
            'customer_name': self.customer_name,
            'items': self.items,
            'total_amount': self.total_amount,
            'status': self.status,
            'whatsapp_message_preview': self.whatsapp_message_preview,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if self.user:
            order_dict['user_details'] = {
                'username': self.user.username,
                'email': self.user.email
            }
        return order_dict

    def __repr__(self):
        return f'<Order {self.id} by {self.customer_name}>'

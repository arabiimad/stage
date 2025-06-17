from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models here to make them accessible via src.models.ModelName
# This also helps SQLAlchemy discover the models for db.create_all()

from .user import User
from .product import Product, ProductReview
from .article import Article
from .casestudy import CaseStudy
from .order import Order

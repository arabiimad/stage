from src.models import db # Import db from the __init__.py in the models directory
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users' # Explicitly defining table name is good practice

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    # Increased string length for Werkzeug password hashes (e.g., pbkdf2:sha256:260000$salt$hash)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(80), nullable=False, default='client') # e.g., client, admin

    # orders backref is added by Order model

    def set_password(self, password):
        # Ensure password is a string
        if not isinstance(password, str):
            raise TypeError("Password must be a string")
        # Werkzeug's generate_password_hash handles salting and returns a string
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        # Ensure password_hash is not None (already checked by nullable=False on column)
        # and input password is a string
        if self.password_hash is None or not isinstance(password, str):
            return False

        # Werkzeug's check_password_hash takes the stored hash and the password to check
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role
            # password_hash should not be exposed
        }

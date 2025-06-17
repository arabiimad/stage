from src.models import db # Import db from the __init__.py in the models directory
import bcrypt

class User(db.Model):
    __tablename__ = 'users' # Explicitly defining table name is good practice

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False) # Increased length for hash
    role = db.Column(db.String(80), nullable=False, default='client') # e.g., client, admin

    # orders backref is added by Order model

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        # Ensure password_hash is not None and is a string
        if self.password_hash is None or not isinstance(self.password_hash, str):
            return False
        return bcrypt.check_password_hash(self.password_hash.encode('utf-8'), password.encode('utf-8'))

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

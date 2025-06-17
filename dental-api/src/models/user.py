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
        # Ensure password is a string
        if not isinstance(password, str):
            raise TypeError("Password must be a string")
        # Encode password to bytes, generate salt, hash, then decode hash back to string for DB storage
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password):
        # Ensure password_hash is not None and is a string (already stored as string)
        if self.password_hash is None: # Should not happen if nullable=False
            return False
        if not isinstance(password, str): # Ensure input password is a string
            return False

        # Encode both password to check and stored hash to bytes for bcrypt.checkpw
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

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

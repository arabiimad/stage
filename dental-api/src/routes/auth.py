from flask import Blueprint, request, jsonify, current_app # Added current_app
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from src.models import db # Assuming db is in src.models.__init__
from src.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'client') # Default role to 'client'

    if not username or not email or not password:
        return jsonify({'msg': 'Missing username, email, or password'}), 400 # Changed 'message' to 'msg' for consistency with example

    # Using a single query with OR condition is slightly more efficient
    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify({'msg': 'User with this email or username already exists'}), 409 # More specific message

    new_user = User(username=username, email=email, role=role) # Role defaults to 'client' in model if not provided
    new_user.set_password(password) # Hashing is done in this method

    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error during registration for email {email}: {str(e)}") # Added logging
        return jsonify({'msg': 'Registration failed due to an internal error'}), 500 # Changed 'message' to 'msg'

    # Include role in JWT claims
    access_token = create_access_token(identity=new_user.id, additional_claims={'role': new_user.role})
    refresh_token = create_refresh_token(identity=new_user.id, additional_claims={'role': new_user.role}) # Keep claims consistent

    return jsonify({
        'msg': 'User registered successfully', # Changed 'message' to 'msg'
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': new_user.to_dict() # Return user details (excluding password hash)
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        # Include role in JWT claims
        access_token = create_access_token(identity=user.id, additional_claims={'role': user.role})
        refresh_token = create_refresh_token(identity=user.id, additional_claims={'role': user.role})
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        }), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    claims = get_jwt()
    current_user_role = claims.get('role', 'client') # Get role from existing refresh token

    # Create new access token with the same identity and role
    access_token = create_access_token(identity=current_user_id, additional_claims={'role': current_user_role})
    return jsonify({'access_token': access_token}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return jsonify(user.to_dict()), 200
    else:
        # This case should ideally not be reached if JWT is valid and refers to an existing user
        return jsonify({'message': 'User not found'}), 404

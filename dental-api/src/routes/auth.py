from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# Werkzeug security functions are used in the User model, not directly here
from src.models import db
from src.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('username'):
        return jsonify(error="Missing username, email, or password"), 400

    email = data['email']
    username = data['username']
    password = data['password']
    # Role is not taken from input, defaults to 'client' in User model

    if User.query.filter((User.email == email) | (User.username == username)).first():
        return jsonify(error="User with this email or username already exists"), 409 # 409 for Conflict

    try:
        new_user = User(
            username=username,
            email=email
            # role will default to 'client' as per model definition
        )
        new_user.set_password(password) # Uses werkzeug via set_password in User model

        db.session.add(new_user)
        db.session.commit()

        # Role claim is needed in JWT for @admin_required decorator to work
        access_token = create_access_token(
            identity=new_user.id,
            additional_claims={'role': new_user.role}
        )
        # No refresh token in this specific response structure as per problem description for this task

        return jsonify(
            msg="User registered successfully", # Added success message
            access_token=access_token,
            user=new_user.to_dict()
        ), 201

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Error during registration for {email}: {str(e)}")
        return jsonify(error="Registration failed due to an internal server error"), 500

@auth_bp.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify(error="Missing email or password"), 400

    email = data['email']
    password = data['password']

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password): # check_password uses werkzeug
        return jsonify(error="Invalid credentials"), 401

    # Role claim is needed in JWT for @admin_required decorator to work
    access_token = create_access_token(
        identity=user.id,
        additional_claims={'role': user.role}
    )
    # No refresh token in this specific response structure

    return jsonify(
        msg="Login successful", # Added success message
        access_token=access_token,
        user=user.to_dict()
    ), 200


@auth_bp.get('/me')
@jwt_required()
$def get_me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify(error="User not found"), 404

    return jsonify(user=user.to_dict()), 200


from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request

def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request() # Ensure JWT is present and valid
        claims = get_jwt()
        if claims.get('role') != 'admin':
            return jsonify(msg="Admins only! Access forbidden."), 403
        return fn(*args, **kwargs)
    return wrapper

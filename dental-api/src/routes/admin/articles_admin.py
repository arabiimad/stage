import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from datetime import datetime
from sqlalchemy import desc
from src.utils.decorators import admin_required
from src.models import db
from src.models.article import Article # Assuming Article model exists as defined in previous subtask proposal
# Ensure main.py's allowed_file can be accessed or redefine/import it if it's in a utils file.
# For simplicity here, we assume it's accessible via current_app or we can redefine it.

articles_admin_bp = Blueprint('articles_admin', __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

# GET /api/admin/articles
@articles_admin_bp.route('/articles', methods=['GET'])
@admin_required
def get_admin_articles():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    query = Article.query.order_by(desc(Article.created_at))
    paginated_articles = query.paginate(page=page, per_page=per_page, error_out=False)

    articles_data = [article.to_dict() for article in paginated_articles.items]

    return jsonify({
        "articles": articles_data,
        "total_pages": paginated_articles.pages,
        "current_page": paginated_articles.page,
        "total_articles": paginated_articles.total
    }), 200

# GET /api/admin/articles/<int:article_id>
@articles_admin_bp.route('/articles/<int:article_id>', methods=['GET'])
@admin_required
def get_single_article(article_id):
    article = Article.query.get_or_404(article_id)
    return jsonify(article.to_dict()), 200

# POST /api/admin/articles
@articles_admin_bp.route('/articles', methods=['POST'])
@admin_required
def create_article():
    if 'image' not in request.files and not request.form.get('image_url'): # Check if either file or URL is provided
        # Allow creating article without image initially by not making image field strictly required here
        pass # No image provided, which is fine

    data = request.form
    title = data.get('title')
    slug = data.get('slug') # Frontend should generate this, or backend can
    content = data.get('content')
    author = data.get('author')
    category = data.get('category')

    if not title or not content or not slug:
        return jsonify({"msg": "Missing required fields: title, slug, content"}), 400

    image_path_to_store = data.get('image_url', None) # Use existing URL if provided and no new file

    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            try:
                file.save(file_path)
                image_path_to_store = f"/static/uploads/articles/{filename}" # Relative path for serving
            except Exception as e:
                return jsonify({"msg": "Failed to save image", "error": str(e)}), 500
        elif file and file.filename != '': # File provided but not allowed type
             return jsonify({"msg": "File type not allowed"}), 400


    try:
        new_article = Article(
            title=title,
            slug=slug,
            content=content,
            author=author,
            category=category,
            image_url=image_path_to_store
        )
        db.session.add(new_article)
        db.session.commit()
        return jsonify(new_article.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        # Potentially delete uploaded file if DB commit fails
        if 'file_path' in locals() and os.path.exists(file_path) and image_path_to_store.startswith("/static/uploads/articles/"):
            try:
                os.remove(file_path)
            except Exception as e_remove:
                # Log removal error: current_app.logger.error(f"Failed to remove uploaded file on DB error: {e_remove}")
                pass
        return jsonify({"msg": "Failed to create article", "error": str(e)}), 500

# PUT /api/admin/articles/<int:article_id>
@articles_admin_bp.route('/articles/<int:article_id>', methods=['PUT'])
@admin_required
def update_article(article_id):
    article = Article.query.get_or_404(article_id)
    data = request.form

    article.title = data.get('title', article.title)
    article.slug = data.get('slug', article.slug) # Ensure slug uniqueness if changed
    article.content = data.get('content', article.content)
    article.author = data.get('author', article.author)
    article.category = data.get('category', article.category)
    article.updated_at = datetime.utcnow()

    # Image handling:
    # 1. New image uploaded: replace old, store new path.
    # 2. 'image_url' field explicitly set to empty string: remove image.
    # 3. 'image_url' field provided (and not empty): use this as new URL (e.g. external link).
    # 4. No 'image' file and no 'image_url' in form: keep existing image.

    new_image_path_to_store = article.image_url # Default to existing

    if 'image' in request.files:
        file = request.files['image']
        if file and file.filename != '' and allowed_file(file.filename):
            # Delete old image if it exists and is locally stored
            if article.image_url and article.image_url.startswith("/static/uploads/articles/"):
                old_filename = article.image_url.split('/')[-1]
                old_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], old_filename)
                if os.path.exists(old_file_path):
                    try:
                        os.remove(old_file_path)
                    except Exception as e_remove:
                        # Log error current_app.logger.error(f"Could not delete old image: {e_remove}")
                        pass

            filename = secure_filename(f"{datetime.utcnow().timestamp()}_{file.filename}")
            file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            try:
                file.save(file_path)
                new_image_path_to_store = f"/static/uploads/articles/{filename}"
            except Exception as e:
                return jsonify({"msg": "Failed to save new image", "error": str(e)}), 500
        elif file and file.filename != '': # File provided but not allowed type
             return jsonify({"msg": "New image file type not allowed"}), 400
    elif 'image_url' in data: # Check if image_url is part of the form data
        form_image_url = data.get('image_url')
        if form_image_url == "" and article.image_url and article.image_url.startswith("/static/uploads/articles/"):
            # Explicitly remove image
            old_filename = article.image_url.split('/')[-1]
            old_file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], old_filename)
            if os.path.exists(old_file_path):
                 try:
                    os.remove(old_file_path)
                 except Exception as e_remove:
                    pass # Log error
            new_image_path_to_store = None
        elif form_image_url: # If a new URL is provided (e.g. external)
            new_image_path_to_store = form_image_url
        # If 'image_url' is not in form data at all, new_image_path_to_store remains article.image_url (no change)

    article.image_url = new_image_path_to_store

    try:
        db.session.commit()
        return jsonify(article.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to update article", "error": str(e)}), 500

# DELETE /api/admin/articles/<int:article_id>
@articles_admin_bp.route('/articles/<int:article_id>', methods=['DELETE'])
@admin_required
def delete_article(article_id):
    article = Article.query.get_or_404(article_id)

    # Optionally delete associated image file
    if article.image_url and article.image_url.startswith("/static/uploads/articles/"):
        filename = article.image_url.split('/')[-1]
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                # Log the error but proceed with DB deletion
                # current_app.logger.error(f"Failed to delete image file {file_path}: {str(e)}")
                pass

    try:
        db.session.delete(article)
        db.session.commit()
        return jsonify({"msg": "Article deleted successfully"}), 200 # Or 204 No Content
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Failed to delete article", "error": str(e)}), 500

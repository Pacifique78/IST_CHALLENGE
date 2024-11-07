from flask import Flask, jsonify, request
from extensions import db, bcrypt, jwt
from datetime import timedelta, datetime
from flasgger import Swagger
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    logger.info("Creating Flask application...")
    app = Flask(__name__)

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://postgres:password@db:5432/python_tododb')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

    # Swagger Configuration
    swagger_config = {
        "headers": [],
        "specs": [
            {
                "endpoint": 'apispec',
                "route": '/apispec.json',
                "rule_filter": lambda rule: True,
                "model_filter": lambda tag: True,
            }
        ],
        "static_url_path": "/flasgger_static",
        "swagger_ui": True,
        "specs_route": "/docs"
    }

    swagger_template = {
        "swagger": "2.0",
        "info": {
            "title": "Todo API",
            "description": "API for Todo Application",
            "contact": {
                "email": "your-email@example.com"
            },
            "version": "1.0"
        },
        "securityDefinitions": {
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\""
            }
        },
        "security": [
            {
                "Bearer": []
            }
        ]
    }

    logger.info("Initializing extensions...")
    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    Swagger(app, config=swagger_config, template=swagger_template)

    @app.before_request
    def log_request_info():
        # Skip logging for static files
        if not request.path.startswith('/flasgger_static'):
            logger.debug('Headers: %s', request.headers)
            logger.debug('Body: %s', request.get_data())

    @app.after_request
    def log_response_info(response):
        # Skip logging for static files
        if not request.path.startswith('/flasgger_static'):
            # Only log JSON responses
            if response.content_type == 'application/json':
                logger.debug('Response: %s', response.data)
        return response

    @app.route('/health')
    def health_check():
        logger.info("Health check endpoint called")
        return jsonify({
            'status': 'healthy',
            'time': datetime.utcnow().isoformat()
        })

    # Import and register blueprints
    logger.info("Registering blueprints...")
    from routes import auth_routes, todo_routes
    app.register_blueprint(auth_routes.bp)
    app.register_blueprint(todo_routes.bp)

    return app

if __name__ == '__main__':
    app = create_app()
    
    # Wait for database to be ready
    import time
    from sqlalchemy.exc import OperationalError

    with app.app_context():
        while True:
            try:
                logger.info("Attempting to create database tables...")
                db.create_all()
                logger.info("Database tables created successfully!")
                break
            except OperationalError as e:
                logger.warning(f"Database not ready yet: {str(e)}")
                logger.info("Waiting 1 second before retry...")
                time.sleep(1)

    logger.info("Starting Flask application server...")
    app.run(host='0.0.0.0', port=5002, debug=True)
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models.user import db
from routes.auth import auth
from routes.main import main

app = Flask(__name__)
app.secret_key = '63f4945d921d599f27ae4fdf5bada3f1'

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

app.register_blueprint(auth)
app.register_blueprint(main)

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
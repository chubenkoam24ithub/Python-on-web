from flask import Blueprint, render_template
from routes.auth import LoginForm, RegisterForm 

main = Blueprint('main', __name__)

@main.route('/')
def index():
    login_form = LoginForm()
    register_form = RegisterForm()
    return render_template('index.html', login_form=login_form, register_form=register_form)

@main.route('/features')
def features():
    login_form = LoginForm()
    register_form = RegisterForm()
    return render_template('features.html', login_form=login_form, register_form=register_form)

@main.route('/gallery')
def gallery():
    login_form = LoginForm()
    register_form = RegisterForm()
    return render_template('gallery.html', login_form=login_form, register_form=register_form)

@main.route('/license')
def license():
    login_form = LoginForm()
    register_form = RegisterForm()
    return render_template('license.html', login_form=login_form, register_form=register_form)
from flask import Blueprint, render_template, redirect, url_for, flash, session
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, DateField, SelectField, BooleanField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from models.user import db, User

auth = Blueprint('auth', __name__)

class RegisterForm(FlaskForm):
    nickname = StringField('Никнейм', validators=[DataRequired()])
    email = StringField('Почта', validators=[DataRequired(), Email()])
    birth_date = DateField('Дата рождения', format='%Y-%m-%d', validators=[DataRequired()])
    gender = SelectField('Пол', choices=[('male', 'Мужской'), ('female', 'Женский')], validators=[DataRequired()])
    password = PasswordField('Пароль', validators=[DataRequired()])
    password_confirm = PasswordField('Подтверждение пароля', validators=[DataRequired(), EqualTo('password', message='Пароли не совпадают')])
    agreement = BooleanField('Я согласен с лицензионным соглашением', validators=[DataRequired()])
    submit = SubmitField('Зарегистрироваться')

class LoginForm(FlaskForm):
    identifier = StringField('Никнейм или почта', validators=[DataRequired()])
    password = PasswordField('Пароль', validators=[DataRequired()])
    submit = SubmitField('Войти')

@auth.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        nickname = form.nickname.data
        email = form.email.data
        birth_date = form.birth_date.data
        gender = form.gender.data
        password = form.password.data

        if User.query.filter_by(nickname=nickname).first():
            flash('Этот никнейм уже занят!', 'error')
            return redirect(url_for('main.index'))

        if User.query.filter_by(email=email).first():
            flash('Эта почта уже зарегистрирована!', 'error')
            return redirect(url_for('main.index'))

        current_date = datetime.now().date() 
        if birth_date > current_date:
            flash('Дата рождения не может быть позже сегодняшнего дня!', 'error')
            return redirect(url_for('main.index'))

        password_hash = generate_password_hash(password, method='pbkdf2:sha256', salt_length=16)
        new_user = User(
            nickname=nickname,
            email=email,
            birth_date=birth_date,
            gender=gender,
            password_hash=password_hash
        )
        db.session.add(new_user)
        db.session.commit()

        session['user_id'] = new_user.id
        flash('Регистрация успешна! Добро пожаловать!', 'success')
        return redirect(url_for('auth.profile'))

    current_date = datetime.now().strftime('%Y-%m-%d')
    return render_template('register.html', form=form, max_date=current_date)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        identifier = form.identifier.data
        password = form.password.data

        user = User.query.filter((User.nickname == identifier) | (User.email == identifier)).first()
        if user and check_password_hash(user.password_hash, password):
            session['user_id'] = user.id
            flash('Вход успешен!', 'success')
            return redirect(url_for('auth.profile'))
        else:
            flash('Неверный никнейм/почта или пароль!', 'error')
            return redirect(url_for('main.index'))

    return render_template('login.html', form=form)

@auth.route('/profile')
def profile():
    if 'user_id' not in session:
        flash('Пожалуйста, войдите в систему!', 'error')
        return redirect(url_for('auth.login'))

    user = User.query.get(session['user_id'])
    return render_template('profile.html', user=user)

@auth.route('/logout')
def logout():
    session.pop('user_id', None)
    flash('Вы вышли из системы!', 'success')
    return redirect(url_for('main.index'))
import os
from dotenv import load_dotenv
from .exceptions import EnvironmentError
load_dotenv()

SALT = os.getenv('SALT')
if not SALT:
    raise EnvironmentError('SALT')
SQLALCHEMY_DATABASE_URL = os.getenv('SQLALCHEMY_DATABASE_URL')
if not SQLALCHEMY_DATABASE_URL:
    raise EnvironmentError('SQLALCHEMY_DATABASE_URL')
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise EnvironmentError('SECRET_KEY')
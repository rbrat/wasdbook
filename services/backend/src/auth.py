from typing import Annotated
from fastapi import Depends, Security
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from pydantic import ValidationError

import schemas
from crud import get_user_for_auth, get_user
from crypt import verify_password
from database import get_db
from exceptions import InactiveUserHTTPException, IncorrectCredentialsHTTPException
from settings import SALT, SECRET_KEY

ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl='token')

def authenticate_user(username: str, password: str, db: Session) -> schemas.User | bool:
    user = get_user_for_auth(username, db)
    if not user:
        return False
    if not verify_password(SALT + password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)) -> schemas.User:
    authenticate_value = 'Bearer'
    credentials_exception = IncorrectCredentialsHTTPException(headers={'WWW-Authenticate': authenticate_value})
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str | None = payload.get('sub')
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except (JWTError, ValidationError):
        raise credentials_exception
    user = get_user(username=token_data.username, db=db)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: Annotated[schemas.User, Security(get_current_user)]) -> schemas.User | None:
    if not current_user:
        return None
    if not current_user.is_active:
        raise InactiveUserHTTPException()
    return current_user
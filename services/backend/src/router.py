import uuid
from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session


from . import schemas, crud
from .auth import ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user, create_access_token, get_current_active_user
from .database import get_db
from .dependencies import NavParams
from .exceptions import IncorrectCredentialsHTTPException
router = APIRouter()

@router.get('/')
async def main():
    return {'message': 'Welcome to WASDBook'}

@router.get('/notes')
async def get_notes(nav_params: NavParams, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_active_user)) -> list[schemas.Note]:
    notes = crud.get_notes_list(nav_params, db, current_user)
    return notes

@router.get('/notes/{note_uuid}')
async def get_note(note_uuid: str, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_active_user)) -> schemas.Note:
    note = crud.get_note_by_uuid(uuid.UUID(note_uuid), current_user, db, operation='read')
    return note
    

@router.post('/notes')
async def create_note(note: schemas.NoteCreate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> schemas.Note:
    db_item = crud.create_note(note, current_user, db)
    return db_item

@router.patch('/notes/{note_uuid}')
async def update_note(note_uuid: str, note: schemas.NoteCreate, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> schemas.Note:
    stored_note = crud.update_note(uuid.UUID(note_uuid), note, current_user, db)
    return stored_note

@router.delete('/notes/{note_uuid}')
async def delete_note(note_uuid: str, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> None:
    return crud.delete_note(uuid.UUID(note_uuid), current_user, db)


@router.get('/browse')
async def browse_notes(nav_params: NavParams, db: Session = Depends(get_db)) -> list[schemas.Note]:
    notes = crud.get_public_notes(nav_params, db)
    return notes

@router.get('/users/')
async def get_users(nav_params: NavParams, db: Session = Depends(get_db)) -> list[schemas.User]:
    users = crud.get_users_list(nav_params, db)
    return users

@router.patch('/users/{user_id}')
async def update_user(user_id: int, user_to_update: schemas.UserCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_active_user)) -> schemas.User:
    user = crud.update_user(user_id, user_to_update, db, current_user)
    return user 

@router.get('/users/{user_id}')
async def get_user(user_id: int, db: Session = Depends(get_db)) -> schemas.User:
    user = crud.get_user_by_id(user_id, db)
    return user

@router.get('/whoami')
async def get_my_user(current_user: schemas.User = Depends(get_current_active_user)) -> schemas.User:
    return current_user

@router.post('/users/')
async def create_user(user_to_create: schemas.UserCreate, db: Session = Depends(get_db)) -> dict:
    user = crud.create_user(user_to_create, db)
    access_token = create_access_token(data={'sub': user.username}, expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    return {'access_token': access_token, 'token_type': 'bearer'}

@router.delete('/users/{user_id}')
async def delete_user(user_id: int, current_user: schemas.User = Depends(get_current_active_user), db: Session = Depends(get_db)) -> None:
    return crud.delete_user(user_id, current_user, db)

@router.post('/token', response_model=schemas.Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)) -> dict:
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise IncorrectCredentialsHTTPException()
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={'sub': user.username, 'scopes': form_data.scopes}, expires_delta=access_token_expires)
    return {'access_token': access_token, 'token_type': 'bearer'}

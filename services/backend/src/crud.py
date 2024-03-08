import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from . import models, schemas
from .crypt import get_password_hash
from .dependencies import NavParams
from .exceptions import NoteNotFoundHTTPException, ForbiddenHTTPException, UserNotFoundHTTPException, UserExistsHTTPException, UserForbiddenHTTPException
from .settings import SALT



def get_user(username: str, db: Session) -> schemas.User | None:
    user: models.User = db.query(models.User).filter_by(username=username).first()
    if user:
        return user
    return None

def get_user_for_auth(username: str, db: Session) -> models.User | None:
    user: models.User = db.query(models.User).filter_by(username=username).first()
    if user:
        return user
    return None

def get_user_by_email(email: str, db: Session) -> schemas.User | None:
    user: models.User = db.query(models.User).filter_by(email=email).first()
    return user

def get_notes_list(nav_params: NavParams, db: Session, current_user: schemas.User) -> list[schemas.Note]:
    limit = nav_params.get('limit')
    skip = nav_params.get('skip')
    notes = db.query(models.Note).filter_by(owner_id=current_user.user_id).order_by(models.Note.created.desc()).offset(skip).limit(limit).all()
    return notes

def get_note_by_uuid(note_uuid: uuid.UUID, current_user: schemas.User, db: Session, operation: str) -> schemas.Note:
    note = db.query(models.Note).filter_by(note_uuid=note_uuid).first()
    if not note:
        raise NoteNotFoundHTTPException()
    if note.owner_id != current_user.user_id and not note.is_public:
        raise ForbiddenHTTPException(operation_name=operation)
    return note
    
def get_public_notes(nav_params: NavParams, db: Session) -> list[schemas.Note]:
    limit = nav_params.get('limit')
    skip = nav_params.get('skip')
    notes = db.query(models.Note).filter_by(is_public=True).order_by(models.Note.created.desc()).offset(skip).limit(limit).all()
    return notes

def get_users_list(nav_params: NavParams, db: Session) -> list[schemas.User]:
    limit = nav_params.get('limit')
    skip = nav_params.get('skip')
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users

def get_user_by_id(user_id: int, db: Session) -> schemas.User:
    user = db.query(models.User).filter_by(user_id=user_id).first()
    if not user:
        raise UserNotFoundHTTPException()
    return user

def create_note(note: schemas.NoteCreate, current_user: schemas.User, db: Session) -> schemas.Note:
    current_dt = datetime.now()
    db_item = models.Note(**note.model_dump(), owner_id=current_user.user_id, created=current_dt, modified=current_dt, note_uuid = uuid.uuid4())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_note(note_uuid: uuid.UUID, note: schemas.NoteCreate, current_user: schemas.User, db: Session) -> schemas.Note:
    stored_note = get_note_by_uuid(note_uuid, current_user, db, operation='update')
    for k, v in note.model_dump(exclude_unset=True).items():
        setattr(stored_note, k, v)
    stored_note.modified = datetime.now()
    db.commit()
    db.refresh(stored_note)
    return stored_note

def delete_note(note_uuid: uuid.UUID, current_user: schemas.User, db: Session) -> None:
    stored_note = get_note_by_uuid(note_uuid, current_user, db, operation='delete')
    db.delete(stored_note)
    db.commit()

def create_user(user_to_create: schemas.UserCreate, db: Session) -> schemas.User:
    if any([get_user(user_to_create.username, db), get_user_by_email(user_to_create.email, db)]):
        raise UserExistsHTTPException('Username or email')
    db_item = models.User(**user_to_create.model_dump(exclude=['password']), hashed_password=get_password_hash(SALT + user_to_create.password))
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_user(user_id: int, user_to_update: schemas.UserCreate, db: Session, current_user: schemas.UserInDB) -> schemas.User:
    if user_id != current_user.user_id:
        raise UserForbiddenHTTPException(operation_name='update')
    user_by_name: schemas.User = get_user(user_to_update.username, db)
    user_by_email: schemas.User = get_user_by_email(user_to_update.email, db)
    if user_by_name and user_by_name.user_id != user_id:
        raise UserExistsHTTPException('Username')
    if user_by_email and user_by_email.user_id != user_id:
        raise UserExistsHTTPException('Email')
    if user_to_update.password:
        current_user.hashed_password = get_password_hash(SALT + user_to_update.password)
    for k, v in {'username': user_to_update.username, 'email': user_to_update.email}.items():
        if getattr(current_user, k) != v and v:
            setattr(current_user, k, v)
    db.commit()
    db.refresh(current_user)
    return current_user

def delete_user(user_id: int, current_user: schemas.User, db: Session) -> None:
    user = get_user_by_id(user_id, db)
    if not user or user.user_id != current_user.user_id:
        raise UserForbiddenHTTPException(operation='delete')
    db.delete(user)
    db.commit()
    
import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)

class UserInDB(User):
    hashed_password: str

class NoteBase(BaseModel):
    title: str
    contents: str | None = None
    is_public: bool = False

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    note_uuid: uuid.UUID
    owner_id: int
    owner: User
    created: datetime
    modified: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

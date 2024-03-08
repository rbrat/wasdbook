from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, UUID, DateTime
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True, unique=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    notes = relationship('Note', back_populates='owner')

class Note(Base):
    __tablename__ = 'notes'

    note_uuid = Column(UUID, primary_key=True, index=True)
    title = Column(String, index=True)
    contents = Column(String)
    created = Column(DateTime, index=True)
    modified = Column(DateTime)
    is_public = Column(Boolean, index=True)
    owner_id = Column(Integer, ForeignKey('users.user_id', ondelete='CASCADE'))

    owner = relationship('User', back_populates='notes')
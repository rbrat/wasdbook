from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from settings import SQLALCHEMY_DATABASE_URL

#SQLALCHEMY_DATABASE_URL = 'sqlite:///./wasdbook.db'


engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()



def get_db():
    print(f'\n\n\n\n\n\n{SQLALCHEMY_DATABASE_URL=}\n\n\n\n\n\n')
    db = SessionLocal()
    try:
        yield db
    except Exception as err:
        print(f"\n\n\n\n\n\nConnection error: {err}\n\n\n\n\n\n")
    finally:
        return db.close()
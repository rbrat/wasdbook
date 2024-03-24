
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from router import router
import models

models.Base.metadata.create_all(bind=engine)

# from alembic.config import Config
# from alembic import command
# config = Config("./alembic.ini")
# command.stamp(config, "head")

app = FastAPI()
origins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]


app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"]
)

app.include_router(router)

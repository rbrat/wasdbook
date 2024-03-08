from typing import Annotated
from fastapi import Depends

async def get_nav_params(q: str | None = None, skip: int = 0, limit: int = 20):
    return {'q': q, 'skip': skip, 'limit': limit}

NavParams = Annotated[dict, Depends(get_nav_params)]
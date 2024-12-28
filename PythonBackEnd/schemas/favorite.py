from typing import Optional
from pydantic import BaseModel

class Favorite(BaseModel):
    id: Optional[int] = None
    categoria: str

from typing import Optional
from pydantic import BaseModel

class User(BaseModel):
    id: Optional[int] = None
    username: str
    email: str
    password: str

    class Config:
        orm_mode = True  # Enable ORM compatibility
        from_attributes = True
        
class LoginRequest(BaseModel):
    username: str
    password: str
        
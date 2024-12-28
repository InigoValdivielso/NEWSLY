import os
from fastapi import APIRouter, Depends
from config.db import conexion
from models.user import users
from routes.auth import verify_token
from schemas.user import User
from fastapi import HTTPException

from cryptography.fernet import Fernet

from dotenv import load_dotenv
load_dotenv()



key = os.environ.get("SECRET_KEY")

if key is None:
   raise ValueError("SECRET_KEY no está configurada correctamente.")
f = Fernet(key.encode())

user = APIRouter()

@user.get("/users", tags=["Gestión de usuarios"])
def get_users():
    try:
        result = conexion.execute(users.select()).fetchall()

        # Convert each row into a UserResponse Pydantic model
        users_list = [User.from_orm(dict(row._mapping)) for row in result]
        
        return users_list
    except Exception as e:
        return {"status": "error", "message": str(e)}



@user.post("/register", tags=["Gestión de usuarios"])
def create_user(user: User):
    new_user = {"username": user.username, "email": user.email}
    new_user["password"] = f.encrypt(user.password.encode("utf-8"))
    try:
        result = conexion.execute(users.insert().values(new_user))
        conexion.commit()  

        return {"status": "user created", "user_id": result.inserted_primary_key[0] if result.inserted_primary_key else None}
    
    except Exception as e:
        return {"status": "error", "message": str(e)}


@user.delete("/users", tags=["Gestión de usuarios"])
def delete_user(user: User, token_data: dict = Depends(verify_token)):
    try:
        email = token_data["email"]
        result = conexion.execute(users.delete().where(users.c.email == email))
        if result is None:
            raise HTTPException(status_code=404, detail="User not found")
        conexion.commit()  
        return {"status": "User deleted successfully", "user_email": user.email}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@user.put("/users", tags=["Gestión de usuarios"])
def update_user(user: User, token_data: dict = Depends(verify_token)):
    try:
        email = token_data["email"]
        existing_user = conexion.execute(users.select().where(users.c.email == email)).fetchone()
        if existing_user is None:
            raise HTTPException(status_code=404, detail="User not found")
    
        conexion.execute(users.update().where(users.c.email == email).values(username=user.username, email=user.email, password=f.encrypt(user.password.encode("utf-8"))))
        conexion.commit()  
        return {"status": "User updated successfully", "user_email": user.email}
    except Exception as e: 
        return {"status": "error", "message": str(e)}


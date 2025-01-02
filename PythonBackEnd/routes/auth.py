import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Header, Request, Security
from fastapi.security import APIKeyHeader
from models.user import users
from schemas.user import LoginRequest, User
from functions_jwt import validate_token, write_token
from fastapi.responses import JSONResponse
from config.db import conexion
from cryptography.fernet import Fernet



api_key_header = APIKeyHeader(name="Authorization", auto_error=False)

auth_routes = APIRouter()
load_dotenv()
key = os.environ.get("SECRET_KEY")

if key is None:
   raise ValueError("SECRET_KEY no está configurada correctamente.")
f = Fernet(key.encode())


@auth_routes.post("/login" , tags=["Autentificación"])
def login(data: LoginRequest):
    username = data.username
    password = data.password
    result = conexion.execute(users.select().where(users.c.username == username and users.c.password == f.encrypt(password.encode("utf-8")))).fetchone()
    if result:
        user = User.from_orm(dict(result._mapping))
        token = write_token(user.dict())
        return JSONResponse(content={"status": "success", "token": token}, status_code=200)
    else: 
        return JSONResponse(content={"status": "error", "message": "Usuario o contraseña incorrectos"}, status_code=404)

@auth_routes.post("/verify/token" , tags=["Autentificación"])
def verify_token(Authorization: str = Security(api_key_header)):

    if not Authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    try:
        token = Authorization.split(" ")[1]  # Extrae el token
    except IndexError:
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")
    
    # Validar el token y obtener los datos del usuario
    user_data = validate_token(token, output=True)
    
    if not isinstance(user_data, dict):
        # Si validate_token devolvió JSONResponse, significa que hubo un error
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    if "password" in user_data:
        try:
            # Descifrar la contraseña
            decrypted_password = f.decrypt(user_data["password"].encode()).decode()
            user_data["password"] = decrypted_password
        except Exception as e:
            raise HTTPException(status_code=500, detail="Error decrypting password")
    
    return user_data



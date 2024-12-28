from jwt import encode, decode
from jwt import exceptions
from datetime import datetime, timedelta
from os import getenv
from fastapi.responses import JSONResponse

def expire_time(days: int):
    date = datetime.now()
    new_date = date + timedelta(days)
    return new_date

def write_token(data: dict):
    token = encode(payload={**data, "exp": expire_time(2)}, key=getenv("SECRET_KEY"), algorithm="HS256")
    return token

def validate_token(token, output=False):
    try:
        decoded_token = decode(token, key=getenv("SECRET_KEY"), algorithms=["HS256"])
        if output:
            return decoded_token
        return decoded_token["email"]
    except exceptions.DecodeError:
        return JSONResponse(content={"status": "error", "message": "Token inválido"}, status_code=401)
    except exceptions.ExpiredSignatureError:
        return JSONResponse(content={"status": "error", "message": "Token expirado"}, status_code=401)
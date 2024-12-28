from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy import select
from config.db import conexion
from models.favorite import favorites
from models.user import users
from schemas.favorite import Favorite
from routes.auth import verify_token

favorite = APIRouter()


@favorite.post("/favorites", tags=["Favoritos"])
def add_favorito(fav: Favorite, token_data: dict = Depends(verify_token)):
    try:
        user_id = token_data["id"]
        existing_user = conexion.execute(users.select().where(users.c.id == user_id)).fetchone()
        existing_fav = conexion.execute(favorites.select().where(favorites.c.user_id == user_id and favorites.c.categoria == fav.categoria)).fetchone()
        if existing_user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        if existing_fav:
            raise HTTPException(status_code=400, detail="La categoría ya está en favoritos.")
        
        conexion.execute(favorites.insert().values(user_id=user_id, categoria=fav.categoria))
        conexion.commit()  
        return {"status": "Favorite added successfully", "categoria": fav.categoria}
    except Exception as e: 
        return {"status": "error", "message": str(e)}

@favorite.delete("/favorites", tags=["Favoritos"])
def delete_favorito(fav: Favorite, token_data: dict = Depends(verify_token)):
    try:
        user_id = token_data["id"]
        existing_user = conexion.execute(users.select().where(users.c.id == user_id)).fetchone()
        existing_fav = conexion.execute(favorites.select().where(favorites.c.user_id == user_id and favorites.c.categoria == fav.categoria)).fetchone()
        if existing_user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        if existing_fav is None:
            raise HTTPException(status_code=400, detail="La categoría no está en favoritos.")
        
        conexion.execute(favorites.delete().where(favorites.c.user_id == user_id and favorites.c.categoria == fav.categoria))
        conexion.commit()  
        return {"status": "Favorite deleted successfully", "categoria": fav.categoria}
    except Exception as e: 
        return {"status": "error", "message": str(e)}

@favorite.get("/favorites", tags=["Favoritos"])
def get_favoritos(token_data: dict = Depends(verify_token)):
    try:
        user_id = token_data["id"]
        existing_user = conexion.execute(users.select().where(users.c.id == user_id)).fetchone()
        if existing_user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        result = conexion.execute(select(favorites).where(favorites.c.user_id == user_id)).fetchall()
        favoritos = []
        for row in result:
            favoritos.append({
                "id": row[0],
                "user_id": row[1],
                "categoria": row[2]
            })
        return favoritos
    except Exception as e: 
        return {"status": "error", "message": str(e)}

@favorite.post("/favorites", tags=["Favoritos"])
def add_favorito(fav: Favorite, token_data: dict = Depends(verify_token)):
    try:
        user_id = token_data["id"]
        existing_user = conexion.execute(users.select().where(users.c.id == user_id)).fetchone()
        existing_fav = conexion.execute(favorites.select().where(favorites.c.user_id == user_id and favorites.c.categoria == fav.categoria)).fetchone()
        if existing_user is None:
            raise HTTPException(status_code=404, detail="User not found")
        
        if existing_fav:
            raise HTTPException(status_code=400, detail="La categoría ya está en favoritos.")
        
        conexion.execute(favorites.insert().values(user_id=user_id, categoria=fav.categoria))
        conexion.commit()  
        return {"status": "Favorite added successfully", "categoria": fav.categoria}
    except Exception as e: 
        return {"status": "error", "message": str(e)}
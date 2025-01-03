from fastapi import FastAPI
from routes.favorite import favorite
from routes.user import user
from dotenv import load_dotenv
from routes.auth import auth_routes
from authlib.integrations.starlette_client import OAuth
from fastapi.middleware.cors import CORSMiddleware






app = FastAPI(
    title= "FastAPI Newsly",
    description= "API para el proyecto Newsly, que controla la gestión de usuarios y la administración de favoritos.",
    version= "0.1",
    openapi_tags=[{
        "name": "Gestión de usuarios",
        "description": "Rutas relacionadas con la gestión de usuarios"
        
    },{
        "name": "Autentificación",
        "description": "Rutas relacionadas con la autentificación de usuarios"
    },
    {
        "name": "Favoritos",
        "description": "Rutas relacionadas con la gestión de favoritos"
    }]
)
#app.add_middleware(SessionMiddleware, seceret_key="")
# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos
    allow_headers=["*"],  # Permite todos los encabezados
)
oauth = OAuth()


load_dotenv()

app.include_router(user)
app.include_router(auth_routes)
app.include_router(favorite)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="localhost",
        port=8000,
        reload=True
    )


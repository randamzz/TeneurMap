import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from .routes import router
from .database import engine

# from routes import router
# from database import engine

from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

app = FastAPI(title="Forage API")

# Inclure les routes
app.include_router(router)

# Middlewares
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Sécurité CORS 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://mon-domaine-front.com"],  # mettre l'URL de  frontend
    allow_credentials=True,
    allow_methods=["GET", "POST"],  
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

def check_db_connection():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Connexion à la base de données réussie !")
    except SQLAlchemyError as e:
        print("❌ Erreur de connexion à la base de données :", e)

check_db_connection()
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

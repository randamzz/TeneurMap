from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


# URL de connexion PostgreSQL
# DATABASE_URL = "postgresql+psycopg2://gsmi_admin:123@localhost/forga_db"
DATABASE_URL="postgresql+psycopg2://gsmi_admin:123@host.docker.internal:5432/forga_db"


# Création du moteur SQLAlchemy
engine = create_engine(DATABASE_URL)

# Création d'une session locale
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base pour les modèles
Base = declarative_base()

# Dépendance FastAPI pour injection de session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

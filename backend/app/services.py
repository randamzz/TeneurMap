from sqlalchemy.orm import Session
from .models import ForageData

def get_all_forage_data(db: Session):
    """
    Récupère jusqu'à 1000 données de forage depuis la base.
    """
    return db.query(ForageData).all()

def make_prediction(x: float, y: float, z: float) -> float:
    """
    Retourne une prédiction factice = somme des valeurs.
    """
    return x + y + z

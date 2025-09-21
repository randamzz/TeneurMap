from sqlalchemy.orm import Session
from .models import ForageData
from sklearn.neighbors import NearestNeighbors
import os
import joblib
import numpy as np
import pandas as pd

# Charger le modèle une seule fois au démarrage
model_path = os.path.join(os.path.dirname(__file__), "../ML/xgb_model_test5.pkl")
model = joblib.load(model_path)


def get_all_forage_data(db: Session):
    """
    Récupère toutes les données de forage depuis la base.
    """
    return db.query(ForageData).all()


# Fonction IDW
def compute_idw_feature(X_coords, y_values, new_point, k=10, power=2):
    neigh = NearestNeighbors(n_neighbors=k)
    neigh.fit(X_coords)
    distances, indices = neigh.kneighbors([new_point])

    dists = distances[0]
    idx = indices[0]

    weights = 1 / (dists ** power + 1e-12)
    weighted_avg = np.sum(weights * y_values[idx]) / np.sum(weights)
    return weighted_avg


def make_prediction(x: float, y: float, z: float, db: Session) -> float:
    """
    Retourne une prédiction du modèle entraîné.
    """
    # Charger les données existantes pour calculer IDW
    data = get_all_forage_data(db)
    X_coords = np.array([[row.X, row.Y, row.Z] for row in data])
    y_values = np.array([row.teneur for row in data])

    # Calcul IDW
    idw_value = compute_idw_feature(X_coords, y_values, [x, y, z])

    # Features additionnelles
    X_mean, Y_mean = X_coords[:, 0].mean(), X_coords[:, 1].mean()
    X_centered = x - X_mean
    Y_centered = y - Y_mean
    dist_center = np.sqrt(X_centered**2 + Y_centered**2)

    # Construire le dataframe de features attendu par le modèle
    features = pd.DataFrame([{
        "X": x,
        "Y": y,
        "Z": z,
        "idw_feature": idw_value,
        "X_centered": X_centered,
        "Y_centered": Y_centered,
        "dist_center": dist_center
    }])

    # Prédiction
    prediction = model.predict(features)[0]
    return float(prediction)

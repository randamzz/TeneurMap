import os
import pandas as pd
from sqlalchemy.orm import Session
from .models import ForageData, Base
from .database import engine, SessionLocal

# Chemins
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "..", "data")
csv_file = os.path.join(DATA_DIR, "Forages.csv")

# Vérification existence du fichier
if not os.path.exists(csv_file):
    raise FileNotFoundError(f"Fichier introuvable : {csv_file}")

# Lecture du CSV
df = pd.read_csv(csv_file, sep=';')

# Convertir les colonnes en types Python natifs
df['X'] = df['X'].astype(float)
df['Y'] = df['Y'].astype(float)
df['Z'] = df['Z'].astype(float)
df['Teneur (%)'] = df['Teneur (%)'].astype(float)

# Renommer la colonne pour matcher le modèle
df = df.rename(columns={"Teneur (%)": "teneur"})

if 'Id' in df.columns:
    df['Id'] = df['Id'].astype(int)

# Création des tables si elles n'existent pas
Base.metadata.create_all(bind=engine)

# Créer une session
session: Session = SessionLocal()

print(df.head())
print(f"Nombre de lignes à importer : {len(df)}")
print(f"Début import du fichier : {csv_file}")

# Conversion du DataFrame en dictionnaire et insertion en masse
records = df.to_dict(orient='records')

session.bulk_insert_mappings(ForageData, records)
session.commit()
session.close()

print("Import terminé avec succès !")

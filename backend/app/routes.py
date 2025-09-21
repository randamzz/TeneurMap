from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from .services import get_all_forage_data , make_prediction
from .database import SessionLocal

router = APIRouter()

# Dépendance pour obtenir une session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/data")
def read_forage_data(db: Session = Depends(get_db)):
    """
    GET /data → retourne les données de forage en JSON
    """
    try:
        data = get_all_forage_data(db)
        result = [
            {
                "id":row.id,
                "X": row.X,
                "Y": row.Y,
                "Z": row.Z,
                "teneur": row.teneur
            }
            for row in data
        ]
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Limites des valeurs
X_MIN, X_MAX = 426218, 427378
Y_MIN, Y_MAX = 5_839_036, 5_840_356
Z_MIN, Z_MAX = 8764, 10204

@router.post("/predict")
async def predict(request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    try:
        # Récupérer les valeurs
        x = float(data.get("X", 0))
        y = float(data.get("Y", 0))
        z = float(data.get("Z", 0))
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="X, Y, Z doivent être des nombres valides")

    # Validation des limites
    if not (X_MIN <= x <= X_MAX):
        raise HTTPException(status_code=400, detail=f"X doit être entre {X_MIN} et {X_MAX}")
    if not (Y_MIN <= y <= Y_MAX):
        raise HTTPException(status_code=400, detail=f"Y doit être entre {Y_MIN} et {Y_MAX}")
    if not (Z_MIN <= z <= Z_MAX):
        raise HTTPException(status_code=400, detail=f"Z doit être entre {Z_MIN} et {Z_MAX}")

    # Validation regex pour s'assurer qu'aucun code malveillant n'est envoyé
    import re
    pattern = re.compile(r"^[0-9.+-eE]+$")  # seuls chiffres, point, +, -, e/E
    for val in [x, y, z]:
        if not pattern.match(str(val)):
            raise HTTPException(status_code=400, detail="Format invalide pour X, Y ou Z")

    # Appel du service
    result = make_prediction(x, y, z, db)
    return {"prediction": result}
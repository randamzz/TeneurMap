from sqlalchemy import Column, Integer, Float
from .database import Base
# from database import Base


class ForageData(Base):
    __tablename__ = "forage_data"

    id = Column(Integer, primary_key=True, index=True)
    X = Column(Float, nullable=False)
    Y = Column(Float, nullable=False)
    Z = Column(Float, nullable=False)
    teneur = Column(Float, nullable=False)


class PredictRequest(Base):
    __tablename__ = "predict_request"

    id = Column(Integer, primary_key=True, index=True)
    X = Column(Float, nullable=False)
    Y = Column(Float, nullable=False)
    Z = Column(Float, nullable=False)

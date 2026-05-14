from app.repositories.base import BaseRepository
from app.repositories.user import UserRepository
from app.repositories.patient import PatientRepository
from app.repositories.vitals import VitalsRepository
from app.repositories.prediction import PredictionRepository

__all__ = [
    "BaseRepository",
    "UserRepository",
    "PatientRepository",
    "VitalsRepository",
    "PredictionRepository"
]

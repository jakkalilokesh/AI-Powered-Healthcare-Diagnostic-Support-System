from typing import List
from sqlalchemy.orm import Session
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionCreate, PredictionUpdate
from app.repositories.base import BaseRepository


class PredictionRepository(BaseRepository[Prediction, PredictionCreate, PredictionUpdate]):
    def get_by_patient_id(self, db: Session, patient_id: int, skip: int = 0, limit: int = 100) -> List[Prediction]:
        return (
            db.query(Prediction)
            .filter(Prediction.patient_id == patient_id)
            .order_by(Prediction.prediction_date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_vitals_id(self, db: Session, vitals_id: int) -> Prediction:
        return (
            db.query(Prediction)
            .filter(Prediction.vitals_id == vitals_id)
            .first()
        )

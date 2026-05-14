from typing import List
from sqlalchemy.orm import Session
from app.models.vitals import Vitals
from app.schemas.vitals import VitalsCreate, VitalsUpdate
from app.repositories.base import BaseRepository


class VitalsRepository(BaseRepository[Vitals, VitalsCreate, VitalsUpdate]):
    def get_by_patient_id(self, db: Session, patient_id: int, skip: int = 0, limit: int = 100) -> List[Vitals]:
        return (
            db.query(Vitals)
            .filter(Vitals.patient_id == patient_id)
            .order_by(Vitals.recorded_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_latest_by_patient_id(self, db: Session, patient_id: int) -> Vitals:
        return (
            db.query(Vitals)
            .filter(Vitals.patient_id == patient_id)
            .order_by(Vitals.recorded_at.desc())
            .first()
        )

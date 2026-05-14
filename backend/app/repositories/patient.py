from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate
from app.repositories.base import BaseRepository


class PatientRepository(BaseRepository[Patient, PatientCreate, PatientUpdate]):
    def get_by_user_id(self, db: Session, user_id: int, skip: int = 0, limit: int = 100):
        return (
            db.query(Patient)
            .filter(Patient.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def search(
        self, 
        db: Session, 
        user_id: int, 
        query: str, 
        skip: int = 0, 
        limit: int = 100
    ):
        return (
            db.query(Patient)
            .filter(
                Patient.user_id == user_id,
                (
                    (Patient.first_name.ilike(f"%{query}%")) |
                    (Patient.last_name.ilike(f"%{query}%")) |
                    (Patient.email.ilike(f"%{query}%")) |
                    (Patient.phone.ilike(f"%{query}%"))
                )
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def count_by_user_id(self, db: Session, user_id: int) -> int:
        return db.query(Patient).filter(Patient.user_id == user_id).count()

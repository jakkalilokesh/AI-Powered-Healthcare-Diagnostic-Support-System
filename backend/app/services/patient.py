from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate, PatientList
from app.repositories.patient import PatientRepository


class PatientService:
    def __init__(self, db: Session):
        self.db = db
        self.patient_repo = PatientRepository(Patient)
    
    def create_patient(self, user_id: int, patient_in: PatientCreate) -> Patient:
        patient_data = patient_in.model_dump()
        patient_data["user_id"] = user_id
        patient = Patient(**patient_data)
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient
    
    def get_patient(self, patient_id: int, user_id: int) -> Patient:
        patient = self.patient_repo.get(self.db, patient_id)
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found"
            )
        if patient.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to access this patient"
            )
        return patient
    
    def get_patients(
        self, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100,
        search: Optional[str] = None
    ) -> PatientList:
        if search:
            patients = self.patient_repo.search(self.db, user_id, search, skip, limit)
            total = len(patients)
        else:
            patients = self.patient_repo.get_by_user_id(self.db, user_id, skip, limit)
            total = self.patient_repo.count_by_user_id(self.db, user_id)
        
        return PatientList(
            patients=patients,
            total=total,
            page=skip // limit + 1,
            page_size=limit
        )
    
    def update_patient(
        self, 
        patient_id: int, 
        user_id: int, 
        patient_in: PatientUpdate
    ) -> Patient:
        patient = self.get_patient(patient_id, user_id)
        return self.patient_repo.update(self.db, patient, patient_in)
    
    def delete_patient(self, patient_id: int, user_id: int) -> Patient:
        patient = self.get_patient(patient_id, user_id)
        return self.patient_repo.delete(self.db, patient_id)

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.schemas.patient import Patient, PatientCreate, PatientUpdate, PatientList
from app.services.patient import PatientService
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.user import User

router = APIRouter()


@router.post("/", response_model=Patient, status_code=201)
def create_patient(
    patient_in: PatientCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient_service = PatientService(db)
    return patient_service.create_patient(current_user.id, patient_in)


@router.get("/", response_model=PatientList)
def get_patients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient_service = PatientService(db)
    return patient_service.get_patients(current_user.id, skip, limit, search)


@router.get("/{patient_id}", response_model=Patient)
def get_patient(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient_service = PatientService(db)
    return patient_service.get_patient(patient_id, current_user.id)


@router.put("/{patient_id}", response_model=Patient)
def update_patient(
    patient_id: int,
    patient_in: PatientUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient_service = PatientService(db)
    return patient_service.update_patient(patient_id, current_user.id, patient_in)


@router.delete("/{patient_id}", response_model=Patient)
def delete_patient(
    patient_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    patient_service = PatientService(db)
    return patient_service.delete_patient(patient_id, current_user.id)

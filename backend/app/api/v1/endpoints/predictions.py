from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.prediction import PredictionRequest, PredictionResponse, PredictionList
from app.services.prediction import PredictionService
from app.api.v1.endpoints.auth import get_current_user
from app.schemas.user import User

router = APIRouter()


@router.post("/", response_model=PredictionResponse, status_code=201)
def create_prediction(
    prediction_request: PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prediction_service = PredictionService(db)
    return prediction_service.create_prediction(
        current_user.id,
        prediction_request.patient_id,
        prediction_request
    )


@router.get("/patient/{patient_id}", response_model=PredictionList)
def get_patient_predictions(
    patient_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prediction_service = PredictionService(db)
    return prediction_service.get_patient_predictions(
        patient_id,
        current_user.id,
        skip,
        limit
    )


@router.get("/{prediction_id}")
def get_prediction(
    prediction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prediction_service = PredictionService(db)
    return prediction_service.get_prediction(prediction_id, current_user.id)

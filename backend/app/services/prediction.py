from typing import Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.prediction import Prediction
from app.models.vitals import Vitals
from app.schemas.prediction import PredictionCreate, PredictionRequest, PredictionResponse, PredictionList
from app.repositories.prediction import PredictionRepository
from app.repositories.vitals import VitalsRepository


class PredictionService:
    def __init__(self, db: Session):
        self.db = db
        self.prediction_repo = PredictionRepository(Prediction)
        self.vitals_repo = VitalsRepository(Vitals)
    
    def create_prediction(
        self, 
        user_id: int, 
        patient_id: int, 
        prediction_request: PredictionRequest
    ) -> PredictionResponse:
        from app.services.patient import PatientService
        patient_service = PatientService(self.db)
        patient = patient_service.get_patient(patient_id, user_id)
        
        # Build vitals data — extract only the vitals fields (exclude patient_id from request)
        vitals_fields = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs',
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ]
        request_data = prediction_request.model_dump()
        vitals_data = {k: request_data[k] for k in vitals_fields}
        
        # Create vitals record
        vitals = Vitals(patient_id=patient_id, **vitals_data)
        self.db.add(vitals)
        self.db.commit()
        self.db.refresh(vitals)
        
        # Get ML prediction — pass only the clean vitals data (no patient_id)
        from app.ml.predictor import HeartDiseasePredictor
        predictor = HeartDiseasePredictor()
        result = predictor.predict(vitals_data)
        
        # Create prediction record
        prediction_data = {
            "patient_id": patient_id,
            "vitals_id": vitals.id,
            "risk_probability": result["risk_probability"],
            "confidence_score": result["confidence_score"],
            "risk_level": result["risk_level"],
            "contributing_factors": result["contributing_factors"]
        }
        prediction = Prediction(**prediction_data)
        self.db.add(prediction)
        self.db.commit()
        self.db.refresh(prediction)
        
        return PredictionResponse(**prediction_data, id=prediction.id, prediction_date=prediction.prediction_date)
    
    def get_prediction(self, prediction_id: int, user_id: int) -> Prediction:
        from app.services.patient import PatientService
        patient_service = PatientService(self.db)
        
        prediction = self.prediction_repo.get(self.db, prediction_id)
        if not prediction:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Prediction not found"
            )
        
        patient_service.get_patient(prediction.patient_id, user_id)
        return prediction
    
    def get_patient_predictions(
        self, 
        patient_id: int, 
        user_id: int, 
        skip: int = 0, 
        limit: int = 100
    ) -> PredictionList:
        from app.services.patient import PatientService
        patient_service = PatientService(self.db)
        patient_service.get_patient(patient_id, user_id)
        
        predictions = self.prediction_repo.get_by_patient_id(self.db, patient_id, skip, limit)
        total = len(predictions)
        
        return PredictionList(
            predictions=predictions,
            total=total,
            page=skip // limit + 1,
            page_size=limit
        )

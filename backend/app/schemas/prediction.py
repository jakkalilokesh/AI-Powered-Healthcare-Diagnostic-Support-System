from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any


class PredictionBase(BaseModel):
    risk_probability: float = Field(..., ge=0.0, le=1.0)
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    risk_level: str = Field(..., regex="^(low|moderate|high|very_high)$")
    contributing_factors: Dict[str, float]
    notes: Optional[str] = None


class PredictionCreate(PredictionBase):
    patient_id: int
    vitals_id: int


class PredictionInDB(PredictionBase):
    id: int
    patient_id: int
    vitals_id: int
    prediction_date: datetime
    
    class Config:
        from_attributes = True


class Prediction(PredictionInDB):
    pass


class PredictionRequest(BaseModel):
    patient_id: int
    age: int = Field(..., ge=1, le=120)
    sex: int = Field(..., ge=0, le=1)
    cp: int = Field(..., ge=1, le=4)
    trestbps: int = Field(..., ge=80, le=200)
    chol: int = Field(..., ge=100, le=600)
    fbs: int = Field(..., ge=0, le=1)
    restecg: int = Field(..., ge=0, le=2)
    thalach: int = Field(..., ge=60, le=220)
    exang: int = Field(..., ge=0, le=1)
    oldpeak: float = Field(..., ge=0.0, le=6.0)
    slope: int = Field(..., ge=1, le=3)
    ca: int = Field(..., ge=0, le=4)
    thal: int = Field(..., ge=0, le=3)


class PredictionResponse(BaseModel):
    id: int
    patient_id: int
    risk_probability: float
    confidence_score: float
    risk_level: str
    contributing_factors: Dict[str, float]
    prediction_date: datetime
    notes: Optional[str]


class PredictionList(BaseModel):
    predictions: list[Prediction]
    total: int
    page: int
    page_size: int

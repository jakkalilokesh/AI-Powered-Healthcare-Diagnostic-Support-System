from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional


class VitalsBase(BaseModel):
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
    notes: Optional[str] = Field(None, max_length=500)


class VitalsCreate(VitalsBase):
    patient_id: int


class VitalsUpdate(BaseModel):
    age: Optional[int] = Field(None, ge=1, le=120)
    sex: Optional[int] = Field(None, ge=0, le=1)
    cp: Optional[int] = Field(None, ge=1, le=4)
    trestbps: Optional[int] = Field(None, ge=80, le=200)
    chol: Optional[int] = Field(None, ge=100, le=600)
    fbs: Optional[int] = Field(None, ge=0, le=1)
    restecg: Optional[int] = Field(None, ge=0, le=2)
    thalach: Optional[int] = Field(None, ge=60, le=220)
    exang: Optional[int] = Field(None, ge=0, le=1)
    oldpeak: Optional[float] = Field(None, ge=0.0, le=6.0)
    slope: Optional[int] = Field(None, ge=1, le=3)
    ca: Optional[int] = Field(None, ge=0, le=4)
    thal: Optional[int] = Field(None, ge=0, le=3)
    notes: Optional[str] = Field(None, max_length=500)


class VitalsInDB(VitalsBase):
    id: int
    patient_id: int
    recorded_at: datetime
    
    class Config:
        from_attributes = True


class Vitals(VitalsInDB):
    pass

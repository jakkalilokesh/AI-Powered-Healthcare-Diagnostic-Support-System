from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class PatientBase(BaseModel):
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=2, max_length=100)
    date_of_birth: datetime
    gender: str = Field(..., pattern="^(male|female|other)$")
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = None
    address: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    first_name: Optional[str] = Field(None, min_length=2, max_length=100)
    last_name: Optional[str] = Field(None, min_length=2, max_length=100)
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = Field(None, pattern="^(male|female|other)$")
    phone: Optional[str] = Field(None, max_length=20)
    email: Optional[str] = None
    address: Optional[str] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None


class PatientInDB(PatientBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class Patient(PatientInDB):
    pass


class PatientList(BaseModel):
    patients: list[Patient]
    total: int
    page: int
    page_size: int

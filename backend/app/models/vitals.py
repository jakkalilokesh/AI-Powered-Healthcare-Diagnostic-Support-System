from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Vitals(Base):
    __tablename__ = "vitals"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    age = Column(Integer, nullable=False)
    sex = Column(Integer, nullable=False)  # 1 = male, 0 = female
    cp = Column(Integer, nullable=False)  # chest pain type (1-4)
    trestbps = Column(Integer, nullable=False)  # resting blood pressure
    chol = Column(Integer, nullable=False)  # serum cholesterol
    fbs = Column(Integer, nullable=False)  # fasting blood sugar > 120 mg/dl
    restecg = Column(Integer, nullable=False)  # resting electrocardiographic results
    thalach = Column(Integer, nullable=False)  # maximum heart rate achieved
    exang = Column(Integer, nullable=False)  # exercise induced angina
    oldpeak = Column(Float, nullable=False)  # ST depression induced by exercise
    slope = Column(Integer, nullable=False)  # slope of the peak exercise ST segment
    ca = Column(Integer, nullable=False)  # number of major vessels
    thal = Column(Integer, nullable=False)  # thalassemia
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    notes = Column(String(500))
    
    patient = relationship("Patient", back_populates="vitals")

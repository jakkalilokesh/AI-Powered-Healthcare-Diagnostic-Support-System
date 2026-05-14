from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, Text, JSON, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False)
    vitals_id = Column(Integer, ForeignKey("vitals.id", ondelete="CASCADE"), nullable=False)
    risk_probability = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    contributing_factors = Column(JSON, nullable=False)
    prediction_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    notes = Column(Text)

    patient = relationship("Patient", back_populates="predictions")
    vitals = relationship("Vitals", back_populates="predictions")
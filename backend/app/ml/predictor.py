import joblib
import numpy as np
from typing import Dict, Any
import os


class HeartDiseasePredictor:
    def __init__(self):
        self.model = None
        self.feature_names = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ]
        self.load_model()
    
    def load_model(self):
        model_path = os.path.join(os.path.dirname(__file__), '../../ml/models/heart_disease_model.pkl')
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        else:
            raise FileNotFoundError(
                "Model not found. Please train the model first using the training script."
            )
    
    def predict(self, vitals_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.model is None:
            raise ValueError("Model not loaded")
        
        # Extract features in the correct order
        features = np.array([[
            vitals_data['age'],
            vitals_data['sex'],
            vitals_data['cp'],
            vitals_data['trestbps'],
            vitals_data['chol'],
            vitals_data['fbs'],
            vitals_data['restecg'],
            vitals_data['thalach'],
            vitals_data['exang'],
            vitals_data['oldpeak'],
            vitals_data['slope'],
            vitals_data['ca'],
            vitals_data['thal']
        ]])
        
        # Get prediction probability
        risk_probability = float(self.model.predict_proba(features)[0][1])
        
        # Calculate confidence score based on prediction certainty
        confidence_score = abs(risk_probability - 0.5) * 2
        
        # Determine risk level
        if risk_probability < 0.2:
            risk_level = "low"
        elif risk_probability < 0.4:
            risk_level = "moderate"
        elif risk_probability < 0.7:
            risk_level = "high"
        else:
            risk_level = "very_high"
        
        # Get feature importance
        feature_importance = dict(zip(
            self.feature_names,
            self.model.feature_importances_
        ))
        
        # Calculate contributing factors based on feature importance and actual values
        contributing_factors = self._calculate_contributing_factors(
            vitals_data, 
            feature_importance
        )
        
        return {
            "risk_probability": risk_probability,
            "confidence_score": confidence_score,
            "risk_level": risk_level,
            "contributing_factors": contributing_factors
        }
    
    def _calculate_contributing_factors(
        self, 
        vitals_data: Dict[str, Any], 
        feature_importance: Dict[str, float]
    ) -> Dict[str, float]:
        contributing_factors = {}
        
        # Normalize and weight the contributing factors
        for feature, importance in feature_importance.items():
            value = vitals_data.get(feature, 0)
            
            # Normalize the value to 0-1 range based on typical ranges
            normalized_value = self._normalize_feature(feature, value)
            
            # Weight by importance
            contributing_factor = importance * normalized_value
            contributing_factors[feature] = round(contributing_factor, 4)
        
        # Sort by contribution
        contributing_factors = dict(
            sorted(contributing_factors.items(), key=lambda x: x[1], reverse=True)
        )
        
        return contributing_factors
    
    def _normalize_feature(self, feature: str, value: float) -> float:
        normalization_ranges = {
            'age': (20, 80),
            'sex': (0, 1),
            'cp': (1, 4),
            'trestbps': (90, 200),
            'chol': (150, 400),
            'fbs': (0, 1),
            'restecg': (0, 2),
            'thalach': (70, 200),
            'exang': (0, 1),
            'oldpeak': (0, 6),
            'slope': (1, 3),
            'ca': (0, 4),
            'thal': (0, 3)
        }
        
        if feature in normalization_ranges:
            min_val, max_val = normalization_ranges[feature]
            if max_val > min_val:
                return (value - min_val) / (max_val - min_val)
        
        return 0.5

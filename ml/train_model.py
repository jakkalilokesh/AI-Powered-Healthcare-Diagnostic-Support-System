"""
ML Model Training Script for Heart Disease Prediction
This script trains a Random Forest classifier on the UCI Heart Disease dataset
and saves the trained model for use in the prediction service.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import os
import urllib.request
import sys

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

class HeartDiseaseModelTrainer:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ]
        self.model_dir = os.path.join(os.path.dirname(__file__), 'models')
    
    def load_data(self):
        """Load UCI Heart Disease dataset from URL"""
        print("Loading UCI Heart Disease dataset...")
        url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
        
        # Column names for the dataset
        column_names = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target'
        ]
        
        try:
            # Load data
            df = pd.read_csv(url, names=column_names, na_values='?')
            
            # Handle missing values
            df = df.dropna()
            
            # Convert target: 0 = no disease, 1-4 = disease (convert to binary)
            df['target'] = df['target'].apply(lambda x: 1 if x > 0 else 0)
            
            print(f"Dataset loaded successfully with {len(df)} samples")
            return df
        except Exception as e:
            print(f"Error loading dataset: {e}")
            print("Using fallback synthetic data for demonstration...")
            return self.generate_synthetic_data()
    
    def generate_synthetic_data(self):
        """Generate synthetic data for demonstration if URL fails"""
        np.random.seed(42)
        n_samples = 303
        
        data = {
            'age': np.random.randint(29, 77, n_samples),
            'sex': np.random.randint(0, 2, n_samples),
            'cp': np.random.randint(1, 5, n_samples),
            'trestbps': np.random.randint(94, 200, n_samples),
            'chol': np.random.randint(126, 564, n_samples),
            'fbs': np.random.randint(0, 2, n_samples),
            'restecg': np.random.randint(0, 3, n_samples),
            'thalach': np.random.randint(71, 202, n_samples),
            'exang': np.random.randint(0, 2, n_samples),
            'oldpeak': np.random.uniform(0, 6.2, n_samples),
            'slope': np.random.randint(1, 4, n_samples),
            'ca': np.random.randint(0, 5, n_samples),
            'thal': np.random.randint(0, 4, n_samples),
            'target': np.random.randint(0, 2, n_samples)
        }
        
        df = pd.DataFrame(data)
        print(f"Generated synthetic dataset with {len(df)} samples")
        return df
    
    def preprocess_data(self, df):
        """Preprocess data for training"""
        print("Preprocessing data...")
        
        # Select features
        X = df[self.feature_names]
        y = df['target']
        
        # Scale features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        print(f"Features shape: {X_scaled.shape}")
        print(f"Target distribution: {np.bincount(y)}")
        
        return X_scaled, y
    
    def train_model(self, X, y):
        """Train Random Forest classifier"""
        print("Training Random Forest model...")
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        # Train Random Forest
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            class_weight='balanced'
        )
        
        self.model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Cross-validation
        cv_scores = cross_val_score(self.model, X, y, cv=5)
        
        print(f"\n{'='*50}")
        print(f"Model Accuracy: {accuracy:.4f}")
        print(f"Cross-validation Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        print(f"{'='*50}\n")
        
        print("Classification Report:")
        print(classification_report(y_test, y_pred))
        
        # Feature importance
        feature_importance = dict(zip(self.feature_names, self.model.feature_importances_))
        print("\nFeature Importance:")
        for feature, importance in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True):
            print(f"  {feature}: {importance:.4f}")
        
        return accuracy
    
    def save_model(self):
        """Save trained model to disk"""
        os.makedirs(self.model_dir, exist_ok=True)
        
        model_path = os.path.join(self.model_dir, 'heart_disease_model.pkl')
        joblib.dump(self.model, model_path)
        
        print(f"\nModel saved to: {model_path}")
        
        # Also save to backend ml/models directory
        backend_model_dir = os.path.join(os.path.dirname(__file__), '..', 'backend', 'ml', 'models')
        os.makedirs(backend_model_dir, exist_ok=True)
        backend_model_path = os.path.join(backend_model_dir, 'heart_disease_model.pkl')
        joblib.dump(self.model, backend_model_path)
        print(f"Model also saved to: {backend_model_path}")
    
    def run_training(self):
        """Execute the complete training pipeline"""
        print("="*60)
        print("Heart Disease Model Training Pipeline")
        print("="*60)
        
        # Load data
        df = self.load_data()
        
        # Preprocess
        X, y = self.preprocess_data(df)
        
        # Train
        accuracy = self.train_model(X, y)
        
        # Save
        self.save_model()
        
        print("\n" + "="*60)
        print("Training completed successfully!")
        print(f"Final Model Accuracy: {accuracy:.4f}")
        print("="*60)
        
        return accuracy


if __name__ == "__main__":
    trainer = HeartDiseaseModelTrainer()
    try:
        trainer.run_training()
    except Exception as e:
        print(f"\nError during training: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

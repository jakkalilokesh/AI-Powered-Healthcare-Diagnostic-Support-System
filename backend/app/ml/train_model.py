import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import os
import urllib.request


class HeartDiseaseModelTrainer:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_names = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal'
        ]
    
    def load_data(self):
        # UCI Heart Disease dataset URL
        url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
        
        # Column names for the dataset
        column_names = [
            'age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 
            'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'target'
        ]
        
        # Load data
        df = pd.read_csv(url, names=column_names, na_values='?')
        
        # Handle missing values
        df = df.dropna()
        
        # Convert target: 0 = no disease, 1-4 = disease (convert to binary)
        df['target'] = df['target'].apply(lambda x: 1 if x > 0 else 0)
        
        return df
    
    def preprocess_data(self, df):
        # Select features
        X = df[self.feature_names]
        y = df['target']
        
        # Scale features
        self.scaler = StandardScaler()
        X_scaled = self.scaler.fit_transform(X)
        
        return X_scaled, y
    
    def train_model(self, X, y):
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
        
        print(f"Model Accuracy: {accuracy:.4f}")
        print(f"Cross-validation Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        # Feature importance
        feature_importance = dict(zip(self.feature_names, self.model.feature_importances_))
        print("\nFeature Importance:")
        for feature, importance in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True):
            print(f"{feature}: {importance:.4f}")
        
        return accuracy
    
    def save_model(self, model_dir):
        os.makedirs(model_dir, exist_ok=True)
        
        model_path = os.path.join(model_dir, 'heart_disease_model.pkl')
        joblib.dump(self.model, model_path)
        
        print(f"\nModel saved to {model_path}")
    
    def run_training(self):
        print("Loading data...")
        df = self.load_data()
        print(f"Dataset loaded with {len(df)} samples")
        
        print("\nPreprocessing data...")
        X, y = self.preprocess_data(df)
        
        print("\nTraining model...")
        accuracy = self.train_model(X, y)
        
        print("\nSaving model...")
        model_dir = os.path.join(os.path.dirname(__file__), '../../ml/models')
        self.save_model(model_dir)
        
        print("\nTraining completed successfully!")
        return accuracy


if __name__ == "__main__":
    trainer = HeartDiseaseModelTrainer()
    trainer.run_training()

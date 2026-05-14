# AI-Powered Healthcare Diagnostic Support System

A production-ready, full-stack healthcare diagnostic platform for heart disease risk prediction using machine learning.

## 🏥 Features

### Backend (FastAPI)
- **JWT Authentication** with HTTP-only cookies for secure session management
- **Role-Based Access Control** (Admin, Doctor, Nurse)
- **Patient Management** - Full CRUD operations with search functionality
- **Heart Disease Prediction** - AI-powered risk assessment using Random Forest
- **Explainable AI** - Feature importance and contributing factors for predictions
- **RESTful API** with OpenAPI/Swagger documentation
- **Database Migrations** with Alembic
- **Security** - Password hashing, CSRF protection, SQL injection prevention

### Frontend (React + Vite)
- **Glassmorphism UI** - Premium medical dashboard design
- **Authentication** - Login/Register with animated backgrounds
- **Patient Dashboard** - Comprehensive patient management interface
- **Prediction Interface** - Interactive vitals input with real-time results
- **Analytics Dashboard** - Charts, insights, and performance metrics
- **Responsive Design** - Mobile-friendly layout
- **State Management** - Zustand for global state
- **Data Fetching** - TanStack Query for efficient API calls
- **Animations** - Framer Motion for smooth transitions

### Machine Learning
- **Random Forest Classifier** trained on UCI Heart Disease dataset
- **Risk Probability** - 0-100% risk assessment
- **Confidence Score** - Model certainty metrics
- **Contributing Factors** - Explainable feature importance
- **Model Versioning** - Joblib for model persistence

## 🚀 Tech Stack

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy ORM
- MySQL 8.0
- Alembic (Migrations)
- JWT (python-jose)
- Scikit-learn
- Pandas
- NumPy

### Frontend
- React 18
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router v7
- Axios
- React Hook Form + Zod
- TanStack Query
- Framer Motion
- Recharts (Analytics)

### DevOps
- Docker
- Docker Compose
- Nginx

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0
- Docker & Docker Compose (optional)

## 🔧 Installation

### Option 1: Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd AI-Powered Healthcare Diagnostic Support System
```

2. Create environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

3. Update environment variables in `backend/.env`:
```env
DATABASE_URL=mysql+pymysql://healthcare_user:healthcare_password@localhost:3306/healthcare_diagnostic
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
```

4. Start the application:
```bash
docker-compose up --build
```

5. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs

### Option 2: Local Development

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Run database migrations:
```bash
alembic upgrade head
```

6. Train ML model:
```bash
python ml/train_model.py
```

7. Start the backend server:
```bash
python run.py
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## 📊 Database Schema

### Tables
- **users** - User accounts with roles
- **patients** - Patient demographics and medical history
- **vitals** - Patient vital signs for prediction
- **predictions** - Prediction results and explanations

## 🔐 Security Features

- **Password Hashing** - bcrypt with configurable rounds
- **JWT Tokens** - Access (15min) and Refresh (7 days) tokens
- **HTTP-only Cookies** - Secure token storage
- **CORS Configuration** - Controlled cross-origin requests
- **SQL Injection Prevention** - Parameterized queries via ORM
- **Input Validation** - Pydantic schemas on backend, Zod on frontend
- **Rate Limiting** - Configurable request limits

## 📱 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user

### Patients
- `POST /api/v1/patients` - Create patient
- `GET /api/v1/patients` - List patients (with pagination, search)
- `GET /api/v1/patients/{id}` - Get patient details
- `PUT /api/v1/patients/{id}` - Update patient
- `DELETE /api/v1/patients/{id}` - Delete patient

### Predictions
- `POST /api/v1/predictions` - Run heart disease prediction
- `GET /api/v1/predictions/patient/{patient_id}` - Get prediction history
- `GET /api/v1/predictions/{id}` - Get specific prediction

## 🧪 ML Model

The heart disease prediction model is trained on the UCI Heart Disease dataset using a Random Forest classifier.

**Features Used:**
- Age, Sex, Chest Pain Type
- Resting Blood Pressure, Cholesterol
- Fasting Blood Sugar, Rest ECG
- Maximum Heart Rate, Exercise Angina
- ST Depression, Slope, CA, Thal

**Output:**
- Risk Probability (0-100%)
- Confidence Score (0-100%)
- Risk Level (Low, Moderate, High, Very High)
- Contributing Factors with weights

## 🎨 UI/UX Features

- **Glassmorphism Design** - Modern, premium aesthetic
- **Animated Backgrounds** - Cinematic medical-themed visuals
- **Staggered Animations** - Smooth page transitions
- **Skeleton Loaders** - Better perceived performance
- **Error Boundaries** - Graceful error handling
- **Toast Notifications** - User feedback
- **Responsive Layout** - Mobile-friendly design

## 📈 Analytics Dashboard

- Risk Distribution (Pie Chart)
- Monthly Predictions Trend (Line Chart)
- Patient Age Distribution (Bar Chart)
- Key Performance Metrics
- Model Accuracy Statistics

## 🔧 Configuration

### Backend Environment Variables
```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/database
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7
BCRYPT_ROUNDS=12
CORS_ORIGINS=http://localhost:5173
RATE_LIMIT_PER_MINUTE=60
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 🚢 Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Manual Deployment
1. Set up MySQL database
2. Configure environment variables
3. Run database migrations
4. Train ML model
5. Start backend server
6. Build and serve frontend

## 📝 Project Structure

```
AI-Powered Healthcare Diagnostic Support System/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Configuration & security
│   │   ├── models/       # SQLAlchemy models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Data access layer
│   │   ├── ml/           # Machine learning
│   │   └── main.py       # FastAPI app
│   ├── alembic/          # Database migrations
│   ├── requirements.txt
│   ├── Dockerfile
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Zustand stores
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utility functions
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Healthcare AI Development Team

## 🙏 Acknowledgments

- UCI Machine Learning Repository for the Heart Disease dataset
- FastAPI, React, and the open-source community

## ⚠️ Disclaimer

This system is for educational and demonstration purposes only. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

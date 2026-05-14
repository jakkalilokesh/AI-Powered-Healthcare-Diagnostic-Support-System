# Healthcare Diagnostic Backend

FastAPI backend for AI-powered Heart Disease Risk Prediction Platform.

## Features

- JWT Authentication with HTTP-only cookies
- Patient Management (CRUD operations)
- Heart Disease Prediction with Random Forest ML model
- Role-based access control
- SQLAlchemy ORM with MySQL
- Alembic database migrations

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. Run database migrations:
```bash
alembic upgrade head
```

4. Train ML model:
```bash
python -m app.ml.train_model
```

5. Run the server:
```bash
python run.py
```

## API Documentation

- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/              # API endpoints
│   ├── core/             # Configuration and security
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── ml/               # Machine learning pipeline
│   └── main.py           # FastAPI application
├── alembic/              # Database migrations
├── tests/                # Test suite
├── requirements.txt      # Python dependencies
└── run.py               # Application entry point
```

## Security

- Password hashing with bcrypt
- JWT tokens with configurable expiry
- HTTP-only cookies for token storage
- CORS configuration
- SQL injection prevention via ORM
- Input validation with Pydantic

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import api_router
from app.core.database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Healthcare Diagnostic API",
    description="AI-powered Heart Disease Risk Prediction Platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "message": "Healthcare Diagnostic API",
        "version": "1.0.0",
        "docs": "/api/docs"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}

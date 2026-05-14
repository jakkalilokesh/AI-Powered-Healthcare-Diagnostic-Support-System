from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import api_router
from app.core.database import Base, engine

import time
from sqlalchemy.exc import OperationalError

# Create database tables with retries
MAX_RETRIES = 5
for i in range(MAX_RETRIES):
    try:
        Base.metadata.create_all(bind=engine)
        break
    except OperationalError as e:
        if i == MAX_RETRIES - 1:
            raise e
        print(f"Database connection failed. Retrying in 5 seconds... ({i+1}/{MAX_RETRIES})")
        time.sleep(5)

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

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."},
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

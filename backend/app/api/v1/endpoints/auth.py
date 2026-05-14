from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_access_token, verify_refresh_token
from app.schemas.user import UserCreate, UserLogin, Token, User, RefreshTokenRequest
from app.services.auth import AuthService
from app.core.config import settings

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> User:
    # Try to get token from Authorization header
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        payload = verify_access_token(token)
        if payload:
            user_id = int(payload.get("sub"))
            auth_service = AuthService(db)
            return auth_service.get_current_user(user_id)
    
    # Try to get token from cookie
    token = request.cookies.get("access_token")
    if token:
        payload = verify_access_token(token)
        if payload:
            user_id = int(payload.get("sub"))
            auth_service = AuthService(db)
            return auth_service.get_current_user(user_id)
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials"
    )


@router.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    user = auth_service.register(user_in)
    return user


@router.post("/login", response_model=Token)
def login(
    user_in: UserLogin,
    response: Response,
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    token = auth_service.login(user_in)
    
    # Set HTTP-only cookies
    response.set_cookie(
        key="access_token",
        value=token.access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    
    response.set_cookie(
        key="refresh_token",
        value=token.refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return token


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    return {"message": "Successfully logged out"}



@router.post("/refresh", response_model=Token)
def refresh_token(
    request: Request,
    response: Response,
    refresh_in: Optional[RefreshTokenRequest] = None,
    db: Session = Depends(get_db)
):
    refresh_token_val = None
    
    # Try body first (frontend's new preference)
    if refresh_in:
        refresh_token_val = refresh_in.refresh_token
    
    # Fallback to cookie
    if not refresh_token_val:
        refresh_token_val = request.cookies.get("refresh_token")
        
    if not refresh_token_val:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found"
        )
    
    payload = verify_refresh_token(refresh_token_val)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    user_id = int(payload.get("sub"))
    auth_service = AuthService(db)
    token = auth_service.refresh_token(user_id)
    
    # Still set cookies as a backup/for other clients
    response.set_cookie(
        key="access_token",
        value=token.access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    
    response.set_cookie(
        key="refresh_token",
        value=token.refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
    )
    
    return token


@router.get("/me", response_model=User)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

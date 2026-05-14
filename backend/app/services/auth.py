from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, Token
from app.repositories.user import UserRepository
from app.core.security import (
    verify_password, 
    create_access_token, 
    create_refresh_token,
    get_password_hash
)


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(User)
    
    def register(self, user_in: UserCreate) -> User:
        existing_user = self.user_repo.get_by_email(self.db, user_in.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        existing_username = self.user_repo.get_by_username(self.db, user_in.username)
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        return self.user_repo.create(self.db, user_in)
    
    def login(self, user_in: UserLogin) -> Token:
        user = self.user_repo.get_by_username(self.db, user_in.username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        
        if not verify_password(user_in.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is inactive"
            )
        
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token
        )
    
    def get_current_user(self, user_id: int) -> User:
        user = self.user_repo.get(self.db, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    
    def refresh_token(self, user_id: int) -> Token:
        user = self.get_current_user(user_id)
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token
        )

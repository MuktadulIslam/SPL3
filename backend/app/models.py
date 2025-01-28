from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    profile_image: Optional[str] = None
    registration_time: datetime = datetime.utcnow()

class UserInDB(UserCreate):
    id: str

class TokenData(BaseModel):
    email: str
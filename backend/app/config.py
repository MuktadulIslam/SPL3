import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    host: str = os.getenv("HOST", "127.0.0.1")  # Default value
    port: int = int(os.getenv("PORT", 8000))     # Default value
    debug: bool = os.getenv("DEBUG", "True").lower() in ["true", "1", "t"]  # Default value
    app_name: str = os.getenv("APP_NAME", "My FastAPI Application")  # Default value
    version: str = os.getenv("VERSION", "1.0.0")  # Default value
    api_prefix: str = os.getenv("API_PREFIX", "/api")  # Default value

    class Config:
        env_file = ".env"  # Load environment variables from this file

settings = Settings()

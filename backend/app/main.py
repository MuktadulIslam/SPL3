from fastapi import FastAPI
from .config import settings
from .routes import zip_file_routers

app = FastAPI(title=settings.app_name, version=settings.version)
app = FastAPI()

# Use the configured API prefix for routing
app.include_router(zip_file_routers.router, prefix=settings.api_prefix)

@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI application!"}

@app.get("/settings")
async def get_settings():
    return {
        "host": settings.host,
        "port": settings.port,
        "debug": settings.debug,
        "app_name": settings.app_name,
        "version": settings.version,
        "api_prefix": settings.api_prefix,
    }


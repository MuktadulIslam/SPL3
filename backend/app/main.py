from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routes import prediction_routers
from .services.attribute_extractor import getProvidedAttributes
from .database.mongobd import MongoDBHandler

app = FastAPI(title=settings.app_name, version=settings.version)
app = FastAPI()

# Use the configured API prefix for routing
app.include_router(prediction_routers.router, prefix=settings.api_prefix.rstrip('/') + '/predict')

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins.split(",") if settings.cors_allow_origins != "*" else ["*"],
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods.split(",") if settings.cors_allow_methods != "*" else ["*"],
    allow_headers=settings.cors_allow_headers.split(",") if settings.cors_allow_headers != "*" else ["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the DefectLens application!"}

@app.get("/user_projects")
async def get_user_projects(user_id: str = Query(..., description="User ID to filter projects")):
    mongoDBHandler = MongoDBHandler()
    return {"history": list(mongoDBHandler.get_user_projects(user_id=user_id))}


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

@app.get("/provided-attributes")
async def get_settings():
    return {
        "attributes": getProvidedAttributes()
    }
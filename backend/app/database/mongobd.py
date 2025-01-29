from pymongo import MongoClient
from typing import List, Dict, Any, Optional
import uuid
from pymongo.errors import PyMongoError  # Import exception for MongoDB errors

class MongoDBHandler:
    def __init__(self, connection_url: str = "mongodb://localhost:27017/"):
        try:
            self.client = MongoClient(connection_url)
            self.db = self.client['defectlens']
            
            # Create collections
            self.projects = self.db['projects']
            self.prediction_data = self.db['projectsPredictionData']
            self.metrics_data = self.db['projectMetricsData']
            
            # Ensure indexes exist before creating them
            self._ensure_index(self.projects, "project_hash")
            self._ensure_index(self.prediction_data, "project_hash")
            self._ensure_index(self.prediction_data, "project_hash")
        except PyMongoError as e:
            print(f"Error initializing MongoDB connection: {e}")

    def _ensure_index(self, collection, field, unique=False):
        """Ensure index exists before creating it"""
        try:
            existing_indexes = collection.index_information()
            index_name = f"{field}_1"
            
            if index_name in existing_indexes:
                return  # Index already exists, no need to create it again
            
            collection.create_index([(field, 1)], unique=unique)
        except PyMongoError as e:
            print(f"Error ensuring index on {field}: {e}")
    
    # Store Functions
    def store_project(self, user_id: str, submitted_at: str, project_hash: str, project_name: str, project_type: str) -> str:
        project_data = {
            "user_id": user_id,
            "submitted_at": submitted_at,
            "project_hash": project_hash,
            "project_name": project_name,
            "project_type": project_type
        }
        
        try:
            self.projects.insert_one(project_data)
        except PyMongoError as e:
            print(f"Error storing project data: {e}")
        return project_hash

    def store_prediction_data(self, model_id: str, project_hash: str, prediction_data: List[Dict[str, Any]]) -> str:
        """Store prediction data and return the prediction ID"""
        prediction_id = str(uuid.uuid4())
        prediction_record = {
            "model_id": model_id,
            "project_hash": project_hash,
            "prediction_data": prediction_data,
            "prediction_id": prediction_id
        }
        
        try:
            self.prediction_data.insert_one(prediction_record)
        except PyMongoError as e:
            print(f"Error storing prediction data: {e}")
        return prediction_id

    def store_metrics_data(self, project_hash: str, metrics: Dict[str, Any], system_version: str) -> bool:
        """Store metrics data and return success status"""
        metrics_record = {
            "project_hash": project_hash,
            "metrics": metrics,
            "system_version": system_version
        }
        
        try:
            result = self.metrics_data.insert_one(metrics_record)
            return bool(result.inserted_id)
        except PyMongoError as e:
            print(f"Error storing metrics data: {e}")
            return False

    # Get Functions
    def get_project(self, project_hash: str) -> Optional[Dict[str, Any]]:
        """Retrieve project by project hash"""
        try:
            return self.projects.find_one({"project_hash": project_hash}, {"_id": 0})
        except PyMongoError as e:
            print(f"Error fetching project data: {e}")
            return None

    def get_user_projects(self, user_id: str) -> List[Dict[str, Any]]:
        """Retrieve all projects for a specific user"""
        try:
            return list(self.projects.find({"user_id": user_id}, {"_id": 0}))
        except PyMongoError as e:
            print(f"Error fetching user projects: {e}")
            return []

    def get_prediction_data(self, project_hash: str) -> Optional[Dict[str, Any]]:
        """Retrieve prediction data for a specific project"""
        try:
            return self.prediction_data.find_one({"project_hash": project_hash}, {"_id": 0})
        except PyMongoError as e:
            print(f"Error fetching prediction data: {e}")
            return None

    def get_metrics_data(self, project_hash: str) -> Optional[Dict[str, Any]]:
        """Retrieve metrics data for a specific project"""
        try:
            return self.metrics_data.find_one({"project_hash": project_hash}, {"_id": 0})
        except PyMongoError as e:
            print(f"Error fetching metrics data: {e}")
            return None

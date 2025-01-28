from pymongo import MongoClient
from bson import ObjectId

# MongoDB connection
MONGODB_URL = "mongodb://localhost:27017"
client = MongoClient(MONGODB_URL)
db = client['user_auth_db']
users = db.users
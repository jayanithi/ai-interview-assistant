# ==========================================
# database/mongo.py
# ==========================================

from pymongo import MongoClient

client = MongoClient(
    "mongodb://localhost:27017/"
)

db = client["ai_interview"]

# COLLECTIONS

users_collection = db["users"]

resume_collection = db["resumes"]

interview_collection = db["interviews"]

analytics_collection = db["analytics"]

feedback_collection = db["feedback"]

settings_collection = db["settings"]

reports_collection = db["reports"]
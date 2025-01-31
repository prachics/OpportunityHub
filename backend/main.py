from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import os

app = FastAPI()

# Allow CORS for React frontend (localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# MongoDB Atlas Connection
MONGO_URI = "mongodb+srv://saibewarp:saibewarp@cluster0.t9nwk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(MONGO_URI)
db = client["jobcruncher"]
collection = db["jobs"]

@app.get("/")
def home():
    return {"message": "Welcome to JobCruncher API!"}

@app.get("/jobs")
def get_jobs(
    title: str = Query(None, description="Filter by job title"),
    company: str = Query(None, description="Filter by company"),
    location: str = Query(None, description="Filter by location"),
    limit: int = Query(10, description="Number of jobs to return"),
):
    query = {}
    if title:
        query["title"] = {"$regex": title, "$options": "i"}
    if company:
        query["company"] = {"$regex": company, "$options": "i"}
    if location:
        query["location"] = {"$regex": location, "$options": "i"}

    jobs = list(collection.find(query, {"_id": 0}).limit(limit))
    return {"count": len(jobs), "jobs": jobs}

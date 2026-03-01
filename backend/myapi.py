from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import Annotated
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import asyncio
import certifi
from datetime import datetime, timedelta
import aiofiles
import os
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware


uri = "mongodb+srv://kaneki_ken:kaneki_ken123@cluster0.9ta61s4.mongodb.net/?retryWrites=true&w=majority"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

# Update this line in your code
ca = certifi.where()
client = AsyncIOMotorClient(uri, tlsCAFile=ca)
db = client["nologin_db"]

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For MVP, allow everything. For production, use your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "stored_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# 1. Setup Async MongoDB Connection
# Use the same URI, just with the Async client

client = AsyncIOMotorClient(uri, tlsCAFile=certifi.where())
db = client.nologin_db
shares_collection = db.shares

# 2. Connection Check on Startup
@app.on_event("startup")
async def startup_db_client():
    try:
        # The ping command for Motor
        await client.admin.command('ping')
        print("🚀 [BACKEND INFO] Successfully connected to MongoDB Atlas!")
        
        # Create the Self-Destruct Index (TTL)
        # This tells Mongo to delete the doc at the 'expireAt' time
        await shares_collection.create_index("expireAt", expireAfterSeconds=0)
    except Exception as e:
        print(f"❌ Connection failed: {e}")



@app.post("/upload")
async def process_anonymous_upload(
    custom_slug: Annotated[str, Form(...)], 
    hours: Annotated[int, Form(...)],
    file: UploadFile = File(...)
):
    # 1. Check if the URL slug is already taken in MongoDB
    existing_link = await shares_collection.find_one({"slug": custom_slug})
    if existing_link:
        raise HTTPException(status_code=400, detail="This URL is already taken!")

    # 2. Calculate the 'Death Clock' (Current Time + User Hours)
    # Important: Use UTC time to avoid timezone confusion
    expire_date = datetime.utcnow() + timedelta(hours=hours)

    # 3. Read the file (In Phase 3, Member C's AI will scan file_bytes here)
    file_bytes = await file.read()

    # 4. Create the Database Document
    new_share = {
        "slug": custom_slug,
        "filename": file.filename,
        "size": len(file_bytes),
        "expireAt": expire_date,  # MongoDB watches this field
        "created_at": datetime.utcnow(),
        "is_safe": True # Placeholder for Member C's AI result
    }

    # 5. Insert into MongoDB
    await shares_collection.insert_one(new_share)

    # Format: slug_original_name
    file_path = os.path.join(UPLOAD_DIR, f"{custom_slug}_{file.filename}")

    # Save the file to your hard drive asynchronously (use file_bytes already read above)
    async with aiofiles.open(file_path, 'wb') as out_file:
        await out_file.write(file_bytes)

    # Update your MongoDB document to include the file_path
    # This helps you find the file later when someone visits the URL
    await shares_collection.update_one(
        {"slug": custom_slug},
        {"$set": {"local_path": file_path}}
    )

    return {
        "status": "File Saved Locally & Logged in MongoDB",
        "share_url": f"nologin.in/{custom_slug}",
        "will_expire_at": expire_date.strftime("%Y-%m-%d %H:%M:%S UTC")
    }

@app.get("/download/{slug}")
async def download_file(slug: str):
    file_record = await db["shares"].find_one({"slug": slug})

    if not file_record:
        raise HTTPException(status_code=404, detail="File not found")

    file_path = file_record["local_path"]

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File missing on server")

    return FileResponse(
        path=file_path,
        media_type="application/octet-stream",
        filename=file_record["filename"],
    )
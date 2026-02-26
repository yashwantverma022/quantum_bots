from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import Annotated
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import asyncio
import certifi
from datetime import datetime, timedelta

uri = "mongodb+srv://kaneki_ken:kaneki_ken123@cluster0.9ta61s4.mongodb.net/?appName=Cluster0"

# Update this line in your code
ca = certifi.where()
client = AsyncIOMotorClient(uri, tlsCAFile=ca)
app = FastAPI()

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

    return {
        "status": "success",
        "share_url": f"nologin.in/{custom_slug}",
        "will_expire_at": expire_date.strftime("%Y-%m-%d %H:%M:%S UTC")
    }
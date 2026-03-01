from fastapi import APIRouter, FastAPI, UploadFile, File, Form, HTTPException
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
import base64
from openai import OpenAI
import shutil
import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from fastapi.responses import RedirectResponse


uri = "mongodb+srv://kaneki_ken:kaneki_ken123@cluster0.9ta61s4.mongodb.net/?retryWrites=true&w=majority"

ai_client = OpenAI(api_key=os.getenv("openai_api_key"))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

cloudinary.config( 
  cloud_name = "dstsz4hdr", 
  api_key = "736425739498859", 
  api_secret = "9FbYlhcU4nKHGlKFeumCu8j-VpE",
  secure = True
)

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

async def start_cleanup_worker():
    # Start the background task to watch for 'Death Clock' events
    asyncio.create_task(watch_for_expirations())

async def watch_for_expirations():
    """Watches MongoDB for deleted documents to trigger Cloudinary wipe."""
    async with shares_collection.watch([{"$match": {"operationType": "delete"}}]) as stream:
        async for change in stream:
            # Note: You'll need to store the public_id in a separate 'pending_delete' 
            # collection or use MongoDB Change Streams with 'fullDocumentBeforeChange' 
            # enabled to get the Cloudinary ID after the record is gone.
            print("🚀 [THE WIPE] TTL Expired. Syncing cloud deletion...")



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
    base64_image = base64.b64encode(file_bytes).decode('utf-8')

    # 3. AI Moderation Check (Omni-Moderation-Latest)
    # We use to_thread so the AI check doesn't freeze the backend
    try:
        response = await asyncio.to_thread(
            ai_client.moderations.create,
            model="omni-moderation-latest",
            input=[
                {"type": "text", "text": custom_slug},
                {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
            ]
        )
        
        print("\n🤖 --- AI MODERATION RESPONSE --- 🤖")
        print(response.results[0].model_dump_json(indent=2))
        # 4. "The Wipe" - Block and ignore if flagged
        if response.results[0].flagged:
            raise HTTPException(status_code=400, detail="AI Safety Check: Content violates policy.")
            
    except Exception as e:
        if isinstance(e, HTTPException): raise e
        print(f"Moderation Error: {e}")
        # Optional: Decide if you want to fail-safe or fail-closed here

    try:
        upload_result = await asyncio.to_thread(
            cloudinary.uploader.upload,
            file_bytes,
            public_id=custom_slug,
            folder="nologin_vault",
            overwrite=True,
            resource_type="auto"
        )
        cloudinary_url = upload_result.get("secure_url")
        print(f"✅ Cloudinary Confirmed: {upload_result['public_id']} has been stored.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cloudinary Upload Failed: {e}")

    # 5. Success! Calculate 'Death Clock' and Save
    expire_date = datetime.utcnow() + timedelta(hours=hours)
    

    # 4. Create the Database Document
    new_share = {
        "slug": custom_slug,
        "filename": file.filename,
        "cloudinary_url": cloudinary_url,
        "public_id": upload_result["public_id"], # Needed for "The Wipe"
        "expireAt": expire_date,
        "created_at": datetime.utcnow(),
    }

    # 5. Insert into MongoDB
    await shares_collection.insert_one(new_share)

    

    return {"share_url": f"nologin.in/{custom_slug}", "expiry": expire_date}

@app.get("/download/{slug}")
async def download_file(slug: str):
    # 1. Find the record in the 'shares' collection
    file_record = await shares_collection.find_one({"slug": slug})

    if not file_record:
        raise HTTPException(status_code=404, detail="Link expired or never existed.")

    # 2. Get the Cloudinary URL we saved during upload
    cloudinary_url = file_record.get("cloudinary_url")

    if not cloudinary_url:
        raise HTTPException(status_code=404, detail="File path missing in database.")

    # 3. Redirect the user to Cloudinary for the actual download
    # 'resource_type="auto"' in upload ensures Cloudinary handles all file types
    return RedirectResponse(url=cloudinary_url)


if __name__ == "__main__":
    import uvicorn
    # host 0.0.0.0 allows connections from other devices on your network (e.g. phone, Loveable preview)
    uvicorn.run(app, host="0.0.0.0", port=8000)
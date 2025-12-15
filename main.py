from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import pandas as pd
from io import BytesIO
import logic   # <-- normal import (NOT: from . import logic)
import os

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Since all files (index.html, style.css, script.js) are in SAME folder:
app.mount("/static", StaticFiles(directory="."), name="static")

@app.get("/")
def read_root():
    return FileResponse('index.html')

@app.get("/style.css")
def read_style():
    return FileResponse('style.css')

@app.get("/script.js")
def read_script():
    return FileResponse('script.js')

@app.get("/api/template")
def get_template():
    try:
        output = logic.generate_template_file()
        return StreamingResponse(
            output,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=data_detail_template.xlsx"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-plan")
async def generate_plan(file: UploadFile = File(...)):
    if not file.filename.endswith('.xlsx'):
        raise HTTPException(status_code=400, detail="Invalid file format. Please upload an Excel file.")
    
    try:
        contents = await file.read()
        result = logic.process_plan(contents)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing plan: {str(e)}")

@app.post("/api/download-plan")
async def download_plan(file: UploadFile = File(...)):
    return {"message": "Use frontend to export CSV from data"}

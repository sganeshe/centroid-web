from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from logic import process_image

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...), 
    num_colors: int = Form(5) # Default to 5 if not provided
):
    contents = await file.read()
    # Pass num_colors to your logic function
    results = process_image(contents, num_colors=num_colors)
    return {"palette": results}
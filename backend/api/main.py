from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from services.gpt_scene_parser import parse_story_to_scenes
from services.replicate_image_gen import generate_image
from rendering.full_render_pipeline import generate_and_upload_videos
import os

load_dotenv()

app = FastAPI()

# 👇 Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev, restrict in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Kids Story Generator API is running."}

@app.post("/parse-story")
async def parse_story(request: Request):
    body = await request.json()
    story_text = body.get("story_text", "")
    if not story_text:
        return {"error": "No story text provided."}
    scenes = parse_story_to_scenes(story_text)
    return {"scenes": scenes}

from fastapi import Request
from fastapi.responses import JSONResponse

@app.post("/generate-image")
async def generate_image_endpoint(request: Request):
    body = await request.json()
    prompt = body.get("prompt", "")
    if not prompt:
        return JSONResponse(content={"error": "Missing prompt"}, status_code=400)

    image_url = generate_image(prompt)
    print (image_url)
    return JSONResponse(content={"image_url": image_url})

@app.post("/render-video")
async def render_video_endpoint(request: Request):
    body = await request.json()
    project_id = body.get("project_id")
    scenes = body.get("scenes", [])

    if not project_id or not scenes:
        return JSONResponse(content={"error": "Missing project_id or scenes"}, status_code=400)

    video_path = generate_and_upload_videos(project_id, scenes)

    if not video_path or not os.path.exists(video_path):
        return JSONResponse(content={"error": "Video generation failed"}, status_code=500)

    return JSONResponse(content={"video_url": f"http://localhost:8000/videos/{video_path}"})
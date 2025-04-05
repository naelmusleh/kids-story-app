from rendering.moviepy_renderer import render_video_from_scenes
from moviepy.editor import concatenate_videoclips, AudioFileClip
from moviepy.editor import ImageClip
import requests
import subprocess
import os

from PIL import Image
from io import BytesIO

def download(url, filename):
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to download image: {url} — {response.status_code}")

    # Verify it's an actual image
    try:
        Image.open(BytesIO(response.content)).verify()
    except Exception as e:
        raise Exception(f"Downloaded file is not a valid image: {url}\n{e}")

    with open(filename, 'wb') as f:
        f.write(response.content)

def generate_narration(text, output_path):
    api_key = os.getenv("ELEVENLABS_API_KEY")
    voice_id = "EXAVITQu4vr4xnSDxMaL"  # You can change this voice from their docs

    headers = {
        "xi-api-key": api_key,
        "Content-Type": "application/json"
    }

    payload = {
        "text": text,
        "model_id": "eleven_monolingual_v1",
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75
        }
    }

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

    response = requests.post(url, headers=headers, json=payload, stream=True)
    if response.status_code == 200:
        with open(output_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
    else:
        raise Exception(f"ElevenLabs API error: {response.status_code} - {response.text}")

def concatenate_audio_clips(clips, output_path):
    list_file = os.path.join(os.path.dirname(output_path), "file_list.txt")
    
    with open(list_file, "w") as f:
        for clip in clips:
            # Write the clip path as RELATIVE to the list file
            rel_path = os.path.relpath(clip, os.path.dirname(list_file))
            f.write(f"file '{rel_path}'\n")
    
    result = subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", list_file, "-c", "copy", output_path
    ], capture_output=True, text=True)

    if result.returncode != 0:
        raise Exception(f"FFmpeg failed:\n{result.stderr}")

def generate_and_upload_videos(project_id, scenes):
    print("🎬 Starting video generation...")

    temp_dir = f"temp_space_{project_id}"
    os.makedirs(temp_dir, exist_ok=True)

    video_clips = []
    narration_clips = []

    for i, scene in enumerate(scenes):
        print(f"📥 Downloading image for scene {i}")
        img_path = os.path.join(temp_dir, f"scene_{i}.png")
        download(scene["image_url"], img_path)

        print(f"🗣️ Generating narration for scene {i}")
        narration_path = os.path.join(temp_dir, f"scene_{i}.mp3")
        generate_narration(scene["narration_text"], narration_path)
        narration_clips.append(narration_path)

        img_clip = ImageClip(img_path).set_duration(5)  # Or use dynamic duration
        video_clips.append(img_clip)

    # 🧠 Step 1: Stitch narration clips into one audio file
    full_narration_path = os.path.join(temp_dir, "final_narration.mp3")
    concatenate_audio_clips(narration_clips, full_narration_path)

    # 🎞️ Step 2: Combine video + narration into final video
    print("🎞️ Rendering final video...")
    video = concatenate_videoclips(video_clips, method="compose")
    audio = AudioFileClip(full_narration_path)
    final = video.set_audio(audio)

    output_path = os.path.join(temp_dir, f"{project_id}_final_video.mp4")
    final.write_videofile(output_path, fps=24)

    # 🚀 Optional: Upload to Supabase or S3
    return output_path

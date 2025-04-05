from moviepy.editor import *
import os

def render_video_from_scenes(scenes, narration_path, output_path):
    clips = []
    for i, scene in enumerate(scenes):
        img = ImageClip(scene["image_url"]).set_duration(scene.get("duration", 5))
        clips.append(img)

    video = concatenate_videoclips(clips, method="compose")
    audio = AudioFileClip(narration_path)
    final = video.set_audio(audio)
    final.write_videofile(output_path, fps=24)
    return output_path
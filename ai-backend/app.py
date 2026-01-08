from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import whisper
import yt_dlp
import os
import re
from llm_summarizer import summarize_transcript
import requests


app = FastAPI()

# ✅ Allow React to call Python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for development only
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str


class FastVideoExtractor:
    def __init__(self):
        print("🚀 Loading Whisper model...")
        self.model = whisper.load_model("tiny")
        print("✅ Whisper loaded")

    def download_audio(self, video_url):
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '128',
            }],
            'outtmpl': 'temp_audio',
            'quiet': True
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            title = info.get("title", "Unknown")
            duration = info.get("duration", 0)

        return "temp_audio.mp3", title, duration

    def transcribe(self, audio_path):
        result = self.model.transcribe(audio_path, fp16=False)
        return result["text"], result.get("language", "unknown")

    def extract_sentences(self, text):
        sentences = re.split(r'[.!?]+', text)
        return [s.strip() for s in sentences if len(s.strip()) > 20]


    def extract(self, url):
        audio, title, duration = self.download_audio(url)
        transcript, language = self.transcribe(audio)

        os.remove(audio)
        llm_result = summarize_transcript(transcript)
        save_transcript_to_db(title, transcript)

        return {
            "title": title,
            "language": language,
            "duration": f"{duration//60}:{duration%60:02d}",
            "summary": llm_result["summary"],
            "keypoints": llm_result["keypoints"],
            "transcript": transcript
        }



extractor = FastVideoExtractor()


@app.post("/extract")
def extract_video(data: VideoRequest):
    try:
        return extractor.extract(data.url)
    except Exception as e:
        import traceback
        traceback.print_exc()   # 👈 THIS IS THE KEY
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/")
def root():
    return {"status": "MindEase backend running"}




def save_transcript_to_db(title, transcript):
    url = "https://pretty-youth.up.railway.app/api/content/save-transcript"  # Node backend
    payload = {
        "title": title,
        "transcript": transcript
    }
    requests.post(url, json=payload)




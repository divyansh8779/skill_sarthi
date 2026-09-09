# backend/app/services/stt_tts_service.py
import os
import requests
from ..config import settings
from typing import Optional

def transcribe_audio_bytes(audio_bytes: bytes, filename: str = "audio.wav", language: Optional[str] = None) -> dict:
    """
    Transcribe using Hugging Face Whisper inference or local model if configured.
    """
    if settings.HF_API_TOKEN:
        url = "https://api-inference.huggingface.co/models/openai/whisper-large"
        headers = {"Authorization": f"Bearer {settings.HF_API_TOKEN}"}
        files = {"file": (filename, audio_bytes)}
        resp = requests.post(url, headers=headers, files=files, timeout=60)
        resp.raise_for_status()
        data = resp.json()
        # HF whisper returns {'text': '...'}
        return {"text": data.get("text", ""), "language": language or "unknown"}
    else:
        # Fallback: return empty or demo text
        return {"text": "demo transcription (no HF token configured)", "language": language or "en"}

def synthesize_text_to_audio(text: str, language: str = "en") -> dict:
    """
    If COQUI_TTS_URL is set, call it to synthesize and return audio bytes.
    Otherwise return a payload instructing frontend to use browser TTS.
    """
    if settings.COQUI_TTS_URL:
        url = settings.COQUI_TTS_URL.rstrip("/") + "/api/tts"
        payload = {"text": text, "lang": language}
        resp = requests.post(url, json=payload, timeout=30)
        resp.raise_for_status()
        # Expect binary audio in response
        return {"audio_bytes": resp.content, "content_type": resp.headers.get("Content-Type", "audio/wav")}
    else:
        return {"audio_bytes": None, "content_type": None, "note": "no-coqui;use-browser-tts"}

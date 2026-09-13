# backend/app/routers/ai.py
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException, Response
from ..schemas import AIChatRequest
from ..services.ai_service import call_hf_chat
from ..services.stt_tts_service import transcribe_audio_bytes, synthesize_text_to_audio
from typing import Optional
import io

router = APIRouter(prefix="/ai", tags=["ai"])

@router.post("/chat")

def chat(req: AIChatRequest):
    # Basic prompt engineering: include context and scheme knowledge (RAG stub)
    prompt = req.message
    if req.context:
        prompt = f"{req.context}\n\nUser: {req.message}"
    resp = call_hf_chat(prompt, language=req.language or "en")
    return {"text": resp["text"], "language": resp.get("language", "en")}

@router.post("/transcribe")
async def transcribe(file: UploadFile = File(...), language: Optional[str] = Form(None)):
    content = await file.read()
    result = transcribe_audio_bytes(content, filename=file.filename, language=language)
    return {"text": result["text"], "language": result.get("language", "en")}

@router.post("/synthesize")
def synthesize(text: str = Form(...), language: Optional[str] = Form("en")):
    result = synthesize_text_to_audio(text, language=language)
    if result.get("audio_bytes"):
        return Response(content=result["audio_bytes"], media_type=result["content_type"])
    return {"note": result.get("note", "no-audio"), "text": text}

# backend/app/services/ai_service.py
import os
import requests
from typing import Optional
from ..config import settings

HF_API = settings.HF_API_TOKEN
HF_MODEL = settings.HF_MODEL

def call_hf_chat(prompt: str, language: str = "en") -> dict:
    """
    Calls Hugging Face text-generation inference endpoint.
    Requires HF_API_TOKEN in env. For local models, replace this with local HTTP call.
    """
    if not HF_API:
        # Fallback: simple rule-based reply for offline/hack demo
        return {"text": f"I heard: {prompt}. (demo fallback, set HF_API_TOKEN for better responses)", "language": language}

    url = f"https://api-inference.huggingface.co/models/{HF_MODEL}"
    headers = {"Authorization": f"Bearer {HF_API}"}
    payload = {"inputs": prompt, "parameters": {"max_new_tokens": 256, "temperature": 0.2}}
    resp = requests.post(url, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    # HF returns list or dict depending on model
    if isinstance(data, list) and len(data) > 0 and "generated_text" in data[0]:
        text = data[0]["generated_text"]
    elif isinstance(data, dict) and "generated_text" in data:
        text = data["generated_text"]
    else:
        # Some models return plain text
        text = str(data)
    return {"text": text, "language": language}

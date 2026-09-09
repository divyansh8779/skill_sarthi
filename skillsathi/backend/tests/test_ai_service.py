# backend/tests/test_ai_service.py
from project.skill_sarthi.skillsathi.backend.app.services.ai_service import call_hf_chat

def test_call_hf_chat_fallback():
    # If HF token not set in CI, fallback returns demo text
    resp = call_hf_chat("Hello test", language="en")
    assert "text" in resp
    assert isinstance(resp["text"], str)

# AI & Voice Integration Guide

## Choices made
- **LLM**: Hugging Face Inference API (model configurable via HF_MODEL). Pros: easy HTTP integration, many models available on free tier. Cons: rate limits, latency, and free-tier quotas. Alternative: run a local model via Ollama or text-generation-webui for offline/higher-throughput.
- **STT**: Whisper via Hugging Face Inference (openai/whisper-large) or local whisper.cpp. Pros: multilingual, robust. Cons: heavy compute for local; HF has rate limits.
- **TTS**: Coqui TTS self-hosted (recommended) or browser SpeechSynthesis fallback. Coqui gives better Indian language support when models are available; requires hosting (Docker).
- **RAG / Vector DB**: FAISS local index. For production, use Milvus/Weaviate or managed vector DB.

## How to obtain keys / setup
- **Hugging Face**: Create account, generate an access token (Settings → Access Tokens). Set `HF_API_TOKEN` in backend `.env`.
- **Coqui TTS**: Optionally run Coqui TTS server in Docker. Set `COQUI_TTS_URL` to the server URL.
- **Local STT**: For offline, install `whisper.cpp` or `openai/whisper` locally and set `ENABLE_LOCAL_STT=true`.

## Where in code
- **LLM call**: `backend/app/services/ai_service.py` → `call_hf_chat()`. Change `HF_MODEL` in `.env` to switch models.
- **STT**: `backend/app/services/stt_tts_service.py` → `transcribe_audio_bytes()` uses HF whisper inference when `HF_API_TOKEN` is set.
- **TTS**: `backend/app/services/stt_tts_service.py` → `synthesize_text_to_audio()` calls `COQUI_TTS_URL` if provided; otherwise returns a note for frontend to use browser TTS.
- **Endpoints**:
  - `POST /ai/chat` → `backend/app/routers/ai.py` calls `call_hf_chat`.
  - `POST /ai/transcribe` → accepts multipart audio and calls `transcribe_audio_bytes`.
  - `POST /ai/synthesize` → accepts text and returns audio bytes or a note.

## Extending to more Indian languages
- **Frontend i18n**: Add language keys in `frontend/src/i18n.ts` and add language switcher options.
- **Backend**: Pass `language` field from frontend to `/ai/chat` and `/ai/transcribe`. Use language-specific prompt templates or model parameters.
- **TTS/STT**: Ensure chosen TTS/STT models support the target language. For Coqui, download or fine-tune models for Hindi/Tamil/Telugu. For Whisper, language detection is built-in; pass `language` param to improve accuracy.

## Rate limits & monitoring
- Hugging Face free tier has quotas. Monitor usage in your HF account. For production, consider local models or paid tiers.
- Implement caching for repeated prompts and limit audio length on frontend to reduce costs.

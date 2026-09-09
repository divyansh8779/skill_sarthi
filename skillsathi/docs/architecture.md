# Architecture Overview

## High-level components
- **Frontend (React + TypeScript + Vite + Tailwind)**
  - UI pages: Home, Login, Register, Dashboard, Schemes.
  - Voice UI: MicRecorder records audio, ChatWidget displays conversation and roadmap.
  - i18n: i18next for English + Hindi (extendable).
  - Communicates with backend via REST API (`/auth`, `/schemes`, `/ai/*`).

- **Backend (FastAPI + Pydantic + SQLAlchemy)**
  - Auth: JWT-based register/login.
  - Domain: Schemes, Applications, Users.
  - AI service layer:
    - **LLM**: calls Hugging Face Inference API or local LLM endpoint.
    - **STT**: calls Whisper (HF or local whisper.cpp).
    - **TTS**: calls Coqui TTS (self-hosted) or instructs frontend to use browser TTS.
    - **RAG**: FAISS index + sentence-transformers embeddings for grounding scheme answers.
  - Exposes endpoints:
    - `GET /health`
    - `POST /auth/register`, `POST /auth/login`
    - `GET /schemes`, `GET /schemes/{code}`
    - `POST /ai/transcribe`, `POST /ai/chat`, `POST /ai/synthesize`

- **Database**
  - PostgreSQL stores users, schemes, applications, and optionally cached passages for RAG.

- **Optional local AI host**
  - A stronger machine (16 GB+) can run local LLM/Whisper/Coqui and expose HTTP endpoints.
  - Backend can be configured to call local endpoints instead of remote HF APIs.

## Data flow (typical user interaction)
1. **User** clicks mic in frontend → browser records audio.
2. **Frontend** uploads audio to `POST /ai/transcribe`.
3. **Backend** transcribes audio (Whisper HF or local) → returns transcript + language.
4. **Frontend** displays transcript and sends text to `POST /ai/chat`.
5. **Backend**:
   - Optionally retrieves relevant passages from FAISS (RAG).
   - Builds a prompt including user profile + retrieved passages.
   - Calls LLM (HF or local) to generate roadmap, matched schemes, and steps.
6. **Backend** returns structured response `{ roadmap, schemes, sources }`.
7. **Frontend** displays roadmap and offers `Speak` button.
8. **Frontend** calls `POST /ai/synthesize` or uses browser TTS to play audio.

## Deployment options
- **Prototype (fastest)**: Backend uses HF Inference API; frontend uses browser TTS/STT fallback.
- **Offline-capable**: Host Whisper/LLM/Coqui on a local 16 GB+ machine and point backend to those endpoints.
- **Scaling**: Replace FAISS with managed vector DB (Weaviate/Milvus) and move LLM to GPU-backed instances.

## Security & privacy notes
- Store JWT secret securely; do not commit `.env`.
- Transcripts and personal data should be stored only if user consents.
- Log LLM outputs and sources for auditability when answering scheme-related queries.

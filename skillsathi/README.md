# SkillSathi — AI-Powered Voice-First Career & Skill Navigator

**SIH Problem ID**: [PLACEHOLDER]  
**Team**: [YOUR TEAM NAME]

One-line: Voice-first, multilingual assistant that recommends skill roadmaps and matches students to government schemes.

## Quickstart (local with Docker)
1. Copy env files:
   - `cp backend/.env.example backend/.env`
   - Edit `backend/.env` to set HF_API_TOKEN if available.
2. Start services:
   - `cd infra && docker-compose up --build`
3. Frontend available at `http://localhost:5173`, backend at `http://localhost:8000`.

## Docs
- AI & voice integration: `docs/ai_voice_integration.md`
- Deployment: `docs/deployment.md`
- SIH notes & demo flow: `docs/sih_notes.md`
- Architecture: `docs/architecture.md`

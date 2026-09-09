# SIH Notes

## Problem statement template
[PASTE YOUR SIH PROBLEM STATEMENT / THEME HERE]

## Solution overview (aligned to SIH criteria)
- **Innovation**: Voice-first, multilingual AI that auto-matches students to government schemes and auto-fills forms.
- **Feasibility**: Uses open-source models (Whisper, Coqui, HF models) and lightweight infra (FastAPI, Postgres, FAISS).
- **Impact**: Targets Tier-2/3 students, low-literacy users; measurable outcomes: schemes applied, roadmaps completed.

## Demo flow for judges
1. Show login/register.
2. Switch language to Hindi.
3. Click mic, speak "I like computers, I'm in class 10, I want a job soon".
4. Show transcription, AI chat reply with recommended skill path (e.g., Data Entry Operator), matched schemes (PMKVY), and step-by-step roadmap.
5. Show auto-fill demo for scheme application (stub).
6. Show offline demo: record, then disconnect network, show cached transcript and queued sync.

## Pitch bullets
- Voice-first for low-literacy users.
- Scheme-aware: PMKVY/NAPS/SOAR integration.
- Offline-first: local ASR + caching.
- Measurable KPIs: users onboarded, schemes applied, course completions.

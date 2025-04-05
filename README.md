# Kids Story Video Generator

This app converts text or audio into animated kids' story videos with multilingual narration and YouTube-ready export. Built with Next.js, FastAPI, Supabase, and AI APIs.

## Features
- Text or audio input
- AI scene breakdown (GPT-4)
- Image generation (Stable Diffusion)
- Voice narration (ElevenLabs, Google TTS)
- Video rendering (MoviePy, FFmpeg)
- Multilingual support
- Human-in-the-loop review options
- YouTube export
- Stripe-based pricing tiers

---

## Project Structure
- `frontend/`: Next.js web app (user UI)
- `backend/`: FastAPI service (AI, rendering, APIs)
- `config/`, `scripts/`, `.github/`: Supporting files

---

## Getting Started (Local Dev)

### 1. Clone the repo
```bash
git clone your-repo-url
cd kids-story-app
```

### 2. Set up environment variables

Create `.env.local` in:
- `frontend/` (use `.env.example`)
- `backend/` (use `.env.example`)

### 3. Install and run the frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Install and run the backend
```bash
cd backend
pip install -r requirements.txt
uvicorn api.main:app --reload
```

---

## Deployment
- **Frontend**: Vercel (connect your GitHub repo)
- **Backend**: Render, Fly.io, or Railway
- **CI/CD**: GitHub Actions included

---

## API Keys Required
- OpenAI
- Replicate (Stable Diffusion)
- ElevenLabs
- Google Cloud TTS
- Supabase

Happy building!
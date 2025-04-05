# 🧑‍💻 Developer Onboarding Guide — Kids Story Video Generator

Welcome to the team! This guide will help you set up your local environment, understand the architecture, and contribute effectively.

---

## 🚀 Project Overview

This app converts text or audio into animated kids' story videos with multilingual narration. It includes:
- Text/audio input
- AI scene parsing (GPT-4)
- Image generation (Stable Diffusion)
- Narration generation (ElevenLabs)
- Video rendering (MoviePy)
- Uploads to S3
- User dashboard, auth, and pricing tiers

---

## 🛠️ Tech Stack

| Layer        | Tech                          |
|--------------|-------------------------------|
| Frontend     | Next.js (React), Supabase     |
| Backend      | FastAPI, Python, MoviePy      |
| Image Gen    | Stable Diffusion (Replicate)  |
| Voice Gen    | ElevenLabs, Google TTS        |
| Storage      | AWS S3                        |
| Auth         | Supabase                      |
| CI/CD        | GitHub Actions, Firebase Hosting |

---

## ⚙️ Local Setup

### 1. Clone the Repo

```bash
git clone https://github.com/your-org/kids-story-app.git
cd kids-story-app
```

### 2. Set Up Environment Variables

Create `.env.local` in:

#### `frontend/.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### `backend/.env`
```
OPENAI_API_KEY=your-openai-key
REPLICATE_API_TOKEN=your-replicate-token
ELEVENLABS_API_KEY=your-elevenlabs-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role
AWS_ACCESS_KEY_ID=your-s3-key
AWS_SECRET_ACCESS_KEY=your-s3-secret
```

---

## 💻 Running the App

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

### Backend (FastAPI + MoviePy)

```bash
cd backend
pip install -r requirements.txt
uvicorn api.main:app --reload
```

Or use Docker:

```bash
docker-compose up --build
```

---

## 🧪 Testing

```bash
flake8 backend
```

---

## ☁️ Deployment

### Frontend → Firebase

```bash
npm run build
npm run export
firebase deploy
```

### Backend → Render/Fly.io/Docker

Use `docker-compose.yml` or connect GitHub repo to Render.

---

## 🧪 CI/CD (GitHub Actions)

Automatically:
- Builds frontend
- Deploys Firebase
- Lints backend Python code

Ensure you set these GitHub secrets:
- `FIREBASE_SERVICE_ACCOUNT`
- `OPENAI_API_KEY`, `REPLICATE_API_TOKEN`, `ELEVENLABS_API_KEY`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`

---

## 📁 Project Structure

```
kids-story-app/
├── frontend/      # Next.js web UI
├── backend/       # FastAPI + AI + rendering
├── rendering/     # MoviePy video generation
├── services/      # AI calls (GPT, TTS, images)
├── utils/         # Upload tools
├── config/        # Supabase schema SQL
├── scripts/       # Optional automations
├── .github/       # CI/CD workflows
├── docker-compose.yml
```

---

## 👏 Contribution Guidelines

- Feature branches: `feature/your-feature-name`
- Always lint Python code before PRs: `flake8 backend`
- Open issues for bugs and enhancements
- PRs should include screenshots/videos for UI changes

---

Welcome aboard! 🎉
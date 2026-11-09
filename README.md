<div align="center">

# 🎓 LearnMate AI

### Your Personal AI-Powered Learning Companion

*An intelligent, agentic learning platform that transforms your career goals into structured, personalized learning roadmaps — powered by IBM Granite and watsonx.ai.*

[![Python](https://img.shields.io/badge/Python-3.11+-3776ab?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-latest-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Langflow](https://img.shields.io/badge/Langflow-agentic_AI-ff6b6b?style=flat-square)](https://langflow.org)
[![IBM watsonx.ai](https://img.shields.io/badge/IBM_watsonx.ai-Granite-be95ff?style=flat-square&logo=ibm&logoColor=white)](https://www.ibm.com/watsonx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

## 📖 Overview

**LearnMate AI** is a full-stack, agentic AI application that helps learners discover and follow personalized learning pathways based on their current skills, interests, and career goals.

Unlike generic course platforms, LearnMate AI uses **IBM Granite large language models** via **Langflow agentic workflows** to generate adaptive, goal-aware learning plans that evolve as you progress. The platform identifies where you are today, maps where you want to go, and guides you there — step by step.

### Why LearnMate AI?

| Problem | LearnMate AI Solution |
|---|---|
| Generic one-size-fits-all courses | Personalized pathway built around *your* exact skill gaps |
| No clear starting point | Structured learner assessment identifies your current level |
| Static learning plans | Adaptive pathways that update based on your progress and feedback |
| Overwhelming resource discovery | Curated, AI-matched course and resource recommendations |
| Learning in isolation | Conversational AI companion available at every step |

---

## ✨ Key Features

### 🧠 Learner Assessment
A guided onboarding experience that captures your current skills, target role, learning interests, and weekly availability — forming the foundation for your personalized journey.

### 🗺️ Personalized Learning Pathways
IBM Granite generates a structured, milestone-based roadmap tailored to your specific profile. Each milestone includes a title, description, curated resources, and a logical progression order.

### 🎯 Skill Gap Analysis
The platform identifies the exact skills standing between you and your target role, ranked by priority (high / medium / low) with actionable rationale for each gap.

### 📚 Course & Resource Recommendations
Curated recommendations matched to your identified skill gaps — including courses, tutorials, books, videos, and articles — each tagged with type, estimated duration, and the skill it addresses.

### 🔄 Adaptive Learning
Submit feedback on your progress at any time. LearnMate AI re-evaluates your pathway and adjusts upcoming milestones based on what you have completed and how you have found the journey so far.

### 📈 Progress Tracking
A milestone checklist with a visual progress bar. Request an AI-generated narrative summary of your journey — reflecting on completed milestones and mapping the road ahead.

### 💬 AI Learning Companion
A conversational AI assistant with full awareness of your session context (profile, pathway stage, recent progress). Ask questions, get encouragement, or request clarification on any topic throughout your learning journey.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Browser (Client)                              │
│         React 18 · TypeScript · Vite · Tailwind CSS             │
│                        shadcn/ui                                 │
│                                                                  │
│  Onboarding  │  Pathway  │  Skills  │  Recs  │  Progress  │  Chat│
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTP/JSON  (X-Session-ID header)
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FastAPI Backend  (port 8000)                    │
│                                                                  │
│  Routers:  session · pathway · skills · recommendations         │
│            progress · companion                                  │
│                                                                  │
│  Services: one per domain — Langflow-first, stub fallback        │
│  Session:  in-memory dict[UUID → SessionState]                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │  HTTP REST  POST /api/v1/run/{flow_id}
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Langflow Server  (port 7860)                    │
│                                                                  │
│  pathway-generation    skill-gap-analysis    course-recommendations│
│  adaptive-update       progress-summary      learning-companion  │
└──────────────────────────┬──────────────────────────────────────┘
                           │  LLM calls
                 ┌─────────┴──────────┐
                 ▼                    ▼
       GraniteStub.py          GraniteWatsonx.py
      (mock, _mock:true)    (ibm/granite-13b-chat-v2)
      default / dev mode       production mode
```

### Design Principles

| Principle | Implementation |
|---|---|
| **Stub-first AI** | `GraniteStub.py` returns lightly dynamic, role-aware mock responses so the full app runs without any watsonx.ai credentials |
| **Zero-friction swap** | Switching to real IBM Granite requires only 4 env vars + one Langflow component swap — no backend code changes |
| **Graceful fallback** | If Langflow is unavailable, every backend service calls `granite_stub.py` directly — the app works without Docker |
| **Session-scoped state** | All learner data lives in an in-memory `SessionState` object, threaded through every AI call for contextual responses |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, TypeScript, Vite | UI framework and build tooling |
| **UI Components** | Tailwind CSS v3, shadcn/ui | Styling and accessible component library |
| **Backend** | Python 3.11, FastAPI, Uvicorn | REST API and async service orchestration |
| **Data Validation** | Pydantic v2 | Request/response models and session state |
| **HTTP Client** | httpx | Async calls from backend to Langflow |
| **AI Orchestration** | Langflow | Visual agentic workflow builder |
| **AI Model** | IBM Granite (ibm/granite-13b-chat-v2) | Large language model via IBM watsonx.ai |
| **Testing** | pytest, pytest-asyncio | Backend service unit tests |
| **Infrastructure** | Docker, Docker Compose | Container orchestration |

---

## 📋 Prerequisites

Ensure the following are installed before getting started:

| Tool | Minimum Version | Install |
|---|---|---|
| **Node.js** | 20.x LTS | [nodejs.org](https://nodejs.org) |
| **Python** | 3.11 | [python.org](https://python.org) |
| **Docker Desktop** | Latest stable | [docker.com](https://www.docker.com/products/docker-desktop) |
| **Git** | Any recent | [git-scm.com](https://git-scm.com) |

> **No IBM watsonx.ai account needed to run the app.** The default stub mode works fully offline.

---

## 🚀 Quick Start

### Option A — Docker (Full Stack, Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/sharatkumar-dev/learnmate-ai.git
cd learnmate-ai

# 2. Create your environment file
cp .env.example .env
# No changes needed to run in stub mode

# 3. Launch all three services
docker-compose up

# ✅ App is ready:
#   Frontend (React UI)   →  http://localhost:5173
#   Backend  (FastAPI)    →  http://localhost:8000
#   API Docs (Swagger)    →  http://localhost:8000/docs
#   Langflow (AI Flows)   →  http://localhost:7860
```

### Option B — Local Development (No Docker)

```bash
# Terminal 1 — Python backend
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000

# Terminal 2 — React frontend
cd frontend
npm install
npm run dev
```

> **Stub mode is active by default.** All AI responses come from `GraniteStub.py` and are flagged with `"_mock": true`. The UI shows a dismissible "Preview Mode" banner on all data screens.

---

## ⚙️ Configuration

Copy `.env.example` to `.env`. All variables have sensible defaults for local development.

```bash
cp .env.example .env
```

| Variable | Default | Required for | Description |
|---|---|---|---|
| `LANGFLOW_BASE_URL` | `http://localhost:7860` | Langflow mode | URL of the running Langflow server |
| `LANGFLOW_API_KEY` | *(empty)* | Optional | Langflow API key if auth is enabled |
| `WATSONX_API_KEY` | *(empty)* | Real Granite | IBM Cloud API key |
| `WATSONX_PROJECT_ID` | *(empty)* | Real Granite | IBM watsonx.ai project ID |
| `WATSONX_URL` | `https://us-south.ml.cloud.ibm.com` | Real Granite | IBM watsonx.ai regional endpoint |
| `FLOW_ID_PATHWAY_GENERATION` | *(empty)* | Langflow mode | UUID of imported pathway-generation flow |
| `FLOW_ID_SKILL_GAP_ANALYSIS` | *(empty)* | Langflow mode | UUID of imported skill-gap-analysis flow |
| `FLOW_ID_COURSE_RECOMMENDATIONS` | *(empty)* | Langflow mode | UUID of imported course-recommendations flow |
| `FLOW_ID_ADAPTIVE_UPDATE` | *(empty)* | Langflow mode | UUID of imported adaptive-update flow |
| `FLOW_ID_PROGRESS_SUMMARY` | *(empty)* | Langflow mode | UUID of imported progress-summary flow |
| `FLOW_ID_LEARNING_COMPANION` | *(empty)* | Langflow mode | UUID of imported learning-companion flow |

### Operating Modes

```
No env vars set         →  Stub mode    (GraniteStub.py, _mock:true, no external dependencies)
FLOW_ID_* vars set      →  Langflow mode (calls Langflow flows, still using GraniteStub by default)
WATSONX_* vars set      →  Live AI mode  (real IBM Granite via GraniteWatsonx.py)
```

---

## 🔗 API Reference

Interactive documentation: **[http://localhost:8000/docs](http://localhost:8000/docs)** (Swagger UI) · **[http://localhost:8000/redoc](http://localhost:8000/redoc)**

| Method | Endpoint | Auth | Request Body | Description |
|---|---|---|---|---|
| `GET` | `/health` | — | — | Service health check |
| `POST` | `/api/session/start` | — | `{ profile? }` | Create learner session, returns `session_id` |
| `GET` | `/api/session/{id}` | Session ID | — | Retrieve full session state |
| `POST` | `/api/skills/analyze` | Session ID | `{ current_skills, target_role }` | Run skill gap analysis |
| `POST` | `/api/pathway/generate` | Session ID | `{ profile }` | Generate personalized learning pathway |
| `POST` | `/api/pathway/adapt` | Session ID | `{ feedback, completed_milestone_ids }` | Adapt pathway based on progress |
| `POST` | `/api/recommendations` | Session ID | — | Get curated resource recommendations |
| `POST` | `/api/progress/update` | Session ID | `{ milestone_id }` | Mark a milestone as complete |
| `GET` | `/api/progress/summary` | Session ID | — | Get AI-generated progress narrative |
| `POST` | `/api/companion/chat` | Session ID | `{ message }` | Chat with AI learning companion |

> **Session authentication:** Pass the `session_id` as the `X-Session-ID` request header on all endpoints after `/api/session/start`.

---

## 🤖 Langflow AI Flows

Six Langflow agentic flows power the AI layer. Each flow follows the pattern:
**ChatInput → Prompt Template → GraniteStub / GraniteWatsonx → ChatOutput**

| Flow | JSON File | Env Variable | Description |
|---|---|---|---|
| Pathway Generation | `pathway-generation.json` | `FLOW_ID_PATHWAY_GENERATION` | Generates milestone-based learning roadmap |
| Skill Gap Analysis | `skill-gap-analysis.json` | `FLOW_ID_SKILL_GAP_ANALYSIS` | Identifies skill gaps ranked by priority |
| Course Recommendations | `course-recommendations.json` | `FLOW_ID_COURSE_RECOMMENDATIONS` | Matches resources to identified gaps |
| Adaptive Update | `adaptive-update.json` | `FLOW_ID_ADAPTIVE_UPDATE` | Re-plans pathway based on feedback |
| Progress Summary | `progress-summary.json` | `FLOW_ID_PROGRESS_SUMMARY` | Generates narrative learning progress report |
| Learning Companion | `learning-companion.json` | `FLOW_ID_LEARNING_COMPANION` | Conversational AI with session context |

### Importing Flows into Langflow

```bash
# 1. Start Langflow
docker-compose up langflow

# 2. Open the Langflow UI
#    http://localhost:7860

# 3. For each file in langflow/flows/:
#    Click "New Flow" → "Import" → select the JSON file

# 4. Copy the flow UUID from the UI URL bar
#    e.g. http://localhost:7860/flow/550e8400-e29b-41d4-a716-446655440000
#                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#                                    This is your FLOW_ID

# 5. Set the flow IDs in .env and restart the backend
docker-compose restart backend
```

---

## 🧪 Testing

The backend ships with a pytest test suite covering happy-path and fallback behaviour for all five service modules.

```bash
cd backend
pip install -r requirements.txt
pytest tests/ -v
```

**Expected output:**

```
tests/test_pathway_service.py::test_generate_pathway_returns_pathway          PASSED
tests/test_pathway_service.py::test_adapt_pathway_returns_updated_pathway     PASSED
tests/test_skills_service.py::test_analyze_gaps_returns_report                PASSED
tests/test_recommendations_service.py::test_get_recommendations               PASSED
tests/test_progress_service.py::test_update_progress_adds_milestone           PASSED
tests/test_progress_service.py::test_get_summary_returns_narrative            PASSED
tests/test_companion_service.py::test_chat_returns_response                   PASSED
tests/test_companion_service.py::test_chat_appends_to_history                 PASSED
...
======================== 23 passed in 0.20s ========================
```

---

## 🏢 Enabling Real IBM Granite

> See **[`docs/watsonx-integration.md`](docs/watsonx-integration.md)** for the complete step-by-step guide.

**Summary:**

1. **Provision** an IBM watsonx.ai instance on IBM Cloud
2. **Set credentials** in `.env`:
   ```env
   WATSONX_API_KEY=<your-api-key>
   WATSONX_PROJECT_ID=<your-project-id>
   WATSONX_URL=https://us-south.ml.cloud.ibm.com
   ```
3. **Enable** `langflow/components/GraniteWatsonx.py` (follow instructions in the file's docstring)
4. **Swap** the `GraniteStub` node for `GraniteWatsonx` in each Langflow flow
5. **Update** `FLOW_ID_*` env vars with the re-imported flow UUIDs
6. **Restart** Langflow: `docker-compose restart langflow`
7. **Verify** — responses will no longer include `"_mock": true`; the UI preview banner disappears

---

## 📁 Project Structure

```
learnmate-ai/
│
├── frontend/                        # React + TypeScript frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts            # Typed async API wrapper (all 9 endpoints)
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── AppLayout.tsx    # Sidebar navigation + responsive shell
│   │   │   ├── ui/                  # shadcn/ui component library (15 components)
│   │   │   └── MockBanner.tsx       # Dismissible "Preview Mode" indicator
│   │   ├── context/
│   │   │   └── LearnMateContext.tsx  # Global session state (React Context)
│   │   ├── pages/
│   │   │   ├── Onboarding.tsx       # Learner assessment form
│   │   │   ├── LearningPathway.tsx  # Milestone timeline + adapt sheet
│   │   │   ├── SkillGap.tsx         # Gap report with priority badges
│   │   │   ├── Recommendations.tsx  # Resource card grid
│   │   │   ├── ProgressTracker.tsx  # Milestone checklist + AI summary
│   │   │   └── Companion.tsx        # Conversational AI chat
│   │   └── types/
│   │       └── index.ts             # Shared TypeScript types (mirrors Pydantic models)
│   ├── Dockerfile                   # Multi-stage production build (nginx)
│   ├── nginx.conf                   # SPA routing + /api/ proxy
│   ├── tailwind.config.js
│   └── vite.config.ts
│
├── backend/
│   └── app/
│       ├── main.py                  # FastAPI entry point, lifespan, CORS
│       ├── core/
│       │   ├── config.py            # Environment variable loading
│       │   └── session.py           # In-memory session store
│       ├── clients/
│       │   └── langflow.py          # LangflowClient (httpx async)
│       ├── models/                  # Pydantic v2 data models
│       │   ├── learner.py           # LearnerProfile
│       │   ├── pathway.py           # Milestone, Pathway
│       │   ├── skills.py            # SkillGap, SkillGapReport
│       │   ├── recommendations.py   # Recommendation, RecommendationList
│       │   ├── progress.py          # ProgressState, ProgressSummary
│       │   ├── chat.py              # ChatMessage, ChatResponse
│       │   ├── session.py           # SessionState (aggregate)
│       │   └── requests.py          # Request body models
│       ├── routers/                 # FastAPI route handlers (6 files)
│       └── services/                # AI feature business logic (5 files)
│           └── granite_stub.py      # Direct Python fallback (no Langflow needed)
│
├── langflow/
│   ├── flows/                       # Six Langflow flow JSON exports
│   │   ├── pathway-generation.json
│   │   ├── skill-gap-analysis.json
│   │   ├── course-recommendations.json
│   │   ├── adaptive-update.json
│   │   ├── progress-summary.json
│   │   └── learning-companion.json
│   ├── components/
│   │   ├── GraniteStub.py           # Mock LLM component (_mock: true, role-aware)
│   │   └── GraniteWatsonx.py        # Real IBM Granite component (disabled by default)
│   ├── README.md                    # Langflow setup, import guide, blocker procedure
│   └── BLOCKERS.md                  # Known issues and workarounds
│
├── docs/
│   ├── architecture.md              # System design, data flow, session lifecycle
│   └── watsonx-integration.md       # Step-by-step IBM Granite enablement guide
│
├── backend/tests/                   # pytest suite (23 tests)
├── docker-compose.yml               # Three-service orchestration
├── .env.example                     # All environment variables documented
├── .gitignore
├── .gitattributes
└── README.md
```

---

## 📚 Documentation

| Document | Description |
|---|---|
| **[docs/architecture.md](docs/architecture.md)** | Component diagram, full data flow walkthrough, session state lifecycle, complete API reference |
| **[docs/watsonx-integration.md](docs/watsonx-integration.md)** | Step-by-step guide: provision watsonx.ai, enable `GraniteWatsonx.py`, swap Langflow nodes, verify live responses |
| **[langflow/README.md](langflow/README.md)** | Langflow container setup, custom component installation, flow import/export walkthrough, blocker procedure |
| **[http://localhost:8000/docs](http://localhost:8000/docs)** | Live Swagger UI with all endpoint schemas (requires backend running) |

---

## 🤝 Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using **IBM Granite** · **watsonx.ai** · **Langflow** · **FastAPI** · **React**

</div>

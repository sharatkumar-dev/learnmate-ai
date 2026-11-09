# LearnMate AI — Architecture

## 1. Overview

LearnMate AI is a full-stack, AI-powered personalized learning platform. A learner fills in a profile (target role, current skills, interests, weekly study hours), and the system generates a bespoke learning pathway, identifies skill gaps, recommends curated resources, tracks milestone progress, and provides a conversational AI companion throughout the journey.

**Technology choices:**

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | Fast DX, type-safe, modern React patterns |
| Styling | Tailwind CSS v3 + shadcn/ui | Utility-first with accessible, composable components |
| Backend | Python 3.11 + FastAPI | Async-native, auto-schema generation, clean type system |
| AI orchestration | Langflow (Docker) | Visual flow builder, REST API, pluggable AI components |
| AI model | IBM Granite stub / watsonx.ai | Stub for development; swap to real IBM Granite via env vars |
| State | In-memory session dict (Python) | No database for v1; UUID-keyed sessions |

---

## 2. System Components

```
Browser  (React + TypeScript, Vite dev server, port 5173)
    │
    │  HTTP/JSON  (X-Session-ID header)
    ▼
FastAPI Backend  (Python 3.11, port 8000)
    Routers:   session | pathway | skills | recommendations | progress | companion
    Services:  pathway_service | skills_service | recommendations_service
               progress_service | companion_service
    Session:   in-memory dict[UUID, SessionState]
    │
    │  HTTP REST  POST /api/v1/run/{flow_id}
    ▼
Langflow Server  (langflowai/langflow:latest, port 7860)
    pathway-generation      skill-gap-analysis      course-recommendations
    adaptive-update         progress-summary         learning-companion
    │
    │  component call (default: stub)
    ▼
GraniteStub.py  ─────[swap]────▶  GraniteWatsonx.py  ────▶  IBM watsonx.ai
(_mock: true, lightly dynamic)                              (ibm/granite-13b-chat-v2)
```

### Frontend (React, port 5173)

Six screen routes, each corresponding to a core feature:

| Route | Screen | Feature |
|---|---|---|
| `/` | Onboarding | Learner profile intake form |
| `/pathway` | Learning Pathway | Interactive milestone timeline |
| `/skills` | Skill Gap Analysis | Gap report with priority badges |
| `/recommendations` | Recommendations | Curated resource card grid |
| `/progress` | Progress Tracker | Milestone checklist + AI narrative |
| `/companion` | AI Companion | Conversational chat interface |

Global state is managed via `LearnMateContext` (React Context). The session ID is persisted to `sessionStorage` and sent as the `X-Session-ID` header on every API call. When any response contains `_mock: true`, a dismissible banner is shown.

### Backend (FastAPI, port 8000)

Module layout:

```
backend/app/
├── main.py            # FastAPI app, CORS, lifespan, router registration
├── core/
│   ├── config.py      # All env var constants (LANGFLOW_BASE_URL, FLOW_ID_*, etc.)
│   └── session.py     # In-memory session store + CRUD helpers
├── clients/
│   └── langflow.py    # LangflowClient — async httpx wrapper around Langflow REST API
├── models/
│   ├── learner.py     # LearnerProfile
│   ├── pathway.py     # Pathway, Milestone
│   ├── skills.py      # SkillGapReport, SkillGap
│   ├── recommendations.py  # RecommendationList, Recommendation
│   ├── progress.py    # ProgressState, ProgressSummary
│   ├── chat.py        # ChatMessage, ChatResponse
│   ├── session.py     # SessionState
│   └── requests.py    # All request body models
├── routers/
│   ├── session.py
│   ├── pathway.py
│   ├── skills.py
│   ├── recommendations.py
│   ├── progress.py
│   └── companion.py
└── services/
    ├── pathway_service.py
    ├── skills_service.py
    ├── recommendations_service.py
    ├── progress_service.py
    ├── companion_service.py
    └── granite_stub.py   # Direct fallback when Langflow is unreachable
```

When `LANGFLOW_BASE_URL` is empty or no flow ID is configured, each service falls back directly to `granite_stub.run_stub()` — no Langflow call is made. This enables full local development without Docker.

### Langflow (port 7860)

Six agentic flows are imported into the Langflow container from `/langflow/flows/`. Each flow receives a JSON-serialised payload via `ChatInput`, routes it through a `GraniteStub` (or `GraniteWatsonx`) component, and returns the result via `ChatOutput`.

Custom components are auto-discovered from the path set in `LANGFLOW_COMPONENTS_PATH` (`/root/.langflow/custom_components` in the Docker setup).

### IBM Granite Stub / watsonx.ai

`GraniteStub.py` is a custom Langflow component that parses the incoming JSON, inspects the `flow_type` field, and returns lightly dynamic mock data shaped to the learner's actual inputs (role, skills). Every response includes `"_mock": true` to distinguish stub output from real AI.

`GraniteWatsonx.py` is the production component. It calls `ibm/granite-13b-chat-v2` via the `ibm-watsonx-ai` SDK using credentials from environment variables. Swapping stub for watsonx requires only a component change inside Langflow — no backend code changes.

---

## 3. Data Flow

The complete learner journey through the system:

**a. Learner completes the onboarding form**
The React `Onboarding` screen collects `target_role`, `current_skills`, `interests`, and `time_available_hours_per_week`. On submit, three API calls fire in sequence:

**b. Frontend calls `session/start` → `skills/analyze` → `pathway/generate`**

1. `POST /api/session/start` — backend creates a `SessionState` keyed by a UUID, returns `session_id` in the `X-Session-ID` response header. Frontend stores this in `sessionStorage`.
2. `POST /api/skills/analyze` — sends `current_skills` + `target_role`. Backend builds a JSON payload and calls the `skill-gap-analysis` Langflow flow.
3. `POST /api/pathway/generate` — sends the full `LearnerProfile`. Backend calls the `pathway-generation` flow. Resulting `Pathway` is stored in session.

**c. Backend services call Langflow flows (or fall back to granite_stub)**

Each service serialises relevant session fields to JSON and sends them as `input_value` to `POST /api/v1/run/{flow_id}`. If `LANGFLOW_BASE_URL` is empty or the flow ID is unset, the service calls `granite_stub.run_stub(flow_type, inputs)` directly.

**d. Langflow calls GraniteStub component**

Inside the flow, `GraniteStub` receives the JSON string, parses the `flow_type` to select the response template, and injects role/skill-specific values into mock output. The result is returned as a JSON string via `ChatOutput`.

**e. Responses stored in in-memory session state**

Each service extracts the result from the Langflow response envelope (`outputs[0].outputs[0].results.message.text`), parses it, constructs the appropriate Pydantic model, and writes it back to the session via `update_session()`.

**f. Frontend updates context, navigates to pathway screen**

After the three sequential calls complete, `LearnMateContext` is updated with the new `pathway` and `skillGaps` objects. React Router navigates to `/pathway`.

Subsequent features (Recommendations, Progress, Companion) follow the same pattern: the screen calls an endpoint, the service reads relevant session state, calls Langflow, parses the response, updates session state, and returns the typed model to the frontend.

---

## 4. Session State Lifecycle

`SessionState` is a Pydantic model held in a module-level `dict[str, SessionState]` in `backend/app/core/session.py`.

```
create_session(profile?)
  → allocates UUID, stores SessionState with profile set (or None)
  → returns the new SessionState

get_session(session_id)
  → looks up by UUID; raises HTTP 404 if not found

update_session(session_id, **kwargs)
  → calls model_copy(update=kwargs) for immutable update
  → writes updated state back to dict
```

**Lifecycle across the learner journey:**

| Step | Field Written |
|---|---|
| `POST /api/session/start` | `session_id`, `profile` (optional) |
| `POST /api/skills/analyze` | `skill_gaps` |
| `POST /api/pathway/generate` | `profile`, `pathway` |
| `POST /api/pathway/adapt` | `pathway` |
| `POST /api/recommendations` | `recommendations` |
| `POST /api/progress/update` | `progress.completed` |
| `POST /api/companion/chat` | `chat_history` (append) |

State accumulates across calls within a session. `GET /api/session/{id}` returns the full current `SessionState` at any point.

**Important:** Session state is in-memory only. It is lost on backend restart. There is no persistence layer in v1.

---

## 5. API Reference

| Method | Path | Request Body | Response | Description |
|---|---|---|---|---|
| `POST` | `/api/session/start` | `{ profile? }` | `{ session_id }` + `X-Session-ID` header | Create new session |
| `GET` | `/api/session/{id}` | — | `SessionState` | Retrieve full session state |
| `POST` | `/api/pathway/generate` | `{ profile }` | `Pathway` | Generate learning pathway |
| `POST` | `/api/pathway/adapt` | `{ feedback, completed_milestone_ids }` | `Pathway` | Adapt pathway based on progress |
| `POST` | `/api/skills/analyze` | `{ current_skills, target_role }` | `SkillGapReport` | Run skill gap analysis |
| `POST` | `/api/recommendations` | `{}` | `RecommendationList` | Get course recommendations |
| `POST` | `/api/progress/update` | `{ milestone_id }` | `ProgressState` | Record milestone completion |
| `GET` | `/api/progress/summary` | — | `ProgressSummary` | Get AI progress narrative |
| `POST` | `/api/companion/chat` | `{ message }` | `ChatResponse` | Send message to AI companion |

All endpoints except `POST /api/session/start` and `GET /api/session/{id}` require an `X-Session-ID` header.

Auto-generated API docs are available at `http://localhost:8000/docs` when the backend is running.

---

## 6. Langflow Flows

All six flow JSON files are in `/langflow/flows/`. Import them via the Langflow UI (`http://localhost:7860`) to register them and obtain their runtime UUIDs. Set the `FLOW_ID_*` environment variables to those UUIDs.

| Flow | JSON File | `FLOW_ID_*` env var | Trigger | Output Shape |
|---|---|---|---|---|
| pathway-generation | `pathway-generation.json` | `FLOW_ID_PATHWAY_GENERATION` | `POST /api/pathway/generate` | `{ _mock, milestones, estimated_duration, resources }` |
| skill-gap-analysis | `skill-gap-analysis.json` | `FLOW_ID_SKILL_GAP_ANALYSIS` | `POST /api/skills/analyze` | `{ _mock, gaps, priority_order, rationale }` |
| course-recommendations | `course-recommendations.json` | `FLOW_ID_COURSE_RECOMMENDATIONS` | `POST /api/recommendations` | `{ _mock, recommendations: [{ title, url, type, duration }] }` |
| adaptive-update | `adaptive-update.json` | `FLOW_ID_ADAPTIVE_UPDATE` | `POST /api/pathway/adapt` | `{ _mock, updated_pathway, changes_summary }` |
| progress-summary | `progress-summary.json` | `FLOW_ID_PROGRESS_SUMMARY` | `GET /api/progress/summary` | `{ _mock, narrative, completion_pct, next_steps }` |
| learning-companion | `learning-companion.json` | `FLOW_ID_LEARNING_COMPANION` | `POST /api/companion/chat` | `{ _mock, response, suggested_actions }` |

> **Note:** The flow IDs embedded in the JSON files (`a1b2c3d4-...`) are placeholder identifiers used during development. After importing into a running Langflow instance, Langflow assigns its own UUIDs. Copy those UUIDs to your `.env` file.

---

## 7. Mock vs Real IBM Granite

### The `_mock` flag

Every response from `GraniteStub.py` includes `"_mock": true` at the top level. The backend maps this to a `mock` field on each Pydantic response model. The frontend reads this field and shows a dismissible yellow banner: _"AI responses are currently using mock data."_

### The stub architecture

```
Service (e.g. pathway_service.generate_pathway)
  │
  ├─ if LANGFLOW_BASE_URL is set and FLOW_ID is set:
  │     LangflowClient.run_flow(flow_id, inputs)
  │       → POST http://langflow:7860/api/v1/run/{flow_id}
  │           → GraniteStub.py (inside flow)
  │               → returns { "_mock": true, ... }
  │
  └─ else (fallback):
        granite_stub.run_stub(flow_type, inputs)
            → returns { "_mock": true, ... }
```

Both paths return the same response shape and both set `_mock: true`. The fallback is automatic — no configuration needed for local development without Docker.

### Swapping to real IBM Granite

To replace `GraniteStub` with `GraniteWatsonx` for production use, see [`docs/watsonx-integration.md`](watsonx-integration.md). The swap requires:
1. Setting three environment variables (`WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, `WATSONX_URL`)
2. Replacing the `GraniteStub` node with `GraniteWatsonx` inside each Langflow flow
3. Restarting Langflow

No changes to the FastAPI backend are needed.

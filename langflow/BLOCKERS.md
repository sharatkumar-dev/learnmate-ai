# Langflow — Blockers Log

This file records blockers encountered during LearnMate AI development, the date they were identified, their impact, and the workarounds applied. Keep entries in reverse-chronological order (newest first).

---

## 2026-11-09 — Langflow UI unavailable during Sub-Task 3

**Status:** Workaround applied — resolved for development purposes

### Description

The Langflow UI (http://localhost:7860) was not available during the Sub-Task 3 implementation session. The Docker environment could not be started in the CI/development context, so the six Langflow flows could not be built visually and exported via the UI's "Export Flow" button.

Additionally, IBM watsonx.ai credentials (`WATSONX_API_KEY`, `WATSONX_PROJECT_ID`) were not available in the development environment, preventing any live testing of the real IBM Granite component.

### Impact

- Could not use the Langflow UI to drag-and-drop nodes and wire flows
- Could not auto-generate flow UUIDs via the Langflow import/export cycle
- Could not verify that `GraniteStub.py` renders correctly in the component palette

### Workaround Applied

**1. Programmatic flow JSON generation**

All six flow JSON files in `langflow/flows/` were written directly as valid Langflow v1 export-format JSON. Each file follows the schema:

```json
{
  "id": "<hardcoded-uuid>",
  "name": "<flow name>",
  "description": "...",
  "data": {
    "nodes": [ ... ],
    "edges": [ ... ]
  },
  "is_component": false,
  "updated_at": "...",
  "tags": [ ... ]
}
```

Each flow has three nodes (`ChatInput` → `GraniteStub` → `ChatOutput`) wired with matching edges. The `GraniteStub` node's `flow_type` template value is pre-set to the correct flow name.

The hardcoded UUIDs used are:

| Flow | UUID |
|------|------|
| pathway-generation | `a1b2c3d4-e5f6-7890-abcd-ef1234567801` |
| skill-gap-analysis | `a1b2c3d4-e5f6-7890-abcd-ef1234567802` |
| course-recommendations | `a1b2c3d4-e5f6-7890-abcd-ef1234567803` |
| adaptive-update | `a1b2c3d4-e5f6-7890-abcd-ef1234567804` |
| progress-summary | `a1b2c3d4-e5f6-7890-abcd-ef1234567805` |
| learning-companion | `a1b2c3d4-e5f6-7890-abcd-ef1234567806` |

**Note:** When the Langflow UI is available, import each JSON file and copy the **live flow UUID** from the URL or flow settings. The hardcoded UUIDs above are placeholders. Update `.env` with the real UUIDs.

**2. Backend Python fallback**

`GraniteStub.py` exposes a module-level `_build_mock_response(flow_type, inputs)` function. A backend-native wrapper at `backend/app/services/granite_stub.py` wraps this as:

```python
async def run_stub(flow_type: str, inputs: dict) -> dict
```

This allows all FastAPI service functions to call the stub directly without a running Langflow server. The service layer (Sub-Task 4) uses this fallback when `LANGFLOW_BASE_URL` is not configured.

### Resolution Steps (when Langflow becomes available)

1. Start Langflow: `docker-compose up langflow`
2. Copy `langflow/components/GraniteStub.py` to the Langflow components directory
3. Restart Langflow: `docker-compose restart langflow`
4. Import each JSON from `langflow/flows/` via **Import Flow** in the UI
5. For each imported flow, copy the live UUID from the UI URL
6. Update `FLOW_ID_*` variables in `.env` with the real UUIDs
7. Update this blocker entry with ✅ Resolved status

---

*Template for future blockers:*

```
## YYYY-MM-DD — <short title>

**Status:** <Active / Workaround applied / Resolved>

### Description
<What was unavailable and why>

### Impact
<What could not be done as a result>

### Workaround Applied
<What was done instead>

### Resolution Steps
<Steps to fully resolve when the blocker is lifted>
```

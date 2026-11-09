# Langflow — LearnMate AI

This directory contains all Langflow flow definitions and custom components for the LearnMate AI platform.

---

## Directory Structure

```
langflow/
├── flows/           # Exported flow JSON files (one per feature)
├── components/      # Custom Python components (GraniteStub, GraniteWatsonx)
└── README.md        # This file
```

---

## Starting the Langflow Container

The Langflow service is managed via Docker Compose at the project root.

```bash
# Start only the Langflow service
docker-compose up langflow

# Or start all services
docker-compose up
```

Langflow will be available at **http://localhost:7860**.

---

## Installing Custom Components

Custom components are auto-discovered from the directory mounted at `LANGFLOW_COMPONENTS_PATH`.
The `docker-compose.yml` mounts `./langflow/components` to that path.

To add a new component:

1. Copy the `.py` file into `langflow/components/`
2. Restart the Langflow container: `docker-compose restart langflow`
3. The component will appear in the Langflow UI component palette

### Available components

| File | Description |
|------|-------------|
| `GraniteStub.py` | Lightly dynamic mock component; returns `_mock: true` responses shaped to the learner's actual inputs |
| `GraniteWatsonx.py` | Real IBM Granite integration via `ibm-watsonx-ai`; disabled (commented out in flows) by default |

---

## Importing Flow JSON Files

1. Open Langflow at http://localhost:7860
2. Click **"Import Flow"** (or the upload icon on the flows list page)
3. Select the `.json` file from `langflow/flows/`
4. After import, copy the **flow ID** from the URL (`/flow/<uuid>`) or from the flow's settings panel
5. Set the corresponding `FLOW_ID_*` environment variable in `.env` (see project root `.env.example`)

### Flow ID Table

After importing each flow JSON into the Langflow UI, copy the live UUID from the flow URL or settings panel and set the corresponding env var in `.env`.

| Flow Name               | Flow ID (set after import) | Env Var                          |
|-------------------------|---------------------------|----------------------------------|
| pathway-generation      | `<import and copy>`       | `FLOW_ID_PATHWAY_GENERATION`     |
| skill-gap-analysis      | `<import and copy>`       | `FLOW_ID_SKILL_GAP_ANALYSIS`     |
| course-recommendations  | `<import and copy>`       | `FLOW_ID_COURSE_RECOMMENDATIONS` |
| adaptive-update         | `<import and copy>`       | `FLOW_ID_ADAPTIVE_UPDATE`        |
| progress-summary        | `<import and copy>`       | `FLOW_ID_PROGRESS_SUMMARY`       |
| learning-companion      | `<import and copy>`       | `FLOW_ID_LEARNING_COMPANION`     |

> **Note:** The flow JSON files in `langflow/flows/` contain placeholder UUIDs (generated programmatically — see [`BLOCKERS.md`](./BLOCKERS.md)). The UUIDs shown here are the **live** UUIDs assigned by Langflow on import and must be copied from the UI.

---

## Swapping to Real IBM Granite (watsonx.ai)

By default all flows use `GraniteStub.py` and return `_mock: true` responses. To switch to real IBM Granite:

1. Set watsonx.ai credentials in `.env`:
   ```
   WATSONX_API_KEY=<your-key>
   WATSONX_PROJECT_ID=<your-project-id>
   WATSONX_URL=https://us-south.ml.cloud.ibm.com
   ```
2. Copy `GraniteWatsonx.py` into `langflow/components/` and restart Langflow
3. In each flow, swap the `GraniteStub` node for the `GraniteWatsonx` node
4. Re-export each flow as JSON and commit to `langflow/flows/`
5. Restart the backend; responses will now include `_mock: false`

See `docs/watsonx-integration.md` for the full step-by-step guide.

---

## Blocker Procedure

If the Langflow UI is unavailable or IBM Granite access cannot be obtained during development:

1. Document the blocker in [`BLOCKERS.md`](./BLOCKERS.md) with:
   - Date
   - Description of the blocker
   - Workaround applied
2. Write the flow JSON structure manually as a skeleton (set `_mock: true` in the stub output)
3. Keep `GraniteStub.py` callable directly from the FastAPI service layer as a Python fallback — no Langflow server required

---

## Langflow REST API

The FastAPI backend calls Langflow flows via:

```
POST http://localhost:7860/api/v1/run/{flow_id}
Authorization: Bearer <LANGFLOW_API_KEY>
Content-Type: application/json

{
  "input_value": "<prompt>",
  "input_type": "chat",
  "output_type": "chat",
  "tweaks": {}
}
```

Response path for output text: `data.outputs[0].outputs[0].results.message.text`

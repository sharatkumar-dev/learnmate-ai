# Enabling Real IBM Granite via watsonx.ai

By default, LearnMate AI uses `GraniteStub.py` — a lightly dynamic mock component that returns `"_mock": true` in every response. This guide explains how to replace the stub with `GraniteWatsonx.py` so that the application calls the real `ibm/granite-13b-chat-v2` model on IBM watsonx.ai.

No changes to the FastAPI backend are needed. The swap is done entirely inside Langflow.

---

## Prerequisites

- An IBM Cloud account with **watsonx.ai** access enabled
- A watsonx.ai project created; note the **Project ID** (found in the project's **Manage** tab)
- An IBM Cloud **API key** generated at `cloud.ibm.com/iam/apikeys`
- LearnMate AI running via `docker-compose up` (all three services healthy)

---

## Step 1 — Set environment variables

Add the following to your root `.env` file (copy from `.env.example` if you haven't already):

```env
WATSONX_API_KEY=<your-ibm-cloud-api-key>
WATSONX_PROJECT_ID=<your-watsonx-project-id>
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

> **Region note:** The URL above is for the US South region. Use the endpoint that matches where your watsonx.ai project is hosted (e.g. `https://eu-de.ml.cloud.ibm.com` for Frankfurt).

These variables are read by `GraniteWatsonx.py` at runtime inside the Langflow container. The FastAPI backend does not read them directly.

---

## Step 2 — Install the watsonx.ai SDK in Langflow

Langflow does not include `ibm-watsonx-ai` by default. Install it into the running container:

```bash
docker exec -it learnmate-langflow-1 pip install ibm-watsonx-ai
```

Or, to make the install permanent across container restarts, create `langflow/requirements-langflow.txt`:

```
ibm-watsonx-ai
```

Then update the `langflow` service in `docker-compose.yml` to install it on startup:

```yaml
langflow:
  image: langflowai/langflow:latest
  command: sh -c "pip install ibm-watsonx-ai && python -m langflow run"
  ...
```

Restart the service after this change:

```bash
docker-compose restart langflow
```

---

## Step 3 — Enable `GraniteWatsonx.py`

The production component is at `langflow/components/GraniteWatsonx.py`. It is already mounted into the Langflow container via the `LANGFLOW_COMPONENTS_PATH` volume.

Open the file and follow the instructions in the module docstring: uncomment the `ibm-watsonx-ai` SDK import and the `build_output()` implementation. The key section to uncomment looks like:

```python
from ibm_watsonx_ai.foundation_models import Model

model = Model(
    model_id="ibm/granite-13b-chat-v2",
    credentials={"apikey": api_key, "url": url},
    project_id=project_id,
)
response = model.generate_text(prompt=prompt)
```

After saving, restart the Langflow container so it picks up the updated component:

```bash
docker-compose restart langflow
```

---

## Step 4 — Swap the component in each Langflow flow

1. Open the Langflow UI at `http://localhost:7860`
2. Open each of the six flows in the editor:
   - `Pathway Generation`
   - `Skill Gap Analysis`
   - `Course Recommendations`
   - `Adaptive Update`
   - `Progress Summary`
   - `Learning Companion`
3. In each flow, **delete** the `GraniteStub (Mock)` node
4. From the component panel, drag in the **`GraniteWatsonx`** component (it should appear under your custom components after the restart)
5. Re-wire the edges:
   - `ChatInput` → `GraniteWatsonx.input_json`
   - `GraniteWatsonx.response` → `ChatOutput`
6. Set the `flow_type` field on `GraniteWatsonx` to match the flow name (e.g. `pathway-generation`)
7. **Save** and **Export** the updated flow JSON
8. Replace the corresponding file in `langflow/flows/` with the exported JSON
9. Note the new flow UUID from the Langflow UI URL bar (or from the exported JSON's `id` field)

---

## Step 5 — Update flow IDs in `.env`

After re-importing or saving updated flows, Langflow may assign new flow UUIDs. Update the `FLOW_ID_*` variables in your `.env` file with the current UUIDs:

```env
FLOW_ID_PATHWAY_GENERATION=<uuid-from-langflow-ui>
FLOW_ID_SKILL_GAP_ANALYSIS=<uuid-from-langflow-ui>
FLOW_ID_COURSE_RECOMMENDATIONS=<uuid-from-langflow-ui>
FLOW_ID_ADAPTIVE_UPDATE=<uuid-from-langflow-ui>
FLOW_ID_PROGRESS_SUMMARY=<uuid-from-langflow-ui>
FLOW_ID_LEARNING_COMPANION=<uuid-from-langflow-ui>
```

Restart the backend to pick up the new IDs:

```bash
docker-compose restart backend
```

---

## Step 6 — Restart and verify

1. Ensure all services are running:

   ```bash
   docker-compose up
   ```

2. Open `http://localhost:5173`, complete the onboarding form, and proceed through the learner journey.

3. Responses should no longer include `"_mock": true`. Verify in the browser network tab or by checking the raw JSON:

   ```bash
   curl -s -X POST http://localhost:8000/api/skills/analyze \
     -H "Content-Type: application/json" \
     -H "X-Session-ID: <your-session-id>" \
     -d '{"current_skills":["Python"],"target_role":"Data Engineer"}' \
     | python -m json.tool | grep _mock
   ```

   Expected output: `"_mock": false` (or the key is absent).

4. The mock data banner in the UI should **not** appear.

---

## Step 7 — Remove mock indicators (optional)

Once you have confirmed that real IBM Granite responses are flowing through, the `_mock` field will be `false` automatically — the backend reads it directly from the AI response. No code changes are required.

If you want to remove the mock banner logic entirely from the frontend, delete the `MockBanner` component from the UI and remove the `_mock` checks in each screen. This is optional and not recommended until the watsonx.ai integration is fully stable.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `_mock: true` still returned | Langflow still routing to `GraniteStub` | Verify the node swap was saved and the flow was re-imported |
| `ModuleNotFoundError: ibm_watsonx_ai` | SDK not installed in container | Re-run Step 2 and restart Langflow |
| `AuthenticationError` from watsonx | Wrong API key or URL | Double-check `WATSONX_API_KEY` and `WATSONX_URL` in `.env` |
| `ProjectNotFound` error | Wrong project ID | Verify `WATSONX_PROJECT_ID` matches the Manage tab of your project |
| Flow not found (404) | `FLOW_ID_*` env var is stale | Copy the UUID from the Langflow UI and update `.env` |
| UI still shows mock banner | Session state was created before the swap | Start a new session (clear `sessionStorage` or open a fresh browser tab) |

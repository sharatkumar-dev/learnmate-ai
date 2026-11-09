"""
GraniteWatsonx — Real IBM Granite Component via watsonx.ai
============================================================
**DISABLED BY DEFAULT.**  All methods raise ``NotImplementedError`` until you
follow the activation steps below.

Swap procedure (from GraniteStub to GraniteWatsonx)
-----------------------------------------------------
Step 1 — Set watsonx.ai credentials in ``.env``:

    WATSONX_API_KEY=<your-ibm-cloud-api-key>
    WATSONX_PROJECT_ID=<your-watsonx-project-id>
    WATSONX_URL=https://us-south.ml.cloud.ibm.com

Step 2 — Install the SDK inside the Langflow container:

    docker exec -it learnmate-langflow-1 pip install ibm-watsonx-ai

Step 3 — Copy this file to the Langflow components directory:

    cp langflow/components/GraniteWatsonx.py ~/.langflow/components/
    # or the path set in LANGFLOW_COMPONENTS_PATH

Step 4 — Remove the ``raise NotImplementedError`` line in ``build()`` below
         (it is clearly marked with "# REMOVE THIS LINE TO ENABLE").

Step 5 — Restart Langflow:

    docker-compose restart langflow

Step 6 — In each of the six flows, swap the ``GraniteStub`` node for the
         ``GraniteWatsonx`` node.  The inputs (``flow_type`` + ``input_json``)
         are identical so no other changes are needed.

Step 7 — Re-export the flows as JSON and commit to ``langflow/flows/``.

Step 8 — Restart the backend and verify that responses no longer carry
         ``"_mock": true``.

See ``docs/watsonx-integration.md`` for the full illustrated guide.

Model reference
---------------
- PyPI package : ibm-watsonx-ai
- Model ID     : ibm/granite-13b-chat-v2
- API docs     : https://ibm.github.io/watsonx-ai-python-sdk/
"""

from __future__ import annotations

import json
import os
import sys

try:
    from langflow.custom import Component
    from langflow.inputs import StrInput
    from langflow.template import Output
    from langflow.schema import Data

    _LANGFLOW_AVAILABLE = True
except ImportError:
    _LANGFLOW_AVAILABLE = False

    class Component:  # type: ignore[misc]
        """Minimal shim so the file is importable without Langflow installed."""


# ---------------------------------------------------------------------------
# Model constant
# ---------------------------------------------------------------------------

_MODEL_ID = "ibm/granite-13b-chat-v2"

# ---------------------------------------------------------------------------
# Langflow Component
# ---------------------------------------------------------------------------

if _LANGFLOW_AVAILABLE:

    class GraniteWatsonx(Component):
        """
        Real IBM Granite component powered by watsonx.ai.

        **DISABLED** — see module docstring for activation steps.
        """

        display_name: str = "GraniteWatsonx (Real — Disabled)"
        description: str = (
            "Real IBM Granite via watsonx.ai. "
            "DISABLED by default — set WATSONX_API_KEY and follow the swap guide to enable."
        )
        icon: str = "cpu"

        inputs = [
            StrInput(
                name="flow_type",
                display_name="Flow Type",
                info=(
                    "One of: pathway-generation, skill-gap-analysis, "
                    "course-recommendations, adaptive-update, "
                    "progress-summary, learning-companion"
                ),
                required=True,
            ),
            StrInput(
                name="input_json",
                display_name="Input JSON",
                info="JSON-serialised learner inputs for this flow.",
                required=True,
            ),
        ]

        outputs = [
            Output(display_name="Response JSON", name="response", method="build"),
        ]

        def build(self) -> Data:  # type: ignore[override]
            # ----------------------------------------------------------------
            # REMOVE THIS LINE TO ENABLE (after following the swap guide):
            raise NotImplementedError(
                "GraniteWatsonx is disabled. "
                "Set WATSONX_API_KEY, WATSONX_PROJECT_ID, and WATSONX_URL "
                "and follow the swap procedure in the module docstring to enable "
                "real IBM Granite responses."
            )
            # ----------------------------------------------------------------

            # ── Everything below runs once the NotImplementedError is removed ──

            flow_type: str = self.flow_type  # type: ignore[attr-defined]
            input_json: str = self.input_json  # type: ignore[attr-defined]

            api_key = os.environ.get("WATSONX_API_KEY", "")
            project_id = os.environ.get("WATSONX_PROJECT_ID", "")
            url = os.environ.get("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")

            if not api_key or not project_id:
                return Data(
                    data={
                        "_mock": False,
                        "error": (
                            "WATSONX_API_KEY and WATSONX_PROJECT_ID must be set "
                            "in the environment before using GraniteWatsonx."
                        ),
                    }
                )

            try:
                inputs: dict = json.loads(input_json)
            except json.JSONDecodeError as exc:
                return Data(data={"_mock": False, "error": f"Invalid input_json: {exc}"})

            # ── SDK integration (uncomment and adjust as needed) ──────────────
            # from ibm_watsonx_ai import APIClient, Credentials
            # from ibm_watsonx_ai.foundation_models import ModelInference
            # from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as GenParams
            #
            # credentials = Credentials(url=url, api_key=api_key)
            # client = APIClient(credentials)
            #
            # model = ModelInference(
            #     model_id=_MODEL_ID,
            #     api_client=client,
            #     project_id=project_id,
            #     params={
            #         GenParams.MAX_NEW_TOKENS: 1024,
            #         GenParams.TEMPERATURE: 0.7,
            #     },
            # )
            #
            # prompt = _build_prompt(flow_type, inputs)
            # raw = model.generate_text(prompt=prompt)
            # response_dict = _parse_response(flow_type, raw)
            # return Data(data=response_dict)
            # ─────────────────────────────────────────────────────────────────

            print(f"[WATSONX] GraniteWatsonx invoked for flow: {flow_type}", file=sys.stdout)
            return Data(data={"_mock": False, "raw": "(watsonx response placeholder)"})


# ---------------------------------------------------------------------------
# Helper stubs (implement when enabling)
# ---------------------------------------------------------------------------

def _build_prompt(flow_type: str, inputs: dict) -> str:
    """
    Build a prompt string for IBM Granite given the flow type and learner inputs.

    Implement per-flow prompt templates here when activating this component.
    """
    return (
        f"You are a personalized learning assistant.\n"
        f"Flow: {flow_type}\n"
        f"Inputs: {json.dumps(inputs, indent=2)}\n"
        f"Respond with a valid JSON object matching the expected output schema."
    )


def _parse_response(flow_type: str, raw: str) -> dict:
    """
    Parse the raw text returned by IBM Granite into a structured dict.

    Implement JSON extraction / error handling here when activating this component.
    """
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return {"_mock": False, "error": "Failed to parse Granite response", "raw": raw}

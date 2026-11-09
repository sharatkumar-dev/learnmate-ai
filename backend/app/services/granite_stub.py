"""
granite_stub — Backend Python Fallback for GraniteStub
=======================================================
Provides ``run_stub(flow_type, inputs)`` as a direct Python fallback for the
Langflow ``GraniteStub.py`` component.

Usage (Sub-Task 4 service layer):
----------------------------------
When ``LANGFLOW_BASE_URL`` is not configured the service functions call this
module directly instead of going through Langflow:

    from backend.app.services.granite_stub import run_stub

    result = await run_stub("pathway-generation", {
        "target_role": "Data Engineer",
        "current_skills": ["Python"],
        "interests": ["ML"],
        "time_available": 10,
    })
    # result["_mock"] is True

All response shapes are identical to what the Langflow GraniteStub component
returns, so the service layer parses them the same way regardless of whether
they came via Langflow or this direct fallback.
"""

from __future__ import annotations

import sys
from typing import Any

# Re-use the core logic from the Langflow component module.
# The component module is designed to be importable without Langflow installed
# (it guards the Component subclass behind _LANGFLOW_AVAILABLE) so this import
# is always safe.
import os

# Add the langflow/components directory to sys.path so we can import
# GraniteStub regardless of how the project is installed.
_COMPONENTS_DIR = os.path.normpath(
    os.path.join(os.path.dirname(__file__), "..", "..", "..", "langflow", "components")
)
if _COMPONENTS_DIR not in sys.path:
    sys.path.insert(0, _COMPONENTS_DIR)

from GraniteStub import _build_mock_response  # noqa: E402


async def run_stub(flow_type: str, inputs: dict[str, Any]) -> dict[str, Any]:
    """
    Return a lightly dynamic mock response for *flow_type* using *inputs*.

    This is the async entry-point used by FastAPI service functions when
    ``LANGFLOW_BASE_URL`` is not set (i.e. Langflow is not running).

    Parameters
    ----------
    flow_type:
        One of ``pathway-generation``, ``skill-gap-analysis``,
        ``course-recommendations``, ``adaptive-update``,
        ``progress-summary``, ``learning-companion``.
    inputs:
        Dict of learner inputs for the given flow type.

    Returns
    -------
    dict
        A mock response dict.  Always includes ``"_mock": True``.
    """
    print(f"[MOCK] granite_stub.run_stub responding for flow: {flow_type}", file=sys.stdout)
    return _build_mock_response(flow_type, inputs)

"""
_langflow_helpers — Utilities for parsing Langflow v1 response envelopes.
"""

from __future__ import annotations

import json


def extract_text_from_langflow_response(response: dict) -> str:
    """Extract text output from a Langflow v1 run response envelope.

    The standard Langflow v1 response path is:
        response["outputs"][0]["outputs"][0]["results"]["message"]["text"]

    Raises
    ------
    ValueError
        If the expected keys are missing or the structure is malformed.
    """
    try:
        return response["outputs"][0]["outputs"][0]["results"]["message"]["text"]
    except (KeyError, IndexError, TypeError) as exc:
        raise ValueError("Could not extract text from Langflow response") from exc


def parse_json_from_langflow_response(response: dict) -> dict:
    """Extract and JSON-parse the text payload from a Langflow response envelope.

    Raises
    ------
    ValueError
        If text extraction fails or the text is not valid JSON.
    """
    text = extract_text_from_langflow_response(response)
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError) as exc:
        raise ValueError(f"Langflow response text is not valid JSON: {exc}") from exc

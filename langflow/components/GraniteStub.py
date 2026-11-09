"""
GraniteStub — Lightly Dynamic IBM Granite Mock Component
=========================================================
A drop-in Langflow custom component that stands in for IBM Granite / watsonx.ai.

All responses:
  - Echo the learner's actual inputs (target_role, skills, etc.)
  - Carry ``"_mock": true`` at the top level
  - Log a clear [MOCK] prefix to stdout

Swap procedure
--------------
To replace this stub with the real IBM Granite component:
  1. Set WATSONX_API_KEY, WATSONX_PROJECT_ID, and WATSONX_URL in .env
  2. Add GraniteWatsonx.py to the Langflow components directory
  3. Restart Langflow
  4. In each flow, swap this node for the GraniteWatsonx node
  5. Re-export the flows and commit the JSON files

See docs/watsonx-integration.md for the full step-by-step guide.
"""

from __future__ import annotations

import json
import math
import sys
from typing import Any

try:
    from langflow.custom import Component
    from langflow.inputs import StrInput
    from langflow.template import Output
    from langflow.schema import Data

    _LANGFLOW_AVAILABLE = True
except ImportError:  # running outside Langflow (direct Python usage / tests)
    _LANGFLOW_AVAILABLE = False

    class Component:  # type: ignore[misc]
        """Minimal shim so the file is importable without Langflow installed."""


# ---------------------------------------------------------------------------
# Core mock logic — used both by the Langflow component and the backend
# fallback (backend/app/services/granite_stub.py).
# ---------------------------------------------------------------------------

def _build_mock_response(flow_type: str, inputs: dict[str, Any]) -> dict[str, Any]:
    """
    Return a lightly dynamic mock response for *flow_type* using *inputs*.

    The response shape mirrors the real IBM Granite output so that the
    service layer can parse it without changes when the stub is swapped out.
    """
    ft = flow_type.strip().lower()

    if ft == "pathway-generation":
        return _pathway_generation(inputs)
    elif ft == "skill-gap-analysis":
        return _skill_gap_analysis(inputs)
    elif ft == "course-recommendations":
        return _course_recommendations(inputs)
    elif ft == "adaptive-update":
        return _adaptive_update(inputs)
    elif ft == "progress-summary":
        return _progress_summary(inputs)
    elif ft == "learning-companion":
        return _learning_companion(inputs)
    else:
        return {
            "_mock": True,
            "error": f"Unknown flow_type '{flow_type}'",
            "supported": [
                "pathway-generation",
                "skill-gap-analysis",
                "course-recommendations",
                "adaptive-update",
                "progress-summary",
                "learning-companion",
            ],
        }


# ── Individual flow builders ──────────────────────────────────────────────

def _pathway_generation(inp: dict) -> dict:
    target_role: str = inp.get("target_role", "professional")
    current_skills: list = inp.get("current_skills", [])
    time_available: int = int(inp.get("time_available", 10))

    skill_list = ", ".join(current_skills) if current_skills else "your existing skills"
    weeks = max(4, math.ceil(40 / max(time_available, 1)))

    return {
        "_mock": True,
        "target_role": target_role,
        "estimated_duration_weeks": weeks,
        "milestones": [
            {
                "id": "m1",
                "title": f"Foundation skills for {target_role}",
                "description": f"Build the core knowledge required for a {target_role} role, leveraging {skill_list}.",
                "resources": [f"Introduction to {target_role} fundamentals", "IBM SkillsBuild — Getting Started"],
                "order": 1,
                "completed": False,
            },
            {
                "id": "m2",
                "title": f"Applied practice as a {target_role}",
                "description": f"Apply concepts through hands-on projects and exercises aligned to a {target_role} workflow.",
                "resources": [f"Hands-On {target_role} Projects (Coursera)", "IBM Learning Labs"],
                "order": 2,
                "completed": False,
            },
            {
                "id": "m3",
                "title": f"Capstone — {target_role} readiness",
                "description": f"Complete a capstone project demonstrating end-to-end {target_role} competency.",
                "resources": [f"{target_role} Capstone Project Guide", "LinkedIn Learning — Career Prep"],
                "order": 3,
                "completed": False,
            },
        ],
        "resources": [
            f"IBM SkillsBuild: {target_role} Learning Path",
            "Coursera Professional Certificate",
            "LinkedIn Learning — Role Transition Guide",
        ],
    }


def _skill_gap_analysis(inp: dict) -> dict:
    target_role: str = inp.get("target_role", "professional")
    current_skills: list = inp.get("current_skills", [])

    skill_list_str = ", ".join(current_skills) if current_skills else "none provided"

    return {
        "_mock": True,
        "target_role": target_role,
        "gaps": [
            {
                "skill": f"Core {target_role} domain knowledge",
                "priority": "high",
                "rationale": f"A {target_role} role requires deep domain expertise not fully covered by: {skill_list_str}.",
            },
            {
                "skill": f"{target_role} tooling and workflow",
                "priority": "medium",
                "rationale": f"Proficiency with industry-standard tools used day-to-day by {target_role}s.",
            },
            {
                "skill": "Communication and stakeholder management",
                "priority": "low",
                "rationale": f"Effective communication is valued but often secondary for an entry-level {target_role}.",
            },
        ],
        "priority_order": [
            f"Core {target_role} domain knowledge",
            f"{target_role} tooling and workflow",
            "Communication and stakeholder management",
        ],
    }


def _course_recommendations(inp: dict) -> dict:
    skill_gaps: list = inp.get("skill_gaps", [])
    target_role: str = inp.get("target_role", "professional")
    learning_style: str = inp.get("learning_style", "mixed")

    gap_names: list[str] = []
    for g in skill_gaps:
        if isinstance(g, dict):
            gap_names.append(g.get("skill", str(g)))
        else:
            gap_names.append(str(g))

    first_gap = gap_names[0] if gap_names else f"{target_role} fundamentals"
    second_gap = gap_names[1] if len(gap_names) > 1 else f"{target_role} tools"

    return {
        "_mock": True,
        "recommendations": [
            {
                "title": f"IBM SkillsBuild: {first_gap}",
                "url": "https://skillsbuild.org/placeholder",
                "type": "course",
                "duration": "8 hours",
                "skill": first_gap,
            },
            {
                "title": f"Hands-On {second_gap} for {target_role}s",
                "url": "https://coursera.org/placeholder",
                "type": "tutorial",
                "duration": "4 hours",
                "skill": second_gap,
            },
            {
                "title": f"The {target_role} Handbook",
                "url": "https://learning.oreilly.com/placeholder",
                "type": "book",
                "duration": "6 hours",
                "skill": f"{target_role} domain knowledge",
            },
        ],
    }


def _adaptive_update(inp: dict) -> dict:
    feedback: str = inp.get("feedback", "")
    current_pathway: dict = inp.get("current_pathway", {})
    completed: list = inp.get("completed_milestones", [])

    summary = (
        f"Pathway updated based on your feedback: \"{feedback}\"."
        if feedback
        else "Pathway refreshed based on your recent progress."
    )

    return {
        "_mock": True,
        "updated_pathway": {
            **current_pathway,
            "last_updated": "2026-11-09T00:00:00Z",
        },
        "changes_summary": summary,
    }


def _progress_summary(inp: dict) -> dict:
    completed: list = inp.get("completed_milestones", [])
    goals: list = inp.get("goals", [])
    target_role: str = inp.get("target_role", "professional")

    count = len(completed)
    total = max(len(goals), count, 3)
    pct = round((count / total) * 100, 1)

    narrative = (
        f"Based on your goal to become a {target_role}, you have completed {count} "
        f"out of {total} milestones ({pct}%). "
    )
    if count == 0:
        narrative += "You're just getting started — great things await!"
    elif pct < 50:
        narrative += "You're making solid early progress. Keep the momentum going."
    elif pct < 100:
        narrative += "You're more than halfway there. The finish line is in sight!"
    else:
        narrative += "Congratulations — you've completed all milestones on your pathway!"

    return {
        "_mock": True,
        "narrative": narrative,
        "completion_pct": pct,
        "next_steps": [
            f"Review your next milestone on the {target_role} pathway",
            "Check new course recommendations based on your progress",
            "Share your progress with the AI Learning Companion for tailored advice",
        ],
    }


def _learning_companion(inp: dict) -> dict:
    message: str = inp.get("message", "")
    session_context: dict = inp.get("session_context", {})
    target_role: str = session_context.get("target_role", "your target role")

    response = (
        f"I heard you: \"{message}\". "
        f"Based on your goal to become a {target_role}, "
        "here is my suggestion: focus on the highest-priority gap in your skill analysis "
        "and work through the top recommended resource this week."
    )

    return {
        "_mock": True,
        "response": response,
        "suggested_actions": [
            "Review your learning pathway",
            "Check the latest course recommendations",
            f"Explore IBM SkillsBuild resources for {target_role}",
        ],
    }


# ---------------------------------------------------------------------------
# Langflow Component class (only registered when Langflow is available)
# ---------------------------------------------------------------------------

if _LANGFLOW_AVAILABLE:

    class GraniteStub(Component):
        """
        Lightly dynamic IBM Granite mock component for LearnMate AI.

        Accepts a ``flow_type`` string and a JSON-serialised ``input_json``
        string, then returns a structured mock JSON response that reflects
        the learner's actual inputs.  All responses carry ``"_mock": true``.
        """

        display_name: str = "GraniteStub (Mock)"
        description: str = (
            "Lightly dynamic IBM Granite mock. "
            "Replace with GraniteWatsonx to use real watsonx.ai."
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
            flow_type: str = self.flow_type  # type: ignore[attr-defined]
            input_json: str = self.input_json  # type: ignore[attr-defined]

            print(f"[MOCK] GraniteStub responding for flow: {flow_type}", file=sys.stdout)

            try:
                inputs: dict = json.loads(input_json)
            except json.JSONDecodeError as exc:
                return Data(data={"_mock": True, "error": f"Invalid input_json: {exc}"})

            result = _build_mock_response(flow_type, inputs)
            return Data(data=result)

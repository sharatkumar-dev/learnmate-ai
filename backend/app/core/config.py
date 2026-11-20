from pathlib import Path
import os
from dotenv import load_dotenv

# Search root .env and backend .env
root_dir = Path(__file__).resolve().parents[2]
backend_dir = Path(__file__).resolve().parents[1]

load_dotenv(root_dir / ".env")
load_dotenv(backend_dir / ".env")
load_dotenv()

# Langflow
LANGFLOW_BASE_URL: str = os.getenv("LANGFLOW_BASE_URL", "http://localhost:7860")
LANGFLOW_API_KEY: str = os.getenv("LANGFLOW_API_KEY", "")

# IBM watsonx.ai
WATSONX_API_KEY: str = os.getenv("WATSONX_API_KEY", "")
WATSONX_PROJECT_ID: str = os.getenv("WATSONX_PROJECT_ID", "")
WATSONX_URL: str = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")

FLOW_ID_PATHWAY_GENERATION: str = os.getenv("FLOW_ID_PATHWAY_GENERATION", "")
FLOW_ID_SKILL_GAP_ANALYSIS: str = os.getenv("FLOW_ID_SKILL_GAP_ANALYSIS", "")
FLOW_ID_COURSE_RECOMMENDATIONS: str = os.getenv("FLOW_ID_COURSE_RECOMMENDATIONS", "")
FLOW_ID_ADAPTIVE_UPDATE: str = os.getenv("FLOW_ID_ADAPTIVE_UPDATE", "")
FLOW_ID_PROGRESS_SUMMARY: str = os.getenv("FLOW_ID_PROGRESS_SUMMARY", "")
FLOW_ID_LEARNING_COMPANION: str = os.getenv("FLOW_ID_LEARNING_COMPANION", "")

# Google Gemini API
GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")

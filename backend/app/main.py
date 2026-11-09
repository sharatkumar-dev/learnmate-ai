from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core import config
from app.clients.langflow import LangflowClient
from app.routers import companion, pathway, progress, recommendations, session, skills


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create shared HTTP client and LangflowClient
    http_client = httpx.AsyncClient()
    app.state.http_client = http_client
    app.state.langflow_client = LangflowClient(
        base_url=config.LANGFLOW_BASE_URL,
        api_key=config.LANGFLOW_API_KEY,
    )
    yield
    # Shutdown: close the shared HTTP client
    await http_client.aclose()


app = FastAPI(title="LearnMate AI API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}


app.include_router(session.router, prefix="/api")
app.include_router(pathway.router, prefix="/api")
app.include_router(skills.router, prefix="/api")
app.include_router(recommendations.router, prefix="/api")
app.include_router(progress.router, prefix="/api")
app.include_router(companion.router, prefix="/api")

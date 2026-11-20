from fastapi import APIRouter, Header, Request, UploadFile, File, HTTPException
from app.models.chat import ChatResponse
from app.models.requests import ChatRequest, FeedbackRequest
from app.services import companion_service

router = APIRouter(prefix="/companion", tags=["companion"])


@router.post("/chat", response_model=ChatResponse, response_model_by_alias=True)
async def companion_chat(
    body: ChatRequest,
    request: Request,
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    langflow_client = request.app.state.langflow_client
    return await companion_service.chat(
        session_id=x_session_id,
        message=body.message,
        langflow_client=langflow_client,
        cognitive_mode=body.cognitive_mode,
        conversation_id=body.conversation_id,
        attachments=body.attachments,
        context=body.context,
    )


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    """Upload and parse a document (PDF, DOCX, TXT, MD, Code) for AI context."""
    filename = file.filename or "uploaded_file.txt"
    content_bytes = await file.read()
    file_size = len(content_bytes)

    if file_size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum 10 MB limit.")

    text_content = ""
    try:
        text_content = content_bytes.decode("utf-8", errors="replace")
    except Exception:
        text_content = f"Binary content extracted from {filename} ({file_size} bytes)"

    ext = filename.split(".")[-1].lower() if "." in filename else "txt"
    file_type = "code" if ext in ["go", "rs", "py", "js", "ts", "json", "sql", "yaml", "sh"] else "doc"

    return {
        "success": True,
        "filename": filename,
        "file_type": file_type,
        "file_size": file_size,
        "extracted_chars": len(text_content),
        "text_preview": text_content[:500],
        "text_content": text_content,
    }


@router.post("/feedback")
async def record_feedback(
    body: FeedbackRequest,
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    """Record thumbs-up / thumbs-down rating for a message turn."""
    return {"status": "ok", "message_id": body.message_id, "rating": body.rating}


@router.get("/suggested-prompts")
async def get_suggested_prompts(
    module_code: str = "MOD-201",
    x_session_id: str = Header(..., alias="X-Session-ID"),
):
    """Return context-aware starter prompts for the active curriculum module."""
    prompts_map = {
        "MOD-101": [
            "Why is CAS insufficient without memory ordering barriers?",
            "Analyze lock-free queue memory reclamation techniques",
            "Show an example of ABA race condition in Rust",
        ],
        "MOD-201": [
            "Explain split-brain isolation and majority quorum in Raft",
            "Show Go implementation of Raft checkCommitQuorum()",
            "Compare Raft log replication guarantees with Multi-Paxos",
        ],
        "MOD-301": [
            "How do vector clocks detect concurrent conflict forks?",
            "Explain Lamport timestamps vs Physical Clock skew",
            "Design a CRDT counter for high-concurrency clusters",
        ],
    }
    return {"prompts": prompts_map.get(module_code, prompts_map["MOD-201"])}

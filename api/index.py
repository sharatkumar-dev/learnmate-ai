import sys
from pathlib import Path

# Add backend and root directories to sys.path
root_dir = Path(__file__).resolve().parent.parent
backend_dir = root_dir / "backend"

for p in [str(backend_dir), str(root_dir)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app.main import app  # noqa: E402

# Vercel looks for the ASGI application object named `app`

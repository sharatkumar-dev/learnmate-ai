@echo off
echo ========================================================
echo   Starting LearnMate AI Backend (FastAPI) and Frontend
echo ========================================================
start "LearnMate Backend (FastAPI: 8000)" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
start "LearnMate Frontend (Vite: 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"
echo Both servers started in separate terminal windows.
echo Frontend: http://localhost:5173
echo Backend:  http://127.0.0.1:8000

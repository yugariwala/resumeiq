@echo off
title ResumeIQ - All Servers
color 0A

echo ============================================
echo    ResumeIQ - Starting All Servers
echo ============================================
echo.

cd /d "%~dp0"

:: Start AI Engine (Python FastAPI on port 8000)
echo [1/3] Starting AI Engine on port 8000...
start "ResumeIQ AI Engine" cmd /k "cd /d "%~dp0ai-engine" && venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000"

:: Wait a moment for AI engine to initialize
timeout /t 3 /nobreak >nul

:: Start Backend (Node/Express on port 3001)
echo [2/3] Starting Backend on port 3001...
start "ResumeIQ Backend" cmd /k "cd /d "%~dp0backend" && npx tsx src/index.ts"

:: Wait a moment for backend to initialize
timeout /t 2 /nobreak >nul

:: Start Frontend (Vite on port 5173)
echo [3/3] Starting Frontend on port 5173...
start "ResumeIQ Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: Wait for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo ============================================
echo    All servers started!
echo.
echo    Frontend:   http://localhost:5173
echo    Backend:    http://localhost:3001
echo    AI Engine:  http://localhost:8000
echo ============================================
echo.
echo Opening browser...
start http://localhost:5173

echo.
echo Close this window to keep servers running.
echo To stop all servers, close each terminal window.
pause

@echo off
REM Script para iniciar el servidor FastAPI desde la extensión
cd /d "%~dp0.."
start "Medical Records Server" python -m uvicorn server.main:app --host 127.0.0.1 --port 5847

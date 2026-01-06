@echo off
REM Native Messaging Host Launcher for Windows
REM Este script ejecuta el native-host.py con Python explícitamente

REM Obtener el directorio donde está este script
set "SCRIPT_DIR=%~dp0"

REM Ejecutar native-host.py con Python
python "%SCRIPT_DIR%native-host.py" %*

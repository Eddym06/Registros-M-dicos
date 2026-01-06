@echo off
REM Script para iniciar el servidor en Windows
echo ========================================
echo Servidor de Registros Medicos
echo ========================================

REM Verificar si Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no esta instalado
    echo Por favor instale Python 3.8 o superior desde python.org
    pause
    exit /b 1
)

REM Ir al directorio del script
cd /d "%~dp0"

REM Verificar si las dependencias estan instaladas
python -c "import fastapi" >nul 2>&1
if errorlevel 1 (
    echo Instalando dependencias...
    python -m pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

REM Iniciar el servidor
echo.
echo Iniciando servidor...
echo El servidor estara disponible en http://localhost:5847
echo Presione Ctrl+C para detener el servidor
echo.
python main.py

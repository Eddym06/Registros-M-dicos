@echo off
REM ============================================================================
REM Script para crear una copia lista para distribucion
REM ============================================================================
SETLOCAL EnableDelayedExpansion

echo.
echo ========================================================================
echo   PREPARAR PROYECTO PARA DISTRIBUCION
echo ========================================================================
echo.

REM Rutas
set "CURRENT_DIR=%~dp0"
set "DOWNLOADS_DIR=%USERPROFILE%\Downloads"
set "DIST_NAME=Registros-Medicos-Distribucion"
set "COUNTER=1"
set "DIST_DIR=%DOWNLOADS_DIR%\%DIST_NAME%"

REM Verificar si ya existe
:CHECK_NAME
if exist "%DIST_DIR%" (
    set "DIST_DIR=%DOWNLOADS_DIR%\%DIST_NAME%-%COUNTER%"
    set /a COUNTER+=1
    goto CHECK_NAME
)

echo [*] Destino: %DIST_DIR%
echo.
echo [1/3] Copiando archivos...

REM Copiar archivos y carpetas necesarios uno por uno
mkdir "%DIST_DIR%"

REM Archivos raiz
echo     - Archivos de configuracion...
copy "%CURRENT_DIR%*.md" "%DIST_DIR%\" >nul 2>&1
copy "%CURRENT_DIR%*.json" "%DIST_DIR%\" >nul 2>&1
copy "%CURRENT_DIR%*.html" "%DIST_DIR%\" >nul 2>&1
copy "%CURRENT_DIR%*.cjs" "%DIST_DIR%\" >nul 2>&1
copy "%CURRENT_DIR%*.ts" "%DIST_DIR%\" >nul 2>&1
copy "%CURRENT_DIR%*.bat" "%DIST_DIR%\" >nul 2>&1
copy "%CURRENT_DIR%*.sh" "%DIST_DIR%\" >nul 2>&1
copy "%CURRENT_DIR%*.gitignore" "%DIST_DIR%\" >nul 2>&1

REM Excluir este script
del "%DIST_DIR%\preparar-para-distribucion.bat" >nul 2>&1

REM Carpetas importantes
echo     - Codigo fuente...
xcopy "%CURRENT_DIR%src" "%DIST_DIR%\src\" /E /I /Y >nul 2>&1
xcopy "%CURRENT_DIR%server" "%DIST_DIR%\server\" /E /I /Y >nul 2>&1
xcopy "%CURRENT_DIR%extension" "%DIST_DIR%\extension\" /E /I /Y >nul 2>&1
xcopy "%CURRENT_DIR%public" "%DIST_DIR%\public\" /E /I /Y >nul 2>&1

echo [+] Archivos copiados
echo.

REM Limpiar archivos temporales
echo [2/3] Limpiando archivos temporales...
del /s /q "%DIST_DIR%\*.log" >nul 2>&1
for /d /r "%DIST_DIR%" %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d" 2>nul

echo [+] Limpieza completada
echo.

REM Crear archivo de instrucciones
echo [3/3] Creando instrucciones...
(
echo INSTRUCCIONES PARA DISTRIBUCION
echo ================================
echo.
echo Este paquete contiene el sistema de Registros Medicos.
echo.
echo COMO COMPRIMIR:
echo 1. Clic derecho en esta carpeta
echo 2. "Enviar a" - "Carpeta comprimida (zip^)"
echo 3. Entregar el archivo ZIP
echo.
echo QUE DEBE HACER EL USUARIO:
echo 1. Extraer el ZIP
echo 2. Ejecutar setup.bat (Windows^) o ./setup.sh (Mac/Linux^)
echo 3. Cargar la extension en Chrome
echo 4. Proporcionar el ID de la extension cuando se solicite
echo.
echo Todo se instalara automaticamente (Python, dependencias, etc.^)
) > "%DIST_DIR%\LEER-PRIMERO.txt"

echo [+] Instrucciones creadas
echo.

REM Calcular tamaño
for /f "tokens=3" %%a in ('dir "%DIST_DIR%" /s /-c 2^>nul ^| findstr /C:"bytes"') do set SIZE=%%a
if defined SIZE (
    set /a SIZE_MB=%SIZE:~0,-6%
    if %SIZE_MB% LSS 1 set SIZE_MB=1
) else (
    set SIZE_MB=Desconocido
)

echo.
echo ========================================================================
echo   LISTO! Copia creada en DESCARGAS
echo ========================================================================
echo.
echo Ubicacion: %DIST_DIR%
echo Tamano aproximado: %SIZE_MB% MB
echo.
echo SIGUIENTE PASO:
echo 1. Abrir: %DIST_DIR%
echo 2. Clic derecho en la carpeta
echo 3. "Enviar a" - "Carpeta comprimida (zip)"
echo 4. Entregar el ZIP
echo.

REM Abrir carpeta
start "" explorer "%DIST_DIR%"

pause

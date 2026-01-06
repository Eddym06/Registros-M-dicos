@echo off
REM ============================================================================
REM Script para limpiar instalacion de setup.bat
REM Elimina dependencias y configuraciones, pero mantiene Python
REM ============================================================================
SETLOCAL EnableDelayedExpansion

echo.
echo ========================================================================
echo   LIMPIAR INSTALACION DE SETUP.BAT
echo   Esto eliminara configuraciones y dependencias instaladas
echo ========================================================================
echo.

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%"

echo [1/5] Eliminando Native Messaging Host...

REM Eliminar del registro de Windows
reg delete "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.medicalrecords.host" /f >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [+] Entrada del registro eliminada
) else (
    echo [-] No habia entrada en el registro
)

REM Eliminar manifest JSON
set "NMH_DIR=%LOCALAPPDATA%\Google\Chrome\NativeMessagingHosts"
if exist "%NMH_DIR%\com.medicalrecords.host.json" (
    del /q "%NMH_DIR%\com.medicalrecords.host.json"
    echo [+] Manifest eliminado
) else (
    echo [-] No habia manifest
)

REM Eliminar manifest temporal en extension
if exist "%SCRIPT_DIR%extension\native-host-manifest-temp.json" (
    del /q "%SCRIPT_DIR%extension\native-host-manifest-temp.json"
    echo [+] Manifest temporal eliminado
)

echo.
echo [2/5] Eliminando dependencias de Node.js...

if exist "node_modules" (
    echo [*] Eliminando node_modules (esto puede tardar...)
    rmdir /s /q "node_modules" 2>nul
    if exist "node_modules" (
        rd /s /q "node_modules"
    )
    echo [+] node_modules eliminado
) else (
    echo [-] No habia node_modules
)

if exist "package-lock.json" (
    del /q "package-lock.json"
    echo [+] package-lock.json eliminado
)

echo.
echo [3/5] Eliminando build de la aplicacion...

if exist "dist" (
    rmdir /s /q "dist"
    echo [+] dist/ eliminado
) else (
    echo [-] No habia dist/
)

if exist "extension\dist" (
    rmdir /s /q "extension\dist"
    echo [+] extension/dist eliminado
)

if exist "extension\assets" (
    rmdir /s /q "extension\assets"
    echo [+] extension/assets eliminado
)

if exist "extension\index.html" (
    del /q "extension\index.html"
    echo [+] extension/index.html eliminado
)

echo.
echo [4/5] Eliminando entornos virtuales Python...

if exist ".venv" (
    rmdir /s /q ".venv"
    echo [+] .venv eliminado
)

if exist ".venv-1" (
    rmdir /s /q ".venv-1"
    echo [+] .venv-1 eliminado
)

REM Nota: No eliminamos las dependencias globales de Python
echo [*] Python global y sus dependencias se mantienen intactos

echo.
echo [5/5] Limpiando archivos temporales...

REM Eliminar logs
del /s /q "*.log" 2>nul
del /q "extension\native-host.log" 2>nul

REM Eliminar __pycache__
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d" 2>nul

echo [+] Archivos temporales eliminados

echo.
echo ========================================================================
echo   LIMPIEZA COMPLETADA
echo ========================================================================
echo.
echo Se han eliminado:
echo   - Native Messaging Host (registro + manifest)
echo   - node_modules/ y package-lock.json
echo   - dist/ (builds de la aplicacion)
echo   - .venv/ (entornos virtuales Python)
echo   - Archivos temporales y logs
echo.
echo Se mantienen:
echo   - Python (instalacion global)
echo   - Codigo fuente (server/, src/, extension/)
echo   - Archivos de configuracion
echo.
echo AHORA PUEDES:
echo   1. Ejecutar setup.bat nuevamente para reinstalar todo
echo   2. Probar la instalacion desde cero
echo.

pause

@echo off
REM ============================================================================
REM Script para desbloquear archivos en Windows
REM Ejecutar ANTES de setup.bat si Windows bloquea la instalacion
REM ============================================================================

echo.
echo ========================================================================
echo   DESBLOQUEAR INSTALADOR
echo   Soluciona el bloqueo de Windows SmartScreen
echo ========================================================================
echo.

echo [*] Desbloqueando archivos...
echo.

powershell -Command "Get-ChildItem -Path '%~dp0' -Recurse -File | Unblock-File"

echo.
echo [+] Archivos desbloqueados correctamente
echo.
echo ========================================================================
echo   AHORA PUEDES EJECUTAR: setup.bat
echo ========================================================================
echo.

pause

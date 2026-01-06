@echo off
REM ============================================================================
REM Configurar Native Messaging Host para Chrome Extension
REM ============================================================================
SETLOCAL EnableDelayedExpansion

echo.
echo ========================================================================
echo   CONFIGURAR NATIVE MESSAGING HOST
echo ========================================================================
echo.

REM Obtener el directorio actual
set "SCRIPT_DIR=%~dp0"

echo Para que la extension pueda iniciar el servidor automaticamente,
echo necesita el ID de la extension de Chrome.
echo.
echo PASOS:
echo 1. Abra Chrome y vaya a: chrome://extensions/
echo 2. Active "Modo de desarrollador" (esquina superior derecha)
echo 3. Busque la extension "Medical Records"
echo 4. Copie el ID (ej: jekjgpmiogcjojlmhdhnafanlfodlhkm)
echo.

set /p EXTENSION_ID="Ingrese el ID de la extension: "

if "!EXTENSION_ID!"=="" (
    echo.
    echo [!] No se ingreso ID. Saliendo...
    pause
    exit /b 1
)

echo.
echo [*] Configurando Native Messaging Host...

REM Crear el directorio de Native Messaging Hosts
set "NMH_DIR=%LOCALAPPDATA%\Google\Chrome\NativeMessagingHosts"
if not exist "!NMH_DIR!" mkdir "!NMH_DIR!"

REM Ruta al launcher .bat (no al .py directamente para evitar que se abra PyCharm)
set "NATIVE_HOST_PATH=%SCRIPT_DIR%extension\native-host-launcher.bat"

REM Convertir ruta a formato JSON (escapar barras)
set "NATIVE_HOST_JSON=!NATIVE_HOST_PATH:\=\\!"

REM Crear archivo manifest
set "MANIFEST_FILE=!NMH_DIR!\com.medicalrecords.host.json"

(
    echo {
    echo   "name": "com.medicalrecords.host",
    echo   "description": "Native Messaging Host for Medical Records Server",
    echo   "path": "!NATIVE_HOST_JSON!",
    echo   "type": "stdio",
    echo   "allowed_origins": [
    echo     "chrome-extension://!EXTENSION_ID!/"
    echo   ]
    echo }
) > "!MANIFEST_FILE!"

echo [+] Manifest creado en: !MANIFEST_FILE!

REM Registrar en el registro de Windows
reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.medicalrecords.host" /ve /t REG_SZ /d "!MANIFEST_FILE!" /f >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [+] Registrado en el registro de Windows
    echo.
    echo ========================================================================
    echo   CONFIGURACION COMPLETADA
    echo ========================================================================
    echo.
    echo El Native Messaging Host esta configurado correctamente.
    echo.
    echo AHORA:
    echo 1. Recargue la extension en Chrome
    echo 2. Clic en el icono de la extension
    echo 3. Clic en "Iniciar Servidor"
    echo 4. Deberia funcionar sin errores
    echo.
) else (
    echo [!] Error al registrar en Windows
    echo.
    echo Intente ejecutar este script como Administrador
    echo.
)

pause

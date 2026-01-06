@echo off
REM ============================================================================
REM Script para crear una copia lista para distribucion (NO modifica el original)
REM ============================================================================
SETLOCAL EnableDelayedExpansion

echo.
echo ========================================================================
echo   PREPARAR PROYECTO PARA DISTRIBUCION
echo   Este script crea una COPIA limpia sin modificar el repositorio
echo ========================================================================
echo.

REM Obtener la ruta del directorio actual
set "CURRENT_DIR=%~dp0"

REM Determinar carpeta de Descargas
set "DOWNLOADS_DIR=%USERPROFILE%\Downloads"

REM Generar nombre unico para la carpeta de distribucion
set "DIST_NAME=Registros-Medicos-Distribucion"
set "COUNTER=1"
set "DIST_DIR=%DOWNLOADS_DIR%\%DIST_NAME%"

REM Si ya existe, agregar numero
:CHECK_NAME
if exist "%DIST_DIR%" (
    set "DIST_DIR=%DOWNLOADS_DIR%\%DIST_NAME%-%COUNTER%"
    set /a COUNTER+=1
    goto CHECK_NAME
)

echo [*] Creando copia en: %DIST_DIR%
echo.

REM Crear carpeta de distribucion
mkdir "%DIST_DIR%"

REM Copiar todo primero
echo [1/4] Copiando archivos del proyecto...
echo     Origen: %CURRENT_DIR%
echo     Destino: %DIST_DIR%
echo.

xcopy "%CURRENT_DIR%*" "%DIST_DIR%\" /E /I /H /Y /EXCLUDE:%TEMP%\xcopy_exclude.txt

REM Crear archivo de exclusion
echo .venv > %TEMP%\xcopy_exclude.txt
echo .venv-1 >> %TEMP%\xcopy_exclude.txt
echo node_modules >> %TEMP%\xcopy_exclude.txt
echo .git >> %TEMP%\xcopy_exclude.txt
echo preparar-para-distribucion.bat >> %TEMP%\xcopy_exclude.txt

echo.
echo [+] Archivos copiados
echo.

REM Eliminar carpetas grandes si se copiaron
echo [2/4] Limpiando carpetas innecesarias...

if exist "%DIST_DIR%\.venv" rd /s /q "%DIST_DIR%\.venv"
if exist "%DIST_DIR%\.venv-1" rd /s /q "%DIST_DIR%\.venv-1"
if exist "%DIST_DIR%\node_modules" rd /s /q "%DIST_DIR%\node_modules"
if exist "%DIST_DIR%\dist" rd /s /q "%DIST_DIR%\dist"
if exist "%DIST_DIR%\.git" rd /s /q "%DIST_DIR%\.git"

REM Limpiar logs
del /s /q "%DIST_DIR%\*.log" 2>nul

REM Limpiar carpetas __pycache__
for /d /r "%DIST_DIR%" %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d" 2>nul

echo [+] Archivos temporales eliminados
echo.

REM Calcular tamano aproximado
echo [3/4] Calculando tamano...
for /f "tokens=3" %%a in ('dir "%DIST_DIR%" /s /-c ^| findstr /C:"bytes"') do set SIZE=%%a
set /a SIZE_MB=%SIZE:~0,-6%
if %SIZE_MB% LSS 1 set SIZE_MB=1

echo [+] Tamano aproximado: %SIZE_MB% MB
echo.

echo [4/4] Creando archivo con instrucciones...
echo INSTRUCCIONES PARA COMPRIMIR > "%DIST_DIR%\LEER-PRIMERO.txt"
echo ================================ >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo. >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo Esta carpeta contiene el proyecto listo para distribucion. >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo. >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo PASOS: >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo 1. Clic derecho en esta carpeta >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo 2. "Enviar a" - "Carpeta comprimida (zip)" >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo 3. Entregar el ZIP al usuario final >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo. >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo El usuario solo debe: >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo - Extraer el ZIP >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo - Ejecutar setup.bat (Windows) o ./setup.sh (Mac/Linux) >> "%DIST_DIR%\LEER-PRIMERO.txt"
echo - Todo se instalara automaticamente >> "%DIST_DIR%\LEER-PRIMERO.txt"

echo.
echo ========================================================================
echo   LISTO! Copia para distribucion creada en DESCARGAS
echo ========================================================================
echo.
echo Ubicacion: %DIST_DIR%
echo Tamano: ~%SIZE_MB% MB
echo.
echo SIGUIENTE PASO:
echo 1. Ve a tu carpeta de Descargas (Downloads)
echo 2. Busca la carpeta: %DIST_NAME%
echo 3. Clic derecho en la carpeta
echo 4. "Enviar a" - "Carpeta comprimida (zip)"
echo 5. Entregar el ZIP al medico
echo.
echo TU REPOSITORIO ORIGINAL NO FUE MODIFICADO
echo La copia limpia esta en: %DOWNLOADS_DIR%
echo.

REM Abrir la carpeta de distribucion
start "" explorer "%DIST_DIR%"

pause

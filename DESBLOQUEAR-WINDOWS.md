# COMO DESBLOQUEAR EL INSTALADOR EN WINDOWS

## Problema
Windows bloquea la ejecución de setup.bat por seguridad.

## Solución 1: Desbloquear archivo (MÁS RÁPIDO)

### Opción A - Desde las propiedades:
1. Clic derecho en `setup.bat`
2. Seleccionar **"Propiedades"**
3. En la pestaña **"General"**
4. Marcar la casilla **"Desbloquear"** (abajo)
5. Clic en **"Aplicar"** y **"Aceptar"**
6. Ejecutar `setup.bat` normalmente

### Opción B - Desde PowerShell (automático):
Abre PowerShell en la carpeta y ejecuta:
```powershell
Unblock-File .\setup.bat
Unblock-File .\setup.sh
```

## Solución 2: Ejecutar como Administrador

1. Clic derecho en `setup.bat`
2. Seleccionar **"Ejecutar como administrador"**
3. Clic en **"Sí"** cuando pida confirmación

## Solución 3: Deshabilitar SmartScreen temporalmente

### Para este archivo específico:
1. Doble clic en `setup.bat`
2. Si aparece "Windows protegió tu PC"
3. Clic en **"Más información"**
4. Clic en **"Ejecutar de todas formas"**

### Para deshabilitar SmartScreen (temporal):
1. Presionar `Win + R`
2. Escribir: `ms-settings:windowsdefender`
3. Ir a **"Control de aplicaciones y navegador"**
4. En **"Comprobar aplicaciones y archivos"** → Seleccionar **"Desactivar"**
5. Ejecutar el instalador
6. **IMPORTANTE**: Volver a activarlo después

## Solución 4: Usar PowerShell directamente

Abre PowerShell en la carpeta y ejecuta comandos manualmente:

```powershell
# Verificar Python
python --version

# Si no está instalado, instalar manualmente desde:
# https://www.python.org/downloads/

# Instalar dependencias Python
python -m pip install fastapi uvicorn python-multipart pydantic Pillow

# Instalar dependencias npm
npm install

# Construir aplicación
npm run build
node extension/build-extension.js
```

## Solución 5: Para distribución al médico

Crea un archivo `INSTRUCCIONES-WINDOWS.txt` con estas opciones para que el médico sepa qué hacer si Windows bloquea el instalador.

---

## ¿Qué solución prefieres?
- **Solución 1**: La más rápida (desbloquear archivo)
- **Solución 2**: Más permisos (ejecutar como admin)
- **Solución 3**: Deshabilitar protección temporal
- **Solución 4**: Manual paso a paso

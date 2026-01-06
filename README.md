# 🏥 Medical Records - Sistema de Registros Médicos

Sistema completo de gestión de registros médicos con Chrome Extension y servidor FastAPI local.

## ✨ Características

- 📋 Gestión completa de historias clínicas
- 🖼️ Soporte para imágenes médicas
- 🔄 Sincronización automática con servidor local
- 💾 Almacenamiento local en JSON (Downloads/MedicalRecords/)
- 🚀 Inicio automático del servidor desde la extensión
- 🌐 Compatible con Windows, Mac y Linux
- 🔒 100% privado - sin conexión a internet

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: FastAPI + Uvicorn + Pydantic v2
- **Extension**: Chrome Manifest v3 + Native Messaging
- **Storage**: JSON files + imágenes en carpeta local

---

## 📦 Instalación Rápida

### Windows
```cmd
setup.bat
```

### Mac/Linux
```bash
chmod +x setup.sh
./setup.sh
```

---

## 🎯 ¿Qué hace el instalador?

Los scripts **`setup.bat`** (Windows) y **`setup.sh`** (Mac/Linux) **configuran TODO automáticamente**:

### 1️⃣ Verificación e Instalación de Python
✅ Detecta si Python está instalado  
✅ Si no existe, **lo descarga e instala automáticamente**:
   - **Windows**: Python 3.11.9 desde python.org
   - **Mac**: Python3 vía Homebrew (instala Homebrew si no existe)
   - **Linux**: Python3 vía apt-get/yum/dnf  
✅ Instala dependencias: `fastapi`, `uvicorn`, `python-multipart`, `pydantic`, `Pillow`

### 2️⃣ Verificación de Node.js
✅ Detecta si Node.js está instalado  
✅ Instala dependencias npm del proyecto  
✅ En Mac/Linux, puede instalar Node.js vía Homebrew si no existe

### 3️⃣ Construcción de la Aplicación
✅ Compila la aplicación React con Vite  
✅ Genera archivos optimizados en `/dist`  
✅ Copia archivos de la extensión

### 4️⃣ Configuración de Native Messaging
✅ Registra el Native Messaging Host en el sistema  
✅ Permite que la extensión inicie el servidor automáticamente  
✅ Solicita el ID de la extensión durante la instalación

### 5️⃣ Menú Interactivo Post-Instalación

Después de la instalación, el instalador ofrece un menú:

1. **Iniciar servidor FastAPI** - `http://localhost:5847`
2. **Iniciar servidor de desarrollo** - `http://localhost:5173` (con hot reload)
3. **Iniciar ambos servidores** - FastAPI + Dev simultáneamente
4. **Crear iconos de la extensión** - Genera iconos desde una imagen
5. **Abrir carpeta de datos** - Downloads/MedicalRecords/
6. **Ver logs del Native Host** - Logs de depuración
7. **Salir**

---

## 🚀 Guía de Uso

### Primera Vez

1. **Ejecutar el instalador**
   ```bash
   # Windows
   setup.bat
   
   # Mac/Linux
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Cargar la extensión en Chrome**
   - Abrir Chrome → `chrome://extensions/`
   - Activar **"Modo de desarrollador"**
   - Clic en **"Cargar extensión sin empaquetar"**
   - Seleccionar la carpeta **`extension/`**
   - **Copiar el ID de la extensión** (ej: `jekjgpmiogcjojlmhdhnafanlfodlhkm`)

3. **Registrar Native Messaging** (para inicio automático)
   - Si el instalador lo solicita, pegar el ID de la extensión
   - O ejecutar el instalador nuevamente y proporcionarlo en el paso 5

4. **¡Listo! Usar la aplicación**
   - Clic en el ícono de la extensión en Chrome
   - Si el servidor no está corriendo: clic en **"🚀 Iniciar Servidor"**
   - Clic en **"Abrir Registro Médico"**

### Uso Diario

**Opción 1: Desde la extensión** ⭐ *Recomendado*
- Clic en el ícono de la extensión
- Clic en "Iniciar Servidor" (si no está corriendo)
- Clic en "Abrir Registro Médico"

**Opción 2: Desde el instalador**
- Ejecutar `setup.bat` / `./setup.sh`
- Seleccionar opción **1** (Iniciar servidor FastAPI)
- Abrir Chrome y usar la extensión

**Opción 3: Manual** (línea de comandos)
```bash
# Windows
python -m uvicorn server.main:app --host 127.0.0.1 --port 5847 --reload

# Mac/Linux
python3 -m uvicorn server.main:app --host 127.0.0.1 --port 5847 --reload
```

---

## 📁 Estructura del Proyecto

```
Registros-Médicos/
├── setup.bat                 # ⚡ Instalador Windows (TODO incluido)
├── setup.sh                  # ⚡ Instalador Mac/Linux (TODO incluido)
│
├── server/
│   └── main.py              # Servidor FastAPI con API REST
│
├── src/                     # Código fuente React
│   ├── App.tsx              # Aplicación principal
│   ├── components/          # Componentes UI
│   │   └── ui/             # shadcn/ui components
│   └── services/
│       └── api.ts          # Cliente API
│
├── extension/               # Extensión de Chrome
│   ├── manifest.json       # Manifest v3
│   ├── background.js       # Service Worker
│   ├── popup.html          # Popup de la extensión
│   ├── popup.js            # Lógica del popup
│   ├── native-host.py      # Native Messaging Host
│   ├── native-host.bat     # Wrapper Windows
│   ├── native-host-manifest.json
│   └── icons/              # Iconos de la extensión
│
├── dist/                    # Build de producción (generado)
├── package.json
└── vite.config.ts
```

---

## 📍 Almacenamiento de Datos

Todos los datos se guardan **localmente** en:

```
Windows: C:\Users\[Usuario]\Downloads\MedicalRecords\
Mac:     /Users/[Usuario]/Downloads/MedicalRecords/
Linux:   /home/[Usuario]/Downloads/MedicalRecords/

MedicalRecords/
├── patients.json        # Base de datos de pacientes
├── images/             # Imágenes médicas subidas
└── backup/            # Backups automáticos
```

**Backups automáticos**: Se crean automáticamente cada vez que se modifican datos, manteniendo los últimos 10 backups.

---

## 🔧 Desarrollo

### Modo Desarrollo
```bash
# Terminal 1 - Servidor FastAPI con hot reload
python -m uvicorn server.main:app --host 127.0.0.1 --port 5847 --reload

# Terminal 2 - React con Vite
npm run dev
```

### Build de Producción
```bash
npm run build
node extension/build-extension.js
```

### API Endpoints

- `GET /api` - Health check
- `GET /` - Sirve la aplicación React
- `GET /patients` - Lista todos los pacientes
- `GET /patients/{id}` - Obtiene un paciente
- `POST /patients` - Crea un paciente
- `PUT /patients/{id}` - Actualiza un paciente
- `DELETE /patients/{id}` - Elimina un paciente
- `POST /upload` - Sube una imagen médica
- `DELETE /images/{filename}` - Elimina una imagen
- `GET /backup/list` - Lista backups
- `POST /backup/restore/{filename}` - Restaura un backup

---

## ❓ Solución de Problemas

### ⚠️ El servidor no inicia desde la extensión

**Solución 1**: Verificar registro del Native Host
```bash
# Windows
reg query "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.medicalrecords.host"

# Mac/Linux
cat ~/Library/Application\ Support/Google/Chrome/NativeMessagingHosts/com.medicalrecords.host.json
```

**Solución 2**: Ejecutar instalador nuevamente
- Ejecutar `setup.bat` / `./setup.sh`
- Proporcionar el ID de la extensión cuando se solicite

**Solución 3**: Verificar logs
- Ver archivo: `extension/native-host.log`

### ⚠️ Puerto 5847 ya está en uso

```bash
# Windows - Encontrar proceso
netstat -ano | findstr :5847
taskkill /PID [PID] /F

# Mac/Linux - Encontrar proceso
lsof -i :5847
kill -9 [PID]
```

### ⚠️ Error de importación de FastAPI

**Causa**: El entorno virtual no está configurado correctamente

**Solución**:
```bash
# Windows
python -m pip install fastapi uvicorn python-multipart pydantic Pillow

# Mac/Linux
python3 -m pip install fastapi uvicorn python-multipart pydantic Pillow
```

### ⚠️ "Python no está instalado"

**Windows**:
- El instalador `setup.bat` lo descarga automáticamente
- Si falla, descargar manualmente: https://www.python.org/downloads/
- **Importante**: Marcar "Add Python to PATH" durante la instalación

**Mac**:
```bash
brew install python3
```

**Linux**:
```bash
sudo apt-get install python3 python3-pip
```

### ⚠️ La extensión no aparece en Chrome

1. Verificar que está en "Modo de desarrollador" (`chrome://extensions/`)
2. Asegurarse de seleccionar la carpeta `extension/` (no la raíz del proyecto)
3. Verificar que existe el archivo `extension/manifest.json`

---

## 📝 Requisitos del Sistema

### Mínimos
- **Python**: 3.8 o superior
- **Node.js**: 16 o superior
- **Chrome**: Versión reciente
- **SO**: Windows 10+, macOS 10.14+, Ubuntu 18.04+
- **Espacio**: ~500MB (con dependencias)

### Recomendados
- **Python**: 3.11+
- **Node.js**: 18 LTS o 20 LTS
- **RAM**: 4GB disponibles
- **Procesador**: Dual-core o superior

---

## 🎉 Resumen: ¿Los instaladores hacen TODO?

### ✅ SÍ - Los instaladores son completos y automáticos

**`setup.bat`** (Windows) y **`setup.sh`** (Mac/Linux) hacen **TODO**:

1. ✅ Verifican Python y lo instalan si no existe
2. ✅ Instalan todas las dependencias Python (FastAPI, etc.)
3. ✅ Verifican Node.js (lo instalan en Mac/Linux si no existe)
4. ✅ Instalan dependencias npm
5. ✅ Construyen la aplicación React
6. ✅ Construyen la extensión de Chrome
7. ✅ Configuran el Native Messaging Host
8. ✅ Ofrecen un menú para iniciar servidores, ver logs, etc.

**Solo necesitas**:
1. Ejecutar el instalador
2. Cargar la extensión en Chrome
3. Proporcionar el ID de la extensión (para Native Messaging)

**¡Eso es todo!** 🚀

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Autor

Sistema desarrollado para gestión de registros médicos locales.

---

## 📮 Soporte

Si encuentras algún problema:
1. Revisa la sección "Solución de Problemas"
2. Verifica los logs en `extension/native-host.log`
3. Ejecuta el instalador nuevamente

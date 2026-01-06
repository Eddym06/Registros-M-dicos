"""
FastAPI Server for Medical Records Management
Compatible with Windows and Mac
Stores data in Downloads/MedicalRecords/
"""

import os
import json
import shutil
import httpx
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn

# ============================================
# CONFIGURACIÓN DE RUTAS MULTIPLATAFORMA
# ============================================

def get_data_directory():
    """Obtiene la ruta de Downloads según el sistema operativo"""
    home = Path.home()
    
    # Windows
    if os.name == 'nt':
        downloads = home / "Downloads" / "MedicalRecords"
    # Mac/Linux
    else:
        downloads = home / "Downloads" / "MedicalRecords"
    
    # Crear directorios si no existen
    downloads.mkdir(parents=True, exist_ok=True)
    (downloads / "images").mkdir(exist_ok=True)
    (downloads / "backup").mkdir(exist_ok=True)
    
    return downloads

DATA_DIR = get_data_directory()
PATIENTS_FILE = DATA_DIR / "patients.json"
IMAGES_DIR = DATA_DIR / "images"
BACKUP_DIR = DATA_DIR / "backup"
API_KEY_FILE = DATA_DIR / "api_key.txt"

# ============================================
# MODELOS DE DATOS
# ============================================

class PatientRecord(BaseModel):
    id: Optional[str] = None
    name: str
    age: str
    gender: str
    historialClinico: str = ""
    antecedentes: str = ""
    sintomas: str = ""
    diagnosticos: str = ""
    tratamientos: str = ""
    notas: str = ""
    images: List[str] = []
    estudiosImagen: str = ""
    estudiosImagenFiles: List[str] = []
    pruebasComplementarias: str = ""
    pruebasComplementariasFiles: List[str] = []
    aiDiagnosis: Optional[dict] = None
    createdAt: Optional[str] = None
    updatedAt: Optional[str] = None

class DiagnosisRequest(BaseModel):
    age: str
    gender: str
    historialClinico: str
    antecedentes: str
    sintomas: str
    diagnosticos: str
    notas: str
    estudiosImagen: str = ""
    pruebasComplementarias: str = ""

class APIKeyRequest(BaseModel):
    api_key: str

# ============================================
# INICIALIZACIÓN DE FASTAPI
# ============================================

app = FastAPI(
    title="Medical Records API",
    description="API local para gestión de registros médicos",
    version="1.0.0"
)

# Configurar CORS para permitir requests desde la extensión de Chrome
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todos los orígenes (seguro para uso local)
    allow_credentials=False,  # Desactivado cuando allow_origins es "*"
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Configurar directorio de archivos estáticos (React app)
DIST_DIR = Path(__file__).parent.parent / "dist"
if DIST_DIR.exists():
    # Montar archivos estáticos (CSS, JS, assets)
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

# ============================================
# FUNCIONES AUXILIARES
# ============================================

def load_patients() -> Dict[str, List[Dict[str, Any]]]:
    """Carga los pacientes desde el archivo JSON"""
    if not PATIENTS_FILE.exists():
        return {"patients": []}
    
    try:
        with open(PATIENTS_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {"patients": []}

def save_patients(data: Dict[str, List[Dict[str, Any]]]) -> None:
    """Guarda los pacientes en el archivo JSON y crea backup"""
    # Guardar archivo principal
    with open(PATIENTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Crear backup con timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = BACKUP_DIR / f"patients_{timestamp}.json"
    shutil.copy(PATIENTS_FILE, backup_file)
    
    # Mantener solo los últimos 10 backups
    backups = sorted(BACKUP_DIR.glob("patients_*.json"))
    if len(backups) > 10:
        for old_backup in backups[:-10]:
            old_backup.unlink()

def generate_id():
    """Genera un ID único basado en timestamp"""
    return str(int(datetime.now().timestamp() * 1000))

# ============================================
# ENDPOINTS DE LA API
# ============================================

@app.get("/")
async def serve_app():
    """Sirve la aplicación React"""
    index_path = DIST_DIR / "index.html"
    if index_path.exists():
        return FileResponse(str(index_path))
    return {"message": "App not built yet. Run: npm run build"}

@app.get("/api")
async def api_root():
    """Endpoint de health check para la API"""
    return {
        "status": "online",
        "service": "Medical Records API",
        "version": "1.0.0",
        "data_directory": str(DATA_DIR)
    }

@app.get("/patients")
async def get_patients() -> Dict[str, List[Dict[str, Any]]]:
    """Obtiene todos los pacientes"""
    data = load_patients()
    return {"patients": data.get("patients", [])}

@app.get("/patients/{patient_id}")
async def get_patient(patient_id: str) -> Dict[str, Any]:
    """Obtener un paciente específico por ID"""
    data = load_patients()
    patients: List[Dict[str, Any]] = data.get("patients", [])
    
    patient = next((p for p in patients if p["id"] == patient_id), None)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    return patient

@app.post("/patients")
async def create_patient(patient: PatientRecord) -> Dict[str, Any]:
    """Crear un nuevo paciente"""
    data = load_patients()
    patients: List[Dict[str, Any]] = data.get("patients", [])
    
    # Generar ID y timestamps
    patient_dict = patient.model_dump()
    patient_dict["id"] = generate_id()
    patient_dict["createdAt"] = datetime.now().isoformat()
    patient_dict["updatedAt"] = datetime.now().isoformat()
    
    # Agregar al inicio de la lista
    patients.insert(0, patient_dict)
    
    data["patients"] = patients
    save_patients(data)
    
    return patient_dict

@app.put("/patients/{patient_id}")
async def update_patient(patient_id: str, patient: PatientRecord) -> Dict[str, Any]:
    """Actualizar un paciente existente"""
    data = load_patients()
    patients: List[Dict[str, Any]] = data.get("patients", [])
    
    # Buscar índice del paciente
    patient_index: Optional[int] = next((i for i, p in enumerate(patients) if p["id"] == patient_id), None)
    if patient_index is None:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Actualizar paciente manteniendo createdAt y actualizando updatedAt
    patient_dict = patient.model_dump()
    patient_dict["id"] = patient_id
    patient_dict["createdAt"] = patients[patient_index]["createdAt"]
    patient_dict["updatedAt"] = datetime.now().isoformat()
    
    patients[patient_index] = patient_dict
    
    data["patients"] = patients
    save_patients(data)
    
    return patient_dict

@app.delete("/patients/{patient_id}")
async def delete_patient(patient_id: str) -> Dict[str, str]:
    """Elimina un paciente y sus imágenes"""
    data = load_patients()
    patients: List[Dict[str, Any]] = data.get("patients", [])
    
    # Buscar paciente
    patient: Optional[Dict[str, Any]] = next((p for p in patients if p["id"] == patient_id), None)
    if not patient:
        raise HTTPException(status_code=404, detail="Paciente no encontrado")
    
    # Eliminar imágenes asociadas
    for image_path in patient.get("images", []):
        full_path = DATA_DIR / image_path
        if full_path.exists():
            full_path.unlink()
    
    # Eliminar paciente de la lista
    patients = [p for p in patients if p["id"] != patient_id]
    
    data["patients"] = patients
    save_patients(data)
    
    return {"message": "Paciente eliminado exitosamente", "id": patient_id}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...), patient_id: str = Body(...)):
    """Sube una imagen médica"""
    # Validar tipo de archivo
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".bmp"}
    filename = file.filename or "image.jpg"
    file_extension = Path(filename).suffix.lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de archivo no permitido. Use: {', '.join(allowed_extensions)}"
        )
    
    # Generar nombre único para la imagen
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_filename = f"patient_{patient_id}_{timestamp}{file_extension}"
    file_path = IMAGES_DIR / safe_filename
    
    # Guardar archivo
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar imagen: {str(e)}")
    
    # Retornar ruta relativa
    return {
        "filename": safe_filename,
        "path": f"images/{safe_filename}",
        "url": f"/images/{safe_filename}"
    }

@app.get("/images/{filename}")
async def get_image(filename: str):
    """Obtiene una imagen médica"""
    file_path = IMAGES_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    
    return FileResponse(file_path)

@app.delete("/images/{filename}")
async def delete_image(filename: str):
    """Elimina una imagen médica"""
    file_path = IMAGES_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Imagen no encontrada")
    
    try:
        file_path.unlink()
        return {"message": "Imagen eliminada exitosamente", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar imagen: {str(e)}")

@app.get("/backup/list")
async def list_backups() -> Dict[str, List[Dict[str, Any]]]:
    """Lista todos los backups disponibles"""
    backups = sorted(BACKUP_DIR.glob("patients_*.json"), reverse=True)
    return {
        "backups": [
            {
                "filename": backup.name,
                "created": datetime.fromtimestamp(backup.stat().st_mtime).isoformat(),
                "size": backup.stat().st_size
            }
            for backup in backups
        ]
    }

@app.post("/backup/restore/{filename}")
async def restore_backup(filename: str):
    """Restaura un backup específico"""
    backup_file = BACKUP_DIR / filename
    
    if not backup_file.exists():
        raise HTTPException(status_code=404, detail="Backup no encontrado")
    
    try:
        shutil.copy(backup_file, PATIENTS_FILE)
        return {"message": "Backup restaurado exitosamente", "filename": filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al restaurar backup: {str(e)}")

# ============================================
# ENDPOINTS DE IA (GROK)
# ============================================

def get_api_key() -> Optional[str]:
    """Lee la API Key del archivo"""
    if not API_KEY_FILE.exists():
        return None
    try:
        return API_KEY_FILE.read_text().strip()
    except Exception:
        return None

def save_api_key(api_key: str):
    """Guarda la API Key de forma segura"""
    try:
        API_KEY_FILE.write_text(api_key)
        API_KEY_FILE.chmod(0o600)  # Solo el propietario puede leer/escribir
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar API Key: {str(e)}")

@app.get("/api/settings/apikey")
async def check_api_key():
    """Verifica si existe una API Key configurada"""
    has_key = API_KEY_FILE.exists() and get_api_key() is not None
    return {"has_key": has_key}

@app.post("/api/settings/apikey")
async def set_api_key(request: APIKeyRequest):
    """Guarda la API Key de Grok"""
    try:
        save_api_key(request.api_key)
        return {"message": "API Key guardada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/settings/validate-apikey")
async def validate_api_key(request: APIKeyRequest):
    """Valida la API Key de Grok"""
    try:
        # Usar modelo Grok optimizado
        models_to_try = ["grok-4-1-fast-reasoning"]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            for model in models_to_try:
                try:
                    response = await client.post(
                        "https://api.x.ai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {request.api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": model,
                            "messages": [{"role": "user", "content": "Hi"}],
                            "max_tokens": 5
                        }
                    )
                    
                    if response.status_code == 200:
                        print(f"✓ API Key válida con modelo: {model}")
                        return {"valid": True, "model": model}
                    elif response.status_code == 401:
                        print(f"✗ API Key inválida (401)")
                        return {"valid": False, "error": "API Key inválida"}
                    else:
                        print(f"Modelo {model} respondió con status: {response.status_code}")
                        # Continuar probando otros modelos
                        continue
                        
                except httpx.TimeoutException:
                    print(f"Timeout al probar modelo {model}")
                    continue
                except Exception as e:
                    print(f"Error con modelo {model}: {e}")
                    continue
            
            # Si ningún modelo funcionó
            return {"valid": False, "error": "No se pudo validar con ningún modelo"}
            
    except Exception as e:
        print(f"Error general validating API key: {e}")
        return {"valid": False, "error": str(e)}

@app.post("/api/ai/diagnosis")
async def generate_diagnosis(request: DiagnosisRequest):
    """Genera un diagnóstico médico usando Grok"""
    api_key = get_api_key()
    
    if not api_key:
        raise HTTPException(
            status_code=400, 
            detail="API Key no configurada. Por favor configure su API Key en ajustes."
        )
    
    # System prompt profesional para cirugía maxilofacial
    system_prompt = """Eres un asistente especializado en cirugía maxilofacial y medicina oral. Tu rol es analizar casos clínicos y proporcionar diagnósticos diferenciales precisos, análisis detallados y recomendaciones de tratamiento.

DIRECTRICES:
1. Analiza cuidadosamente toda la información clínica proporcionada
2. Considera diagnósticos diferenciales relevantes en cirugía maxilofacial
3. Justifica tu razonamiento con evidencia médica
4. Proporciona recomendaciones de tratamiento actualizadas
5. Sugiere estudios complementarios si son necesarios
6. Mantén un enfoque clínico profesional y preciso

FORMATO DE RESPUESTA:
Tu respuesta debe estar estructurada EXACTAMENTE en estas 4 secciones separadas por "###":

###DIAGNOSTICO_PROBABLE###
[Indica el diagnóstico más probable y explica por qué basándote en los hallazgos clínicos]

###ANALISIS###
[Proporciona un análisis detallado del caso, considerando:
- Hallazgos clínicos relevantes
- Diagnósticos diferenciales
- Razonamiento para llegar al diagnóstico principal
- Factores de riesgo o complicaciones potenciales]

###TRATAMIENTO###
[Describe el plan de tratamiento recomendado:
- Tratamiento de primera línea
- Alternativas terapéuticas
- Consideraciones quirúrgicas si aplica
- Manejo del dolor y cuidados postoperatorios]

###SUGERENCIAS###
[Proporciona sugerencias adicionales:
- Estudios complementarios recomendados
- Seguimiento clínico necesario
- Consideraciones especiales
- Referencias a literatura médica relevante si es apropiado]

IMPORTANTE: Usa EXACTAMENTE los separadores "###DIAGNOSTICO_PROBABLE###", "###ANALISIS###", "###TRATAMIENTO###" y "###SUGERENCIAS###" para dividir tu respuesta."""

    # Construir el prompt con los datos del paciente
    user_prompt = f"""Analiza el siguiente caso clínico:

DATOS DEL PACIENTE:
- Edad: {request.age} años
- Género: {request.gender}

HISTORIAL CLÍNICO:
{request.historialClinico or 'No especificado'}

ANTECEDENTES:
{request.antecedentes or 'No especificados'}

SÍNTOMAS ACTUALES:
{request.sintomas or 'No especificados'}

DIAGNÓSTICOS PREVIOS:
{request.diagnosticos or 'No especificados'}

ESTUDIOS DE IMAGEN:
{request.estudiosImagen or 'No se proporcionaron estudios de imagen'}

PRUEBAS COMPLEMENTARIAS:
{request.pruebasComplementarias or 'No se proporcionaron pruebas complementarias'}

NOTAS ADICIONALES:
{request.notas or 'Ninguna'}

Por favor, proporciona un análisis completo del caso siguiendo el formato especificado."""

    # Usar modelo Grok optimizado
    models_to_try = ["grok-4-1-fast-reasoning"]
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            last_error = None
            
            for model in models_to_try:
                try:
                    print(f"Intentando diagnóstico con modelo: {model}")
                    response = await client.post(
                        "https://api.x.ai/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": model,
                            "messages": [
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt}
                            ],
                            "temperature": 0.7,
                            "max_tokens": 4000
                        }
                    )
                    
                    if response.status_code == 200:
                        print(f"✓ Diagnóstico generado con modelo: {model}")
                        break
                    else:
                        last_error = f"Modelo {model}: status {response.status_code}"
                        print(last_error)
                        continue
                        
                except Exception as e:
                    last_error = f"Error con modelo {model}: {str(e)}"
                    print(last_error)
                    continue
            
            # Si ningún modelo funcionó
            if 'response' not in locals() or response.status_code != 200:
                raise HTTPException(
                    status_code=500,
                    detail=f"Error de Grok API. Último error: {last_error}"
                )
            
            result = response.json()
            ai_response = result["choices"][0]["message"]["content"]
            
            # Parsear la respuesta estructurada
            sections = {
                "diagnostico_probable": "",
                "analisis": "",
                "tratamiento": "",
                "sugerencias": ""
            }
            
            # Dividir por los separadores
            if "###DIAGNOSTICO_PROBABLE###" in ai_response:
                parts = ai_response.split("###")
                for i, part in enumerate(parts):
                    if "DIAGNOSTICO_PROBABLE" in part and i + 1 < len(parts):
                        sections["diagnostico_probable"] = parts[i + 1].strip()
                    elif "ANALISIS" in part and i + 1 < len(parts):
                        sections["analisis"] = parts[i + 1].strip()
                    elif "TRATAMIENTO" in part and i + 1 < len(parts):
                        sections["tratamiento"] = parts[i + 1].strip()
                    elif "SUGERENCIAS" in part and i + 1 < len(parts):
                        sections["sugerencias"] = parts[i + 1].strip()
            else:
                # Si no tiene el formato esperado, usar la respuesta completa
                sections["diagnostico_probable"] = ai_response
                sections["analisis"] = "Formato de respuesta no estructurado"
                sections["tratamiento"] = "Consulte el diagnóstico probable"
                sections["sugerencias"] = "Ninguna sugerencia adicional"
            
            return sections
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Timeout al conectar con Grok API")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar diagnóstico: {str(e)}")

# ============================================
# MAIN - INICIAR SERVIDOR
# ============================================

if __name__ == "__main__":
    print("=" * 60)
    print("🏥 Servidor de Registros Médicos")
    print("=" * 60)
    print(f"📁 Directorio de datos: {DATA_DIR}")
    print(f"📄 Archivo de pacientes: {PATIENTS_FILE}")
    print(f"🖼️  Directorio de imágenes: {IMAGES_DIR}")
    print(f"💾 Directorio de backups: {BACKUP_DIR}")
    print("=" * 60)
    print("🚀 Iniciando servidor en http://localhost:5847")
    print("=" * 60)
    
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=5847,
        log_level="info"
    )

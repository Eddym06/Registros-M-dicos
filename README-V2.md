# Sistema de Registros Médicos con IA
## Versión 2.0 - Con Diagnóstico Asistido por IA

Sistema completo de gestión de registros médicos con integración de inteligencia artificial para diagnóstico asistido.

---

## 🆕 NUEVAS FUNCIONALIDADES

### Modo Avanzado con IA
- **Switch Normal/Avanzado**: Alterna entre el modo convencional y el modo con asistencia de IA
- **Diagnóstico por IA**: Utiliza Grok 4.1 fast reasoning para análisis médico
- **Campos Adicionales**:
  - Estudios de Imagen (con soporte para texto e imágenes)
  - Pruebas Complementarias (con soporte para texto e imágenes)
  - Límite: 10 imágenes en total entre ambos campos

### Diagnóstico Estructurado
El sistema de IA proporciona:
1. **Diagnóstico Probable**: Con justificación clínica
2. **Análisis**: Razonamiento detallado y diagnósticos diferenciales
3. **Tratamiento**: Plan terapéutico recomendado
4. **Sugerencias**: Estudios complementarios y seguimiento

### Configuración de IA
- **Panel de Ajustes**: Configuración segura de API Key
- **Validación Automática**: Verifica la conexión con Grok
- **Almacenamiento Seguro**: La API Key se guarda localmente en el servidor

---

## 🚀 INSTALACIÓN

### Windows
```cmd
1. Ejecutar setup.bat
2. Ingresar ID de la extensión de Chrome cuando se solicite
3. El sistema instalará automáticamente todas las dependencias
```

### Mac / Linux
```bash
1. chmod +x setup.sh
2. ./setup.sh
3. Ingresar ID de la extensión de Chrome cuando se solicite
```

---

## 📋 REQUISITOS

### Software Base
- **Python 3.8+** (se instala automáticamente en Windows)
- **Node.js 16+** (se instala automáticamente en Windows con Homebrew en Mac)
- **Google Chrome** o Chromium

### API Externa
- **Grok API Key**: Obtener en [console.x.ai](https://console.x.ai/)
  - Necesaria solo para funcionalidades de IA
  - El modo normal funciona sin API Key

---

## 🎯 USO DEL SISTEMA

### Modo Normal (Convencional)
1. Abrir la extensión de Chrome
2. Clic en "Nuevo Registro"
3. Completar los campos básicos:
   - Nombre, edad, género
   - Historial clínico
   - Antecedentes
   - Síntomas
   - Diagnósticos
   - Tratamientos
   - Imágenes médicas

### Modo Avanzado (Con IA)
1. Activar el switch "Avanzado"
2. Completar campos adicionales:
   - Estudios de Imagen
   - Pruebas Complementarias
3. Clic en "Generar Diagnóstico por IA"
4. Esperar el análisis (15-30 segundos)
5. Revisar el diagnóstico estructurado

### Configurar API Key
1. Clic en botón "⚙️ Ajustes" (esquina superior derecha)
2. Ingresar API Key de Grok
3. El sistema valida automáticamente
4. Guardar configuración

---

## 🏥 ESPECIALIZACIÓN

El sistema está optimizado para **Cirugía Maxilofacial**, con:
- Terminología especializada
- Diagnósticos diferenciales específicos
- Consideraciones quirúrgicas
- Protocolos de tratamiento actualizados

---

## 🔐 SEGURIDAD

- ✅ **Almacenamiento Local**: Todos los datos en `Downloads/MedicalRecords/`
- ✅ **API Key Protegida**: Permisos 600 (solo propietario)
- ✅ **Sin Envío de Datos Personales**: El nombre del paciente NO se envía a la IA
- ✅ **Backups Automáticos**: Respaldo de datos en cada modificación

---

## 📁 ESTRUCTURA DE DATOS

```
Downloads/
└── MedicalRecords/
    ├── patients.json          # Base de datos principal
    ├── api_key.txt           # API Key cifrada
    ├── images/               # Imágenes médicas
    └── backup/               # Respaldos automáticos
```

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### La IA no responde
1. Verificar API Key en Ajustes
2. Revisar conexión a internet
3. Consultar logs del servidor

### Error al iniciar servidor
```bash
# Windows
.\limpiar-instalacion.bat
.\setup.bat

# Mac/Linux
./limpiar-instalacion.sh
./setup.sh
```

### Native Messaging no funciona
```bash
# Windows
configurar-native-messaging.bat

# Mac/Linux  
./reconfigurar-native-messaging-mac.sh
```

---

## 📝 NOTAS IMPORTANTES

1. **Criterio Médico**: La IA es una herramienta de apoyo, no reemplaza el juicio clínico profesional
2. **Validación**: Siempre valide los diagnósticos sugeridos con su experiencia
3. **Privacidad**: Los datos permanecen en su equipo local
4. **Actualizaciones**: Grok se actualiza continuamente, mejorando las sugerencias

---

## 🔄 MIGRACIÓN DESDE VERSIÓN ANTERIOR

Los registros existentes son compatibles. El sistema agrega automáticamente los nuevos campos a registros antiguos.

---

## 📞 SOPORTE

- **Documentación**: Ver archivos INSTALACION.md, DESBLOQUEAR-WINDOWS.md
- **Mac**: Ver INSTRUCCIONES-MAC.md
- **Logs**: `extension/native-host.log`, servidor muestra errores en consola

---

## 📊 ENDPOINTS DE API

### Nuevos Endpoints para IA

#### Configuración de API Key
```http
GET  /api/settings/apikey           # Verifica si existe API Key
POST /api/settings/apikey           # Guarda API Key
POST /api/settings/validate-apikey  # Valida API Key con Grok
```

#### Diagnóstico por IA
```http
POST /api/ai/diagnosis              # Genera diagnóstico con Grok
```

**Ejemplo de Request:**
```json
{
  "age": "45",
  "gender": "Masculino",
  "historialClinico": "...",
  "antecedentes": "...",
  "sintomas": "...",
  "diagnosticos": "...",
  "notas": "...",
  "estudiosImagen": "...",
  "pruebasComplementarias": "..."
}
```

**Ejemplo de Response:**
```json
{
  "diagnostico_probable": "...",
  "analisis": "...",
  "tratamiento": "...",
  "sugerencias": "..."
}
```

---

## 🎨 TECNOLOGÍAS

### Frontend
- **React 18.2** con TypeScript
- **Tailwind CSS** para estilos
- **Lucide React** para iconos
- **Vite** como bundler

### Backend
- **FastAPI** (Python)
- **Uvicorn** ASGI server
- **httpx** para llamadas a Grok API

### IA
- **Grok Beta** (xAI)
- System prompt especializado en cirugía maxilofacial
- Temperatura: 0.7
- Max tokens: 4000

---

## 📄 LICENCIA

Sistema de uso profesional para médicos especialistas.

---

**Versión 2.0** - Diciembre 2025

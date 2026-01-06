#!/bin/bash
# ============================================================================
# Instalador y Gestor de Registros Médicos - Mac/Linux
# ============================================================================

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "========================================================================"
echo "  REGISTROS MÉDICOS - Instalador y Gestor"
echo "  Sistema de gestión de registros médicos con Chrome Extension"
echo "========================================================================"
echo ""

# Obtener directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# ============================================================================
# 1. VERIFICAR E INSTALAR PYTHON
# ============================================================================
echo -e "${BLUE}[1/5] Verificando Python...${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}[!] Python3 no está instalado${NC}"
    echo -e "${BLUE}[*] Instalando Python3...${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if ! command -v brew &> /dev/null; then
            echo -e "${YELLOW}[!] Homebrew no está instalado${NC}"
            echo -e "${BLUE}[*] Instalando Homebrew...${NC}"
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        brew install python3
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y python3 python3-pip
        elif command -v yum &> /dev/null; then
            sudo yum install -y python3 python3-pip
        elif command -v dnf &> /dev/null; then
            sudo dnf install -y python3 python3-pip
        else
            echo -e "${RED}[!] No se pudo detectar el gestor de paquetes${NC}"
            echo -e "${RED}[!] Por favor instale Python3 manualmente${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}[+] Python3 instalado correctamente${NC}"
else
    PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
    echo -e "${GREEN}[+] Python $PYTHON_VERSION detectado${NC}"
fi

# ============================================================================
# 2. INSTALAR DEPENDENCIAS DE PYTHON
# ============================================================================
echo ""
echo -e "${BLUE}[2/5] Instalando dependencias de Python...${NC}"

python3 -m pip install --upgrade pip --quiet
python3 -m pip install -q fastapi uvicorn python-multipart pydantic Pillow

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[+] Dependencias instaladas correctamente${NC}"
else
    echo -e "${RED}[!] Error al instalar dependencias${NC}"
    exit 1
fi

# ============================================================================
# 3. VERIFICAR NODE.JS Y NPM
# ============================================================================
echo ""
echo -e "${BLUE}[3/5] Verificando Node.js...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}[!] Node.js no está instalado${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo -e "${BLUE}[*] Instalando Node.js con Homebrew...${NC}"
        brew install node
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo -e "${BLUE}[*] Instalando Node.js...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    echo -e "${GREEN}[+] Node.js instalado${NC}"
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}[+] Node.js $NODE_VERSION detectado${NC}"
fi

# Instalar dependencias de Node (siempre)
if [ -f "package.json" ]; then
    echo -e "${BLUE}[*] Instalando dependencias de Node.js...${NC}"
    npm install --quiet
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[+] Dependencias de Node.js instaladas${NC}"
    else
        echo -e "${RED}[!] Error al instalar dependencias de Node.js${NC}"
        echo -e "${YELLOW}[*] Intente ejecutar manualmente: npm install${NC}"
    fi
fi

# ============================================================================
# 4. CONSTRUIR LA APLICACIÓN
# ============================================================================
echo ""
echo -e "${BLUE}[4/5] Construyendo aplicación React...${NC}"

if [ -f "package.json" ]; then
    npm run build
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}[+] Aplicación construida correctamente${NC}"
        
        # Construir extensión
        if [ -f "extension/build-extension.js" ]; then
            node extension/build-extension.js
            if [ $? -eq 0 ]; then
                echo -e "${GREEN}[+] Extensión de Chrome construida${NC}"
            else
                echo -e "${RED}[!] Error al construir la extensión${NC}"
            fi
        fi
    else
        echo -e "${RED}[!] Error al construir la aplicación${NC}"
        echo -e "${YELLOW}[*] Intente ejecutar manualmente: npm run build${NC}"
    fi
fi

# ============================================================================
# 5. CONFIGURAR NATIVE MESSAGING HOST (CHROME)
# ============================================================================
echo ""
echo -e "${BLUE}[5/5] Configurando Native Messaging Host...${NC}"

# Determinar directorio según sistema operativo
if [[ "$OSTYPE" == "darwin"* ]]; then
    MANIFEST_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    MANIFEST_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
fi

mkdir -p "$MANIFEST_DIR"

# Ruta al script Python
NATIVE_HOST_SCRIPT="$SCRIPT_DIR/extension/native-host.py"

# Hacer ejecutable el native host
chmod +x "$NATIVE_HOST_SCRIPT"

# Verificar si ya está registrado
if [ -f "$MANIFEST_DIR/com.medicalrecords.host.json" ]; then
    echo -e "${YELLOW}[*] Native Messaging Host ya está registrado${NC}"
    echo -e "${YELLOW}[*] Si necesita reconfigurarlo, ingrese el nuevo ID${NC}"
    echo ""
else
    echo -e "${BLUE}[*] Para habilitar el inicio automático del servidor desde la extensión:${NC}"
    echo ""
fi

echo "    1. Abra Chrome y vaya a: chrome://extensions/"
echo "    2. Active 'Modo de desarrollador' (esquina superior derecha)"
echo "    3. Clic en 'Cargar extensión sin empaquetar'"
echo "    4. Seleccione la carpeta: $SCRIPT_DIR/extension"
echo "    5. Copie el ID de la extensión (ej: jekjgpmiogcjojlmhdhnafanlfodlhkm)"
echo ""
read -p "    Ingrese el ID de la extensión (o Enter para omitir): " EXTENSION_ID

if [ ! -z "$EXTENSION_ID" ]; then
    # Crear manifest JSON
    MANIFEST_FILE="$MANIFEST_DIR/com.medicalrecords.host.json"
    
    cat > "$MANIFEST_FILE" <<EOF
{
  "name": "com.medicalrecords.host",
  "description": "Native Messaging Host for Medical Records Server",
  "path": "$NATIVE_HOST_SCRIPT",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://$EXTENSION_ID/"
  ]
}
EOF
    
    echo ""
    # Verificar que se creó el archivo
    if [ -f "$MANIFEST_FILE" ]; then
        echo -e "${GREEN}[+] Native Messaging Host registrado correctamente${NC}"
        echo -e "${GREEN}[+] Manifest creado en: $MANIFEST_FILE${NC}"
        echo -e "${GREEN}[+] Native Host script: $NATIVE_HOST_SCRIPT${NC}"
        
        # Verificar permisos
        if [ -x "$NATIVE_HOST_SCRIPT" ]; then
            echo -e "${GREEN}[+] Script ejecutable correctamente${NC}"
        else
            echo -e "${RED}[!] ADVERTENCIA: Script no es ejecutable${NC}"
        fi
    else
        echo -e "${RED}[!] ERROR: No se pudo crear el manifest${NC}"
        echo -e "${YELLOW}[*] Intente crear el directorio manualmente: mkdir -p '$MANIFEST_DIR'${NC}"
    fi
else
    echo ""
    echo -e "${YELLOW}[!] Configuración de Native Messaging omitida${NC}"
    echo -e "${YELLOW}[*] Puede configurarlo después desde el menú principal (opción 8)${NC}"
fi

# ============================================================================
# MENÚ PRINCIPAL
# ============================================================================
show_menu() {
    echo ""
    echo "========================================================================"
    echo "  INSTALACIÓN COMPLETADA"
    echo "========================================================================"
    echo ""
    echo "[1] Iniciar servidor FastAPI"
    echo "[2] Iniciar servidor de desarrollo (React)"
    echo "[3] Iniciar ambos servidores"
    echo "[4] Crear iconos de la extensión"
    echo "[5] Abrir carpeta de datos (Downloads/MedicalRecords)"
    echo "[6] Ver logs del Native Host"
    echo "[7] Configurar Native Messaging Host"
    echo "[8] Salir"
    echo ""
}

while true; do
    show_menu
    read -p "Seleccione una opción (1-8): " OPTION
    
    case $OPTION in
        1)
            echo ""
            echo -e "${BLUE}[*] Iniciando servidor FastAPI en http://localhost:5847${NC}"
            echo ""
            python3 -m uvicorn server.main:app --host 127.0.0.1 --port 5847 --reload
            ;;
        2)
            echo ""
            echo -e "${BLUE}[*] Iniciando servidor de desarrollo en http://localhost:5173${NC}"
            echo ""
            npm run dev
            ;;
        3)
            echo ""
            echo -e "${BLUE}[*] Iniciando ambos servidores...${NC}"
            python3 -m uvicorn server.main:app --host 127.0.0.1 --port 5847 --reload &
            FASTAPI_PID=$!
            sleep 2
            npm run dev &
            DEV_PID=$!
            
            echo -e "${GREEN}[+] Servidores iniciados${NC}"
            echo "FastAPI PID: $FASTAPI_PID"
            echo "Dev Server PID: $DEV_PID"
            echo ""
            echo "Presione Ctrl+C para detener ambos servidores"
            
            trap "kill $FASTAPI_PID $DEV_PID 2>/dev/null" EXIT
            wait
            ;;
        4)
            echo ""
            read -p "Ingrese la ruta completa de la imagen para los iconos: " ICON_PATH
            if [ -f "$ICON_PATH" ]; then
                echo -e "${BLUE}[*] Creando iconos...${NC}"
                python3 << EOF
from pathlib import Path
from PIL import Image

img = Image.open(r'$ICON_PATH')
for size in [16, 48, 128]:
    img.resize((size, size), Image.Resampling.LANCZOS).save(f'extension/icons/icon{size}.png')
print('${GREEN}[+] Iconos creados correctamente${NC}')
EOF
            else
                echo -e "${RED}[!] Archivo no encontrado${NC}"
            fi
            read -p "Presione Enter para continuar..."
            ;;
        5)
            echo ""
            DATA_DIR="$HOME/Downloads/MedicalRecords"
            if [ -d "$DATA_DIR" ]; then
                if [[ "$OSTYPE" == "darwin"* ]]; then
                    open "$DATA_DIR"
                else
                    xdg-open "$DATA_DIR" 2>/dev/null || nautilus "$DATA_DIR" 2>/dev/null || echo "Carpeta: $DATA_DIR"
                fi
                echo -e "${GREEN}[+] Carpeta abierta${NC}"
            else
                echo -e "${YELLOW}[!] La carpeta aún no existe. Se creará al usar la aplicación por primera vez.${NC}"
            fi
            read -p "Presione Enter para continuar..."
            ;;
        6)
            echo ""
            LOG_FILE="$SCRIPT_DIR/extension/native-host.log"
            if [ -f "$LOG_FILE" ]; then
                cat "$LOG_FILE"
            else
                echo -e "${YELLOW}[!] No hay logs disponibles${NC}"
            fi
            read -p "Presione Enter para continuar..."
            ;;
        7)
            echo ""
            echo -e "${BLUE}[*] Configurando Native Messaging Host...${NC}"
            echo ""
            
            # Determinar directorio según sistema operativo
            if [[ "$OSTYPE" == "darwin"* ]]; then
                MANIFEST_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
            elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
                MANIFEST_DIR="$HOME/.config/google-chrome/NativeMessagingHosts"
            fi
            
            mkdir -p "$MANIFEST_DIR"
            
            echo "Para configurar el Native Messaging Host necesita:"
            echo ""
            echo "1. Abrir Chrome: chrome://extensions/"
            echo "2. Activar 'Modo de desarrollador'"
            echo "3. Cargar extensión desde: $SCRIPT_DIR/extension"
            echo "4. Copiar el ID de la extensión"
            echo ""
            read -p "Ingrese el ID de la extensión: " NEW_EXTENSION_ID
            
            if [ ! -z "$NEW_EXTENSION_ID" ]; then
                NATIVE_HOST_SCRIPT="$SCRIPT_DIR/extension/native-host.py"
                chmod +x "$NATIVE_HOST_SCRIPT"
                MANIFEST_FILE="$MANIFEST_DIR/com.medicalrecords.host.json"
                
                cat > "$MANIFEST_FILE" <<EOF
{
  "name": "com.medicalrecords.host",
  "description": "Native Messaging Host for Medical Records Server",
  "path": "$NATIVE_HOST_SCRIPT",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://$NEW_EXTENSION_ID/"
  ]
}
EOF
                
                echo ""
                echo -e "${GREEN}[+] Native Messaging Host configurado correctamente${NC}"
                echo -e "${GREEN}[+] Manifest creado en: $MANIFEST_FILE${NC}"
            else
                echo -e "${RED}[!] ID no proporcionado. Configuración cancelada.${NC}"
            fi
            
            read -p "Presione Enter para continuar..."
            ;;
        8)
            echo ""
            echo "========================================================================"
            echo "  Gracias por usar Registros Médicos"
            echo "========================================================================"
            echo ""
            echo "Documentación: README.md"
            echo "Soporte: https://github.com/tu-repositorio"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}[!] Opción inválida${NC}"
            read -p "Presione Enter para continuar..."
            ;;
    esac
done

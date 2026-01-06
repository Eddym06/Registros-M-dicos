#!/bin/bash

# Script para reconfigurar Native Messaging Host en Mac
# Úsalo cada vez que muevas la carpeta del proyecto

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "========================================================================"
echo "  RECONFIGURAR NATIVE MESSAGING HOST"
echo "========================================================================"
echo ""

# Obtener directorio actual del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Directorio de manifest en Mac
MANIFEST_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
MANIFEST_FILE="$MANIFEST_DIR/com.medicalrecords.host.json"

# Path al script nativo
NATIVE_HOST_SCRIPT="$SCRIPT_DIR/extension/native-host.py"

echo -e "${BLUE}[1/4] Verificando archivos...${NC}"
if [ ! -f "$NATIVE_HOST_SCRIPT" ]; then
    echo -e "${RED}[!] ERROR: No se encuentra native-host.py${NC}"
    echo -e "${YELLOW}    Esperado en: $NATIVE_HOST_SCRIPT${NC}"
    exit 1
fi
echo -e "${GREEN}[+] native-host.py encontrado${NC}"

echo ""
echo -e "${BLUE}[2/4] Verificando manifest existente...${NC}"
if [ -f "$MANIFEST_FILE" ]; then
    echo -e "${YELLOW}[*] Manifest existente encontrado${NC}"
    echo ""
    echo "Contenido actual:"
    cat "$MANIFEST_FILE"
    echo ""
else
    echo -e "${YELLOW}[*] No existe manifest previo${NC}"
fi

echo ""
echo -e "${BLUE}[3/4] Obteniendo ID de la extensión...${NC}"
echo ""
echo "Para configurar el Native Messaging Host necesitas el ID de la extensión:"
echo ""
echo "1. Abre Chrome y ve a: chrome://extensions/"
echo "2. Asegúrate de tener 'Modo de desarrollador' activado"
echo "3. Busca 'Registros Médicos' en la lista"
echo "4. Copia el ID (formato: xxxxxxxxxxxxxxxxxxxxxxxxxxxx)"
echo ""
read -p "Ingresa el ID de la extensión: " EXTENSION_ID

if [ -z "$EXTENSION_ID" ]; then
    echo -e "${RED}[!] ID vacío. Cancelando.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}[4/4] Creando nuevo manifest...${NC}"

# Hacer ejecutable el native host
chmod +x "$NATIVE_HOST_SCRIPT"
echo -e "${GREEN}[+] Permisos de ejecución configurados${NC}"

# Crear directorio si no existe
mkdir -p "$MANIFEST_DIR"

# Crear manifest JSON
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

if [ -f "$MANIFEST_FILE" ]; then
    echo -e "${GREEN}[+] Manifest creado correctamente${NC}"
    echo ""
    echo "Nuevo contenido:"
    cat "$MANIFEST_FILE"
    echo ""
    echo -e "${GREEN}========================================================================"
    echo "  CONFIGURACIÓN COMPLETADA"
    echo "========================================================================${NC}"
    echo ""
    echo "IMPORTANTE:"
    echo "1. Cierra Chrome COMPLETAMENTE (Cmd+Q, no solo cerrar ventanas)"
    echo "2. Vuelve a abrir Chrome"
    echo "3. Prueba la extensión"
    echo ""
    echo "Path configurado: $NATIVE_HOST_SCRIPT"
    echo "Manifest ubicado en: $MANIFEST_FILE"
    echo ""
else
    echo -e "${RED}[!] ERROR: No se pudo crear el manifest${NC}"
    exit 1
fi

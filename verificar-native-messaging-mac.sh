#!/bin/bash

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================================================"
echo "  VERIFICACIÓN DE NATIVE MESSAGING HOST (Mac)"
echo "========================================================================"
echo ""

# Obtener directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Directorio de manifest en Mac
MANIFEST_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
MANIFEST_FILE="$MANIFEST_DIR/com.medicalrecords.host.json"

echo -e "${BLUE}[1] Verificando directorio de manifests...${NC}"
if [ -d "$MANIFEST_DIR" ]; then
    echo -e "${GREEN}[+] Directorio existe: $MANIFEST_DIR${NC}"
    ls -la "$MANIFEST_DIR" | grep "medicalrecords" || echo -e "${YELLOW}[!] No hay archivos de medicalrecords${NC}"
else
    echo -e "${RED}[!] Directorio NO existe: $MANIFEST_DIR${NC}"
fi

echo ""
echo -e "${BLUE}[2] Verificando archivo manifest...${NC}"
if [ -f "$MANIFEST_FILE" ]; then
    echo -e "${GREEN}[+] Manifest existe${NC}"
    echo -e "${BLUE}Contenido:${NC}"
    cat "$MANIFEST_FILE"
else
    echo -e "${RED}[!] Manifest NO existe: $MANIFEST_FILE${NC}"
fi

echo ""
echo -e "${BLUE}[3] Verificando script native-host.py...${NC}"
NATIVE_HOST="$SCRIPT_DIR/extension/native-host.py"
if [ -f "$NATIVE_HOST" ]; then
    echo -e "${GREEN}[+] Script existe: $NATIVE_HOST${NC}"
    
    # Verificar permisos
    if [ -x "$NATIVE_HOST" ]; then
        echo -e "${GREEN}[+] Script es ejecutable${NC}"
    else
        echo -e "${RED}[!] Script NO es ejecutable${NC}"
        echo -e "${YELLOW}[*] Ejecute: chmod +x $NATIVE_HOST${NC}"
    fi
    
    # Verificar shebang
    FIRST_LINE=$(head -n 1 "$NATIVE_HOST")
    if [[ "$FIRST_LINE" == "#!/usr/bin/env python3" ]]; then
        echo -e "${GREEN}[+] Shebang correcto: $FIRST_LINE${NC}"
    else
        echo -e "${YELLOW}[!] Shebang: $FIRST_LINE${NC}"
    fi
else
    echo -e "${RED}[!] Script NO existe: $NATIVE_HOST${NC}"
fi

echo ""
echo -e "${BLUE}[4] Verificando Python3...${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}[+] $PYTHON_VERSION encontrado${NC}"
    PYTHON_PATH=$(which python3)
    echo -e "${GREEN}[+] Path: $PYTHON_PATH${NC}"
else
    echo -e "${RED}[!] Python3 NO encontrado${NC}"
fi

echo ""
echo -e "${BLUE}[5] Verificando Chrome/Chromium...${NC}"
if [ -d "/Applications/Google Chrome.app" ]; then
    echo -e "${GREEN}[+] Google Chrome instalado${NC}"
elif [ -d "/Applications/Chromium.app" ]; then
    echo -e "${GREEN}[+] Chromium instalado${NC}"
    MANIFEST_DIR_CHROMIUM="$HOME/.config/chromium/NativeMessagingHosts"
    echo -e "${YELLOW}[!] Para Chromium, el manifest debe estar en: $MANIFEST_DIR_CHROMIUM${NC}"
else
    echo -e "${YELLOW}[!] Chrome/Chromium no encontrado en /Applications${NC}"
fi

echo ""
echo "========================================================================"
echo "  RESUMEN"
echo "========================================================================"
echo ""

ERRORS=0

if [ ! -d "$MANIFEST_DIR" ]; then
    echo -e "${RED}✗ Directorio de manifests no existe${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ ! -f "$MANIFEST_FILE" ]; then
    echo -e "${RED}✗ Archivo manifest no existe${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ ! -f "$NATIVE_HOST" ]; then
    echo -e "${RED}✗ Script native-host.py no existe${NC}"
    ERRORS=$((ERRORS + 1))
elif [ ! -x "$NATIVE_HOST" ]; then
    echo -e "${RED}✗ Script no es ejecutable${NC}"
    ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Todo parece estar configurado correctamente${NC}"
    echo ""
    echo "Si aún no funciona, verifique:"
    echo "1. El ID de la extensión en el manifest coincide con el de Chrome"
    echo "2. Reinicie Chrome completamente después de configurar"
    echo "3. Revise los logs: extension/native-host.log"
else
    echo -e "${RED}✗ Se encontraron $ERRORS problemas${NC}"
    echo ""
    echo "Ejecute el setup.sh nuevamente o configure manualmente con la opción 7 del menú"
fi

echo ""

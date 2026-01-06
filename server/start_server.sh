#!/bin/bash
# Script para iniciar el servidor en Mac/Linux

echo "========================================"
echo "Servidor de Registros Médicos"
echo "========================================"

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python no está instalado"
    echo "Por favor instale Python 3.8 o superior"
    exit 1
fi

# Ir al directorio del script
cd "$(dirname "$0")"

# Verificar si las dependencias están instaladas
python3 -c "import fastapi" &> /dev/null
if [ $? -ne 0 ]; then
    echo "Instalando dependencias..."
    python3 -m pip install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "ERROR: No se pudieron instalar las dependencias"
        exit 1
    fi
fi

# Iniciar el servidor
echo ""
echo "Iniciando servidor..."
echo "El servidor estará disponible en http://localhost:5847"
echo "Presione Ctrl+C para detener el servidor"
echo ""
python3 main.py

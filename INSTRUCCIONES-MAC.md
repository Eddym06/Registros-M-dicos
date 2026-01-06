# INSTRUCCIONES PARA MAC/LINUX

## ¿Por qué setup.sh "no hace nada"?

En Mac/Linux, los scripts .sh necesitan permisos de ejecución y se ejecutan diferente a los .bat de Windows.

---

## CÓMO EJECUTAR EN MAC/LINUX

### 1. Abrir Terminal
- **Mac**: Buscar "Terminal" en Spotlight (Cmd+Espacio → escribir "Terminal")
- **Linux**: Ctrl+Alt+T o buscar "Terminal"

### 2. Ir a la carpeta del proyecto
```bash
cd /ruta/donde/extrajiste/Registros-Medicos-Distribucion-2
```

**Ejemplo**:
```bash
cd ~/Downloads/Registros-Medicos-Distribucion-2
```

### 3. Dar permisos de ejecución al script
```bash
chmod +x setup.sh
```

Este comando hace que el archivo sea ejecutable (como doble clic en Windows).

### 4. Ejecutar el instalador
```bash
./setup.sh
```

**NOTA**: El `./` es importante, significa "ejecutar este archivo en la carpeta actual".

---

## GUÍA PASO A PASO COMPLETA

```bash
# 1. Abrir Terminal
# (Cmd+Espacio → Terminal)

# 2. Ir a la carpeta
cd ~/Downloads/Registros-Medicos-Distribucion-2

# 3. Dar permisos
chmod +x setup.sh

# 4. Ejecutar
./setup.sh

# 5. Seguir las instrucciones en pantalla
```

---

## SOLUCIÓN DE PROBLEMAS

### Error: "Permission denied"
**Solución**: Ejecutar con `sudo`
```bash
sudo ./setup.sh
```
Te pedirá tu contraseña de Mac.

### Error: "command not found"
**Causa**: Olvidaste el `./` antes de setup.sh

**Solución**: Usar `./setup.sh` (no solo `setup.sh`)

### El script se ejecuta pero hay errores
**Posibles causas**:
1. **Python no instalado**: El script lo instalará con Homebrew
2. **Homebrew no instalado**: El script lo instalará automáticamente
3. **Node.js no instalado**: El script te indicará cómo instalarlo

---

## DIFERENCIAS CON WINDOWS

| Windows | Mac/Linux |
|---------|-----------|
| Doble clic en `.bat` | `chmod +x` luego `./` |
| `setup.bat` | `./setup.sh` |
| Automático | Necesita Terminal |

---

## COMANDOS ÚTILES

### Ver contenido del script
```bash
cat setup.sh
```

### Ver si tiene permisos de ejecución
```bash
ls -l setup.sh
```

Si tiene permisos, verás: `-rwxr-xr-x` (la 'x' significa ejecutable)

### Hacer ejecutables TODOS los scripts .sh
```bash
chmod +x *.sh
```

---

## DESPUÉS DE INSTALAR

El instalador mostrará un menú con opciones:

1. Iniciar servidor FastAPI
2. Iniciar servidor de desarrollo
3. Etc.

Simplemente escribe el número y presiona Enter.

Para salir del menú: Opción 7 o Ctrl+C

---

## RESUMEN RÁPIDO

```bash
# Mac/Linux NO es como Windows .bat
# Necesitas ejecutar en Terminal:

cd ~/Downloads/Registros-Medicos-Distribucion-2
chmod +x setup.sh
./setup.sh
```

¡Eso es todo! 🚀

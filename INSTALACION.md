# 🏥 GUÍA DE INSTALACIÓN RÁPIDA

## Para Windows

1. **Extraer el archivo ZIP** en cualquier carpeta (ejemplo: Documentos)

2. **Doble clic en `setup.bat`**
   - Se abrirá una ventana de comandos
   - Si Python no está instalado, se descargará automáticamente
   - Espere a que termine la instalación (puede tomar 2-5 minutos)

3. **Cargar la extensión en Chrome**
   - Abrir Chrome
   - Escribir en la barra: `chrome://extensions/`
   - Activar el switch **"Modo de desarrollador"** (arriba a la derecha)
   - Clic en **"Cargar extensión sin empaquetar"**
   - Seleccionar la carpeta **`extension`** dentro del proyecto
   - **IMPORTANTE**: Copiar el ID de la extensión (ejemplo: `jekjgpmiogcjojlmhdhnafanlfodlhkm`)

4. **Configurar inicio automático** (opcional pero recomendado)
   - Ejecutar nuevamente `setup.bat`
   - Cuando pregunte por el ID de la extensión, pegarlo
   - Presionar Enter

5. **¡Listo! Usar la aplicación**
   - Clic en el ícono de la extensión en Chrome
   - Clic en "🚀 Iniciar Servidor" (primera vez)
   - Clic en "Abrir Registro Médico"

---

## Para Mac

1. **Extraer el archivo ZIP**

2. **Abrir Terminal** (Buscar "Terminal" en Spotlight)

3. **Ir a la carpeta extraída**
   ```bash
   cd /ruta/donde/extrajiste/Registros-Médicos
   ```

4. **Dar permisos y ejecutar instalador**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

5. **Seguir pasos 3-5 de Windows** (son iguales en Mac)

---

## 📁 ¿Dónde se guardan los datos?

Los registros médicos se guardan automáticamente en:

- **Windows**: `C:\Users\[TuUsuario]\Downloads\MedicalRecords\`
- **Mac**: `/Users/[TuUsuario]/Downloads/MedicalRecords/`

### Carpetas creadas:
- `patients.json` - Base de datos de pacientes
- `images/` - Imágenes médicas
- `backup/` - Copias de seguridad automáticas

---

## ❓ Problemas Comunes

### "El servidor no inicia"
**Solución**: Ejecutar manualmente:
- Abrir `setup.bat` (Windows) o `./setup.sh` (Mac)
- Seleccionar opción **1** (Iniciar servidor FastAPI)

### "No tengo Python/Node.js"
**No te preocupes**: El instalador `setup.bat` instala Python automáticamente en Windows.
En Mac, te indicará cómo instalar lo que falta.

### "La extensión no aparece"
- Verificar que está en "Modo de desarrollador" en `chrome://extensions/`
- Asegurarse de seleccionar la carpeta `extension` (no la raíz)

---

## 🎯 Uso Diario

### Opción 1 (Recomendada):
1. Clic en el ícono de la extensión
2. Si está apagado, clic en "Iniciar Servidor"
3. Clic en "Abrir Registro Médico"

### Opción 2:
1. Ejecutar `setup.bat` / `./setup.sh`
2. Seleccionar opción 1
3. Abrir Chrome y usar la extensión

---

## 🔒 Privacidad

✅ **Todos los datos son 100% locales**
- No hay conexión a internet
- No se envía nada a servidores externos
- Los datos están solo en tu computadora

---

## 📞 Soporte

Si tienes problemas:
1. Revisa este archivo
2. Lee el archivo `README.md` (más detallado)
3. Verifica los logs en `extension/native-host.log`

---

**Versión**: 1.0
**Fecha**: Diciembre 2025

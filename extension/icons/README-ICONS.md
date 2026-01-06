# 📝 Notas para Crear Iconos

Los iconos de la extensión deben crearse en los siguientes tamaños:
- icon16.png (16x16 píxeles)
- icon48.png (48x48 píxeles)  
- icon128.png (128x128 píxeles)

## 🎨 Sugerencias de Diseño

### Concepto: Cruz médica con un símbolo de historia clínica

**Colores sugeridos:**
- Azul principal: #3b82f6 (blue-500)
- Blanco para cruz/símbolos: #ffffff
- Fondo: Transparente o azul

**Elementos:**
- Cruz médica
- Icono de documento/clipboard
- Formas redondeadas (más amigable)

## 🛠️ Herramientas para Crear Iconos

### Online (Gratis):
1. **Canva** (canva.com)
   - Plantilla: 128x128 px
   - Exportar como PNG
   - Redimensionar para otros tamaños

2. **Figma** (figma.com)
   - Muy profesional
   - Exportar a múltiples tamaños

3. **Photopea** (photopea.com)
   - Clon de Photoshop gratuito
   - Funciona en navegador

### Software:
- Adobe Illustrator
- Affinity Designer
- GIMP (gratis)
- Inkscape (gratis)

## 📦 Proceso Rápido

1. Crear diseño en 128x128
2. Exportar como PNG
3. Redimensionar a 48x48 y 16x16
4. Guardar en `extension/icons/`:
   - icon16.png
   - icon48.png
   - icon128.png

## ⚡ Alternativa Rápida (SVG a PNG)

Si tienes un SVG:

### Usando ImageMagick:
```bash
# Instalar ImageMagick
# Windows: choco install imagemagick
# Mac: brew install imagemagick

# Convertir
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### Usando Node.js (sharp):
```bash
npm install sharp
node convert-icons.js
```

## 🎯 Mientras Tanto

La extensión funcionará sin iconos, pero Chrome mostrará un icono por defecto.
Para pruebas, puedes usar el archivo `icon.svg` incluido como referencia.

## 📋 Checklist

- [ ] Crear icon128.png (principal)
- [ ] Crear icon48.png (menú)
- [ ] Crear icon16.png (barra de herramientas)
- [ ] Verificar fondo transparente
- [ ] Probar en Chrome (luz/oscuro)
- [ ] Copiar a `extension/icons/`

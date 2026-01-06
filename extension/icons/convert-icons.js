// Script opcional para convertir SVG a PNG usando Node.js
// Requiere: npm install sharp

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];
const svgPath = path.join(__dirname, 'icon.svg');

if (!fs.existsSync(svgPath)) {
  console.error('❌ icon.svg no encontrado');
  process.exit(1);
}

sizes.forEach(size => {
  sharp(svgPath)
    .resize(size, size)
    .png()
    .toFile(path.join(__dirname, `icon${size}.png`))
    .then(() => {
      console.log(`✅ icon${size}.png creado`);
    })
    .catch(err => {
      console.error(`❌ Error creando icon${size}.png:`, err);
    });
});

console.log('\n📦 Generando iconos...\n');

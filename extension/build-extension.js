// Build configuration for Chrome Extension
// This script builds the React app and packages it for the extension

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔨 Building Chrome Extension...\n');

// Step 1: Build the React app
console.log('📦 Building React app with Vite...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ React app built successfully\n');
} catch (error) {
  console.error('❌ Error building React app:', error);
  process.exit(1);
}

// Step 2: Copy dist files to extension folder
console.log('📂 Copying files to extension folder...');
const distPath = path.join(__dirname, '..', 'dist');
const extensionPath = path.join(__dirname, '..', 'extension');

// Ensure extension folder exists
if (!fs.existsSync(extensionPath)) {
  fs.mkdirSync(extensionPath, { recursive: true });
}

// Copy all files from dist to extension (except the ones already in extension)
function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    fs.readdirSync(src).forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  // Copy assets
  if (fs.existsSync(path.join(distPath, 'assets'))) {
    copyRecursive(path.join(distPath, 'assets'), path.join(extensionPath, 'assets'));
  }
  
  // Copy index.html (app principal)
  fs.copyFileSync(
    path.join(distPath, 'index.html'),
    path.join(extensionPath, 'index.html')
  );
  
  // Asegurar que popup.html y popup.js estén en extension/
  const popupHtml = path.join(extensionPath, 'popup.html');
  const popupJs = path.join(extensionPath, 'popup.js');
  
  if (!fs.existsSync(popupHtml)) {
    console.log('⚠️  Warning: popup.html not found in extension folder');
  }
  if (!fs.existsSync(popupJs)) {
    console.log('⚠️  Warning: popup.js not found in extension folder');
  }
  
  console.log('✅ Files copied successfully\n');
} catch (error) {
  console.error('❌ Error copying files:', error);
  process.exit(1);
}

// Step 3: Create placeholder icons if they don't exist
console.log('🎨 Checking icons...');
const iconsPath = path.join(extensionPath, 'icons');
if (!fs.existsSync(iconsPath)) {
  fs.mkdirSync(iconsPath, { recursive: true });
  console.log('⚠️  Icon folder created. Please add icon files (icon16.png, icon48.png, icon128.png)');
} else {
  console.log('✅ Icons folder exists\n');
}

console.log('✅ Chrome Extension built successfully!');
console.log('\n📝 Next steps:');
console.log('1. Add icon images to extension/icons/');
console.log('2. Open Chrome and go to chrome://extensions/');
console.log('3. Enable "Developer mode"');
console.log('4. Click "Load unpacked"');
console.log('5. Select the "extension" folder');

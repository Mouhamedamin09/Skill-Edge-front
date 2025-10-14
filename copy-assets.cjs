const fs = require('fs');
const path = require('path');

console.log('📁 Copying logo files to dist directory...');

const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy logo files from public to dist
const logoFiles = ['skillEdgeLogo.png', 'skilledge-tab-logo.png'];

logoFiles.forEach(file => {
  const srcPath = path.join(publicDir, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✅ Copied ${file} to dist directory`);
  } else {
    console.log(`❌ Source file not found: ${srcPath}`);
  }
});

console.log('🎯 Asset copying complete!');

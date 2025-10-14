const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying logo files...\n');

const logoFiles = [
  'dist/skillEdgeLogo.png',
  'dist/skilledge-tab-logo.png',
  'public/skillEdgeLogo.png',
  'public/skilledge-tab-logo.png'
];

logoFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  console.log(`📁 Checking: ${file}`);
  
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`  ✅ Exists - Size: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`  📅 Modified: ${stats.mtime.toISOString()}`);
    
    // Check if file is readable
    try {
      fs.readFileSync(fullPath);
      console.log(`  ✅ Readable`);
    } catch (err) {
      console.log(`  ❌ Not readable: ${err.message}`);
    }
  } else {
    console.log(`  ❌ Not found`);
  }
  console.log('');
});

console.log('🎯 Logo verification complete!');

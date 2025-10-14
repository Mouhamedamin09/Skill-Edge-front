const fs = require('fs');
const path = require('path');

console.log('🖼️ Converting logo files to base64...');

const logoFiles = ['skillEdgeLogo.png', 'skilledge-tab-logo.png'];
const output = {};

logoFiles.forEach(file => {
  const filePath = path.join(__dirname, 'public', file);
  
  if (fs.existsSync(filePath)) {
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;
    
    // Create a safe variable name
    const varName = file.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    output[varName] = dataUrl;
    
    console.log(`✅ Converted ${file} to base64 (${Math.round(base64.length / 1024)}KB)`);
  } else {
    console.log(`❌ File not found: ${filePath}`);
  }
});

// Write the base64 data to a file
const outputPath = path.join(__dirname, 'src', 'assets', 'logos.ts');
const outputDir = path.dirname(outputPath);

// Ensure the assets directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const tsContent = `// Auto-generated logo data URLs
export const LOGO_DATA = {
${Object.entries(output).map(([key, value]) => `  ${key}: "${value}"`).join(',\n')}
};

export const skillEdgeLogo = LOGO_DATA.skillEdgeLogo_png;
export const skilledgeTabLogo = LOGO_DATA.skilledge_tab_logo_png;
`;

fs.writeFileSync(outputPath, tsContent);
console.log(`📝 Written logo data to: ${outputPath}`);
console.log('🎯 Logo conversion complete!');

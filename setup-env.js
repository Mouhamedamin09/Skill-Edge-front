// Simple script to set up environment variables
// Run this before building for production

const fs = require("fs");
const path = require("path");

const envContent = `VITE_API_URL=https://monkfish-app-nnhdy.ondigitalocean.app/api
`;

const envPath = path.join(__dirname, ".env");

try {
  fs.writeFileSync(envPath, envContent);
  console.log("✅ Environment file created successfully!");
  console.log(
    "📝 VITE_API_URL set to: https://monkfish-app-nnhdy.ondigitalocean.app/api"
  );
} catch (error) {
  console.error("❌ Error creating environment file:", error.message);
}

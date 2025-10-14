#!/bin/bash

# Force clean install and build
echo "🧹 Cleaning previous build artifacts..."
rm -rf node_modules package-lock.json dist

echo "📦 Installing dependencies with legacy peer deps..."
npm install --legacy-peer-deps --no-optional

echo "🔧 Installing Rollup dependencies explicitly..."
npm install @rollup/rollup-linux-x64-gnu @rollup/rollup-win32-x64-msvc --save-optional

echo "🏗️ Building the application..."
npm run build

echo "✅ Build completed successfully!"

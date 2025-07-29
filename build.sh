#!/bin/bash

# Render Build Script for Submission Evaluator
echo "🚀 Starting Render build process..."

# Install root dependencies
echo "📦 Installing server dependencies..."
npm install --production

# Verify express is installed
echo "🔍 Verifying express installation..."
if [ -d "node_modules/express" ]; then
    echo "✅ Express found in node_modules"
else
    echo "❌ Express not found, installing explicitly..."
    npm install express
fi

# Install client dependencies and build
echo "📦 Installing client dependencies..."
cd client
npm install
echo "🏗️ Building React application..."
npm run build
cd ..

echo "✅ Build completed successfully!"
echo "📋 Listing node_modules to verify installation..."
ls -la node_modules/ | grep express
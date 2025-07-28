#!/bin/bash

# Render Build Script for Submission Evaluator
echo "🚀 Starting Render build process..."

# Install root dependencies
echo "📦 Installing server dependencies..."
npm ci --only=production

# Install client dependencies and build
echo "📦 Installing client dependencies..."
cd client
npm ci
echo "🏗️ Building React application..."
npm run build
cd ..

echo "✅ Build completed successfully!"
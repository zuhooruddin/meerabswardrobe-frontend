#!/bin/bash
# Build fix script for Linux server
# This script helps resolve bus errors during Next.js builds

set -e

echo "🔧 Starting build fix process..."

# 1. Clear all caches
echo "📦 Clearing caches..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .swc

# 2. Check Node.js version
echo "📋 Checking Node.js version..."
node --version
npm --version

# 3. Check available memory
echo "💾 Checking system memory..."
free -h

# 4. Install/Reinstall SWC binary for Linux
echo "🔨 Installing SWC binaries for Linux..."
npm install @next/swc-linux-x64-gnu@12.2.5 --save-optional --legacy-peer-deps || \
npm install @next/swc-linux-x64-musl@12.2.5 --save-optional --legacy-peer-deps || \
echo "⚠️  SWC binary installation failed, will use fallback"

# 5. Reinstall dependencies if needed
if [ "$1" == "--reinstall" ]; then
    echo "🔄 Reinstalling all dependencies..."
    rm -rf node_modules
    rm -f package-lock.json
    npm install --legacy-peer-deps
fi

# 6. Build with increased memory
echo "🏗️  Starting build with increased memory limit..."
NODE_OPTIONS='--max-old-space-size=4096' npm run build

echo "✅ Build process completed!"


















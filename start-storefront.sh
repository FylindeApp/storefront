#!/bin/bash

echo "🚀 Starting React TypeScript app with hot-reload..."

# Ensure permissions for node_modules
echo "🔧 Fixing permissions for node_modules..."
mkdir -p /app/node_modules
chmod -R 777 /app/node_modules

# Enable proper file watching inside Docker
export CHOKIDAR_USEPOLLING=true
export CHOKIDAR_INTERVAL=1000
export WATCHPACK_POLLING=true
export WATCHPACK_IGNORE=true
export NEXT_DISABLE_FILE_SYSTEM_WATCHER=0
export NODE_ENV=development
export NEXT_PUBLIC_SALEOR_API_URL="http://saleor:8000/graphql/"

echo "🔥 CHOKIDAR_USEPOLLING is set to $CHOKIDAR_USEPOLLING"
echo "🔧 NODE_ENV set to $NODE_ENV"
echo "🌐 NEXT_PUBLIC_SALEOR_API_URL set to $NEXT_PUBLIC_SALEOR_API_URL"

# Ensure dependencies are installed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "⚠️ node_modules not found. Installing dependencies..."
    npm install --ignore-scripts --legacy-peer-deps
else
    echo "✅ Dependencies already installed."
fi

# Explicitly run GraphQL codegen at runtime
echo "🔄 Running GraphQL Codegen once..."
npm run generate

# Start Next.js in hot-reload mode
echo "🔥 Starting Next.js dev server (hot-reload enabled)..."
npm run dev

#!/bin/bash

# Deployment script for Next.js app
# Run this on your server: bash deploy.sh

echo "🚀 Starting deployment..."

# Navigate to project directory
cd ~/domain_scan || cd /home/ubuntu/domain_scan || exit 1

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "📥 Installing PM2..."
    npm install -g pm2
fi

# Stop existing app if running
echo "🛑 Stopping existing app..."
pm2 stop next-app || true
pm2 delete next-app || true

# Start the app with PM2
echo "▶️  Starting application..."
pm2 start npm --name "next-app" -- start
pm2 save

# Show status
echo "✅ Deployment complete!"
echo "📊 App status:"
pm2 status

echo ""
echo "🌐 Your app should be running on http://localhost:3000"
echo "📝 Make sure nginx is configured as a reverse proxy to port 3000"


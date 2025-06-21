#!/bin/bash

echo "🔧 Fixing Next.js 404 Errors..."
echo ""

# Change to project directory
cd /Users/infograb/Workspace/Personal/FishBase-Dashboard

echo "1. Checking current Next.js processes..."
ps aux | grep -E "next|node.*dev" | grep -v grep | grep FishBase-Dashboard

echo ""
echo "2. Cleaning Next.js cache..."
rm -rf .next
echo "   ✅ .next directory removed"

echo ""
echo "3. Clearing npm cache..."
rm -rf node_modules/.cache
echo "   ✅ npm cache cleared"

echo ""
echo "4. Checking if port 3000 is in use..."
lsof -i :3000

echo ""
echo "5. Rebuilding the project..."
npm run build

echo ""
echo "✨ Fix complete! Now you can run:"
echo "   npm run dev"
echo ""
echo "The app should be accessible at:"
echo "   - Home page: http://localhost:3000/"
echo "   - API routes:"
echo "     - http://localhost:3000/api/species/map-data"
echo "     - http://localhost:3000/api/species/filter-options"
echo "     - http://localhost:3000/api/stats"
#!/bin/bash

echo "🚀 Preparing Undhyu.com for Live Deployment"
echo "==========================================="

# Initialize git repository
cd /app
git init

# Create proper .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.pyc
.DS_Store

# Production builds
build/
dist/

# Environment variables
.env
.env.local
.env.production

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# IDE
.vscode/
.idea/

# OS
Thumbs.db
EOF

# Add all files
git add .

# Create initial commit
git commit -m "🎉 Initial commit: Undhyu.com ready for deployment

✨ Features:
- Professional Soch-inspired design
- Shopify integration with real products
- Featured Collections and Products sections
- Mobile-responsive layout
- Complete ecommerce functionality"

echo ""
echo "✅ Git repository initialized and ready!"
echo ""
echo "📋 Next steps:"
echo "1. Create GitHub repository at: https://github.com/new"
echo "2. Repository name: undhyu-ecommerce"
echo "3. Keep it public (or private if you prefer)"
echo "4. Don't initialize with README (we already have files)"
echo ""
echo "5. Then run these commands:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/undhyu-ecommerce.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "🎯 After GitHub setup, continue with Vercel deployment!"
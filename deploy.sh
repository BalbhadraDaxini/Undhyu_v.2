#!/bin/bash

echo "🚀 Undhyu.com Deployment Preparation Script"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Building optimized production version...${NC}"

# Build frontend
echo -e "${YELLOW}Building React frontend...${NC}"
cd frontend
npm run build
cd ..

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful!${NC}"
else
    echo -e "${RED}❌ Frontend build failed!${NC}"
    exit 1
fi

# Check backend dependencies
echo -e "${YELLOW}Checking backend dependencies...${NC}"
cd backend
pip install -r requirements.txt > /dev/null 2>&1
cd ..

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed!${NC}"
else
    echo -e "${RED}❌ Backend dependency installation failed!${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Your Undhyu.com is ready for deployment!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. 📋 Read DEPLOYMENT_GUIDE.md for detailed instructions"
echo "2. 🌐 Set up MongoDB Atlas (free)"
echo "3. 🚂 Deploy backend to Railway"
echo "4. ⚡ Deploy frontend to Vercel"
echo "5. 🔗 Connect your domain Undhyu.com"
echo ""
echo -e "${YELLOW}💡 Tip: Your website will be live in under 30 minutes!${NC}"
echo ""
echo -e "${GREEN}🛍️ Ready to showcase beautiful Indian fashion to the world!${NC}"
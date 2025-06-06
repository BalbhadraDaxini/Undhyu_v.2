#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo -e "${PURPLE}"
echo "🚀 UNDHYU.COM DEPLOYMENT WIZARD"
echo "================================"
echo -e "${NC}"

echo -e "${BLUE}Welcome! Let's get your beautiful Indian fashion website live!${NC}"
echo ""

# Step 1: Choose deployment option
echo -e "${YELLOW}💰 Choose your deployment option:${NC}"
echo "1. 🆓 FREE Tier (Perfect for starting - $0/month)"
echo "2. 💼 PREMIUM Tier (Better performance - $20-40/month)"
echo ""
read -p "Enter your choice (1 or 2): " deployment_choice

if [ "$deployment_choice" = "1" ]; then
    echo -e "${GREEN}✅ Great choice! FREE deployment selected.${NC}"
    deployment_type="free"
elif [ "$deployment_choice" = "2" ]; then
    echo -e "${GREEN}✅ Excellent! PREMIUM deployment selected.${NC}"
    deployment_type="premium"
else
    echo -e "${RED}❌ Invalid choice. Defaulting to FREE.${NC}"
    deployment_type="free"
fi

echo ""
echo -e "${CYAN}📋 Deployment Plan:${NC}"

if [ "$deployment_type" = "free" ]; then
    echo "• Database: MongoDB Atlas (FREE - 512MB)"
    echo "• Backend: Railway (FREE - $5 credits/month)"  
    echo "• Frontend: Vercel (FREE - Unlimited)"
    echo "• Domain: Undhyu.com (Your existing domain)"
    echo "• SSL: Free automatic certificate"
    echo "• Monthly Cost: $0 🎉"
else
    echo "• Database: MongoDB Atlas M10 ($9/month)"
    echo "• Backend: DigitalOcean App Platform ($12/month)"
    echo "• Frontend: Vercel Pro ($20/month)" 
    echo "• Domain: Undhyu.com (Your existing domain)"
    echo "• SSL: Premium certificate included"
    echo "• Monthly Cost: ~$41/month 💼"
fi

echo ""
read -p "Continue with this plan? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo -e "${RED}Deployment cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}🎯 Perfect! Let's deploy step by step...${NC}"
echo ""

# Step-by-step deployment
echo -e "${BLUE}STEP 1: DATABASE SETUP${NC}"
echo "======================"
if [ "$deployment_type" = "free" ]; then
    ./setup-mongodb.sh
else
    echo "Setting up MongoDB Atlas M10 (Premium)..."
    echo "1. Go to https://cloud.mongodb.com/"
    echo "2. Create M10 cluster ($9/month)"
    echo "3. Better performance & dedicated resources"
    read -p "Press Enter when MongoDB is ready..."
fi

echo ""
echo -e "${BLUE}STEP 2: BACKEND DEPLOYMENT${NC}"
echo "=========================="
./setup-railway.sh

echo ""
echo -e "${BLUE}STEP 3: FRONTEND DEPLOYMENT${NC}"
echo "==========================="
./setup-vercel.sh

echo ""
echo -e "${BLUE}STEP 4: DOMAIN CONNECTION${NC}"
echo "=========================="
./setup-domain.sh

echo ""
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "======================="
echo ""
echo -e "${CYAN}Your Undhyu.com is now LIVE! 🌟${NC}"
echo ""
echo "✅ Website: https://undhyu.com"
echo "✅ Admin: Your Shopify dashboard"
echo "✅ SSL: Automatically secured"
echo "✅ Mobile: Fully responsive"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "1. Test your website thoroughly"
echo "2. Add more products in Shopify"
echo "3. Set up collections (sarees, lehengas, suits)"
echo "4. Start marketing your beautiful store!"
echo ""
echo -e "${PURPLE}🛍️ Welcome to the world of online Indian fashion! 🎊${NC}"
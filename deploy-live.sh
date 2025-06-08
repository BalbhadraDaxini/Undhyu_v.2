#!/bin/bash

# Colors for beautiful output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

clear

echo -e "${PURPLE}"
echo "🌐 UNDHYU.COM LIVE DEPLOYMENT WIZARD"
echo "====================================="
echo -e "${NC}"

echo -e "${BLUE}🎉 Your beautiful Indian fashion ecommerce website is ready to go live!${NC}"
echo -e "${BLUE}We'll deploy it to your custom domain: Undhyu.com${NC}"
echo ""

echo -e "${CYAN}📋 What we'll set up:${NC}"
echo "• Frontend: Vercel (FREE hosting)"
echo "• Backend: Railway (FREE tier)" 
echo "• Database: MongoDB Atlas (FREE 512MB)"
echo "• Domain: Your Undhyu.com from GoDaddy"
echo "• SSL: Free automatic certificate"
echo "• CDN: Global fast delivery"
echo ""
echo -e "${GREEN}💰 Total monthly cost: \$0 (completely FREE!)${NC}"
echo ""

read -p "Ready to make Undhyu.com live? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo -e "${RED}Deployment cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}🚀 Let's begin the deployment process!${NC}"
echo ""

echo -e "${BLUE}STEP 1: GITHUB SETUP${NC}"
echo "===================="
echo "1. Go to: https://github.com/new"
echo "2. Repository name: undhyu-ecommerce" 
echo "3. Keep it PUBLIC (free option)"
echo "4. Don't check 'Add a README file'"
echo "5. Click 'Create repository'"
echo ""
read -p "✅ GitHub repository created? (y/n): " github_done

if [ "$github_done" = "y" ]; then
    echo ""
    echo -e "${YELLOW}📤 Upload your code to GitHub:${NC}"
    echo "Copy and run these commands in your terminal:"
    echo ""
    echo -e "${CYAN}git remote add origin https://github.com/YOUR_USERNAME/undhyu-ecommerce.git${NC}"
    echo -e "${CYAN}git branch -M main${NC}"
    echo -e "${CYAN}git push -u origin main${NC}"
    echo ""
    read -p "✅ Code uploaded to GitHub? (y/n): " upload_done
fi

echo ""
echo -e "${BLUE}STEP 2: DATABASE SETUP (MongoDB Atlas)${NC}"
echo "======================================="
echo "1. Go to: https://cloud.mongodb.com/"
echo "2. Create free account"
echo "3. Create M0 cluster (FREE)"
echo "4. Cluster name: undhyu-db"
echo "5. Create database user: undhyu-admin"
echo "6. Network Access: Add IP 0.0.0.0/0"
echo "7. Get connection string"
echo ""
read -p "✅ MongoDB Atlas setup complete? (y/n): " mongo_done

echo ""
echo -e "${BLUE}STEP 3: BACKEND DEPLOYMENT (Railway)${NC}"
echo "====================================="
echo "1. Go to: https://railway.app/"
echo "2. Sign up with your GitHub account"
echo "3. Click 'Deploy from GitHub repo'"
echo "4. Select your undhyu-ecommerce repository"
echo "5. Choose 'backend' folder"
echo "6. Add these environment variables:"
echo ""
echo -e "${CYAN}SHOPIFY_STORE_DOMAIN=j0dktb-z1.myshopify.com${NC}"
echo -e "${CYAN}SHOPIFY_STOREFRONT_ACCESS_TOKEN=d6663c23c4c7b1c85790bb6230722ee2${NC}"
echo -e "${CYAN}MONGO_URL=[Your MongoDB connection string]${NC}"
echo -e "${CYAN}DB_NAME=undhyu_db${NC}"
echo -e "${CYAN}PORT=8001${NC}"
echo ""
echo "7. Click Deploy!"
echo "8. Copy your Railway app URL (e.g., https://yourapp.up.railway.app)"
echo ""
read -p "✅ Backend deployed to Railway? (y/n): " railway_done

echo ""
echo -e "${BLUE}STEP 4: FRONTEND DEPLOYMENT (Vercel)${NC}"
echo "====================================="
echo "1. Go to: https://vercel.com/"
echo "2. Sign up with your GitHub account"
echo "3. Click 'New Project'"
echo "4. Import your undhyu-ecommerce repository"
echo "5. Set these configurations:"
echo "   - Framework Preset: Create React App"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm run build"
echo "   - Output Directory: build"
echo ""
echo "6. Add environment variable:"
echo -e "${CYAN}REACT_APP_BACKEND_URL=[Your Railway app URL]${NC}"
echo ""
echo "7. Click Deploy!"
echo ""
read -p "✅ Frontend deployed to Vercel? (y/n): " vercel_done

echo ""
echo -e "${BLUE}STEP 5: CUSTOM DOMAIN SETUP (GoDaddy + Vercel)${NC}"
echo "=============================================="
echo "🔗 In Vercel Dashboard:"
echo "1. Go to your project settings"
echo "2. Click 'Domains'"
echo "3. Add 'undhyu.com'"
echo "4. Add 'www.undhyu.com'"
echo ""
echo "🌐 In GoDaddy DNS Management:"
echo "1. Login to your GoDaddy account"
echo "2. Go to DNS Management for undhyu.com"
echo "3. Add these DNS records:"
echo ""
echo -e "${CYAN}Type: A${NC}"
echo -e "${CYAN}Name: @${NC}"
echo -e "${CYAN}Value: 76.76.19.61${NC}"
echo -e "${CYAN}TTL: 600${NC}"
echo ""
echo -e "${CYAN}Type: CNAME${NC}"
echo -e "${CYAN}Name: www${NC}"
echo -e "${CYAN}Value: cname.vercel-dns.com${NC}"
echo -e "${CYAN}TTL: 600${NC}"
echo ""
read -p "✅ Domain setup complete? (y/n): " domain_done

echo ""
echo -e "${GREEN}🎉 CONGRATULATIONS! 🎉${NC}"
echo "====================="
echo ""
echo -e "${PURPLE}Your Undhyu.com is now LIVE! 🌟${NC}"
echo ""
echo -e "${CYAN}🌐 Your website will be available at:${NC}"
echo "   • https://undhyu.com"
echo "   • https://www.undhyu.com"
echo ""
echo -e "${YELLOW}⏱️  DNS propagation takes 5-10 minutes${NC}"
echo ""
echo -e "${GREEN}✨ What's now live:${NC}"
echo "• Beautiful professional homepage"
echo "• Real Shopify product integration"
echo "• Featured collections and products"
echo "• Mobile-responsive design"
echo "• Secure HTTPS with free SSL"
echo "• Global CDN for fast loading"
echo ""
echo -e "${BLUE}🛍️ Your customers can now:${NC}"
echo "• Browse your authentic Indian fashion collection"
echo "• Search and filter products"
echo "• Purchase directly through Shopify"
echo "• Enjoy a professional shopping experience"
echo ""
echo -e "${PURPLE}🎊 Welcome to the world of online Indian fashion! 🎊${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps to grow your business:${NC}"
echo "1. Add more products to your Shopify store"
echo "2. Set up collections (sarees, lehengas, suits, jewelry)"
echo "3. Start marketing your beautiful website"
echo "4. Monitor analytics and customer feedback"
echo ""
echo -e "${GREEN}🚀 Your professional ecommerce journey begins now!${NC}"
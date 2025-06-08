# 🚀 Deploy Undhyu.com to Your Custom Domain

## Quick Deployment Guide

### Step 1: GitHub Setup (2 minutes)

1. **Create GitHub Account** (if you don't have one):
   - Go to [GitHub.com](https://github.com)
   - Sign up for free

2. **Create Repository**:
   - Go to [https://github.com/new](https://github.com/new)
   - Repository name: `undhyu-ecommerce`
   - Keep it **Public** (free)
   - **Don't** check "Add a README file"
   - Click "Create repository"

3. **Upload Your Code**:
   ```bash
   # In your local terminal or code editor:
   git remote add origin https://github.com/YOUR_USERNAME/undhyu-ecommerce.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy Backend to Railway (5 minutes)

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Deploy Backend**:
   - Click "Deploy from GitHub repo"
   - Select your `undhyu-ecommerce` repository
   - Choose "backend" folder
   - Add environment variables:
     ```
     SHOPIFY_STORE_DOMAIN=j0dktb-z1.myshopify.com
     SHOPIFY_STOREFRONT_ACCESS_TOKEN=d6663c23c4c7b1c85790bb6230722ee2
     MONGO_URL=mongodb+srv://your-connection-string
     DB_NAME=undhyu_db
     PORT=8001
     ```
   - Click "Deploy"

4. **Get Backend URL**:
   - After deployment, copy your Railway app URL
   - Example: `https://your-app.up.railway.app`

### Step 3: Deploy Frontend to Vercel (5 minutes)

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up with GitHub**
3. **Import Project**:
   - Click "New Project"
   - Import your `undhyu-ecommerce` repository
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Add Environment Variable**:
   ```
   REACT_APP_BACKEND_URL=https://your-railway-app.up.railway.app
   ```

5. **Deploy!**

### Step 4: Connect Custom Domain (GoDaddy)

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Click "Domains"
   - Add `undhyu.com`
   - Add `www.undhyu.com`

2. **Update DNS at GoDaddy**:
   - Login to your GoDaddy account
   - Go to DNS Management for undhyu.com
   - Add these records:

   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   TTL: 600

   Type: CNAME
   Name: www  
   Value: cname.vercel-dns.com
   TTL: 600
   ```

3. **Wait 5-10 minutes** for DNS propagation

### Step 5: Database Setup (MongoDB Atlas)

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Create Free Account**
3. **Create Cluster**:
   - Choose M0 (Free tier)
   - Cluster name: `undhyu-db`
4. **Create Database User**:
   - Username: `undhyu-admin`
   - Password: Generate strong password
5. **Network Access**:
   - Add IP: `0.0.0.0/0` (Allow from anywhere)
6. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Update Railway environment variables with this URL

## 🎉 Your Website Will Be Live!

- **Custom Domain**: https://undhyu.com
- **Professional SSL**: Automatic
- **Global CDN**: Fast worldwide
- **Auto Deployment**: Updates when you push to GitHub

## 💰 Cost Breakdown

- **Vercel (Frontend)**: FREE forever
- **Railway (Backend)**: FREE $5 credits/month
- **MongoDB Atlas**: FREE 512MB
- **Domain**: Already owned
- **SSL Certificate**: FREE

**Total Monthly Cost: $0** 🎉

## 🚀 You're Ready to Launch!

Once DNS propagates, your professional Undhyu.com will be live and ready for customers!
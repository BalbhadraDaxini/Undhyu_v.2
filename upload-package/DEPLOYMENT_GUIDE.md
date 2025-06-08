# 🚀 FREE Deployment Guide for Undhyu.com

## Step 1: Set Up MongoDB Atlas (FREE Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create free account
3. Create new cluster (FREE M0 tier - 512MB)
4. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: mongodb+srv://username:password@cluster.mongodb.net/)

## Step 2: Deploy Backend to Railway (FREE)

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Connect your repository
5. Select "backend" folder
6. Add environment variables:
   ```
   SHOPIFY_STORE_DOMAIN=j0dktb-z1.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=d6663c23c4c7b1c85790bb6230722ee2
   MONGO_URL=your_mongodb_atlas_connection_string
   DB_NAME=undhyu_db
   PORT=8001
   ```
7. Deploy! Your backend will be at: https://yourapp.up.railway.app

## Step 3: Deploy Frontend to Vercel (FREE)

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Set root directory to "frontend"
6. Add environment variable:
   ```
   REACT_APP_BACKEND_URL=https://yourapp.up.railway.app
   ```
7. Deploy! Your frontend will be at: https://yourapp.vercel.app

## Step 4: Connect Your Domain (Undhyu.com)

1. In Vercel dashboard:
   - Go to your project settings
   - Click "Domains"
   - Add "undhyu.com" and "www.undhyu.com"

2. Update your domain DNS (at your registrar):
   ```
   Type: A
   Name: @
   Value: 76.76.19.61 (Vercel's IP)
   
   Type: CNAME  
   Name: www
   Value: cname.vercel-dns.com
   ```

## Step 5: Test Everything

- Visit https://undhyu.com
- Test product loading
- Test search and filters
- Test mobile responsiveness

## Free Usage Limits

✅ **MongoDB Atlas**: 512MB forever free
✅ **Railway**: $5 credit monthly (enough for small apps)
✅ **Vercel**: Unlimited static hosting
✅ **Custom Domain**: Free SSL included

## Backup Deployment Option

If Railway credits run out, use **Render.com** (also free):
1. Go to [Render.com](https://render.com)
2. Connect GitHub
3. Create "Web Service"
4. Use same environment variables
5. Your app will be at: https://yourapp.onrender.com

## Estimated Monthly Cost: $0 🎉

Your beautiful Undhyu.com will be live with zero monthly costs!
# GrowSmart Deployment Guide

This guide will help you deploy the GrowSmart application to production.

## 📋 Prerequisites

Before deploying, ensure you have:
- Git repository (GitHub, GitLab, or Bitbucket)
- MongoDB Atlas account (for database)
- Vercel account (for frontend) or alternative hosting
- Render/Railway account (for backend) or alternative hosting

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend) - Recommended

This is the easiest and most cost-effective option for getting started.

---

## 📦 Part 1: Deploy Backend (Node.js/Express)

### Using Render.com (Free Tier Available)

#### Step 1: Prepare Backend for Deployment

1. **Create a `render.yaml` file** in the backend directory:

```yaml
services:
  - type: web
    name: growsmart-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: TREFLE_API_KEY
        sync: false
      - key: WEATHER_API_KEY
        sync: false
```

2. **Update `backend/package.json`** to ensure start script exists:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

3. **Update CORS settings** in `backend/server.js`:

```javascript
// Replace the CORS configuration with:
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
```

#### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `growsmart-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (generate with: `openssl rand -base64 32`)
   - `TREFLE_API_KEY`: Your Trefle API key
   - `WEATHER_API_KEY`: Your WeatherAPI.com key
   - `PORT`: 5000
   - `NODE_ENV`: production

6. Click **"Create Web Service"**

7. **Note your backend URL**: `https://growsmart-backend.onrender.com`

---

## 🌐 Part 2: Deploy Frontend (Next.js)

### Using Vercel (Recommended - Free Tier)

#### Step 1: Prepare Frontend for Deployment

1. **Create `vercel.json`** in the frontend directory:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

2. **Update API URLs** - Create `frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://growsmart-backend.onrender.com
NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY=your_key_here_if_using_paid_api
```

3. **Update API calls** to use environment variable:

In all files that make API calls (search, dashboard, favorites, etc.), replace:
```javascript
// Old:
fetch('http://localhost:5000/api/plants/search', ...)

// New:
fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plants/search`, ...)
```

#### Step 2: Deploy to Vercel

**Option A: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend directory
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: growsmart
# - Directory: ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL from Render
   - `NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY`: (if using paid API)

6. Click **"Deploy"**

7. **Your site will be live at**: `https://growsmart.vercel.app`

---

## 🗄️ Part 3: Setup MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (use `0.0.0.0/0` for all IPs)
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/growsmart?retryWrites=true&w=majority
   ```
6. Add this to your backend environment variables as `MONGODB_URI`

---

## 🔧 Alternative Deployment Options

### Option 2: Railway (Full-Stack)

Railway can host both frontend and backend in one place.

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Add two services:
   - **Backend**: Node.js service (root: `backend`)
   - **Frontend**: Next.js service (root: `frontend`)
4. Add environment variables to each service
5. Deploy!

### Option 3: Netlify (Frontend) + Heroku (Backend)

Similar to Vercel + Render, but using different platforms.

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible at your Render URL
- [ ] Frontend is accessible at your Vercel URL
- [ ] MongoDB connection is working
- [ ] API calls from frontend to backend are successful
- [ ] Authentication (login/register) works
- [ ] Plant search functionality works
- [ ] Weather API integration works
- [ ] Language switching works
- [ ] All pages load correctly
- [ ] Mobile responsiveness is good

---

## 🔍 Testing Your Deployment

1. **Test Backend**:
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try searching for plants
   - Test login/register
   - Switch languages
   - Check all pages

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- Check Render logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

**Problem**: CORS errors
- Update `FRONTEND_URL` environment variable
- Check CORS configuration in `server.js`

### Frontend Issues

**Problem**: API calls failing
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check if backend is running
- Look at browser console for errors

**Problem**: Build fails
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Verify no TypeScript errors

---

## 📊 Monitoring & Maintenance

### Render (Backend)
- View logs in Render dashboard
- Monitor resource usage
- Set up health checks

### Vercel (Frontend)
- View deployment logs
- Monitor analytics
- Check performance metrics

---

## 💰 Cost Estimation

### Free Tier (Recommended for Starting)
- **Vercel**: Free (Hobby plan)
- **Render**: Free (with limitations - sleeps after 15 min inactivity)
- **MongoDB Atlas**: Free (512MB storage)
- **Total**: $0/month

### Paid Tier (For Production)
- **Vercel Pro**: $20/month
- **Render Starter**: $7/month
- **MongoDB Atlas**: $9/month (Shared cluster)
- **Total**: ~$36/month

---

## 🔐 Security Recommendations

1. **Environment Variables**: Never commit `.env` files
2. **API Keys**: Rotate regularly
3. **JWT Secret**: Use a strong, random string
4. **CORS**: Restrict to your frontend domain only
5. **MongoDB**: Use IP whitelist, not `0.0.0.0/0` in production
6. **HTTPS**: Both Vercel and Render provide free SSL

---

## 📝 Custom Domain (Optional)

### Vercel
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## 🚀 Quick Deploy Commands

```bash
# Backend (if using Render CLI)
cd backend
git push render main

# Frontend (if using Vercel CLI)
cd frontend
vercel --prod

# Or deploy both with git push
git add .
git commit -m "Deploy to production"
git push origin main
# (Auto-deploys if connected to Vercel/Render)
```

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## 🎉 Congratulations!

Your GrowSmart application is now live and accessible to users worldwide!

**Next Steps**:
- Share your deployment URL
- Gather user feedback
- Monitor performance
- Plan future features

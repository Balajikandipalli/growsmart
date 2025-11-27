# 🚀 Quick Deployment Checklist

## ✅ Pre-Deployment Steps

### 1. Environment Setup
- [ ] Create MongoDB Atlas account and cluster
- [ ] Get MongoDB connection string
- [ ] Generate JWT secret: `openssl rand -base64 32`
- [ ] Have Trefle API key ready
- [ ] Have Weather API key ready

### 2. Code Preparation
- [ ] Commit all changes to Git
- [ ] Push to GitHub/GitLab
- [ ] Ensure no `.env` files are committed

## 🔧 Backend Deployment (Render.com)

1. **Sign up at [render.com](https://render.com)**

2. **Create New Web Service**
   - Connect GitHub repository
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-generated-secret
   TREFLE_API_KEY=your-key
   WEATHER_API_KEY=your-key
   PORT=5000
   NODE_ENV=production
   ```

4. **Deploy** - Copy your backend URL (e.g., `https://growsmart-backend.onrender.com`)

## 🌐 Frontend Deployment (Vercel)

1. **Sign up at [vercel.com](https://vercel.com)**

2. **Import Project**
   - Connect GitHub repository
   - Framework: Next.js
   - Root Directory: `frontend`

3. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy** - Your site will be live at `https://your-app.vercel.app`

## 🧪 Testing

- [ ] Visit your deployed frontend URL
- [ ] Test plant search
- [ ] Test login/register
- [ ] Test language switching
- [ ] Check all pages load
- [ ] Test on mobile device

## 🎉 You're Live!

Share your deployment URL and start gathering feedback!

---

**Need Help?** Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions.

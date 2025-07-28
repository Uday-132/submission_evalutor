# 🚀 Render Deployment Guide - Submission Evaluator

## 🎯 Quick Fix for Current Error

The error `concurrently: not found` happens because Render is trying to run development scripts. Here's how to fix it:

### Step 1: Update Render Settings
In your Render dashboard:

1. **Build Command:** `npm install && npm run render-build`
2. **Start Command:** `npm start`
3. **Environment:** `Node`
4. **Plan:** `Free`

### Step 2: Environment Variables
Add these environment variables in Render dashboard:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/submission-evaluator
GROQ_API_KEY=your_groq_api_key_here
SESSION_SECRET=your-super-secret-session-key-for-production
```

## 🔧 Complete Render Deployment Steps

### 1. MongoDB Atlas Setup (Required)
Before deploying, set up your cloud database:

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Get your connection string
5. Add `0.0.0.0/0` to network access (for Render)

### 2. Render Deployment Process

#### Option A: Using render.yaml (Recommended)
1. Push your code to GitHub with the `render.yaml` file
2. Connect your GitHub repo to Render
3. Render will automatically use the configuration

#### Option B: Manual Configuration
1. **Create New Web Service** on Render
2. **Connect GitHub Repository**
3. **Configure Build Settings:**
   - **Name:** `submission-evaluator`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run render-build`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

### 3. Environment Variables Configuration

Add these in Render Dashboard → Environment:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Sets production mode |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `GROQ_API_KEY` | `gsk_...` | Your Groq API key |
| `SESSION_SECRET` | `random-secret-key` | Session encryption key |

### 4. Build Process Explanation

```bash
# What happens during deployment:
npm install                    # Install server dependencies
cd client && npm install      # Install client dependencies  
cd client && npm run build    # Build React production files
npm start                     # Start the server
```

## 🛠️ Troubleshooting Common Issues

### Issue: "concurrently: not found"
**Solution:** Make sure you're using `npm start` not `npm run dev`
- Build Command: `npm install && npm run render-build`
- Start Command: `npm start`

### Issue: "Module not found"
**Solution:** Check dependencies are in `dependencies`, not `devDependencies`
```bash
npm install --save missing-package
```

### Issue: "Database connection failed"
**Solution:** 
1. Check MongoDB Atlas connection string
2. Ensure network access allows `0.0.0.0/0`
3. Verify database user credentials

### Issue: "Build failed"
**Solution:**
1. Check build logs in Render dashboard
2. Ensure all environment variables are set
3. Verify client build works locally: `cd client && npm run build`

### Issue: "App crashes on startup"
**Solution:**
1. Check server logs in Render dashboard
2. Verify `PORT` environment variable (Render sets this automatically)
3. Ensure all required environment variables are configured

## 📊 Deployment Checklist

Before deploying, ensure:

- [ ] MongoDB Atlas cluster is created and configured
- [ ] Database user has read/write permissions
- [ ] Network access allows connections from anywhere (0.0.0.0/0)
- [ ] GROQ API key is valid and has credits
- [ ] All environment variables are set in Render
- [ ] Build command is: `npm install && npm run render-build`
- [ ] Start command is: `npm start`
- [ ] Repository is pushed to GitHub

## 🎯 Expected Deployment Flow

1. **Build Phase (3-5 minutes):**
   ```
   Installing server dependencies...
   Installing client dependencies...
   Building React production files...
   Build completed successfully!
   ```

2. **Start Phase (30 seconds):**
   ```
   Server is running on port 10000
   ✅ Connected to MongoDB successfully
   📊 Database: submission-evaluator (MongoDB Atlas - Cloud)
   ```

3. **Health Check:**
   ```
   ✅ Service is live at: https://your-app-name.onrender.com
   ```

## 🔗 Post-Deployment

After successful deployment:

1. **Test the application:**
   - Upload a PDF/PowerPoint file
   - Check evaluation works
   - Verify history is saved
   - Test PDF report generation

2. **Monitor logs:**
   - Check Render dashboard for any errors
   - Monitor database connections
   - Watch for API rate limits

3. **Update frontend URLs:**
   - If using separate frontend deployment, update API endpoints
   - Ensure CORS is configured for your domain

## 🚨 Emergency Fixes

If deployment fails:

1. **Quick Fix:** Redeploy with manual settings:
   - Build: `npm install && cd client && npm install && cd client && npm run build`
   - Start: `node server.js`

2. **Reset Build Cache:** 
   - Go to Render dashboard → Settings → Clear build cache

3. **Check Dependencies:**
   ```bash
   # Move concurrently to dependencies if needed
   npm install --save concurrently
   ```

## 📞 Support

If you're still having issues:
1. Check Render build logs for specific errors
2. Verify all environment variables are set correctly
3. Test the build process locally first
4. Ensure MongoDB Atlas is properly configured

---

**Your app should be live at:** `https://your-app-name.onrender.com` 🎉
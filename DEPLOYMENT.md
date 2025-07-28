# 🚀 Deployment Guide - Submission Evaluator

## 📋 Overview
This guide covers deploying your Submission Evaluator to production with cloud database support, ensuring users on any system can access shared evaluation history.

## 🗄️ Database Setup (MongoDB Atlas - Cloud)

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new project (e.g., "Submission Evaluator")

### Step 2: Create Database Cluster
1. Click "Build a Database"
2. Choose **M0 Sandbox** (Free tier - perfect for this project)
3. Select your preferred cloud provider and region
4. Name your cluster (e.g., "submission-evaluator-cluster")
5. Click "Create Cluster"

### Step 3: Configure Database Access
1. **Database User:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `evaluator-admin` (or your choice)
   - Generate a secure password and save it
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

2. **Network Access:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0) for deployment
   - Click "Confirm"

### Step 4: Get Connection String
1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (looks like):
   ```
   mongodb+srv://evaluator-admin:<password>@submission-evaluator-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## 🌐 Deployment Options

### Option A: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend Deployment (Vercel):
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Set build settings:
   - **Framework Preset:** Create React App
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

#### Backend Deployment (Railway):
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://evaluator-admin:YOUR_PASSWORD@submission-evaluator-cluster.xxxxx.mongodb.net/submission-evaluator?retryWrites=true&w=majority
   GROQ_API_KEY=your_groq_api_key_here
   ```

### Option B: Full-Stack Deployment (Render/Heroku)

#### Render Deployment:
1. Go to [Render](https://render.com)
2. Connect your GitHub repository
3. Create a **Web Service**
4. Settings:
   - **Build Command:** `npm install && cd client && npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     ```
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://evaluator-admin:YOUR_PASSWORD@submission-evaluator-cluster.xxxxx.mongodb.net/submission-evaluator?retryWrites=true&w=majority
     GROQ_API_KEY=your_groq_api_key_here
     ```

## 🔧 Environment Configuration

### Production Environment Variables (.env):
```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Database - MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://evaluator-admin:YOUR_PASSWORD@submission-evaluator-cluster.xxxxx.mongodb.net/submission-evaluator?retryWrites=true&w=majority

# Groq AI API
GROQ_API_KEY=your_groq_api_key_here
```

### Development Environment Variables (.env.local):
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - Local MongoDB for development
MONGODB_URI=mongodb://localhost:27017/submission-evaluator

# Groq AI API
GROQ_API_KEY=your_groq_api_key_here
```

## 📦 Build Scripts Update

Add these scripts to your root `package.json`:

```json
{
  "scripts": {
    "build": "cd client && npm install && npm run build",
    "start": "node server.js",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "nodemon server.js",
    "client": "cd client && npm start",
    "heroku-postbuild": "cd client && npm install && npm run build"
  }
}
```

## 🔒 Security Considerations

1. **Environment Variables:** Never commit `.env` files to GitHub
2. **Database Access:** Use specific database users, not admin accounts
3. **CORS Configuration:** Update CORS settings for your domain
4. **API Keys:** Rotate API keys regularly

## 🧪 Testing Deployment

### Local Testing with Cloud Database:
1. Update your `.env` with MongoDB Atlas connection string
2. Run `npm start`
3. Test evaluation history - it should persist across sessions
4. Multiple users can now share the same evaluation database

### Production Testing:
1. Deploy to your chosen platform
2. Test file upload and evaluation
3. Check evaluation history persistence
4. Test from different devices/locations

## 📊 Database Collections

Your MongoDB Atlas database will contain:
- **evaluations:** Stores all evaluation results
- **users:** (if you add authentication later)
- **files:** (if you implement file metadata storage)

## 🚨 Common Issues & Solutions

### Issue: "Database connection failed"
**Solution:** Check MongoDB Atlas network access and connection string

### Issue: "CORS errors in production"
**Solution:** Update CORS configuration in `server.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Issue: "Build fails on deployment"
**Solution:** Ensure all dependencies are in `package.json`, not just `devDependencies`

## 🎯 Benefits of Cloud Deployment

✅ **Shared Database:** All users access the same evaluation history  
✅ **No Local Setup:** Users don't need MongoDB installed  
✅ **Scalability:** Handles multiple concurrent users  
✅ **Backup & Security:** MongoDB Atlas provides automatic backups  
✅ **Global Access:** Available from anywhere with internet  

## 📞 Support

If you encounter issues:
1. Check deployment platform logs
2. Verify environment variables
3. Test database connection string
4. Check MongoDB Atlas network access settings

---

**Next Steps:** Choose your deployment platform and follow the specific guide above!
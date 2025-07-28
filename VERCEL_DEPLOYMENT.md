# 🚀 Vercel Deployment Guide - Submission Evaluator

## 🎯 Quick Vercel Deployment Steps

### Step 1: Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### Step 2: Deploy via GitHub (Recommended)
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **"New Project"**
4. Import your GitHub repository
5. Configure settings (see below)
6. Deploy!

## ⚙️ Vercel Configuration

### Build Settings
- **Framework Preset:** Other
- **Build Command:** `npm run vercel-build`
- **Output Directory:** `client/build`
- **Install Command:** `npm install`

### Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `MONGODB_URI` | `mongodb+srv://...` | Production |
| `GROQ_API_KEY` | `gsk_...` | Production |
| `SESSION_SECRET` | `your-secret-key` | Production |

## 🔧 Project Structure for Vercel

Your project structure should look like this:
```
submission-evaluator/
├── server.js              # Backend API
├── vercel.json            # Vercel configuration
├── package.json           # Server dependencies
├── client/                # React frontend
│   ├── package.json       # Client dependencies
│   ├── src/               # React source code
│   └── build/             # Built React app (generated)
├── routes/                # API routes
├── models/                # Database models
└── utils/                 # Utility functions
```

## 🌐 How Vercel Deployment Works

1. **Build Phase:**
   ```bash
   npm install                    # Install server dependencies
   cd client && npm install      # Install client dependencies
   cd client && npm run build    # Build React production files
   ```

2. **Serverless Functions:**
   - `server.js` becomes a serverless function
   - API routes available at `/api/*`
   - Static files served from `client/build`

3. **Routing:**
   - `/api/*` → Backend serverless function
   - `/*` → React frontend static files

## 🛠️ Advanced Vercel Configuration

### Custom vercel.json Explanation
```json
{
  "version": 2,                    // Vercel platform version
  "name": "submission-evaluator", // Project name
  "builds": [
    {
      "src": "server.js",         // Backend entry point
      "use": "@vercel/node"       // Node.js runtime
    },
    {
      "src": "client/package.json", // Frontend build
      "use": "@vercel/static-build", // Static build
      "config": {
        "distDir": "build"        // Output directory
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",         // API routes
      "dest": "/server.js"        // Route to backend
    },
    {
      "src": "/(.*)",             // All other routes
      "dest": "/client/build/$1"  // Route to frontend
    }
  ]
}
```

## 🚨 Common Vercel Issues & Solutions

### Issue: "Build failed - Module not found"
**Solution:** Ensure all dependencies are in `dependencies`, not `devDependencies`
```bash
# Move packages if needed
npm install --save package-name
```

### Issue: "API routes not working"
**Solution:** Check your API routes start with `/api/`
```javascript
// In server.js
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/upload', uploadRoutes);
```

### Issue: "Database connection failed"
**Solution:** 
1. Use MongoDB Atlas (not local MongoDB)
2. Set `MONGODB_URI` environment variable
3. Allow connections from `0.0.0.0/0` in MongoDB Atlas

### Issue: "File upload not working"
**Solution:** Vercel has limitations with file uploads
```javascript
// Use memory storage instead of disk storage
const storage = multer.memoryStorage();
```

### Issue: "Session not persisting"
**Solution:** Use MongoDB session store (already configured)
```javascript
// Already in server.js
store: MongoStore.create({
  mongoUrl: process.env.MONGODB_URI
})
```

## 📊 Deployment Checklist

Before deploying:

- [ ] Code pushed to GitHub
- [ ] MongoDB Atlas cluster created
- [ ] Database user with read/write permissions
- [ ] Network access allows `0.0.0.0/0`
- [ ] GROQ API key is valid
- [ ] All environment variables ready
- [ ] `vercel.json` configuration file present
- [ ] Build command: `npm run vercel-build`

## 🎯 Step-by-Step Deployment

### Method 1: GitHub Integration (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select your repository

3. **Configure Build Settings:**
   - Framework Preset: `Other`
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/build`
   - Install Command: `npm install`

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/submission-evaluator
   GROQ_API_KEY=your_groq_api_key_here
   SESSION_SECRET=your-super-secret-session-key
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add GROQ_API_KEY
   vercel env add SESSION_SECRET
   ```

## 🔍 Testing Your Deployment

After deployment, test these features:

1. **Frontend Loading:**
   - Visit your Vercel URL
   - Check if the React app loads
   - Verify particle background works

2. **File Upload:**
   - Upload a PDF or PowerPoint file
   - Check if text extraction works
   - Verify file processing

3. **AI Evaluation:**
   - Submit a file for evaluation
   - Check if Groq API responds
   - Verify evaluation results display

4. **Database Operations:**
   - Check if evaluations save to MongoDB
   - Test evaluation history
   - Verify session-based privacy

5. **PDF Generation:**
   - Generate a PDF report
   - Check if download works
   - Verify PDF content

## 🚀 Post-Deployment Optimization

### Performance Tips:
1. **Enable Vercel Analytics:**
   ```bash
   npm install @vercel/analytics
   ```

2. **Add Caching Headers:**
   ```javascript
   // In server.js
   app.use(express.static('client/build', {
     maxAge: '1d'
   }));
   ```

3. **Optimize Images:**
   - Use Vercel Image Optimization
   - Compress particle background assets

### Monitoring:
1. **Check Vercel Dashboard:**
   - Monitor function invocations
   - Check error logs
   - Monitor performance metrics

2. **Database Monitoring:**
   - Monitor MongoDB Atlas metrics
   - Check connection pool usage
   - Monitor query performance

## 🎉 Success!

Your Submission Evaluator should now be live at:
`https://your-project-name.vercel.app`

### Features Working:
✅ Particle background animation  
✅ File upload and text extraction  
✅ AI-powered evaluation  
✅ Session-based privacy  
✅ Evaluation history  
✅ PDF report generation  
✅ Responsive design  
✅ Dark/light theme  

## 📞 Support

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB Atlas connection
5. Verify GROQ API key and credits

---

**Happy Deploying! 🚀**
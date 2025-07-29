const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow all origins in production for Vercel
    : ['http://localhost:3000'],
  credentials: true // Enable credentials for sessions
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Simple session middleware (no database required)
app.use(session({
  secret: process.env.SESSION_SECRET || 'submission-evaluator-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware to ensure each user has a unique session ID
app.use((req, res, next) => {
  if (!req.session.userId) {
    req.session.userId = uuidv4();
    console.log(`🆔 New user session created: ${req.session.userId.substring(0, 8)}...`);
  }
  next();
});

// Configure multer for file uploads (Vercel-compatible)
const storage = process.env.NODE_ENV === 'production' 
  ? multer.memoryStorage() // Use memory storage for Vercel
  : multer.diskStorage({   // Use disk storage for local development
      destination: (req, file, cb) => {
        const uploadsDir = path.join(__dirname, 'uploads');
        fs.ensureDirSync(uploadsDir);
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    });

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|pptx|ppt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                    file.mimetype === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
                    file.mimetype === 'application/vnd.ms-powerpoint';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and PowerPoint files are allowed!'));
    }
  }
});

// Import routes
const evaluationRoutes = require('./routes/evaluation');
const uploadRoutes = require('./routes/upload');

// Routes (no database required)
app.use('/api/evaluation', evaluationRoutes);
app.use('/api/upload', uploadRoutes);

console.log('🚀 Server starting without database - evaluations will be processed in real-time only');

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large. Maximum size is 50MB.'
      });
    }
  }
  
  res.status(500).json({
    error: error.message || 'Something went wrong!'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
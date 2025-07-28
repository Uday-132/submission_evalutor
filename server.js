const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true // Enable credentials for sessions
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session middleware for user privacy
app.use(session({
  secret: process.env.SESSION_SECRET || 'submission-evaluator-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/submission-evaluator',
    touchAfter: 24 * 3600, // lazy session update
    autoRemove: 'native' // Let MongoDB handle expired sessions
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
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

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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

// MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/submission-evaluator';
    
    // Log connection attempt (hide password in logs)
    const logURI = mongoURI.includes('@') 
      ? mongoURI.replace(/:([^:@]{8})[^:@]*@/, ':****@')
      : mongoURI;
    console.log(`🔄 Connecting to MongoDB: ${logURI}`);
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB successfully');
    
    // Log database info
    const dbName = mongoose.connection.db.databaseName;
    const isAtlas = mongoURI.includes('mongodb+srv://');
    console.log(`📊 Database: ${dbName} ${isAtlas ? '(MongoDB Atlas - Cloud)' : '(Local)'}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (process.env.NODE_ENV === 'production') {
      console.log('🚨 Production deployment requires working database connection');
      console.log('💡 Solutions for production:');
      console.log('   1. Set up MongoDB Atlas: https://www.mongodb.com/atlas');
      console.log('   2. Update MONGODB_URI environment variable');
      console.log('   3. Check network access settings in MongoDB Atlas');
      process.exit(1); // Exit in production if DB fails
    } else {
      console.log('💡 Development solutions:');
      console.log('   1. Install and start MongoDB locally: https://docs.mongodb.com/manual/installation/');
      console.log('   2. Use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
      console.log('   3. Update MONGODB_URI in your .env file');
      console.log('⚠️  Server will continue without database (evaluations won\'t be saved)');
    }
  }
};

// Connect to database
connectDB();

// Import routes
const evaluationRoutes = require('./routes/evaluation');
const uploadRoutes = require('./routes/upload');

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Middleware to check database connection
const checkDB = (req, res, next) => {
  if (!isMongoConnected() && (req.path.includes('/history') || req.path.includes('/generate-report'))) {
    return res.status(503).json({
      error: 'Database not available. Please set up MongoDB to use this feature.',
      suggestion: 'Check setup-mongodb.md for installation instructions'
    });
  }
  next();
};

// Routes
app.use('/api/evaluation', checkDB, evaluationRoutes);
app.use('/api/upload', uploadRoutes);

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
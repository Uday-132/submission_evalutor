const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
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

// Enhanced PDF text extraction
async function extractTextFromPDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Enhanced PowerPoint text extraction
async function extractTextFromPPTX(filePath) {
  try {
    // For PPTX files, we'll use a simplified approach
    // In a production environment, you might want to use a more robust library
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('PPTX extraction error:', error);
    
    // Fallback: try to read as text (limited functionality)
    try {
      const buffer = fs.readFileSync(filePath);
      // This is a very basic extraction - in production, use a proper PPTX parser
      const text = buffer.toString('utf8').replace(/[^\x20-\x7E]/g, ' ');
      const cleanText = text.match(/[a-zA-Z0-9\s.,!?;:'"()-]+/g);
      return cleanText ? cleanText.join(' ') : 'Unable to extract text from PowerPoint file';
    } catch (fallbackError) {
      throw new Error('Failed to extract text from PowerPoint file');
    }
  }
}

// Upload and extract text endpoint
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let extractedText = '';
    
    // Extract text based on file type
    if (fileExtension === '.pdf') {
      extractedText = await extractTextFromPDF(filePath);
    } else if (fileExtension === '.pptx' || fileExtension === '.ppt') {
      extractedText = await extractTextFromPPTX(filePath);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'No text could be extracted from the file' });
    }

    // Calculate extraction statistics
    const words = extractedText.split(/\s+/).filter(word => word.length > 0);
    const extractionStats = {
      wordCount: words.length,
      charCount: extractedText.length,
      lineCount: extractedText.split('\n').length
    };

    // Clean up the uploaded file after extraction
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting uploaded file:', err);
    });

    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      extractedText: extractedText,
      extractionStats: extractionStats
    });

  } catch (error) {
    console.error('Upload/extraction error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file after error:', err);
      });
    }
    
    res.status(500).json({ 
      error: error.message || 'Failed to process file' 
    });
  }
});

module.exports = router;
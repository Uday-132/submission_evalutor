const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { formatErrorResponse, getRandomEncouragement } = require('../utils/errorMessages');

const router = express.Router();

// Configure multer (Vercel-compatible)
const storage = process.env.NODE_ENV === 'production' 
  ? multer.memoryStorage() // Use memory storage for Vercel
  : multer.diskStorage({   // Use disk storage for local development
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

// Enhanced PDF text extraction (Vercel-compatible)
async function extractTextFromPDF(fileBuffer, filePath = null) {
  try {
    // Use buffer if available (Vercel), otherwise read from file path (local)
    const dataBuffer = fileBuffer || fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Enhanced PowerPoint text extraction (Vercel-compatible)
async function extractTextFromPPTX(fileBuffer, filePath = null) {
  try {
    // Use buffer if available (Vercel), otherwise use file path (local)
    if (fileBuffer) {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      return result.value;
    } else {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }
  } catch (error) {
    console.error('PPTX extraction error:', error);
    
    // Fallback: try to read as text (limited functionality)
    try {
      const buffer = fileBuffer || fs.readFileSync(filePath);
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
      return res.status(400).json(formatErrorResponse('invalidFileType', 
        "📁 Oops! Looks like your file got lost in cyberspace. Please select a file and try uploading again!", 400));
    }

    const filePath = req.file.path; // Available in local development
    const fileBuffer = req.file.buffer; // Available in Vercel (memory storage)
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let extractedText = '';
    
    // Extract text based on file type (Vercel-compatible)
    if (fileExtension === '.pdf') {
      extractedText = await extractTextFromPDF(fileBuffer, filePath);
    } else if (fileExtension === '.pptx' || fileExtension === '.ppt') {
      extractedText = await extractTextFromPPTX(fileBuffer, filePath);
    } else {
      // Clean up the unsupported file (only if using disk storage)
      if (filePath) {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting unsupported file:', err);
        });
      }
      return res.status(400).json(formatErrorResponse('invalidFileType', 
        `🎭 "${req.file.originalname}" looks interesting, but our AI only speaks PDF and PowerPoint! Please upload a .pdf, .ppt, or .pptx file.`, 400));
    }

    if (!extractedText || extractedText.trim().length === 0) {
      // Clean up the file with no extractable text (only if using disk storage)
      if (filePath) {
        fs.unlink(filePath, (err) => {
          if (err) console.error('Error deleting empty file:', err);
        });
      }
      return res.status(400).json(formatErrorResponse('extractionFailed', 
        `🔍 Your file "${req.file.originalname}" uploaded successfully, but our text detective couldn't find any readable content! Make sure your PDF has selectable text or your PowerPoint has text content.`, 400));
    }

    // Calculate extraction statistics
    const words = extractedText.split(/\s+/).filter(word => word.length > 0);
    const extractionStats = {
      wordCount: words.length,
      charCount: extractedText.length,
      lineCount: extractedText.split('\n').length
    };

    // Clean up the uploaded file after extraction (only if using disk storage)
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });
    }

    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      extractedText: extractedText,
      extractionStats: extractionStats,
      message: `🎉 Successfully extracted ${extractionStats.wordCount} words from "${req.file.originalname}"! Ready for AI evaluation.`,
      encouragement: getRandomEncouragement()
    });

  } catch (error) {
    console.error('Upload/extraction error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file after error:', err);
      });
    }
    
    // 🎭 Handle different error types with personality
    if (error.message.includes('File too large') || error.message.includes('LIMIT_FILE_SIZE')) {
      return res.status(413).json(formatErrorResponse('fileTooBig', null, 413));
    }
    
    if (error.message.includes('Only PDF and PowerPoint files are allowed')) {
      return res.status(400).json(formatErrorResponse('invalidFileType', 
        `🎭 That file type is not on our VIP list! We only accept PDF and PowerPoint files for evaluation.`, 400));
    }
    
    if (error.message.includes('PDF') || error.message.includes('pdf')) {
      return res.status(500).json(formatErrorResponse('extractionFailed', 
        `📄 Our PDF reader had trouble with your file! ${getRandomEncouragement()}`, 500));
    }
    
    if (error.message.includes('PowerPoint') || error.message.includes('PPTX') || error.message.includes('pptx')) {
      return res.status(500).json(formatErrorResponse('extractionFailed', 
        `📊 Our PowerPoint parser encountered a challenge! ${getRandomEncouragement()}`, 500));
    }
    
    // Default fun error
    return res.status(500).json(formatErrorResponse('unexpectedError', 
      `🎪 Something unexpected happened during file processing! ${getRandomEncouragement()}`));
  }
});

module.exports = router;
# 📝 Submission Evaluator: MERN Stack AI Judge

A professional full-stack web application for evaluating innovation submissions, startup pitch decks, hackathon entries, and MSME grant proposals using AI-powered analysis.

## 🎯 Features

### 🚀 **Full-Stack MERN Application**
- **MongoDB**: Persistent storage for evaluations and history
- **Express.js**: Robust REST API backend
- **React**: Modern, responsive frontend with Tailwind CSS
- **Node.js**: High-performance server environment

### 🤖 **AI-Powered Evaluation**
- **Groq LLaMA 3**: Advanced AI analysis and scoring
- **Dynamic Responses**: Each evaluation is unique and tailored
- **Multi-format Support**: PDF and PowerPoint file processing
- **Enhanced Text Extraction**: Comprehensive content parsing

### 📊 **Advanced Analysis Features**
- **Theme Detection**: Automatically identifies domain (FinTech, HealthTech, etc.)
- **Keyword Extraction**: 5-10 core concepts from content
- **Project Title Suggestions**: AI-generated catchy titles
- **Visual Quality Assessment**: Design and structure analysis
- **Pitch Readiness Score**: Investor presentation readiness (1-10)

### 💼 **Professional Features**
- **Evaluation History**: View and manage past evaluations
- **PDF Report Generation**: Downloadable comprehensive reports
- **Real-time Processing**: Live upload and analysis feedback
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📊 Evaluation Criteria

1. **Clarity** (1-10) - Is the idea, problem, and solution clearly explained?
2. **Innovation** (1-10) - How novel, original, or disruptive is the idea?
3. **Feasibility** (1-10) - Is the solution technically and practically implementable?
4. **Presentation Quality** (1-10) - Is the content professional, structured, and engaging?
5. **Impact** (1-10) - What is the expected market, economic, or social impact?
6. **Theme Alignment** (1-10) - How well does it align with competition goals?

**Total Score**: /60 with letter grades (A+ = 55-60, A = 50-54, B = 40-49, C = <40)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Groq API key

### 1. Clone and Install
```bash
# Clone the repository
git clone <repository-url>
cd submission-evaluator-mern

# Install server dependencies
npm install

# Install client dependencies
npm run install-client
```

### 2. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
GROQ_API_KEY=your_groq_api_key_here
MONGODB_URI=mongodb://localhost:27017/submission-evaluator
PORT=5000
```

### 3. Get Groq API Key
- Visit [https://console.groq.com/](https://console.groq.com/)
- Create an account and get your API key
- Add it to your `.env` file

### 4. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env
```

### 5. Run the Application
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
# Server only
npm run server

# Client only (in another terminal)
npm run client
```

### 6. Open in Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Upload your PDF or PPTX file and get instant AI evaluation!

## 🏗️ Project Structure

```
submission-evaluator-mern/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── models/                # MongoDB models
│   └── Evaluation.js      # Evaluation schema
├── routes/                # Express routes
│   ├── upload.js          # File upload & text extraction
│   └── evaluation.js      # AI evaluation & reports
├── uploads/               # Temporary file storage
├── server.js              # Express server
├── package.json           # Server dependencies
├── .env.example           # Environment template
└── README.md
```

## 🔧 API Endpoints

### File Upload
- `POST /api/upload` - Upload and extract text from PDF/PPTX

### Evaluation
- `POST /api/evaluation/evaluate` - Evaluate submission with AI
- `POST /api/evaluation/generate-report` - Generate PDF report
- `GET /api/evaluation/history` - Get evaluation history
- `GET /api/evaluation/:id` - Get specific evaluation

## 🎓 Advanced Evaluation Output

### 📊 Core Evaluation
- **Detailed Scores**: Individual scores for each of 6 criteria (1-10)
- **Total Score**: Combined score out of 60
- **Letter Grade**: A+, A, B, or C based on performance
- **Pitch Readiness Score**: /10 for investor presentation readiness

### 🔍 Advanced Analysis
- **Theme Detection**: Automatically identifies domain (FinTech, HealthTech, etc.)
- **Keyword Extraction**: 5-10 core concepts and buzzwords from content
- **Project Title Suggestion**: AI-generated catchy title (max 10 words)
- **Project Summary**: Concise 2-line description of the core idea
- **Visual Quality Assessment**: Analysis of presentation structure and design

### 💡 Professional Insights
- **Feedback Summary**: 3-line professional evaluation summary
- **Improvement Suggestions**: 3 specific actionable recommendations
- **Resource Recommendations**: 2 relevant tools/frameworks for enhancement
- **Comprehensive PDF Report**: All insights in downloadable format
- **Evaluation History**: Persistent storage and retrieval of past evaluations

## 🛠 Technical Details

### Backend Stack
- **Express.js**: RESTful API server
- **MongoDB**: Document database with Mongoose ODM
- **Multer**: File upload handling
- **pdf-parse**: PDF text extraction
- **mammoth**: PowerPoint text extraction
- **Groq SDK**: AI evaluation integration
- **PDFKit**: PDF report generation

### Frontend Stack
- **React 18**: Modern UI framework
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client for API calls
- **React Dropzone**: Drag-and-drop file uploads
- **React Hot Toast**: User notifications
- **Lucide React**: Beautiful icons

### AI Integration
- **Groq LLaMA 3**: 8B parameter model for evaluation
- **Enhanced JSON Parsing**: Robust response handling
- **Fallback Mechanisms**: Error recovery and defaults
- **Temperature Control**: Consistent evaluation quality

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Run both server and client in development
npm run server       # Run server only
npm run client       # Run client only
npm run build        # Build client for production
npm start           # Run server in production
npm run install-client  # Install client dependencies
```

### Environment Variables
```bash
PORT=5000                    # Server port
NODE_ENV=development         # Environment mode
MONGODB_URI=mongodb://...    # Database connection
GROQ_API_KEY=gsk_...        # Groq AI API key
```

## 🚀 Production Deployment

### Build for Production
```bash
# Build React client
npm run build

# Set environment to production
export NODE_ENV=production

# Start server
npm start
```

### Docker Deployment (Optional)
```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Use Cases

- **🏆 Hackathon Judging**: Standardized evaluation for coding competitions
- **💼 MSME Grant Assessment**: Professional analysis for funding applications
- **🚀 Startup Pitch Evaluation**: Investor-ready presentation scoring
- **📈 Business Plan Review**: Comprehensive feasibility analysis
- **🎓 Academic Project Assessment**: Educational submission evaluation

---

**Ready to evaluate innovative submissions with AI-powered precision!** 🎯

Built with ❤️ using MERN Stack + Groq AI

## 📁 Project Structure

```
submission-evaluator/
├── app.py              # Main Streamlit application
├── requirements.txt    # Python dependencies
├── test_app.py        # Test script
├── .env.example       # Environment variables template
├── .env               # Your API keys (create this)
└── README.md          # This file
```

## 🛠 Technical Details

- **Frontend**: Streamlit for web interface
- **PDF Processing**: PyPDF2 for text extraction
- **PPTX Processing**: python-pptx for PowerPoint files
- **AI Model**: Groq's LLaMA 3 8B for evaluation
- **Report Generation**: ReportLab for PDF reports

## 📋 Usage Instructions

1. **Upload File**: Choose a PDF or PPTX submission file
2. **Extract Content**: App automatically extracts text content
3. **AI Evaluation**: Click "Evaluate Submission" for AI analysis
4. **View Results**: See scores, grade, and detailed feedback
5. **Download Report**: Generate professional PDF report

## 🎓 Advanced Evaluation Output

The system provides comprehensive analysis including:

### 📊 Core Evaluation
- **Detailed Scores**: Individual scores for each of 6 criteria (1-10)
- **Total Score**: Combined score out of 60
- **Letter Grade**: A+, A, B, or C based on performance
- **Pitch Readiness Score**: /10 for investor presentation readiness

### 🔍 Advanced Analysis
- **Theme Detection**: Automatically identifies domain (FinTech, HealthTech, etc.)
- **Keyword Extraction**: 5-10 core concepts and buzzwords from content
- **Project Title Suggestion**: AI-generated catchy title (max 10 words)
- **Project Summary**: Concise 2-line description of the core idea
- **Visual Quality Assessment**: Analysis of presentation structure and design

### 💡 Professional Insights
- **Feedback Summary**: 3-line professional evaluation summary
- **Improvement Suggestions**: 3 specific actionable recommendations
- **Resource Recommendations**: 2 relevant tools/frameworks for enhancement
- **Comprehensive PDF Report**: All insights in downloadable format

## 🔧 Troubleshooting

### Common Issues:

1. **API Key Error**: Make sure your Groq API key is correctly set
2. **File Upload Issues**: Ensure files are valid PDF or PPTX format
3. **Text Extraction Fails**: Some PDFs may have image-based text (OCR needed)
4. **Dependency Conflicts**: Use a virtual environment for clean installation

### Windows-Specific Notes:
- PyPDF2 is used instead of PyMuPDF for better Windows compatibility
- No Visual Studio Build Tools required

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the evaluator!

## 📄 License

This project is open source and available under the MIT License.

---

**Ready to evaluate some innovative submissions!** 🎯
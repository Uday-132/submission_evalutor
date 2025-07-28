import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const FileUpload = ({ onFileExtracted, setLoading }) => {
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [extractionStats, setExtractionStats] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-powerpoint'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload only PDF or PowerPoint files');
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setUploadStatus('uploading');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          // You can use this for a progress bar if needed
          console.log(`Upload progress: ${Math.round((progressEvent.loaded * 100) / progressEvent.total)}%`);
        },
      });

      if (response.data.success) {
        setUploadStatus('success');
        setExtractionStats(response.data.extractionStats);
        toast.success('File uploaded and text extracted successfully!');

        // Basic content validation before passing to evaluation
        const extractedText = response.data.extractedText;
        const wordCount = extractedText.split(/\s+/).length;
        
        // Check if content seems too short or doesn't contain presentation-like keywords
        const presentationKeywords = ['slide', 'presentation', 'problem', 'solution', 'market', 'business', 'startup', 'proposal', 'pitch', 'project', 'innovation', 'technology', 'product', 'service', 'customer', 'revenue', 'team', 'strategy'];
        const hasKeywords = presentationKeywords.some(keyword => 
          extractedText.toLowerCase().includes(keyword)
        );
        
        if (wordCount < 50) {
          toast.error('⚠️ The extracted content seems too short. Please ensure your document contains substantial presentation content.', {
            duration: 5000
          });
        } else if (!hasKeywords && wordCount < 200) {
          toast.error('⚠️ This document may not be a presentation or pitch deck. Please upload a proper business presentation with slides and project content.', {
            duration: 6000,
            style: {
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              color: '#92400E',
              border: '2px solid #F59E0B',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(245, 158, 11, 0.2)'
            }
          });
        }
        
        // Pass the extracted data to parent component
        onFileExtracted(response.data);
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');

      const errorMessage = error.response?.data?.error || error.message || 'Failed to upload file';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [onFileExtracted, setLoading]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt']
    },
    multiple: false,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Upload Area */}
      <div className="mb-8">
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${uploadStatus === 'uploading' ? 'pointer-events-none opacity-50' : ''
            }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center space-y-4">
            {uploadStatus === 'uploading' ? (
              <>
                <div className="spinner w-12 h-12 border-4 border-blue-600 dark:border-blue-400"></div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                  Uploading and extracting content...
                </p>
              </>
            ) : uploadStatus === 'success' ? (
              <>
                <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                <p className="text-lg font-medium text-emerald-700 dark:text-emerald-300">
                  File uploaded successfully!
                </p>
              </>
            ) : uploadStatus === 'error' ? (
              <>
                <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
                <p className="text-lg font-medium text-red-700 dark:text-red-300">
                  Upload failed. Please try again.
                </p>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
                    {isDragActive
                      ? 'Drop your file here...'
                      : 'Drag & drop your submission file here'}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    or click to browse files
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* File Requirements */}
        <div className="mt-4 text-center">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 mb-4 shadow-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📋 Upload Requirements</h4>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <p><strong>Document Types:</strong> Business presentations, pitch decks, startup proposals</p>
              <p><strong>Formats:</strong> PDF, PowerPoint (.pptx, .ppt)</p>
              <p><strong>Max Size:</strong> 50MB</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-200 dark:border-amber-700 rounded-xl p-3 shadow-lg">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              ⚠️ <strong>Note:</strong> Regular documents, research papers, or non-presentation content will be rejected.
              Please ensure your file contains slide-based business content.
            </p>
          </div>
        </div>
      </div>

      {/* Extraction Statistics */}
      {extractionStats && (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Content Extraction Statistics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700 shadow-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {extractionStats.wordCount?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Words</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700 shadow-lg">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {extractionStats.charCount?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300">Characters</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700 shadow-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {extractionStats.lineCount?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Lines</div>
            </div>
          </div>
        </div>
      )}

      {/* Features Overview */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
          <span className="text-2xl mr-2">🎯</span>
          What You'll Get
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
              <span className="mr-2">📊</span>Core Evaluation
            </h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• 6 detailed criteria scores (1-10)</li>
              <li>• Total score out of 60</li>
              <li>• Letter grade (A+ to C)</li>
              <li>• Pitch readiness assessment</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-700">
            <h4 className="font-medium text-emerald-900 dark:text-emerald-100 mb-2 flex items-center">
              <span className="mr-2">🔍</span>Advanced Analysis
            </h4>
            <ul className="text-sm text-emerald-700 dark:text-emerald-300 space-y-1">
              <li>• Theme/domain detection</li>
              <li>• Keyword extraction</li>
              <li>• Project title suggestions</li>
              <li>• Visual quality assessment</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
            <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2 flex items-center">
              <span className="mr-2">💡</span>Professional Insights
            </h4>
            <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
              <li>• Detailed feedback summary</li>
              <li>• 3 improvement suggestions</li>
              <li>• Resource recommendations</li>
              <li>• Downloadable PDF report</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
            <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2 flex items-center">
              <span className="mr-2">🤖</span>AI-Powered
            </h4>
            <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
              <li>• Groq LLaMA 3 analysis</li>
              <li>• Dynamic, not static responses</li>
              <li>• Unbiased professional evaluation</li>
              <li>• Tailored to your content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Lightbulb, 
  BarChart3, 
  MessageSquare, 
  Wrench, 
  BookOpen, 
  Download,
  Eye,
  Rocket,
  Palette
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const EvaluationResults = ({ extractedData, evaluationData, onEvaluationComplete, setLoading }) => {
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [evaluation, setEvaluation] = useState(evaluationData);

  useEffect(() => {
    if (!evaluation && extractedData) {
      evaluateSubmission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractedData, evaluation]);

  const evaluateSubmission = async () => {
    setLoading(true);
    
    try {
      const response = await axios.post('/api/evaluation/evaluate', {
        extractedText: extractedData.extractedText,
        filename: extractedData.filename,
        originalName: extractedData.originalName,
        extractionStats: extractedData.extractionStats
      });

      if (response.data.success) {
        setEvaluation(response.data.evaluation);
        onEvaluationComplete(response.data.evaluation);
        toast.success('Evaluation completed successfully!');
      } else {
        throw new Error(response.data.error || 'Evaluation failed');
      }

    } catch (error) {
      console.error('Evaluation error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to evaluate submission';
      
      // Check if it's a presentation validation error
      if (errorMessage.includes('INVALID_CONTENT_TYPE') || errorMessage.includes('does not appear to be a presentation')) {
        toast.error(
          <div className="space-y-2">
            <div className="font-bold text-amber-900 dark:text-amber-100">⚠️ Invalid Document Type</div>
            <div className="text-sm text-amber-800 dark:text-amber-200">
              This document doesn't appear to be a presentation or pitch deck.
            </div>
            <div className="text-xs text-amber-700 dark:text-amber-300 mt-2">
              <strong>Please upload:</strong><br/>
              • Business presentations<br/>
              • Pitch decks<br/>
              • Startup proposals<br/>
              • MSME applications<br/>
              • Hackathon submissions
            </div>
          </div>,
          {
            duration: 8000,
            style: {
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              color: '#92400E',
              border: '2px solid #F59E0B',
              borderRadius: '12px',
              padding: '16px',
              maxWidth: '400px',
              boxShadow: '0 20px 40px rgba(245, 158, 11, 0.3)'
            }
          }
        );
      } else {
        toast.error(errorMessage, {
          style: {
            background: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)',
            color: '#991B1B',
            border: '2px solid #EF4444',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(239, 68, 68, 0.2)'
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!evaluation) return;

    try {
      const response = await axios.post('/api/evaluation/generate-report', {
        evaluationId: evaluation._id
      }, {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `evaluation_report_${evaluation.originalName.split('.')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Report downloaded successfully!');

    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report');
    }
  };



  if (!extractedData) {
    return <div>No data available</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
          📊 Evaluation Results
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          AI-powered analysis of: <span className="font-medium text-gray-900 dark:text-gray-100">{extractedData.originalName}</span>
        </p>
      </div>

      {/* Extracted Content Preview */}
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <Eye className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
            Extracted Content Preview
          </h3>
          <button
            onClick={() => setShowExtractedText(!showExtractedText)}
            className="bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 hover:from-gray-700 hover:to-gray-800 dark:hover:from-gray-400 dark:hover:to-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg text-sm"
          >
            {showExtractedText ? 'Hide' : 'Show'} Full Text
          </button>
        </div>

        {/* Extraction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700 shadow-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {extractedData.extractionStats?.wordCount?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Words</div>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700 shadow-lg">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {extractedData.extractionStats?.charCount?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">Characters</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700 shadow-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {extractedData.extractionStats?.lineCount?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300">Lines</div>
          </div>
        </div>

        {showExtractedText && (
          <div className="mt-4">
            <textarea
              value={extractedData.extractedText}
              readOnly
              className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder="Extracted text will appear here..."
            />
          </div>
        )}
      </div>

      {/* Evaluation Results */}
      {evaluation ? (
        <>
          {/* Advanced Analysis */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <Target className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Advanced Analysis
            </h3>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700 shadow-lg">
                <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">Theme/Domain</div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{evaluation.theme}</div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700 shadow-lg">
                <div className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">Total Score</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{evaluation.totalScore}/60</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700 shadow-lg">
                <div className="text-lg font-semibold text-purple-900 dark:text-purple-100">Pitch Readiness</div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{evaluation.pitchReadinessScore}/10</div>
              </div>
            </div>

            {/* Project Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-600 dark:text-yellow-400" />
                  Suggested Project Title
                </h4>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                  <p className="text-blue-900 dark:text-blue-100 font-medium">{evaluation.projectTitle}</p>
                </div>
                
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-4">Project Summary</h4>
                <p className="text-gray-700 dark:text-gray-300">{evaluation.projectSummary}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Top Keywords</h4>
                <div className="flex flex-wrap">
                  {evaluation.keywords?.map((keyword, index) => (
                    <span key={index} className="inline-block bg-gradient-to-r from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 text-indigo-800 dark:text-indigo-200 text-sm px-3 py-1 rounded-full mr-2 mb-2 border border-indigo-300 dark:border-indigo-600">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Scores */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <BarChart3 className="h-6 w-6 mr-2 text-indigo-600 dark:text-indigo-400" />
              Detailed Evaluation Scores
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { name: 'Clarity', score: evaluation.scores.clarity, color: 'blue' },
                  { name: 'Innovation', score: evaluation.scores.innovation, color: 'purple' },
                  { name: 'Feasibility', score: evaluation.scores.feasibility, color: 'emerald' }
                ].map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm font-medium text-${item.color}-700 dark:text-${item.color}-300`}>{item.name}</span>
                      <span className={`text-sm font-bold text-${item.color}-900 dark:text-${item.color}-100`}>{item.score}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-${item.color}-400 to-${item.color}-600`}
                        style={{ width: `${(item.score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  { name: 'Presentation Quality', score: evaluation.scores.presentation, color: 'orange' },
                  { name: 'Impact', score: evaluation.scores.impact, color: 'red' },
                  { name: 'Theme Alignment', score: evaluation.scores.theme_alignment, color: 'indigo' }
                ].map((item, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm font-medium text-${item.color}-700 dark:text-${item.color}-300`}>{item.name}</span>
                      <span className={`text-sm font-bold text-${item.color}-900 dark:text-${item.color}-100`}>{item.score}/10</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-${item.color}-400 to-${item.color}-600`}
                        style={{ width: `${(item.score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade */}
            <div className="mt-6 text-center">
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold shadow-lg ${
                evaluation.grade === 'A+' || evaluation.grade === 'A' 
                  ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-600'
                  : evaluation.grade === 'B'
                  ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-600'
                  : 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-600'
              }`}>
                🏅 Grade: {evaluation.grade}
              </div>
            </div>
          </div>

          {/* Visual Quality Assessment */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Palette className="h-5 w-5 mr-2 text-pink-600 dark:text-pink-400" />
              Visual Quality Assessment
            </h3>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-4 rounded-lg border border-pink-200 dark:border-pink-700">
              <p className="text-pink-900 dark:text-pink-100">{evaluation.visualQualityComment}</p>
            </div>
          </div>

          {/* Feedback and Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Professional Feedback */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Professional Feedback
              </h3>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-blue-900 dark:text-blue-100">{evaluation.feedbackSummary}</p>
              </div>
            </div>

            {/* Pitch Readiness */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Rocket className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                Pitch Readiness
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {evaluation.pitchReadinessScore}/10
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-2">
                  <div 
                    className="h-3 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-purple-400 to-purple-600"
                    style={{ width: `${(evaluation.pitchReadinessScore / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Readiness for investor/jury presentation
                </p>
              </div>
            </div>
          </div>

          {/* Improvement Suggestions and Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Wrench className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
                Improvement Suggestions
              </h3>
              <ul className="space-y-3">
                {evaluation.improvementSuggestions?.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 text-orange-600 dark:text-orange-200 rounded-full flex items-center justify-center text-sm font-medium mr-3 border border-orange-300 dark:border-orange-600">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
                Recommended Resources
              </h3>
              <ul className="space-y-3">
                {evaluation.recommendedResources?.map((resource, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 text-emerald-600 dark:text-emerald-200 rounded-full flex items-center justify-center text-sm font-medium mr-3 border border-emerald-300 dark:border-emerald-600">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Download Report */}
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center justify-center">
              <span className="text-2xl mr-2">📥</span>
              Export Report
            </h3>
            <button
              onClick={downloadReport}
              className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-500 dark:to-emerald-600 hover:from-emerald-700 hover:to-emerald-800 dark:hover:from-emerald-400 dark:hover:to-emerald-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg flex items-center space-x-2 mx-auto"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF Report</span>
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="spinner w-12 h-12 border-4 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            🧠 AI is evaluating your submission...
          </h3>
          <p className="text-gray-600">
            This may take a few moments. Please wait while we analyze your content.
          </p>
        </div>
      )}
    </div>
  );
};

export default EvaluationResults;
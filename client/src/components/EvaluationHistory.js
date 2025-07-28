import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Target, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const EvaluationHistory = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  useEffect(() => {
    fetchEvaluationHistory();
  }, []);

  const fetchEvaluationHistory = async () => {
    try {
      const response = await axios.get('/api/evaluation/history');
      
      if (response.data.success) {
        setEvaluations(response.data.evaluations);
      } else {
        throw new Error(response.data.error || 'Failed to fetch history');
      }
    } catch (error) {
      console.error('History fetch error:', error);
      toast.error('Failed to load evaluation history');
    } finally {
      setLoading(false);
    }
  };

  const viewEvaluation = async (evaluationId) => {
    try {
      const response = await axios.get(`/api/evaluation/${evaluationId}`);
      
      if (response.data.success) {
        setSelectedEvaluation(response.data.evaluation);
      } else {
        throw new Error(response.data.error || 'Failed to fetch evaluation');
      }
    } catch (error) {
      console.error('Evaluation fetch error:', error);
      toast.error('Failed to load evaluation details');
    }
  };

  const downloadReport = async (evaluationId, filename) => {
    try {
      const response = await axios.post('/api/evaluation/generate-report', {
        evaluationId: evaluationId
      }, {
        responseType: 'blob'
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `evaluation_report_${filename.split('.')[0]}.pdf`);
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

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B':
        return 'text-yellow-600 bg-yellow-100';
      case 'C':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="spinner w-12 h-12 border-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading evaluation history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📚 Evaluation History
        </h1>
        <p className="text-gray-600">
          View and download your previous submission evaluations
        </p>
      </div>

      {evaluations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Evaluations Yet
          </h3>
          <p className="text-gray-600">
            Upload your first submission to see evaluation history here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {evaluations.map((evaluation) => (
            <div key={evaluation._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {evaluation.originalName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(evaluation.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {evaluation.theme}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {evaluation.totalScore}/60
                    </div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(evaluation.grade)}`}>
                      Grade: {evaluation.grade}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {evaluation.scores.clarity}/10
                  </div>
                  <div className="text-xs text-gray-600">Clarity</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">
                    {evaluation.scores.innovation}/10
                  </div>
                  <div className="text-xs text-gray-600">Innovation</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">
                    {evaluation.pitchReadinessScore}/10
                  </div>
                  <div className="text-xs text-gray-600">Pitch Ready</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-orange-600">
                    {evaluation.keywords?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600">Keywords</div>
                </div>
              </div>

              {/* Project Title */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-1">Suggested Title:</h4>
                <p className="text-gray-900 font-medium">{evaluation.projectTitle}</p>
              </div>

              {/* Keywords */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Keywords:</h4>
                <div className="flex flex-wrap">
                  {evaluation.keywords?.slice(0, 5).map((keyword, index) => (
                    <span key={index} className="keyword-tag text-xs">
                      {keyword}
                    </span>
                  ))}
                  {evaluation.keywords?.length > 5 && (
                    <span className="text-xs text-gray-500">
                      +{evaluation.keywords.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  {evaluation.extractionStats?.wordCount?.toLocaleString() || 0} words extracted
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => viewEvaluation(evaluation._id)}
                    className="btn-secondary text-sm flex items-center space-x-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  
                  <button
                    onClick={() => downloadReport(evaluation._id, evaluation.originalName)}
                    className="btn-primary text-sm flex items-center space-x-1"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed View Modal */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Evaluation Details
                </h2>
                <button
                  onClick={() => setSelectedEvaluation(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Detailed content would go here - similar to EvaluationResults component */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Project Summary</h3>
                  <p className="text-gray-700">{selectedEvaluation.projectSummary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Feedback Summary</h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-900">{selectedEvaluation.feedbackSummary}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Improvement Suggestions</h3>
                  <ul className="space-y-2">
                    {selectedEvaluation.improvementSuggestions?.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setSelectedEvaluation(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => downloadReport(selectedEvaluation._id, selectedEvaluation.originalName)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluationHistory;
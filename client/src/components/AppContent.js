import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import Header from './Header';
import FileUpload from './FileUpload';
import EvaluationResults from './EvaluationResults';
import LoadingSpinner from './LoadingSpinner';
import Particles from './Particles';

function AppContent() {
  const { isDark } = useTheme();
  const [currentView, setCurrentView] = useState('upload');
  const [extractedData, setExtractedData] = useState(null);
  const [evaluationData, setEvaluationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Initial page load effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2500); // Show loader for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleFileExtracted = (data) => {
    setExtractedData(data);
    setCurrentView('results');
  };

  const handleEvaluationComplete = (data) => {
    setEvaluationData(data);
  };

  const handleNewEvaluation = () => {
    setExtractedData(null);
    setEvaluationData(null);
    setCurrentView('upload');
  };

  const handleBackToUpload = () => {
    setCurrentView('upload');
  };

  // Show initial loading screen with Galaxy background
  if (initialLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Particles Background */}
        <div className="absolute inset-0 z-0">
          <Particles
            particleCount={1000}
            particleSpread={15}
            speed={2}
            particleColors={isDark ? ["#60A5FA", "#A78BFA", "#34D399"] : ["#3B82F6", "#8B5CF6", "#10B981"]}
            moveParticlesOnHover={true}
            particleHoverFactor={3}
            alphaParticles={false}
            particleBaseSize={80}
            sizeRandomness={1.5}
            cameraDistance={25}
            disableRotation={false}
          />
        </div>
        
        {/* Loading Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            {/* Hamster Wheel Loader */}
            <div className="flex justify-center mb-8">
              <div className="hamster-loader">
                <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
                  <div className="wheel"></div>
                  <div className="hamster">
                    <div className="hamster__body">
                      <div className="hamster__head">
                        <div className="hamster__ear"></div>
                        <div className="hamster__eye"></div>
                        <div className="hamster__nose"></div>
                      </div>
                      <div className="hamster__limb hamster__limb--fr"></div>
                      <div className="hamster__limb hamster__limb--fl"></div>
                      <div className="hamster__limb hamster__limb--br"></div>
                      <div className="hamster__limb hamster__limb--bl"></div>
                      <div className="hamster__tail"></div>
                    </div>
                  </div>
                  <div className="spoke"></div>
                </div>
              </div>
            </div>
            
            {/* Loading Text with backdrop */}
            <div className="bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-700/50">
              <h1 className="text-4xl font-bold gradient-text mb-4 animate-pulse">
                📝 Submission Evaluator
              </h1>
              <p className="text-xl text-gray-800 dark:text-gray-200 mb-6">
                Loading your AI-powered evaluation platform...
              </p>
              
              {/* Progress dots */}
              <div className="flex justify-center space-x-2">
                <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={1000}
          particleSpread={12}
          speed={2}
          particleColors={isDark ? ["#60A5FA", "#A78BFA", "#34D399", "#F59E0B"] : ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B"]}
          moveParticlesOnHover={true}
          particleHoverFactor={3}
          alphaParticles={false}
          particleBaseSize={60}
          sizeRandomness={1.2}
          cameraDistance={20}
          disableRotation={false}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-white/5 to-blue-50/10 dark:from-gray-900/20 dark:to-gray-800/30 backdrop-blur-[1px]">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              color: isDark ? '#F9FAFB' : '#111827',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(10px)',
              border: isDark ? '1px solid rgba(75, 85, 99, 0.3)' : '1px solid rgba(229, 231, 235, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#FFFFFF',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#FFFFFF',
              },
            },
          }}
        />
        
        <Header 
          currentView={currentView}
          onNewEvaluation={handleNewEvaluation}
          onBackToUpload={handleBackToUpload}
        />

        <main className="container mx-auto px-4 py-8 relative">
          {loading && <LoadingSpinner />}
          
          {currentView === 'upload' && (
            <div className="fade-in relative z-10">
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold gradient-text mb-6 scale-in drop-shadow-lg">
                  📝 Submission Evaluator
                </h1>
                <p className="text-2xl text-gray-700 dark:text-gray-200 mb-4 slide-in-left drop-shadow-md">
                  MSME/Hackathon AI Judge
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-lg slide-in-right drop-shadow-sm">
                  Upload your PDF or PowerPoint submission for professional AI evaluation
                </p>
                
                {/* Feature highlights */}
                <div className="flex justify-center items-center space-x-8 mt-8 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center space-x-2 bounce-in bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full px-3 py-1" style={{ animationDelay: '0.2s' }}>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center space-x-2 bounce-in bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full px-3 py-1" style={{ animationDelay: '0.4s' }}>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Real-time Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 bounce-in bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full px-3 py-1" style={{ animationDelay: '0.6s' }}>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>Professional Reports</span>
                  </div>
                </div>
              </div>
              
              <FileUpload 
                onFileExtracted={handleFileExtracted}
                setLoading={setLoading}
              />
            </div>
          )}

          {currentView === 'results' && extractedData && (
            <div className="fade-in relative z-10">
              <EvaluationResults 
                extractedData={extractedData}
                evaluationData={evaluationData}
                onEvaluationComplete={handleEvaluationComplete}
                setLoading={setLoading}
              />
            </div>
          )}


        </main>

        <footer className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-t border-white/30 dark:border-gray-700/50 mt-16 transition-all duration-300">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <div className="flex justify-center items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">SE</span>
                </div>
                <span className="text-lg font-semibold gradient-text">Submission Evaluator</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                © 2025 Submission Evaluator 
              </p>
              <div className="flex justify-center items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>System Operational</span>
                </span>
                <span>•</span>
                <span>Built with ❤️ using React & Node.js</span>
                <span>•</span>
                <span>AI Analysis by Groq</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AppContent;
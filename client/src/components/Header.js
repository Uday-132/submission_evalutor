import React from 'react';
import { FileText, Upload, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ currentView, onNewEvaluation, onViewHistory, onBackToUpload }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 slide-in-left">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  Submission Evaluator
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  AI-Powered Analysis
                </p>
              </div>
            </div>
          </div>

          {/* Navigation and Controls */}
          <nav className="flex items-center space-x-2 slide-in-right">
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button
                onClick={onBackToUpload}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  currentView === 'upload'
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700'
                }`}
              >
                <Upload className="h-4 w-4" />
                <span className="font-medium">Upload</span>
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="relative p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 group"
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
              <div className="relative w-5 h-5">
                <Sun className={`absolute inset-0 h-5 w-5 text-yellow-500 transition-all duration-500 ${
                  isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`} />
                <Moon className={`absolute inset-0 h-5 w-5 text-blue-400 transition-all duration-500 ${
                  isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`} />
              </div>
            </button>

            {/* New Evaluation Button */}
            {currentView === 'results' && (
              <button
                onClick={onNewEvaluation}
                className="btn-primary flex items-center space-x-2 ml-2 bounce-in"
              >
                <Upload className="h-4 w-4" />
                <span>New Evaluation</span>
              </button>
            )}
          </nav>
        </div>

        {/* Status Bar */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </span>
            <span></span>
          </div>
          <div className="flex items-center space-x-2">
            <span>{isDark ? '🌙' : '☀️'} {isDark ? 'Dark' : 'Light'} Mode</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
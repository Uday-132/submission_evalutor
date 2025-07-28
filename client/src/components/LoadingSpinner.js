import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

const LoadingSpinner = ({ message = "AI is Processing...", subtitle = "Please wait while we analyze your submission" }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl border border-gray-200 dark:border-gray-700 scale-in">
        {/* Hamster Wheel Loader */}
        <div className="flex justify-center mb-6 relative">
          <div className="hamster-loader scale-75">
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
          {/* Decorative elements */}
          <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-2 -right-2 animate-bounce" />
          <Zap className="h-4 w-4 text-purple-500 absolute -bottom-1 -left-1 animate-pulse" />
        </div>

        {/* Title with gradient */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
          {message}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
          {subtitle}
        </p>

        {/* Enhanced loading animation */}
        <div className="flex justify-center items-center space-x-2 mb-4">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar mb-4">
          <div className="progress-fill"></div>
        </div>

        {/* Status text */}
        <div className="text-xs text-gray-500 dark:text-gray-400 animate-pulse">
          Powered by Groq AI • LLaMA 3
        </div>
      </div>
    </div>
  );
};

// Mini loading component for buttons
export const ButtonSpinner = ({ size = "sm" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  return (
    <div className={`spinner ${sizeClasses[size]} border-2 border-current border-t-transparent`}></div>
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
};

// Card loading placeholder
export const CardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
      <SkeletonLoader lines={3} />
    </div>
  );
};

export default LoadingSpinner;
import React, { useState } from 'react';
import ModelLoadingConsole from '../components/ModelLoadingConsole';
import DemoNavigation from '../components/DemoNavigation';

const ModelLoadingDemo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showConsole, setShowConsole] = useState(true);
  
  const handleLoadingComplete = () => {
    // Allow some time to see the completed state
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };
  
  const restartLoading = () => {
    setIsLoading(true);
    setShowConsole(true);
    // Force component remount to restart loading simulation
    setTimeout(() => {
      const element = document.getElementById('loading-console-container');
      if (element) {
        element.style.opacity = '0';
        setTimeout(() => {
          element.style.opacity = '1';
        }, 50);
      }
    }, 50);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <DemoNavigation currentPath="/model-loading" />
      
      <div className="w-full max-w-3xl mb-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">3D Model Loading</h1>
          <div className="space-x-3">
            <button
              onClick={restartLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              Restart Loading
            </button>
            <button
              onClick={() => setShowConsole(!showConsole)}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
            >
              {showConsole ? 'Hide Console' : 'Show Console'}
            </button>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Robot Model Status</h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">Base Unit</h3>
              <div className={`text-sm ${isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                {isLoading ? 'Loading...' : 'Ready'}
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">Robotic Arm</h3>
              <div className={`text-sm ${isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                {isLoading ? 'Loading...' : 'Ready'}
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">Head Module</h3>
              <div className={`text-sm ${isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                {isLoading ? 'Loading...' : 'Ready'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-2">System Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">WebGL</span>
              <span className="text-green-400">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Scene</span>
              <span className={isLoading ? 'text-yellow-400' : 'text-green-400'}>
                {isLoading ? 'Initializing' : 'Ready'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Physics Engine</span>
              <span className={isLoading ? 'text-yellow-400' : 'text-green-400'}>
                {isLoading ? 'Initializing' : 'Active'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Memory Usage</span>
              <span className="text-blue-400">256MB / 2GB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Render FPS</span>
              <span className={isLoading ? 'text-gray-400' : 'text-green-400'}>
                {isLoading ? '--' : '60'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {showConsole && (
        <div id="loading-console-container" className="w-full max-w-3xl mb-8 transition-opacity duration-200">
          <ModelLoadingConsole onLoadingComplete={handleLoadingComplete} />
        </div>
      )}
      
      <div className="text-gray-500 text-sm mt-4">
        {isLoading 
          ? "Loading robot model components. Please wait..." 
          : "All robot model components loaded successfully. Ready for interaction."}
      </div>
    </div>
  );
};

export default ModelLoadingDemo; 
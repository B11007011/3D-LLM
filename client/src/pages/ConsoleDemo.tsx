import React, { useState } from 'react';
import Console from '../components/Console';
import DemoNavigation from '../components/DemoNavigation';

const ConsoleDemo: React.FC = () => {
  const [showConsole, setShowConsole] = useState(true);

  return (
    <div className="min-h-screen bg-gray-800 p-8 flex flex-col items-center justify-center">
      <DemoNavigation currentPath="/console" />
      
      <div className="w-full max-w-3xl mb-8 mt-16">
        <h1 className="text-3xl font-bold text-white mb-4">3D-LLM Project Console</h1>
        <p className="text-gray-300 mb-6">
          This console displays real-time information about 3D model loading and rendering processes.
        </p>
        
        <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setShowConsole(!showConsole)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {showConsole ? 'Hide Console' : 'Show Console'}
          </button>
          
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Reload Scene
          </button>
        </div>
      </div>
      
      {showConsole && (
        <div className="w-full max-w-3xl">
          <Console onClose={() => setShowConsole(false)} />
        </div>
      )}
      
      <div className="mt-8 text-gray-400 text-sm">
        <p>Press F12 to view browser's developer console for more detailed information.</p>
      </div>
    </div>
  );
};

export default ConsoleDemo; 
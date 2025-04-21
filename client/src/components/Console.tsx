import React, { useState, useEffect, useRef } from 'react';

interface ConsoleProps {
  onClose?: () => void;
  showControls?: boolean;
}

const Console: React.FC<ConsoleProps> = ({ onClose, showControls = true }) => {
  const [consoleLines, setConsoleLines] = useState<{ text: string; type: 'info' | 'success' | 'warning' | 'error' | 'debug' }[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  // Simulate console output for 3D application
  useEffect(() => {
    const messages = [
      { text: "Initializing Three.js renderer...", type: 'info' },
      { text: "WebGL 2.0 context created successfully", type: 'success' },
      { text: "Initializing scene with default lighting", type: 'info' },
      { text: "Loading model assets...", type: 'info' },
      { text: "Loading robot_base.json (324kb)", type: 'debug' },
      { text: "Base model loaded successfully (458 vertices, 312 faces)", type: 'success' },
      { text: "Loading robot_arm.json (652kb)", type: 'debug' },
      { text: "Arm model loaded successfully (1024 vertices, 876 faces)", type: 'success' },
      { text: "Loading robot_head.json (528kb)", type: 'debug' },
      { text: "Head model loaded successfully (862 vertices, 704 faces)", type: 'success' },
      { text: "Applying PBR materials...", type: 'info' },
      { text: "Configuring shadow maps (resolution: 2048)", type: 'debug' },
      { text: "Initializing physics constraints for robotic joints", type: 'info' },
      { text: "Setting up OrbitControls", type: 'debug' },
      { text: "Scene initialization complete", type: 'success' },
      { text: "Ready for interaction", type: 'success' },
    ];

    // Add messages with delay to simulate real-time loading
    let delay = 0;
    const timeouts: NodeJS.Timeout[] = [];
    
    messages.forEach((message, index) => {
      const timeout = setTimeout(() => {
        setConsoleLines(prev => [...prev, message as any]);
        if (consoleRef.current) {
          consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
        }
      }, delay);
      
      timeouts.push(timeout);
      
      // Add varying delays to make it look more realistic
      if (message.text.includes("Loading")) {
        delay += 300;
      } else if (message.text.includes("model loaded")) {
        delay += 500;
      } else {
        delay += 200;
      }
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  return (
    <div className="bg-gray-900 text-gray-200 rounded-lg shadow-lg w-full max-w-3xl h-64 flex flex-col">
      {showControls && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
          <span className="font-mono text-sm">Console</span>
          <div className="flex space-x-2">
            <button 
              className="hover:bg-gray-700 p-1 rounded"
              onClick={() => setConsoleLines([])}
              title="Clear console"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            {onClose && (
              <button 
                className="hover:bg-gray-700 p-1 rounded"
                onClick={onClose}
                title="Close console"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
      <div 
        ref={consoleRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-sm"
        style={{ maxHeight: "calc(100% - 40px)" }}
      >
        {consoleLines.map((line, index) => (
          <div key={index} className={`mb-1 ${getLineColor(line.type)}`}>
            <span className="mr-2">
              {getLinePrefix(line.type)}
            </span>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper functions for console formatting
function getLineColor(type: string) {
  switch (type) {
    case 'success': return 'text-green-400';
    case 'error': return 'text-red-400';
    case 'warning': return 'text-yellow-400';
    case 'debug': return 'text-gray-400';
    default: return 'text-blue-400';
  }
}

function getLinePrefix(type: string) {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✗';
    case 'warning': return '⚠';
    case 'debug': return '●';
    default: return '>';
  }
}

export default Console; 
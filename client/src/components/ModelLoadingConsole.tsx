import React, { useState, useEffect, useRef } from 'react';

interface ModelLoadingConsoleProps {
  autoClose?: boolean;
  onLoadingComplete?: () => void;
}

const ModelLoadingConsole: React.FC<ModelLoadingConsoleProps> = ({ 
  autoClose = false,
  onLoadingComplete
}) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState<{[key: string]: number}>({
    'robot_base.json': 0,
    'robot_arm.json': 0,
    'robot_head.json': 0,
  });
  const [isComplete, setIsComplete] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);
  
  // Format timestamp for log entries
  const getTimestamp = () => {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}]`;
  };
  
  // Add log entry with timestamp
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${getTimestamp()} ${message}`]);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      }
    }, 10);
  };
  
  // Simulate the loading process
  useEffect(() => {
    let mounted = true;
    
    const simulateLoading = async () => {
      // System initialization logs
      addLog("Initializing WebGL context...");
      await sleep(500);
      addLog("WebGL 2.0 context created");
      addLog("Hardware acceleration: enabled");
      addLog("Shader version: GLSL ES 3.00");
      await sleep(300);
      addLog("Memory allocation: 512MB");
      addLog("Setting up scene graph");
      await sleep(400);
      addLog("Three.js v0.157.0 initialized");
      await sleep(300);
      
      // Model loading
      addLog("Starting model assets download...");
      await sleep(500);
      
      // Load robot_base.json with progress updates
      addLog("Fetching robot_base.json (324kb)");
      await simulateProgressiveLoading('robot_base.json', 324, 900);
      if (!mounted) return;
      addLog("➤ Base model successfully decoded");
      addLog("➤ Base model vertices: 458, faces: 312, materials: 3");
      await sleep(200);
      
      // Load robot_arm.json with progress updates
      addLog("Fetching robot_arm.json (652kb)");
      await simulateProgressiveLoading('robot_arm.json', 652, 1200);
      if (!mounted) return;
      addLog("➤ Arm model successfully decoded");
      addLog("➤ Arm model vertices: 1024, faces: 876, materials: 5");
      addLog("➤ Joint constraints initialized");
      await sleep(300);
      
      // Load robot_head.json with progress updates
      addLog("Fetching robot_head.json (528kb)");
      await simulateProgressiveLoading('robot_head.json', 528, 1000);
      if (!mounted) return;
      addLog("➤ Head model successfully decoded");
      addLog("➤ Head model vertices: 862, faces: 704, materials: 4");
      await sleep(400);
      
      // Post-processing and finalization
      addLog("Generating mipmaps for textures...");
      await sleep(600);
      addLog("Applying PBR materials to models");
      await sleep(500);
      addLog("Setting up shadow maps (resolution: 2048)");
      await sleep(300);
      addLog("Configuring physics for robotic joints");
      await sleep(400);
      addLog("Initializing lighting environment");
      await sleep(300);
      addLog("Scene compilation complete");
      await sleep(200);
      
      addLog("✓ All assets loaded successfully");
      addLog("✓ Scene ready for interaction");
      
      if (mounted) {
        setIsComplete(true);
        if (onLoadingComplete) onLoadingComplete();
      }
    };
    
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    const simulateProgressiveLoading = async (
      modelName: string, 
      size: number,
      duration: number
    ) => {
      const steps = 10; // Number of progress updates
      const increment = 100 / steps;
      const stepTime = duration / steps;
      
      for (let i = 1; i <= steps; i++) {
        if (!mounted) return;
        await sleep(stepTime);
        
        // Calculate progressively slower loading at the end
        let progressValue = i * increment;
        if (i > steps * 0.7) {
          progressValue = 70 + (i - (steps * 0.7)) * (30 / (steps * 0.3));
        }
        
        setProgress(prev => ({
          ...prev,
          [modelName]: Math.min(Math.round(progressValue), 100)
        }));
        
        const loadedSize = Math.round((progressValue / 100) * size);
        addLog(`➤ ${modelName}: ${loadedSize}kb/${size}kb loaded (${Math.round(progressValue)}%)`);
      }
    };
    
    simulateLoading();
    
    return () => {
      mounted = false;
    };
  }, [onLoadingComplete]);
  
  return (
    <div className="bg-black text-green-400 font-mono text-sm rounded-md overflow-hidden shadow-lg border border-gray-700 w-full max-w-3xl">
      <div className="bg-gray-900 px-4 py-2 flex justify-between items-center border-b border-gray-700">
        <div className="flex items-center">
          <span className="mr-2">●</span>
          <span>Model Loading Console</span>
        </div>
        <div className="text-xs text-gray-400">
          {isComplete ? "Complete" : "Loading..."}
        </div>
      </div>
      
      <div className="px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(progress).map(([model, value]) => (
            <div key={model} className="flex flex-col">
              <div className="flex justify-between text-xs mb-1">
                <span>{model}</span>
                <span>{value}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${value === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                  style={{ width: `${value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div 
        ref={consoleRef}
        className="h-64 overflow-y-auto p-3 bg-gray-900"
      >
        {logs.map((log, index) => (
          <div key={index} className="leading-tight whitespace-pre-wrap mb-1">
            {log.includes('✓') ? (
              <span className="text-green-400">{log}</span>
            ) : log.includes('➤') ? (
              <span className="text-blue-400">{log}</span>
            ) : log.includes('error') || log.includes('Error') ? (
              <span className="text-red-400">{log}</span>
            ) : (
              <span>{log}</span>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-gray-900 px-3 py-2 border-t border-gray-700 text-xs text-gray-400">
        Press ESC to minimize console
      </div>
    </div>
  );
};

export default ModelLoadingConsole; 
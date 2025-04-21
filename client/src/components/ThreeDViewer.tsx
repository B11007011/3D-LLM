import { useEffect, useRef, useState } from "react";

interface ThreeDViewerProps {
  modelUrl?: string;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  autoRotate?: boolean;
}

/**
 * A placeholder 3D viewer component
 * In a real implementation, this would use Three.js or a similar library
 */
const ThreeDViewer = ({
  modelUrl,
  width = '100%',
  height = '400px',
  backgroundColor = '#1a1a1a',
  autoRotate = true
}: ThreeDViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simulate loading a 3D model
  useEffect(() => {
    if (!modelUrl) {
      setError("No model URL provided");
      setIsLoading(false);
      return;
    }
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Simulate occasional error for demo purposes
      if (Math.random() > 0.9) {
        setError("Error loading model: Format not supported");
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [modelUrl]);
  
  return (
    <div 
      ref={containerRef}
      className="relative rounded-lg overflow-hidden"
      style={{ 
        width, 
        height, 
        backgroundColor,
        boxShadow: "inset 0 0 20px rgba(0,0,0,0.2)"
      }}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-sm">Loading 3D model...</p>
          </div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Placeholder 3D scene - in a real implementation, this would be a Three.js canvas */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Placeholder 3D model - just a rotating cube */}
              <div className={`absolute inset-0 flex items-center justify-center ${autoRotate ? 'animate-spin-slow' : ''}`}>
                <div className="w-32 h-32 bg-blue-600 opacity-70 transform preserve-3d rotate-x-45"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute inset-x-0 bottom-2 text-center text-gray-300 text-xs">
                {modelUrl?.split('/').pop() || 'example-model.glb'}
              </div>
            </div>
          </div>
          
          {/* Control overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-center space-x-2 bg-gradient-to-t from-black/50 to-transparent">
            <button className="p-1 bg-white/10 rounded hover:bg-white/20 text-white">
              <span className="material-icons text-sm">zoom_in</span>
            </button>
            <button className="p-1 bg-white/10 rounded hover:bg-white/20 text-white">
              <span className="material-icons text-sm">zoom_out</span>
            </button>
            <button className="p-1 bg-white/10 rounded hover:bg-white/20 text-white">
              <span className="material-icons text-sm">refresh</span>
            </button>
            <button className="p-1 bg-white/10 rounded hover:bg-white/20 text-white">
              <span className="material-icons text-sm">grid_on</span>
            </button>
            <button className="p-1 bg-white/10 rounded hover:bg-white/20 text-white">
              <span className="material-icons text-sm">fullscreen</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ThreeDViewer; 
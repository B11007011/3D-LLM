import { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { ObjectLoader } from 'three';
import { Button } from "@/components/ui/button";

interface ThreeDViewerProps {
  modelUrl?: string;
  width?: string | number;
  height?: string | number;
  backgroundColor?: string;
  autoRotate?: boolean;
}

/**
 * A 3D model viewer component using Three.js
 */
const ThreeDViewer = ({
  modelUrl,
  width = '100%',
  height = '400px',
  backgroundColor = '#1a1a1a',
  autoRotate = true
}: ThreeDViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerReady, setViewerReady] = useState(false);
  
  // Setup Three.js scene, camera, renderer
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(backgroundColor);
    sceneRef.current = scene;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-1, 0.5, -1);
    scene.add(backLight);
    
    // Initialize camera
    const container = containerRef.current;
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;
    
    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Initialize orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1;
    controlsRef.current = controls;
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(10, 10, 0x555555, 0x333333);
    scene.add(gridHelper);
    
    // Animation loop
    const animate = () => {
      if (!renderer || !scene || !camera || !controls) return;
      
      controls.update();
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    setViewerReady(true);
    
    // Handle window resize
    const handleResize = () => {
      if (!camera || !renderer || !container) return;
      
      const newAspect = container.clientWidth / container.clientHeight;
      camera.aspect = newAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [backgroundColor, autoRotate]);
  
  // Center and scale model to fit in viewport
  const centerAndScaleModel = (model: THREE.Object3D) => {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    model.scale.set(scale, scale, scale);
    
    model.position.x = -center.x * scale;
    model.position.y = -center.y * scale;
    model.position.z = -center.z * scale;
    
    return model;
  };
  
  // Load 3D model when URL changes
  useEffect(() => {
    if (!viewerReady || !modelUrl || !sceneRef.current) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Remove existing model if any
    if (modelRef.current && sceneRef.current) {
      sceneRef.current.remove(modelRef.current);
      modelRef.current = null;
    }
    
    // Determine file type based on extension
    const isJsonModel = modelUrl.toLowerCase().endsWith('.json');
    
    if (isJsonModel) {
      // Load JSON format model
      const objectLoader = new ObjectLoader();
      fetch(modelUrl)
        .then(response => response.json())
        .then(json => {
          const model = objectLoader.parse(json);
          const centeredModel = centerAndScaleModel(model);
          
          if (sceneRef.current) {
            sceneRef.current.add(centeredModel);
            modelRef.current = centeredModel as THREE.Group;
          }
          
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error loading JSON model:', error);
          setError(`Failed to load model: ${error.message}`);
          setIsLoading(false);
        });
    } else {
      // Setup loaders for GLTF/GLB format
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
      
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);
      
      // Load GLTF/GLB model
      gltfLoader.load(
        modelUrl,
        (gltf: GLTF) => {
          const model = gltf.scene;
          const centeredModel = centerAndScaleModel(model);
          
          // Add to scene
          if (sceneRef.current) {
            sceneRef.current.add(centeredModel);
            modelRef.current = centeredModel;
          }
          
          setIsLoading(false);
        },
        (xhr: ProgressEvent) => {
          // Progress callback if needed
        },
        (error: Error) => {
          console.error('Error loading model:', error);
          setError(`Failed to load model: ${error.message}`);
          setIsLoading(false);
        }
      );
    }
    
  }, [modelUrl, viewerReady]);
  
  return (
    <div 
      ref={containerRef}
      className="relative rounded-lg overflow-hidden"
      style={{ 
        width, 
        height, 
        backgroundColor,
      }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white text-sm">Loading 3D model...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {/* Model info overlay */}
      {!isLoading && !error && modelRef.current && (
        <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/50 to-transparent">
          <div className="text-white/80 text-xs font-mono">
            <p>Model: {modelUrl.split('/').pop()}</p>
            <p>Triangles: {calculateMeshInfo(modelRef.current).triangles}</p>
          </div>
        </div>
      )}
      
      {/* Viewer controls */}
      <div className="absolute bottom-0 left-0 right-0 p-2 flex justify-center space-x-2 bg-gradient-to-t from-black/50 to-transparent">
        <Button variant="ghost" size="sm" className="text-white bg-white/10 hover:bg-white/20" onClick={() => {
          if (controlsRef.current) {
            controlsRef.current.autoRotate = !controlsRef.current.autoRotate;
          }
        }}>
          <span className="material-icons text-sm">refresh</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-white bg-white/10 hover:bg-white/20" onClick={() => {
          if (cameraRef.current && controlsRef.current) {
            cameraRef.current.position.set(0, 0, 5);
            controlsRef.current.reset();
          }
        }}>
          <span className="material-icons text-sm">center_focus_weak</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-white bg-white/10 hover:bg-white/20" onClick={() => {
          if (modelRef.current) {
            modelRef.current.visible = !modelRef.current.visible;
          }
        }}>
          <span className="material-icons text-sm">visibility</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-white bg-white/10 hover:bg-white/20" onClick={() => {
          const gridHelper = sceneRef.current?.children.find((child: THREE.Object3D) => child instanceof THREE.GridHelper);
          if (gridHelper) {
            gridHelper.visible = !gridHelper.visible;
          }
        }}>
          <span className="material-icons text-sm">grid_on</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-white bg-white/10 hover:bg-white/20" onClick={() => {
          if (containerRef.current && rendererRef.current) {
            // Toggle fullscreen code would go here
            console.log("Fullscreen toggled");
          }
        }}>
          <span className="material-icons text-sm">fullscreen</span>
        </Button>
      </div>
    </div>
  );
};

// Helper function to calculate mesh information
function calculateMeshInfo(object: THREE.Object3D) {
  let triangles = 0;
  let vertices = 0;
  
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry;
      if (geometry.index) {
        triangles += geometry.index.count / 3;
      } else if (geometry.attributes.position) {
        triangles += geometry.attributes.position.count / 3;
      }
      if (geometry.attributes.position) {
        vertices += geometry.attributes.position.count;
      }
    }
  });
  
  return {
    triangles: Math.round(triangles),
    vertices: Math.round(vertices)
  };
}

export default ThreeDViewer; 
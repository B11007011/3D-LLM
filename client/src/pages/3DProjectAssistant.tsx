import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import ProjectDashboard from "@/components/ProjectDashboard";
import ThreeDViewer from "@/components/ThreeDViewer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import DemoNavigation from "@/components/DemoNavigation";

// Define the type for our active tab
type TabType = 'project' | 'team' | 'tools' | 'files' | 'versions' | 'graphs' | 'importExport' | '3dView';

const ProjectAssistant = () => {
  // State to track which UI elements should be displayed
  const [visibleUI, setVisibleUI] = useState<{
    projectSetup: boolean;
    teamSetup: boolean;
    toolsComparison: boolean;
    fileManagement: boolean;
    versionControl: boolean;
    progressGraphs: boolean;
    importExport: boolean;
  }>({
    projectSetup: true, // Default to showing project setup
    teamSetup: false,
    toolsComparison: false,
    fileManagement: false,
    versionControl: false,
    progressGraphs: false,
    importExport: false
  });

  // State to track which tab is active in the main panel
  const [activeTab, setActiveTab] = useState<TabType>('project');
  
  // Mock data for the 3D models in this project
  const demoModels = [
    { id: 1, name: 'Robot_Base_v2.blend', url: '/models/robot_base.json' },
    { id: 2, name: 'Robot_Head.glb', url: '/models/robot_head.json' },
    { id: 3, name: 'Robot_Arm.fbx', url: '/models/robot_arm.json' }
  ];
  
  // State to track which model is currently selected for viewing
  const [selectedModel, setSelectedModel] = useState(demoModels[0]);

  // Function to update UI based on user input triggers
  const updateUI = (uiType: string | null) => {
    if (uiType === 'projectSetup') {
      setVisibleUI({ ...visibleUI, projectSetup: true });
      setActiveTab('project');
    } else if (uiType === 'teamSetup') {
      setVisibleUI({ ...visibleUI, projectSetup: true, teamSetup: true });
      setActiveTab('team');
    } else if (uiType === 'toolsComparison') {
      setVisibleUI({ ...visibleUI, projectSetup: true, toolsComparison: true });
      setActiveTab('tools');
    } else if (uiType === 'fileManagement') {
      setVisibleUI({ ...visibleUI, projectSetup: true, fileManagement: true });
      setActiveTab('files');
    } else if (uiType === 'versionControl') {
      setVisibleUI({ ...visibleUI, projectSetup: true, versionControl: true });
      setActiveTab('versions');
    } else if (uiType === 'progressGraphs') {
      setVisibleUI({ ...visibleUI, projectSetup: true, progressGraphs: true });
      setActiveTab('graphs');
    } else if (uiType === 'importExport') {
      setVisibleUI({ ...visibleUI, projectSetup: true, importExport: true });
      setActiveTab('importExport');
    } else if (uiType === '3dView') {
      setActiveTab('3dView');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col h-screen">
      <DemoNavigation currentPath="/" />
      
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between mt-10">
        <div className="flex items-center">
          <span className="material-icons text-primary mr-2">view_in_ar</span>
          <h1 className="text-xl font-semibold text-gray-800">3D Project Assistant</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-sm text-primary hover:underline">Sign In</button>
          <button className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-blue-600">
            Save Project
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-57px)]">
          {/* Left Sidebar - Navigation Tabs */}
          <ResizablePanel defaultSize={15} minSize={10} maxSize={20} className="bg-gray-800">
            <div className="p-2 h-full">
              <nav className="space-y-1">
                <button 
                  onClick={() => { setActiveTab('project'); setVisibleUI({...visibleUI, projectSetup: true}) }}
                  className={`w-full flex items-center p-2 rounded ${activeTab === 'project' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <span className="material-icons mr-2 text-sm">space_dashboard</span>
                  <span className="text-sm">Project</span>
                </button>
                
                <button 
                  onClick={() => { setActiveTab('team'); setVisibleUI({...visibleUI, teamSetup: true}) }}
                  className={`w-full flex items-center p-2 rounded ${activeTab === 'team' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <span className="material-icons mr-2 text-sm">people</span>
                  <span className="text-sm">Team</span>
                </button>
                
                <button 
                  onClick={() => { setActiveTab('tools'); setVisibleUI({...visibleUI, toolsComparison: true}) }}
                  className={`w-full flex items-center p-2 rounded ${activeTab === 'tools' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <span className="material-icons mr-2 text-sm">build</span>
                  <span className="text-sm">Tools</span>
                </button>
                
                <button 
                  onClick={() => { setActiveTab('files'); setVisibleUI({...visibleUI, fileManagement: true}) }}
                  className={`w-full flex items-center p-2 rounded ${activeTab === 'files' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <span className="material-icons mr-2 text-sm">folder</span>
                  <span className="text-sm">Files</span>
                </button>
                
                <button 
                  onClick={() => { setActiveTab('versions'); setVisibleUI({...visibleUI, versionControl: true}) }}
                  className={`w-full flex items-center p-2 rounded ${activeTab === 'versions' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <span className="material-icons mr-2 text-sm">history</span>
                  <span className="text-sm">Versions</span>
                </button>
                
                <button 
                  onClick={() => { setActiveTab('graphs'); setVisibleUI({...visibleUI, progressGraphs: true}) }}
                  className={`w-full flex items-center p-2 rounded ${activeTab === 'graphs' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <span className="material-icons mr-2 text-sm">insights</span>
                  <span className="text-sm">Graphs</span>
                </button>
                
                <button 
                  onClick={() => { setActiveTab('importExport'); setVisibleUI({...visibleUI, importExport: true}) }}
                  className={`w-full flex items-center p-2 rounded ${activeTab === 'importExport' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <span className="material-icons mr-2 text-sm">import_export</span>
                  <span className="text-sm">Import/Export</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('3dView')}
                  className={`w-full flex items-center p-2 rounded ${activeTab === '3dView' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  <span className="material-icons mr-2 text-sm">view_in_ar</span>
                  <span className="text-sm">3D View</span>
                </button>
              </nav>
            </div>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Middle Panel - Content Area */}
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction="vertical">
              {/* Main Content Area */}
              <ResizablePanel defaultSize={70}>
                {activeTab === '3dView' ? (
                  <div className="h-full bg-gray-900 p-4 flex flex-col">
                    <div className="mb-4 flex justify-between items-center">
                      <h2 className="text-gray-300 text-lg">3D Viewport - {selectedModel.name}</h2>
                      <div className="flex gap-2">
                        <select 
                          className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 text-sm"
                          value={selectedModel.id}
                          onChange={(e) => {
                            const modelId = parseInt(e.target.value);
                            const model = demoModels.find(m => m.id === modelId);
                            if (model) setSelectedModel(model);
                          }}
                        >
                          {demoModels.map(model => (
                            <option key={model.id} value={model.id}>{model.name}</option>
                          ))}
                        </select>
                        <button className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-2 py-1 text-sm flex items-center">
                          <span className="material-icons text-sm mr-1">upload</span>
                          Upload
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <ThreeDViewer 
                        modelUrl={selectedModel.url}
                        height="100%"
                        autoRotate={true}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 h-full overflow-auto">
                    <ProjectDashboard 
                      visibleUI={visibleUI} 
                      activeTab={activeTab}
                    />
                  </div>
                )}
              </ResizablePanel>
              
              <ResizableHandle />
              
              {/* Bottom Panel - Console/Output */}
              <ResizablePanel defaultSize={30} className="bg-gray-900 text-gray-300">
                <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="material-icons text-sm mr-2">terminal</span>
                    <span className="text-sm font-medium">Console</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-white">
                      <span className="material-icons text-sm">clear_all</span>
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <span className="material-icons text-sm">close</span>
                    </button>
                  </div>
                </div>
                <div className="p-3 font-mono text-xs">
                  <div className="text-green-400">{"> "}Project initialized successfully</div>
                  <div className="text-gray-400">{"> "}Loading assets...</div>
                  <div className="text-gray-400">{"> "}Assets loaded: {selectedModel.name}</div>
                  <div className="text-gray-400">{"> "}Ready for editing</div>
                  {activeTab === '3dView' && (
                    <div className="text-blue-400">{"> "}3D Viewport active: {selectedModel.name}</div>
                  )}
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          
          <ResizableHandle />
          
          {/* Right Panel - Chat Interface */}
          <ResizablePanel defaultSize={35}>
            <ChatInterface updateUI={updateUI} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
};

export default ProjectAssistant;

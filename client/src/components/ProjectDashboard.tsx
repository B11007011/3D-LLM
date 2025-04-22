import { Card } from "@/components/ui/card";
import GanttChart from "@/components/ui/gantt-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsApi } from "@/components/ProjectsApi";
import { FilesApi } from "@/components/FilesApi";
import { VersionsApi } from "@/components/VersionsApi";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Console from "@/components/Console";

interface ProjectDashboardProps {
  visibleUI: {
    projectSetup: boolean;
    teamSetup: boolean;
    toolsComparison: boolean;
    fileManagement: boolean;
    versionControl: boolean;
    progressGraphs: boolean;
    importExport: boolean;
  };
  activeTab?: 'project' | 'team' | 'tools' | 'files' | 'versions' | 'graphs' | 'importExport' | '3dView';
}

const ProjectDashboard = ({ visibleUI, activeTab = 'project' }: ProjectDashboardProps) => {
  const { toast } = useToast();
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [breadcrumbs, setBreadcrumbs] = useState(['Projects', 'Sci-Fi Robot']);
  const [notificationCount, setNotificationCount] = useState(3);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleInput, setConsoleInput] = useState('');
  const [consoleHistory, setConsoleHistory] = useState<string[]>([]);
  const [consoleOutput, setConsoleOutput] = useState<{text: string, type: 'info' | 'success' | 'error' | 'command' | 'loading'}[]>([
    { text: 'Project initialized successfully', type: 'success' },
    { text: 'Initializing Three.js renderer...', type: 'info' },
    { text: 'WebGL 2.0 context created successfully', type: 'success' },
    { text: 'Setting up renderer with pixel ratio: 2', type: 'info' },
    { text: 'Creating scene with PBR lighting model', type: 'info' },
    { text: 'Loading assets...', type: 'loading' },
    { text: 'Loading robot_base.blend (324kb)', type: 'loading' },
    { text: 'Base model loaded successfully (458 vertices, 312 faces)', type: 'success' },
    { text: 'Ready for editing', type: 'info' },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  
  // New state for dialog
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  
  // Update the tab when activeTab prop changes
  useEffect(() => {
    setCurrentTab(activeTab);
    updateBreadcrumbs(activeTab);
  }, [activeTab]);
  
  const updateBreadcrumbs = (tab: string) => {
    switch(tab) {
      case 'project':
        setBreadcrumbs(['Projects', 'Sci-Fi Robot']);
        break;
      case 'team':
        setBreadcrumbs(['Projects', 'Sci-Fi Robot', 'Team']);
        break;
      case 'tools':
        setBreadcrumbs(['Projects', 'Sci-Fi Robot', 'Tools']);
        break;
      case 'files':
        setBreadcrumbs(['Projects', 'Sci-Fi Robot', 'Files']);
        break;
      case 'versions':
        setBreadcrumbs(['Projects', 'Sci-Fi Robot', 'Versions']);
        break;
      case 'graphs':
        setBreadcrumbs(['Projects', 'Sci-Fi Robot', 'Analytics']);
        break;
      case 'importExport':
        setBreadcrumbs(['Projects', 'Sci-Fi Robot', 'Import/Export']);
        break;
      default:
        setBreadcrumbs(['Projects', 'Sci-Fi Robot']);
    }
  };
  
  const { 
    projectSetup, 
    teamSetup, 
    toolsComparison, 
    fileManagement, 
    versionControl, 
    progressGraphs, 
    importExport 
  } = visibleUI;
  
  // Determine what to show based on the active tab
  const showProjectSetup = currentTab === 'project' && projectSetup;
  const showTeamSetup = currentTab === 'team' && teamSetup;
  const showToolsComparison = currentTab === 'tools' && toolsComparison;
  const showFileManagement = currentTab === 'files' && fileManagement;
  const showVersionControl = currentTab === 'versions' && versionControl;
  const showProgressGraphs = currentTab === 'graphs' && progressGraphs;
  const showImportExport = currentTab === 'importExport' && importExport;
  
  // Add a flag to show API components for demonstration
  const showApiComponents = true;
  
  const showEmptyState = !showProjectSetup && !showTeamSetup && !showToolsComparison && 
    !showFileManagement && !showVersionControl && !showProgressGraphs && !showImportExport;

  // Get the title for the panel based on active tab
  const getPanelTitle = () => {
    switch(currentTab) {
      case 'project': return 'Project Dashboard';
      case 'team': return 'Team Management';
      case 'tools': return 'Tools Comparison';
      case 'files': return 'File Management';
      case 'versions': return 'Version Control';
      case 'graphs': return 'Project Analytics';
      case 'importExport': return 'Import & Export';
      default: return 'Project Dashboard';
    }
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as any);
    updateBreadcrumbs(tab);
  };

  // Auto scroll console to bottom when new content is added
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleOutput]);

  // Handle console commands
  const handleConsoleCommand = (command: string) => {
    // Add command to history
    setConsoleHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    // Add command to output
    setConsoleOutput(prev => [...prev, { text: command, type: 'command' }]);
    
    // Process command
    const lowerCommand = command.toLowerCase().trim();
    
    setTimeout(() => {
      if (lowerCommand === 'help' || lowerCommand === '?') {
        setConsoleOutput(prev => [
          ...prev, 
          { text: 'Available commands:', type: 'info' },
          { text: 'help, ? - Show this help message', type: 'info' },
          { text: 'clear - Clear console', type: 'info' },
          { text: 'status - Show project status', type: 'info' },
          { text: 'list assets - List all project assets', type: 'info' },
          { text: 'render - Start rendering current scene', type: 'info' },
          { text: 'export [format] - Export project (formats: obj, fbx, glb)', type: 'info' },
        ]);
      } else if (lowerCommand === 'clear') {
        setConsoleOutput([]);
      } else if (lowerCommand === 'status') {
        setConsoleOutput(prev => [
          ...prev, 
          { text: 'Project Status:', type: 'info' },
          { text: 'Name: Robot Character Design', type: 'info' },
          { text: 'Status: In Progress (65%)', type: 'info' },
          { text: 'Team: 5 members active', type: 'info' },
          { text: 'Assets: 12 models, 8 textures', type: 'info' },
          { text: 'Last modified: Today at 10:45 AM', type: 'info' },
        ]);
      } else if (lowerCommand === 'list assets') {
        setConsoleOutput(prev => [
          ...prev, 
          { text: 'Project Assets:', type: 'info' },
          { text: 'robot_base.blend (324kb) - Base model', type: 'info' },
          { text: 'robot_head.blend (156kb) - Head component', type: 'info' },
          { text: 'robot_arm_left.blend (98kb) - Left arm', type: 'info' },
          { text: 'robot_arm_right.blend (96kb) - Right arm', type: 'info' },
          { text: 'robot_legs.blend (221kb) - Leg components', type: 'info' },
          { text: 'Robot_Texture_Map.png (8.2MB) - Main texture', type: 'info' },
          { text: 'Robot_Normal_Map.png (6.5MB) - Normal map', type: 'info' },
        ]);
      } else if (lowerCommand === 'render') {
        setConsoleOutput(prev => [...prev, { text: 'Starting render...', type: 'loading' }]);
        
        // Simulate render process
        setTimeout(() => {
          setConsoleOutput(prev => [...prev, { text: 'Setting up render parameters...', type: 'loading' }]);
          
          setTimeout(() => {
            setConsoleOutput(prev => [...prev, { text: 'Initializing render engine...', type: 'loading' }]);
            
            setTimeout(() => {
              setConsoleOutput(prev => [
                ...prev, 
                { text: 'Rendering frame 1/1...', type: 'loading' },
                { text: 'Render completed successfully! Output saved to /renders/robot_preview.png', type: 'success' }
              ]);
            }, 2000);
          }, 1500);
        }, 1000);
      } else if (lowerCommand.startsWith('export')) {
        const parts = lowerCommand.split(' ');
        const format = parts[1] || '';
        
        if (['obj', 'fbx', 'glb'].includes(format)) {
          setConsoleOutput(prev => [
            ...prev, 
            { text: `Starting export to ${format.toUpperCase()} format...`, type: 'loading' },
            { text: 'Processing geometry...', type: 'loading' },
            { text: 'Optimizing mesh...', type: 'loading' },
            { text: `Export completed! File saved as robot_model.${format}`, type: 'success' }
          ]);
        } else {
          setConsoleOutput(prev => [
            ...prev, 
            { text: `Error: Unsupported format "${format}". Use obj, fbx, or glb.`, type: 'error' }
          ]);
        }
      } else {
        setConsoleOutput(prev => [
          ...prev, 
          { text: `Unknown command: ${command}. Type 'help' to see available commands.`, type: 'error' }
        ]);
      }
    }, 300);
  };

  // Handle key navigation in console input
  const handleConsoleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && consoleInput.trim()) {
      handleConsoleCommand(consoleInput);
      setConsoleInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (consoleHistory.length > 0) {
        const newIndex = historyIndex < consoleHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setConsoleInput(consoleHistory[consoleHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setConsoleInput(consoleHistory[consoleHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setConsoleInput('');
      }
    }
  };

  // Clear console
  const clearConsole = () => {
    setConsoleOutput([]);
  };

  // Add a function to handle starting a project
  const handleStartWorking = () => {
    toast({
      title: "Project started",
      description: "You are now working on Sci-Fi Robot project",
      variant: "default",
    });
  };

  // Add a function to handle milestone completion
  const handleCompleteMilestone = (milestoneName: string) => {
    toast({
      title: "Milestone completed",
      description: `${milestoneName} marked as complete`,
      variant: "success",
    });
  };

  return (
    <div className="h-full bg-white overflow-hidden flex flex-col">
      {/* Enhanced Header with Breadcrumbs using shadcn/ui Breadcrumb component */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <BreadcrumbItem key={index}>
                  {index < breadcrumbs.length - 1 ? (
                    <BreadcrumbLink href="#">{crumb}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{crumb}</BreadcrumbPage>
                  )}
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
          
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative cursor-pointer">
                    <span className="material-icons text-gray-400 hover:text-blue-500">notifications</span>
                    {notificationCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0">
                        {notificationCount}
                      </Badge>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You have {notificationCount} notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="material-icons text-gray-400 cursor-pointer hover:text-blue-500">help_outline</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help & Documentation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span 
                    className="material-icons text-gray-400 cursor-pointer hover:text-blue-500"
                    onClick={() => setShowConsole(!showConsole)}
                  >
                    terminal
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{showConsole ? "Hide Console" : "Show Console"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-blue-500 text-white text-xs">JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="p-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <span className="material-icons text-primary mr-2">dashboard</span>
            <h2 className="font-medium text-gray-800">{getPanelTitle()}</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 mr-2">
              <Badge variant="outline" className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 flex gap-1 items-center">
                <span className="material-icons text-gray-400 text-sm">visibility</span>
                <span>Public</span>
              </Badge>
              <Badge variant="success" className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs flex gap-1 items-center">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>Active</span>
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">
                  <span className="material-icons text-sm mr-1">add</span>
                  <span>Add</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="material-icons text-sm mr-2">person_add</span>
                  Add Team Member
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTaskDialogOpen(true)}>
                  <span className="material-icons text-sm mr-2">note_add</span>
                  Create Task
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="material-icons text-sm mr-2">upload_file</span>
                  Upload File
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="material-icons text-sm mr-2">event</span>
                  Add Milestone
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button size="sm" variant="default" className="h-8" onClick={handleStartWorking}>
              <span className="material-icons text-sm mr-1">play_arrow</span>
              <span>Start Working</span>
            </Button>
          </div>
        </div>
        
        {/* Enhanced Navigation Tabs - using shadcn/ui Tabs */}
        <div className="px-4">
          <Tabs
            value={currentTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="flex justify-start h-10 bg-transparent border-b border-gray-200 w-full rounded-none p-0 gap-6">
              <TabsTrigger 
                value="project"
                className="flex items-center h-10 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium px-1 rounded-none bg-transparent"
              >
                <span className="material-icons text-sm mr-1">dashboard</span>
                Overview
              </TabsTrigger>
              
              <TabsTrigger 
                value="team"
                className="flex items-center h-10 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium px-1 rounded-none bg-transparent"
              >
                <span className="material-icons text-sm mr-1">group</span>
                Team
              </TabsTrigger>
              
              <TabsTrigger 
                value="tools"
                className="flex items-center h-10 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium px-1 rounded-none bg-transparent"
              >
                <span className="material-icons text-sm mr-1">build</span>
                Tools
              </TabsTrigger>
              
              <TabsTrigger 
                value="files"
                className="flex items-center h-10 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium px-1 rounded-none bg-transparent"
              >
                <span className="material-icons text-sm mr-1">folder</span>
                Files
              </TabsTrigger>
              
              <TabsTrigger 
                value="versions"
                className="flex items-center h-10 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium px-1 rounded-none bg-transparent"
              >
                <span className="material-icons text-sm mr-1">history</span>
                Versions
              </TabsTrigger>
              
              <TabsTrigger 
                value="graphs"
                className="flex items-center h-10 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium px-1 rounded-none bg-transparent"
              >
                <span className="material-icons text-sm mr-1">analytics</span>
                Analytics
              </TabsTrigger>
              
              <TabsTrigger 
                value="importExport"
                className="flex items-center h-10 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:font-medium px-1 rounded-none bg-transparent"
              >
                <span className="material-icons text-sm mr-1">import_export</span>
                Import/Export
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Main content with flex layout to accommodate console */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dashboard Content */}
        <div className={`p-4 space-y-6 overflow-y-auto ${showConsole ? 'h-[calc(100%-16rem)]' : 'h-full'}`}>
        {/* Empty State */}
        {showEmptyState && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <span className="material-icons text-4xl mb-4">explore</span>
            <p>Project details will appear here as you chat</p>
            <p className="text-sm mt-2">Try discussing project timeline, team members, or tools</p>
          </div>
        )}
        
        {/* Project Setup Card */}
        {showProjectSetup && (
          <Card className="shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-gray-800 mr-2">Sci-Fi Robot</h3>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">Video Game Asset</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1 mb-2 max-w-2xl">
                  High-poly sci-fi robot character with realistic textures and animations for next-gen console game. The model will include detailed joint mechanics and customizable weapon attachments.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["sci-fi", "robot", "3d-character", "game-asset"].map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col md:items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-medium">JD</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>John Doe (Lead)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-xs font-medium">AS</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Alice Smith (Artist)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="w-8 h-8 border-2 border-white">
                            <AvatarFallback className="bg-green-100 text-green-600 text-xs font-medium">TJ</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tom Jackson (Animator)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Button variant="link" size="sm" className="text-xs text-blue-600 hover:text-blue-700 h-auto p-0">
                    +2 more
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3 mt-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1">
                    <span className="material-icons text-gray-400 text-sm">calendar_today</span>
                    <span className="text-xs text-gray-600">Due: June 30, 2023</span>
                  </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>29 days remaining</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1">
                    <span className="material-icons text-orange-500 text-sm">priority_high</span>
                    <span className="text-xs text-gray-600">High Priority</span>
                  </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Escalated by Project Manager</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="border border-gray-200 rounded-md p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Overall Progress</h4>
                  <span className="text-xs font-semibold text-blue-600">65%</span>
                </div>
                <div className="h-2 w-full mb-2">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{width: '65%'}}></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Started: April 2</span>
                  <span>29 days left</span>
                </div>
              </Card>
              
              <Card className="border border-gray-200 rounded-md p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Tasks</h4>
                  <span className="text-xs font-semibold text-blue-600">12/20</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Completed</span>
                    <span className="text-lg font-semibold text-gray-700">12</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">In Progress</span>
                    <span className="text-lg font-semibold text-green-600">5</span>
                  </div>
                </div>
                <Button variant="link" className="p-0 h-auto flex items-center text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                  <span className="material-icons text-xs mr-1">launch</span>
                  <span>View all tasks</span>
                </Button>
              </Card>
              
              <Card className="border border-gray-200 rounded-md p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Budget</h4>
                  <Badge variant="success" className="text-xs font-semibold bg-green-100 text-green-600 px-2 py-0.5">On track</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Allocated</span>
                    <span className="text-lg font-semibold text-gray-700">$8,500</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">Spent</span>
                    <span className="text-lg font-semibold text-gray-700">$5,230</span>
                  </div>
                </div>
                <Button variant="link" className="p-0 h-auto flex items-center text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                  <span className="material-icons text-xs mr-1">account_balance</span>
                  <span>Budget details</span>
                </Button>
              </Card>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Project Timeline</h4>
                <Tabs defaultValue="month" className="h-7">
                  <TabsList className="h-7 px-1 bg-gray-100">
                    <TabsTrigger value="week" className="px-2 py-0 text-xs h-5">Week</TabsTrigger>
                    <TabsTrigger value="month" className="px-2 py-0 text-xs h-5">Month</TabsTrigger>
                    <TabsTrigger value="quarter" className="px-2 py-0 text-xs h-5">Quarter</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <GanttChart />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Key Milestones</h4>
                <Button variant="outline" size="sm" className="h-6 text-xs px-2 py-0 flex items-center">
                  <span className="material-icons text-sm mr-1">add</span>
                  Add Milestone
                </Button>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center justify-between p-2 bg-green-50 border border-green-100 rounded-md">
                  <div className="flex items-center">
                  <span className="material-icons text-green-500 mr-2 text-sm">check_circle</span>
                    <div>
                      <span className="text-sm font-medium">Basic modeling</span>
                      <p className="text-xs text-gray-500">Completed on May 15, 2023</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Week 2</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                      <span className="material-icons text-sm">more_vert</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <span className="material-icons text-sm mr-2">visibility</span>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span className="material-icons text-sm mr-2">edit</span>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCompleteMilestone("Basic modeling")}>
                          <span className="material-icons text-sm mr-2">check_circle</span>
                          Mark as Complete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <span className="material-icons text-sm mr-2">delete</span>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
                
                <li className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-100 rounded-md">
                  <div className="flex items-center">
                  <span className="material-icons text-yellow-500 mr-2 text-sm">pending</span>
                    <div>
                      <span className="text-sm font-medium">Texture completion</span>
                      <p className="text-xs text-gray-500">Due on June 10, 2023 (5 days left)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Week 5</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                      <span className="material-icons text-sm">more_vert</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <span className="material-icons text-sm mr-2">visibility</span>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span className="material-icons text-sm mr-2">edit</span>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCompleteMilestone("Texture completion")}>
                          <span className="material-icons text-sm mr-2">check_circle</span>
                          Mark as Complete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <span className="material-icons text-sm mr-2">delete</span>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
                
                <li className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <span className="material-icons text-gray-300 mr-2 text-sm">circle</span>
                    <div>
                      <span className="text-sm font-medium">Animation rigging</span>
                      <p className="text-xs text-gray-500">Due on June 20, 2023 (15 days left)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Week 7</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                      <span className="material-icons text-sm">more_vert</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <span className="material-icons text-sm mr-2">visibility</span>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span className="material-icons text-sm mr-2">edit</span>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <span className="material-icons text-sm mr-2">delete</span>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
                
                <li className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                  <span className="material-icons text-gray-300 mr-2 text-sm">circle</span>
                    <div>
                      <span className="text-sm font-medium">Final testing</span>
                      <p className="text-xs text-gray-500">Due on June 28, 2023 (23 days left)</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2">Week 8</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                      <span className="material-icons text-sm">more_vert</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <span className="material-icons text-sm mr-2">visibility</span>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <span className="material-icons text-sm mr-2">edit</span>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <span className="material-icons text-sm mr-2">delete</span>
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </li>
              </ul>
            </div>
          </Card>
        )}
        
        {/* Team Members Card */}
        {showTeamSetup && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Team Members</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search members..." 
                    className="text-xs pl-7 pr-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-40"
                  />
                  <span className="material-icons absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">search</span>
                </div>
                <select className="text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 px-2 py-1 bg-white">
                  <option value="all">All roles</option>
                  <option value="lead">Lead</option>
                  <option value="artist">Artist</option>
                  <option value="developer">Developer</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all border border-transparent hover:border-blue-200">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">JD</div>
                <div className="ml-3 flex-grow">
                  <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">John Doe</p>
                    <div className="flex items-center">
                      <span className="material-icons text-green-500 text-xs mr-1">circle</span>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">3D Modeler</p>
                  <div className="flex items-center mt-1">
                    <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">3 tasks in progress</span>
                  </div>
                </div>
                <div className="ml-2 flex flex-col space-y-1">
                  <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded flex items-center justify-center">Lead</span>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Message">
                      <span className="material-icons text-xs">chat</span>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Assign task">
                      <span className="material-icons text-xs">assignment</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all border border-transparent hover:border-blue-200">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">AS</div>
                <div className="ml-3 flex-grow">
                  <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Alice Smith</p>
                    <div className="flex items-center">
                      <span className="material-icons text-gray-300 text-xs mr-1">circle</span>
                      <span className="text-xs text-gray-500">Away (3h ago)</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Texture Artist</p>
                  <div className="flex items-center mt-1">
                    <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{width: '80%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">2 tasks in progress</span>
                  </div>
                </div>
                <div className="ml-2 flex flex-col space-y-1">
                  <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded flex items-center justify-center">Artist</span>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Message">
                      <span className="material-icons text-xs">chat</span>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Assign task">
                      <span className="material-icons text-xs">assignment</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-all border border-transparent hover:border-blue-200">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">TJ</div>
                <div className="ml-3 flex-grow">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Tom Jackson</p>
                    <div className="flex items-center">
                      <span className="material-icons text-green-500 text-xs mr-1">circle</span>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Animator</p>
                  <div className="flex items-center mt-1">
                    <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{width: '30%'}}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">1 task in progress</span>
                  </div>
                </div>
                <div className="ml-2 flex flex-col space-y-1">
                  <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded flex items-center justify-center">Artist</span>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Message">
                      <span className="material-icons text-xs">chat</span>
                    </button>
                    <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Assign task">
                      <span className="material-icons text-xs">assignment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Team Performance</h4>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Tasks Completed</p>
                    <p className="text-lg font-semibold text-blue-600">24</p>
                    <div className="text-xs text-green-500 flex items-center justify-center mt-1">
                      <span className="material-icons text-xs mr-1">arrow_upward</span>
                      <span>12%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">On-Time Delivery</p>
                    <p className="text-lg font-semibold text-blue-600">92%</p>
                    <div className="text-xs text-green-500 flex items-center justify-center mt-1">
                      <span className="material-icons text-xs mr-1">arrow_upward</span>
                      <span>5%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Avg. Response Time</p>
                    <p className="text-lg font-semibold text-blue-600">2.4h</p>
                    <div className="text-xs text-red-500 flex items-center justify-center mt-1">
                      <span className="material-icons text-xs mr-1">arrow_downward</span>
                      <span>3%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Activity</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <div className="flex items-center p-2 border-l-2 border-blue-500 bg-blue-50 rounded-r-md">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs">JD</div>
                  <div className="ml-2 flex-grow">
                    <p className="text-xs">
                      <span className="font-medium">John Doe</span> completed task 
                      <span className="font-medium"> Model robot arm joints</span>
                    </p>
                    <p className="text-xs text-gray-500">Today, 10:32 AM</p>
                  </div>
                </div>
                <div className="flex items-center p-2 border-l-2 border-purple-500 bg-purple-50 rounded-r-md">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-xs">AS</div>
                  <div className="ml-2 flex-grow">
                    <p className="text-xs">
                      <span className="font-medium">Alice Smith</span> uploaded 
                      <span className="font-medium"> 3 texture files</span>
                    </p>
                    <p className="text-xs text-gray-500">Yesterday, 4:15 PM</p>
                  </div>
                </div>
                <div className="flex items-center p-2 border-l-2 border-green-500 bg-green-50 rounded-r-md">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium text-xs">TJ</div>
                  <div className="ml-2 flex-grow">
                    <p className="text-xs">
                      <span className="font-medium">Tom Jackson</span> started task 
                      <span className="font-medium"> Rig character animations</span>
                    </p>
                    <p className="text-xs text-gray-500">Yesterday, 3:48 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button className="flex items-center text-xs text-primary bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">
                <span className="material-icons text-xs mr-1">person_add</span> Add Team Member
              </button>
              <button className="flex items-center text-xs text-primary bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">
                <span className="material-icons text-xs mr-1">table_chart</span> Team Reports
              </button>
            </div>
          </div>
        )}
        
        {/* Tools Comparison Card */}
        {showToolsComparison && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Tools Comparison</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tool</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strengths</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Blender</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">Free</td>
                    <td className="px-3 py-2 text-sm text-gray-500">All-in-one solution</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">Maya</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">$1,785/year</td>
                    <td className="px-3 py-2 text-sm text-gray-500">Industry standard</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">ZBrush</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">$895</td>
                    <td className="px-3 py-2 text-sm text-gray-500">Sculpting focused</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* File Management Card */}
        {showFileManagement && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center">
                <h3 className="font-semibold text-gray-800 mr-2">File Management</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">12 Files</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search files..."
                    className="text-sm pl-8 pr-4 py-1.5 border rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="material-icons absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                    search
                  </span>
                </div>
                
                <select className="text-sm border rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option>All file types</option>
                  <option>3D Models</option>
                  <option>Textures</option>
                  <option>Rigs</option>
                  <option>Documentation</option>
                </select>
              </div>
            </div>
            
            <div className="flex mb-4 border-b border-gray-200">
              <button className="px-4 py-2 text-sm border-b-2 border-primary text-primary font-medium">
                All Files
              </button>
              <button className="px-4 py-2 text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                Recent
              </button>
              <button className="px-4 py-2 text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                Shared with me
              </button>
              <button className="px-4 py-2 text-sm border-b-2 border-transparent text-gray-500 hover:text-gray-700">
                Favorites
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">3D Models</h4>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                  <span className="material-icons text-sm mr-1">unfold_more</span>
                  Expand
                </button>
            </div>
            
            <div className="space-y-2">
                <div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 border border-transparent hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded mr-3">
                    <span className="material-icons text-blue-500">view_in_ar</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Robot_Base_v2.blend</p>
                      <div className="flex items-center">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-2">Model</span>
                        <span className="text-xs text-gray-500">15.4 MB</span>
                </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">Modified by John Doe, 2 days ago</p>
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Download">
                          <span className="material-icons text-sm">download</span>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Share">
                          <span className="material-icons text-sm">share</span>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="More options">
                          <span className="material-icons text-sm">more_vert</span>
                        </button>
                      </div>
                    </div>
                </div>
              </div>
              
                <div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 border border-transparent hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded mr-3">
                    <span className="material-icons text-blue-500">view_in_ar</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Robot_Head_v3.fbx</p>
                      <div className="flex items-center">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mr-2">Model</span>
                        <span className="text-xs text-gray-500">8.7 MB</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">Modified by Tom Jackson, 4 days ago</p>
                      <div className="flex space-x-1">
                        <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Download">
                          <span className="material-icons text-sm">download</span>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Share">
                          <span className="material-icons text-sm">share</span>
                        </button>
                        <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="More options">
                          <span className="material-icons text-sm">more_vert</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Version Control Card */}
        {showVersionControl && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Version Control</h3>
            
            <div className="space-y-4">
              <div className="flex items-start border-l-2 border-blue-500 pl-3 py-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium shrink-0">JD</div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">John Doe</p>
                    <span className="text-xs text-gray-500 ml-2">2 days ago</span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1">Added new arm joint mechanics</p>
                  <p className="text-xs text-gray-500 mt-0.5">Version 2.3.0</p>
                  <div className="flex mt-2 space-x-2">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Robot_Base_v2.blend</span>
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded">+325 lines</span>
                  </div>
                </div>
                <div className="ml-auto flex space-x-1">
                  <button className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Revert</button>
                  <button className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">View</button>
                </div>
              </div>
              
              <div className="flex items-start border-l-2 border-purple-500 pl-3 py-1">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium shrink-0">AS</div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium">Alice Smith</p>
                    <span className="text-xs text-gray-500 ml-2">3 days ago</span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1">Updated metallic texture maps</p>
                  <p className="text-xs text-gray-500 mt-0.5">Version 2.2.0</p>
                  <div className="flex mt-2 space-x-2">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">Robot_Texture_Map.png</span>
                  </div>
                </div>
                <div className="ml-auto flex space-x-1">
                  <button className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Revert</button>
                  <button className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100">View</button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex items-center text-xs text-primary bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">
                <span className="material-icons text-xs mr-1">history</span> Full History
              </button>
              <button className="flex items-center text-xs text-primary bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">
                <span className="material-icons text-xs mr-1">compare_arrows</span> Compare Versions
              </button>
            </div>
          </div>
        )}
        
        {/* Progress Graphs Card */}
        {showProgressGraphs && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Project Analytics</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Completion Progress</h4>
              <div className="h-7 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center pl-2" style={{width: '65%'}}>
                  <span className="text-xs font-medium text-white">65% complete</span>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Started: April 2, 2023</span>
                <span>Deadline: June 30, 2023</span>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Resource Allocation</h4>
              <div className="flex h-16 rounded-md overflow-hidden">
                <div className="bg-blue-500 h-full w-2/5 flex items-center justify-center">
                  <span className="text-xs text-white">Modeling<br />40%</span>
                </div>
                <div className="bg-purple-500 h-full w-1/4 flex items-center justify-center">
                  <span className="text-xs text-white">Texturing<br />25%</span>
                </div>
                <div className="bg-indigo-500 h-full w-1/5 flex items-center justify-center">
                  <span className="text-xs text-white">Rigging<br />20%</span>
                </div>
                <div className="bg-green-500 h-full w-3/20 flex items-center justify-center">
                  <span className="text-xs text-white">Testing<br />15%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Team Activity</h4>
              <div className="h-24 flex items-end space-x-1">
                {[40, 65, 35, 50, 90, 75, 45].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-blue-400 hover:bg-blue-500 transition-colors rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-[10px] text-gray-500 mt-1">{`W${i+1}`}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Import/Export Card */}
        {showImportExport && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Import & Export Options</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Import File</h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <span className="material-icons text-gray-400 text-3xl">cloud_upload</span>
                <p className="text-sm text-gray-500 mt-2">Drag files here or click to browse</p>
                <p className="text-xs text-gray-400 mt-1">Supports .FBX, .OBJ, .BLEND, .STL, and more</p>
                <button className="mt-3 text-xs bg-blue-500 text-white px-4 py-1.5 rounded hover:bg-blue-600">
                  Select Files
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Export Options</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">description</span>
                    <span className="text-sm font-medium">.FBX</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Universal 3D exchange format</p>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">description</span>
                    <span className="text-sm font-medium">.OBJ</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Simple geometry export</p>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">description</span>
                    <span className="text-sm font-medium">.STL</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For 3D printing</p>
                </div>
                
                <div className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:bg-blue-50 cursor-pointer">
                  <div className="flex items-center">
                    <span className="material-icons text-blue-500 mr-2">description</span>
                    <span className="text-sm font-medium">.GLTF</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">For web & real-time apps</p>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="flex items-center text-xs text-white bg-primary px-3 py-1.5 rounded hover:bg-blue-600">
                  <span className="material-icons text-xs mr-1">download</span> Export Project
                </button>
                <button className="flex items-center text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200">
                  <span className="material-icons text-xs mr-1">settings</span> Advanced Options
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* API Component Demonstrations */}
        {showApiComponents && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">API Endpoints & Database Demo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Test the PostgreSQL database functionality directly from the UI. Create projects, files, and track versions.
            </p>
            
            <Tabs defaultValue="projects" className="mt-5">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="projects">Projects & Team</TabsTrigger>
                <TabsTrigger value="files">File Management</TabsTrigger>
                <TabsTrigger value="versions">Version Control</TabsTrigger>
              </TabsList>
              
              <TabsContent value="projects" className="mt-4">
                <ProjectsApi />
              </TabsContent>
              
              <TabsContent value="files" className="mt-4">
                <FilesApi />
              </TabsContent>
              
              <TabsContent value="versions" className="mt-4">
                <VersionsApi />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
      
      {/* Console Panel */}
      {showConsole && (
        <div className="border-t border-gray-200 h-64 flex flex-col">
          <div className="p-3 border-b border-gray-700 flex items-center justify-between bg-gray-900">
            <div className="flex items-center">
              <span className="material-icons text-sm mr-2 text-gray-300">terminal</span>
              <span className="text-sm font-medium text-gray-300">Console</span>
            </div>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={clearConsole}
                    >
                      <span className="material-icons text-sm">clear_all</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Clear console</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                      onClick={() => setShowConsole(false)}
                    >
                      <span className="material-icons text-sm">close</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Close console</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="p-3 font-mono text-xs bg-gray-900 text-gray-300 overflow-y-auto flex-1">
            {consoleOutput.map((line, index) => (
              <div 
                key={index} 
                className={`${
                  line.type === 'success' ? 'text-green-400' : 
                  line.type === 'error' ? 'text-red-400' : 
                  line.type === 'info' ? 'text-blue-400' : 
                  line.type === 'command' ? 'text-yellow-400 font-bold' : 
                  'text-gray-400'
                }`}
              >
                {line.type === 'command' ? `$ ${line.text}` : `> ${line.text}`}
              </div>
            ))}
            <div ref={consoleEndRef} />
          </div>
          <div className="p-2 bg-gray-900 border-t border-gray-700 flex items-center">
            <span className="text-green-400 mr-2">$</span>
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-gray-200"
              placeholder="Type a command... (try 'help')"
              value={consoleInput}
              onChange={(e) => setConsoleInput(e.target.value)}
              onKeyDown={handleConsoleKeyDown}
            />
          </div>
        </div>
      )}
      
      {/* Floating button to show console when hidden */}
      {!showConsole && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="default"
                size="icon"
                className="fixed bottom-4 right-4 bg-gray-800 hover:bg-gray-700 rounded-full shadow-lg p-0 h-10 w-10"
                onClick={() => setShowConsole(true)}
              >
                <span className="material-icons">terminal</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Open Console</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      {/* Task Creation Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Task</DialogTitle>
            <DialogDescription>
              Enter the details for the new task
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignee" className="text-right">
                Assignee
              </Label>
              <Input
                id="assignee"
                value={newTaskAssignee}
                onChange={(e) => setNewTaskAssignee(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={() => {
              // Here would be the logic to create a task
              toast({
                title: "Task created",
                description: `Task "${newTaskTitle}" has been created`,
                variant: "default",
              });
              setTaskDialogOpen(false);
              setNewTaskTitle('');
              setNewTaskDescription('');
              setNewTaskAssignee('');
            }}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Toast notification */}
      <Toaster />
    </div>
  );
};

export default ProjectDashboard;

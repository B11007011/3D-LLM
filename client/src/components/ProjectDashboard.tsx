import { Card } from "@/components/ui/card";
import GanttChart from "@/components/ui/gantt-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectsApi } from "@/components/ProjectsApi";
import { FilesApi } from "@/components/FilesApi";
import { VersionsApi } from "@/components/VersionsApi";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [breadcrumbs, setBreadcrumbs] = useState(['Projects', 'Sci-Fi Robot']);
  const [notificationCount, setNotificationCount] = useState(3);
  
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

  return (
    <div className="h-full bg-white overflow-hidden flex flex-col">
      {/* Enhanced Header with Breadcrumbs and Actions */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                {index > 0 && <span className="mx-1">/</span>}
                <span className={index === breadcrumbs.length - 1 ? "font-medium text-gray-700" : "hover:text-blue-500 cursor-pointer"}>
                  {crumb}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="material-icons text-gray-400 cursor-pointer hover:text-blue-500">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </div>
            <span className="material-icons text-gray-400 cursor-pointer hover:text-blue-500">help_outline</span>
            <span className="material-icons text-gray-400 cursor-pointer hover:text-blue-500">settings</span>
            <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
              JD
            </div>
          </div>
        </div>
        
        <div className="p-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center">
            <span className="material-icons text-primary mr-2">dashboard</span>
            <h2 className="font-medium text-gray-800">{getPanelTitle()}</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 mr-2">
              <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                <span className="material-icons text-gray-400 text-sm">visibility</span>
                <span>Public</span>
              </div>
              <div className="flex items-center space-x-1 px-2 py-1 bg-green-100 rounded text-xs text-green-700">
                <span className="material-icons text-green-500 text-sm">check_circle</span>
                <span>Active</span>
              </div>
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
                <DropdownMenuItem>
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
            
            <Button size="sm" variant="default" className="h-8">
              <span className="material-icons text-sm mr-1">play_arrow</span>
              <span>Start Working</span>
            </Button>
          </div>
        </div>
        
        {/* Enhanced Navigation Tabs */}
        <div className="px-4">
          <div className="flex space-x-6 border-b border-gray-200">
            <button 
              onClick={() => handleTabChange('project')} 
              className={`flex items-center py-2 px-1 text-sm border-b-2 ${currentTab === 'project' ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <span className="material-icons text-sm mr-1">dashboard</span>
              Overview
            </button>
            
            <button 
              onClick={() => handleTabChange('team')} 
              className={`flex items-center py-2 px-1 text-sm border-b-2 ${currentTab === 'team' ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <span className="material-icons text-sm mr-1">group</span>
              Team
            </button>
            
            <button 
              onClick={() => handleTabChange('tools')} 
              className={`flex items-center py-2 px-1 text-sm border-b-2 ${currentTab === 'tools' ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <span className="material-icons text-sm mr-1">build</span>
              Tools
            </button>
            
            <button 
              onClick={() => handleTabChange('files')} 
              className={`flex items-center py-2 px-1 text-sm border-b-2 ${currentTab === 'files' ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <span className="material-icons text-sm mr-1">folder</span>
              Files
            </button>
            
            <button 
              onClick={() => handleTabChange('versions')} 
              className={`flex items-center py-2 px-1 text-sm border-b-2 ${currentTab === 'versions' ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <span className="material-icons text-sm mr-1">history</span>
              Versions
            </button>
            
            <button 
              onClick={() => handleTabChange('graphs')} 
              className={`flex items-center py-2 px-1 text-sm border-b-2 ${currentTab === 'graphs' ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <span className="material-icons text-sm mr-1">analytics</span>
              Analytics
            </button>
            
            <button 
              onClick={() => handleTabChange('importExport')} 
              className={`flex items-center py-2 px-1 text-sm border-b-2 ${currentTab === 'importExport' ? 'border-primary text-primary font-medium' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <span className="material-icons text-sm mr-1">import_export</span>
              Import/Export
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
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
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center mb-2">
                  <h3 className="font-semibold text-gray-800 mr-2">Sci-Fi Robot</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Video Game Asset</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 mb-2 max-w-2xl">
                  High-poly sci-fi robot character with realistic textures and animations for next-gen console game. The model will include detailed joint mechanics and customizable weapon attachments.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">#sci-fi</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">#robot</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">#3d-character</span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">#game-asset</span>
                </div>
              </div>
              
              <div className="flex flex-col md:items-end space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-xs z-30">JD</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-purple-600 font-medium text-xs z-20">AS</div>
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-green-600 font-medium text-xs z-10">TJ</div>
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-700">
                    +2 more
                  </button>
                </div>
                
                <div className="flex items-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1">
                    <span className="material-icons text-gray-400 text-sm">calendar_today</span>
                    <span className="text-xs text-gray-600">Due: June 30, 2023</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="material-icons text-orange-500 text-sm">priority_high</span>
                    <span className="text-xs text-gray-600">High Priority</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="border border-gray-200 rounded-md p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Overall Progress</h4>
                  <span className="text-xs font-semibold text-blue-600">65%</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{width: '65%'}}></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Started: April 2</span>
                  <span>29 days left</span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors">
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
                <div className="flex items-center text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                  <span className="material-icons text-xs mr-1">launch</span>
                  <span>View all tasks</span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Budget</h4>
                  <span className="text-xs font-semibold text-green-600">On track</span>
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
                <div className="flex items-center text-xs text-blue-600 hover:text-blue-700 cursor-pointer">
                  <span className="material-icons text-xs mr-1">account_balance</span>
                  <span>Budget details</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Project Timeline</h4>
                <div className="flex items-center space-x-2">
                  <button className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Week</button>
                  <button className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Month</button>
                  <button className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200">Quarter</button>
                </div>
              </div>
              <GanttChart />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Key Milestones</h4>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                  <span className="material-icons text-sm mr-1">add</span>
                  Add Milestone
                </button>
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
                    <button className="p-1 text-gray-400 hover:text-blue-500 rounded">
                      <span className="material-icons text-sm">more_vert</span>
                    </button>
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
                    <button className="p-1 text-gray-400 hover:text-blue-500 rounded">
                      <span className="material-icons text-sm">more_vert</span>
                    </button>
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
                    <button className="p-1 text-gray-400 hover:text-blue-500 rounded">
                      <span className="material-icons text-sm">more_vert</span>
                    </button>
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
                    <button className="p-1 text-gray-400 hover:text-blue-500 rounded">
                      <span className="material-icons text-sm">more_vert</span>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
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
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Textures</h4>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                  <span className="material-icons text-sm mr-1">unfold_more</span>
                  Expand
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 border border-transparent hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded mr-3">
                    <span className="material-icons text-green-500">image</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Robot_Texture_Map.png</p>
                      <div className="flex items-center">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mr-2">Texture</span>
                        <span className="text-xs text-gray-500">8.2 MB</span>
                </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">Modified by Alice Smith, 3 days ago</p>
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
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded mr-3">
                    <span className="material-icons text-green-500">image</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Robot_Normal_Map.png</p>
                      <div className="flex items-center">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded mr-2">Texture</span>
                        <span className="text-xs text-gray-500">6.5 MB</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">Modified by Alice Smith, 3 days ago</p>
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
            
                <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700">Animations & Rigs</h4>
                <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                  <span className="material-icons text-sm mr-1">unfold_more</span>
                  Expand
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 border border-transparent hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded mr-3">
                    <span className="material-icons text-purple-500">animation</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Robot_Animation_Rig.fbx</p>
                      <div className="flex items-center">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded mr-2">Rig</span>
                        <span className="text-xs text-gray-500">2.1 MB</span>
                </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">Modified by Tom Jackson, 5 days ago</p>
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
            
            <div className="mt-6 flex items-center justify-between">
              <div className="flex space-x-2">
                <button className="flex items-center text-sm text-white bg-primary px-3 py-1.5 rounded hover:bg-blue-600">
                  <span className="material-icons text-sm mr-1">add</span> Upload File
              </button>
                <button className="flex items-center text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200">
                  <span className="material-icons text-sm mr-1">folder</span> New Folder
              </button>
              </div>
              
              <div className="text-xs text-gray-500">
                Storage: <span className="font-medium">42.5 MB</span> used of <span className="font-medium">1 GB</span>
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
    </div>
  );
};

export default ProjectDashboard;

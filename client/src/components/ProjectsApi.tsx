import { useState } from "react";
import { useProjects, createProject, useProjectMembers, addProjectMember, useMilestones, createMilestone } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface DatePickerProps {
  date?: Date;
  setDate: (date?: Date) => void;
}

function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
import { useToast } from "@/hooks/use-toast";

export function ProjectsApi() {
  const { toast } = useToast();
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("");
  const [newMilestoneName, setNewMilestoneName] = useState("");
  const [newMilestoneDeadline, setNewMilestoneDeadline] = useState<Date | undefined>(undefined);

  // Fetch projects
  const { data: projects, isLoading: isLoadingProjects, error: projectsError } = useProjects();

  // Conditionally fetch project members and milestones when a project is selected
  const { data: projectMembers } = useProjectMembers(selectedProjectId || 0);
  const { data: milestones } = useMilestones(selectedProjectId || 0);

  // Create a new project
  const handleCreateProject = async () => {
    if (!newProjectName) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createProject({
        name: newProjectName,
        description: newProjectDescription,
        status: "active",
        startDate: new Date(),
        endDate: null
      });

      toast({
        title: "Success",
        description: "Project created successfully",
      });

      setNewProjectName("");
      setNewProjectDescription("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    }
  };

  // Add a team member to a project
  const handleAddTeamMember = async () => {
    if (!selectedProjectId) {
      toast({
        title: "Error",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    if (!newMemberName || !newMemberRole) {
      toast({
        title: "Error",
        description: "Member name and role are required",
        variant: "destructive",
      });
      return;
    }

    try {
      // First create a user (in real app, you'd search for existing users)
      const user = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newMemberName.toLowerCase().replace(/\\s/g, ""),
          email: `${newMemberName.toLowerCase().replace(/\\s/g, "")}@example.com`,
          name: newMemberName,
        }),
      }).then(res => res.json());

      // Then add the user to the project
      await addProjectMember(selectedProjectId, user.id, newMemberRole);

      toast({
        title: "Success",
        description: "Team member added successfully",
      });

      setNewMemberName("");
      setNewMemberRole("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    }
  };

  // Create a new milestone
  const handleCreateMilestone = async () => {
    if (!selectedProjectId) {
      toast({
        title: "Error",
        description: "Please select a project first",
        variant: "destructive",
      });
      return;
    }

    if (!newMilestoneName || !newMilestoneDeadline) {
      toast({
        title: "Error",
        description: "Milestone name and deadline are required",
        variant: "destructive",
      });
      return;
    }

    try {
      await createMilestone(selectedProjectId, {
        name: newMilestoneName,
        dueDate: newMilestoneDeadline,
        description: "Created via API demo",
        completed: false
      });

      toast({
        title: "Success",
        description: "Milestone created successfully",
      });

      setNewMilestoneName("");
      setNewMilestoneDeadline(undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create milestone",
        variant: "destructive",
      });
    }
  };

  if (isLoadingProjects) {
    return <div className="p-4">Loading projects...</div>;
  }

  if (projectsError) {
    return <div className="p-4 text-red-500">Error loading projects</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Management API</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="projects">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="teamMembers">Team Members</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input 
                id="projectName" 
                value={newProjectName} 
                onChange={(e) => setNewProjectName(e.target.value)} 
                placeholder="Enter project name" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectDescription">Description</Label>
              <Input 
                id="projectDescription" 
                value={newProjectDescription} 
                onChange={(e) => setNewProjectDescription(e.target.value)} 
                placeholder="Enter project description" 
              />
            </div>
            
            <Button onClick={handleCreateProject} className="w-full">Create Project</Button>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Projects ({projects?.length || 0})</h3>
              <div className="space-y-2">
                {projects?.map((project) => (
                  <div 
                    key={project.id} 
                    className={`p-3 border rounded cursor-pointer ${selectedProjectId === project.id ? 'bg-blue-50 border-blue-500' : ''}`}
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    <div className="font-medium">{project.name}</div>
                    <div className="text-sm text-gray-600">{project.description}</div>
                    <div className="text-xs mt-1 text-gray-500">Status: {project.status}</div>
                  </div>
                ))}
                
                {projects?.length === 0 && (
                  <div className="text-center py-4 text-gray-500">No projects yet</div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="teamMembers" className="space-y-4 mt-4">
            {!selectedProjectId ? (
              <div className="text-center py-4 text-gray-500">Please select a project first</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="memberName">Member Name</Label>
                  <Input 
                    id="memberName" 
                    value={newMemberName} 
                    onChange={(e) => setNewMemberName(e.target.value)} 
                    placeholder="Enter member name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="memberRole">Role</Label>
                    <select 
                    id="memberRole" 
                    value={newMemberRole} 
                    onChange={(e) => setNewMemberRole(e.target.value)} 
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select role</option>
                      <option value="Lead">Lead</option>
                      <option value="3D Modeler">3D Modeler</option>
                      <option value="Texture Artist">Texture Artist</option>
                      <option value="Animator">Animator</option>
                      <option value="Rigger">Rigger</option>
                      <option value="Developer">Developer</option>
                      <option value="QA Tester">QA Tester</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Permission Level</Label>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="permView" name="permission" className="h-4 w-4 text-primary" />
                      <Label htmlFor="permView" className="text-xs font-normal">View only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="permEdit" name="permission" className="h-4 w-4 text-primary" checked />
                      <Label htmlFor="permEdit" className="text-xs font-normal">Edit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="permAdmin" name="permission" className="h-4 w-4 text-primary" />
                      <Label htmlFor="permAdmin" className="text-xs font-normal">Admin</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Access To</Label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="accessFiles" className="h-4 w-4 text-primary" checked />
                      <Label htmlFor="accessFiles" className="text-xs font-normal">Files</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="accessTasks" className="h-4 w-4 text-primary" checked />
                      <Label htmlFor="accessTasks" className="text-xs font-normal">Tasks</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="accessReports" className="h-4 w-4 text-primary" checked />
                      <Label htmlFor="accessReports" className="text-xs font-normal">Reports</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Notification Settings</Label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notifyTaskAssigned" className="h-4 w-4 text-primary" checked />
                      <Label htmlFor="notifyTaskAssigned" className="text-xs font-normal">Task assignments</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notifyDeadlines" className="h-4 w-4 text-primary" checked />
                      <Label htmlFor="notifyDeadlines" className="text-xs font-normal">Upcoming deadlines</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notifyChanges" className="h-4 w-4 text-primary" checked />
                      <Label htmlFor="notifyChanges" className="text-xs font-normal">Project updates</Label>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleAddTeamMember} className="w-full mt-2">Add Team Member</Button>
                
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Team Members ({projectMembers?.length || 0})</h3>
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Search members..." 
                          className="text-xs pl-7 pr-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-36"
                        />
                        <span className="material-icons absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">search</span>
                      </div>
                      <select className="text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 px-2 py-1">
                        <option value="all">All roles</option>
                        <option value="lead">Lead</option>
                        <option value="modeler">3D Modeler</option>
                        <option value="artist">Texture Artist</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {projectMembers?.map((member) => (
                      <div 
                        key={member.id} 
                        className="p-3 border rounded-md hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              {member.user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                        <div className="font-medium">{member.user.name}</div>
                              <div className="flex items-center">
                                <div className="text-sm text-gray-600 mr-2">{member.role}</div>
                                {member.role === 'Lead' && (
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">Lead</span>
                                )}
                              </div>
                        <div className="text-xs mt-1 text-gray-500">{member.user.email}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <div className="flex space-x-1">
                              <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Edit member">
                                <span className="material-icons text-sm">edit</span>
                              </button>
                              <button className="p-1 text-gray-400 hover:text-blue-500 rounded" title="Assign task">
                                <span className="material-icons text-sm">assignment</span>
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-500 rounded" title="Remove member">
                                <span className="material-icons text-sm">delete</span>
                              </button>
                            </div>
                            <div className="text-xs text-gray-500">
                              Added {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div>
                              <span className="font-medium text-gray-700">3</span> tasks assigned
                            </div>
                            <div>
                              Last active: <span className="text-green-600">Today, 2:45 PM</span>
                            </div>
                            <div className="flex items-center">
                              <span className="material-icons text-green-500 text-xs mr-1">circle</span>
                              <span>Online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {projectMembers?.length === 0 && (
                      <div className="text-center py-6 border border-dashed rounded-md">
                        <span className="material-icons text-gray-400 text-3xl">groups</span>
                        <p className="text-gray-500 mt-2">No team members yet</p>
                        <p className="text-xs text-gray-400 mt-1">Add your first team member to get started</p>
                      </div>
                    )}
                  </div>
                  
                  {projectMembers && projectMembers.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="text-sm font-medium mb-2">Team Management Options</h4>
                      <div className="flex flex-wrap gap-2">
                        <button className="flex items-center text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200">
                          <span className="material-icons text-xs mr-1">email</span> Email All
                        </button>
                        <button className="flex items-center text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200">
                          <span className="material-icons text-xs mr-1">cloud_download</span> Export CSV
                        </button>
                        <button className="flex items-center text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200">
                          <span className="material-icons text-xs mr-1">groups</span> Team Roles
                        </button>
                        <button className="flex items-center text-xs text-gray-700 bg-gray-100 px-3 py-1.5 rounded hover:bg-gray-200">
                          <span className="material-icons text-xs mr-1">settings</span> Permissions
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4 mt-4">
            {!selectedProjectId ? (
              <div className="text-center py-4 text-gray-500">Please select a project first</div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="milestoneName">Milestone Name</Label>
                  <Input 
                    id="milestoneName" 
                    value={newMilestoneName} 
                    onChange={(e) => setNewMilestoneName(e.target.value)} 
                    placeholder="Enter milestone name" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <DatePicker
                    date={newMilestoneDeadline}
                    setDate={setNewMilestoneDeadline}
                  />
                </div>
                
                <Button onClick={handleCreateMilestone} className="w-full">Create Milestone</Button>
                
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Milestones ({milestones?.length || 0})</h3>
                  <div className="space-y-2">
                    {milestones?.map((milestone) => (
                      <div 
                        key={milestone.id} 
                        className="p-3 border rounded"
                      >
                        <div className="font-medium">{milestone.name}</div>
                        <div className="text-sm text-gray-600">
                          Deadline: {milestone.dueDate ? new Date(milestone.dueDate).toLocaleDateString() : 'Not set'}
                        </div>
                        <div className="text-xs mt-1 text-gray-500">
                          Status: {milestone.completed ? 'Completed' : 'In progress'}
                        </div>
                      </div>
                    ))}
                    
                    {milestones?.length === 0 && (
                      <div className="text-center py-4 text-gray-500">No milestones yet</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">
          Data is stored in PostgreSQL database
        </div>
      </CardFooter>
    </Card>
  );
}
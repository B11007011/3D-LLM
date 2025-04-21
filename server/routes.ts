import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProjectSchema, 
  insertProjectMemberSchema,
  insertMilestoneSchema,
  insertTaskSchema,
  insertFolderSchema,
  insertFileSchema,
  insertCommentSchema
} from "@shared/schema";
import { ZodError } from "zod";

// Middleware to handle zod validation errors
const handleValidationErrors = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      errors: err.errors
    });
  }
  next(err);
};

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req, res, next) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    const userId = parseInt(req.params.id);
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/projects", async (req, res, next) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    const project = await storage.getProject(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  });

  app.patch("/api/projects/:id", async (req, res, next) => {
    try {
      const projectId = parseInt(req.params.id);
      const projectData = req.body;
      const updatedProject = await storage.updateProject(projectId, projectData);
      if (!updatedProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(updatedProject);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    const projectId = parseInt(req.params.id);
    const success = await storage.deleteProject(projectId);
    if (!success) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(204).end();
  });

  // Project Members routes
  app.get("/api/projects/:projectId/members", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const members = await storage.getProjectMembers(projectId);
    res.json(members);
  });

  app.post("/api/projects/:projectId/members", async (req, res, next) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const memberData = insertProjectMemberSchema.parse({
        ...req.body,
        projectId
      });
      const member = await storage.addProjectMember(memberData);
      res.status(201).json(member);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/projects/:projectId/members/:userId", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const userId = parseInt(req.params.userId);
    const success = await storage.removeProjectMember(projectId, userId);
    if (!success) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(204).end();
  });

  // Milestone routes
  app.get("/api/projects/:projectId/milestones", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const milestones = await storage.getMilestones(projectId);
    res.json(milestones);
  });

  app.post("/api/projects/:projectId/milestones", async (req, res, next) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const milestoneData = insertMilestoneSchema.parse({
        ...req.body,
        projectId
      });
      const milestone = await storage.createMilestone(milestoneData);
      res.status(201).json(milestone);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/milestones/:id", async (req, res) => {
    const milestoneId = parseInt(req.params.id);
    const milestone = await storage.getMilestone(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }
    res.json(milestone);
  });

  app.patch("/api/milestones/:id", async (req, res, next) => {
    try {
      const milestoneId = parseInt(req.params.id);
      const milestoneData = req.body;
      const updatedMilestone = await storage.updateMilestone(milestoneId, milestoneData);
      if (!updatedMilestone) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      res.json(updatedMilestone);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/milestones/:id", async (req, res) => {
    const milestoneId = parseInt(req.params.id);
    const success = await storage.deleteMilestone(milestoneId);
    if (!success) {
      return res.status(404).json({ message: "Milestone not found" });
    }
    res.status(204).end();
  });

  // Task routes
  app.get("/api/projects/:projectId/tasks", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const milestoneId = req.query.milestoneId ? parseInt(req.query.milestoneId as string) : undefined;
    const tasks = await storage.getTasks(projectId, milestoneId);
    res.json(tasks);
  });

  app.post("/api/projects/:projectId/tasks", async (req, res, next) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const taskData = insertTaskSchema.parse({
        ...req.body,
        projectId
      });
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = await storage.getTask(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  });

  app.patch("/api/tasks/:id", async (req, res, next) => {
    try {
      const taskId = parseInt(req.params.id);
      const taskData = req.body;
      const updatedTask = await storage.updateTask(taskId, taskData);
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(updatedTask);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    const taskId = parseInt(req.params.id);
    const success = await storage.deleteTask(taskId);
    if (!success) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(204).end();
  });

  // Folder routes
  app.get("/api/projects/:projectId/folders", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const parentId = req.query.parentId ? parseInt(req.query.parentId as string) : undefined;
    const folders = await storage.getFolders(projectId, parentId);
    res.json(folders);
  });

  app.post("/api/projects/:projectId/folders", async (req, res, next) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const folderData = insertFolderSchema.parse({
        ...req.body,
        projectId
      });
      const folder = await storage.createFolder(folderData);
      res.status(201).json(folder);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/folders/:id", async (req, res) => {
    const folderId = parseInt(req.params.id);
    const folder = await storage.getFolder(folderId);
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.json(folder);
  });

  app.patch("/api/folders/:id", async (req, res, next) => {
    try {
      const folderId = parseInt(req.params.id);
      const folderData = req.body;
      const updatedFolder = await storage.updateFolder(folderId, folderData);
      if (!updatedFolder) {
        return res.status(404).json({ message: "Folder not found" });
      }
      res.json(updatedFolder);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/folders/:id", async (req, res) => {
    const folderId = parseInt(req.params.id);
    const success = await storage.deleteFolder(folderId);
    if (!success) {
      return res.status(404).json({ message: "Folder not found" });
    }
    res.status(204).end();
  });

  // File routes
  app.get("/api/projects/:projectId/files", async (req, res) => {
    const projectId = parseInt(req.params.projectId);
    const folderId = req.query.folderId ? parseInt(req.query.folderId as string) : undefined;
    const files = await storage.getFiles(projectId, folderId);
    res.json(files);
  });

  app.post("/api/projects/:projectId/files", async (req, res, next) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const fileData = insertFileSchema.parse({
        ...req.body,
        projectId
      });
      const file = await storage.createFile(fileData);
      res.status(201).json(file);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/files/:id", async (req, res) => {
    const fileId = parseInt(req.params.id);
    const file = await storage.getFile(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json(file);
  });

  app.patch("/api/files/:id", async (req, res, next) => {
    try {
      const fileId = parseInt(req.params.id);
      const fileData = req.body;
      const updatedFile = await storage.updateFile(fileId, fileData);
      if (!updatedFile) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(updatedFile);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    const fileId = parseInt(req.params.id);
    const success = await storage.deleteFile(fileId);
    if (!success) {
      return res.status(404).json({ message: "File not found" });
    }
    res.status(204).end();
  });

  // File Versions routes
  app.get("/api/files/:fileId/versions", async (req, res) => {
    const fileId = parseInt(req.params.fileId);
    const versions = await storage.getFileVersions(fileId);
    res.json(versions);
  });

  // File Activities routes
  app.get("/api/files/:fileId/activities", async (req, res) => {
    const fileId = parseInt(req.params.fileId);
    const activities = await storage.getFileActivities(fileId);
    res.json(activities);
  });

  // Comment routes
  app.get("/api/tasks/:taskId/comments", async (req, res) => {
    const taskId = parseInt(req.params.taskId);
    const comments = await storage.getTaskComments(taskId);
    res.json(comments);
  });

  app.get("/api/files/:fileId/comments", async (req, res) => {
    const fileId = parseInt(req.params.fileId);
    const comments = await storage.getFileComments(fileId);
    res.json(comments);
  });

  app.post("/api/comments", async (req, res, next) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/comments/:id", async (req, res) => {
    const commentId = parseInt(req.params.id);
    const success = await storage.deleteComment(commentId);
    if (!success) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(204).end();
  });

  // AI/LLM routes
  
  // Route for processing text messages with the LLM
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, history, projectId } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      // In a real implementation, this would call an LLM API
      // For now, just return a mock response
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = {
        text: `I've processed your message: "${message}"`,
        ui: null as string | null,
        tokens: Math.floor(Math.random() * 100) + 50,
        processingTime: Math.floor(Math.random() * 1000) + 200
      };
      
      // Check for UI action triggers
      if (/file|files|manage/i.test(message)) {
        response.text = "I've added file management capabilities to your project. You can now view, organize, and track your project files.";
        response.ui = "fileManagement";
      } else if (/team|teammate|member/i.test(message)) {
        response.text = "I've added your team members to the project dashboard. Would you like to add more details about their roles?";
        response.ui = "teamSetup";
      } else if (/3d|view|model|preview/i.test(message)) {
        response.text = "I've opened the 3D viewer for you. You can interact with your models here.";
        response.ui = "3dView";
      }
      
      res.json(response);
    } catch (error) {
      console.error("Error processing AI message:", error);
      res.status(500).json({ message: "Error processing your request" });
    }
  });
  
  // Route for analyzing 3D models
  app.post("/api/ai/analyze-model", async (req, res) => {
    try {
      const { modelUrl, modelType } = req.body;
      
      if (!modelUrl) {
        return res.status(400).json({ message: "Model URL is required" });
      }
      
      // In a real implementation, this would analyze the 3D model
      // For now, just return a mock response
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const modelInfo = {
        vertices: Math.floor(Math.random() * 10000) + 1000,
        faces: Math.floor(Math.random() * 5000) + 500,
        materials: Math.floor(Math.random() * 5) + 1,
        textures: Math.floor(Math.random() * 3) + 1,
        fileSize: Math.floor(Math.random() * 100) + 5, // MB
        optimizationTips: [
          "Consider reducing polygon count in non-visible areas",
          "Texture resolution could be optimized for better performance",
          "Some mesh elements could be combined for better rendering"
        ]
      };
      
      res.json({
        modelInfo,
        processingTime: Math.floor(Math.random() * 2000) + 1000
      });
    } catch (error) {
      console.error("Error analyzing 3D model:", error);
      res.status(500).json({ message: "Error analyzing the model" });
    }
  });

  // Create the HTTP server
  const server = createServer(app);
  
  // Apply error handling middleware
  app.use(handleValidationErrors);

  return server;
}

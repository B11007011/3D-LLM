import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from 'path';

console.log("Starting server...");
console.log("NODE_ENV:", process.env.NODE_ENV);

const app = express();

// Set up server and middleware
async function setupServer() {
  try {
    // Dynamically import cors
    const corsModule = await import('cors');
    const cors = corsModule.default;
    
    // Middleware
    app.use(cors()); // Allow cross-origin requests
    app.use(express.json({ limit: '50mb' })); // Increase limit for 3D model uploads
    app.use(express.urlencoded({ extended: false }));
    app.use(express.static(path.join(process.cwd(), 'public')));
    app.use(express.static(path.join(process.cwd(), 'dist')));
    
    // Request logging middleware
    app.use((req, res, next) => {
      const start = Date.now();
      const path = req.path;
      let capturedJsonResponse: Record<string, any> | undefined = undefined;

      const originalResJson = res.json;
      res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
      };

      res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
          let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
          
          // Omit large response bodies (like model data) from logs
          if (capturedJsonResponse && path !== "/api/ai/analyze-model") {
            const responseStr = JSON.stringify(capturedJsonResponse);
            if (responseStr.length <= 500) {
              logLine += ` :: ${responseStr}`;
            } else {
              logLine += ` :: [Large response: ${Math.ceil(responseStr.length / 1024)} KB]`;
            }
          }

          if (logLine.length > 80) {
            logLine = logLine.slice(0, 79) + "…";
          }

          log(logLine);
        }
      });

      next();
    });

    // Add a test route
    app.get('/test', (req, res) => {
      res.json({ message: 'Server is running!' });
    });
    
    console.log("Registering routes...");
    const server = await registerRoutes(app);
    console.log("Routes registered successfully");

    // Global error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error("Server error:", err);
      
      // Add specific handling for different types of errors
      if (err.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation Error", 
          errors: err.errors 
        });
      }
      
      // Handle specific error types from the AI services
      if (err.name === 'AIServiceError') {
        return res.status(503).json({ 
          message: "AI Service Unavailable",
          details: err.message
        });
      }
      
      // Default error handling
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      console.log("Setting up Vite in development mode...");
      await setupVite(app, server);
      console.log("Vite setup complete");
    } else {
      console.log("Setting up static serving for production...");
      serveStatic(app);
    }

    // Start the server
    const port = process.env.PORT || 3030;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      console.log(`Server started successfully! Listening on port ${port}`);
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

// Run the server setup function
setupServer();

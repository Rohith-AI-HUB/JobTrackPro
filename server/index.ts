import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes, initializeStorage } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { connectToMongoDB, disconnectFromMongoDB } from "./mongodb";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Try to connect to MongoDB, fallback to memory storage if it fails
    let useMemoryFallback = false;
    try {
      await connectToMongoDB();
      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.log('⚠️  MongoDB connection failed, using memory storage');
      console.log('💡 To use MongoDB: Ensure MongoDB is running on localhost:27017');
      useMemoryFallback = true;
    }
    
    // Initialize storage based on MongoDB availability
    initializeStorage(useMemoryFallback);
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });

    // Gracefully handle shutdown
    process.on('SIGINT', async () => {
      console.log('\n🔄 Gracefully shutting down...');
      await disconnectFromMongoDB();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🔄 Gracefully shutting down...');
      await disconnectFromMongoDB();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

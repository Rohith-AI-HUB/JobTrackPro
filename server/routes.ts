import type { Express } from "express";
import { createServer, type Server } from "http";
import { MongoDBStorage } from "./mongodb-storage";
import { MemStorage } from "./storage";
import { insertApplicationSchema } from "@shared/schema";
import { z } from "zod";

// Try to use MongoDB, fallback to memory storage if MongoDB is not available
let storage: MongoDBStorage | MemStorage;

export function initializeStorage(useMemoryFallback = false) {
  if (useMemoryFallback) {
    console.log('🔄 Using in-memory storage as fallback');
    storage = new MemStorage();
  } else {
    storage = new MongoDBStorage();
  }
  return storage;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all applications
  app.get("/api/applications", async (req, res) => {
    try {
      const { search, status } = req.query;
      
      let applications;
      if (search && typeof search === 'string') {
        applications = await storage.searchApplications(search);
      } else if (status && typeof status === 'string' && status !== 'all') {
        applications = await storage.filterApplicationsByStatus(status);
      } else {
        applications = await storage.getApplications();
      }
      
      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get single application
  app.get("/api/applications/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const application = await storage.getApplication(id);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(application);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch application" });
    }
  });

  // Create new application
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  // Update application
  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const updates = insertApplicationSchema.partial().parse(req.body);
      
      const application = await storage.updateApplication(id, updates);
      
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update application" });
    }
  });

  // Delete application
  app.delete("/api/applications/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const deleted = await storage.deleteApplication(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Application not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete application" });
    }
  });

  // Get dashboard statistics
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      
      const stats = {
        total: applications.length,
        applied: applications.filter(app => app.status === 'applied').length,
        interviewing: applications.filter(app => app.status === 'interviewing').length,
        offers: applications.filter(app => app.status === 'offer').length,
        rejected: applications.filter(app => app.status === 'rejected').length,
        responseRate: applications.length > 0 
          ? Math.round(((applications.length - applications.filter(app => app.status === 'applied').length) / applications.length) * 100)
          : 0
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

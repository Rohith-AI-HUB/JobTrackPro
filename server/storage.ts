import { applications, type Application, type InsertApplication } from "@shared/schema";

export interface IStorage {
  // Application methods
  getApplications(): Promise<Application[]>;
  getApplication(id: string): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: string, updates: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: string): Promise<boolean>;
  searchApplications(query: string): Promise<Application[]>;
  filterApplicationsByStatus(status: string): Promise<Application[]>;
  
  // User methods (keeping for compatibility)
  getUser(id: number): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(user: any): Promise<any>;
}

export class MemStorage implements IStorage {
  private applications: Map<string, Application>;
  private currentId: number;

  constructor() {
    this.applications = new Map();
    this.currentId = 1;
    
    // Initialize with some sample data for demonstration
    this.seedData();
  }

  private async seedData() {
    const sampleApplications = [
      {
        jobTitle: "Senior Frontend Developer",
        company: "Google",
        location: "San Francisco, CA",
        applicationDate: "2025-07-01",
        status: "interviewing" as const,
        jobUrl: "https://careers.google.com/jobs/123",
        notes: "Great opportunity, team seems friendly"
      },
      {
        jobTitle: "Product Manager",
        company: "Apple",
        location: "New York, NY", 
        applicationDate: "2025-06-28",
        status: "offer" as const,
        jobUrl: "https://jobs.apple.com/pm-role",
        notes: "Received offer, considering options"
      },
      {
        jobTitle: "UX Designer",
        company: "Microsoft",
        location: "Seattle, WA",
        applicationDate: "2025-06-25", 
        status: "applied" as const,
        jobUrl: "https://careers.microsoft.com/ux",
        notes: "Waiting for response"
      },
      {
        jobTitle: "Software Engineer",
        company: "Spotify",
        location: "Austin, TX",
        applicationDate: "2025-06-20",
        status: "rejected" as const,
        jobUrl: "https://www.lifeatspotify.com/jobs",
        notes: "Not a good fit according to feedback"
      }
    ];

    for (const app of sampleApplications) {
      await this.createApplication(app);
    }
  }

  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async getApplication(id: string): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    const id = this.currentId.toString();
    this.currentId++;
    
    const newApplication: Application = { 
      id,
      jobTitle: application.jobTitle,
      company: application.company,
      location: application.location || null,
      applicationDate: application.applicationDate,
      status: application.status as "applied" | "interviewing" | "offer" | "rejected",
      jobUrl: application.jobUrl || null,
      notes: application.notes || null
    };
    this.applications.set(id, newApplication);
    return newApplication;
  }

  async updateApplication(id: string, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    const existing = this.applications.get(id);
    if (!existing) return undefined;
    
    const updated: Application = { 
      ...existing, 
      ...updates,
      id: existing.id,
      status: (updates.status || existing.status) as "applied" | "interviewing" | "offer" | "rejected"
    };
    this.applications.set(id, updated);
    return updated;
  }

  async deleteApplication(id: string): Promise<boolean> {
    return this.applications.delete(id);
  }

  async searchApplications(query: string): Promise<Application[]> {
    const lowerQuery = query.toLowerCase();
    const allApps = await this.getApplications();
    return allApps.filter(app => 
      app.jobTitle.toLowerCase().includes(lowerQuery) ||
      app.company.toLowerCase().includes(lowerQuery)
    );
  }

  async filterApplicationsByStatus(status: string): Promise<Application[]> {
    const allApps = await this.getApplications();
    return allApps.filter(app => app.status === status);
  }

  // User methods (keeping for compatibility)
  async getUser(id: number): Promise<any> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any> {
    return undefined;
  }

  async createUser(user: any): Promise<any> {
    return undefined;
  }
}

export const storage = new MemStorage();

import { ApplicationModel } from './mongodb';
import { type Application, type InsertApplication } from '@shared/schema';
import { IStorage } from './storage';

export class MongoDBStorage implements IStorage {
  
  async getApplications(): Promise<Application[]> {
    try {
      const applications = await ApplicationModel.find({}).lean();
      return applications.map(app => ({
        id: app._id.toString(),
        jobTitle: app.jobTitle,
        company: app.company,
        location: app.location,
        applicationDate: app.applicationDate,
        status: app.status as "applied" | "interviewing" | "offer" | "rejected",
        jobUrl: app.jobUrl,
        notes: app.notes
      }));
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  async getApplication(id: string): Promise<Application | undefined> {
    try {
      const application = await ApplicationModel.findById(id).lean();
      if (!application) return undefined;
      
      return {
        id: application._id.toString(),
        jobTitle: application.jobTitle,
        company: application.company,
        location: application.location,
        applicationDate: application.applicationDate,
        status: application.status as "applied" | "interviewing" | "offer" | "rejected",
        jobUrl: application.jobUrl,
        notes: application.notes
      };
    } catch (error) {
      console.error('Error fetching application:', error);
      return undefined;
    }
  }

  async createApplication(application: InsertApplication): Promise<Application> {
    try {
      const newApplication = new ApplicationModel(application);
      const savedApplication = await newApplication.save();
      
      return {
        id: savedApplication._id.toString(),
        jobTitle: savedApplication.jobTitle,
        company: savedApplication.company,
        location: savedApplication.location,
        applicationDate: savedApplication.applicationDate,
        status: savedApplication.status as "applied" | "interviewing" | "offer" | "rejected",
        jobUrl: savedApplication.jobUrl,
        notes: savedApplication.notes
      };
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  async updateApplication(id: string, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    try {
      const updatedApplication = await ApplicationModel.findByIdAndUpdate(
        id,
        updates,
        { new: true }
      ).lean();
      
      if (!updatedApplication) return undefined;
      
      return {
        id: updatedApplication._id.toString(),
        jobTitle: updatedApplication.jobTitle,
        company: updatedApplication.company,
        location: updatedApplication.location,
        applicationDate: updatedApplication.applicationDate,
        status: updatedApplication.status as "applied" | "interviewing" | "offer" | "rejected",
        jobUrl: updatedApplication.jobUrl,
        notes: updatedApplication.notes
      };
    } catch (error) {
      console.error('Error updating application:', error);
      return undefined;
    }
  }

  async deleteApplication(id: string): Promise<boolean> {
    try {
      const result = await ApplicationModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting application:', error);
      return false;
    }
  }

  async searchApplications(query: string): Promise<Application[]> {
    try {
      const searchQuery = {
        $or: [
          { jobTitle: { $regex: query, $options: 'i' } },
          { company: { $regex: query, $options: 'i' } }
        ]
      };
      
      const applications = await ApplicationModel.find(searchQuery).lean();
      return applications.map(app => ({
        id: app._id.toString(),
        jobTitle: app.jobTitle,
        company: app.company,
        location: app.location,
        applicationDate: app.applicationDate,
        status: app.status as "applied" | "interviewing" | "offer" | "rejected",
        jobUrl: app.jobUrl,
        notes: app.notes
      }));
    } catch (error) {
      console.error('Error searching applications:', error);
      throw error;
    }
  }

  async filterApplicationsByStatus(status: string): Promise<Application[]> {
    try {
      const applications = await ApplicationModel.find({ status }).lean();
      return applications.map(app => ({
        id: app._id.toString(),
        jobTitle: app.jobTitle,
        company: app.company,
        location: app.location,
        applicationDate: app.applicationDate,
        status: app.status as "applied" | "interviewing" | "offer" | "rejected",
        jobUrl: app.jobUrl,
        notes: app.notes
      }));
    } catch (error) {
      console.error('Error filtering applications:', error);
      throw error;
    }
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
import mongoose from 'mongoose';
import { type Application, type InsertApplication } from '@shared/schema';

// MongoDB Schema for Applications
const applicationSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: null },
  applicationDate: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['applied', 'interviewing', 'offer', 'rejected']
  },
  jobUrl: { type: String, default: null },
  notes: { type: String, default: null }
}, {
  timestamps: false,
  versionKey: false
});

export const ApplicationModel = mongoose.model('Application', applicationSchema);

// Connection function
export async function connectToMongoDB() {
  try {
    // MongoDB Compass default connection string (local MongoDB instance)
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/jobtracker';
    
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');
    
    // Seed data if collection is empty
    await seedDataIfEmpty();
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

async function seedDataIfEmpty() {
  try {
    const count = await ApplicationModel.countDocuments();
    
    if (count === 0) {
      console.log('📝 Seeding initial data...');
      
      const sampleApplications = [
        {
          jobTitle: "Senior Frontend Developer",
          company: "Google",
          location: "San Francisco, CA",
          applicationDate: "2025-07-01",
          status: "interviewing",
          jobUrl: "https://careers.google.com/jobs/123",
          notes: "Great opportunity, team seems friendly"
        },
        {
          jobTitle: "Product Manager",
          company: "Apple",
          location: "New York, NY", 
          applicationDate: "2025-06-28",
          status: "offer",
          jobUrl: "https://jobs.apple.com/pm-role",
          notes: "Received offer, considering options"
        },
        {
          jobTitle: "UX Designer",
          company: "Microsoft",
          location: "Seattle, WA",
          applicationDate: "2025-06-25", 
          status: "applied",
          jobUrl: "https://careers.microsoft.com/ux",
          notes: "Waiting for response"
        },
        {
          jobTitle: "Software Engineer",
          company: "Spotify",
          location: "Austin, TX",
          applicationDate: "2025-06-20",
          status: "rejected",
          jobUrl: "https://www.lifeatspotify.com/jobs",
          notes: "Not a good fit according to feedback"
        }
      ];
      
      await ApplicationModel.insertMany(sampleApplications);
      console.log('✅ Sample data seeded successfully');
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

export async function disconnectFromMongoDB() {
  try {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ MongoDB disconnect error:', error);
  }
}
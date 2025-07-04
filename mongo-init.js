// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the jobtracker database
db = db.getSiblingDB('jobtracker');

// Create a user for the jobtracker database
db.createUser({
  user: 'jobtracker_user',
  pwd: 'jobtracker_password',
  roles: [
    {
      role: 'readWrite',
      db: 'jobtracker'
    }
  ]
});

// Create the applications collection
db.createCollection('applications');

// Insert sample data
db.applications.insertMany([
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
]);

print('Database initialized with sample data');
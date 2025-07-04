# MongoDB Setup Guide for JobTracker

This guide will help you set up MongoDB locally and connect it to your JobTracker application using MongoDB Compass.

## Prerequisites

1. **Install MongoDB Community Edition**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the appropriate version for your operating system
   - Follow the installation instructions for your platform

2. **Install MongoDB Compass** (GUI Tool)
   - Visit: https://www.mongodb.com/try/download/compass
   - Download and install MongoDB Compass for your operating system

## Quick Setup Steps

### 1. Start MongoDB Service

**On Windows:**
```bash
# Open Command Prompt as Administrator
net start MongoDB

# Or if installed via installer:
mongod --dbpath "C:\data\db"
```

**On macOS:**
```bash
# If installed via Homebrew:
brew services start mongodb-community

# Or manually:
mongod --dbpath /usr/local/var/mongodb
```

**On Linux:**
```bash
# Using systemctl:
sudo systemctl start mongod

# Or manually:
mongod --dbpath /var/lib/mongodb
```

### 2. Verify MongoDB is Running

Open a terminal and run:
```bash
mongo --eval "db.runCommand({ connectionStatus: 1 })"
```

You should see a successful connection status.

### 3. Connect with MongoDB Compass

1. Open MongoDB Compass
2. Use the default connection string: `mongodb://localhost:27017`
3. Click "Connect"
4. You should see the MongoDB interface with available databases

### 4. Configure Environment Variables

Create a `.env` file in your project root (if it doesn't exist):
```env
MONGODB_URL=mongodb://localhost:27017/jobtracker
```

### 5. Start Your Application

The JobTracker application will automatically:
- Connect to MongoDB when starting
- Create the `jobtracker` database
- Seed sample data if the database is empty
- Display connection status in the console

## Database Structure

The application creates:
- **Database**: `jobtracker`
- **Collection**: `applications`
- **Sample Documents**: 4 initial job applications

## Viewing Data in MongoDB Compass

1. Connect to `mongodb://localhost:27017`
2. Navigate to the `jobtracker` database
3. Click on the `applications` collection
4. View and manage your job application data

## Troubleshooting

### MongoDB Won't Start
- Check if the data directory exists and has proper permissions
- Ensure port 27017 is not being used by another service
- Check MongoDB logs for specific error messages

### Connection Issues
- Verify MongoDB service is running: `ps aux | grep mongod`
- Check if the port is accessible: `telnet localhost 27017`
- Ensure no firewall is blocking the connection

### Permission Issues
- Make sure the MongoDB data directory has proper write permissions
- Run MongoDB service with appropriate user privileges

## Advanced Configuration

### Custom MongoDB Port
If you need to use a different port, update your `.env` file:
```env
MONGODB_URL=mongodb://localhost:27018/jobtracker
```

### Remote MongoDB
To connect to a remote MongoDB instance:
```env
MONGODB_URL=mongodb://username:password@your-server:27017/jobtracker
```

## Success Indicators

When everything is working correctly, you should see:
1. ✅ Connected to MongoDB (in console)
2. 📝 Seeding initial data... (if database is empty)
3. ✅ Sample data seeded successfully
4. MongoDB Compass shows the `jobtracker` database with `applications` collection
5. The JobTracker web application loads and displays sample data
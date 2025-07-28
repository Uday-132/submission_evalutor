# MongoDB Local Setup Guide

## Windows Installation

### Method 1: MongoDB Community Server
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service (recommended)
5. Install MongoDB Compass (GUI tool) when prompted

### Method 2: Using Chocolatey (if you have it)
```bash
choco install mongodb
```

### Method 3: Using Scoop (if you have it)
```bash
scoop install mongodb
```

## Starting MongoDB

### If installed as Windows Service:
MongoDB should start automatically. If not:
```bash
net start MongoDB
```

### Manual start:
```bash
mongod --dbpath "C:\data\db"
```

## Verify Installation
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ismaster')"

# Or connect with MongoDB Compass to: mongodb://localhost:27017
```

## Alternative: Docker
If you have Docker installed:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Cloud Alternative: MongoDB Atlas
1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Get your connection string
5. Update MONGODB_URI in .env file
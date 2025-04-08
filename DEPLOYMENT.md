# Deployment Guide

## Using Replit (Recommended)

This guide explains how to deploy this application on Replit.

### Prerequisites
- A Replit account
- Your project imported into Replit

### Deployment Steps
1. Ensure your application is working locally by clicking the "Run" button in Replit.
2. Click the "Deploy" button at the top of your Replit workspace.
3. Configure your deployment settings:
   - Build Command: `npm run build`
   - Run Command: `npm run start`
4. Select your desired deployment tier based on your needs.
5. Click "Deploy" to start the deployment process.

Your application will be deployed to a public URL in the format: `https://your-app-name.replit.app`

## Local Development

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later
- PostgreSQL database

### Setup Steps
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file
   - Add your database URL: `DATABASE_URL=postgres://...`

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5000`

### Environment Variables
All sensitive information should be stored in environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session management

### Troubleshooting
If you encounter issues:
1. Check the build logs for errors
2. Ensure all dependencies are properly listed in package.json
3. Verify your build and run commands are correct
4. Make sure your application is listening on port 5000

### Monitoring
Monitor your application through:
- Server logs
- Database logs
- Application metrics

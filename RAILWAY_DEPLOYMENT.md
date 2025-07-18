# Real Estate Cursor MVP - Railway Deployment Guide

This guide provides instructions for deploying the Real Estate Cursor MVP application on Railway.

## Pre-deployment Setup

1. Make sure you have a Railway account
2. Install the Railway CLI (optional but recommended)
   ```
   npm install -g @railway/cli
   ```
3. Login to Railway
   ```
   railway login
   ```

## Required Environment Variables

Set the following environment variables in your Railway project:

- `DATABASE_URL`: Your PostgreSQL connection string (Railway will auto-populate if using their PostgreSQL plugin)
- `JWT_SECRET`: Secret key for JWT authentication
- `NODE_ENV`: Set to "production"
- `OPENAI_API_KEY`: Your OpenAI API key (if using AI features)
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Your Cloudinary API key
- `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

## Deployment Steps

### Option 1: Deploy via Railway Dashboard

1. Fork or clone this repository to your GitHub account
2. Go to [Railway Dashboard](https://railway.app/dashboard)
3. Click "New Project" > "Deploy from GitHub repo"
4. Select your forked repository
5. Configure the environment variables
6. Railway will automatically detect the configuration and deploy

### Option 2: Deploy via Railway CLI

1. Navigate to your project directory
2. Initialize a new Railway project
   ```
   railway init
   ```
3. Link to an existing project or create a new one
4. Set up your environment variables
   ```
   railway vars set DATABASE_URL=... JWT_SECRET=... 
   ```
5. Deploy the application
   ```
   railway up
   ```

## Verifying Deployment

1. Check the deployment logs in the Railway dashboard
2. Visit your application URL (provided by Railway)
3. Test the health endpoint: `https://your-app-url.railway.app/health`
4. Test the API endpoints using Postman or another API client

## Troubleshooting

If you encounter the "Application Failed to Respond" error:

1. Check the Railway logs for specific error messages
2. Verify that the application is binding to `0.0.0.0` and using the correct port
3. Ensure all required environment variables are set
4. Check if the database migrations have been applied
5. Try restarting the service from the Railway dashboard

## Railway Specifics

This deployment uses:
- Node.js 18
- Prisma ORM for database access
- Railway's PostgreSQL plugin
- Custom Railway configuration files:
  - `railway-index.js` - Main application entry point
  - `railway.package.json` - Package configuration
  - `nixpacks.toml` - Build configuration
  - `railway.toml` - Deployment configuration

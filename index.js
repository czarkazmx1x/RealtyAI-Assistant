// Modified index.js for Railway deployment
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import routes and middleware
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import { pool } from './db.js'; // Use the dedicated db file

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Static files
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Real Estate Server Running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Direct test routes for debugging
app.post('/api/test-register', async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const result = await pool.query(
      'INSERT INTO "User" (email, name, password) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, name, hashedPassword]
    );
    
    const user = result.rows[0];
    
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback_secret_for_testing', { expiresIn: '1d' });
    
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Server error', details: error.message, stack: error.stack });
  }
});

// Database connectivity check endpoint
app.get('/api/db-check', async (req, res) => {
  try {
    // Test database connection
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW() as time');
      return res.json({
        success: true,
        message: 'Database connection successful',
        timestamp: result.rows[0].time,
        connectionString: process.env.DATABASE_URL ? 'Available (hidden)' : 'Not available'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      hint: 'Check DATABASE_URL environment variable and database server status'
    });
  }
});

// Database initialization endpoint
app.post('/api/init-database', async (req, res) => {
  try {
    console.log('Database initialization endpoint called');
    
    // Create a client directly instead of using the pool for this operation
    const client = await pool.connect();
    
    try {
      // Create each table individually to better handle errors
      
      // User table
      console.log('Creating User table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS "User" (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          password TEXT NOT NULL
        );
      `);
      
      // Listing table
      console.log('Creating Listing table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Listing" (
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          address TEXT NOT NULL,
          price DOUBLE PRECISION NOT NULL,
          description TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'AVAILABLE',
          "imageUrls" TEXT,
          "ownerId" INTEGER NOT NULL
        );
      `);
      
      // Lead table
      console.log('Creating Lead table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Lead" (
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          phone TEXT,
          source TEXT,
          status TEXT NOT NULL DEFAULT 'NEW',
          score INTEGER NOT NULL DEFAULT 0
        );
      `);
      
      // Task table
      console.log('Creating Task table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS "Task" (
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          description TEXT NOT NULL,
          "dueDate" TIMESTAMP,
          completed BOOLEAN NOT NULL DEFAULT false,
          "assigneeId" INTEGER
        );
      `);
      
      // SocialPost table
      console.log('Creating SocialPost table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS "SocialPost" (
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          content TEXT NOT NULL,
          platform TEXT NOT NULL DEFAULT 'Nextdoor',
          "authorId" INTEGER NOT NULL
        );
      `);
      
      // ActivityLog table
      console.log('Creating ActivityLog table...');
      await client.query(`
        CREATE TABLE IF NOT EXISTS "ActivityLog" (
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          type TEXT NOT NULL,
          details TEXT NOT NULL
        );
      `);
      
      // Add foreign key constraints
      console.log('Adding foreign key constraints...');
      await client.query(`
        ALTER TABLE "Listing" 
        ADD CONSTRAINT IF NOT EXISTS "Listing_ownerId_fkey" 
        FOREIGN KEY ("ownerId") REFERENCES "User"(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE;
        
        ALTER TABLE "Task" 
        ADD CONSTRAINT IF NOT EXISTS "Task_assigneeId_fkey" 
        FOREIGN KEY ("assigneeId") REFERENCES "User"(id) 
        ON DELETE SET NULL ON UPDATE CASCADE;
        
        ALTER TABLE "SocialPost" 
        ADD CONSTRAINT IF NOT EXISTS "SocialPost_authorId_fkey" 
        FOREIGN KEY ("authorId") REFERENCES "User"(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE;
      `);
      
      console.log('Database initialization completed successfully');
      
      return res.json({
        success: true,
        message: 'Database schema initialized successfully'
      });
    } catch (err) {
      console.error('Error executing SQL:', err);
      return res.status(500).json({
        success: false,
        error: `Database initialization failed: ${err.message}`,
        stack: err.stack
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Property description generator endpoint
app.post('/api/property-description', (req, res) => {
  try {
    const { propertyFeatures, tone } = req.body;
    
    if (!propertyFeatures || propertyFeatures.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: propertyFeatures'
      });
    }

    const selectedTone = tone || 'Professional';
    
    const templates = {
      'Luxury': 'Indulge in the epitome of sophistication with this exquisite property! ' + propertyFeatures + ' This remarkable residence epitomizes luxury living at its finest. Schedule your private viewing today to experience unparalleled elegance.',
      'Casual': 'Check out this awesome property! ' + propertyFeatures + ' This place has everything you need and more! Give us a call to set up a viewing - you\'re going to love it!',
      'Professional': 'This exceptional property offers ' + propertyFeatures + ' This well-appointed residence provides an excellent opportunity for discerning buyers. Contact our team today to arrange a viewing.',
      'Excited': 'WOW! You absolutely MUST see this incredible property! ' + propertyFeatures + ' This is THE property you\'ve been waiting for! Don\'t let this AMAZING opportunity slip away - call NOW!'
    };

    const description = templates[selectedTone] || templates['Professional'];

    res.json({
      success: true,
      description: description,
      metadata: {
        tone: selectedTone,
        timestamp: new Date().toISOString(),
        generator: 'Template-based (Railway)',
        word_count: description.split(/\s+/).length
      }
    });

  } catch (error) {
    console.error('Error generating property description:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Basic route handlers for other endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint working' });
});

app.get('/api/leads', (req, res) => {
  res.json({ message: 'Leads API endpoint' });
});

app.get('/api/tasks', (req, res) => {
  res.json({ message: 'Tasks API endpoint' });
});

app.get('/api/posts', (req, res) => {
  res.json({ message: 'Posts API endpoint' });
});

app.get('/api/activitylogs', (req, res) => {
  res.json({ message: 'Activity Logs API endpoint' });
});

app.get('/api/integrations', (req, res) => {
  res.json({ message: 'Integrations API endpoint' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Real Estate Property Generator',
    status: 'running',
    endpoints: {
      health: '/health',
      dbCheck: '/api/db-check',
      test: '/api/test',
      propertyDescription: '/api/property-description',
      initDatabase: '/api/init-database',
      auth: '/api/auth',
      register: '/api/auth/register',
      login: '/api/auth/login',
      listings: '/api/listings',
      leads: '/api/leads',
      tasks: '/api/tasks',
      posts: '/api/posts',
      activityLogs: '/api/activitylogs',
      integrations: '/api/integrations'
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      status: 404
    }
  });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on host 0.0.0.0 and port ${port}`);
});
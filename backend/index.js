const express = require('express');
const cors = require('cors');

const app = express();

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'; // Default for React dev server

// CORS configuration
const corsOptions = {
  origin: FRONTEND_ORIGIN,
  optionsSuccessStatus: 200 // For legacy browser support
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Health-check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Placeholder for other API routes (e.g., properties, users, agents)
// const propertiesRoutes = require('./routes/properties');
// app.use('/api/properties', propertiesRoutes);

// Placeholder for database connection (using process.env.DATABASE_URL)
// const { Pool } = require('pg');
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
// });

// Placeholder for API keys (using process.env.API_KEY_NAME)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origin: ${FRONTEND_ORIGIN}`);
});
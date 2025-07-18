// Add this to your index.js file

// Database initialization endpoint (for admin use only)
app.post('/api/init-database', async (req, res) => {
  try {
    // Read the schema.sql file
    const fs = require('fs');
    const path = require('path');
    const { Pool } = require('pg');
    
    const sqlPath = path.join(__dirname, 'schema.sql');
    let sql;
    
    try {
      sql = fs.readFileSync(sqlPath, 'utf8');
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: `Could not read schema file: ${err.message}`
      });
    }
    
    // Connect to the database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    // Execute the SQL
    try {
      await pool.query(sql);
      return res.json({
        success: true,
        message: 'Database schema initialized successfully'
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        error: `Database initialization failed: ${err.message}`
      });
    } finally {
      await pool.end();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

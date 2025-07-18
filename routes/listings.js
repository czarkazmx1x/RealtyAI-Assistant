import express from 'express';
import { pool } from '../db.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Get all listings
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, u.name as owner_name 
      FROM "Listing" l
      JOIN "User" u ON l."ownerId" = u.id
      ORDER BY l."createdAt" DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get listing by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT l.*, u.name as owner_name 
      FROM "Listing" l
      JOIN "User" u ON l."ownerId" = u.id
      WHERE l.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new listing (protected)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { address, price, description, status, imageUrls } = req.body;
    const ownerId = req.user.id; // From auth middleware
    
    // Validate input
    if (!address || !price || !description) {
      return res.status(400).json({ error: 'Address, price, and description are required' });
    }
    
    const result = await pool.query(`
      INSERT INTO "Listing" (address, price, description, status, "imageUrls", "ownerId")
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [address, price, description, status || 'AVAILABLE', imageUrls, ownerId]);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update listing (protected)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { address, price, description, status, imageUrls } = req.body;
    const userId = req.user.id; // From auth middleware
    
    // Check if listing exists and belongs to user
    const listing = await pool.query('SELECT * FROM "Listing" WHERE id = $1', [id]);
    
    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    if (listing.rows[0].ownerId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }
    
    const result = await pool.query(`
      UPDATE "Listing"
      SET address = $1, price = $2, description = $3, status = $4, "imageUrls" = $5, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `, [
      address || listing.rows[0].address,
      price || listing.rows[0].price,
      description || listing.rows[0].description,
      status || listing.rows[0].status,
      imageUrls || listing.rows[0].imageUrls,
      id
    ]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete listing (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // From auth middleware
    
    // Check if listing exists and belongs to user
    const listing = await pool.query('SELECT * FROM "Listing" WHERE id = $1', [id]);
    
    if (listing.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    
    if (listing.rows[0].ownerId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }
    
    await pool.query('DELETE FROM "Listing" WHERE id = $1', [id]);
    
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
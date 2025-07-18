const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming db.js handles the pool connection

// Get all properties
router.get('/', async (req, res) => {
    try {
        const allProperties = await pool.query('SELECT * FROM properties');
        res.json(allProperties.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get a single property
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const property = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
        if (property.rows.length === 0) {
            return res.status(404).json({ msg: 'Property not found' });
        }
        res.json(property.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a property
router.post('/', async (req, res) => {
    try {
        const { address, price, description, property_type, bedrooms, bathrooms, image_urls } = req.body;
        const newProperty = await pool.query(
            'INSERT INTO properties (address, price, description, property_type, bedrooms, bathrooms, image_urls) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING * ',
            [address, price, description, property_type, bedrooms, bathrooms, image_urls]
        );
        res.json(newProperty.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a property
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { address, price, description, property_type, bedrooms, bathrooms, image_urls } = req.body;
        const updateProperty = await pool.query(
            'UPDATE properties SET address = $1, price = $2, description = $3, property_type = $4, bedrooms = $5, bathrooms = $6, image_urls = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING * ',
            [address, price, description, property_type, bedrooms, bathrooms, image_urls, id]
        );
        if (updateProperty.rows.length === 0) {
            return res.status(404).json({ msg: 'Property not found' });
        }
        res.json(updateProperty.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a property
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteProperty = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING * ', [id]);
        if (deleteProperty.rows.length === 0) {
            return res.status(404).json({ msg: 'Property not found' });
        }
        res.json({ msg: 'Property deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

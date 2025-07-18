const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all agents
router.get('/', async (req, res) => {
    try {
        const allAgents = await pool.query('SELECT * FROM agents');
        res.json(allAgents.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get a single agent
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const agent = await pool.query('SELECT * FROM agents WHERE id = $1', [id]);
        if (agent.rows.length === 0) {
            return res.status(404).json({ msg: 'Agent not found' });
        }
        res.json(agent.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create an agent
router.post('/', async (req, res) => {
    try {
        const { user_id, first_name, last_name, email, phone_number, bio, profile_picture_url } = req.body;
        const newAgent = await pool.query(
            'INSERT INTO agents (user_id, first_name, last_name, email, phone_number, bio, profile_picture_url) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING * ',
            [user_id, first_name, last_name, email, phone_number, bio, profile_picture_url]
        );
        res.json(newAgent.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update an agent
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, first_name, last_name, email, phone_number, bio, profile_picture_url } = req.body;
        const updateAgent = await pool.query(
            'UPDATE agents SET user_id = $1, first_name = $2, last_name = $3, email = $4, phone_number = $5, bio = $6, profile_picture_url = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING * ',
            [user_id, first_name, last_name, email, phone_number, bio, profile_picture_url, id]
        );
        if (updateAgent.rows.length === 0) {
            return res.status(404).json({ msg: 'Agent not found' });
        }
        res.json(updateAgent.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete an agent
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteAgent = await pool.query('DELETE FROM agents WHERE id = $1 RETURNING * ', [id]);
        if (deleteAgent.rows.length === 0) {
            return res.status(404).json({ msg: 'Agent not found' });
        }
        res.json({ msg: 'Agent deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// Get all users
router.get('/', async (req, res) => {
    try {
        const allUsers = await pool.query('SELECT id, username, email, role, created_at, updated_at FROM users');
        res.json(allUsers.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get a single user
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await pool.query('SELECT id, username, email, role, created_at, updated_at FROM users WHERE id = $1', [id]);
        if (user.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a user (e.g., for registration)
router.post('/', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash, role) VALUES($1, $2, $3, $4) RETURNING id, username, email, role, created_at, updated_at',
            [username, email, password_hash, role]
        );
        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role } = req.body;
        const updateUser = await pool.query(
            'UPDATE users SET username = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, username, email, role, created_at, updated_at',
            [username, email, role, id]
        );
        if (updateUser.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(updateUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
        if (deleteUser.rows.length === 0) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

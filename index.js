const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

// GET ALL
app.get('/api/users', async (req, res) => {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
});

// GET BY ID
app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM users WHERE id=$1', [id]);
    res.json(result.rows[0]);
});

// POST
app.post('/api/users', async (req, res) => {
    const { name, email } = req.body;
    const result = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
        [name, email]
    );
    res.json(result.rows[0]);
});

// PUT
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await pool.query(
        'UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *',
        [name, email, id]
    );
    res.json(result.rows[0]);
});

// DELETE
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    res.json({ message: 'User deleted' });
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
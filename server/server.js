
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize Database Table
(async () => {
    try {
        const client = await pool.connect();
        await client.query(`
            CREATE TABLE IF NOT EXISTS members (
                id SERIAL PRIMARY KEY,
                name TEXT,
                email TEXT,
                department TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Connected to PostgreSQL database and verified table.');
        client.release();
    } catch (error) {
        console.error('Failed to connect to database:', error);
    }
})();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.get('/api/members', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM members');
        res.json({ status: 'success', data: rows });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

app.post('/api/join', async (req, res) => {
    const { name, email, department } = req.body;

    if (!name || !email || !department) {
        return res.status(400).json({ status: 'error', message: 'Missing required fields' });
    }

    try {
        // Insert into database
        await pool.query(
            'INSERT INTO members (name, email, department) VALUES ($1, $2, $3)',
            [name, email, department]
        );

        console.log('New member added:', { name, email, department });
        res.json({ status: 'success', message: 'Application received' });
    } catch (error) {
        console.error('Error saving to database:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

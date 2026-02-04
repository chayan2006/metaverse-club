
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup
let db;
(async () => {
    try {
        db = await open({
            filename: path.join(__dirname, '../database/database.sqlite'),
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                department TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Connected to SQLite database.');
    } catch (error) {
        console.error('Failed to connect to database:', error);
    }
})();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// API Routes
app.get('/api/members', async (req, res) => {
    try {
        if (!db) throw new Error('Database not initialized');
        const members = await db.all('SELECT * FROM members');
        res.json({ status: 'success', data: members });
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
        if (!db) throw new Error('Database not initialized');

        // Insert into database
        await db.run(
            'INSERT INTO members (name, email, department) VALUES (?, ?, ?)',
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

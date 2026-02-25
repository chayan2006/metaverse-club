
import 'dotenv/config'; // Load environment variables
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import ExcelJS from 'exceljs';
import multer from 'multer';
import fs from 'fs';

const { Pool } = pg;
import { sendRegistrationEmail, sendJoinEmail } from './utils/emailService.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: true, // Allow any origin (reflects the request origin)
    credentials: true // Allow cookies
}));
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Serve uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    connectionTimeoutMillis: 30000, // Wait 30s for Render cold start
});

(async () => {
    try {
        console.log('Attempting to connect to PostgreSQL...');
        const client = await pool.connect();
        console.log('Connected to PostgreSQL database.');
        client.release();

        // Initialize Tables
        // NOTE: Removed DROP TABLE logic to ensure data persistence.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS teams (
                id SERIAL PRIMARY KEY,
                event_id TEXT NOT NULL, 
                name TEXT,
                type TEXT NOT NULL, 
                total_amount REAL NOT NULL, 
                transaction_id TEXT, 
                screenshot_path TEXT, 
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS participants (
                id SERIAL PRIMARY KEY,
                team_id INTEGER REFERENCES teams(id),
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                role TEXT NOT NULL, 
                college_or_work TEXT,
                address TEXT,
                ticket_id TEXT,
                registration_number TEXT,
                payment_status TEXT DEFAULT 'Pending',
                amount_paid REAL
            );
        `);

        // Migration to add columns if they don't exist (for existing tables)
        try {
            await pool.query(`ALTER TABLE participants ADD COLUMN IF NOT EXISTS college_or_work TEXT;`);
            await pool.query(`ALTER TABLE participants ADD COLUMN IF NOT EXISTS address TEXT;`);
            await pool.query(`ALTER TABLE participants ADD COLUMN IF NOT EXISTS ticket_id TEXT;`);
            await pool.query(`ALTER TABLE participants ADD COLUMN IF NOT EXISTS registration_number TEXT;`);
        } catch (e) {
            console.log('Migration note: Columns might already exist or error in alter:', e.message);
        }

        console.log('Database tables verified/created with PostgreSQL schema.');
    } catch (error) {
        console.error('Failed to connect to database:', error);
    }
})();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/dist')));

// Helper: Calculate Price
const calculatePrice = (type, members) => {
    const BASE_PRICE = 170;
    let total = 0;

    members.forEach(member => {
        let memberPrice = BASE_PRICE;
        if (member.role === 'Both') {
            memberPrice *= 2;
        }
        total += memberPrice;
    });

    return total;
};

// API Routes

// Helper to validate request data
const validateRegistration = (type, members) => {
    if (!['Solo', 'Duo', 'Squad'].includes(type)) return 'Invalid team type';
    if (!members || !Array.isArray(members)) return 'Invalid members data';

    if (type === 'Solo' && members.length !== 1) return 'Solo team must have exactly 1 member';
    if (type === 'Duo' && members.length !== 2) return 'Duo team must have exactly 2 members';
    if (type === 'Squad' && members.length !== 4) return 'Squad must have exactly 4 members';

    for (const m of members) {
        if (!m.name || !m.email || !m.role) return 'Missing member details';
        if (!m.registration_number) return 'Missing Registration ID'; // Enforce new field
        if (!['Developer', 'Attacker', 'Both'].includes(m.role)) return 'Invalid role';
    }
    return null;
};

app.post('/api/register', upload.single('screenshot'), async (req, res) => {
    console.log('📝 Received registration request');
    const client = await pool.connect();
    console.log('🔌 Database client connected');
    try {
        console.log('📦 Body:', req.body);
        console.log('📁 File:', req.file);

        let { teamName, type, members, eventId } = req.body;
        const transactionId = req.body.transactionId;
        const screenshotPath = req.file ? `/uploads/${req.file.filename}` : null;

        // Parse members if it comes as a string (FormData sends JSON strings)
        if (typeof members === 'string') {
            try {
                members = JSON.parse(members);
                console.log('Parsed members:', members);
            } catch (e) {
                console.error('Failed to parse members JSON:', e);
                return res.status(400).json({ status: 'error', message: 'Invalid members JSON' });
            }
        }

        if (!eventId) eventId = '1';

        const validationError = validateRegistration(type, members);
        if (validationError) {
            console.error('Validation error:', validationError);
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ status: 'error', message: validationError });
        }

        if (!transactionId || !screenshotPath) {
            console.error('Missing payment details');
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ status: 'error', message: 'Payment details missing' });
        }

        const expectedPrice = calculatePrice(type, members);

        await client.query('BEGIN');

        const teamResult = await client.query(
            'INSERT INTO teams (name, type, event_id, total_amount, transaction_id, screenshot_path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [teamName || `${members[0].name}'s Team`, type, eventId, expectedPrice, transactionId, screenshotPath]
        );
        const teamId = teamResult.rows[0].id;
        const ticketIds = [];

        for (const member of members) {
            let memberCost = 170;
            if (member.role === 'Both') memberCost *= 2;

            // Generate unique ticket ID: MVS-{Year}-{Random4}-{Random4}
            const uniqueSuffix = Math.floor(1000 + Math.random() * 9000);
            const ticketId = `MVS-2025-${teamId}-${uniqueSuffix}`;
            ticketIds.push(ticketId);

            await client.query(
                'INSERT INTO participants (team_id, name, email, phone, role, college_or_work, address, ticket_id, registration_number, payment_status, amount_paid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                [teamId, member.name, member.email, member.phone, member.role, null, null, ticketId, member.registration_number, 'Paid', memberCost]
            );
        }

        await client.query('COMMIT');

        console.log(`Registered team: ${teamName} (${type}). Total: ₹${expectedPrice}. Tickets: ${ticketIds.join(', ')}`);
        // Send Email Notification
        if (screenshotPath) {
            const memberNames = members.map(m => m.name);
            for (const member of members) {
                if (member.email) {
                    await sendRegistrationEmail(member.email, teamName || `${members[0].name}'s Team`, memberNames, eventId).catch(console.error);
                }
            }
        }

        res.json({
            status: 'success',
            message: 'Registration successful',
            teamId,
            ticketIds,
            totalAmount: expectedPrice
        });

    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        await client.query('ROLLBACK');
        console.error('Registration error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    } finally {
        client.release();
    }
});


// Existing Read-Only Routes
app.get('/api/members', async (req, res) => {
    try {
        res.json({ status: 'success', data: [] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// Admin Authentication Middleware
const ADMIN_SECRET = 'metaclub-secret-key-change-in-prod';
app.use(cookieParser());

const authenticateAdmin = (req, res, next) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

    try {
        jwt.verify(token, ADMIN_SECRET);
        next();
    } catch (err) {
        res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
};

// Admin Login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === 'metaclub@#$%123') {
        const token = jwt.sign({ role: 'admin' }, ADMIN_SECRET, { expiresIn: '1h' });
        res.cookie('admin_token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour
        res.json({ status: 'success' });
    } else {
        res.status(401).json({ status: 'error', message: 'Invalid password' });
    }
});

// Admin Logout
app.post('/api/admin/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ status: 'success' });
});

// Check Auth Status
app.get('/api/admin/check-auth', authenticateAdmin, (req, res) => {
    res.json({ status: 'success', authenticated: true });
});

// Get Registrations (Original)
app.get('/api/admin/registrations', authenticateAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                t.id as team_id, t.name as team_name, t.type as team_type, t.event_id, t.total_amount, t.created_at, t.transaction_id, t.screenshot_path,
                p.name as participant_name, p.email, p.phone, p.role, p.registration_number, p.ticket_id, p.payment_status, p.amount_paid
            FROM teams t
            JOIN participants p ON t.id = p.team_id
            ORDER BY t.created_at DESC
        `);
        res.json({ status: 'success', data: result.rows });
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// --- TEAMS MANAGEMENT API ---

// GET /api/admin/teams - List all teams with details
app.get('/api/admin/teams', authenticateAdmin, async (req, res) => {
    console.log('API: fetching teams...');
    try {
        const result = await pool.query(`
            SELECT * FROM teams ORDER BY created_at DESC
        `);
        console.log(`API: fetched ${result.rows.length} teams.`);
        res.json({ status: 'success', data: result.rows });
    } catch (error) {
        console.error('Fetch teams error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// PUT /api/admin/teams/:id - Update team details
app.put('/api/admin/teams/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, type, total_amount, transaction_id } = req.body;

    try {
        await pool.query(
            `UPDATE teams SET name = $1, type = $2, total_amount = $3, transaction_id = $4 WHERE id = $5`,
            [name, type, total_amount, transaction_id, id]
        );
        res.json({ status: 'success', message: 'Team updated successfully' });
    } catch (error) {
        console.error('Update team error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// DELETE /api/admin/teams/:id - Delete team (and cascade delete participants via FK or manual)
app.delete('/api/admin/teams/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Delete participants first (if not cascading)
        await client.query('DELETE FROM participants WHERE team_id = $1', [id]);

        // Delete team
        await client.query('DELETE FROM teams WHERE id = $1', [id]);

        await client.query('COMMIT');
        res.json({ status: 'success', message: 'Team deleted successfully' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Delete team error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    } finally {
        client.release();
    }
});

// Export to Excel
app.get('/api/admin/export', authenticateAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                t.id as team_id, t.name as team_name, t.type as team_type, t.event_id, t.total_amount, t.created_at, t.transaction_id, t.screenshot_path,
                p.name as participant_name, p.email, p.phone, p.role, p.registration_number, p.ticket_id, p.payment_status, p.amount_paid
            FROM teams t
            JOIN participants p ON t.id = p.team_id
            ORDER BY t.created_at DESC
        `);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Registrations');

        worksheet.columns = [
            { header: 'Date', key: 'created_at', width: 20 },
            { header: 'Event ID', key: 'event_id', width: 10 },
            { header: 'Team Name', key: 'team_name', width: 25 },
            { header: 'Type', key: 'team_type', width: 10 },
            { header: 'Participant Name', key: 'participant_name', width: 20 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Role', key: 'role', width: 15 },
            { header: 'Reg ID', key: 'registration_number', width: 20 },
            { header: 'Ticket ID', key: 'ticket_id', width: 20 },
            { header: 'Payment Status', key: 'payment_status', width: 15 },
            { header: 'Amount Paid', key: 'amount_paid', width: 15 },
            { header: 'Team Total', key: 'total_amount', width: 15 },
            { header: 'Transaction ID', key: 'transaction_id', width: 20 },
            { header: 'Screenshot URL', key: 'screenshot_path', width: 50 },
        ];

        result.rows.forEach(row => {
            worksheet.addRow(row);
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=registrations.xlsx');

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error('Export error:', error);
        res.status(500).send('Failed to export data');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

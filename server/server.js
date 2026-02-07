
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import ExcelJS from 'exceljs';
import multer from 'multer';
import fs from 'fs';

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
let db;

(async () => {
    try {
        db = await open({
            filename: path.join(__dirname, '../database/database.sqlite'),
            driver: sqlite3.Database
        });

        console.log('Connected to SQLite database.');

        // Initialize Tables
        // NOTE: We use DROP TABLE logic here for development to ensure schema changes apply. 
        // In production, we would use migrations.
        await db.exec(`
            DROP TABLE IF EXISTS participants;
            DROP TABLE IF EXISTS teams;

            CREATE TABLE IF NOT EXISTS teams (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                event_id TEXT NOT NULL, -- Linked to specific event (e.g., '1')
                name TEXT,
                type TEXT NOT NULL, -- 'Solo', 'Duo', 'Squad'
                total_amount REAL NOT NULL, -- Total payment amount
                transaction_id TEXT, -- Payment Transaction ID
                screenshot_path TEXT, -- Path to payment screenshot
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS participants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                team_id INTEGER,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                role TEXT NOT NULL, -- 'Developer', 'Attacker', 'Both'
                payment_status TEXT DEFAULT 'Pending',
                amount_paid REAL, -- Individual share of the payment
                FOREIGN KEY (team_id) REFERENCES teams(id)
            );
        `);
        console.log('Database tables verified/created with comprehensive schema.');
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
        if (!['Developer', 'Attacker', 'Both'].includes(m.role)) return 'Invalid role';
    }
    return null;
};

app.post('/api/register', upload.single('screenshot'), async (req, res) => {
    try {
        let { teamName, type, members, eventId } = req.body;
        const transactionId = req.body.transactionId;
        const screenshotPath = req.file ? `/uploads/${req.file.filename}` : null;

        // Parse members if it comes as a string (FormData sends JSON strings)
        if (typeof members === 'string') {
            members = JSON.parse(members);
        }

        if (!eventId) eventId = '1';

        const validationError = validateRegistration(type, members);
        if (validationError) {
            // Clean up uploaded file if validation fails
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ status: 'error', message: validationError });
        }

        if (!transactionId || !screenshotPath) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ status: 'error', message: 'Payment details missing' });
        }

        // Calculate expected price (server-side verification)
        const expectedPrice = calculatePrice(type, members);

        // Transaction manually
        await db.run('BEGIN TRANSACTION');

        const result = await db.run(
            'INSERT INTO teams (name, type, event_id, total_amount, transaction_id, screenshot_path) VALUES (?, ?, ?, ?, ?, ?)',
            [teamName || `${members[0].name}'s Team`, type, eventId, expectedPrice, transactionId, screenshotPath]
        );
        const teamId = result.lastID;

        for (const member of members) {
            // Calculate individual share (simple division or exact role cost)
            // Exact role cost is better
            let memberCost = 170;
            if (member.role === 'Both') memberCost *= 2;

            await db.run(
                'INSERT INTO participants (team_id, name, email, phone, role, payment_status, amount_paid) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [teamId, member.name, member.email, member.phone, member.role, 'Paid', memberCost]
            );
        }

        await db.run('COMMIT');

        console.log(`Registered team: ${teamName} (${type}) for Event ${eventId}. Total: ₹${expectedPrice}. Tx: ${transactionId}`);
        res.json({
            status: 'success',
            message: 'Registration successful',
            teamId,
            totalAmount: expectedPrice
        });

    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path); // Clean up on error
        await db.run('ROLLBACK');
        console.error('Registration error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});


// Existing Read-Only Routes (for backward compatibility if needed, though 'members' table might be gone)
app.get('/api/members', async (req, res) => {
    try {
        // Just empty for now as we switched DBs and schema
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

// Get Registrations
app.get('/api/admin/registrations', authenticateAdmin, async (req, res) => {
    try {
        const rows = await db.all(`
            SELECT 
                t.id as team_id, t.name as team_name, t.type as team_type, t.event_id, t.total_amount, t.created_at,
                p.name as participant_name, p.email, p.phone, p.role, p.payment_status, p.amount_paid
            FROM teams t
            JOIN participants p ON t.id = p.team_id
            ORDER BY t.created_at DESC
        `);
        res.json({ status: 'success', data: rows });
    } catch (error) {
        console.error('Fetch error:', error);
        res.status(500).json({ status: 'error', message: 'Database error' });
    }
});

// Export to Excel
app.get('/api/admin/export', authenticateAdmin, async (req, res) => {
    try {
        const rows = await db.all(`
            SELECT 
                t.id as team_id, t.name as team_name, t.type as team_type, t.event_id, t.total_amount, t.created_at, t.transaction_id, t.screenshot_path,
                p.name as participant_name, p.email, p.phone, p.role, p.payment_status, p.amount_paid
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
            { header: 'Payment Status', key: 'payment_status', width: 15 },
            { header: 'Amount Paid', key: 'amount_paid', width: 15 },
            { header: 'Team Total', key: 'total_amount', width: 15 },
            { header: 'Transaction ID', key: 'transaction_id', width: 20 },
            { header: 'Screenshot URL', key: 'screenshot_path', width: 50 },
        ];

        rows.forEach(row => {
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

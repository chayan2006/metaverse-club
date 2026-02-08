import pg from 'pg';
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("Error: DATABASE_URL environment variable is not set.");
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

(async () => {
    let client;
    try {
        client = await pool.connect();
        console.log("Starting Data Integrity Audit...");
        console.log("Timestamp:", new Date().toISOString());

        // 1. Completeness Check
        const totalParticipantsResult = await client.query('SELECT COUNT(*) FROM participants');
        const totalTeamsResult = await client.query('SELECT COUNT(*) FROM teams');
        const totalParticipants = parseInt(totalParticipantsResult.rows[0].count);
        const totalTeams = parseInt(totalTeamsResult.rows[0].count);

        console.log(`\n--- Database Status ---`);
        console.log(`Total Teams: ${totalTeams}`);
        console.log(`Total Participants: ${totalParticipants}`);

        // 2. Admin Query Simulation
        const adminQuery = `
            SELECT 
                t.id as team_id, t.name as team_name, t.type as team_type, t.event_id, t.total_amount, t.created_at,
                p.name as participant_name, p.email, p.phone, p.role, p.college_or_work, p.address, p.ticket_id, p.payment_status, p.amount_paid
            FROM teams t
            JOIN participants p ON t.id = p.team_id
            ORDER BY t.created_at DESC
        `;
        const adminResult = await client.query(adminQuery);
        const adminCount = adminResult.rows.length;

        console.log(`\n--- Admin View Status ---`);
        console.log(`Records Displayed: ${adminCount}`);

        // Analyze Discrepancies
        console.log(`\n--- Integrity Analysis ---`);
        if (totalParticipants !== adminCount) {
            console.error(`[FAIL] COUNT MISMATCH`);
            console.error(`DB Participants (${totalParticipants}) != Admin View (${adminCount}).`);
            console.error(`Potential Issue: Orphaned participants (team_id mismatch) or Join failure.`);
        } else {
            console.log(`[PASS] Data Completeness (Counts Match)`);
        }

        // 3. Field Verification
        let fieldErrors = 0;
        let nullTicketIds = 0;

        adminResult.rows.forEach(row => {
            const missing = [];
            if (!row.participant_name) missing.push('name');
            if (!row.email) missing.push('email');

            if (!row.ticket_id) {
                nullTicketIds++;
            }

            if (missing.length > 0) {
                console.error(`[WARN] Record TeamID=${row.team_id} missing: ${missing.join(', ')}`);
                fieldErrors++;
            }
        });

        if (fieldErrors === 0) {
            console.log(`[PASS] Critical Fields (Name, Email)`);
        } else {
            console.error(`[FAIL] ${fieldErrors} records missing critical fields.`);
        }

        if (nullTicketIds > 0) {
            console.warn(`[WARN] ${nullTicketIds} records are missing Ticket IDs (expected for pre-migration records).`);
        } else {
            console.log(`[PASS] Ticket IDs present for all records.`);
        }

        console.log("\nAudit Complete.");

    } catch (err) {
        console.error("Audit Failed:", err);
    } finally {
        if (client) client.release();
        await pool.end();
    }
})();

import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000/api';
const ADMIN_PASSWORD = 'metaclub@#$%123';

async function loginAdmin() {
    try {
        const response = await axios.post(`${BASE_URL}/admin/login`, { password: ADMIN_PASSWORD });
        if (response.data.status === 'success') {
            return response.headers['set-cookie'];
        }
    } catch (error) {
        console.error('❌ Admin Login Failed:', error.message);
        process.exit(1);
    }
}

async function registerTeam() {
    const form = new FormData();
    form.append('teamName', 'Test Team VERIFY');
    form.append('type', 'Duo');
    form.append('eventId', '1');
    form.append('transactionId', 'TXN_VERIFY_12345');

    const dummyImagePath = path.join(__dirname, 'dummy_screenshot.png');
    if (!fs.existsSync(dummyImagePath)) {
        fs.writeFileSync(dummyImagePath, 'Simulated Image Content');
    }
    form.append('screenshot', fs.createReadStream(dummyImagePath));

    // The server expects members to be a JSON string.
    // The server validates members length matches type. Duo -> 2 members.
    // It also checks for m.registration_number
    const members = [
        { name: 'User One', email: 'user1@test.com', phone: '1234567890', registration_number: 'REG001', role: 'Developer' },
        { name: 'User Two', email: 'user2@test.com', phone: '0987654321', registration_number: 'REG002', role: 'Attacker' }
    ];
    form.append('members', JSON.stringify(members));

    try {
        const response = await axios.post(`${BASE_URL}/register`, form, {
            headers: {
                ...form.getHeaders()
            }
        });

        if (response.data.status === 'success') {
            const teamId = response.data.teamId || (response.data.ticketIds && response.data.ticketIds[0].split('-')[2]);
            // The server response logic: res.json({ status: 'success', ticketIds })
            // It doesn't look like it returns teamId directly in the JSON, but I saw "RETURNING id" in SQL.
            // Let's deduce teamId from ticketId if needed, or check response structure.
            // Actually server.js line 200 (truncated) ends with res.json({ status: 'success', ...
            // I need to see the rest of line 200.
            console.log('✅ Team Registration Successful. Response:', response.data);
            return teamId;
        }
    } catch (error) {
        console.error('❌ Team Registration Failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
        process.exit(1);
    }
}

async function verifyAdminData(cookies, teamName) {
    try {
        const response = await axios.get(`${BASE_URL}/admin/teams`, {
            headers: { Cookie: cookies }
        });

        if (response.data.status === 'success') {
            const teams = response.data.data;
            // Filter by name since we might not have ID easily if response structure differs
            const registeredTeam = teams.find(t => t.name === teamName);

            if (registeredTeam) {
                console.log('✅ Data Verified in Admin Panel:');
                console.log(`   - Name: ${registeredTeam.name}`);
                console.log(`   - Type: ${registeredTeam.type}`);
                console.log(`   - Amount: ${registeredTeam.total_amount}`);
                console.log(`   - Transaction: ${registeredTeam.transaction_id}`);

                if (registeredTeam.name === 'Test Team VERIFY' && registeredTeam.transaction_id === 'TXN_VERIFY_12345') {
                    console.log('✅ Data Integrity Confirmed: Fields match submission.');
                } else {
                    console.error('❌ Data Mismatch: Saved data does not match submission.');
                }
            } else {
                console.error('❌ Registered team not found in admin list.');
            }
        }
    } catch (error) {
        console.error('❌ Admin verification failed:', error.message);
    }
}

(async () => {
    console.log('--- STARTING VERIFICATION ---');
    const cookies = await loginAdmin();
    await registerTeam(); // teamId might be undefined if not returned, so verify by name
    await verifyAdminData(cookies, 'Test Team VERIFY');
    console.log('--- VERIFICATION COMPLETE ---');
})();

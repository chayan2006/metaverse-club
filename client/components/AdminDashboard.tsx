import { useState, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LogOut, Search, RefreshCw, AlertCircle, Database, UserPlus } from 'lucide-react';

interface Registration {
    team_id: number;
    team_name: string;
    team_type: string;
    event_id: string;
    total_amount: number;
    created_at: string;
    participant_name: string;
    email: string;
    phone: string;
    role: string;
    payment_status: string;
    amount_paid: number;
    transaction_id?: string;
    screenshot_path?: string;
    registration_number?: string;
    ticket_id?: string;
}

export const AdminDashboard: FC = () => {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchRegistrations = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/registrations');
            if (response.status === 401) {
                navigate('/admin');
                return;
            }
            const data = await response.json();
            if (data.status === 'success') {
                setRegistrations(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRegistrations();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        navigate('/admin');
    };

    const handleExport = () => {
        window.open('/api/admin/export', '_blank');
    };

    const filteredData = registrations.filter(r =>
        r.team_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.participant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.ticket_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.registration_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-cyber-black font-rajdhani text-gray-200">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Database className="text-cyber-neonBlue" />
                        <h1 className="text-xl font-bold font-orbitron text-white tracking-wider">
                            ADMIN<span className="text-gray-500 mx-2">/</span>DASHBOARD
                        </h1>
                        <span className="bg-gray-800 text-xs px-2 py-1 rounded text-gray-400 border border-gray-700">
                            v1.2
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/teams')}
                            className="flex items-center gap-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-600/50 px-4 py-2 rounded transition-all text-sm font-bold"
                        >
                            <UserPlus size={16} /> {/* Using UserPlus or Users as icon */}
                            Manage Teams
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white border border-green-600/50 px-4 py-2 rounded transition-all text-sm font-bold"
                        >
                            <Download size={16} />
                            Export Excel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-600/50 px-4 py-2 rounded transition-all text-sm font-bold"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats / Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-full md:w-auto">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Registrations</p>
                        <p className="text-2xl font-bold text-white">{registrations.length} <span className="text-sm font-normal text-gray-500">records</span></p>
                    </div>

                    <div className="w-full md:w-96 relative">
                        <input
                            type="text"
                            placeholder="Search by ID, team, name, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyber-neonBlue outline-none"
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                    </div>

                    <button
                        onClick={fetchRegistrations}
                        className="p-3 bg-gray-800 rounded-lg text-cyber-neonBlue hover:bg-gray-700 border border-gray-700"
                        title="Refresh Data"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>

                {/* Data Table */}
                <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-800 text-gray-400 border-b border-gray-700 uppercase tracking-wider text-xs">
                                    <th className="px-6 py-4 font-bold">Ticket ID</th>
                                    <th className="px-6 py-4 font-bold">Team / Date</th>
                                    <th className="px-6 py-4 font-bold">Participant</th>
                                    <th className="px-6 py-4 font-bold">Contact</th>
                                    <th className="px-6 py-4 font-bold">Reg No</th>
                                    <th className="px-6 py-4 font-bold text-right">Paid</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex justify-center items-center gap-2">
                                                <RefreshCw className="animate-spin" /> Loading data...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                            <AlertCircle className="inline-block mb-2 w-6 h-6" /> <br />
                                            No registrations found matching your search.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((reg, idx) => (
                                        <tr key={idx} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-cyber-neonBlue text-xs">
                                                <div>{reg.ticket_id || '-'}</div>
                                                <div className="text-[10px] text-gray-500 mt-1">Team ID: {reg.team_id}</div>
                                                <div className="text-[10px] text-gray-600">Event ID: {reg.event_id}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-white">{reg.team_name}</div>
                                                <div className="text-xs text-gray-500">{new Date(reg.created_at).toLocaleDateString()} {new Date(reg.created_at).toLocaleTimeString()}</div>
                                                <div className="flex gap-1 mt-1">
                                                    <span className="text-[10px] bg-gray-700 px-1 rounded text-gray-300">{reg.team_type}</span>
                                                    <span className="text-[10px] bg-gray-800 border border-gray-600 px-1 rounded text-green-400">Total: ₹{reg.total_amount}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-white font-medium">{reg.participant_name}</div>
                                                <span className={`text-[10px] uppercase font-bold ${reg.role === 'Developer' ? 'text-cyan-400' :
                                                    reg.role === 'Attacker' ? 'text-red-400' :
                                                        'text-yellow-400'
                                                    }`}>
                                                    {reg.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                <div className="text-gray-300">{reg.email}</div>
                                                <div className="text-xs opacity-70">{reg.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-white text-xs font-mono">
                                                {reg.registration_number || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-green-400 text-xs">
                                                <div>₹{reg.amount_paid}</div>
                                                <div className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">(Team: ₹{reg.total_amount})</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-900/30 text-green-500 border border-green-500/30">
                                                    {reg.payment_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs space-y-1">
                                                {reg.screenshot_path ? (
                                                    <a
                                                        href={reg.screenshot_path}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block text-cyber-neonBlue hover:underline"
                                                    >
                                                        View Proof
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-600">-</span>
                                                )}
                                                <div className="text-gray-500 font-mono text-[10px]">{reg.transaction_id || ''}</div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div>
                    <div className="bg-gray-800 px-6 py-3 border-t border-gray-700 text-xs text-center text-gray-500">
                        End of Registration Log
                    </div>
                </div>
            </main>
        </div>
    );
};

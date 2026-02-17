import { useState, useEffect, FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, AlertCircle, Trash2, Edit, Save, X, ArrowLeft, Database } from 'lucide-react';

interface Team {
    id: number;
    event_id: string;
    name: string;
    type: string;
    total_amount: number;
    transaction_id: string;
    screenshot_path: string;
    created_at: string;
}

export const TeamsManagement: FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);
    const navigate = useNavigate();

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/teams');
            if (response.status === 401) {
                navigate('/admin');
                return;
            }
            const data = await response.json();
            if (data.status === 'success') {
                setTeams(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch teams', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this team? This will also delete all participants associated with it.')) return;

        try {
            const response = await fetch(`/api/admin/teams/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.status === 'success') {
                fetchTeams();
            } else {
                alert('Failed to delete team: ' + data.message);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting team');
        }
    };

    const handleUpdate = async () => {
        if (!editingTeam) return;

        try {
            const response = await fetch(`/api/admin/teams/${editingTeam.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingTeam),
            });
            const data = await response.json();
            if (data.status === 'success') {
                setEditingTeam(null);
                fetchTeams();
            } else {
                alert('Failed to update team: ' + data.message);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Error updating team');
        }
    };

    const filteredTeams = teams.filter(t =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(t.id).includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-cyber-black font-rajdhani text-gray-200">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/admin/dashboard')} className="hover:text-cyber-neonBlue transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <Database className="text-cyber-neonBlue ml-2" />
                        <h1 className="text-xl font-bold font-orbitron text-white tracking-wider">
                            TEAMS<span className="text-gray-500 mx-2">/</span>MANAGEMENT
                        </h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats / Controls */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 w-full md:w-auto">
                        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Teams</p>
                        <p className="text-2xl font-bold text-white">{teams.length} <span className="text-sm font-normal text-gray-500">records</span></p>
                    </div>

                    <div className="w-full md:w-96 relative">
                        <input
                            type="text"
                            placeholder="Search by ID, name, transaction..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-cyber-neonBlue outline-none"
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-500 w-5 h-5" />
                    </div>

                    <button
                        onClick={fetchTeams}
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
                                    <th className="px-6 py-4 font-bold">Team ID</th>
                                    <th className="px-6 py-4 font-bold">Name</th>
                                    <th className="px-6 py-4 font-bold">Type</th>
                                    <th className="px-6 py-4 font-bold">Amount</th>
                                    <th className="px-6 py-4 font-bold">Created At</th>
                                    <th className="px-6 py-4 font-bold">Payment</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex justify-center items-center gap-2">
                                                <RefreshCw className="animate-spin" /> Loading teams...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredTeams.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            <AlertCircle className="inline-block mb-2 w-6 h-6" /> <br />
                                            No teams found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredTeams.map((team) => (
                                        <tr key={team.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                                                #{team.id}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-white">
                                                {editingTeam?.id === team.id ? (
                                                    <input
                                                        type="text"
                                                        value={editingTeam.name}
                                                        onChange={(e) => setEditingTeam({ ...editingTeam, name: e.target.value })}
                                                        className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-cyber-neonBlue outline-none w-full"
                                                    />
                                                ) : (
                                                    team.name
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                {editingTeam?.id === team.id ? (
                                                    <select
                                                        value={editingTeam.type}
                                                        onChange={(e) => setEditingTeam({ ...editingTeam, type: e.target.value })}
                                                        className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-cyber-neonBlue outline-none"
                                                    >
                                                        <option value="Solo">Solo</option>
                                                        <option value="Duo">Duo</option>
                                                        <option value="Squad">Squad</option>
                                                    </select>
                                                ) : (
                                                    <span className={`px-2 py-1 rounded text-[10px] ${team.type === 'Solo' ? 'bg-blue-900/30 text-blue-400' :
                                                        team.type === 'Duo' ? 'bg-purple-900/30 text-purple-400' :
                                                            'bg-orange-900/30 text-orange-400'
                                                        }`}>
                                                        {team.type}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-green-400 text-xs">
                                                {editingTeam?.id === team.id ? (
                                                    <input
                                                        type="number"
                                                        value={editingTeam.total_amount}
                                                        onChange={(e) => setEditingTeam({ ...editingTeam, total_amount: Number(e.target.value) })}
                                                        className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-cyber-neonBlue outline-none w-24"
                                                    />
                                                ) : (
                                                    `₹${team.total_amount}`
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-xs">
                                                {new Date(team.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-xs">
                                                <div className="flex flex-col gap-1">
                                                    {team.screenshot_path ? (
                                                        <a
                                                            href={team.screenshot_path}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-cyber-neonBlue hover:underline"
                                                        >
                                                            View Proof
                                                        </a>
                                                    ) : <span className="text-gray-600">-</span>}
                                                    <span className="font-mono text-[10px] text-gray-500">{team.transaction_id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {editingTeam?.id === team.id ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={handleUpdate}
                                                            className="p-1.5 bg-green-600/20 text-green-400 rounded hover:bg-green-600 hover:text-white transition-all"
                                                            title="Save"
                                                        >
                                                            <Save size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingTeam(null)}
                                                            className="p-1.5 bg-gray-700 text-gray-400 rounded hover:bg-gray-600 hover:text-white transition-all"
                                                            title="Cancel"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingTeam(team)}
                                                            className="p-1.5 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition-all"
                                                            title="Edit"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(team.id)}
                                                            className="p-1.5 bg-red-600/20 text-red-400 rounded hover:bg-red-600 hover:text-white transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="bg-gray-800 px-6 py-3 border-t border-gray-700 text-xs text-center text-gray-500">
                        Total Teams: {teams.length}
                    </div>
                </div>
            </main>
        </div>
    );
};

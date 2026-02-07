import { useState, useEffect, FC, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Users, Shield, Code, Zap } from 'lucide-react';

interface RegistrationModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventName: string;
    eventId: string;
}

type TeamType = 'Duo' | 'Trio' | 'Squad';
type Role = 'Developer' | 'Attacker' | 'Both';

interface Member {
    name: string;
    email: string;
    phone: string;
    // role is now global
}

export const RegistrationModal: FC<RegistrationModalProps> = ({ isOpen, onClose, eventName, eventId }) => {
    const [teamType, setTeamType] = useState<TeamType>('Duo');
    const [globalRole, setGlobalRole] = useState<Role>('Developer');
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);

    // Initialize members based on team type
    useEffect(() => {
        const memberCount = teamType === 'Duo' ? 2 : teamType === 'Trio' ? 3 : 4;
        setMembers(Array(memberCount).fill({
            name: '',
            email: '',
            phone: '',
        }));
    }, [teamType]);

    const updateMember = (index: number, field: keyof Member, value: string) => {
        const newMembers = [...members];
        newMembers[index] = { ...newMembers[index], [field]: value };
        setMembers(newMembers);
    };

    const calculateTotal = () => {
        const BASE_PRICE = 170;
        let perPersonPrice = BASE_PRICE;
        if (globalRole === 'Both') {
            perPersonPrice = 200;
        }
        return perPersonPrice * members.length;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!transactionId || !screenshot) {
            setError("Please provide payment details.");
            setLoading(false);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('teamName', teamName);
            formData.append('type', teamType);
            formData.append('members', JSON.stringify(members.map(m => ({ ...m, role: globalRole }))));
            formData.append('eventId', eventId);
            formData.append('transactionId', transactionId);
            formData.append('screenshot', screenshot);

            const response = await fetch('/api/register', {
                method: 'POST',
                // Content-Type header not needed for FormData, browser sets it with boundary
                body: formData
            });
            // ... rest matches

            const data = await response.json();
            if (data.status === 'success') {
                setSuccess(true);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (success) {
        return createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-gray-900 border-2 border-cyber-neonGreen p-0 rounded-xl max-w-md w-full text-center shadow-[0_0_50px_rgba(0,255,0,0.3)] relative overflow-hidden group">
                    {/* Ticket Header */}
                    <div className="bg-gray-800 p-6 border-b-2 border-dashed border-gray-700 relative">
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full border-r border-gray-700"></div>
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-black rounded-full border-l border-gray-700"></div>

                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Zap className="text-green-400 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1 font-orbitron uppercase tracking-wider">Access Granted</h3>
                        <p className="text-cyber-neonGreen text-sm font-semibold">TICKET ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                    </div>

                    {/* Ticket Body */}
                    <div className="p-8 space-y-4 bg-gray-900/95 relative">
                        <div className="space-y-1">
                            <p className="text-gray-500 text-xs uppercase tracking-widest">Event</p>
                            <p className="text-white font-bold text-lg">{eventName}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest">Team</p>
                                <p className="text-cyber-neonBlue font-bold">{teamName || 'Solo Agent'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs uppercase tracking-widest">Type</p>
                                <p className="text-cyber-neonPurple font-bold">{teamType}</p>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-800">
                            <p className="text-gray-400 text-sm mb-4">Join the official communication channel for updates and coordination.</p>
                            <a
                                href="https://chat.whatsapp.com/KI8AC9hmtYBDKyKBYSJMYG?mode=gi_t"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg shadow-lg transform transition-all hover:-translate-y-1 hover:shadow-[#25D366]/40 flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">📱</span>
                                Join WhatsApp Group
                            </a>
                        </div>
                    </div>

                    {/* Ticket Footer */}
                    <div className="bg-gray-950 p-4 border-t-2 border-dashed border-gray-800 flex justify-between items-center">
                        <span className="text-xs text-gray-600 font-mono">AUTHORIZED_BY_SYSTEM</span>
                        <button
                            onClick={() => { setSuccess(false); onClose(); }}
                            className="text-gray-400 hover:text-white text-sm hover:underline"
                        >
                            Close Ticket
                        </button>
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-gray-900 border border-cyber-neonBlue/30 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden relative my-8">
                {/* Header */}
                <div className="bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-orbitron">Event Registration</h2>
                        <p className="text-cyber-neonBlue text-sm">{eventName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-bold text-gray-300 hover:text-white bg-gray-700/50 hover:bg-gray-700 border border-gray-600 rounded transition-all"
                        >
                            Cancel
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[50vh] overflow-y-auto">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Team Type Selection */}
                        <div className="grid grid-cols-3 gap-2 md:gap-4">
                            {[
                                { type: 'Duo', icon: Users, price: '₹340*' },
                                { type: 'Trio', icon: Users, price: '₹510*' },
                                { type: 'Squad', icon: Shield, price: '₹680*' },
                            ].map(({ type, icon: Icon, price }) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setTeamType(type as TeamType)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${teamType === type
                                        ? 'bg-cyber-neonBlue/10 border-cyber-neonBlue text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'
                                        }`}
                                >
                                    <Icon className="mb-2" />
                                    <span className="font-bold">{type}</span>
                                    <span className="text-xs opacity-70 mt-1">{price}</span>
                                </button>
                            ))}
                        </div>

                        {/* Team Role Selection */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { role: 'Developer', icon: Code, label: 'Developer' },
                                { role: 'Attacker', icon: Shield, label: 'Attacker' },
                                { role: 'Both', icon: Zap, label: 'Both' },
                            ].map(({ role, icon: Icon, label }) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setGlobalRole(role as Role)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${globalRole === role
                                        ? 'bg-cyber-neonPurple/10 border-cyber-neonPurple text-white shadow-[0_0_15px_rgba(180,0,255,0.2)]'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-750'
                                        }`}
                                >
                                    <Icon className="mb-2" />
                                    <span className="font-bold">{label}</span>
                                    {role === 'Both' && <span className="text-xs opacity-70 mt-1">₹200/person</span>}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Team Name</label>
                            <input
                                type="text"
                                required
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white focus:border-cyber-neonBlue focus:ring-1 focus:ring-cyber-neonBlue outline-none"
                                placeholder="Enter your team name"
                            />
                        </div>

                        {/* Member Details */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2">Participant Details</h3>
                            {members.map((member, idx) => (
                                <div key={idx} className="bg-gray-800/50 p-4 rounded border border-gray-700/50">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold text-gray-300">Member {idx + 1}</span>
                                        {idx === 0 && <span className="text-xs bg-cyber-neonPurple/20 text-cyber-neonPurple px-2 py-0.5 rounded">Team Lead</span>}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            required
                                            value={member.name}
                                            onChange={(e) => updateMember(idx, 'name', e.target.value)}
                                            className="bg-gray-950 border border-gray-700 rounded p-2 text-white text-sm focus:border-cyber-neonBlue outline-none"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            required
                                            value={member.email}
                                            onChange={(e) => updateMember(idx, 'email', e.target.value)}
                                            className="bg-gray-950 border border-gray-700 rounded p-2 text-white text-sm focus:border-cyber-neonBlue outline-none"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone"
                                            required
                                            value={member.phone}
                                            onChange={(e) => updateMember(idx, 'phone', e.target.value)}
                                            className="bg-gray-950 border border-gray-700 rounded p-2 text-white text-sm focus:border-cyber-neonBlue outline-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-4 border-t border-gray-700 pt-4">
                            <h3 className="text-lg font-bold text-white">Payment Details</h3>

                            <div className="bg-gray-800/50 p-4 rounded border border-gray-700/50">
                                <p className="text-sm text-gray-400 mb-2">Please transfer <span className="text-cyber-neonGreen font-bold">₹{calculateTotal()}</span> to confirm registration.</p>

                                {/* Dynamic QR Code */}
                                <div className="mb-4 flex justify-center">
                                    <div className="bg-white p-2 rounded-lg">
                                        <img
                                            src={`/qrcodes/${calculateTotal()}.jpeg`}
                                            alt={`Pay ₹${calculateTotal()}`}
                                            className="w-48 h-48 object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).parentElement!.innerText = 'QR Code not available for this amount';
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Transaction ID / UPI Ref</label>
                                    <input
                                        type="text"
                                        required
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white focus:border-cyber-neonBlue outline-none"
                                        placeholder="Enter transaction ID"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Payment Screenshot</label>
                                    <input
                                        type="file"
                                        required
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setScreenshot(e.target.files[0]);
                                            }
                                        }}
                                        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyber-neonBlue/10 file:text-cyber-neonBlue hover:file:bg-cyber-neonBlue/20 text-gray-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Default Pricing Note */}
                        <div className="text-xs text-gray-500 italic">
                            * Base price is ₹170/person. Selecting "Both" roles changes price to ₹200 per person.
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="bg-gray-800 p-6 border-t border-gray-700 flex justify-between items-center sticky bottom-0 z-10">
                    <div>
                        <p className="text-gray-400 text-sm">Total Amount</p>
                        <p className="text-3xl font-bold text-cyber-neonGreen">₹{calculateTotal()}</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-gradient-to-r from-cyber-neonBlue to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-3 px-8 rounded shadow-lg transform active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Proceed to Pay'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

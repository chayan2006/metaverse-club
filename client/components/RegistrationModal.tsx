import { useState, useEffect, FC, FormEvent, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Users, Shield, Code, Zap, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle, Download, Ticket } from 'lucide-react';
import { generateTicketPDF } from '../utils/TicketGenerator';

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
    registration_number: string;
}

export const RegistrationModal: FC<RegistrationModalProps> = ({ isOpen, onClose, eventName, eventId }) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [teamType, setTeamType] = useState<TeamType>('Duo');
    const [globalRole, setGlobalRole] = useState<Role>('Developer');
    const [teamName, setTeamName] = useState('');
    const [members, setMembers] = useState<Member[]>([]);

    // Payment State
    const [transactionId, setTransactionId] = useState('');
    const [screenshot, setScreenshot] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [generatedTicketIds, setGeneratedTicketIds] = useState<string[]>([]);

    // Validation State
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    // Initialize members based on team type
    useEffect(() => {
        const memberCount = teamType === 'Duo' ? 2 : teamType === 'Trio' ? 3 : 4;
        setMembers(prev => {
            const newMembers = Array(memberCount).fill(null).map((_, i) => prev[i] || {
                name: '',
                email: '',
                phone: '',
                registration_number: ''
            });
            return newMembers;
        });
    }, [teamType]);

    // Validation Logic
    const validateStep1 = () => {
        const errors: Record<string, string> = {};
        let isValid = true;

        if (!teamName.trim()) {
            errors.teamName = 'Team Name is required';
            isValid = false;
        }

        members.forEach((member, idx) => {
            if (!member.name.trim()) { errors[`member_${idx}_name`] = 'Required'; isValid = false; }
            if (!member.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) { errors[`member_${idx}_email`] = 'Invalid Email'; isValid = false; }
            if (!member.phone.trim() || !/^\d{10}$/.test(member.phone)) { errors[`member_${idx}_phone`] = 'Invalid Phone (10 digits)'; isValid = false; }
            if (!member.registration_number.trim()) { errors[`member_${idx}_reg`] = 'Required'; isValid = false; }
        });

        setValidationErrors(errors);
        return isValid;
    };

    const updateMember = (index: number, field: keyof Member, value: string) => {
        const newMembers = [...members];
        newMembers[index] = { ...newMembers[index], [field]: value };
        setMembers(newMembers);

        if (validationErrors[`member_${index}_${field}`]) {
            setValidationErrors(prev => {
                const newErrs = { ...prev };
                delete newErrs[`member_${index}_${field}`];
                return newErrs;
            });
        }
    };

    const handleNext = () => {
        if (validateStep1()) {
            setStep(2);
            setError(null);
        } else {
            setError('Please fix the errors in the form before proceeding.');
        }
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
                body: formData
            });

            const data = await response.json();
            if (data.status === 'success') {
                setGeneratedTicketIds(data.ticketIds || []);
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

    const handleDownloadTicket = (index: number) => {
        const member = members[index];
        const ticketId = generatedTicketIds[index] || 'PENDING';

        generateTicketPDF({
            ticketId,
            eventName,
            attendeeName: member.name,
            teamName,
            role: globalRole,
            date: new Date().toLocaleDateString(),
            venue: 'Metaverse Club Arena',
            registrationNumber: member.registration_number || 'N/A'
        });
    };

    if (!isOpen) return null;

    if (success) {
        return createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                <div className="bg-gray-900 border-2 border-cyber-neonGreen p-0 rounded-xl max-w-lg w-full text-center shadow-[0_0_50px_rgba(0,255,0,0.3)] relative overflow-hidden group">
                    <div className="bg-gray-800 p-6 border-b-2 border-dashed border-gray-700 relative">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                            <Ticket className="text-green-400 w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1 font-orbitron uppercase tracking-wider">Registration Confirmed</h3>
                        <p className="text-cyber-neonGreen text-sm font-semibold">WELCOME TO THE CLUB</p>
                    </div>

                    <div className="p-8 space-y-4 bg-gray-900/95 relative max-h-[50vh] overflow-y-auto">
                        <p className="text-gray-300 mb-4">Your registration for <span className="text-white font-bold">{eventName}</span> is complete. Download your tickets below.</p>

                        <div className="space-y-3">
                            {members.map((member, idx) => (
                                <div key={idx} className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700">
                                    <div className="text-left">
                                        <p className="text-white font-bold text-sm">{member.name}</p>
                                        <p className="text-xs text-cyber-neonBlue font-mono">{generatedTicketIds[idx] || 'Processing...'}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDownloadTicket(idx)}
                                        className="bg-cyber-neonBlue/10 hover:bg-cyber-neonBlue/20 text-cyber-neonBlue p-2 rounded transition-colors"
                                        title="Download Ticket"
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-800 mt-4">
                            <p className="text-gray-400 text-sm mb-4">Join the official communication channel for updates.</p>
                            <a href="https://chat.whatsapp.com/KI8AC9hmtYBDKyKBYSJMYG?mode=gi_t" target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-lg shadow-lg flex items-center justify-center gap-2"><span className="text-xl">📱</span> Join WhatsApp Group</a>
                        </div>
                    </div>
                    <div className="bg-gray-950 p-4 border-t-2 border-dashed border-gray-800 flex justify-between items-center">
                        <span className="text-xs text-gray-600 font-mono">AUTHORIZED_BY_SYSTEM</span>
                        <button onClick={() => { setSuccess(false); onClose(); }} className="text-gray-400 hover:text-white text-sm hover:underline">Close</button>
                    </div>
                </div>
            </div>,
            document.body
        );
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-gray-900 border border-cyber-neonBlue/30 w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden relative my-8 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-gray-800 p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 z-10 shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white font-orbitron">Event Registration</h2>
                        <div className="flex items-center gap-2 text-sm mt-1">
                            <span className={`flex items-center gap-1 ${step === 1 ? 'text-cyber-neonBlue font-bold' : 'text-green-500'}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${step === 1 ? 'border-cyber-neonBlue' : 'border-green-500 bg-green-500/20'}`}>1</div> Details
                            </span>
                            <span className="text-gray-600">/</span>
                            <span className={`flex items-center gap-1 ${step === 2 ? 'text-cyber-neonBlue font-bold' : 'text-gray-500'}`}>
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs border ${step === 2 ? 'border-cyber-neonBlue' : 'border-gray-600'}`}>2</div> Payment
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 overflow-y-auto grow custom-scrollbar">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm flex items-center gap-2 animate-pulse">
                            <AlertTriangle size={16} /> {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <div className="space-y-6 animate-fade-in-left">
                            {/* Step 1: Details */}

                            {/* Team Config */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Squad Size</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['Duo', 'Trio', 'Squad'] as const).map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setTeamType(type)}
                                                className={`py-2 px-1 rounded border text-sm font-bold transition-all ${teamType === type ? 'bg-cyber-neonBlue/20 border-cyber-neonBlue text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Role Type</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['Developer', 'Attacker', 'Both'] as const).map(role => (
                                            <button
                                                key={role}
                                                onClick={() => setGlobalRole(role)}
                                                className={`py-2 px-1 rounded border text-sm font-bold transition-all ${globalRole === role ? 'bg-cyber-neonPurple/20 border-cyber-neonPurple text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Team Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={teamName}
                                    onChange={(e) => {
                                        setTeamName(e.target.value);
                                        if (validationErrors.teamName) setValidationErrors(prev => { const n = { ...prev }; delete n.teamName; return n; });
                                    }}
                                    className={`w-full bg-gray-950 border ${validationErrors.teamName ? 'border-red-500' : 'border-gray-700'} rounded p-3 text-white focus:border-cyber-neonBlue outline-none transition-colors`}
                                    placeholder="Enter your team name"
                                />
                                {validationErrors.teamName && <p className="text-red-500 text-xs mt-1">{validationErrors.teamName}</p>}
                            </div>

                            {/* Members */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2">Participant Details</h3>
                                {members.map((member, idx) => (
                                    <div key={idx} className="bg-gray-800/30 p-4 rounded border border-gray-700/50 hover:border-gray-600 transition-colors">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm font-bold text-gray-300">Member {idx + 1} {idx === 0 && '(Lead)'}</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                            {/* Name */}
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Full Name *"
                                                    value={member.name}
                                                    onChange={(e) => updateMember(idx, 'name', e.target.value)}
                                                    className={`w-full bg-gray-950 border ${validationErrors[`member_${idx}_name`] ? 'border-red-500' : 'border-gray-700'} rounded p-2 text-white text-sm focus:border-cyber-neonBlue outline-none`}
                                                />
                                                {validationErrors[`member_${idx}_name`] && <span className="text-red-500 text-xs">{validationErrors[`member_${idx}_name`]}</span>}
                                            </div>

                                            {/* Registration ID */}
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Registration ID / Roll No *"
                                                    value={member.registration_number}
                                                    onChange={(e) => updateMember(idx, 'registration_number', e.target.value)}
                                                    className={`w-full bg-gray-950 border ${validationErrors[`member_${idx}_reg`] ? 'border-red-500' : 'border-gray-700'} rounded p-2 text-white text-sm focus:border-cyber-neonBlue outline-none`}
                                                />
                                                {validationErrors[`member_${idx}_reg`] && <span className="text-red-500 text-xs">{validationErrors[`member_${idx}_reg`]}</span>}
                                            </div>

                                            {/* Phone */}
                                            <div>
                                                <input
                                                    type="tel"
                                                    placeholder="Phone (10 digits) *"
                                                    maxLength={10}
                                                    value={member.phone}
                                                    onChange={(e) => updateMember(idx, 'phone', e.target.value.replace(/\D/g, ''))}
                                                    className={`w-full bg-gray-950 border ${validationErrors[`member_${idx}_phone`] ? 'border-red-500' : 'border-gray-700'} rounded p-2 text-white text-sm focus:border-cyber-neonBlue outline-none`}
                                                />
                                                {validationErrors[`member_${idx}_phone`] && <span className="text-red-500 text-xs">{validationErrors[`member_${idx}_phone`]}</span>}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <input
                                                    type="email"
                                                    placeholder="Email Address *"
                                                    value={member.email}
                                                    onChange={(e) => updateMember(idx, 'email', e.target.value)}
                                                    className={`w-full bg-gray-950 border ${validationErrors[`member_${idx}_email`] ? 'border-red-500' : 'border-gray-700'} rounded p-2 text-white text-sm focus:border-cyber-neonBlue outline-none`}
                                                />
                                                {validationErrors[`member_${idx}_email`] && <span className="text-red-500 text-xs">{validationErrors[`member_${idx}_email`]}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in-right">
                            {/* Step 2: Payment */}
                            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col items-center text-center">
                                <h3 className="text-xl font-bold text-white mb-2">Secure Payment Gateway</h3>
                                <p className="text-gray-400 text-sm mb-6">Scan the QR code to complete your registration for <span className="text-cyber-neonBlue font-bold">{teamName}</span>.</p>

                                <div className="bg-white p-4 rounded-xl shadow-lg mb-6 transform hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={`/qrcodes/${calculateTotal()}.jpeg`}
                                        alt={`Pay ₹${calculateTotal()}`}
                                        className="w-56 h-56 object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                            (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="w-56 h-56 flex items-center justify-center text-black font-bold">QR Code Not Found</div>';
                                        }}
                                    />
                                    <p className="text-black font-bold mt-2 text-lg">Amount: ₹{calculateTotal()}</p>
                                </div>

                                <div className="w-full max-w-md space-y-4">
                                    <div>
                                        <label className="block text-left text-sm font-bold text-gray-300 mb-1">Transaction ID / UTR *</label>
                                        <input
                                            type="text"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            className="w-full bg-gray-950 border border-gray-600 rounded p-3 text-white focus:border-green-500 outline-none"
                                            placeholder="Enter UPI Ref No. / Transaction ID"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-left text-sm font-bold text-gray-300 mb-1">Payment Screenshot *</label>
                                        <div className="bg-gray-950 border-2 border-dashed border-gray-600 rounded-lg p-6 hover:border-cyber-neonBlue transition-colors cursor-pointer relative group">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => e.target.files && setScreenshot(e.target.files[0])}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                required
                                            />
                                            <div className="flex flex-col items-center gap-2 pointer-events-none group-hover:scale-105 transition-transform">
                                                {screenshot ? (
                                                    <span className="text-green-400 font-bold flex items-center gap-2"><CheckCircle size={16} /> {screenshot.name}</span>
                                                ) : (
                                                    <>
                                                        <span className="text-cyber-neonBlue">Click or Drop Screenshot</span>
                                                        <span className="text-xs text-gray-500">JPG, PNG, PDF (Max 5MB)</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="bg-gray-800 p-6 border-t border-gray-700 flex justify-between items-center shrink-0">
                    {step === 1 ? (
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase tracking-widest">Total Payable</span>
                            <span className="text-2xl font-bold text-cyber-neonGreen">₹{calculateTotal()}</span>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="flex items-center gap-2 text-gray-400 hover:text-white"
                        >
                            <ArrowLeft size={18} /> Back to Details
                        </button>
                    )}

                    {step === 1 ? (
                        <button
                            onClick={handleNext}
                            className="bg-cyber-neonBlue hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded shadow-[0_0_15px_rgba(0,240,255,0.4)] transform active:scale-95 transition-all flex items-center gap-2"
                        >
                            Next Step <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded shadow-[0_0_15px_rgba(0,255,100,0.4)] transform active:scale-95 transition-all flex items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Verifying...' : 'Complete Payment'} <CheckCircle size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

import React, { useState } from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminLogin: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Invalid password');
            }
        } catch (err) {
            setError('Login failed. Please check server connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4 font-rajdhani">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-neonBlue/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-neonPurple/10 rounded-full blur-[100px]" />
            </div>

            <div className="bg-cyber-panel border border-cyber-neonBlue/30 p-8 rounded-xl max-w-md w-full relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-cyber-neonBlue/20 rounded-full flex items-center justify-center mb-4 border border-cyber-neonBlue/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                        <ShieldCheck className="text-cyber-neonBlue w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-white font-orbitron tracking-wider">ADMIN<span className="text-cyber-neonPink">_ACCESS</span></h2>
                    <p className="text-gray-400 mt-2 text-sm">Secure Database Gateway</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                            Restricted Key
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-gray-700 rounded p-3 pl-10 text-white focus:border-cyber-neonBlue focus:ring-1 focus:ring-cyber-neonBlue outline-none transition-all placeholder-gray-600"
                                placeholder="Enter admin password"
                                autoFocus
                            />
                            <Lock className="absolute left-3 top-3.5 text-gray-500 w-4 h-4" />
                        </div>
                        {error && (
                            <p className="text-red-400 text-sm mt-2 bg-red-900/20 p-2 rounded border border-red-900/50 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyber-neonBlue/10 hover:bg-cyber-neonBlue/20 text-cyber-neonBlue border border-cyber-neonBlue hover:border-white hover:text-white font-bold py-3 px-4 rounded transition-all duration-300 uppercase tracking-widest shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                    >
                        {loading ? 'Authenticating...' : 'Authenticate'}
                    </button>

                    <div className="text-center mt-6">
                        <a href="/" className="text-gray-500 hover:text-gray-300 text-sm underline underline-offset-4 transition-colors">
                            Return to User Interface
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

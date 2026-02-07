import { useState } from 'react';
import { MessageCircle, X, Phone, User, Award } from 'lucide-react';

export const HelpButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const contacts = [
        {
            role: "Club Leader",
            number: "88109 94290",
            icon: Award,
            color: "text-cyber-neonPurple"
        },
        {
            role: "Team Developer",
            number: "8101799554",
            icon: CodeIcon,
            color: "text-cyber-neonBlue"
        }
    ];

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Contact Card */}
            {isOpen && (
                <div className="absolute bottom-16 left-0 mb-2 w-72 bg-gray-900/95 backdrop-blur-md border border-cyber-neonGreen/50 rounded-xl shadow-[0_0_30px_rgba(0,255,136,0.15)] overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
                    <div className="bg-gray-800/80 p-3 border-b border-gray-700 flex justify-between items-center">
                        <h3 className="text-white font-bold font-orbitron text-sm">Emergency Support</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        {contacts.map((contact, index) => (
                            <div key={index} className="flex items-start gap-3 group">
                                <div className={`p-2 rounded-lg bg-gray-800 group-hover:bg-gray-700 transition-colors ${contact.color}`}>
                                    <contact.icon size={20} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{contact.role}</p>
                                    <a
                                        href={`tel:${contact.number.replace(/\s/g, '')}`}
                                        className="text-white font-mono hover:text-cyber-neonGreen transition-colors flex items-center gap-2"
                                    >
                                        {contact.number}
                                        <Phone size={12} className="opacity-50" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-cyber-neonGreen/10 p-2 text-center border-t border-gray-800">
                        <p className="text-[10px] text-cyber-neonGreen font-mono">SYSTEM_ONLINE // HELP_ACTIVE</p>
                    </div>
                </div>
            )}

            {/* Notification Bubble - Only show when closed */}
            {!isOpen && (
                <div className="absolute bottom-16 left-0 mb-2 w-max animate-bounce">
                    <div className="bg-cyber-neonBlue text-black font-bold text-xs px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.5)] relative">
                        Need Help?
                        {/* Triangle pointing down */}
                        <div className="absolute -bottom-1 left-6 w-2 h-2 bg-cyber-neonBlue transform rotate-45"></div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${isOpen
                    ? 'bg-gray-700 text-white rotate-45 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'bg-cyber-neonGreen text-black shadow-[0_0_20px_rgba(0,255,136,0.4)] hover:bg-green-400'
                    }`}
                aria-label="Get Help"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </div>
    );
};

// Simple Code icon component since importing directly from lucide-react might conflict if not exported
const CodeIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
);

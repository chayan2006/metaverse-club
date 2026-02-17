import { useState } from 'react';
import { MessageCircle, X, Phone, User, Award, HelpCircle, Send, ChevronRight } from 'lucide-react';

export const HelpButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'contacts' | 'faq' | 'support'>('contacts');

    // Contacts Data
    const contacts = [
        {
            role: "Club Leader",
            number: "88109 94290",
            icon: Award,
            color: "text-cyber-neonPurple",
            bg: "bg-cyber-neonPurple/10"
        },
        {
            role: "Team Developer",
            number: "8101799554",
            icon: CodeIcon,
            color: "text-cyber-neonBlue",
            bg: "bg-cyber-neonBlue/10"
        }
    ];

    // FAQ Data
    const faqs = [
        { q: "How do I register?", a: "Click the 'Join Now' button and fill out the form." },
        { q: "Is it free?", a: "Yes, membership is free for all students." },
        { q: "Who can join?", a: "Any student interested in tech and coding." }
    ];

    return (
        <div className="fixed bottom-6 left-6 z-50 font-rajdhani">
            {/* Main Modal Card */}
            {isOpen && (
                <div className="absolute bottom-20 left-0 w-80 bg-gray-900/95 backdrop-blur-xl border border-cyber-neonGreen/30 rounded-2xl shadow-[0_0_40px_rgba(0,255,136,0.1)] overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 origin-bottom-left">

                    {/* Header */}
                    <div className="bg-gray-800/80 p-4 border-b border-gray-700 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyber-neonGreen animate-pulse"></div>
                            <h3 className="text-white font-bold font-orbitron tracking-wide text-sm">HELP CENTER</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white transition-colors bg-gray-700/50 hover:bg-gray-700 p-1 rounded-md"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex border-b border-gray-800 bg-gray-900/50">
                        {(['contacts', 'faq', 'support'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all relative ${activeTab === tab ? 'text-cyber-neonBlue' : 'text-gray-500 hover:text-gray-300'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cyber-neonBlue shadow-[0_0_10px_rgba(0,240,255,0.5)] animate-in fade-in duration-300"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="p-5 min-h-[250px] max-h-[300px] overflow-y-auto custom-scrollbar">

                        {/* CONTACTS TAB */}
                        {activeTab === 'contacts' && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                <p className="text-xs text-gray-400 mb-2">Direct lines to our core team.</p>
                                {contacts.map((contact, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-700 group">
                                        <div className={`p-2.5 rounded-lg ${contact.bg} ${contact.color} group-hover:scale-110 transition-transform`}>
                                            <contact.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{contact.role}</p>
                                            <a
                                                href={`tel:${contact.number.replace(/\s/g, '')}`}
                                                className="text-white font-mono text-sm hover:text-cyber-neonGreen transition-colors flex items-center gap-2 mt-0.5"
                                            >
                                                {contact.number}
                                                <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-cyber-neonGreen" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* FAQ TAB */}
                        {activeTab === 'faq' && (
                            <div className="space-y-3 animate-in slide-in-from-right-4 fade-in duration-300">
                                {faqs.map((item, i) => (
                                    <div key={i} className="bg-gray-800/30 rounded-lg p-3 border border-gray-800 hover:border-gray-700 transition-colors">
                                        <h4 className="text-cyber-neonGreen text-xs font-bold mb-1 flex items-center gap-2">
                                            <HelpCircle size={12} /> {item.q}
                                        </h4>
                                        <p className="text-gray-400 text-xs leading-relaxed pl-5 border-l border-gray-700 ml-0.5">
                                            {item.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* SUPPORT TAB */}
                        {activeTab === 'support' && (
                            <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                        <Send size={20} />
                                    </div>
                                    <p className="text-sm text-gray-300 font-bold">Have a generic query?</p>
                                    <p className="text-xs text-gray-500 mt-1">Drop us a message and we'll get back to you.</p>
                                </div>
                                <a
                                    href="mailto:support@metaverseclub.com"
                                    className="block w-full text-center py-2.5 rounded-lg bg-cyber-neonBlue/10 text-cyber-neonBlue border border-cyber-neonBlue/20 hover:bg-cyber-neonBlue hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all font-bold text-xs uppercase tracking-wider"
                                >
                                    Email Support
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-900 p-2 text-center border-t border-gray-800">
                        <p className="text-[10px] text-gray-600 font-mono">
                            STATUS: <span className="text-green-500">OPERATIONAL</span>
                        </p>
                    </div>
                </div>
            )}

            {/* Notification Bubble - Only show when closed */}
            {!isOpen && (
                <div className="absolute bottom-20 left-1 mb-2 w-max animate-bounce pointer-events-none">
                    <div className="bg-cyber-neonBlue text-black font-bold text-xs px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.5)] relative">
                        Need Help?
                        <div className="absolute -bottom-1 left-4 w-2 h-2 bg-cyber-neonBlue transform rotate-45"></div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 z-[9999] ${isOpen
                    ? 'bg-gray-800 text-white rotate-180 shadow-[0_0_20px_rgba(255,255,255,0.1)]'
                    : 'bg-cyber-neonGreen text-black shadow-[0_0_25px_rgba(0,255,136,0.8)]'
                    }`}
                aria-label="Toggle Help"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} fill="currentColor" className="opacity-80" />}
            </button>
        </div>
    );
};

// Ensure CodeIcon is available
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

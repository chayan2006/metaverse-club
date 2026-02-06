import React from 'react';
import { Github, Linkedin, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cyber-black py-10 border-t border-cyber-panel">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="flex justify-center gap-8 mb-6">
          <a href="#" className="p-3 bg-cyber-panel rounded-full text-gray-400 hover:text-white hover:bg-cyber-neonBlue transition-all duration-300">
            <Github size={20} />
          </a>
          <a href="#" className="p-3 bg-cyber-panel rounded-full text-gray-400 hover:text-white hover:bg-cyber-neonPurple transition-all duration-300">
            <Linkedin size={20} />
          </a>
          <a href="#" className="p-3 bg-cyber-panel rounded-full text-gray-400 hover:text-white hover:bg-cyber-neonPink transition-all duration-300">
            <MessageSquare size={20} />
          </a>
        </div>

        <p className="text-gray-500 text-sm mb-2">
          &copy; {new Date().getFullYear()} Metaverse. All Systems Operational.
        </p>
        <p className="text-gray-700 text-xs">
          Built with React & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};
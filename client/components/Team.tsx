import React from 'react';
import { TEAM_MEMBERS } from '../constants';
import { User, Github, Linkedin, Twitter } from 'lucide-react';

export const Team: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-16">
         <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white">
          <span className="text-cyber-neonBlue">/</span> CORE_UNIT
        </h2>
        <div className="hidden md:block w-32 h-[1px] bg-gray-700"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {TEAM_MEMBERS.map((member, index) => (
          <div 
            key={member.id}
            className="group relative bg-cyber-panel rounded-xl overflow-hidden border border-transparent hover:border-cyber-neonBlue transition-all duration-300"
          >
            {/* Hexagon Background Effect */}
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <User size={120} />
            </div>

            <div className="p-6 pt-12 relative z-10 text-center">
              {/* Avatar Placeholder */}
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyber-neonBlue/50 p-1 group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-cyber-black flex items-center justify-center overflow-hidden">
                    {/* Random robohash or placeholder for visual interest */}
                    <img 
                      src={`https://picsum.photos/seed/${member.name.replace(' ', '')}/200/200`} 
                      alt={member.name}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                    />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyber-neonBlue transition-colors">{member.name}</h3>
              <p className="text-cyber-neonPurple text-sm font-medium mb-6 uppercase tracking-wider">{member.role}</p>

              <div className="flex justify-center gap-4">
                <a href="#" className="text-gray-500 hover:text-white transition-colors"><Github size={18} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-400 transition-colors"><Twitter size={18} /></a>
                <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><Linkedin size={18} /></a>
              </div>
            </div>
            
            {/* Hover Glitch Line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-cyber-neonBlue transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
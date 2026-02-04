import React from 'react';
import { Target, Layers, Code, Zap } from 'lucide-react';

export const About: React.FC = () => {
  const techs = [
    { name: 'Metaverse', icon: <Layers size={24} />, color: 'text-purple-400', border: 'border-purple-400/30' },
    { name: 'AI / ML', icon: <Code size={24} />, color: 'text-green-400', border: 'border-green-400/30' },
    { name: 'Blockchain', icon: <Zap size={24} />, color: 'text-yellow-400', border: 'border-yellow-400/30' },
    { name: 'AR / VR', icon: <Target size={24} />, color: 'text-cyan-400', border: 'border-cyan-400/30' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-4">
          <span className="text-cyber-neonBlue">/</span> MISSION_VISION
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyber-neonBlue to-transparent mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="bg-cyber-panel p-8 rounded-lg border-l-4 border-cyber-neonPurple shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-neonPurple/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-cyber-neonPurple/10 transition-colors"></div>
          <h3 className="text-2xl font-orbitron text-white mb-4 flex items-center gap-3">
            <Target className="text-cyber-neonPurple" /> Our Purpose
          </h3>
          <p className="text-gray-300 leading-relaxed text-lg">
            We are a collective of developers, designers, and visionaries dedicated to exploring the boundaries of the digital world. 
            Our mission is to foster innovation in Web3, Artificial Intelligence, and Extended Reality (XR) by providing a collaborative 
            environment for learning, building, and deploying decentralized applications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {techs.map((tech) => (
            <div 
              key={tech.name} 
              className={`p-6 bg-cyber-black rounded-xl border ${tech.border} hover:scale-105 transition-transform duration-300 cursor-default`}
            >
              <div className={`mb-4 ${tech.color}`}>{tech.icon}</div>
              <h4 className="text-xl font-bold text-gray-100">{tech.name}</h4>
              <p className="text-gray-500 text-sm mt-2">Exploring next-gen possibilities.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
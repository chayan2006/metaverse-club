import React from 'react';
import { ChevronRight } from 'lucide-react';
import { HexagonHero } from './HexagonHero';

export const Hero: React.FC = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">

      {/* Text Content */}
      <div className="w-full md:w-1/2 text-center md:text-left z-10">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-cyber-neonPurple uppercase bg-cyber-neonPurple/10 rounded-full border border-cyber-neonPurple/20 animate-fade-in-up">
          Welcome to the Future
        </div>
        <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-6 leading-tight">
          <span className="block text-white">BUILD WITH</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyber-neonBlue to-cyber-neonPurple neon-text">
            METAVERSE
          </span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-lg mx-auto md:mx-0 font-light">
          Web3 • VR • AI • Future Tech. Join a community of innovators shaping the next digital frontier.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <a
            href="#join"
            className="group relative px-8 py-3 bg-cyber-neonBlue text-cyber-black font-bold uppercase tracking-wider skew-x-[-10deg] hover:bg-white transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
          >
            <span className="block skew-x-[10deg] flex items-center gap-2">
              Join The Club <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </a>
          <a
            href="#events"
            className="group relative px-8 py-3 bg-transparent border border-cyber-neonPurple text-cyber-neonPurple font-bold uppercase tracking-wider skew-x-[-10deg] hover:bg-cyber-neonPurple hover:text-white transition-all duration-300"
          >
            <span className="block skew-x-[10deg]">
              View Events
            </span>
          </a>
        </div>
      </div>

      {/* Visual Animation: Hexagon Hero */}
      <div className="w-full md:w-1/2 flex justify-center items-center relative h-[400px] md:h-[500px]">
        <div className="w-full h-full md:w-[500px] md:h-[500px] flex items-center justify-center">
          <HexagonHero />
        </div>
      </div>
    </div>
  );
};
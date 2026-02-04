import React from 'react';
import { Hexagon, Zap } from 'lucide-react';

export const HexagonHero: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center perspective-1000">
      {/* Background Glow Effect */}
      <div className="absolute w-[400px] h-[400px] bg-cyber-neonBlue/10 rounded-full blur-[80px] animate-pulse pointer-events-none" />

      {/* Main Container Scaled for Responsiveness */}
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center">
        
        {/* Outer Ring - Slow Rotation */}
        <div className="absolute w-full h-full animate-spin-slow opacity-60">
           <Hexagon 
             className="w-full h-full text-cyber-neonBlue drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]" 
             strokeWidth={0.5} 
           />
        </div>
        
        {/* Middle Ring - Reverse Rotation */}
        <div className="absolute w-[70%] h-[70%] animate-spin-reverse-slow opacity-80">
           <Hexagon 
             className="w-full h-full text-cyber-neonPurple drop-shadow-[0_0_15px_rgba(188,19,254,0.4)]" 
             strokeWidth={1} 
           />
        </div>

        {/* Inner Ring - Faster Rotation */}
        <div className="absolute w-[45%] h-[45%] animate-[spin_10s_linear_infinite] opacity-100">
           <Hexagon 
             className="w-full h-full text-cyber-neonPink drop-shadow-[0_0_15px_rgba(255,0,85,0.4)]" 
             strokeWidth={1.5} 
           />
        </div>

        {/* Center Floating Core */}
        <div className="absolute animate-float z-10">
          <div className="w-20 h-20 bg-cyber-panel/80 border border-white/20 rotate-45 flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.3)] backdrop-blur-md">
             <div className="-rotate-45">
               <img src="" alt="" />
             </div>
          </div>
        </div>

        {/* Decorative Floating Particles */}
        <div className="absolute top-0 right-10 w-2 h-2 bg-cyber-neonBlue rounded-full animate-ping" />
        <div className="absolute bottom-10 left-10 w-2 h-2 bg-cyber-neonPink rounded-full animate-ping delay-700" />
        <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-300" />
      </div>
      
      {/* Optional Data Text Overlay */}
      <div className="absolute bottom-0 right-0 font-mono text-[10px] text-cyber-neonBlue/60 animate-pulse">
        SYS_STATUS: ONLINE
      </div>
    </div>
  );
};
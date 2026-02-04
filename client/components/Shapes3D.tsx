import React from 'react';

// TESSERACT: A cube within a cube, rotating in opposite directions
export const Tesseract: React.FC = () => {
  return (
    <div className="perspective-1000 w-[200px] h-[200px] absolute opacity-40 animate-float pointer-events-none">
      <div className="cube animate-rotate-3d">
        {/* Outer Shell */}
        <div className="cube-face">META</div>
        <div className="cube-face">WEB3</div>
        <div className="cube-face">AI</div>
        <div className="cube-face">VR</div>
        <div className="cube-face">XR</div>
        <div className="cube-face">FUTURE</div>

        {/* Inner Core */}
        <div className="cube-inner animate-rotate-3d-reverse">
          <div className="cube-face-inner"></div>
          <div className="cube-face-inner"></div>
          <div className="cube-face-inner"></div>
          <div className="cube-face-inner"></div>
          <div className="cube-face-inner"></div>
          <div className="cube-face-inner"></div>
        </div>
      </div>
    </div>
  );
};

// FLOATING CRYSTAL: An Octahedron (Double Pyramid)
export const FloatingCrystal: React.FC = () => {
  return (
    <div className="perspective-1000 w-[200px] h-[400px] absolute opacity-30 animate-float pointer-events-none" style={{ animationDelay: '1s' }}>
      <div className="w-full h-full preserve-3d animate-rotate-3d-reverse">
        {/* Top Pyramid */}
        <div className="pyramid absolute top-0 left-0">
          <div className="pyramid-face"></div>
          <div className="pyramid-face"></div>
          <div className="pyramid-face"></div>
          <div className="pyramid-face"></div>
        </div>
        {/* Bottom Pyramid (Inverted) */}
        <div className="absolute top-[200px] left-0 w-[200px] h-[200px] preserve-3d">
           <div className="crystal-face-lower"></div>
           <div className="crystal-face-lower"></div>
           <div className="crystal-face-lower"></div>
           <div className="crystal-face-lower"></div>
        </div>
      </div>
    </div>
  );
};

// GYROSCOPE: Rotating rings with a glowing core
export const GyroScope: React.FC = () => {
  return (
    <div className="perspective-1000 w-[300px] h-[300px] absolute opacity-30 pointer-events-none flex items-center justify-center">
      <div className="preserve-3d relative w-full h-full animate-spin-slow">
        {/* Glowing Core */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-cyber-neonBlue/20 rounded-full blur-md shadow-[0_0_30px_#00f3ff] animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-[0_0_15px_white]"></div>

        {/* Outer Ring */}
        <div className="ring-3d w-full h-full border-cyber-neonBlue border-dashed rounded-full animate-spin-reverse-slow" style={{ transform: 'rotateX(60deg)' }}></div>
        {/* Middle Ring */}
        <div className="ring-3d w-[80%] h-[80%] top-[10%] left-[10%] border-cyber-neonPurple border-dotted rounded-full animate-spin-slow" style={{ transform: 'rotateY(60deg)' }}></div>
        {/* Inner Ring */}
        <div className="ring-3d w-[60%] h-[60%] top-[20%] left-[20%] border-cyber-neonPink border-solid rounded-full animate-spin-reverse-slow" style={{ transform: 'rotateX(90deg)' }}></div>
      </div>
    </div>
  );
};
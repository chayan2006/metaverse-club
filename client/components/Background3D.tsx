import React, { useEffect, useRef } from 'react';

export const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Starfield parameters
    const stars: { x: number; y: number; z: number; color: string }[] = [];
    const numStars = 200;
    const speed = 2;
    const colors = ['#00f3ff', '#bc13fe', '#ff0055'];

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * width,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const render = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(2, 2, 5, 0.2)'; 
      ctx.fillRect(0, 0, width, height);

      // Center origin
      const cx = width / 2;
      const cy = height / 2;

      stars.forEach((star) => {
        // Update Z (move towards screen)
        star.z -= speed;

        // Reset if passed screen
        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
          star.z = width;
        }

        // Projection
        const scale = 300 / (star.z + 0.1); // Field of View
        const x2d = star.x * scale + cx;
        const y2d = star.y * scale + cy;

        // Draw star
        const size = Math.max(0.5, (1 - star.z / width) * 3);
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby stars (constellations)
        // Optimization: only check against a few other stars to save CPU
        // or just draw lines to center for "warp" effect
      });

      // Draw Grid Floor
      const time = Date.now() * 0.0005;
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // Moving Horizontal Lines
      const gridSize = 50; // virtual units
      const gridCount = 20;
      // We simulate a floor plane at y = 200 (in 3D space)
      const floorY = 200;
      
      for(let i=0; i<gridCount; i++) {
        // Perspective projection for lines running -Z to +Z
        // We move them by 'time' to simulate scroll
        let z = ((i * gridSize - (time * 100)) % (gridCount * gridSize));
        if (z < 10) z += gridCount * gridSize;
        
        const scale = 300 / z;
        const yScreen = floorY * scale + cy;
        
        if (yScreen < height) {
           ctx.moveTo(0, yScreen);
           ctx.lineTo(width, yScreen);
        }
      }
      
      // Vertical Perspective Lines
      for(let i=-10; i<=10; i++) {
         const xWorld = i * 100;
         // Far point
         const zFar = 2000;
         const scaleFar = 300 / zFar;
         const xFar = xWorld * scaleFar + cx;
         const yFar = floorY * scaleFar + cy;
         
         // Near point
         const zNear = 10;
         const scaleNear = 300 / zNear;
         const xNear = xWorld * scaleNear + cx;
         const yNear = floorY * scaleNear + cy;
         
         ctx.moveTo(xFar, yFar);
         ctx.lineTo(xNear, yNear);
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-60"
    />
  );
};
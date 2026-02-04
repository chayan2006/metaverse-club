import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const HackerEarth: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SETUP SCENE ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    
    // Camera Setup (Orbital)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 22; // Start Zoom

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 12;
    controls.maxDistance = 60;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    // --- EARTH MESH ---
    // Using a texture loader for realistic outlines
    const textureLoader = new THREE.TextureLoader();
    
    // Fallback/Placeholder geometry if texture fails, but we try to load a standard earth map
    const earthGeo = new THREE.SphereGeometry(5, 64, 64);
    
    // Hacker Style Shader/Material
    // We mix a blue diffuse color with the texture
    const earthMat = new THREE.MeshPhongMaterial({
      map: textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'),
      color: 0x0044aa, // Tint map blue
      emissive: 0x001133,
      emissiveIntensity: 0.5,
      specular: 0x111111,
      shininess: 25,
      transparent: true,
      opacity: 0.9,
    });
    
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Atmosphere Glow (slightly larger sphere)
    const atmosGeo = new THREE.SphereGeometry(5.2, 64, 64);
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosphere);

    // --- HEXAGONAL OVERLAY SYSTEM ---
    const hexGroup = new THREE.Group();
    scene.add(hexGroup);

    // Helper to convert lat/lon to vector
    const latLongToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = (radius * Math.sin(phi) * Math.sin(theta));
      const y = (radius * Math.cos(phi));
      return new THREE.Vector3(x, y, z);
    };

    // Create instanced hexagons
    const hexGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.05, 6);
    hexGeo.rotateX(Math.PI / 2); // Orient flat facing out
    const hexMat = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6,
      wireframe: true // Hacker style
    });

    // Generate ~40 clusters of data
    const hexagons: THREE.Mesh[] = [];
    
    for (let i = 0; i < 40; i++) {
        // Random lat/long
        const lat = (Math.random() - 0.5) * 160;
        const lon = (Math.random() - 0.5) * 360;
        
        // Hover 50-100 units equivalent? Scaled to radius 5 -> hover 0.5 to 1.5 units
        const hoverDist = 5.8 + Math.random() * 1.5;
        const pos = latLongToVector3(lat, lon, hoverDist);
        
        const mesh = new THREE.Mesh(hexGeo, hexMat);
        mesh.position.copy(pos);
        mesh.lookAt(new THREE.Vector3(0,0,0));
        
        // Add some random scaling
        const scale = 0.5 + Math.random();
        mesh.scale.set(scale, scale, 1);
        
        // Custom property for animation
        (mesh as any).userData = {
            baseScale: scale,
            pulseSpeed: 0.5 + Math.random() * 2,
            pulsePhase: Math.random() * Math.PI * 2
        };
        
        hexGroup.add(mesh);
        hexagons.push(mesh);
    }

    // Connect some lines?
    // (Optional visual clutter, keeping it clean for now)

    // --- LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0x001133, 2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00FFFF, 1.5);
    dirLight.position.set(10, 10, 10);
    scene.add(dirLight);

    // --- ANIMATION LOOP ---
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      controls.update();

      // Pulse Hexagons
      hexagons.forEach(hex => {
          const ud = (hex as any).userData;
          const scaleVar = Math.sin(time * ud.pulseSpeed + ud.pulsePhase) * 0.3;
          const newScale = ud.baseScale + scaleVar;
          hex.scale.set(newScale, newScale, 1);
          
          // Rotate hex slightly
          hex.rotation.z += 0.01;
      });

      // Atmosphere subtle pulse
      atmosphere.scale.setScalar(1 + Math.sin(time) * 0.01);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameId);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      earthGeo.dispose();
      earthMat.dispose();
    };
  }, []);

  // --- MATRIX RAIN (2D Canvas Background) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = canvas.clientWidth;
    let h = canvas.height = canvas.clientHeight;

    const cols = Math.floor(w / 20);
    const ypos = Array(cols).fill(0);

    const matrixRender = () => {
      ctx.fillStyle = 'rgba(0, 10, 20, 0.05)'; // Fade effect
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = '#0f0';
      ctx.font = '12px monospace';

      ypos.forEach((y, ind) => {
        const text = String.fromCharCode(Math.random() * 128);
        const x = ind * 20;
        
        // Random cyan or green
        ctx.fillStyle = Math.random() > 0.8 ? '#00FFFF' : '#003300';
        if (Math.random() > 0.98) ctx.fillStyle = '#fff'; // Sparkle

        ctx.fillText(text, x, y);

        if (y > h + Math.random() * 10000) ypos[ind] = 0;
        else ypos[ind] = y + 20;
      });
      requestAnimationFrame(matrixRender);
    };
    
    // Just run it
    const anim = requestAnimationFrame(matrixRender);
    
    // Resize for Matrix
    const resizeMatrix = () => {
       w = canvas.width = canvas.clientWidth;
       h = canvas.height = canvas.clientHeight;
    };
    window.addEventListener('resize', resizeMatrix);

    return () => {
       window.removeEventListener('resize', resizeMatrix);
       cancelAnimationFrame(anim);
    }
  }, []);

  return (
    <div className="relative w-full h-full rounded-full overflow-hidden border border-cyber-neonBlue/30 shadow-[0_0_50px_rgba(0,243,255,0.2)] bg-black">
      {/* Matrix Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-30" 
      />
      
      {/* 3D Scene */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Scanlines Overlay */}
      <div className="absolute inset-0 scanlines z-20 pointer-events-none opacity-50"></div>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none">
         <div className="text-[10px] font-mono text-cyber-neonBlue animate-pulse">
            ORBITAL_VIEW: LIVE<br/>
            TARGET: EARTH<br/>
            STATUS: MONITORING
         </div>
      </div>
      
      {/* Chromatic Aberration Fake (CSS) */}
      <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-30" 
           style={{ transform: 'translate(2px, 0)', background: 'rgba(255,0,0,0.05)' }}></div>
      <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-30" 
           style={{ transform: 'translate(-2px, 0)', background: 'rgba(0,255,255,0.05)' }}></div>
    </div>
  );
};
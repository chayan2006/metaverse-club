import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const EventsBackground3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    const getDimensions = () => {
      if (!containerRef.current) return { width: 0, height: 0 };
      return {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      };
    };

    const { width, height } = getDimensions();

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.02); // Match bg color

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Geometry Group
    const group = new THREE.Group();
    scene.add(group);

    // Create Shapes (Tetrahedrons and Icosahedrons)
    const geometryIco = new THREE.IcosahedronGeometry(1, 0);
    const geometryTetra = new THREE.TetrahedronGeometry(1, 0);
    
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x00f3ff, // Neon Blue
      wireframe: true, 
      transparent: true, 
      opacity: 0.15 
    });

    const particles: THREE.Mesh[] = [];

    for (let i = 0; i < 40; i++) {
      const isIco = Math.random() > 0.5;
      const mesh = new THREE.Mesh(isIco ? geometryIco : geometryTetra, material);
      
      // Spread them out
      mesh.position.x = (Math.random() - 0.5) * 100;
      mesh.position.y = (Math.random() - 0.5) * 60;
      mesh.position.z = (Math.random() - 0.5) * 50; // Depth

      // Random scale
      const s = Math.random() * 2 + 0.5;
      mesh.scale.set(s, s, s);

      // Random rotation speed
      mesh.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01
        }
      };

      group.add(mesh);
      particles.push(mesh);
    }

    // Interaction State
    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
    const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX - windowHalf.x);
      mouse.y = (event.clientY - windowHalf.y);
    };

    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      // Smooth camera/group movement
      target.x = mouse.x * 0.001;
      target.y = mouse.y * 0.001;

      group.rotation.y += 0.05 * (target.x - group.rotation.y);
      group.rotation.x += 0.05 * (target.y - group.rotation.x);

      // Rotate individual particles
      particles.forEach((p) => {
        p.rotation.x += p.userData.rotationSpeed.x;
        p.rotation.y += p.userData.rotationSpeed.y;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current) return;
      
      const { width, height } = getDimensions();
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
      
      windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometryIco.dispose();
      geometryTetra.dispose();
      material.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    />
  );
};
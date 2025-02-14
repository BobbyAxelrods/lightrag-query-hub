
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Position camera
    camera.position.z = 5;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - windowHalfX) * 0.0003;
      mouseY = (event.clientY - windowHalfY) * 0.0003;
    };

    document.addEventListener('mousemove', onMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      particles.rotation.x += 0.0002;
      particles.rotation.y += 0.0002;

      particles.rotation.y += mouseX * 0.5;
      particles.rotation.x += mouseY * 0.5;

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}
    />
  );
}

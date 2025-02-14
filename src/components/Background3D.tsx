
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create simple wave geometry
    const geometry = new THREE.PlaneGeometry(30, 30, 50, 50);
    const material = new THREE.MeshPhongMaterial({
      color: '#4338ca',
      wireframe: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15,
    });

    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 3;
    plane.position.y = -2;
    scene.add(plane);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // Position camera
    camera.position.z = 8;

    // Animation
    let frame = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      frame += 0.005;

      // Create wave effect
      const positions = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = Math.sin((x + frame) * 0.3) * Math.cos((z + frame) * 0.3) * 0.5;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 bg-gradient-to-b from-indigo-950 to-slate-900"
    />
  );
}

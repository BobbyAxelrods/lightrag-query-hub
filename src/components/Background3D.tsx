
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Background3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configuration
    const conf = {
      fov: 75,
      cameraZ: 75,
      xyCoef: 50,
      zCoef: 10,
      lightIntensity: 0.7,
      ambientColor: 0x000000,
      light1Color: 0x1EAEDB, // Bright blue
      light2Color: 0x0FA0CE, // Ocean blue
      light3Color: 0x7DD3FC, // Sky blue
      light4Color: 0x38BDF8, // Lighter blue
    };

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(conf.fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const material = new THREE.MeshPhongMaterial({
      color: '#38BDF8', // Lighter blue
      wireframe: true,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3, // Increased opacity
    });

    const plane = new THREE.Mesh(planeGeometry, material);
    plane.rotation.x = -Math.PI / 2 - 0.2;
    plane.position.y = -25;
    scene.add(plane);

    // Add lights with increased intensity
    const lightDistance = 500;
    
    const light1 = new THREE.PointLight(conf.light1Color, conf.lightIntensity * 1.5, lightDistance);
    light1.position.set(0, 10, 30);
    scene.add(light1);
    
    const light2 = new THREE.PointLight(conf.light2Color, conf.lightIntensity * 1.5, lightDistance);
    light2.position.set(0, -10, -30);
    scene.add(light2);
    
    const light3 = new THREE.PointLight(conf.light3Color, conf.lightIntensity * 1.5, lightDistance);
    light3.position.set(30, 10, 0);
    scene.add(light3);
    
    const light4 = new THREE.PointLight(conf.light4Color, conf.lightIntensity * 1.5, lightDistance);
    light4.position.set(-30, 10, 0);
    scene.add(light4);

    // Position camera
    camera.position.z = 60;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Animate plane vertices with more pronounced waves
      const positions = planeGeometry.attributes.position.array as Float32Array;
      const time = Date.now() * 0.0002;
      
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];
        
        // Create wave pattern using multiple sine waves with larger amplitude
        positions[i + 2] = 
          Math.sin((x + time) * 0.3) * 4 + // Primary wave (increased amplitude)
          Math.sin((y + time) * 0.2) * 3 + // Secondary wave (increased amplitude)
          Math.sin((x + y + time) * 0.1) * 2; // Diagonal wave (increased amplitude)
      }
      planeGeometry.attributes.position.needsUpdate = true;

      // Animate lights
      const d = 50;
      const ltime = Date.now() * 0.001;
      light1.position.x = Math.sin(ltime * 0.1) * d;
      light1.position.z = Math.cos(ltime * 0.2) * d;
      light2.position.x = Math.cos(ltime * 0.3) * d;
      light2.position.z = Math.sin(ltime * 0.4) * d;
      light3.position.x = Math.sin(ltime * 0.5) * d;
      light3.position.z = Math.sin(ltime * 0.6) * d;
      light4.position.x = Math.sin(ltime * 0.7) * d;
      light4.position.z = Math.cos(ltime * 0.8) * d;

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
      className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0c4a6e] to-[#082f49]"
    />
  );
}

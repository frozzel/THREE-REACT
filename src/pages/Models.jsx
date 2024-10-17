import  { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import {particleImage} from '../assets/3D-models/rocket.glb';
// import Glow from 'glow.glb';

export default function Models() {
    const mountRef = useRef(null);

    useEffect(() => {
      // Set up the scene, camera, and renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({ antialias: true });
  
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);
  
      // Adjust camera position
      camera.position.z = 5;
  
      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
      scene.add(ambientLight);
  
      // Use GLTFLoader to load the GLB model
      const loader = new GLTFLoader();
      loader.load(
        'glow.glb',
        (gltf) => {
          const model = gltf.scene;
          scene.add(model);
        },
        undefined,
        (error) => {
          console.error('An error occurred loading the model:', error);
        }
      );
  
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
  
      animate();
  
      // Handle cleanup on unmount
      return () => {
        mountRef.current.removeChild(renderer.domElement);
        renderer.dispose();
      };
    }, []);
  
    return <div ref={mountRef} />;
  }


import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';


export default function Cube() {
  const mountRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const mount = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );  
  
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', onResize);

    // Trackball Controls for Camera
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 4;
    controls.dynamicDampingFactor = 0.15;
    

    // Animate function
    const animate = () => {
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      controls.update();
      
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(requestRef.current);

      mount.removeChild(renderer.domElement);

      geometry.dispose();
      material.dispose();
      scene.remove(cube);
      
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }} />;
}
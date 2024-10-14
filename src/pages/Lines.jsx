import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

export default function Lines() {
  const mountRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.6,
      1000
    );
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#1F1F1F");
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Trackball Controls for Camera
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 4;
    controls.dynamicDampingFactor = 0.15;

    // Create a blue LineBasicMaterial
    const material = new THREE.LineBasicMaterial({ color: 0x0094EE });
    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // Responsive Canvas Handling
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    
    window.addEventListener("resize", onResize);

    // Animate
    const animate = () => {
      line.rotation.y += 0.01;
      line.rotation.x += 0.01;
      controls.update();
      
      renderer.render(scene, camera);
      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(requestRef.current);

      mount.removeChild(renderer.domElement);

      controls.dispose();
      
      geometry.dispose();
      material.dispose();
      scene.remove(line);
      
      renderer.dispose();
    };
  }, []);

  // Create a container for the WebGL content for proper React integration
  return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }} />;
}
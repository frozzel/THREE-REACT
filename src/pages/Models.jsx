import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import moonImage from '../assets/textures/moon_1024.jpg';
import skyImage from '../assets/textures/sky2.jpg';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function Models() {
  const mountRef = useRef(null);

  useEffect(() => {
    let scene, renderer, camera, controls;
    let model;
    let rocketStartTime = Date.now();

    // Set up the scene, camera, and renderer
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Trackball Controls for Camera
    controls = new OrbitControls(camera, renderer.domElement);
    controls.rotateSpeed = 4;
    controls.dynamicDampingFactor = 0.15;

    // Adjust camera position
    camera.position.z = 3;

    // Add Hemisphere Light
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    /// sphere background
    const sphereGeo = new THREE.SphereGeometry(50, 50, 50);
    const sphereMat = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(skyImage), side: THREE.DoubleSide });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    /// create texture moon
    const texture = new THREE.TextureLoader().load(moonImage);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    /// add ground plain
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    plane.rotation.x = Math.PI / 2;
    plane.position.y = -2;

    // Use GLTFLoader to load the GLB model
    const loader = new GLTFLoader();
    loader.load('./3D-models/rocket.glb', (gltf) => {
      model = gltf.scene;
      scene.add(model);
      
    //   model.scale.set(0.1, 0.1, 0.1);
    //   model.position.set(0, -1, 0);
      model.castShadow = true;
      model.receiveShadow = true;
    });


    // Animation loop
    const animate = () => {
      controls.update();
      
      if (model) {
        const elapsed = (Date.now() - rocketStartTime) / 1000;
        
        // Move the rocket straight up for 15 seconds
        if (elapsed <= 7) {
          model.position.y += 0.05;
          model.position.x += -0.01;
          model.position.z += -0.01;
          model.rotation.y += -0.05;
          model.rotation.x = -0.02;

        } else {
          // Reset the rocket's position
          model.position.y = .0;
          model.position.x = .0;
          model.position.z = .0;
          rocketStartTime = Date.now();
        }
      }
      sphere.rotation.y += 0.001;
      sphere.rotation.x += 0.001;
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
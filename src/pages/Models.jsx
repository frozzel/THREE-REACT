import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import moonImage from '../assets/textures/moon_1024.jpg';
import skyImage from '../assets/textures/sky2.jpg';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

export default function Models() {
  const mountRef = useRef(null);
  const rocketRef = useRef(null); // Reference for the rocket object
  const animationStart = useRef(false); // Track if the rocket animation should start
  let rocketStartTime = useRef(null); // Track the start time of the animation

  useEffect(() => {
    let scene, renderer, camera, controls, rocket;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

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
    controls = new TrackballControls(camera, renderer.domElement);
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
    const sphereMat = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load(skyImage),
      side: THREE.DoubleSide,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphere);

    /// create texture moon
    const texture = new THREE.TextureLoader().load(moonImage);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);

    /// add ground plain
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    plane.rotation.x = Math.PI / 2;
    plane.position.y = -2;

    // Use GLTFLoader to load the GLB model
    const loader = new GLTFLoader();
    loader.load('./3D-models/rocket.glb', (gltf) => {
      rocketRef.current = gltf.scene;
      rocket = gltf.scene;
      scene.add(rocketRef.current);
      scene.add(rocket)

      rocketRef.current.castShadow = true;
      rocketRef.current.receiveShadow = true;

    });
    

    const onMouseClick = (event) => {
      // Ensure rocket model is loaded before attempting click detection
      if (!rocketRef.current) return;

      event.preventDefault();

      // Calculate normalized device coordinates (NDC)
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(rocketRef.current, true);

      if (intersects.length > 1) {
        animationStart.current = true; // Flag to start animation
        rocketStartTime.current = Date.now(); // Record the start time of the animation
      }
    };

    // Add mouse click event listener
    window.addEventListener('click', onMouseClick);

    // Animation loop
    const animate = () => {
      controls.update();
      if (animationStart.current) {
        const elapsed = (Date.now() - rocketStartTime.current) / 1000;
        if (elapsed <= 2 && rocketRef.current) {
          // Move the rocket straight up
          rocketRef.current.position.y += 0.03;
          rocket.position.y = rocketRef.current.position.y;
          rocketRef.current.position.x += -0.01;
          rocket.position.x = rocketRef.current.position.x;
          rocketRef.current.position.z += -0.01;
          rocket.position.z = rocketRef.current.position.z;
          rocketRef.current.rotation.y += -0.02;
          rocket.rotation.y = rocketRef.current.rotation.y;
          rocketRef.current.rotation.x = -0.02;
          rocket.rotation.x = rocketRef.current.rotation.x;
        } else if (elapsed > 1.9 && rocketRef.current) {
          // Reset the rocket's position
          rocketRef.current.position.y = 0.0;
          rocketRef.current.position.x = 0.0;
          rocketRef.current.position.z = 0.0;
          rocket.position.y = rocketRef.current.position.y;
          rocket.position.x = rocketRef.current.position.x;
          rocket.position.z = rocketRef.current.position.z;
          animationStart.current = false; // Stop the animation
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
      // window.removeEventListener('click', onMouseClick);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
}
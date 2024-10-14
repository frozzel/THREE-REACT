import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

export default function Home() {
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
      1200
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#1F1F1F");
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Make Canvas Responsive
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // Create box
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
    boxMesh.rotation.set(40, 0, 40);
    scene.add(boxMesh);

    // Create spheres
    const sphereMeshes = [];
    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xc56cef });
    for (let i = 0; i < 4; i++) {
      sphereMeshes[i] = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphereMeshes[i].position.set(0, 0, 0);
      scene.add(sphereMeshes[i]);
    }

    const newSphere = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial1 = new THREE.MeshLambertMaterial({ color: 0xc56cef });
    const sphereMesh1 = new THREE.Mesh(newSphere, sphereMaterial1);
    scene.add(sphereMesh1);

    // Lights
    const lights = [];
    const lightHelpers = [];
    // Correct PointLight constructor parameter
    const pointLight = new THREE.PointLight(0xffffff, 8, 12);
    
    // Properties for each light
    const lightValues = [
      { colour: 0x38e000, intensity: 80, dist: 12, x: 1, y: 0, z: 8 },
      { colour: 0xc56cef, intensity: 60, dist: 12, x: -2, y: 1, z: -10 },
      { colour: 0x000078, intensity: 30, dist: 10, x: 0, y: 10, z: 1 },
      { colour: 0x00ffdd, intensity: 60, dist: 12, x: 0, y: -10, z: -1 },
      { colour: 0x16a7f5, intensity: 60, dist: 12, x: 10, y: 3, z: 0 },
      { colour: 0x000078, intensity: 60, dist: 12, x: -10, y: -1, z: 0 }
    ];

    for (let i = 0; i < 6; i++) {
      lights[i] = new THREE.PointLight(
        lightValues[i].colour,
        lightValues[i].intensity,
        lightValues[i].dist
      );

      lights[i].position.set(
        lightValues[i].x,
        lightValues[i].y,
        lightValues[i].z
      );
      scene.add(lights[i]);
      scene.add(pointLight);

      lightHelpers[i] = new THREE.PointLightHelper(lights[i]);
      scene.add(lightHelpers[i]);
    }

    // Trackball Controls for Camera
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 4;
    controls.dynamicDampingFactor = 0.15;

    // Axes Helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // Trigonometry Constants for Orbital Paths
    let theta = 0;
    const dTheta = (2 * Math.PI) / 100;

    // Rendering Function
    const rendering = function () {
      requestRef.current = requestAnimationFrame(rendering);

      controls.update();

      scene.rotation.z -= 0.005;
      scene.rotation.x -= 0.01;

      theta += dTheta;

      const trigs = [
        { x: Math.cos(theta * 1.05), y: Math.sin(theta * 1.05), z: Math.cos(theta * 1.05), r: 2 },
        { x: Math.cos(theta * 0.8), y: Math.sin(theta * 0.8), z: Math.sin(theta * 0.8), r: 2.25 },
        { x: Math.cos(theta * 1.25), y: Math.cos(theta * 1.25), z: Math.sin(theta * 1.25), r: 2.5 },
        { x: Math.sin(theta * 0.6), y: Math.cos(theta * 0.6), z: Math.sin(theta * 0), r: 2.75 }
      ];

      for (let i = 0; i < 4; i++) {
        sphereMeshes[i].position.x = trigs[i].r * trigs[i].x;
        sphereMeshes[i].position.y = trigs[i].r * trigs[i].y;
        sphereMeshes[i].position.z = trigs[i].r * trigs[i].z;
      }

      renderer.render(scene, camera);
    };

    rendering();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(requestRef.current);

      mount.removeChild(renderer.domElement);

      controls.dispose();

      sphereMeshes.forEach((sphere) => {
        sphere.geometry.dispose();
        sphere.material.dispose();
        scene.remove(sphere);
      });

      boxGeometry.dispose();
      boxMaterial.dispose();

      newSphere.dispose();
      sphereMaterial1.dispose();

      lights.forEach((light) => {
        scene.remove(light);
      });

      lightHelpers.forEach((helper) => {
        scene.remove(helper);
      });

      axesHelper.geometry.dispose();
      
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef}></div>;
}
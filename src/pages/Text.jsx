import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import earthImage from '../assets/textures/earth_atmos_2048.jpg';
import earthSpec from '../assets/textures/earth_specular_2048.jpg';
import earthNormal from '../assets/textures/earth_normal_2048.jpg';
import moonImage from '../assets/textures/moon_1024.jpg';
import stars from '../assets/textures/sky2.jpg';
import {TrackballControls} from 'three/addons/controls/TrackballControls.js';

export default function Text() {

  useEffect(() => {
    let camera, scene, renderer, labelRenderer;
    const clock = new THREE.Clock();
    const textureLoader = new THREE.TextureLoader();
    let moon;
    let earth;

    const init = () => {
      const EARTH_RADIUS = 1;
      const MOON_RADIUS = 0.27;

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(10, 5, 20);
      camera.layers.enableAll();

      scene = new THREE.Scene();
      
      const dirLight = new THREE.DirectionalLight(0xffffff, 6);
      dirLight.position.set(0, 0, 1);
      dirLight.layers.enableAll();
      scene.add(dirLight);
      scene.background = new THREE.TextureLoader().load(stars);

      const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16);
      const earthMaterial = new THREE.MeshPhongMaterial({
        specular: 0x333333,
        shininess: 5,
        map: new THREE.TextureLoader().load(earthImage),
        specularMap: new THREE.TextureLoader().load(earthSpec),
        normalMap: new THREE.TextureLoader().load(earthNormal),
        normalScale: new THREE.Vector2(0.85, 0.85),
      });
      earthMaterial.map.colorSpace = THREE.SRGBColorSpace;
      earth = new THREE.Mesh(earthGeometry, earthMaterial);
      scene.add(earth);

      const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16);
      const moonMaterial = new THREE.MeshPhongMaterial({
        shininess: 1,
        map: textureLoader.load(moonImage),
      });
      moonMaterial.map.colorSpace = THREE.SRGBColorSpace;
      moon = new THREE.Mesh(moonGeometry, moonMaterial);
      scene.add(moon);

      earth.layers.enableAll();
      moon.layers.enableAll();

      const earthDiv = document.createElement('div');
      earthDiv.className = 'label';
      earthDiv.textContent = 'Earth';
      earthDiv.style.backgroundColor = 'transparent';
      const earthLabel = new CSS2DObject(earthDiv);
      earthLabel.position.set(1.5 * EARTH_RADIUS, 0, 0);
      earthLabel.center.set(0, 1);
      scene.add(earthLabel);
      earthLabel.layers.set(0);

      const moonDiv = document.createElement('div');
      moonDiv.className = 'label';
      moonDiv.textContent = 'Moon';
      moonDiv.style.backgroundColor = 'transparent';

      const moonLabel = new CSS2DObject(moonDiv);
      moonLabel.position.set(1.5 * MOON_RADIUS, 0, 0);
      moonLabel.center.set(0, 1);
      moon.add(moonLabel);
      moonLabel.layers.set(0);

      renderer = new THREE.WebGLRenderer();
      renderer.setClearColor("#1F1F1F");
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.domElement.style.position = 'absolute';
      labelRenderer.domElement.style.top = '0px';
      document.body.appendChild(labelRenderer.domElement);

      const controls = new OrbitControls(camera, labelRenderer.domElement);
      controls.minDistance = 5;
      controls.maxDistance = 100;

      const viewControls = new TrackballControls(camera, labelRenderer.domElement);
      viewControls.rotateSpeed = 4;
      viewControls.dynamicDampingFactor = 0.15;

      window.addEventListener('resize', onWindowResize);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      labelRenderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      const animateId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      earth.rotation.y += 0.01;
      moon.rotation.y += 0.01;
      moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5);
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);

      // Return the animate ID for cleanup
      return animateId;
    };

    init();
    const animateId = animate();

    return () => {
      // Cleanup function
      window.removeEventListener('resize', onWindowResize);
      document.body.removeChild(renderer.domElement);
      document.body.removeChild(labelRenderer.domElement);
      
      // Dispose of the scene and renderer to prevent memory leaks
      scene.traverse((object) => {
        if (!object.isMesh) return;

        object.geometry.dispose();
        object.material.dispose();
      });

      renderer.dispose();

      // Cancel the animation frame
      cancelAnimationFrame(animateId);
    };

  }, []); // The empty dependency array ensures this runs once

  return (
    <div id="info"><a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> css2d - label</div>
  );
}
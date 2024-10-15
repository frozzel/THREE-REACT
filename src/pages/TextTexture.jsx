import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import moonImage from '../assets/textures/moon_1024.jpg';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';
import skyImage from '../assets/textures/sky2.jpg';

export default function TextTexture() {
    // const mountRef = useRef(null);
    const requestRef = useRef();

    useEffect(() => {

    // const mount = mountRef.current;

     // Scene
    const scene = new THREE.Scene();

         // Camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor("#1F1F1F");
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Trackball Controls for Camera
    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 4;
    controls.dynamicDampingFactor = 0.15;

      /// create texture moon
    const texture = new THREE.TextureLoader().load( moonImage );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 4, 4 );

    const geometry = new THREE.SphereGeometry( 10, 32, 32 );
    const material = new THREE.MeshBasicMaterial( { map: texture } );
    const sphere = new THREE.Mesh( geometry, material );
    scene.add( sphere );

    const moonDiv = document.createElement('a');
    moonDiv.className = 'label2';
    moonDiv.textContent = 'Moon';
    moonDiv.style.backgroundColor = 'transparent';
    moonDiv.href = 'http://localhost:5173/text';
    
    const moonLabel = new CSS2DObject(moonDiv);
    moonLabel.position.set(1.5 * 10, 0, 0);
    moonLabel.center.set(0, 1);
    // sphere.add(moonLabel);
    scene.add(moonLabel);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);

    scene.background = new THREE.TextureLoader().load(skyImage);

    // Responsive Canvas Handling
    const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);

        };

        window.addEventListener("resize", onResize);


    // Animate
    const animate = () => {
        sphere.rotation.y += 0.01;
        // sphere.rotation.x += 0.01;
        controls.update();
        labelRenderer.render(scene, camera);
        
        renderer.render(scene, camera);
        requestRef.current = requestAnimationFrame(animate);
      };

      animate();
    // Cleanup function
    return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(requestRef.current);
  
        document.body.removeChild(renderer.domElement);
        document.body.removeChild(labelRenderer.domElement);

  
        controls.dispose();
        
        geometry.dispose();
        material.dispose();
        // scene.remove(line);
        
        renderer.dispose();
       
      };
    }, []);


  return (
    <div>TextTexture</div>
  )
}

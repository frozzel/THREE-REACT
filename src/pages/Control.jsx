import * as THREE from 'three';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
import moonImage from '../assets/textures/moon_1024.jpg';
import skyImage from '../assets/textures/sky2.jpg';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Control() {
 

    let scene, renderer, camera, canvas, controls, rocket, sphere;

    
    function init() {
      scene = new THREE.Scene();
      canvas = document.querySelector("#canvas");
    
      // Set up the renderer
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
      renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );
    
      // Set up camera
      camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.6, 1200);
      camera.position.set( 0, 2, 5 );
      // camera.position.z = 5;
    
      // 2. Initiate FlyControls with various params
      controls = new FlyControls( camera, renderer.domElement );
      controls.movementSpeed = 1;
      controls.rollSpeed = Math.PI / 24;
      controls.autoForward = false;
      controls.dragToLook = true;
    
      // set up a basic room scene
      // addWallLighting(scene);
      // addRoom(scene);

      /// create texture plain
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
      plane.rotation.x = Math.PI / -2;
      plane.position.y = -2;

      scene.add(plane);

      // Add Hemisphere Light
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3);
      hemiLight.position.set(0, 8, 0);
      scene.add(hemiLight);


      /// sphere background
      const sphereGeo = new THREE.SphereGeometry(50, 50, 50);
      const sphereMat = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(skyImage),
        side: THREE.DoubleSide,
      });
      sphere = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphere);


      /// add Rocket
      const loader = new GLTFLoader();
      loader.load('./3D-models/rocket.glb', (gltf) => {
        rocket = gltf.scene;
        rocket.scale.set(5, 5, 5);
        rocket.position.set(0, 2, -5);
        scene.add(gltf.scene);
      });
      
    }
    
    // Animate the scene
    function animate() {
      
      renderer.render( scene, camera );
    
      // 3. update controls with a small step value to "power its engines"
      controls.update(0.1)
    
      requestAnimationFrame( animate );
    };

    init()
    animate()
    return <div id="info2"><a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> - earth [fly controls]<br/>
		<b>WASD</b> move, <b>R|F</b> up | down, <b>Q|E</b> roll, <b>up|down</b> pitch, <b>left|right</b> yaw
		</div>;

}

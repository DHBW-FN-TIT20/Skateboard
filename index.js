import "./style.css";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { degToRad } from "three/src/math/MathUtils";
import { GUI } from 'dat.gui';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xa0a0a0 );

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
);


export function onWindowResize() {
        camera.aspect = window. innerWidth / window. innerHeight;
        camera.updateProjectionMatrix();
        renderer. setSize (window. innerWidth, window.innerHeight);
    }
    window.addEventListener ('resize', onWindowResize);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector(".canv"),
    antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

let skateboard;

const loadingManager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(loadingManager);

const controls = new OrbitControls(camera, renderer.domElement);

loadingManager.onLoad = () => {
    camera.updateProjectionMatrix();
    camera.translateZ(-1);
    animate();
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log("Loaded " + itemsLoaded + " of " + itemsTotal + " files.");
};

const loadSkateboard = () => {
    gltfLoader.load("skateboard/scene.gltf", (gltf) => {
        skateboard = gltf.scene.children[0];
        skateboard.scale.set(1, 1, 1);
        skateboard.castShadow = true;
        gltf.scene.traverse( function( node ) {

            if ( node.isMesh ) { node.castShadow = true; }
    
        } );
        scene.add(gltf.scene);
    });
};

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );

const setupScene = () => {
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientlight);
    
    directionalLight.position.set( 0, 1, 0 );
    directionalLight.castShadow = true; 
    directionalLight.target.position.set(0, 0, 0);
    scene.add( directionalLight );
    scene.add(directionalLight.target);

    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 10000; 
    directionalLight.shadow.mapSize.height = 10000; 
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 40;
     
    const geometry = new THREE.PlaneGeometry( 2, 1 );
    const material = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.rotateX(degToRad(90));
    plane.position.set(0,-0.05,0);
    plane.receiveShadow = true;
    scene.add( plane );

    loadSkateboard();
};

const dlHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(dlHelper);

const gui = new GUI();
makeXYZGUI(gui, directionalLight.position, 'position', updateLight);

const animate = () => {
    requestAnimationFrame(animate);
    controls.update();
    dlHelper.update();
    updateLight();
    // updateDLPos();
    console.log()
    renderer.render(scene, camera);
};

setupScene();

//updates the directional light vektor with a rotation vektor
var frame = 0;
var maxFrame = 600;
function updateDLPos(){
    var per = frame /maxFrame,
    r = Math.PI * 2 * per;
    directionalLight.position.set(Math.cos(r)*5, 5, Math.sin(r)*5);
    frame = (frame + 1) % maxFrame;
}

function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    folder.open();
  }

  function updateLight() {
    directionalLight.updateMatrixWorld();
    dlHelper.update();
  }
  
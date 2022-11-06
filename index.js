import "./style.css";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { degToRad } from "three/src/math/MathUtils";
import { GUI } from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module';
import { AnimationClip, VectorKeyframeTrack, AnimationMixer, LoopOnce } from "three";

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xa0a0a0 );

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
);
camera.position.set(0,0.5,-2);

function onWindowResize() {
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


const loadingManager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(loadingManager);

const controls = new OrbitControls(camera, renderer.domElement);


let skateboard;
let mixer;
let actions = [];
loadingManager.onLoad = () => {
    camera.updateProjectionMatrix();
    camera.translateZ(-1);
    animate();
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log("Loaded " + itemsLoaded + " of " + itemsTotal + " files.");
};

const loadSkateboard = () => {
    gltfLoader.load("skateboard/skateboard.glb", (gltf) => {
        skateboard = gltf.scene.children[0];
        skateboard.scale.set(1, 1, 1);
        skateboard.castShadow = true;
        gltf.scene.traverse( function( node ) {
            
            if ( node.isMesh ) { node.castShadow = true; }
            
        } );
        mixer = new THREE.AnimationMixer( gltf.scene );
            gltf.animations.forEach(( clip ) => {
            actions.push(mixer.clipAction(clip));
        });
        console.log(actions);
        scene.add(gltf.scene);
    });
};

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );

const setupScene = () => {
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientlight);
    
    //set up for the directional light
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
     
    //add the floor 
    const geometry = new THREE.PlaneGeometry( 5, 5 );
    const material = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.rotateX(degToRad(90));
    plane.position.set(0,-0.03,0);
    plane.receiveShadow = true;
    scene.add( plane );

    loadSkateboard();
};

const dlHelper = new THREE.DirectionalLightHelper(directionalLight);
const axisHelper = new THREE.AxesHelper(10);
const gridHelper = new THREE.GridHelper(10, 20,0x2c2c2c, 0x888888);
scene.add(axisHelper);
scene.add(gridHelper);
scene.add(dlHelper);

const gui = new GUI();
makeXYZGUI(gui, directionalLight.position, 'position', updateLight);

var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

window.playAnimation = (index) => {
    if(mixer && actions[index]){
        mixer.stopAllAction();
        actions[index].setEffectiveTimeScale(0.5);
        actions[index].fadeIn(0.5);
        actions[index].play();
    }
    console.log("click" + index)
}

window.stopAnimation = () => {
    mixer.stopAllAction();
}

let clock = new THREE.Clock();
const animate = () => {
    stats.begin();
    requestAnimationFrame(animate);
    controls.update();
    dlHelper.update();
    updateLight();

    const delta = clock.getDelta();
    if(mixer) mixer.update(delta);
    renderer.render(scene, camera);
    stats.end();
};

setupScene();

let treflip = document.getElementById("treflip");
let varialHeel = document.getElementById("varialHeel");
treflip.addEventListener("click", playAnimation);
varialHeel.addEventListener("click", playAnimation);


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
  
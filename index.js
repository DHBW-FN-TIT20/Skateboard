import "./style.css";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { degToRad } from "three/src/math/MathUtils";
import { GUI } from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module';

import { createCamera } from "./components/camera";
import { createLights } from "./components/light";
import { createScene } from "./components/scene";
import { createRenderer } from "./systems/renderer";
import { Resizer } from "./systems/resizer";
import { createControls } from "./systems/controls";
import { createHelpers } from "./systems/helper";

//create the scene
const scene = createScene();

//create the camera
const camera = createCamera();

//create the renderer
const renderer = createRenderer();
renderer.render(scene, camera);

//the resizer lets the position (0,0,0) stays in the middle of the screen
const resizer = new Resizer(window, camera, renderer);

//create orbit controls to change the camera with the mouse
const controls = createControls(camera, renderer.domElement);

const loadingManager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(loadingManager);

//outcource the whole loading process ? 
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

const {directionalLight, ambientLight} = createLights();

const setupScene = () => {
    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(directionalLight.target);

    //add the floor 
    const geometry = new THREE.PlaneGeometry( 5, 5 );
    const material = new THREE.MeshPhongMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.rotateX(degToRad(90));
    plane.position.set(0,0,0);
    plane.receiveShadow = true;
    scene.add( plane );

    loadSkateboard();
};

const {dlHelper, axisHelper, gridHelper} = createHelpers(directionalLight);
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
        actions[index].setEffectiveTimeScale(0.7);
        actions[index].fadeIn(0.5);
        actions[index].setLoop( THREE.LoopOnce );
        actions[index].play();
    }
    console.log("click: " + index)
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
  
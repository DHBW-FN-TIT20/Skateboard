import "./style.css";

import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { degToRad } from "three/src/math/MathUtils";
import { GUI } from 'dat.gui';
import Stats from 'three/examples/jsm/libs/stats.module';
import { Body, Box, Material, Plane, Quaternion, RaycastVehicle, RigidVehicle, Sphere, Vec3, World } from "cannon-es";
import CannonDebugger from "cannon-es-debugger";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
);
camera.position.set(0, 0.5, -2);
let sphereBody;


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

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

let world;
let groundMaterial;
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
    gltfLoader.load("assets/models/skateboard.glb", (gltf) => {
        skateboard = gltf.scene.children[0];
        skateboard.scale.set(1, 1, 1);
        skateboard.castShadow = true;
        gltf.scene.traverse(function (node) {
            
            if (node.isMesh) { node.castShadow = true; }
            
        });
        mixer = new THREE.AnimationMixer(gltf.scene);
        gltf.animations.forEach((clip) => {
            actions.push(mixer.clipAction(clip));
        });
        console.log(actions);
        scene.add(gltf.scene);
    });
};

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);

const setupScene = () => {
    const ambientlight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientlight);
    
    //set up for the directional light
    directionalLight.position.set(0, 1, 0);
    directionalLight.castShadow = true;
    directionalLight.target.position.set(0, 0, 0);
    scene.add(directionalLight);
    scene.add(directionalLight.target);
    
    //Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 10000;
    directionalLight.shadow.mapSize.height = 10000;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 40;
    
    
    const geometry = new THREE.PlaneGeometry(10, 10);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotateX(degToRad(90));
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    scene.add(plane);
    
    loadSkateboard();
};

const dlHelper = new THREE.DirectionalLightHelper(directionalLight);
const axisHelper = new THREE.AxesHelper(10);
const gridHelper = new THREE.GridHelper(10, 20, 0x2c2c2c, 0x888888);
scene.add(axisHelper);
scene.add(gridHelper);
scene.add(dlHelper);

const gui = new GUI();
makeXYZGUI(gui, directionalLight.position, 'position', updateLight);

var stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

window.playAnimation = (index) => {
    if (mixer && actions[index]) {
        mixer.stopAllAction();
        actions[index].setEffectiveTimeScale(0.7);
        actions[index].fadeIn(0.5);
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
    world.fixedStep();
    // cannonDebugger.update();
    let { x, y, z } = sphereBody.position;
    y = y-0.104;
    skateboard.position.copy({x, y, z});
    skateboard.quaternion.copy(sphereBody.quaternion);
    skateboard.rotateX( degToRad(-90) );
    
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
    stats.end();
};

setupScene();
initWorld();
// const cannonDebugger = new CannonDebugger(scene, world, {});
let vehicle;

createGround();

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


function initWorld() {
    world = new World();
    world.gravity.set(0, -10, 0);
}
function createGround() {
    //add the floor 
    groundMaterial = new Material("groundMaterial");
    const groundShape = new Plane();
    const groundBody = new Body( { type: Body.STATIC, shape: groundShape, material: groundMaterial });
    groundBody.quaternion.setFromAxisAngle(new Vec3(1,0,0), -Math.PI/2);

    sphereBody = new Body({
        mass: 20,
        shape: new Box(new Vec3(.36, .02, .1)),
        position: new Vec3(0, .2, 0)
    });

    // sphereBody.position.set(0, 7, 0);
    vehicle = new RigidVehicle({
        chassisBody: sphereBody
    });

    world.addBody(groundBody);


    // ramp
    let ramp = new Material("ramp");
    let rampeShape = new Box(new Vec3(1, 1, .3));
    const rampBody = new Body({type: Body.STATIC, shape: rampeShape, material: ramp});
    rampBody.quaternion.setFromAxisAngle(new Vec3(1,.3,0), -Math.PI/2);
    rampBody.position.set(1, -.2, 1);
    world.addBody(rampBody);


    const wheelMaterial = new Material("wheel");
    const wheelShape = new Sphere(.07);
    const down = new Vec3(0, -1, 0);

    const wheelBody3 = new Body({mass: 1, material: wheelMaterial});
    wheelBody3.addShape(wheelShape);
    wheelBody3.angularDamping = .4;
    vehicle.addWheel({
        body: wheelBody3,
        position: new Vec3(-.2, -.02, .1),
        axis: new Vec3(0,0,1),
        direction: down
    });

    const wheelBody4 = new Body({mass: 1, material: wheelMaterial});
    wheelBody4.addShape(wheelShape);
    wheelBody4.angularDamping = .4;
    vehicle.addWheel({
        body: wheelBody4,
        position: new Vec3(-.2, -.02, -.1),
        axis: new Vec3(0,0,1),
        direction: down
    });
    const wheelBody1 = new Body({mass: 1, material: wheelMaterial});
    wheelBody1.addShape(wheelShape);
    wheelBody1.angularDamping = .4;
    vehicle.addWheel({
        body: wheelBody1,
        position: new Vec3(.2, -.02, .1),
        axis: new Vec3(0,0,1),
        direction: down
    });

    const wheelBody2 = new Body({mass: 1, material: wheelMaterial});
    wheelBody2.addShape(wheelShape);
    wheelBody2.angularDamping = .4;
    vehicle.addWheel({
        body: wheelBody2,
        position: new Vec3(.2, -.02, -.1),
        axis: new Vec3(0,0,1),
        direction: down
    });

    vehicle.addToWorld(world);

    // world.addBody(sphereBody);
}

const strength = 500
const dt = 1 / 60

document.addEventListener("keydown", (event) => {
    const maxSteering = Math.PI/15;
    switch (event.key) {
        case "w":
        case "ArrowUp":
            vehicle.setWheelForce(3, 0);
            vehicle.setWheelForce(3, 1);
            break;
        case "s":
        case "ArrowDown":
            vehicle.setWheelForce(-2, 0);
            vehicle.setWheelForce(-2, 1);
            break;
        case "a":
            vehicle.setSteeringValue(maxSteering, 0);
            vehicle.setSteeringValue(maxSteering, 1);
            break;
        case "d":
            vehicle.setSteeringValue(-maxSteering, 0);
            vehicle.setSteeringValue(-maxSteering, 1);
            break;
        default:
            break;
    }
});

document.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "w":
        case "ArrowUp":
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 1);
            break;
        case "s":
        case "ArrowDown":
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 1);
            break;
        case "a":
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;
        case "d":
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;
        case " ":
            if(event.code == "Space")
            vehicle.chassisBody.position.set(0,.5,0);
            break;
        default:
            break;
    }
})
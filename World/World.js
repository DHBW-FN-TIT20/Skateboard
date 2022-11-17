import "../style.css";

import { GUI } from 'dat.gui';

import * as CANNON from "cannon-es";

import { createCamera } from "./components/camera";
import { createLights } from "./components/light";
import { createScene } from "./components/scene";
import { createRenderer } from "../systems/renderer";
import { Resizer } from "../systems/resizer";
import { createControls } from "../systems/controls";
import { createHelpers } from "../systems/helper";

import { loadSkateboard } from "./components/skateboard/skateboard";
import { loadEnvironment } from "./components/environment/environment";
import { Loop } from "./systems/Loop";
import CannonDebugger from "cannon-es-debugger";
import { loadHydrant } from "./components/environment/hydrant";
import { loadStreetLamp } from "./components/environment/streetLamp";
import { loadStreet } from "./components/environment/street";
import { loadTree } from "./components/environment/tree";
import { loadPylon } from "./components/environment/pylon";
import { CameraHelper, PointLightHelper } from "three";

let scene;
let physics;

let camera;
let renderer;
let controls;
let loop;

let dlGlobalHelper;

class World {
    constructor() {
        scene = createScene();
        camera = createCamera();
        renderer = createRenderer();
        loop = new Loop(camera, scene, renderer);

        //the resizer lets the position (0,0,0) stays in the middle of the screen
        const resizer = new Resizer(window, camera, renderer);

        //create orbit controls to change the camera with the mouse
        controls = createControls(camera, renderer.domElement);
        loop.updatables.push(controls);

        const { directionalLight, ambientLight, hemisphereLight } = createLights();

        const { dlHelper, axisHelper, gridHelper, cameraHelper } = createHelpers(directionalLight);
        dlGlobalHelper = dlHelper;
        dlGlobalHelper.tick = () => dlGlobalHelper.update();
        loop.updatables.push(dlGlobalHelper);

        scene.add(axisHelper, gridHelper, dlGlobalHelper, cameraHelper);
        const gui = new GUI();
        makeXYZGUI(gui, directionalLight.position, 'position', updateLight);

        scene.add(ambientLight, directionalLight, hemisphereLight);

        function makeXYZGUI(gui, vector3, name, onChangeFn) {
            const folder = gui.addFolder(name);
            folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
            folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
            folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
            folder.open();
        }

        // physiks world
        physics = new CANNON.World({
            gravity: new CANNON.Vec3(0, -10, 0)
        });
        physics.tick = () => physics.fixedStep();
        loop.updatables.push(physics);

        const cannonDebugger = new CannonDebugger(scene, physics, {});
        cannonDebugger.tick = () => cannonDebugger.update();
        loop.updatables.push(cannonDebugger);
    }
    

    async init() {
        const environment = await loadEnvironment();
        const skateboard = await loadSkateboard();
        const hydrant = await loadHydrant();
        const streetLamp1 = await loadStreetLamp(-19, .1, 0);
        const streetLamp2 = await loadStreetLamp(-19, .1, 15);
        const streetLamp3 = await loadStreetLamp(-19, .1, -15);
        const pylon1 = await loadPylon(-2, .1, 0);
        const street = await loadStreet();
        const tree = await loadTree();
    
        skateboard.physics.addToWorld(physics);
        
        loop.updatables.push(skateboard.model, pylon1.model);
        scene.add(skateboard.model, environment.model, hydrant.model, streetLamp1.model, streetLamp2.model, streetLamp3.model, street, tree, pylon1.model);
        scene.add(streetLamp1.positionLightLamp, streetLamp2.positionLightLamp, streetLamp3.positionLightLamp);
        [environment.physics, hydrant.physics, streetLamp1.physics, streetLamp2.physics, streetLamp3.physics, pylon1.physics].forEach((p) => physics.addBody(p));
    }

    render() {
        renderer.render(scene, camera);
    }

    start() {
        camera.updateProjectionMatrix();
        camera.translateZ(-1);

        loop.start();
    }

    stop() {
        loop.stop();
    }
}

function updateLight() {
    dlGlobalHelper.update();
}


export { World };

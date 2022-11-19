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
import { createCone } from "./components/environment/prism";
import { loadCar } from "./components/environment/car";
import { loadBush } from "./components/environment/bush";
import { loadBank } from "./components/environment/bank";
import { loadTrashcan } from "./components/environment/trashcan";
import { loadChairTable } from "./components/environment/chair-table";

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

        scene.add(axisHelper, gridHelper);
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

        // physics world
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
        const pylon1 = await loadPylon(-2, .1, -10);
        const pylon2 = await loadPylon(4, .1, -10);
        const pylon3 = await loadPylon(-8, .1, -10);
        const pylon4 = await loadPylon(1, .1, -10);
        const pylon5 = await loadPylon(-5, .1, -10);
        const pylon6 = await loadPylon(7, .1, -10);
        const pylon7 = await loadPylon(10, .1, -10);
        const street = await loadStreet();
        const tree = await loadTree();
        const prism = await createCone(4,4);
        const car = await loadCar();
        const bush1 = await loadBush(14, .6 , -10);
        const bush2 = await loadBush(9, .9, -15);
        const bank = await loadBank(12, 0, 17);
        const trashcan1 = await loadTrashcan(8, 2, 17);
        const chariTable = await loadChairTable();
    
        skateboard.physics.addToWorld(physics);
        
        loop.updatables.push(skateboard.model, pylon1.model, pylon2.model, pylon3.model, pylon4.model, pylon5.model ,pylon6.model, pylon7.model ,trashcan1.model);
        scene.add(skateboard.model, environment.model, hydrant.model, streetLamp1.model, streetLamp2.model, streetLamp3.model, street, tree.model, pylon1.model, prism.model, pylon2.model, pylon3.model, bush1, bush2, bank.model, trashcan1.model, chariTable.model, pylon5.model, pylon4.model, pylon6.model, pylon7.model);
        scene.add(streetLamp1.spotLightLamp, streetLamp1.spotLightLamp.target, streetLamp2.spotLightLamp, streetLamp2.spotLightLamp.target ,streetLamp3.spotLightLamp, streetLamp3.spotLightLamp.target, car.model);
        [environment.physics, hydrant.physics, streetLamp1.physics, streetLamp2.physics, streetLamp3.physics, pylon1.physics, prism.physics, pylon2.physics, pylon3.physics, car.physics, bank.physics, tree.physics, trashcan1.physics, chariTable.physics, pylon4.physics, pylon5.physics, pylon6.physics, pylon7.physics].forEach((p) => physics.addBody(p));
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

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
import { loadCityElements } from "./components/environment/city_elements";

let scene;
let physics;

let camera;
let renderer;
let controls;
let loop;

let dlGlobalHelper;
let directionalHelpLight;

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

        const { directionalLight, ambientLight } = createLights();

        directionalHelpLight = directionalLight;

        const { dlHelper, axisHelper, gridHelper } = createHelpers(directionalLight);
        dlGlobalHelper = dlHelper;
        dlGlobalHelper.tick = () => dlGlobalHelper.update();
        loop.updatables.push(dlGlobalHelper);

        scene.add(axisHelper, gridHelper, dlGlobalHelper);
        const gui = new GUI();
        makeXYZGUI(gui, directionalLight.position, 'position', updateLight);

        scene.add(ambientLight, directionalLight);

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
        const cityElements = await loadCityElements();
        skateboard.physics.addToWorld(physics);
        directionalHelpLight.target = skateboard.model;
        
        loop.updatables.push(skateboard.model);
        scene.add(skateboard.model, environment.model, cityElements.model);
        [environment.physics].forEach((p) => physics.addBody(p));
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
    directionalHelpLight.updateMatrixWorld();
    dlGlobalHelper.update();
}


export { World };

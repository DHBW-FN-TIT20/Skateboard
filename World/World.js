import "../style.css";

import { GUI } from 'dat.gui';

import { createCamera } from "../components/camera";
import { createLights } from "../components/light";
import { createScene } from "../components/scene";
import { createRenderer } from "../systems/renderer";
import { Resizer } from "../systems/resizer";
import { createControls } from "../systems/controls";
import { createHelpers } from "../systems/helper";

import { loadSkateboard } from "./components/skateboard/skateboard";
import { loadEnvironment } from "./components/environment/environment";
import { Loop } from "./systems/Loop";

let scene;
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
    }
    

    async init() {
        const environment = await loadEnvironment();
        const skateboard = await loadSkateboard();

        loop.updatables.push(skateboard.model);
        scene.add(skateboard.model, environment);
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

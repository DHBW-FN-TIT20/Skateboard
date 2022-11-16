import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { degToRad } from "three/src/math/MathUtils";
import * as THREE from "three";
import * as CANNON from "cannon-es";

async function loadSkateboard() {
    const loadingManager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(loadingManager);
    let mixer;
    let actions = [];

    const data = await gltfLoader.loadAsync('/skateboard/skateboard.glb');
    const model = data.scene.children[0];

    model.scale.set(2, 2, 2);

    //allow the skateboard to cast schadow
    model.castShadow = true;

    //set castShadow to true for each node
    data.scene.traverse((node) => {
        if (node.isMesh) node.castShadow = true;
    });

    //load every animation clip in the actions array
    mixer = new THREE.AnimationMixer(data.scene);
    data.animations.forEach((clip) => {
        actions.push(mixer.clipAction(clip));
    });

    //start the specific animation 
    window.playAnimation = (index) => {
        if (mixer && actions[index]) {
            mixer.stopAllAction();

            if (index == 1 || index == 0) {
                actions[index].setEffectiveTimeScale(1.5);
            }
            actions[index].fadeIn(0.5);
            actions[index].setLoop(THREE.LoopOnce);
            actions[index].play();
        }
    }

    //stop the animation
    window.stopAnimation = () => {
        mixer.stopAllAction();
    }

    const shapeBoardLower = new CANNON.Box(new CANNON.Vec3(.6, .01, .19));
    const shapeBoardUpper = new CANNON.Box(new CANNON.Vec3(.75, .01, .19));
    const shapeAxis = new CANNON.Box(new CANNON.Vec3(.04, .04, .1))
    const physicsChasis = new CANNON.Body({
        mass: 20,
        position: new CANNON.Vec3(0, .5, 0)
    });
    physicsChasis.addShape(shapeBoardLower, new CANNON.Vec3(0, 0, 0), new CANNON.Quaternion());
    physicsChasis.addShape(shapeBoardUpper, new CANNON.Vec3(0, .08, 0), new CANNON.Quaternion());
    physicsChasis.addShape(shapeAxis, new CANNON.Vec3(.4, -.08, 0), new CANNON.Quaternion());
    physicsChasis.addShape(shapeAxis, new CANNON.Vec3(-.4, -.08, 0), new CANNON.Quaternion());
    physicsChasis.position = new CANNON.Vec3(0, .5, 0);

    const physics = new CANNON.RigidVehicle({
        chassisBody: physicsChasis
    });

    const wheelMaterial = new CANNON.Material("wheel");
    const wheelShape = new CANNON.Sphere(.07);
    const down = new CANNON.Vec3(0, -1, 0);

    const wheelBody1 = new CANNON.Body({ mass: 1, material: wheelMaterial });
    wheelBody1.addShape(wheelShape);
    wheelBody1.angularDamping = .4;
    physics.addWheel({
        body: wheelBody1,
        position: new CANNON.Vec3(-.4, -.1, .16),
        axis: new CANNON.Vec3(0, 0, 1),
        direction: down
    });

    const wheelBody2 = new CANNON.Body({ mass: 1, material: wheelMaterial });
    wheelBody2.addShape(wheelShape);
    wheelBody2.angularDamping = .4;
    physics.addWheel({
        body: wheelBody2,
        position: new CANNON.Vec3(-.4, -.1, -.16),
        axis: new CANNON.Vec3(0, 0, 1),
        direction: down
    });
    const wheelBody3 = new CANNON.Body({ mass: 1, material: wheelMaterial });
    wheelBody3.addShape(wheelShape);
    wheelBody3.angularDamping = .4;
    physics.addWheel({
        body: wheelBody3,
        position: new CANNON.Vec3(.4, -.1, .16),
        axis: new CANNON.Vec3(0, 0, 1),
        direction: down
    });

    const wheelBody4 = new CANNON.Body({ mass: 1, material: wheelMaterial });
    wheelBody4.addShape(wheelShape);
    wheelBody4.angularDamping = .4;
    physics.addWheel({
        body: wheelBody4,
        position: new CANNON.Vec3(.4, -.1, -.16),
        axis: new CANNON.Vec3(0, 0, 1),
        direction: down
    });

    model.tick = (delta) => {
        let { x, y, z } = physicsChasis.position;
        y = y - 0.25;
        z = z + .025;
        x = x - .011;
        model.position.copy({ x, y, z });
        model.quaternion.copy(physicsChasis.quaternion);
        model.rotateX(degToRad(-90));

        mixer.update(delta);
    }

    document.addEventListener("keydown", (event) => {
        const maxSteering = Math.PI / 15;
        switch (event.key) {
            case "w":
            case "ArrowUp":
                physics.setWheelForce(3, 0);
                physics.setWheelForce(3, 1);
                // physics.setMotorSpeed(10);
                break;
            case "s":
            case "ArrowDown":
                physics.setWheelForce(-2, 0);
                physics.setWheelForce(-2, 1);
                break;
            case "a":
                physics.setSteeringValue(maxSteering, 0);
                physics.setSteeringValue(maxSteering, 1);
                break;
            case "d":
                physics.setSteeringValue(-maxSteering, 0);
                physics.setSteeringValue(-maxSteering, 1);
                break;
            case "j":
                playAnimation(1);
                break;
            case "k":
                playAnimation(0);
                break;
            case "l":
                playAnimation(2);
                break;
            default:
                break;
        }
    });

    document.addEventListener("keyup", (event) => {
        switch (event.key) {
            case "w":
            case "ArrowUp":
                physics.setWheelForce(0, 0);
                physics.setWheelForce(0, 1);
                break;
            case "s":
            case "ArrowDown":
                physics.setWheelForce(0, 0);
                physics.setWheelForce(0, 1);
                break;
            case "a":
                physics.setSteeringValue(0, 0);
                physics.setSteeringValue(0, 1);
                break;
            case "d":
                physics.setSteeringValue(0, 0);
                physics.setSteeringValue(0, 1);
                break;
            case " ":
                if (event.code == "Space") {
                    physics.chassisBody.torque.setZero();
                    physics.chassisBody.velocity.setZero();
                    physics.chassisBody.position.set(0, .3, 0);
                    physics.chassisBody.quaternion.set(0, 0, 0, 1);
                }
                physics.setWheelForce(0, 0);
                physics.setWheelForce(0, 1);
                break;
            default:
                break;
        }
    })

    return { model, physics };
}

export { loadSkateboard }
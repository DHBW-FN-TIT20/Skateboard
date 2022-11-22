import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { degToRad } from "three/src/math/MathUtils";
import * as THREE from "three";
import * as CANNON from "cannon-es";

/** 
 * load a Skateboard, add a hitbox and create the steering
 * 
 * @return {model, physics}
 */
async function loadSkateboard() {
    const loadingManager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(loadingManager);
    let mixer;
    let actions = [];

    const data = await gltfLoader.loadAsync('/models/skateboard/skateboard.glb');
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

    const chassisShape = new CANNON.Box(new CANNON.Vec3(.5, .01, .2))
    const shapeBoardUpper = new CANNON.Box(new CANNON.Vec3(.7, .01, .1));
    const chassisBody = new CANNON.Body({ mass: 100 })
    chassisBody.addShape(chassisShape)
    chassisBody.addShape(shapeBoardUpper, new CANNON.Vec3(0,.07,0))
    chassisBody.position.set(0, 2, 0)
    chassisBody.angularVelocity.set(0, 0.5, 0)

    // Create the vehicle
    const physics = new CANNON.RaycastVehicle({
        chassisBody,
    })

    const wheelOptions = {
        radius: 0.1,
        directionLocal: new CANNON.Vec3(0, -1, 0),
        suspensionStiffness: 100,
        suspensionRestLength: 0.1,
        frictionSlip: 2,
        dampingRelaxation: 2.3,
        dampingCompression: 10,
        maxSuspensionForce: 100000,
        rollInfluence: 0.01,
        axleLocal: new CANNON.Vec3(0, 0, 1),
        chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
        maxSuspensionTravel: 0.1,
        customSlidingRotationalSpeed: -30,
        useCustomSlidingRotationalSpeed: true,
    }

    wheelOptions.chassisConnectionPointLocal.set(-.4, -.0, .16)
    physics.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(-.4, -.0, -.16)
    physics.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(.4, -.0, .16)
    physics.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(.4, -.01, -.16)
    physics.addWheel(wheelOptions)

    physics.wheelBodies = []
    const wheelMaterial = new CANNON.Material('wheel')
    physics.wheelInfos.forEach((wheel) => {
        const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 2, 20)
        const wheelBody = new CANNON.Body({
            mass: 0,
            material: wheelMaterial,
        })
        wheelBody.type = CANNON.Body.KINEMATIC
        wheelBody.collisionFilterGroup = 0 // turn off collisions
        const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
        wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
        physics.wheelBodies.push(wheelBody)
    })


    document.addEventListener('keydown', (event) => {
        const maxSteerVal = 0.15
        const maxForce = 200

        switch (event.key) {
            case 'w':
                physics.applyEngineForce(-maxForce, 0)
                physics.applyEngineForce(-maxForce, 1)
                physics.applyEngineForce(-maxForce, 2)
                physics.applyEngineForce(-maxForce, 3)
                break

            case 's':
                physics.applyEngineForce(maxForce, 0)
                physics.applyEngineForce(maxForce, 1)
                physics.applyEngineForce(maxForce, 2)
                physics.applyEngineForce(maxForce, 3)
                break

            case 'a':
                physics.setSteeringValue(maxSteerVal, 0)
                physics.setSteeringValue(maxSteerVal, 1)
                physics.setSteeringValue(-maxSteerVal, 2)
                physics.setSteeringValue(-maxSteerVal, 3)
                break

            case 'd':
                physics.setSteeringValue(-maxSteerVal, 0)
                physics.setSteeringValue(-maxSteerVal, 1)
                physics.setSteeringValue(maxSteerVal, 2)
                physics.setSteeringValue(maxSteerVal, 3)
                break
            case "j":
                playAnimation(1);
                break;
            case "k":
                playAnimation(0);
                break;
            case "l":
                playAnimation(2);
                break;
        }
    });

    // Reset force on keyup
    document.addEventListener('keyup', (event) => {
        switch (event.key) {
            case 'w':
                physics.applyEngineForce(0, 0)
                physics.applyEngineForce(0, 1)
                physics.applyEngineForce(0, 2)
                physics.applyEngineForce(0, 3)
                break

            case 's':
                physics.applyEngineForce(0, 0)
                physics.applyEngineForce(0, 1)
                physics.applyEngineForce(0, 2)
                physics.applyEngineForce(0, 3)
                break

            case 'a':
                physics.setSteeringValue(0, 0)
                physics.setSteeringValue(0, 1)
                physics.setSteeringValue(0, 2)
                physics.setSteeringValue(0, 3)
                break

            case 'd':
                physics.setSteeringValue(0, 0)
                physics.setSteeringValue(0, 1)
                physics.setSteeringValue(0, 2)
                physics.setSteeringValue(0, 3)
                break
            case " ":
                if (event.code == "Space") {
                    physics.chassisBody.velocity.setZero();
                    physics.chassisBody.position.set(0, 1, 0);
                    physics.chassisBody.quaternion.set(0, 0, 0, 1);
                }
                break;
        }
    })

    /** Updates model position to physics object */
    model.tick = (delta) => {
        model.position.copy(physics.chassisBody.position);
        model.translateZ(-.26);
        model.translateX(-.011);
        model.translateY(-.025);
        model.quaternion.copy(physics.chassisBody.quaternion);
        model.rotateX(degToRad(-90));

        mixer.update(delta);
    }

    return { model, physics };
}

export { loadSkateboard }
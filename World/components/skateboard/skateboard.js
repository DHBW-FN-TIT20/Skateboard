import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

async function loadSkateboard() {
    const loadingManager = new THREE.LoadingManager();
    const gltfLoader = new GLTFLoader(loadingManager);
    let mixer;
    let actions = [];

    const data = await gltfLoader.loadAsync('/skateboard/skateboard.glb');
    const model = data.scene.children[0];
    
    model.scale.set(1, 1, 1);
    model.castShadow = true;
    data.scene.traverse((node) => {
        if (node.isMesh) node.castShadow = true;
    });

    mixer = new THREE.AnimationMixer(data.scene);
    data.animations.forEach((clip) => {
        actions.push(mixer.clipAction(clip));
    });

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

    window.stopAnimation = () => {
        mixer.stopAllAction();
    }
    
    model.tick = (delta) => mixer.update(delta);

    return { model, actions };
}

export { loadSkateboard }
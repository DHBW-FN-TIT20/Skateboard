import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

async function loadHydrant(url){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/hydrant.glb");
  const model = data.scene.children[0];

  model.scale.set(.15,.15,.15);
  model.position.set(2,.1,1);

  model.castShadow = true;

  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  return model;
}

export {loadHydrant}
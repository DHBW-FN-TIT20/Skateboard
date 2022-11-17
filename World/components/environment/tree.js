import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

async function loadTree(){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/giant_low_poly_tree.glb");
  const model = data.scene.children[0];

  model.scale.set(.25,.25,.25);
  model.position.set(10,.1,0);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  return model;
}

export {loadTree}
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

async function loadBush(xPos, yPos ,zPos){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/bush.glb");
  const model = data.scene.children[0];

  model.scale.set(0.008,0.008,0.008);
  model.position.set(xPos, yPos , zPos);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });


  return model;
}

export {loadBush}
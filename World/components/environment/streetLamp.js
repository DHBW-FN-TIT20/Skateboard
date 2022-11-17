import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { degToRad } from "three/src/math/MathUtils";

async function loadStreetLamp(url){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/streetLamp.glb");
  const model = data.scene.children[0];

  model.scale.set(.15,.15,.15);
  model.rotateY(degToRad(180));
  model.position.set(-9,.1,1);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  return model;
}

export {loadStreetLamp}
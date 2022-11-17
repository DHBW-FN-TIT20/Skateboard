import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

async function loadHydrant(){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/hydrant.glb");
  const model = data.scene.children[0];

  model.scale.set(.15,.15,.15);
  model.position.set(2,.1,1);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const hydrantCylinder = new CANNON.Cylinder(.18, .18, 1, 12);
  const physicsChasis = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: hydrantCylinder,
    position: new CANNON.Vec3(2, .6, 1)
  });

  return {model, physicsChasis};
}

export {loadHydrant}
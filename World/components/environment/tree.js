import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

async function loadTree(){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/giant_low_poly_tree.glb");
  const model = data.scene.children[0];

  model.scale.set(.25,.25,.25);
  model.position.set(13,.1,-13);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const treeCylinder = new CANNON.Cylinder(.35, .53, 1, 20);
  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: treeCylinder,
    position: new CANNON.Vec3(13, .6, -13)
  });

  return {model, physics};
}

export {loadTree}
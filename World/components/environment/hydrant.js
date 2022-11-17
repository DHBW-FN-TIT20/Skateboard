import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

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

  //add a hitbox
  const hydrantBox = new CANNON.Box(new CANNON.Vec3(.6, .01, .19));
  const physicsChasis = new CANNON.Body({
    mass: 100,
    position: new CANNON.Vec3(2, .1, 1)
  });

  physicsChasis.addShape(hydrantBox, new CANNON.Vec3(0,0,0), new CANNON.Quaternion());


  return model;
}

export {loadHydrant}
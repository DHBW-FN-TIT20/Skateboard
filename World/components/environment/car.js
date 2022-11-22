import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { degToRad } from "three/src/math/MathUtils";
import * as CANNON from "cannon-es";


/** 
 * load a car and add a hitbox
 * 
 * @return {model, physics}
 */
async function loadCar(){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/car.glb");
  const model = data.scene.children[0];

  model.scale.set(1,1,1);
  model.position.set(-13,.1,12);
  model.rotateY(degToRad(180));
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const box = new CANNON.Vec3(1.3,1.5,3);
  const carBox = new CANNON.Box(box);
  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: carBox,
    position: new CANNON.Vec3(-13, 1.6, 12)
  });


  return {model, physics};
}

export {loadCar}
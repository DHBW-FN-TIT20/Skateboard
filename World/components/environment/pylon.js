import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

/** 
 * load a pylon and add a hitbox
 * 
 * @param {number} xPos - the X coordinate of the model 
 * @param {number} yPos - the Y coordinate of the model 
 * @param {number} zPos - the Z coordinate of the model 
 * 
 * @return {model, physics}
 */
async function loadPylon(xPos, yPos, zPos){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/pylon.glb");
  const model = data.scene.children[0];

  model.scale.set(.2,.2,.2);
  model.position.set(xPos, yPos, zPos);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const pylonCylinder = new CANNON.Cylinder(.03, .2, .43, 8);
  const physics = new CANNON.Body({
    mass: 1,
    shape: pylonCylinder,
    position: new CANNON.Vec3(xPos, yPos+ 1, zPos)
  });

  model.tick = (delta) => {
    model.position.copy(physics.position);
    model.translateY(-.2145);
    model.quaternion.copy(physics.quaternion);
  }

  return {model, physics};
}

export {loadPylon}
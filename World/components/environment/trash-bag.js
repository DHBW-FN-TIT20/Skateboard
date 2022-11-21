import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

/** 
 * load a TrashBag and add a hitbox
 * 
 * @param {number} xPos - the X coordinate of the model 
 * @param {number} yPos - the Y coordinate of the model 
 * @param {number} zPos - the Z coordinate of the model 
 * 
 * @return {model, physics}
 */
async function loadTrashBag(xPos, yPos, zPos){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/trash-bag.glb");
  const model = data.scene.children[0];

  model.scale.set(.2,.2,.2);
  model.position.set(xPos, yPos, zPos);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const trashCylinder = new CANNON.Cylinder(0.2, 0.3, .3, 14);
  const physics = new CANNON.Body({
    mass: 30,
    shape: trashCylinder,
    position: new CANNON.Vec3(xPos, yPos + .5, zPos)
  });

  model.tick = (delta) => {
    model.position.copy(physics.position);
    model.translateY(-.149);
    model.quaternion.copy(physics.quaternion);
  }

  return {model, physics};
}

export {loadTrashBag}
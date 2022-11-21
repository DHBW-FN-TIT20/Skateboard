import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

/** 
 * load a hydrant and add a hitbox
 * 
 * @return {model, physics}
 */
async function loadHydrant(){
  var xPos = -9;
  var yPos = .1;
  var zPos = 1;

  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/hydrant.glb");
  const model = data.scene.children[0];

  model.scale.set(.15,.15,.15);
  model.position.set(xPos,yPos,zPos);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const hydrantCylinder = new CANNON.Cylinder(.18, .18, 1, 12);
  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: hydrantCylinder,
    position: new CANNON.Vec3(xPos, yPos + .5, zPos)
  });

  return {model, physics};
}

export {loadHydrant}
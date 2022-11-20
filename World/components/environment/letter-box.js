import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import { degToRad } from "three/src/math/MathUtils";

async function loadLetterBox(xPos, yPos, zPos){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/letter-box.glb");
  const model = data.scene.children[0];

  model.scale.set(.1,.1,.1);
  model.position.set(xPos,yPos,zPos);
  model.rotateY(degToRad(90));
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const letterBoxCylinder = new CANNON.Box(new CANNON.Vec3(.1, .5, .1));
  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: letterBoxCylinder,
    position: new CANNON.Vec3(xPos, yPos + .5, zPos)
  });

  return {model, physics};
}

export {loadLetterBox}
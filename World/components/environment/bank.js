import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { degToRad } from "three/src/math/MathUtils";
import * as CANNON from "cannon-es";

async function loadBank(xPos, yPos ,zPos){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/banklowpoly.glb");
  const model = data.scene.children[0];

  model.scale.set(2.7,1.4,1.4);
  model.position.set(xPos, yPos , zPos);
  model.rotateZ(degToRad(180));
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const box1 = new CANNON.Vec3(.25,.3,.5);
  const box2 = new CANNON.Vec3(.25,.3,.5);
  const bankBox1 = new CANNON.Box(box1);
  const bankBox2 = new CANNON.Box(box2);
  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: bankBox1,
    position: new CANNON.Vec3(xPos + 1.9, yPos + 0.4, zPos)
  });

  physics.addShape(bankBox2, new CANNON.Vec3(-3.8, 0,0));

  return {model, physics};
}

export {loadBank}
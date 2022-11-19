import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

async function loadChairTable(){
  var xPos = 9;
  var yPos = 0;
  var zPos = -3;

  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/chair-table.glb");
  const model = data.scene.children[0];

  model.scale.set(.45,.45,.45);
  model.position.set(xPos, yPos, zPos);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const chairTableCylinder = new CANNON.Cylinder(2.2, 1, 4, 50);
  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: chairTableCylinder,
    position: new CANNON.Vec3(xPos, yPos + 1, zPos)
  });

  model.tick = (delta) => {
    model.position.copy(physics.position);
    model.translateY(-.2145);
    model.quaternion.copy(physics.quaternion);
  }

  return {model, physics};
}

export {loadChairTable}
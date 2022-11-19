import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

async function loadTrashcan(xPos, yPos, zPos){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/trashcan.glb");
  const model = data.scene.children[0];

  model.scale.set(.08,.08,.08);
  model.position.set(xPos, yPos, zPos);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const pylonCylinder = new CANNON.Cylinder(0.7, 0.5, 2.2, 14);
  const physics = new CANNON.Body({
    mass: 10,
    shape: pylonCylinder,
    position: new CANNON.Vec3(xPos, yPos + 1, zPos)
  });

  model.tick = (delta) => {
    model.position.copy(physics.position);
    model.translateY(-.2145);
    model.quaternion.copy(physics.quaternion);
  }

  return {model, physics};
}

export {loadTrashcan}
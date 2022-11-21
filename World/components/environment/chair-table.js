import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";

//** load a table with chairs and add a hitbox */
async function loadChairTable(xPos, yPos, zPos){
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
  const chairTableCylinder = new CANNON.Cylinder(.05, .3, 3.3, 50);
  const charTableCylinder1 = new CANNON.Cylinder(.8, 1.9, .8, 50);
  const charTableCylinder2 = new CANNON.Cylinder(.08, .36, .7, 20);
  const charTableCylinder3 = new CANNON.Cylinder(.08, .36, .7, 20);
  const charTableCylinder4 = new CANNON.Cylinder(1.2, 1.2, .08, 50);

  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: chairTableCylinder,
    position: new CANNON.Vec3(xPos, yPos + 1.65, zPos)
  });

  physics.addShape(charTableCylinder1, new CANNON.Vec3(0, 1.2, 0));
  physics.addShape(charTableCylinder2, new CANNON.Vec3(0.98, -1.25, .27));
  physics.addShape(charTableCylinder3, new CANNON.Vec3(-1, -1.25, .23));
  physics.addShape(charTableCylinder4, new CANNON.Vec3(0, -.65, 0));

  model.tick = (delta) => {
    model.position.copy(physics.position);
    model.translateY(-.2145);
    model.quaternion.copy(physics.quaternion);
  }

  return {model, physics};
}

export {loadChairTable}
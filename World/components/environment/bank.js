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
  const box1 = new CANNON.Vec3(.27,.3,.5);
  const box2 = new CANNON.Vec3(.29,.3,.5);
  const box3 = new CANNON.Vec3(2.3, .03, .37);
  const box4 = new CANNON.Vec3(2.3, .18, .1);
  const box5 = new CANNON.Vec3(.153, .2, .11);
  const bankBox1 = new CANNON.Box(box1);
  const bankBox2 = new CANNON.Box(box2);
  const bankBox3 = new CANNON.Box(box3);
  const bankBox4 = new CANNON.Box(box4);
  const bankBox5 = new CANNON.Box(box5);
  const bankBox6 = new CANNON.Box(box5);
  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: bankBox1,
    position: new CANNON.Vec3(xPos + 1.96, yPos + 0.4, zPos)
  });

  physics.addShape(bankBox2, new CANNON.Vec3(-3.8, 0,0));
  physics.addShape(bankBox3, new CANNON.Vec3(-1.95,.23,-.12));
  physics.addShape(bankBox4, new CANNON.Vec3(-1.95,.72,.41));
  physics.addShape(bankBox5, new CANNON.Vec3(-3.797, .5, .4));
  physics.addShape(bankBox6, new CANNON.Vec3(-.125, .5, .4));

  return {model, physics};
}

export {loadBank}
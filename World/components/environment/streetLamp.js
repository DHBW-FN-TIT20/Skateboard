import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { degToRad } from "three/src/math/MathUtils";
import { PointLight } from "three";
import * as CANNON from "cannon-es";


async function loadStreetLamp(xPos, yPos, zPos){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/streetLamp.glb");
  const model = data.scene.children[0];

  model.scale.set(.15,.15,.15);
  model.rotateY(degToRad(180));
  model.position.set(xPos, yPos, zPos);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  //add a hitbox
  const lampCylinder = new CANNON.Cylinder(.15, .16, 1, 20);
  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: lampCylinder,
    position: new CANNON.Vec3(xPos, yPos + 0.5, zPos)
  });

  //add directional light
  const positionLightLamp = new PointLight(0xf39f18, 0.9);
  positionLightLamp.position.set( -17.5, 5.9, zPos);
  positionLightLamp.castShadow = true;
  positionLightLamp.shadow.camera.near = 3;
  positionLightLamp.shadow.camera.far = 7;
  

  return {model, physics, positionLightLamp};
}

export {loadStreetLamp}
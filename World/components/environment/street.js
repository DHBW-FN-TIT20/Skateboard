import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


/** 
 * load a street
 * 
 * @return {model}
 */
async function loadStreet(){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync("/models/environment/street.glb");
  const model = data.scene.children[0];

  model.scale.set(20,1,7.5);
  model.position.set(-15,.1,0);
  
  model.castShadow = true;
  data.scene.traverse((node) => {
    if (node.isMesh) node.receiveShadow = true;
  });

  return model;
}

export {loadStreet}
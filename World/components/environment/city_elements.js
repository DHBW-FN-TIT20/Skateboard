import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

async function loadCityElements(url){
  const gltfLoader = new GLTFLoader();
  const data = await gltfLoader.loadAsync(url);
  const model = data.scene.children[0];

  model.scale.set(.1,.1,.1);

  model.castShadow = true;

  data.scene.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });

  return model;
}

export {loadCityElements}
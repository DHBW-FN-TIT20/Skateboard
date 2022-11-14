import { PerspectiveCamera } from "three";

function createCamera(){
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    1000
  );
  camera.position.set(0,0.5,-2);
  return camera;
}

export {createCamera};
import { PerspectiveCamera } from "three";

//** create a PerspectiveCamera */
function createCamera(){
  const camera = new PerspectiveCamera(
    75,  //field of view
    window.innerWidth / window.innerHeight, 
    0.01, //near
    1000 //far
  );
  camera.position.set(0,10,-25);
  return camera;
}

export {createCamera};
import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * creates the OrbitControls for the camera movement with the mouse
 * 
 * @param {PerspectiveCamera} camera - the camera
 * @param {HTMLCanvasElement} canvas - the canvas
 * @returns 
 */
function createControls(camera, canvas){
  const controls = new OrbitControls(camera, canvas);

  controls.tick = () => controls.update();

  return controls
}

export {createControls};
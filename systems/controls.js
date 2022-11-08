import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function createControls(camera, canvas){
  const controls = new OrbitControls(camera, canvas);

  return controls
}

export {createControls};
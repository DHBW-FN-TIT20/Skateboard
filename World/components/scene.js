import { Scene, Color } from "three";

function createScene(){
  const scene = new Scene();
  scene.background = new Color( 0x171928 );

  return scene;
}

export{createScene};
import { Scene, Color } from "three";

function createScene(){
  const scene = new Scene();
  scene.background = new Color( 0xa0a0a0 );

  return scene;
}

export{createScene};
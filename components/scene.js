import { Scene, Color } from "three";

function createScene(){
  const scene = new Scene();
  scene.background = new Color( "black" );

  return scene;
}

export{createScene};
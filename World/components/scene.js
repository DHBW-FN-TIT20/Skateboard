import { Scene, Color } from "three";

function createScene(){
  const scene = new Scene();
  scene.background = new Color( "lightblue" );

  return scene;
}

export{createScene};
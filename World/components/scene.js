import { Scene, Color } from "three";

function createScene(){
  const scene = new Scene();
  scene.day = () => {
    scene.background = new Color("lightblue");
  }
  scene.night = () => {
    scene.background = new Color(0x171928);
  }

  scene.day();
  return scene;
}

export{createScene};

import { Scene, Color } from "three";

function createScene(){
  const scene = new Scene();
  scene.day = () => {
    scene.background = new Color("lightblue")
  }
  scene.night = () => {
    scene.background = new Color("black")
  }

  scene.day();
  return scene;
}

export{createScene};

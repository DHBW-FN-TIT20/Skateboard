import { Scene, Color } from "three";


/** 
 * create a threejs scene
 * 
 * @return {scene}
 */
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

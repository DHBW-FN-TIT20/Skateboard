import { DirectionalLight, AmbientLight } from "three";

function createLights(){
  const directionalLight = new DirectionalLight(0xffffff, 0.9);

  const ambientLight = new AmbientLight(0xffffff, 0.4);
  
  //set up for the directional light
  directionalLight.position.set( 0, 1, 0 );
  directionalLight.castShadow = true; 
  directionalLight.target.position.set(0, 0, 0);

  //Set up shadow properties for the light
  directionalLight.shadow.mapSize.width = 5000; 
  directionalLight.shadow.mapSize.height = 5000; 
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 40;

  return {directionalLight, ambientLight};
}

export {createLights};
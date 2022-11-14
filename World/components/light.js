import { Vector3 } from "three";
import { HemisphereLight, DirectionalLight, AmbientLight } from "three";

function createLights(){
  const directionalLight = new DirectionalLight(0xffffff, .9);

  const ambientLight = new AmbientLight(0xffffff, 0.4);
  
  //set up for the directional light
  directionalLight.position.set( 2, 15, 20 );
  directionalLight.castShadow = true; 
  // directionalLight.target.position.set(0, 10, 0);

  //Set up shadow properties for the light
  directionalLight.shadow.mapSize.width = 1000; 
  directionalLight.shadow.mapSize.height = 1000; 
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 40;

  return {directionalLight, ambientLight};
}

export {createLights};
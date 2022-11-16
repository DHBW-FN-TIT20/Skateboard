import { Vector3 } from "three";
import { HemisphereLight, DirectionalLight, AmbientLight } from "three";

function createLights(){
  //create a directional light to represent the sun 
  //white light with an intensity of 0.9 of 1
  const directionalLight = new DirectionalLight(0xffffff, 0.9);

  //creates an ambient light, that the shadow areas are not completely black
  //white light with an intensity of 0.4
  const ambientLight = new AmbientLight(0xffffff, 0.4);
  
  //set up for the directional light
  //Position and allow that it casts shadows
  directionalLight.position.set( 2, 15, 20 );
  directionalLight.castShadow = true; 
  // directionalLight.target.position.set(0, 10, 0);

  
  //Set up shadow properties for the light

  //resolution of the shadow
  directionalLight.shadow.mapSize.width = 1000; 
  directionalLight.shadow.mapSize.height = 1000; 

  //distanze of the shadow
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 40;

  return {directionalLight, ambientLight};
}

export {createLights};
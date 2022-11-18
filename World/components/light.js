import { HemisphereLight, DirectionalLight, AmbientLight } from "three";

function createLights(){
  //create a directional light to represent the sun 
  //white light with an intensity of 0.9 of 1
  // const directionalLight = new DirectionalLight(0xffffff, 0.2);
  const directionalLight = new DirectionalLight(0xffffff, 0.9);


  //creates an ambient light, that the shadow areas are not completely black
  //white light with an intensity of 0.4
  const ambientLight = new AmbientLight(0xffffff, 0.35);

  //create hemisphere light
  //fades between the skyColor and the groundColor to create a realistic scene
  const skyColor = 0xB1E1FF;  // light blue
  const groundColor = 0x000000;  // brownish orange
  const hemisphereLight = new HemisphereLight(skyColor, groundColor, 0);
  
  //set up for the directional light
  //Position and allow that it casts shadows
  directionalLight.position.set( 0, 15, 17 );
  directionalLight.castShadow = true; 
  directionalLight.target.position.set(0, 0, 0);


  //resolution of the shadow
  directionalLight.shadow.mapSize.width = 2000; 
  directionalLight.shadow.mapSize.height = 2000; 

  //distanze of the shadow
  directionalLight.shadow.camera.near = 5;
  directionalLight.shadow.camera.far = 40;

  //area of the directional light shadow
  var area = 20;
  directionalLight.shadow.camera.top = area;
  directionalLight.shadow.camera.left = area;
  directionalLight.shadow.camera.right = -area;
  directionalLight.shadow.camera.bottom = -area;

  return {directionalLight, ambientLight, hemisphereLight};
}

export {createLights};
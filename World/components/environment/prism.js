import {  MeshStandardMaterial, ConeGeometry, Mesh} from "three";
import * as CANNON from "cannon-es";


function createCone(xPos, zPos){
  const geometry = new ConeGeometry( 3, 1, 4, 1 );
  const material = new MeshStandardMaterial( {color: 0x767272} );
  const cone = new Mesh( geometry, material );

  cone.position.set(xPos, 0.6, zPos);
  cone.castShadow = true;
  cone.receiveShadow = true;

  //add hitbox
  const hydrantCylinder = new CANNON.Cylinder(0.01, 3, 1, 4, 1);
  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: hydrantCylinder,
    position: new CANNON.Vec3(xPos, 0.59, zPos)
  });

  return {model: cone, physics};
}


export {createCone}
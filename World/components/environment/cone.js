import {  MeshStandardMaterial, ConeGeometry, Mesh} from "three";
import * as CANNON from "cannon-es";

/** 
 * load a cone and add a hitbox
 * 
 * @param {number} xPos - the X coordinate of the model 
 * @param {number} zPos - the Z coordinate of the model 
 * 
 * @return {model, physics}
 */
function createCone(xPos, zPos){
  const geometry = new ConeGeometry( 3, 1.05, 4, 1 );
  const material = new MeshStandardMaterial( {color: 0x767272} );
  const cone = new Mesh( geometry, material );

  cone.position.set(xPos, 0.6, zPos);
  cone.castShadow = true;
  cone.receiveShadow = true;

  //add hitbox
  const coneCylinder = new CANNON.Cylinder(0.01, 4, 1.4, 4, 2);
  const physics = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: coneCylinder,
    position: new CANNON.Vec3(xPos, 0.42, zPos)
  });

  return {model: cone, physics};
}


export {createCone}
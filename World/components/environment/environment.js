import * as THREE from "three";
import * as CANNON from "cannon-es";
import { degToRad } from "three/src/math/MathUtils";

/** 
 * load a plane and add a hitbox
 * 
 * @return {model, physics}
 */
async function loadEnvironment() {
    //add the floor 
    const geometry = new THREE.BoxGeometry(30, 40, .2);
    const material = new THREE.MeshStandardMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const model = new THREE.Mesh(geometry, material);
    model.rotateX(degToRad(90));
    model.position.set(5, 0, 0);
    model.receiveShadow = true;

    const groundMaterial = new CANNON.Material("groundMaterial");
    groundMaterial.friction = 1;
    const groundShape = new CANNON.Box(new CANNON.Vec3(20, 20, 0.1))
    const physics = new CANNON.Body({ type: CANNON.Body.STATIC, material: groundMaterial });
    physics.addShape(groundShape);
    physics.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);

    return { model, physics };
};

export { loadEnvironment }
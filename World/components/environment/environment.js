import * as THREE from "three";
import { degToRad } from "three/src/math/MathUtils";

async function loadEnvironment() {
    //add the floor 
    const geometry = new THREE.PlaneGeometry(5, 5);
    const material = new THREE.MeshPhongMaterial({ color: 0x888888, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotateX(degToRad(90));
    plane.position.set(0, 0, 0);
    plane.receiveShadow = true;
    
    return plane;
};

export { loadEnvironment }
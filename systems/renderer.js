import { WebGLRenderer, PCFSoftShadowMap } from 'three';

/**
 * creates a renderer with WebGL
 * 
 * @returns {WebGLRenderer}
 */
function createRenderer(){
  const renderer = new WebGLRenderer({
    canvas: document.querySelector(".canv"),
    antialias: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap; // default THREE.PCFShadowMap

  return renderer;
}

export {createRenderer};
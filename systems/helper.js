import { DirectionalLightHelper, AxesHelper, GridHelper, CameraHelper } from "three";

/**
 * creates the helper for the light, axis, grid and the camera
 * 
 * @param {DirectionalLight} directionalLight 
 * 
 * @returns {DirectionalLightHelper, AxesHelper, GridHelper, CameraHelper}
 */
function createHelpers(directionalLight) {
  const dlHelper = new DirectionalLightHelper(directionalLight);
  const axisHelper = new AxesHelper(10);
  const gridHelper = new GridHelper(10, 20,0x2c2c2c, 0x888888);
  const cameraHelper = new CameraHelper(directionalLight.shadow.camera);

  return {
    dlHelper,
    axisHelper,
    gridHelper,
    cameraHelper
  }
}

export {createHelpers};
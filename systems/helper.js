import { DirectionalLightHelper, AxesHelper, GridHelper } from "three";

function createHelpers(directionalLight) {
  const dlHelper = new DirectionalLightHelper(directionalLight);
  const axisHelper = new AxesHelper(10);
  const gridHelper = new GridHelper(10, 20,0x2c2c2c, 0x888888);

  return {
    dlHelper,
    axisHelper,
    gridHelper
  }
}

export {createHelpers};
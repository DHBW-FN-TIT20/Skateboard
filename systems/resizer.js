
/**
 * changes the size of the renderer to the actual window size
 */
const setSize = (window, camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * makes sure the origin of the grid is centered after resizing
 */
class Resizer {
  constructor(window, camera, renderer){
    window.addEventListener('resize', () => {
      setSize(window, camera, renderer);
    });
  }
}

export {Resizer};
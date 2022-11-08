const setSize = (window, camera, renderer) => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

class Resizer {
  constructor(window, camera, renderer){
    window.addEventListener('resize', () => {
      setSize(window, camera, renderer);
    });
  }
}

export {Resizer};
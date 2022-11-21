import { Clock } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';


const clock = new Clock();

/**
 * creates an animation loop for rendering every frame
 */
class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;

    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    /** conatins alle updateable objects */
    this.updatables = [];
  }

  /** starts the animation loop*/
  start() {
    this.renderer.setAnimationLoop(() => {
      this.stats.begin();
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      this.renderer.render(this.scene, this.camera);
      this.stats.end();
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  /** updates the updatables -> calls all updateable objects to update/tick */
  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();

    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}

export { Loop };

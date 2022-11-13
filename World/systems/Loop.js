import { Clock } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';


const clock = new Clock();

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;

    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    this.updatables = [];
  }

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

  tick() {
    // only call the getDelta function once per frame!
    const delta = clock.getDelta();

    for (const object of this.updatables) {
      object.tick(delta);
    }
  }
}

export { Loop };

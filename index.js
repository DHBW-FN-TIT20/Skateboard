
import { World } from './World/World.js';

async function main() {
  // create a new world
  const world = new World();

  await world.init();
  
  world.start();
}

main().catch((err) => {
  console.error(err);
});

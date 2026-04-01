import { initScene, animate } from "./game/engine.js";
import { initNetwork } from "./network.js";
import { initMatch } from "./game/match.js";

initScene();
initNetwork();
initMatch();

animate();
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";
import { scene } from "./engine.js";

export let ball;
let velocity = new THREE.Vector3();

export function initBall() {
  ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.5),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  );
  ball.position.y = 0.5;
  scene.add(ball);
}

export function updateBall() {
  if (!ball) return;

  ball.position.add(velocity);
  velocity.multiplyScalar(0.96);
}

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";
import { scene } from "./engine.js";

export let players = {};

export function createPlayer(id) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1,2,1),
    new THREE.MeshBasicMaterial({ color: Math.random()*0xffffff })
  );
  mesh.position.y = 1;
  scene.add(mesh);

  players[id] = mesh;
}

export function updatePlayers() {
  // updates handled from network
}
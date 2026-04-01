import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";
import { updatePlayers } from "./player.js";
import { updateBall } from "./ball.js";
import { updateUI } from "./ui.js";

export let scene, camera, renderer;

export function initScene() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 15);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10,20,10);
  scene.add(light);

  // Field
  const field = new THREE.Mesh(
    new THREE.PlaneGeometry(50,30),
    new THREE.MeshBasicMaterial({ color: 0x228B22 })
  );
  field.rotation.x = -Math.PI/2;
  scene.add(field);
}

export function animate() {
  requestAnimationFrame(animate);

  updatePlayers();
  updateBall();
  updateUI();

  renderer.render(scene, camera);
}

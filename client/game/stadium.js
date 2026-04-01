const stadium = new THREE.Mesh(
  new THREE.CylinderGeometry(40, 40, 10, 32, 1, true),
  new THREE.MeshStandardMaterial({
    color: 0x888888,
    side: THREE.DoubleSide
  })
);

stadium.position.y = 5;
scene.add(stadium);
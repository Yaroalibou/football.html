const loader = new THREE.TextureLoader();

const grass = loader.load("assets/grass.jpg");
grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
grass.repeat.set(20, 20);

const field = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 30),
  new THREE.MeshStandardMaterial({ map: grass })
);

field.rotation.x = -Math.PI / 2;
scene.add(field);
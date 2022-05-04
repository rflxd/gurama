import * as Three from "https://unpkg.com/three@0.127.0/build/three.module.js"

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .1, 1000)
const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);

let currentShape = null;
const shapes = {
    'icosahedron': new Three.IcosahedronGeometry(3, 0),
    'box': new Three.BoxGeometry(4,4,4),
    'dodecahedron': new Three.DodecahedronGeometry(3, 1),
    'cone': new Three.ConeGeometry(3, 6, 300),
    'plane': new Three.PlaneGeometry(3,3),
    'plane': new Three.PlaneGeometry(3,3),
}
const shapeKeys = Object.keys(shapes);

const changeCurrentShape = (shape) => {
  if (currentShape !== null) {
    currentShape.geometry.dispose();
    currentShape.material.dispose();
    scene.remove(currentShape)
    console.log('scene removed')
  }
  console.log(shape)
  const geometry = shape;
  const texture = new Three.TextureLoader().load('./Gurama.png')
  const material = new Three.MeshStandardMaterial({ map: texture, side: Three.DoubleSide });
  const poly = new Three.Mesh(geometry, material);
  currentShape = poly;
  currentShape.position.copy(scene.position)
  scene.add(currentShape)
};

const spotLight = new Three.PointLight(0xFFFFFF, 5, 20, 2.5)
camera.add(spotLight);
spotLight.position.copy(camera.position)
scene.add(camera)

camera.position.set(10,4,10)

changeCurrentShape(shapes[shapeKeys[0]])

// const geometry = new Three.CapsuleGeometry(3,3,10,20);
// const texture = new Three.TextureLoader().load('./Gurama.png')
// const material = new Three.MeshStandardMaterial({ map: texture, side: Three.DoubleSide });
// const poly = new Three.Mesh(geometry, material);
// currentShape = poly;
// scene.add(currentShape)

let i = 0;
document.querySelectorAll('button').forEach((btn) => {
    console.log(i)
    btn.innerText = shapeKeys[i];
    // btn.onclick = () => console.log('clicked');
    btn.onclick = () => changeCurrentShape(shapes[btn.innerText.toLowerCase()]);
    i++;
}) 

const animate = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  requestAnimationFrame(animate);
  console.log('wtf')
  camera.position.x = Math.cos(Date.now() * 0.0005) * 10;
  camera.position.z = Math.sin(Date.now() * 0.0005) * 10;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

animate();

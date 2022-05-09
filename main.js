import * as Three from "https://unpkg.com/three@0.127.0/build/three.module.js"
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .1, 1000)
const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);

let currentShape = null;
let currentQuality = document.querySelector('.slider')
const shapes = {
    'icosahedron': new Three.IcosahedronGeometry(3, parseInt(currentQuality.value, 10)),
    'box': new Three.BoxGeometry(4,4,4),
    'dodecahedron': new Three.DodecahedronGeometry(3, parseInt(currentQuality.value, 10)),
    'cone': new Three.ConeGeometry(3, 6, 300),
    'plane': new Three.PlaneGeometry(3,3),
    'prism': new Three.ConeGeometry(5, 6, 4),
}
const shapeKeys = Object.keys(shapes);

let customTexture = 'https://avatars.cloudflare.steamstatic.com/f38c10dea1a79250dc9559df1f4d4d0725bbb637_full.jpg'
document.querySelector('label').addEventListener("click", () => {
  const url = document.querySelector('#imgUrl');
  const submit = document.querySelector('label');
  if (url.value !== '') {
    customTexture = url.value;
    changeCurrentShape(currentShape.geometry)
  }
})

const changeCurrentShape = (shape, name) => {
  if (currentShape !== null) {
    currentShape.geometry.dispose();
    currentShape.material.dispose();
    scene.remove(currentShape)
  }
  const geometry = shape;
  const texture = new Three.TextureLoader().load(customTexture)
  const material = new Three.MeshStandardMaterial({ map: texture, side: Three.DoubleSide, color: 0xFFFFFF});
  const poly = new Three.Mesh(geometry, material);
  currentShape = poly;
  currentShape.name = name;
  currentShape.position.copy(scene.position)
  scene.add(currentShape)
};

const spotLight = new Three.PointLight(0xFFFFFF, 5, 25, 2.5)
camera.add(spotLight);
spotLight.position.copy(camera.position)
scene.add(camera)

const orbitControls = new OrbitControls(camera, renderer.domElement)
orbitControls.autoRotate = true
orbitControls.autoRotateSpeed = 5
orbitControls.enablePan = false
camera.position.set(5,4,10)
orbitControls.update();

changeCurrentShape(shapes[shapeKeys[0]], shapeKeys[0])
currentQuality.value = '0'
changeCurrentShape(shapes[shapeKeys[0]], shapeKeys[0])


let i = 0;
document.querySelectorAll('button').forEach((btn) => {
    btn.innerText = shapeKeys[i];
    btn.onclick = () => changeCurrentShape(shapes[btn.innerText.toLowerCase()], btn.innerText.toLowerCase());
    i++;
}) 

currentQuality.addEventListener('change', () => {
  if (['icosahedron', 'dodecahedron'].includes(currentShape.name)) {
    shapes.icosahedron = new Three.IcosahedronGeometry(3, parseInt(currentQuality.value, 10));
    shapes.dodecahedron = new Three.DodecahedronGeometry(3, parseInt(currentQuality.value, 10));
    changeCurrentShape(shapes[shapeKeys[shapeKeys.indexOf(currentShape.name)]], currentShape.name)
  }
})

const animate = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  requestAnimationFrame(animate);
  orbitControls.update();
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

animate();

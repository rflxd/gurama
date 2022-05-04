import * as Three from "https://unpkg.com/three@0.127.0/build/three.module.js"

const scene = new Three.Scene();
const camera = new Three.PerspectiveCamera(70, window.innerWidth / window.innerHeight, .1, 1000)
const renderer = new Three.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);

const shape = new Three.IcosahedronGeometry(3, 0);
const texture = new Three.TextureLoader().load('./Gurama.png')
texture.wrapT = Three.RepeatWrapping
texture.wrapS = Three.RepeatWrapping
const material = new Three.MeshStandardMaterial({ map: texture, side: Three.FrontSide });
const poly = new Three.Mesh(shape, material);

scene.add(poly);

const spotLight = new Three.PointLight(0xFFFFFF, 5, 20, 2.5)
camera.add(spotLight);
spotLight.position.copy(camera.position)
scene.add(camera)

camera.position.set(10,4,10)

const animate = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  requestAnimationFrame(animate);
  camera.position.x = Math.cos(Date.now() * 0.0005) * 10;
  camera.position.z = Math.sin(Date.now() * 0.0005) * 10;
  camera.lookAt(scene.position);
  renderer.render(scene, camera);
}

animate();

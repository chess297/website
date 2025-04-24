# Three.js 进阶知识

## 1. 高级场景管理

### 1.1 场景图与对象分组

```javascript
const group = new THREE.Group();

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube1.position.x = -2;

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);

group.add(cube1);
group.add(cube2);
scene.add(group);
```

### 1.2 对象池技术

```javascript
class ParticlePool {
  constructor(size) {
    this.particles = [];
    for (let i = 0; i < size; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
  }

  getParticle() {
    return this.particles.pop();
  }

  releaseParticle(particle) {
    this.particles.push(particle);
  }
}
```

## 2. 高级材质与着色器

### 2.1 自定义着色器材质

```javascript
const customMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
  },
  vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
  fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        void main() {
            gl_FragColor = vec4(vUv.x + sin(time) * 0.5, vUv.y, 0.0, 1.0);
        }
    `,
});
```

### 2.2 后期处理效果

```javascript
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
composer.addPass(bloomPass);
```

## 3. 高级动画技术

### 3.1 骨骼动画

```javascript
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const loader = new GLTFLoader();
loader.load("model.glb", (gltf) => {
  const model = gltf.scene;
  const mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations;
  const clip = THREE.AnimationClip.findByName(clips, "walk");
  const action = mixer.clipAction(clip);
  action.play();

  scene.add(model);
});
```

### 3.2 变形动画

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
geometry.morphAttributes.position = [];

const positions = geometry.attributes.position.array;
const morphPositions = new Float32Array(positions.length);

// 创建变形目标
for (let i = 0; i < positions.length; i += 3) {
  morphPositions[i] = positions[i] * 1.5;
  morphPositions[i + 1] = positions[i + 1] * 1.5;
  morphPositions[i + 2] = positions[i + 2] * 1.5;
}

geometry.morphAttributes.position[0] = new THREE.BufferAttribute(
  morphPositions,
  3
);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  morphTargets: true,
});

const mesh = new THREE.Mesh(geometry, material);
mesh.morphTargetInfluences[0] = 0.5; // 设置变形程度
```

## 4. 性能优化进阶

### 4.1 LOD（细节层次）

```javascript
const lod = new THREE.LOD();

const highDetailGeometry = new THREE.BoxGeometry(1, 1, 1, 16, 16, 16);
const mediumDetailGeometry = new THREE.BoxGeometry(1, 1, 1, 8, 8, 8);
const lowDetailGeometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);

lod.addLevel(new THREE.Mesh(highDetailGeometry, material), 0);
lod.addLevel(new THREE.Mesh(mediumDetailGeometry, material), 50);
lod.addLevel(new THREE.Mesh(lowDetailGeometry, material), 100);

scene.add(lod);
```

### 4.2 实例化渲染

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial();

const matrix = new THREE.Matrix4();
const mesh = new THREE.InstancedMesh(geometry, material, 1000);

for (let i = 0; i < 1000; i++) {
  matrix.setPosition(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  );
  mesh.setMatrixAt(i, matrix);
}

scene.add(mesh);
```

## 5. 高级交互技术

### 5.1 射线拾取

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const object = intersects[0].object;
    object.material.color.set(0xff0000);
  }
}

window.addEventListener("mousemove", onMouseMove);
```

### 5.2 拖拽控制

```javascript
import { DragControls } from "three/examples/jsm/controls/DragControls";

const objects = [mesh1, mesh2, mesh3];
const controls = new DragControls(objects, camera, renderer.domElement);

controls.addEventListener("dragstart", function (event) {
  event.object.material.emissive.set(0xaaaaaa);
});

controls.addEventListener("dragend", function (event) {
  event.object.material.emissive.set(0x000000);
});
```

## 6. 特效与粒子系统

### 6.1 粒子系统

```javascript
const particlesGeometry = new THREE.BufferGeometry();
const particlesCnt = 5000;

const posArray = new Float32Array(particlesCnt * 3);
for (let i = 0; i < particlesCnt * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 5;
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.005,
  color: 0xffffff,
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);
```

### 6.2 环境效果

```javascript
// 添加雾效果
scene.fog = new THREE.Fog(0x000000, 1, 1000);

// 添加天空盒
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  "px.jpg",
  "nx.jpg",
  "py.jpg",
  "ny.jpg",
  "pz.jpg",
  "nz.jpg",
]);
```

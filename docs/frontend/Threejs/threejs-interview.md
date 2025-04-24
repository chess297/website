# Three.js 面试题

## 1. 基础概念

### 1.1 Three.js 和 WebGL 的关系是什么？

Three.js 是一个基于 WebGL 的 3D 图形库。WebGL 是一个底层的图形 API，直接使用比较复杂，而 Three.js 对 WebGL 进行了封装，提供了更高层的抽象和更友好的 API，使得开发 3D 应用变得更加简单。

### 1.2 Three.js 中的核心概念有哪些？

主要包括以下核心概念：

1. Scene（场景）：用于组织和管理所有 3D 对象
2. Camera（相机）：定义观察视角，包括透视相机和正交相机
3. Renderer（渲染器）：负责将场景渲染到屏幕上
4. Mesh（网格）：由几何体和材质组成的 3D 对象
5. Geometry（几何体）：定义物体的形状
6. Material（材质）：定义物体的外观
7. Light（光源）：为场景提供照明

## 2. 性能优化

### 2.1 如何优化 Three.js 应用的性能？

1. 几何体优化：

   - 使用 BufferGeometry 替代 Geometry
   - 合并多个几何体
   - 使用 LOD（细节层次）技术

2. 材质优化：

   - 使用合适的材质类型
   - 共享材质
   - 优化纹理大小和格式

3. 渲染优化：

   - 使用 frustum culling
   - 实现对象池
   - 使用实例化渲染
   - 优化灯光数量

4. 内存管理：
   - 及时释放不需要的资源
   - 使用 dispose() 方法清理内存

### 2.2 如何处理大规模数据的渲染？

1. 数据分块加载：

```javascript
const chunkSize = 1000;
const totalObjects = 100000;

function loadChunk(startIndex) {
  const endIndex = Math.min(startIndex + chunkSize, totalObjects);
  for (let i = startIndex; i < endIndex; i++) {
    // 创建和添加对象
  }
  if (endIndex < totalObjects) {
    requestAnimationFrame(() => loadChunk(endIndex));
  }
}
```

2. 使用实例化渲染：

```javascript
const instancedMesh = new THREE.InstancedMesh(
  geometry,
  material,
  numberOfInstances
);

// 设置每个实例的矩阵
for (let i = 0; i < numberOfInstances; i++) {
  const matrix = new THREE.Matrix4();
  matrix.setPosition(positions[i]);
  instancedMesh.setMatrixAt(i, matrix);
}
```

## 3. 渲染技术

### 3.1 如何实现后期处理效果？

```javascript
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// 添加后期处理效果
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
composer.addPass(bloomPass);

// 在渲染循环中使用
function animate() {
  requestAnimationFrame(animate);
  composer.render();
}
```

### 3.2 如何实现阴影效果？

```javascript
// 1. 开启渲染器阴影
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 2. 设置光源产生阴影
directionalLight.castShadow = true;

// 3. 设置物体投射和接收阴影
mesh.castShadow = true;
ground.receiveShadow = true;

// 4. 配置阴影相机
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
```

## 4. 交互与动画

### 4.1 如何实现对象选择？

```javascript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
  // 计算鼠标位置
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // 发射射线
  raycaster.setFromCamera(mouse, camera);

  // 计算相交的对象
  const intersects = raycaster.intersectObjects(scene.children);

  if (intersects.length > 0) {
    const selected = intersects[0].object;
    // 处理选中的对象
  }
}
```

### 4.2 如何实现复杂动画？

1. 使用 GSAP：

```javascript
import gsap from "gsap";

gsap.to(mesh.position, {
  x: 5,
  duration: 2,
  ease: "power2.inOut",
  yoyo: true,
  repeat: -1,
});
```

2. 使用骨骼动画：

```javascript
const mixer = new THREE.AnimationMixer(model);
const clip = THREE.AnimationClip.findByName(model.animations, "walk");
const action = mixer.clipAction(clip);
action.play();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  mixer.update(delta);
  renderer.render(scene, camera);
}
```

## 5. 高级技术

### 5.1 如何实现自定义着色器？

```javascript
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
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
            gl_FragColor = vec4(vUv, sin(time) * 0.5 + 0.5, 1.0);
        }
    `,
});
```

### 5.2 如何处理模型加载和资源管理？

1. 使用加载管理器：

```javascript
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (url, loaded, total) => {
  console.log(`Loading: ${loaded}/${total}`);
};

const loader = new GLTFLoader(loadingManager);
loader.load("model.glb", (gltf) => {
  scene.add(gltf.scene);
});
```

2. 资源预加载：

```javascript
const textureLoader = new THREE.TextureLoader();
const textures = {};

function preloadTextures(urls) {
  const promises = urls.map((url) => {
    return new Promise((resolve) => {
      textureLoader.load(url, (texture) => {
        textures[url] = texture;
        resolve();
      });
    });
  });
  return Promise.all(promises);
}
```

## 6. 调试与优化

### 6.1 如何进行性能监控？

```javascript
// 使用 Stats.js
const stats = new Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();

  // 渲染代码

  stats.end();
  requestAnimationFrame(animate);
}

// 使用 Chrome Performance
console.profile("Rendering");
// 执行需要分析的代码
console.profileEnd();
```

### 6.2 如何处理内存泄漏？

1. 正确释放资源：

```javascript
function dispose() {
  // 释放几何体
  geometry.dispose();

  // 释放材质
  material.dispose();

  // 释放纹理
  texture.dispose();

  // 从场景中移除
  scene.remove(mesh);
}
```

2. 使用弱引用：

```javascript
const cache = new WeakMap();
function getGeometry(key) {
  if (!cache.has(key)) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    cache.set(key, geometry);
  }
  return cache.get(key);
}
```

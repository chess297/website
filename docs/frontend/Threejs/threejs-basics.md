# Three.js 基础知识

## 1. Three.js 简介

Three.js 是一个基于 WebGL 的 3D 图形库，它提供了一套完整的 3D 图形开发工具，使得在浏览器中创建 3D 图形变得简单和高效。

### 1.1 Three.js 的优势

- 简单易用，封装了复杂的 WebGL API
- 功能强大，支持多种 3D 模型、材质、光照等
- 性能优秀，支持硬件加速
- 跨平台，在所有现代浏览器中运行
- 丰富的社区资源和示例

### 1.2 基本概念

- Scene（场景）：所有 3D 对象的容器
- Camera（相机）：决定观察场景的视角
- Renderer（渲染器）：将场景渲染到屏幕上
- Mesh（网格）：由几何体和材质组成的 3D 对象
- Light（光源）：为场景提供照明

## 2. 开发环境搭建

### 2.1 安装 Three.js

```bash
npm install three
```

### 2.2 基本项目结构

```javascript
import * as THREE from "three";

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

## 3. 基础图形绘制

### 3.1 创建基本几何体

```javascript
// 创建立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
```

### 3.2 基本材质类型

- MeshBasicMaterial：基础材质，不受光照影响
- MeshPhongMaterial：具有镜面高光的材质
- MeshLambertMaterial：漫反射材质
- MeshStandardMaterial：物理基础渲染材质

### 3.3 添加光源

```javascript
// 环境光
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// 点光源
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);
```

## 4. 动画与交互

### 4.1 基本动画循环

```javascript
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();
```

### 4.2 响应窗口调整

```javascript
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
```

### 4.3 基本鼠标交互

```javascript
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 添加阻尼效果
controls.dampingFactor = 0.05;
```

## 5. 纹理与材质

### 5.1 加载纹理

```javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("texture.jpg");
const material = new THREE.MeshBasicMaterial({ map: texture });
```

### 5.2 材质属性设置

```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.5,
  metalness: 0.5,
  map: texture,
  normalMap: normalTexture,
});
```

## 6. 性能优化基础

### 6.1 基本优化技巧

- 使用适当的几何体类型
- 合理设置渲染分辨率
- 控制场景中的对象数量
- 使用 BufferGeometry 而不是 Geometry
- 适时使用 fog 来限制渲染距离

### 6.2 性能监控

```javascript
import Stats from "three/examples/jsm/libs/stats.module";

const stats = Stats();
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  // 渲染代码
  stats.end();
  requestAnimationFrame(animate);
}
```

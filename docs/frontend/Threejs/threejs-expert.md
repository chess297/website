# Three.js 高级知识

## 1. WebGL 深入理解

### 1.1 自定义 WebGL 渲染管线

```javascript
const gl = renderer.getContext();

// 自定义顶点着色器
const vertexShader = `
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// 自定义片段着色器
const fragmentShader = `
    precision highp float;
    uniform sampler2D map;
    varying vec2 vUv;
    
    void main() {
        vec4 texel = texture2D(map, vUv);
        gl_FragColor = texel;
    }
`;

// 创建自定义材质
const rawShaderMaterial = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    map: { value: new THREE.TextureLoader().load("texture.jpg") },
  },
});
```

### 1.2 WebGL 状态优化

```javascript
// 禁用不必要的 WebGL 特性
renderer.getContext().disable(gl.DEPTH_TEST);
renderer.getContext().disable(gl.CULL_FACE);

// 手动管理 WebGL 状态
const geometry = new THREE.BufferGeometry();
const material = new THREE.RawShaderMaterial({
  vertexShader,
  fragmentShader,
  glslVersion: THREE.GLSL3,
});

const mesh = new THREE.Mesh(geometry, material);
```

## 2. 高级渲染技术

### 2.1 延迟渲染

```javascript
// G-Buffer 设置
const gBufferRenderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  }
);

// 位置缓冲
const positionRT = gBufferRenderTarget.clone();
// 法线缓冲
const normalRT = gBufferRenderTarget.clone();
// 颜色缓冲
const colorRT = gBufferRenderTarget.clone();

// 延迟着色器
const deferredShader = {
  uniforms: {
    tPosition: { value: positionRT.texture },
    tNormal: { value: normalRT.texture },
    tColor: { value: colorRT.texture },
    lightPos: { value: new THREE.Vector3() },
  },
  vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
  fragmentShader: /* glsl */ `
        uniform sampler2D tPosition;
        uniform sampler2D tNormal;
        uniform sampler2D tColor;
        uniform vec3 lightPos;
        varying vec2 vUv;
        
        void main() {
            vec3 position = texture2D(tPosition, vUv).rgb;
            vec3 normal = texture2D(tNormal, vUv).rgb;
            vec3 color = texture2D(tColor, vUv).rgb;
            
            vec3 lightDir = normalize(lightPos - position);
            float diff = max(dot(normal, lightDir), 0.0);
            
            gl_FragColor = vec4(color * diff, 1.0);
        }
    `,
};
```

### 2.2 体积渲染

```javascript
const volumeShader = {
  uniforms: {
    uVolume: { value: null },
    uTransferFunction: { value: null },
    uStepSize: { value: 0.01 },
    uOffset: { value: new THREE.Vector3() },
  },
  vertexShader: /* glsl */ `
        varying vec3 vOrigin;
        varying vec3 vDirection;
        
        void main() {
            vOrigin = vec3(modelMatrix * vec4(position, 1.0));
            vDirection = position - cameraPosition;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
  fragmentShader: /* glsl */ `
        uniform sampler3D uVolume;
        uniform sampler2D uTransferFunction;
        uniform float uStepSize;
        uniform vec3 uOffset;
        
        varying vec3 vOrigin;
        varying vec3 vDirection;
        
        void main() {
            vec3 rayDir = normalize(vDirection);
            vec3 rayPos = vOrigin + uOffset;
            
            vec4 accumulatedColor = vec4(0.0);
            
            for(int i = 0; i < 1000; i++) {
                float density = texture(uVolume, rayPos).r;
                vec4 color = texture2D(uTransferFunction, vec2(density, 0.5));
                
                accumulatedColor.rgb += (1.0 - accumulatedColor.a) * color.rgb * color.a;
                accumulatedColor.a += (1.0 - accumulatedColor.a) * color.a;
                
                rayPos += rayDir * uStepSize;
                
                if(accumulatedColor.a >= 0.95) break;
            }
            
            gl_FragColor = accumulatedColor;
        }
    `,
};
```

## 3. 物理引擎集成

### 3.1 Ammo.js 物理引擎集成

```javascript
import Ammo from "ammo.js";

Ammo().then(function (Ammo) {
  // 初始化物理世界
  const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
  const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
  const broadphase = new Ammo.btDbvtBroadphase();
  const solver = new Ammo.btSequentialImpulseConstraintSolver();
  const physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    broadphase,
    solver,
    collisionConfiguration
  );

  // 创建地面
  const groundShape = new Ammo.btBoxShape(new Ammo.btVector3(50, 1, 50));
  const groundTransform = new Ammo.btTransform();
  groundTransform.setIdentity();
  groundTransform.setOrigin(new Ammo.btVector3(0, -1, 0));
  const groundMass = 0; // 质量为0表示静态物体
  const groundLocalInertia = new Ammo.btVector3(0, 0, 0);
  const groundMotionState = new Ammo.btDefaultMotionState(groundTransform);
  const groundRigidBodyInfo = new Ammo.btRigidBodyConstructionInfo(
    groundMass,
    groundMotionState,
    groundShape,
    groundLocalInertia
  );
  const groundRigidBody = new Ammo.btRigidBody(groundRigidBodyInfo);
  physicsWorld.addRigidBody(groundRigidBody);

  // 动画循环中更新物理
  function animate() {
    const deltaTime = 1 / 60;
    physicsWorld.stepSimulation(deltaTime, 10);

    // 更新所有物理物体的位置
    // ...

    requestAnimationFrame(animate);
  }
});
```

### 3.2 复杂约束系统

```javascript
// 创建铰链约束
const hingeConstraint = new Ammo.btHingeConstraint(
  rigidBody1,
  rigidBody2,
  pivotInA,
  pivotInB,
  axisInA,
  axisInB,
  true
);

// 设置铰链限制
hingeConstraint.setLimit(
  -Math.PI / 4, // 最小角度
  Math.PI / 4, // 最大角度
  0.9, // 软度
  0.3, // 阻尼
  1.0 // 弹性
);

physicsWorld.addConstraint(hingeConstraint, true);
```

## 4. 高级几何处理

### 4.1 CSG（构造实体几何）

```javascript
import { CSG } from "three-csg-ts";

// 创建两个基础几何体
const box = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshNormalMaterial()
);
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 32, 32),
  new THREE.MeshNormalMaterial()
);

// 执行布尔运算
const boxCSG = CSG.fromMesh(box);
const sphereCSG = CSG.fromMesh(sphere);

// 差集运算
const subtractResult = boxCSG.subtract(sphereCSG);
const resultMesh = CSG.toMesh(subtractResult, box.matrix);
```

### 4.2 网格变形与平滑

```javascript
// 网格平滑
function smoothGeometry(geometry, iterations = 1) {
  const positions = geometry.attributes.position.array;
  const vertexNormals = geometry.attributes.normal.array;

  for (let iter = 0; iter < iterations; iter++) {
    const smoothedPositions = new Float32Array(positions.length);

    for (let i = 0; i < positions.length; i += 3) {
      let connectedVertices = [];

      // 查找相连顶点
      for (let j = 0; j < positions.length; j += 3) {
        if (i !== j) {
          const dist = Math.sqrt(
            Math.pow(positions[i] - positions[j], 2) +
              Math.pow(positions[i + 1] - positions[j + 1], 2) +
              Math.pow(positions[i + 2] - positions[j + 2], 2)
          );

          if (dist < 0.1) {
            // 阈值
            connectedVertices.push([j, j + 1, j + 2]);
          }
        }
      }

      // 计算平均位置
      let avgX = positions[i];
      let avgY = positions[i + 1];
      let avgZ = positions[i + 2];

      for (const vertex of connectedVertices) {
        avgX += positions[vertex[0]];
        avgY += positions[vertex[1]];
        avgZ += positions[vertex[2]];
      }

      smoothedPositions[i] = avgX / (connectedVertices.length + 1);
      smoothedPositions[i + 1] = avgY / (connectedVertices.length + 1);
      smoothedPositions[i + 2] = avgZ / (connectedVertices.length + 1);
    }

    positions.set(smoothedPositions);
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
}
```

## 5. WebXR 与高级交互

### 5.1 VR 场景开发

```javascript
import { VRButton } from "three/examples/jsm/webxr/VRButton";

renderer.xr.enabled = true;
document.body.appendChild(VRButton.createButton(renderer));

// VR 控制器
const controller1 = renderer.xr.getController(0);
const controller2 = renderer.xr.getController(1);

controller1.addEventListener("selectstart", onSelectStart);
controller1.addEventListener("selectend", onSelectEnd);

scene.add(controller1);
scene.add(controller2);

// VR 动画循环
function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  if (renderer.xr.isPresenting) {
    // VR 特定更新
  }
  renderer.render(scene, camera);
}
```

### 5.2 手势识别系统

```javascript
class GestureRecognizer {
  constructor() {
    this.gestures = new Map();
  }

  addGesture(name, points) {
    this.gestures.set(name, points);
  }

  recognize(points, threshold = 0.85) {
    let bestMatch = null;
    let highestScore = -1;

    for (const [name, template] of this.gestures) {
      const score = this.compareGestures(points, template);
      if (score > threshold && score > highestScore) {
        highestScore = score;
        bestMatch = name;
      }
    }

    return bestMatch;
  }

  compareGestures(points1, points2) {
    // 实现 $1 手势识别算法
    // 1. 重采样点
    // 2. 旋转归一化
    // 3. 缩放归一化
    // 4. 计算路径距离
    // ...
  }
}

const gestureRecognizer = new GestureRecognizer();
gestureRecognizer.addGesture("circle", circlePoints);
gestureRecognizer.addGesture("square", squarePoints);
```

## 6. 渲染管线优化

### 6.1 自定义渲染通道

```javascript
class CustomRenderPass extends THREE.Pass {
  constructor(scene, camera) {
    super();

    this.scene = scene;
    this.camera = camera;

    this.customUniforms = {
      tDiffuse: { value: null },
      time: { value: 0 },
    };

    this.customMaterial = new THREE.ShaderMaterial({
      uniforms: this.customUniforms,
      vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform float time;
                varying vec2 vUv;
                
                void main() {
                    vec2 p = vUv;
                    vec4 color = texture2D(tDiffuse, p);
                    
                    // 自定义后处理效果
                    float scanline = sin(p.y * 100.0 + time) * 0.04;
                    color.rgb += scanline;
                    
                    gl_FragColor = color;
                }
            `,
    });
  }

  render(renderer, writeBuffer, readBuffer, deltaTime) {
    this.customUniforms.tDiffuse.value = readBuffer.texture;
    this.customUniforms.time.value += deltaTime;

    renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
    renderer.render(this.scene, this.camera);
  }
}
```

### 6.2 GPU 实例化优化

```javascript
// 创建实例化属性
const instanceCount = 1000;
const offsets = new Float32Array(instanceCount * 3);
const scales = new Float32Array(instanceCount);
const colors = new Float32Array(instanceCount * 3);

for (let i = 0; i < instanceCount; i++) {
  offsets[i * 3] = Math.random() * 100 - 50;
  offsets[i * 3 + 1] = Math.random() * 100 - 50;
  offsets[i * 3 + 2] = Math.random() * 100 - 50;

  scales[i] = Math.random();

  colors[i * 3] = Math.random();
  colors[i * 3 + 1] = Math.random();
  colors[i * 3 + 2] = Math.random();
}

const geometry = new THREE.InstancedBufferGeometry();
geometry.copy(new THREE.BoxGeometry(1, 1, 1));

geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));
geometry.setAttribute("scale", new THREE.InstancedBufferAttribute(scales, 1));
geometry.setAttribute("color", new THREE.InstancedBufferAttribute(colors, 3));

const material = new THREE.ShaderMaterial({
  vertexShader: `
        attribute vec3 offset;
        attribute float scale;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
            vColor = color;
            vec3 pos = position * scale + offset;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
  fragmentShader: `
        varying vec3 vColor;
        
        void main() {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

---
title: HTML 进阶知识
sidebar_position: 2
---

# HTML 进阶知识

## 1. HTML5 高级特性

### Canvas 绘图

Canvas 提供了一个通过 JavaScript 绘制 2D 图形的方法。

```html
<canvas id="myCanvas" width="400" height="200"></canvas>

<script>
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  // 绘制矩形
  ctx.fillStyle = "#FF0000";
  ctx.fillRect(10, 10, 150, 80);

  // 绘制文字
  ctx.font = "30px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Hello Canvas", 170, 50);

  // 绘制线条
  ctx.beginPath();
  ctx.moveTo(10, 120);
  ctx.lineTo(380, 120);
  ctx.stroke();

  // 绘制圆形
  ctx.beginPath();
  ctx.arc(200, 150, 40, 0, 2 * Math.PI);
  ctx.fillStyle = "#0000FF";
  ctx.fill();
  ctx.stroke();
</script>
```

### SVG 矢量图形

SVG（可缩放矢量图形）是基于 XML 的矢量图形格式，可以无损缩放。

```html
<svg width="400" height="200">
  <!-- 矩形 -->
  <rect
    x="10"
    y="10"
    width="150"
    height="80"
    style="fill:rgb(255,0,0);stroke:black;stroke-width:2"
  />

  <!-- 圆形 -->
  <circle
    cx="200"
    cy="150"
    r="40"
    style="fill:blue;stroke:black;stroke-width:2"
  />

  <!-- 文本 -->
  <text x="170" y="50" font-family="Arial" font-size="30" fill="black">
    Hello SVG
  </text>

  <!-- 线条 -->
  <line
    x1="10"
    y1="120"
    x2="380"
    y2="120"
    style="stroke:black;stroke-width:2"
  />

  <!-- 多边形 -->
  <polygon
    points="300,10 350,90 250,90"
    style="fill:green;stroke:black;stroke-width:2"
  />
</svg>
```

### 地理定位 API

HTML5 Geolocation API 允许获取用户的地理位置。

```html
<button onclick="getLocation()">获取位置</button>
<p id="demo"></p>

<script>
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      document.getElementById("demo").innerHTML = "浏览器不支持地理定位。";
    }
  }

  function showPosition(position) {
    document.getElementById("demo").innerHTML =
      "纬度: " +
      position.coords.latitude +
      "<br>经度: " +
      position.coords.longitude;
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        document.getElementById("demo").innerHTML = "用户拒绝了地理位置请求。";
        break;
      case error.POSITION_UNAVAILABLE:
        document.getElementById("demo").innerHTML = "位置信息不可用。";
        break;
      case error.TIMEOUT:
        document.getElementById("demo").innerHTML = "获取用户位置请求超时。";
        break;
      case error.UNKNOWN_ERROR:
        document.getElementById("demo").innerHTML = "发生未知错误。";
        break;
    }
  }
</script>
```

### 拖放 API

HTML5 拖放（Drag and Drop）API 使元素可拖动。

```html
<style>
  #div1 {
    width: 300px;
    height: 100px;
    padding: 10px;
    border: 1px solid black;
  }
  #drag1 {
    width: 100px;
    height: 50px;
    padding: 5px;
    background-color: #f1f1f1;
  }
</style>

<div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)">
  <p id="drag1" draggable="true" ondragstart="drag(event)">拖动我!</p>
</div>

<script>
  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }
</script>
```

### Web Storage API

HTML5 提供了两种客户端存储数据的方法：

```html
<script>
  // localStorage - 没有过期时间的数据存储
  function saveLocal() {
    localStorage.setItem("username", "张三");
    localStorage.setItem(
      "preference",
      JSON.stringify({ theme: "dark", fontSize: "large" })
    );
  }

  function getLocal() {
    const username = localStorage.getItem("username");
    const preference = JSON.parse(localStorage.getItem("preference"));
    console.log(username, preference);
  }

  // sessionStorage - 仅在当前会话有效的数据存储
  function saveSession() {
    sessionStorage.setItem("tempData", "临时数据");
  }

  function getSession() {
    const data = sessionStorage.getItem("tempData");
    console.log(data);
  }

  // 移除数据
  function removeData() {
    localStorage.removeItem("username");
    sessionStorage.removeItem("tempData");
  }

  // 清空所有数据
  function clearAll() {
    localStorage.clear();
    sessionStorage.clear();
  }
</script>
```

### Web Workers API

Web Workers 允许在后台线程中运行 JavaScript，不干扰用户界面。

```html
<button onclick="startWorker()">启动 Worker</button>
<button onclick="stopWorker()">停止 Worker</button>
<p id="result"></p>

<script>
  let worker;

  function startWorker() {
    if (typeof Worker !== "undefined") {
      if (typeof worker == "undefined") {
        worker = new Worker("worker.js");
      }
      worker.onmessage = function (event) {
        document.getElementById("result").innerHTML = event.data;
      };
    } else {
      document.getElementById("result").innerHTML =
        "您的浏览器不支持 Web Workers";
    }
  }

  function stopWorker() {
    if (worker) {
      worker.terminate();
      worker = undefined;
    }
  }
</script>
```

worker.js 文件内容：

```javascript
let i = 0;

function timedCount() {
  i++;
  postMessage(i);
  setTimeout("timedCount()", 500);
}

timedCount();
```

## 2. 响应式网页设计

### 视口设置

```html
<!-- 响应式设计视口设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### 媒体查询

```html
<style>
  /* 桌面端样式 */
  @media screen and (min-width: 992px) {
    body {
      background-color: lightblue;
      font-size: 16px;
    }
  }

  /* 平板电脑样式 */
  @media screen and (min-width: 768px) and (max-width: 991px) {
    body {
      background-color: lightgreen;
      font-size: 14px;
    }
  }

  /* 手机样式 */
  @media screen and (max-width: 767px) {
    body {
      background-color: lightpink;
      font-size: 12px;
    }
  }
</style>
```

### 响应式图像

```html
<!-- 使用 srcset 属性 -->
<img
  src="img-small.jpg"
  srcset="img-small.jpg 480w, img-medium.jpg 800w, img-large.jpg 1200w"
  sizes="(max-width: 600px) 480px,
            (max-width: 1000px) 800px,
            1200px"
  alt="响应式图像"
/>

<!-- 使用 picture 元素 -->
<picture>
  <source media="(min-width: 1200px)" srcset="img-large.jpg" />
  <source media="(min-width: 768px)" srcset="img-medium.jpg" />
  <img src="img-small.jpg" alt="响应式图像" />
</picture>

<!-- 使用百分比宽度 -->
<img src="image.jpg" style="width:100%; max-width:500px;" alt="响应式图像" />
```

### 流式网格布局

```html
<style>
  .row::after {
    content: "";
    clear: both;
    display: table;
  }

  .col {
    float: left;
    padding: 15px;
  }

  /* 适用于所有设备 */
  .col-1 {
    width: 8.33%;
  }
  .col-2 {
    width: 16.66%;
  }
  .col-3 {
    width: 25%;
  }
  .col-4 {
    width: 33.33%;
  }
  .col-5 {
    width: 41.66%;
  }
  .col-6 {
    width: 50%;
  }
  .col-7 {
    width: 58.33%;
  }
  .col-8 {
    width: 66.66%;
  }
  .col-9 {
    width: 75%;
  }
  .col-10 {
    width: 83.33%;
  }
  .col-11 {
    width: 91.66%;
  }
  .col-12 {
    width: 100%;
  }

  /* 中小屏幕设备 */
  @media screen and (max-width: 768px) {
    .col {
      width: 100%;
    }
  }
</style>

<div class="row">
  <div class="col col-4">列 1</div>
  <div class="col col-4">列 2</div>
  <div class="col col-4">列 3</div>
</div>
```

## 3. 高级表单技术

### 自定义验证

```html
<form id="myForm">
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required />

  <label for="password">密码:</label>
  <input
    type="password"
    id="password"
    name="password"
    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
    title="密码必须包含至少一个数字、一个小写字母、一个大写字母，长度至少8个字符"
  />

  <label for="phone">电话号码:</label>
  <input type="tel" id="phone" name="phone" />

  <button type="submit">提交</button>
</form>

<script>
  document.getElementById("myForm").addEventListener("submit", function (e) {
    const phoneInput = document.getElementById("phone");
    const phoneValue = phoneInput.value;
    const phonePattern = /^1[3-9]\d{9}$/;

    if (!phonePattern.test(phoneValue)) {
      e.preventDefault();
      alert("请输入正确的手机号码");
      phoneInput.focus();
    }
  });
</script>
```

### 表单元素状态和样式

```html
<style>
  /* 有效状态 */
  input:valid {
    border: 2px solid green;
  }

  /* 无效状态 */
  input:invalid {
    border: 2px solid red;
  }

  /* 必填字段 */
  input:required {
    background-color: #ffffcc;
  }

  /* 只读字段 */
  input:read-only {
    background-color: #f0f0f0;
  }

  /* 禁用字段 */
  input:disabled {
    opacity: 0.5;
  }

  /* 获得焦点时 */
  input:focus {
    outline: 3px solid #5b9dd9;
  }

  /* 鼠标悬停时 */
  input:hover {
    background-color: #f5f5f5;
  }
</style>

<form>
  <input type="text" required placeholder="必填字段" />
  <input type="email" placeholder="电子邮件" />
  <input type="text" readonly value="只读字段" />
  <input type="text" disabled value="禁用字段" />
</form>
```

### 自定义表单控件

```html
<style>
  /* 自定义复选框 */
  .custom-checkbox {
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    user-select: none;
  }

  .custom-checkbox input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
  }

  .custom-checkbox:hover input ~ .checkmark {
    background-color: #ccc;
  }

  .custom-checkbox input:checked ~ .checkmark {
    background-color: #2196f3;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  .custom-checkbox input:checked ~ .checkmark:after {
    display: block;
  }

  .custom-checkbox .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
</style>

<label class="custom-checkbox"
  >自定义复选框
  <input type="checkbox" />
  <span class="checkmark"></span>
</label>
```

### 表单数据处理

```html
<form id="userForm">
  <input type="text" name="name" placeholder="姓名" />
  <input type="email" name="email" placeholder="电子邮件" />
  <select name="role">
    <option value="admin">管理员</option>
    <option value="user">普通用户</option>
  </select>
  <button type="submit">提交</button>
</form>

<script>
  document.getElementById("userForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // 方法1：手动获取表单数据
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const role = document.querySelector('select[name="role"]').value;

    console.log({ name, email, role });

    // 方法2：使用 FormData API
    const formData = new FormData(this);
    for (let [key, value] of formData.entries()) {
      console.log(key + ": " + value);
    }

    // 方法3：使用 Object.fromEntries (现代浏览器)
    const formDataObject = Object.fromEntries(formData);
    console.log(formDataObject);

    // 发送数据到服务器
    fetch("/submit-form", {
      method: "POST",
      body: formData,
      // 或者发送 JSON:
      // headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(formDataObject)
    })
      .then((response) => response.json())
      .then((data) => console.log("成功:", data))
      .catch((error) => console.error("错误:", error));
  });
</script>
```

## 4. 网页无障碍访问 (Accessibility)

### ARIA 角色和属性

ARIA（Accessible Rich Internet Applications）是一组用于增强网页可访问性的属性。

```html
<!-- 使用 ARIA 角色 -->
<div role="navigation">
  <ul>
    <li><a href="#">首页</a></li>
    <li><a href="#">关于</a></li>
    <li><a href="#">联系</a></li>
  </ul>
</div>

<div role="main">
  <h1>网页标题</h1>
  <p>内容...</p>
</div>

<div role="complementary">
  <h2>侧边栏</h2>
  <p>附加内容...</p>
</div>

<!-- 使用 ARIA 属性 -->
<button aria-expanded="false" aria-controls="panel1">展开面板</button>
<div id="panel1" aria-hidden="true">面板内容...</div>

<!-- ARIA 标签 -->
<input type="text" aria-label="搜索" aria-describedby="search-hint" />
<div id="search-hint">输入关键词进行搜索</div>

<!-- 表格中的 ARIA 属性 -->
<table role="grid">
  <caption>
    用户数据
  </caption>
  <tr role="row">
    <th role="columnheader">姓名</th>
    <th role="columnheader">电子邮件</th>
  </tr>
  <tr role="row">
    <td role="cell">张三</td>
    <td role="cell">zhangsan@example.com</td>
  </tr>
</table>
```

### 键盘导航

```html
<!-- 使用正确的标签和 tabindex -->
<div class="navigation">
  <!-- 自然获得焦点的元素, tabindex 默认为 0 -->
  <a href="#section1">第一部分</a>
  <a href="#section2">第二部分</a>

  <!-- 使非标准元素获得焦点 -->
  <div
    tabindex="0"
    role="button"
    onclick="openMenu()"
    onkeydown="handleKeyDown(event)"
  >
    打开菜单
  </div>

  <!-- 在 Tab 顺序中排在前面 -->
  <button tabindex="1">重要操作</button>

  <!-- 从 Tab 顺序中移除 -->
  <button tabindex="-1">不重要的操作</button>
</div>

<script>
  function handleKeyDown(event) {
    // 当按下回车键或空格键时模拟点击
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.target.click();
    }
  }
</script>
```

### 跳过导航链接

```html
<style>
  .skip-link {
    position: absolute;
    left: -9999px;
    top: -9999px;
  }
  .skip-link:focus {
    left: 0;
    top: 0;
    background: #fff;
    padding: 10px;
    z-index: 1000;
  }
</style>

<a href="#main-content" class="skip-link">跳过导航</a>

<header>
  <!-- 导航菜单 -->
  <nav>
    <ul>
      <li><a href="#">首页</a></li>
      <li><a href="#">产品</a></li>
      <li><a href="#">关于我们</a></li>
    </ul>
  </nav>
</header>

<main id="main-content">
  <h1>主要内容</h1>
  <!-- 网页主要内容 -->
</main>
```

### 图像的替代文本

```html
<!-- 有意义的图片需要替代文本 -->
<img src="logo.png" alt="公司徽标" />

<!-- 复杂图像需要更详细的描述 -->
<figure>
  <img src="chart.png" alt="2020年季度销售数据图表" />
  <figcaption>图1: 2020年各季度销售数据对比，显示第三季度销售额最高</figcaption>
</figure>

<!-- 装饰性图片可以使用空 alt 属性 -->
<img src="decorative-line.png" alt="" />

<!-- 或者使用 CSS 背景图 -->
<div class="decorative-image"></div>
```

### 色彩和对比度

```html
<style>
  /* 确保足够的对比度 */
  .good-contrast {
    color: #000000; /* 黑色文本 */
    background-color: #ffffff; /* 白色背景 */
  }

  /* 不仅依赖颜色传达信息 */
  .error-message {
    color: #ff0000; /* 红色 */
    background: url("error-icon.png") no-repeat left center;
    padding-left: 20px;
  }

  .success-message {
    color: #008000; /* 绿色 */
    background: url("success-icon.png") no-repeat left center;
    padding-left: 20px;
  }
</style>

<p class="good-contrast">这段文本具有良好的对比度</p>

<p class="error-message">提交时出现错误</p>
<p class="success-message">操作成功完成</p>
```

## 5. 多媒体高级特性

### 视频控制 API

```html
<video id="myVideo" width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4" />
  <track src="subtitles_en.vtt" kind="subtitles" srclang="en" label="English" />
  <track src="subtitles_zh.vtt" kind="subtitles" srclang="zh" label="中文" />
  您的浏览器不支持 video 标签。
</video>

<div class="custom-controls">
  <button onclick="playPause()">播放/暂停</button>
  <button onclick="skip(-10)">后退 10 秒</button>
  <button onclick="skip(10)">前进 10 秒</button>
  <button onclick="setVolume(0.2)">音量 20%</button>
  <button onclick="setVolume(1)">音量 100%</button>
  <button onclick="toggleMute()">静音</button>
</div>

<script>
  const video = document.getElementById("myVideo");

  function playPause() {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function skip(seconds) {
    video.currentTime += seconds;
  }

  function setVolume(volume) {
    video.volume = volume;
  }

  function toggleMute() {
    video.muted = !video.muted;
  }

  // 监听视频事件
  video.addEventListener("play", function () {
    console.log("视频开始播放");
  });

  video.addEventListener("pause", function () {
    console.log("视频已暂停");
  });

  video.addEventListener("ended", function () {
    console.log("视频已结束");
    // 可以执行结束后的操作
  });

  video.addEventListener("timeupdate", function () {
    // 更新进度条或显示当前时间
    console.log("当前时间: " + video.currentTime);
  });
</script>
```

### WebVTT 字幕

WebVTT (Web Video Text Tracks) 格式用于创建视频字幕。

subtitles_zh.vtt 文件内容示例：

```
WEBVTT

00:00:01.000 --> 00:00:04.000
大家好，欢迎观看这个视频。

00:00:05.000 --> 00:00:09.000
今天我们将学习 HTML5 的高级特性。

00:00:10.000 --> 00:00:15.000
首先，让我们了解一下 Canvas 和 SVG。
```

### 音频可视化

```html
<audio id="myAudio" controls>
  <source src="audio.mp3" type="audio/mpeg" />
  您的浏览器不支持 audio 元素
</audio>

<canvas id="audioVisual" width="500" height="200"></canvas>

<script>
  const audio = document.getElementById("myAudio");
  const canvas = document.getElementById("audioVisual");
  const ctx = canvas.getContext("2d");

  // 设置音频上下文
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  const source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  // 获取数据
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // 绘制函数
  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;

      ctx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
      ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  audio.addEventListener("play", function () {
    audioContext.resume().then(() => draw());
  });
</script>
```

### 媒体捕获 API

```html
<video id="videoPreview" autoplay muted></video>
<button id="startCamera">开启摄像头</button>
<button id="takePhoto">拍照</button>
<canvas id="photoCanvas" width="320" height="240"></canvas>

<script>
  const videoPreview = document.getElementById("videoPreview");
  const startCamera = document.getElementById("startCamera");
  const takePhoto = document.getElementById("takePhoto");
  const photoCanvas = document.getElementById("photoCanvas");
  const ctx = photoCanvas.getContext("2d");
  let stream;

  startCamera.addEventListener("click", async function () {
    try {
      // 请求摄像头访问权限
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      // 将视频流设置为视频元素的源
      videoPreview.srcObject = stream;
    } catch (err) {
      console.error("摄像头访问失败:", err);
    }
  });

  takePhoto.addEventListener("click", function () {
    // 在画布上绘制当前视频帧
    ctx.drawImage(videoPreview, 0, 0, photoCanvas.width, photoCanvas.height);

    // 获取图像数据
    const imageData = photoCanvas.toDataURL("image/png");

    // 可以保存、显示或上传图像
    console.log("图片已捕获！");

    // 创建下载链接示例
    const link = document.createElement("a");
    link.href = imageData;
    link.download = "photo.png";
    link.textContent = "下载照片";
    document.body.appendChild(link);
  });
</script>
```

## 6. iframe 高级用法

### 安全增强

```html
<!-- 基本安全设置 -->
<iframe
  src="https://example.com"
  sandbox="allow-scripts allow-same-origin"
  referrerpolicy="no-referrer"
  loading="lazy"
>
</iframe>

<!-- 完整的安全设置 -->
<iframe
  src="https://trusted-site.com"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
  referrerpolicy="strict-origin"
  allow="camera 'none'; microphone 'none'; geolocation 'none'"
  csp="default-src 'self'"
  loading="lazy"
  title="可信站点内容"
  width="600"
  height="400"
>
  您的浏览器不支持 iframe 元素。
</iframe>
```

### iframe 通信

**父页面代码：**

```html
<iframe id="childFrame" src="child.html"></iframe>

<script>
  // 向子页面发送消息
  function sendMessageToChild() {
    const frame = document.getElementById("childFrame");
    frame.contentWindow.postMessage(
      {
        type: "parentMessage",
        data: "Hello from parent page!",
      },
      "*"
    ); // 在生产环境中，使用具体的目标源而不是 '*'
  }

  // 接收来自子页面的消息
  window.addEventListener("message", function (event) {
    // 确保消息来源安全
    if (event.origin !== "https://trusted-child-domain.com") {
      return;
    }

    console.log("收到来自子页面的消息:", event.data);

    // 根据消息类型处理
    if (event.data.type === "childMessage") {
      // 处理子页面消息
    }
  });

  // 在页面加载完成后发送消息
  window.onload = function () {
    setTimeout(sendMessageToChild, 1000);
  };
</script>
```

**子页面代码 (child.html)：**

```html
<script>
  // 接收来自父页面的消息
  window.addEventListener("message", function (event) {
    // 确保消息来源安全
    if (event.origin !== "https://trusted-parent-domain.com") {
      return;
    }

    console.log("收到来自父页面的消息:", event.data);

    // 回复父页面
    if (event.data.type === "parentMessage") {
      window.parent.postMessage(
        {
          type: "childMessage",
          data: "Hello from child frame!",
        },
        event.origin
      );
    }
  });
</script>
```

### Channel Messaging API

```html
<!-- 页面 A -->
<script>
  // 创建新的 MessageChannel
  const channel = new MessageChannel();
  const port1 = channel.port1;

  // 设置接收消息处理程序
  port1.onmessage = function (event) {
    console.log("页面 A 收到消息:", event.data);
  };

  // 假设我们有一个 iframe 并等待它加载
  const iframe = document.getElementById("pageB");
  iframe.addEventListener("load", function () {
    // 将 port2 发送到 iframe, 以便在页面之间建立通信通道
    iframe.contentWindow.postMessage("初始化通道", "https://trusted-site.com", [
      channel.port2,
    ]);

    // 现在可以使用 port1 发送消息
    port1.postMessage("Hello from page A!");
  });
</script>
```

```html
<!-- 页面 B (iframe 内) -->
<script>
  // 接收 port2
  window.addEventListener("message", function (event) {
    // 确保消息来源安全
    if (event.origin !== "https://main-site.com") {
      return;
    }

    if (event.data === "初始化通道") {
      const port = event.ports[0];

      // 设置端口消息处理程序
      port.onmessage = function (e) {
        console.log("页面 B 收到消息:", e.data);

        // 回复
        port.postMessage("Hello from page B!");
      };
    }
  });
</script>
```

## 7. 文件和二进制数据处理

### 文件 API

```html
<input type="file" id="fileInput" multiple />
<div id="fileInfo"></div>
<img id="preview" style="max-width: 300px; display: none;" />

<script>
  document
    .getElementById("fileInput")
    .addEventListener("change", function (event) {
      const files = event.target.files;
      const fileInfo = document.getElementById("fileInfo");
      const preview = document.getElementById("preview");

      fileInfo.innerHTML = "";

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 显示文件信息
        const fileDetails = document.createElement("p");
        fileDetails.textContent = `文件名: ${file.name}, 大小: ${formatFileSize(
          file.size
        )}, 类型: ${file.type}`;
        fileInfo.appendChild(fileDetails);

        // 如果是图片，显示预览
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();

          reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
          };

          reader.readAsDataURL(file);
        }
      }
    });

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + " bytes";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
  }
</script>
```

### Blob 和 ArrayBuffer

```html
<button id="createBlob">创建并下载文本文件</button>
<button id="createImage">创建并下载图片</button>

<script>
  // 创建和下载文本文件
  document.getElementById("createBlob").addEventListener("click", function () {
    // 创建文本内容
    const content = "这是一个使用 Blob API 创建的文本文件内容。\n";

    // 创建 Blob
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });

    // 创建下载链接
    downloadFile(blob, "example.txt");
  });

  // 创建和下载图片
  document
    .getElementById("createImage")
    .addEventListener("click", async function () {
      // 创建一个简单的画布图像
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 100;

      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = "green";
      ctx.fillRect(100, 0, 100, 100);

      // 转换为 Blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png");
      });

      // 下载图片
      downloadFile(blob, "image.png");
    });

  function downloadFile(blob, fileName) {
    // 创建对象 URL
    const url = URL.createObjectURL(blob);

    // 创建下载链接
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;

    // 添加到文档中并点击触发下载
    document.body.appendChild(a);
    a.click();

    // 清理
    setTimeout(function () {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }
</script>
```

### 拖放文件上传

```html
<style>
  .drop-zone {
    width: 300px;
    height: 200px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 20px;
    text-align: center;
    margin: 20px 0;
    transition: all 0.3s;
  }

  .drop-zone.active {
    border-color: #2196f3;
    background-color: #e3f2fd;
  }

  .file-list {
    margin-top: 20px;
  }
</style>

<div id="dropZone" class="drop-zone">
  <p>将文件拖放到这里上传</p>
  <p>或</p>
  <input type="file" id="fileInput" multiple style="display: none;" />
  <button id="selectFiles">选择文件</button>
</div>

<div id="fileList" class="file-list"></div>

<script>
  const dropZone = document.getElementById("dropZone");
  const fileInput = document.getElementById("fileInput");
  const fileList = document.getElementById("fileList");

  // 点击选择文件按钮
  document.getElementById("selectFiles").addEventListener("click", function () {
    fileInput.click();
  });

  // 处理选择的文件
  fileInput.addEventListener("change", function () {
    handleFiles(this.files);
  });

  // 拖放功能
  dropZone.addEventListener("dragover", function (e) {
    e.preventDefault();
    dropZone.classList.add("active");
  });

  dropZone.addEventListener("dragleave", function () {
    dropZone.classList.remove("active");
  });

  dropZone.addEventListener("drop", function (e) {
    e.preventDefault();
    dropZone.classList.remove("active");

    handleFiles(e.dataTransfer.files);
  });

  function handleFiles(files) {
    fileList.innerHTML = "";

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // 创建文件项
      const fileItem = document.createElement("div");
      fileItem.innerHTML = `
                <strong>${file.name}</strong> (${formatFileSize(file.size)})
                <div class="progress-bar"></div>
            `;
      fileList.appendChild(fileItem);

      // 在这里可以添加上传处理代码
      // 例如使用 Fetch API 或 XMLHttpRequest 发送文件到服务器
    }
  }

  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + " bytes";
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    } else {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
  }

  // 模拟上传文件
  function uploadFile(file) {
    // 创建 FormData
    const formData = new FormData();
    formData.append("file", file);

    // 使用 Fetch API 上传
    fetch("/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("上传成功:", data);
      })
      .catch((error) => {
        console.error("上传错误:", error);
      });
  }
</script>
```

## 9. Performance Optimization（性能优化）

### 关键渲染路径优化

```html
<!-- 优化 CSS 加载 -->
<link rel="preload" href="critical.css" as="style" />
<link rel="stylesheet" href="critical.css" />
<link
  rel="stylesheet"
  href="non-critical.css"
  media="print"
  onload="this.media='all'"
/>

<!-- 优化脚本加载 -->
<script src="analytics.js" async></script>
<script src="non-critical.js" defer></script>

<!-- 预加载关键资源 -->
<link rel="preload" href="hero-image.jpg" as="image" />
<link rel="preconnect" href="https://api.example.com" />
<link rel="dns-prefetch" href="https://cdn.example.com" />
```

### 图像优化

```html
<!-- 使用现代图像格式 -->
<picture>
  <source type="image/webp" srcset="image.webp" />
  <source type="image/jp2" srcset="image.jp2" />
  <img src="image.jpg" alt="优化的图像" loading="lazy" decoding="async" />
</picture>

<!-- 响应式图像和艺术指导 -->
<picture>
  <source
    media="(min-width: 800px)"
    sizes="80vw"
    srcset="hero-large.jpg 1024w, hero-medium.jpg 640w, hero-small.jpg 320w"
  />
  <source
    media="(min-width: 400px)"
    sizes="100vw"
    srcset="hero-mobile-large.jpg 640w, hero-mobile-small.jpg 320w"
  />
  <img src="hero-fallback.jpg" alt="响应式图像" />
</picture>
```

### 资源提示

```html
<!-- 预先获取可能需要的资源 -->
<link rel="prefetch" href="/next-page.html" />
<link rel="prerender" href="/likely-next-page.html" />

<!-- 模块预加载 -->
<link rel="modulepreload" href="/components/feature.js" />
```

## 10. Security Best Practices（安全最佳实践）

### 内容安全策略 (CSP)

```html
<!-- 基本 CSP 配置 -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' https://trusted.cdn.com;
  style-src 'self' 'unsafe-inline' https://trusted.cdn.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  form-action 'self';
"
/>

<!-- 报告模式 -->
<meta
  http-equiv="Content-Security-Policy-Report-Only"
  content="
  default-src 'self';
  report-uri https://csp-report.example.com/collector
"
/>
```

### 防止 XSS 和注入攻击

```html
<!-- 输出编码 -->
<div id="userContent"></div>
<script>
  function displayUserContent(content) {
    const div = document.getElementById("userContent");
    div.textContent = content; // 安全的文本插入
    // 不要使用 innerHTML
  }
</script>

<!-- 安全的 iframe 配置 -->
<iframe
  src="https://trusted-site.com"
  sandbox="allow-scripts allow-same-origin"
  referrerpolicy="no-referrer"
  allow="camera 'none'; microphone 'none'"
></iframe>
```

### CORS 和资源隔离

```html
<!-- 跨域资源共享 -->
<img src="https://trusted-cdn.com/image.jpg" crossorigin="anonymous" />
<script
  src="https://api.example.com/script.js"
  crossorigin="use-credentials"
></script>

<!-- 资源隔离 -->
<link
  rel="stylesheet"
  href="styles.css"
  integrity="sha384-..."
  crossorigin="anonymous"
/>
<script src="script.js" integrity="sha384-..." crossorigin="anonymous"></script>
```

## 11. Progressive Web Apps（渐进式网页应用）

### Web App Manifest

```html
<!-- Web App Manifest -->
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#4285f4" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />

<!-- iOS 特定元标签 -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="apple-mobile-web-app-title" content="我的 PWA" />
```

### 离线功能

```html
<!-- 离线页面 -->
<html lang="zh-CN" offline>
  <head>
    <link rel="stylesheet" href="/styles/offline.css" />
  </head>
  <body>
    <!-- 检测在线状态 -->
    <div id="offline-status"></div>
    <script>
      window.addEventListener("online", updateOnlineStatus);
      window.addEventListener("offline", updateOnlineStatus);

      function updateOnlineStatus() {
        const status = navigator.onLine ? "在线" : "离线";
        document.getElementById("offline-status").textContent = status;
      }
    </script>
  </body>
</html>
```

## 12. Microdata and Structured Data（微数据和结构化数据）

### Schema.org 标记

```html
<!-- 文章结构化数据 -->
<article itemscope itemtype="http://schema.org/Article">
  <h1 itemprop="name">文章标题</h1>
  <div itemprop="author" itemscope itemtype="http://schema.org/Person">
    作者：<span itemprop="name">张三</span>
  </div>
  <meta itemprop="datePublished" content="2025-04-24" />
  <div itemprop="articleBody">文章内容...</div>
</article>

<!-- 产品结构化数据 -->
<div itemscope itemtype="http://schema.org/Product">
  <h2 itemprop="name">产品名称</h2>
  <img itemprop="image" src="product.jpg" alt="产品图片" />
  <div itemprop="description">产品描述...</div>
  <div itemprop="offers" itemscope itemtype="http://schema.org/Offer">
    <meta itemprop="priceCurrency" content="CNY" />
    <span itemprop="price">99.00</span>
  </div>
</div>
```

### Open Graph 协议

```html
<!-- Open Graph 标记 -->
<meta property="og:title" content="页面标题" />
<meta property="og:type" content="article" />
<meta property="og:url" content="https://example.com/article" />
<meta property="og:image" content="https://example.com/image.jpg" />
<meta property="og:description" content="页面描述" />
<meta property="og:site_name" content="网站名称" />
```

## 13. Advanced SEO Techniques（高级 SEO 技术）

### 语义化和结构化优化

```html
<!-- 语义化页面结构 -->
<header role="banner">
  <nav role="navigation" aria-label="主导航">
    <!-- 导航内容 -->
  </nav>
</header>

<main role="main">
  <article>
    <h1>主要标题</h1>
    <!-- 使用正确的标题层级 h1-h6 -->
  </article>

  <aside role="complementary">
    <!-- 相关内容 -->
  </aside>
</main>

<footer role="contentinfo">
  <!-- 页脚内容 -->
</footer>
```

### 高级链接优化

```html
<!-- 内部链接优化 -->
<a href="/article" rel="next">下一篇文章</a>
<a href="/category" rel="category">分类页面</a>

<!-- 多语言支持 -->
<link rel="alternate" hreflang="en" href="https://example.com/en/" />
<link rel="alternate" hreflang="zh" href="https://example.com/zh/" />
<link rel="canonical" href="https://example.com/article" />

<!-- 分页优化 -->
<link rel="prev" href="/page/1" />
<link rel="next" href="/page/3" />
```

### 移动端优化

```html
<!-- 响应式视口设置 -->
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, minimum-scale=1.0"
/>
<meta name="format-detection" content="telephone=no" />

<!-- 移动端专用链接 -->
<link rel="amphtml" href="https://example.com/article.amp" />
<link
  rel="alternate"
  media="only screen and (max-width: 640px)"
  href="https://m.example.com/"
/>
```

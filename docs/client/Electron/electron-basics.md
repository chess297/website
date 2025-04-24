---
title: Electron 基础知识
sidebar_position: 1
---

## 1. Electron 简介

Electron 是一个使用 JavaScript、HTML 和 CSS 构建跨平台桌面应用程序的框架。它允许你使用 Web 技术开发桌面应用，并且可以在 Windows、macOS 和 Linux 上运行。

### 1.1 主要特性

- **跨平台**: 支持 Windows、macOS 和 Linux
- **Web 技术**: 使用熟悉的 Web 开发技术栈
- **自动更新**: 内置自动更新支持
- **原生功能**: 访问操作系统原生功能
- **开源社区**: 活跃的开发者社区和丰富的插件生态

### 1.2 架构概述

Electron 应用由以下主要部分组成：

- **主进程**: 管理应用生命周期、系统资源和原生功能
- **渲染进程**: 运行网页界面，处理用户交互
- **IPC 通信**: 主进程和渲染进程之间的通信机制

## 2. 环境搭建

### 2.1 前置要求

- Node.js (推荐 LTS 版本)
- npm 或 yarn 包管理器
- 代码编辑器 (推荐 VS Code)

### 2.2 创建项目

```bash
# 创建新目录
mkdir my-electron-app
cd my-electron-app

# 初始化项目
npm init

# 安装依赖
npm install --save-dev electron
```

### 2.3 基本项目结构

```plaintext
my-electron-app/
├── package.json
├── main.js          # 主进程
├── preload.js       # 预加载脚本
└── index.html       # 渲染进程入口
```

## 3. 主进程开发

### 3.1 基本配置

```javascript
// main.js
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();
});
```

### 3.2 生命周期事件

```javascript
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
```

## 4. 渲染进程开发

### 4.1 HTML 结构

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Electron App</title>
  </head>
  <body>
    <h1>Hello Electron!</h1>
    <div id="info"></div>
    <script src="./renderer.js"></script>
  </body>
</html>
```

### 4.2 预加载脚本

```javascript
// preload.js
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});
```

## 5. IPC 通信

### 5.1 主进程到渲染进程

```javascript
// main.js
const { ipcMain } = require("electron");

ipcMain.on("message-to-main", (event, arg) => {
  console.log(arg); // 打印来自渲染进程的消息
  event.reply("message-from-main", "Hello from main process");
});
```

### 5.2 渲染进程到主进程

```javascript
// renderer.js
window.versions.message.send("Hello from renderer");

window.versions.message.receive((message) => {
  console.log(message); // 打印来自主进程的消息
});
```

## 6. 打包和发布

### 6.1 使用 electron-builder

```bash
# 安装依赖
npm install --save-dev electron-builder

# package.json 配置
{
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "build": {
    "appId": "com.example.app",
    "mac": {
      "category": "public.app-category.utilities"
    },
    "win": {
      "target": "nsis"
    },
    "linux": {
      "target": "AppImage"
    }
  }
}
```

### 6.2 构建命令

```bash
# 打包应用
npm run build

# 针对特定平台打包
npm run build -- --mac
npm run build -- --win
npm run build -- --linux
```

## 7. 调试技巧

### 7.1 主进程调试

- 使用 VS Code 调试配置
- 启用开发者工具：`win.webContents.openDevTools()`

### 7.2 渲染进程调试

- 使用 Chrome DevTools
- 使用 React/Vue DevTools

### 7.3 常见调试命令

```javascript
// 打印进程信息
console.log(process.type); // 'main' 或 'renderer'

// 检查 Electron 版本
console.log(process.versions.electron);

// 监听未捕获的异常
process.on("uncaughtException", (error) => {
  console.error("未捕获的异常:", error);
});
```

## 8. 安全最佳实践

### 8.1 安全配置

```javascript
const win = new BrowserWindow({
  webPreferences: {
    nodeIntegration: false, // 禁用 Node.js 集成
    contextIsolation: true, // 启用上下文隔离
    sandbox: true, // 启用沙箱
    webSecurity: true, // 启用 Web 安全特性
  },
});
```

### 8.2 内容安全策略

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'" />
```

### 8.3 安全检查清单

- 始终使用最新版本的 Electron
- 仅加载本地内容或受信任的远程内容
- 禁用不必要的权限
- 实施内容安全策略
- 处理导航事件
- 验证 WebView 选项

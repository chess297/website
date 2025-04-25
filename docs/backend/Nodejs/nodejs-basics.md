---
title: Node.js 基础知识
sidebar_position: 1
---

# Node.js 基础知识

## 1. Node.js 简介

### 1.1 什么是 Node.js

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，使得 JavaScript 可以在服务器端运行。它采用事件驱动、非阻塞 I/O 模型，使其轻量且高效。

### 1.2 Node.js 特点

- 单线程事件循环
- 非阻塞 I/O
- 模块化系统
- 丰富的内置模块
- npm 包管理器

## 2. 核心概念

### 2.1 事件循环

```javascript
console.log("开始");

setTimeout(() => {
  console.log("定时器");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("结束");
// 输出: 开始 -> 结束 -> Promise -> 定时器
```

### 2.2 回调函数

```javascript
const fs = require("fs");

fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) {
    console.error("读取失败:", err);
    return;
  }
  console.log("文件内容:", data);
});
```

### 2.3 Promise

```javascript
const fs = require("fs").promises;

async function readFileContent() {
  try {
    const data = await fs.readFile("example.txt", "utf8");
    console.log("文件内容:", data);
  } catch (err) {
    console.error("读取失败:", err);
  }
}
```

## 3. 内置模块

### 3.1 文件系统 (fs)

```javascript
const fs = require("fs");

// 同步读取
const content = fs.readFileSync("file.txt", "utf8");

// 异步读取
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### 3.2 HTTP 模块

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World\n");
});

server.listen(3000, () => {
  console.log("服务器运行在 http://localhost:3000/");
});
```

### 3.3 Path 模块

```javascript
const path = require("path");

// 路径拼接
const fullPath = path.join(__dirname, "files", "example.txt");

// 获取文件扩展名
const ext = path.extname("file.txt"); // '.txt'
```

## 4. 包管理

### 4.1 NPM 基础

- package.json 文件结构
- 依赖管理（dependencies vs devDependencies）
- 常用命令（npm install, npm run, npm publish）

### 4.2 常用命令

```bash
# 初始化项目
npm init

# 安装依赖
npm install express

# 安装开发依赖
npm install --save-dev nodemon

# 运行脚本
npm run start
```

## 5. 错误处理

### 5.1 try-catch

```javascript
try {
  const data = JSON.parse(invalidJson);
} catch (err) {
  console.error("解析失败:", err);
}
```

### 5.2 错误事件处理

```javascript
process.on("uncaughtException", (err) => {
  console.error("未捕获的异常:", err);
  // 执行清理操作
  process.exit(1);
});
```

## 6. 调试技巧

### 6.1 使用 console

```javascript
console.log("普通日志");
console.error("错误日志");
console.time("计时器");
// 一些操作
console.timeEnd("计时器");
```

### 6.2 使用调试器

```javascript
// 添加断点
debugger;

// 使用 node --inspect 启动应用
// 在 Chrome DevTools 中调试
```

## 7. 最佳实践

### 7.1 代码组织

- 使用模块化
- 遵循单一职责原则
- 适当的注释和文档

### 7.2 性能优化

- 使用异步操作
- 避免阻塞事件循环
- 合理使用缓存

### 7.3 安全考虑

- 输入验证
- 使用 HTTPS
- 实施访问控制

---
title: Node.js 面试题
sidebar_position: 4
---

# Node.js 面试题

## 1. 基础概念

### Q1: Node.js 是什么？它有哪些特点？

Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境。

主要特点：

- 单线程、非阻塞 I/O
- 事件驱动（Event-Driven）
- 跨平台
- 适合 I/O 密集型应用

### Q2: Node.js 中的事件循环是什么？

事件循环是 Node.js 处理非阻塞 I/O 操作的机制。事件循环包含 6 个阶段：

1. timers
2. pending callbacks
3. idle, prepare
4. poll
5. check
6. close callbacks

示例：

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

console.log("4");

// 输出: 1 -> 4 -> 3 -> 2
```

### Q3: 什么是 Buffer？为什么需要它？

Buffer 是用于处理二进制数据流的类，可以处理图片、文件等二进制数据。

```javascript
// 创建 Buffer
const buf = Buffer.from("Hello World");

// 转换为字符串
console.log(buf.toString()); // Hello World

// 写入 Buffer
const buf2 = Buffer.alloc(5);
buf2.write("Hello");
```

## 2. 核心概念

### Q4: Node.js 如何处理异步操作？

Node.js 提供了多种处理异步操作的方式：

1. 回调函数（Callbacks）：

```javascript
fs.readFile("file.txt", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

2. Promise：

```javascript
const fsPromises = require("fs").promises;

fsPromises
  .readFile("file.txt")
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

3. Async/Await：

```javascript
async function readFile() {
  try {
    const data = await fsPromises.readFile("file.txt");
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

### Q5: 解释 Node.js 中的流（Streams）

流是用于处理数据的抽象接口，分为四种类型：

- Readable: 可读流
- Writable: 可写流
- Duplex: 双向流
- Transform: 转换流

```javascript
const fs = require("fs");

const readStream = fs.createReadStream("input.txt");
const writeStream = fs.createWriteStream("output.txt");

readStream.pipe(writeStream);
```

### Q6: Node.js 中如何实现多进程？

使用 cluster 模块或 child_process 模块：

```javascript
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  // 主进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // 工作进程
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("hello world\n");
    })
    .listen(8000);
}
```

## 3. 高级特性

### Q7: 如何实现 Node.js 应用的性能监控？

可以通过多种方式监控性能：

1. 使用内置工具：

```javascript
console.time("操作");
// 执行操作
console.timeEnd("操作");

// 内存使用情况
console.log(process.memoryUsage());
```

2. 使用 APM 工具：

```javascript
const apm = require("elastic-apm-node").start({
  serviceName: "my-service",
});
```

### Q8: Node.js 中如何处理内存泄漏？

1. 识别内存泄漏：

```javascript
// 使用 heapdump 生成堆快照
const heapdump = require("heapdump");
heapdump.writeSnapshot();
```

2. 常见原因：

- 全局变量
- 闭包
- 事件监听器未移除
- 缓存未清理

### Q9: 如何优化 Node.js 应用的性能？

1. 代码优化：

```javascript
// 使用流处理大文件
const readStream = fs.createReadStream("big.file");
readStream.pipe(response);
```

2. 系统优化：

```javascript
// 调整 Node.js 内存限制
node --max-old-space-size=4096 app.js
```

## 4. 实践问题

### Q10: 如何实现 Node.js 应用的安全防护？

1. 使用安全中间件：

```javascript
const helmet = require("helmet");
app.use(helmet());

const rateLimit = require("express-rate-limit");
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
```

2. 数据验证：

```javascript
const joi = require("joi");

const schema = joi.object({
  username: joi.string().min(3).required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{6,30}$")),
});
```

### Q11: Node.js 中如何处理日志？

使用专业的日志库：

```javascript
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
```

### Q12: 如何实现 Node.js 应用的部署？

1. 使用 PM2：

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "app",
      script: "./app.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
```

2. 使用 Docker：

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 5. 错误处理

### Q13: Node.js 中如何处理未捕获的异常？

1. 进程级别的处理：

```javascript
process.on("uncaughtException", (err) => {
  console.error("未捕获的异常:", err);
  // 清理资源
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("未处理的 Promise 拒绝:", reason);
});
```

2. 域级别的处理：

```javascript
const domain = require("domain");
const d = domain.create();

d.on("error", (err) => {
  console.error("域内错误:", err);
});

d.run(() => {
  // 业务代码
});
```

### Q14: 如何进行错误的传递和处理？

使用 Express 错误处理中间件：

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("服务器错误！");
});
```

## 总结

准备 Node.js 面试时建议：

1. 深入理解事件循环和异步编程
2. 熟练掌握常用模块（fs、http、stream 等）
3. 了解性能优化和安全防护措施
4. 具备实际项目经验
5. 关注 Node.js 生态系统的最新发展

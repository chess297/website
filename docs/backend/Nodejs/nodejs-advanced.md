---
title: Node.js 进阶知识
sidebar_position: 2
---

# Node.js 进阶知识

## 1. 深入事件循环

### 1.1 事件循环阶段

- timers: 执行 setTimeout 和 setInterval 的回调
- pending callbacks: 执行延迟到下一个循环迭代的 I/O 回调
- idle, prepare: 仅系统内部使用
- poll: 检索新的 I/O 事件，执行 I/O 相关的回调
- check: 执行 setImmediate() 的回调
- close callbacks: 执行关闭的回调函数

### 1.2 微任务队列

```javascript
// 示例：事件循环和微任务队列的执行顺序
process.nextTick(() => {
  console.log("1: next tick");
});

Promise.resolve().then(() => {
  console.log("2: promise");
});

setImmediate(() => {
  console.log("3: immediate");
});

setTimeout(() => {
  console.log("4: timeout");
}, 0);

// 输出顺序：1 -> 2 -> 4 -> 3
```

## 2. 流和缓冲区

### 2.1 流的类型

```javascript
const fs = require("fs");

// 可读流
const readStream = fs.createReadStream("input.txt");

// 可写流
const writeStream = fs.createWriteStream("output.txt");

// 双工流
const { Duplex } = require("stream");

// 转换流
const { Transform } = require("stream");
```

### 2.2 流的应用

```javascript
// 文件复制示例
const fs = require("fs");

const readStream = fs.createReadStream("input.txt");
const writeStream = fs.createWriteStream("output.txt");

readStream.pipe(writeStream);

readStream.on("end", () => {
  console.log("复制完成");
});
```

## 3. 多进程和集群

### 3.1 Child Process

```javascript
const { spawn, exec, fork } = require("child_process");

// spawn 示例
const ls = spawn("ls", ["-lh", "/usr"]);

ls.stdout.on("data", (data) => {
  console.log(`输出：${data}`);
});

// exec 示例
exec("node --version", (error, stdout, stderr) => {
  if (error) {
    console.error(`执行错误: ${error}`);
    return;
  }
  console.log(`Node.js 版本: ${stdout}`);
});
```

### 3.2 Cluster 模块

```javascript
const cluster = require("cluster");
const http = require("http");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("你好世界\n");
    })
    .listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```

## 4. 性能优化

### 4.1 内存管理

```javascript
// 内存使用情况
const used = process.memoryUsage();

console.log(`Memory usage: 
  heapTotal: ${used.heapTotal / 1024 / 1024} MB
  heapUsed: ${used.heapUsed / 1024 / 1024} MB
  external: ${used.external / 1024 / 1024} MB`);
```

### 4.2 CPU 分析

```javascript
const profiler = require("v8-profiler-next");
const fs = require("fs");

// CPU 分析示例
profiler.startProfiling("CPU 分析");

setTimeout(() => {
  const profile = profiler.stopProfiling();
  profile
    .export()
    .pipe(fs.createWriteStream("./profile.cpuprofile"))
    .on("finish", () => profile.delete());
}, 30000);
```

## 5. 网络编程

### 5.1 WebSocket

```javascript
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.send("服务器欢迎你！");
});
```

### 5.2 网络安全

```javascript
const https = require("https");
const fs = require("fs");

const options = {
  key: fs.readFileSync("private-key.pem"),
  cert: fs.readFileSync("certificate.pem"),
};

https
  .createServer(options, (req, res) => {
    res.writeHead(200);
    res.end("安全的 hello world\n");
  })
  .listen(443);
```

## 6. 数据库集成

### 6.1 MongoDB

```javascript
const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function main() {
  await client.connect();
  const db = client.db("test");
  const collection = db.collection("users");

  await collection.insertOne({ name: "张三", age: 25 });
  const users = await collection.find({}).toArray();
  console.log(users);
}

main().finally(() => client.close());
```

### 6.2 Redis

```javascript
const Redis = require("ioredis");
const redis = new Redis();

async function cacheExample() {
  // 设置缓存
  await redis.set("key", "value", "EX", 60); // 60秒过期

  // 获取缓存
  const value = await redis.get("key");
  console.log(value);
}
```

## 7. 测试和监控

### 7.1 单元测试

```javascript
const assert = require("assert");
const { add } = require("./math");

describe("数学函数测试", () => {
  it("应该正确相加两个数", () => {
    assert.strictEqual(add(2, 3), 5);
  });
});
```

### 7.2 应用监控

```javascript
const prometheus = require("prom-client");
const register = new prometheus.Registry();

// 创建计数器
const httpRequestCounter = new prometheus.Counter({
  name: "http_requests_total",
  help: "HTTP 请求总数",
  labelNames: ["method", "status"],
});

register.registerMetric(httpRequestCounter);

// 记录请求
app.use((req, res, next) => {
  res.on("finish", () => {
    httpRequestCounter.inc({
      method: req.method,
      status: res.statusCode,
    });
  });
  next();
});
```

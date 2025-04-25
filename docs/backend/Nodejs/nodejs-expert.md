---
title: Node.js 高级知识
sidebar_position: 3
---

# Node.js 高级知识

## 1. V8 引擎深入

### 1.1 垃圾回收机制

Node.js 使用 V8 的分代垃圾回收机制：新生代对象（Scavenge）和老生代对象（Mark-Sweep & Mark-Compact）。

```javascript
// 手动触发垃圾回收（不建议在生产环境使用）
if (global.gc) {
  global.gc();
  console.log(process.memoryUsage());
}

// 使用 node --expose-gc 运行
```

### 1.2 内存泄漏排查

```javascript
const heapdump = require("heapdump");

// 生成堆快照
heapdump.writeSnapshot("./heap-" + Date.now() + ".heapsnapshot");

// 内存泄漏示例
let leaks = [];
function leakMemory() {
  const leak = { date: new Date() };
  leaks.push(leak);
}
setInterval(leakMemory, 1000);
```

## 2. 系统调优

### 2.1 系统限制调整

```javascript
const os = require("os");
const cluster = require("cluster");

// 获取系统信息
console.log({
  cpus: os.cpus().length,
  totalMem: os.totalmem(),
  freeMem: os.freemem(),
  loadavg: os.loadavg(),
});

// 调整文件描述符限制
process.setMaxListeners(0);
require("events").EventEmitter.defaultMaxListeners = 0;
```

### 2.2 Node.js 参数调优

```javascript
// 启动参数示例
/*
node \
  --max-old-space-size=4096 \
  --optimize-for-size \
  --max_semi_space_size=64 \
  --initial_old_space_size=1024 \
  app.js
*/

// 监控内存使用
setInterval(() => {
  const usage = process.memoryUsage();
  console.log(JSON.stringify(usage));
}, 1000);
```

## 3. 微服务架构

### 3.1 服务发现

```javascript
const consul = require("consul")();

// 注册服务
consul.agent.service.register({
  name: "user-service",
  tags: ["v1", "microservice"],
  port: 3000,
  check: {
    http: "http://localhost:3000/health",
    interval: "10s",
  },
});

// 发现服务
consul.catalog.service.nodes("user-service", (err, result) => {
  if (err) throw err;
  console.log("可用服务节点:", result);
});
```

### 3.2 API 网关

```javascript
const express = require("express");
const httpProxy = require("http-proxy");

const app = express();
const proxy = httpProxy.createProxyServer();

// API 路由分发
app.use("/api/users", (req, res) => {
  proxy.web(req, res, { target: "http://user-service:3000" });
});

app.use("/api/orders", (req, res) => {
  proxy.web(req, res, { target: "http://order-service:3001" });
});
```

## 4. 实时通信和流处理

### 4.1 WebSocket 扩展

```javascript
const WebSocket = require("ws");
const Redis = require("ioredis");
const redis = new Redis();

const wss = new WebSocket.Server({ port: 8080 });

// 实现房间功能
const rooms = new Map();

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const { type, room, data } = JSON.parse(message);

    if (type === "join") {
      if (!rooms.has(room)) {
        rooms.set(room, new Set());
      }
      rooms.get(room).add(ws);
    }

    if (type === "message") {
      const roomClients = rooms.get(room);
      if (roomClients) {
        roomClients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ room, data }));
          }
        });
      }
    }
  });
});
```

### 4.2 流处理管道

```javascript
const { Transform } = require("stream");
const through2 = require("through2");

// 自定义转换流
class CustomTransform extends Transform {
  _transform(chunk, encoding, callback) {
    // 数据处理
    const processed = processData(chunk);
    this.push(processed);
    callback();
  }
}

// 流处理管道
sourceStream
  .pipe(new CustomTransform())
  .pipe(
    through2.obj(function (chunk, enc, callback) {
      // 进一步处理
      this.push(chunk);
      callback();
    })
  )
  .pipe(destinationStream);
```

## 5. 安全加固

### 5.1 安全中间件

```javascript
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const csrf = require("csurf");

// 安全中间件配置
app.use(helmet());

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 100个请求
});
app.use("/api/", limiter);

// CSRF 保护
app.use(csrf({ cookie: true }));
```

### 5.2 加密和认证

```javascript
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// 密码加密
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
}

// JWT 认证
const secret = crypto.randomBytes(64).toString("hex");

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, secret, {
    expiresIn: "24h",
  });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid token");
  }
}
```

## 6. 监控和可观测性

### 6.1 APM 集成

```javascript
const apm = require("elastic-apm-node").start({
  serviceName: "my-service",
  serverUrl: "http://localhost:8200",
});

// 性能监控
app.use((req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;

    apm.captureMetric("response_time", duration);
  });

  next();
});
```

### 6.2 日志聚合

```javascript
const winston = require("winston");
const { ElasticsearchTransport } = require("winston-elasticsearch");

// 配置 Winston
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport({
      level: "info",
      index: "logs",
      clientOpts: { node: "http://localhost:9200" },
    }),
  ],
});

// 结构化日志记录
logger.info("API请求", {
  method: "GET",
  path: "/api/users",
  duration: 123,
  status: 200,
});
```

## 7. DevOps 实践

### 7.1 容器化

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000
CMD ["node", "server.js"]
```

### 7.2 持续集成/部署

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "16"
      - run: npm ci
      - run: npm test
      - run: npm run build
      - name: Deploy to Production
        run: |
          # 部署脚本
          echo "Deploying..."
```

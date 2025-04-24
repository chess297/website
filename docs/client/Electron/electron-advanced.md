---
title: Electron 进阶知识
sidebar_position: 2
---

## 1. 多窗口管理

### 1.1 窗口创建和管理

```javascript
const { BrowserWindow } = require("electron");
const windows = new Set();

function createWindow() {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // 创建时先隐藏
  });

  windows.add(win);

  win.loadFile("index.html");
  win.once("ready-to-show", () => {
    win.show(); // 内容加载完成后显示
  });

  win.on("closed", () => {
    windows.delete(win);
    win = null;
  });
}
```

### 1.2 父子窗口

```javascript
const child = new BrowserWindow({
  parent: parentWindow, // 指定父窗口
  modal: true, // 模态窗口
});
```

### 1.3 无边框窗口

```javascript
const win = new BrowserWindow({
  frame: false,
  transparent: true,
  titleBarStyle: "hidden",
});
```

## 2. 系统集成

### 2.1 系统托盘

```javascript
const { Tray, Menu } = require("electron");

function createTray() {
  const tray = new Tray("icon.png");
  const contextMenu = Menu.buildFromTemplate([
    { label: "显示", click: () => win.show() },
    { label: "退出", click: () => app.quit() },
  ]);

  tray.setToolTip("我的应用");
  tray.setContextMenu(contextMenu);
}
```

### 2.2 原生菜单

```javascript
const { Menu } = require("electron");

const template = [
  {
    label: "文件",
    submenu: [
      { label: "新建", accelerator: "CmdOrCtrl+N" },
      { type: "separator" },
      { role: "quit" },
    ],
  },
  {
    label: "编辑",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
```

### 2.3 桌面通知

```javascript
const { Notification } = require("electron");

function showNotification() {
  new Notification({
    title: "新消息",
    body: "您有一条新消息",
    icon: "path/to/icon.png",
  }).show();
}
```

## 3. 数据持久化

### 3.1 本地存储

```javascript
const Store = require("electron-store");

const store = new Store({
  defaults: {
    windowBounds: { width: 800, height: 600 },
    settings: { theme: "light" },
  },
});

// 存储数据
store.set("key", value);

// 读取数据
const value = store.get("key");

// 监听数据变化
store.onDidChange("key", (newValue, oldValue) => {
  console.log("数据已更新:", newValue);
});
```

### 3.2 SQLite 集成

```javascript
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("database.sqlite");

// 创建表
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT
)`);

// 插入数据
db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, [
  "张三",
  "zhangsan@example.com",
]);

// 查询数据
db.all(`SELECT * FROM users`, [], (err, rows) => {
  if (err) throw err;
  console.log(rows);
});
```

## 4. 高级 IPC 通信

### 4.1 异步双向通信

```javascript
// 主进程
ipcMain.handle("async-message", async (event, arg) => {
  const result = await someAsyncOperation(arg);
  return result;
});

// 渲染进程
async function sendMessage() {
  try {
    const response = await window.electron.invoke("async-message", "hello");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

### 4.2 共享数据

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("store", {
  get: (key) => ipcRenderer.invoke("store:get", key),
  set: (key, value) => ipcRenderer.invoke("store:set", key, value),
  onChange: (callback) => ipcRenderer.on("store:change", callback),
});

// main.js
ipcMain.handle("store:get", (event, key) => {
  return store.get(key);
});

ipcMain.handle("store:set", (event, key, value) => {
  store.set(key, value);
  // 通知所有窗口数据变化
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send("store:change", { key, value });
  });
});
```

## 5. 性能优化

### 5.1 窗口性能

```javascript
// 优化窗口创建
{
  backgroundColor: '#fff', // 设置背景色避免白闪
  show: false, // 等待内容加载完成再显示
  webPreferences: {
    nodeIntegration: false,
    contextIsolation: true,
    backgroundThrottling: false // 禁用后台节流
  }
}

// 优化内容加载
win.webContents.once('dom-ready', () => {
  win.show()
})
```

### 5.2 进程通信优化

```javascript
// 批量处理消息
let messageQueue = [];
const BATCH_SIZE = 10;
const FLUSH_INTERVAL = 1000;

function sendBatchMessage() {
  if (messageQueue.length > 0) {
    win.webContents.send("batch-message", messageQueue);
    messageQueue = [];
  }
}

// 定时刷新消息队列
setInterval(sendBatchMessage, FLUSH_INTERVAL);

// 添加消息到队列
function queueMessage(message) {
  messageQueue.push(message);
  if (messageQueue.length >= BATCH_SIZE) {
    sendBatchMessage();
  }
}
```

### 5.3 内存管理

```javascript
// 监控内存使用
function logMemoryUsage() {
  const memory = process.memoryUsage();
  console.log({
    rss: `${Math.round(memory.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)} MB`,
  });
}

// 定期清理内存
function cleanup() {
  if (global.gc) {
    global.gc();
  }
}

// 处理内存泄露
function handleMemoryLeak() {
  // 清除事件监听器
  win.removeAllListeners();
  // 清除定时器
  clearInterval(timer);
  // 关闭数据库连接
  db.close();
}
```

## 6. 自动更新

### 6.1 基本配置

```javascript
const { autoUpdater } = require("electron-updater");

autoUpdater.setFeedURL({
  provider: "generic",
  url: "https://example.com/updates/",
});

// 检查更新
autoUpdater.checkForUpdates();

// 更新事件监听
autoUpdater.on("update-available", (info) => {
  console.log("发现新版本", info.version);
});

autoUpdater.on("update-downloaded", (info) => {
  console.log("更新已下载，将在重启后安装");
  autoUpdater.quitAndInstall();
});
```

### 6.2 增量更新

```javascript
const { autoUpdater } = require("electron-updater");

autoUpdater.autoDownload = false;
autoUpdater.allowDowngrade = false;

autoUpdater.on("update-available", (info) => {
  // 显示更新确认对话框
  dialog
    .showMessageBox({
      type: "info",
      title: "发现新版本",
      message: `发现新版本 ${info.version}，是否更新？`,
      buttons: ["是", "否"],
    })
    .then((result) => {
      if (result.response === 0) {
        autoUpdater.downloadUpdate();
      }
    });
});
```

## 7. 原生模块集成

### 7.1 Node 原生模块

```javascript
const addon = require("./build/Release/addon.node");

// 在主进程中使用
console.log(addon.hello());

// 在渲染进程中通过 preload 脚本使用
contextBridge.exposeInMainWorld("addon", {
  hello: () => addon.hello(),
});
```

### 7.2 系统 API 集成

```javascript
const os = require("os");
const { powerMonitor } = require("electron");

// 监控系统状态
powerMonitor.on("suspend", () => {
  console.log("系统即将休眠");
});

powerMonitor.on("resume", () => {
  console.log("系统已从休眠中恢复");
});

// 获取系统信息
function getSystemInfo() {
  return {
    platform: process.platform,
    arch: process.arch,
    cpus: os.cpus(),
    memory: os.totalmem(),
    freeMemory: os.freemem(),
  };
}
```

## 8. 调试和监控

### 8.1 远程调试

```javascript
app.commandLine.appendSwitch("remote-debugging-port", "9222");

function enableRemoteDebug(win) {
  win.webContents.on("did-finish-load", () => {
    const debuggerUrl = win.webContents.debugger.isAttached()
      ? win.webContents.debugger.getDebuggerUrl()
      : null;
    console.log("Remote debugger URL:", debuggerUrl);
  });
}
```

### 8.2 性能监控

```javascript
const { performance, PerformanceObserver } = require("perf_hooks");

// 监控性能指标
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

obs.observe({ entryTypes: ["measure"] });

// 记录性能指标
performance.mark("A");
// 执行一些操作
performance.mark("B");
performance.measure("操作耗时", "A", "B");
```

### 8.3 崩溃报告

```javascript
const { crashReporter } = require("electron");

// 初始化崩溃报告
crashReporter.start({
  productName: "YourApp",
  companyName: "YourCompany",
  submitURL: "https://your-domain.com/crash-report",
  uploadToServer: true,
});

// 监听崩溃
app.on("renderer-process-crashed", (event, webContents, killed) => {
  console.log("渲染进程崩溃:", killed);
  // 收集崩溃信息并重启应用
});
```

---
title: Electron 高级知识
sidebar_position: 3
---

## 1. 性能优化和架构设计

### 1.1 模块化架构

```javascript
// main/index.js - 主进程入口
const { app } = require("electron");
const MainWindow = require("./windows/main");
const AppTray = require("./tray");
const Store = require("./store");

class Application {
  constructor() {
    this.windows = new Map();
    this.store = new Store();
    this.tray = null;
  }

  async init() {
    await this.store.init();
    this.createMainWindow();
    this.createTray();
    this.registerGlobalShortcuts();
  }

  createMainWindow() {
    const mainWindow = new MainWindow(this);
    this.windows.set("main", mainWindow);
  }

  createTray() {
    this.tray = new AppTray(this);
  }
}

app.whenReady().then(() => {
  const application = new Application();
  application.init();
});
```

### 1.2 进程通信架构

```javascript
// preload/bridge.js
const { contextBridge, ipcRenderer } = require("electron");

// 定义进程间通信规范
const apiSpec = {
  system: {
    getPlatform: () => process.platform,
    getVersion: () => process.versions.electron,
  },
  app: {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    maximize: () => ipcRenderer.invoke("window:maximize"),
    quit: () => ipcRenderer.invoke("app:quit"),
  },
  store: {
    get: (key) => ipcRenderer.invoke("store:get", key),
    set: (key, value) => ipcRenderer.invoke("store:set", key, value),
  },
};

// 通过 contextBridge 暴露 API
contextBridge.exposeInMainWorld("electron", apiSpec);
```

## 2. 安全加固

### 2.1 代码签名与公证

```javascript
// electron-builder.config.js
module.exports = {
  mac: {
    hardenedRuntime: true,
    gatekeeperAssess: false,
    entitlements: "build/entitlements.mac.plist",
    entitlementsInherit: "build/entitlements.mac.plist",
    provisioningProfile: "embedded.provisionprofile",
  },
  win: {
    certificateFile: "certificate.pfx",
    certificatePassword: process.env.CERTIFICATE_PASSWORD,
    signAndEditExecutable: true,
  },
  afterSign: async (context) => {
    // macOS 公证流程
    if (process.platform === "darwin") {
      await require("electron-notarize").notarize({
        appBundleId: "com.example.app",
        appPath: `${context.appOutDir}/${context.packager.appInfo.productFilename}.app`,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
        ascProvider: process.env.APPLE_TEAM_ID,
      });
    }
  },
};
```

### 2.2 内容安全策略

```javascript
// main/security.js
const { session } = require("electron");

function setupContentSecurityPolicy() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' https:;",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
          "style-src 'self' 'unsafe-inline';",
          "img-src 'self' data: https:;",
          "font-src 'self' data:;",
          "connect-src 'self' https:;",
          "media-src 'self';",
        ].join(" "),
      },
    });
  });
}
```

## 3. 进程间通信高级模式

### 3.1 进程通信管理器

```javascript
// main/ipc-manager.js
class IpcManager {
  constructor() {
    this.handlers = new Map();
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  handle(channel, handler) {
    const wrappedHandler = async (event, ...args) => {
      // 执行中间件链
      for (const middleware of this.middlewares) {
        const result = await middleware(event, ...args);
        if (result === false) return;
      }
      return handler(event, ...args);
    };

    this.handlers.set(channel, wrappedHandler);
    ipcMain.handle(channel, wrappedHandler);
  }

  removeHandler(channel) {
    ipcMain.removeHandler(channel);
    this.handlers.delete(channel);
  }
}
```

### 3.2 共享内存和消息队列

```javascript
// main/shared-memory.js
const { app } = require("electron");
const SharedMemory = require("shared-memory-node");

class SharedState {
  constructor() {
    this.shm = new SharedMemory("app-state", 1024);
    this.messageQueue = [];
  }

  setState(key, value) {
    const state = this.shm.get();
    state[key] = value;
    this.shm.set(state);
    this.notifyAll(key, value);
  }

  getState(key) {
    return this.shm.get()[key];
  }

  notifyAll(key, value) {
    const windows = BrowserWindow.getAllWindows();
    windows.forEach((win) => {
      win.webContents.send("state-change", { key, value });
    });
  }
}
```

## 4. 本地系统集成

### 4.1 系统服务集成

```javascript
// main/system-integration.js
const { systemPreferences, powerMonitor } = require("electron");

class SystemIntegration {
  constructor() {
    this.setupPowerMonitor();
    this.setupSystemPreferences();
  }

  setupPowerMonitor() {
    powerMonitor.on("suspend", () => {
      this.onSystemSuspend();
    });

    powerMonitor.on("resume", () => {
      this.onSystemResume();
    });

    powerMonitor.on("on-ac", () => {
      this.onPowerSourceChange("AC");
    });

    powerMonitor.on("on-battery", () => {
      this.onPowerSourceChange("battery");
    });
  }

  setupSystemPreferences() {
    // macOS
    if (process.platform === "darwin") {
      systemPreferences.subscribeNotification(
        "AppleInterfaceThemeChangedNotification",
        () => {
          this.onThemeChange();
        }
      );
    }
  }
}
```

### 4.2 原生模块集成

```javascript
// native/addon.cc
#include <napi.h>

namespace demo {

Napi::Value Method(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  // 实现原生功能
  return Napi::String::New(env, "Native module response");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(
    Napi::String::New(env, "nativeMethod"),
    Napi::Function::New(env, Method)
  );
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)

}
```

## 5. 渲染进程优化

### 5.1 虚拟列表实现

```javascript
// renderer/components/virtual-list.js
class VirtualList {
  constructor(container, itemHeight, totalCount, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalCount = totalCount;
    this.renderItem = renderItem;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
    this.startIndex = 0;
    this.endIndex = this.visibleCount;

    this.init();
  }

  init() {
    this.container.style.height = `${this.totalCount * this.itemHeight}px`;
    this.container.style.position = "relative";
    this.renderVisibleItems();
    this.bindScrollEvent();
  }

  renderVisibleItems() {
    // 清除现有内容
    this.container.innerHTML = "";

    // 渲染可见区域的项
    for (let i = this.startIndex; i < this.endIndex; i++) {
      const item = this.renderItem(i);
      item.style.position = "absolute";
      item.style.top = `${i * this.itemHeight}px`;
      this.container.appendChild(item);
    }
  }

  bindScrollEvent() {
    this.container.addEventListener("scroll", () => {
      const scrollTop = this.container.scrollTop;
      this.startIndex = Math.floor(scrollTop / this.itemHeight);
      this.endIndex = this.startIndex + this.visibleCount;
      this.renderVisibleItems();
    });
  }
}
```

### 5.2 WebWorker 优化

```javascript
// renderer/workers/data-processor.js
self.onmessage = function (e) {
  const { data, type } = e.data;

  switch (type) {
    case "process":
      const result = processLargeData(data);
      self.postMessage({ type: "result", data: result });
      break;

    case "analyze":
      const analysis = analyzeData(data);
      self.postMessage({ type: "analysis", data: analysis });
      break;
  }
};

function processLargeData(data) {
  // 耗时的数据处理逻辑
  return processed;
}

function analyzeData(data) {
  // 复杂的数据分析逻辑
  return analysis;
}
```

## 6. 自动更新高级配置

### 6.1 增量更新实现

```javascript
// main/updater.js
const { autoUpdater } = require("electron-updater");
const isDev = require("electron-is-dev");

class Updater {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.setupAutoUpdater();
  }

  setupAutoUpdater() {
    if (isDev) return;

    autoUpdater.requestHeaders = {
      "Cache-Control": "no-cache",
    };

    autoUpdater.setFeedURL({
      provider: "s3",
      bucket: "updates-bucket",
      region: "us-east-1",
      path: "releases/",
    });

    // 配置差量更新
    autoUpdater.allowDowngrade = false;
    autoUpdater.allowPrerelease = false;
    autoUpdater.currentVersion = app.getVersion();

    this.bindUpdateEvents();
  }

  bindUpdateEvents() {
    autoUpdater.on("checking-for-update", () => {
      this.sendStatusToWindow("正在检查更新...");
    });

    autoUpdater.on("update-available", (info) => {
      this.sendStatusToWindow("发现新版本", info);
    });

    autoUpdater.on("update-not-available", () => {
      this.sendStatusToWindow("当前已是最新版本");
    });

    autoUpdater.on("download-progress", (progress) => {
      this.sendStatusToWindow("下载进度", progress);
    });

    autoUpdater.on("update-downloaded", (info) => {
      this.sendStatusToWindow("更新已下载", info);
      this.promptInstallUpdate();
    });

    autoUpdater.on("error", (err) => {
      this.sendStatusToWindow("更新出错", err);
    });
  }

  promptInstallUpdate() {
    dialog
      .showMessageBox({
        type: "info",
        buttons: ["立即重启", "稍后"],
        title: "安装更新",
        message: "更新已下载完成，需要重启应用以安装",
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall(false, true);
        }
      });
  }
}
```

## 7. 测试和调试

### 7.1 单元测试配置

```javascript
// test/unit/main.spec.js
const { Application } = require("spectron");
const assert = require("assert");
const path = require("path");

describe("Application launch", function () {
  this.timeout(10000);

  beforeEach(async function () {
    this.app = new Application({
      path: electron,
      args: [path.join(__dirname, "..", "..")],
      env: { NODE_ENV: "test" },
    });
    await this.app.start();
  });

  afterEach(async function () {
    if (this.app && this.app.isRunning()) {
      await this.app.stop();
    }
  });

  it("shows main window", async function () {
    const windowCount = await this.app.client.getWindowCount();
    assert.strictEqual(windowCount, 1);
  });

  it("main window is visible", async function () {
    const isVisible = await this.app.browserWindow.isVisible();
    assert.strictEqual(isVisible, true);
  });
});
```

### 7.2 性能分析工具

```javascript
// main/performance.js
const { performance, PerformanceObserver } = require("perf_hooks");

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.setupObserver();
  }

  setupObserver() {
    const obs = new PerformanceObserver((items) => {
      for (const entry of items.getEntries()) {
        this.metrics.set(entry.name, entry.duration);
        this.reportMetric(entry);
      }
    });

    obs.observe({ entryTypes: ["measure"], buffered: true });
  }

  startMeasure(name) {
    performance.mark(`${name}-start`);
  }

  endMeasure(name) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
  }

  reportMetric(entry) {
    console.log(`Performance Metric - ${entry.name}: ${entry.duration}ms`);
    // 可以将指标发送到监控系统
  }
}
```

## 8. 跨平台适配

### 8.1 平台特定功能

```javascript
// main/platform-features.js
const { app } = require("electron");

class PlatformFeatures {
  constructor() {
    this.platform = process.platform;
  }

  async setupPlatformSpecific() {
    switch (this.platform) {
      case "darwin":
        await this.setupMacOS();
        break;
      case "win32":
        await this.setupWindows();
        break;
      case "linux":
        await this.setupLinux();
        break;
    }
  }

  async setupMacOS() {
    // 设置 Dock 图标和菜单
    if (app.dock) {
      app.dock.setMenu(this.buildDockMenu());
      app.dock.setBadge("");
    }

    // 设置 Touch Bar
    if (process.platform === "darwin") {
      this.setupTouchBar();
    }
  }

  async setupWindows() {
    // Windows 特定功能
    const { JumpList } = require("electron");
    JumpList.setJumpList([
      {
        type: "recent",
        label: "最近打开的文件",
      },
      {
        type: "tasks",
        items: [
          {
            program: process.execPath,
            args: "--new-window",
            title: "新建窗口",
            description: "打开新窗口",
          },
        ],
      },
    ]);
  }

  async setupLinux() {
    // Linux 特定功能
    app.setDesktopName("myapp.desktop");
  }
}
```

### 8.2 平台特定 UI

```javascript
// renderer/platform-ui.js
class PlatformUI {
  constructor() {
    this.platform = process.platform;
    this.init();
  }

  init() {
    document.body.classList.add(`platform-${this.platform}`);
    this.applyPlatformStyles();
    this.setupPlatformComponents();
  }

  applyPlatformStyles() {
    const styles = {
      darwin: {
        titleBarHeight: "28px",
        windowControlsPosition: "left",
      },
      win32: {
        titleBarHeight: "32px",
        windowControlsPosition: "right",
      },
      linux: {
        titleBarHeight: "30px",
        windowControlsPosition: "right",
      },
    };

    const platformStyle = styles[this.platform];
    if (platformStyle) {
      document.documentElement.style.setProperty(
        "--title-bar-height",
        platformStyle.titleBarHeight
      );
      document.documentElement.style.setProperty(
        "--window-controls-position",
        platformStyle.windowControlsPosition
      );
    }
  }

  setupPlatformComponents() {
    if (this.platform === "darwin") {
      this.setupMacControls();
    } else if (this.platform === "win32") {
      this.setupWindowsControls();
    } else {
      this.setupLinuxControls();
    }
  }
}
```

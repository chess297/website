---
title: 微前端进阶知识
sidebar_position: 2
---

# 微前端进阶知识

在基础篇中，我们已经了解了微前端的基本概念和实现方式。本篇将深入探讨微前端的进阶主题，包括微前端通信、应用生命周期管理、状态共享、样式隔离等技术点。

## 1. 微前端应用通信

在微前端架构中，不同子应用之间可能需要进行通信，以下是几种常见的通信方式。

### 1.1 基于 URL 的通信

最简单的通信方式是通过 URL 参数传递数据。

```js
// 发送方：在 URL 中添加参数
const targetUrl = `/app2?data=${encodeURIComponent(JSON.stringify(data))}`;
history.pushState(null, "", targetUrl);

// 接收方：解析 URL 参数
const urlParams = new URLSearchParams(window.location.search);
const data = JSON.parse(decodeURIComponent(urlParams.get("data")));
```

### 1.2 基于自定义事件的通信

使用浏览器原生的自定义事件机制进行通信。

```js
// 发送方：发送自定义事件
window.dispatchEvent(
  new CustomEvent("micro-app-message", {
    detail: { from: "app1", data: { message: "Hello from App1" } },
  })
);

// 接收方：监听自定义事件
window.addEventListener("micro-app-message", (event) => {
  const { from, data } = event.detail;
  console.log(`Received message from ${from}:`, data);
});
```

### 1.3 使用 Props 通信

基于父子关系的微前端可以通过 props 传递数据。

```js
// 主应用传递 props
registerApplication(
  "app1",
  () => import("./app1"),
  (location) => location.pathname.startsWith("/app1"),
  { authToken: "user-token-123", userName: "John" }
);

// 子应用接收 props
export function mount(props) {
  const { authToken, userName } = props;
  console.log(`User ${userName} authenticated with token ${authToken}`);
  return ReactDOM.render(
    <App authToken={authToken} userName={userName} />,
    container
  );
}
```

### 1.4 使用发布-订阅模式

实现一个全局的事件总线，用于不同微前端之间的通信。

```js
// 事件总线实现
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}

// 全局事件总线
window.eventBus = new EventBus();

// 应用1中发布事件
window.eventBus.emit("user-login", { userId: "123", userName: "John" });

// 应用2中订阅事件
window.eventBus.on("user-login", (user) => {
  console.log(`User ${user.userName} logged in`);
});
```

### 1.5 使用共享存储

使用 localStorage、sessionStorage 或 IndexedDB 等存储机制共享数据。

```js
// 应用1中存储数据
localStorage.setItem("user", JSON.stringify({ id: "123", name: "John" }));

// 应用2中读取数据
const user = JSON.parse(localStorage.getItem("user"));

// 监听 storage 事件以响应变化
window.addEventListener("storage", (e) => {
  if (e.key === "user") {
    const newUser = JSON.parse(e.newValue);
    console.log("User updated:", newUser);
  }
});
```

## 2. 微前端应用生命周期管理

在微前端架构中，每个子应用都有自己的生命周期，需要进行合理的管理。

### 2.1 Single-SPA 生命周期钩子

Single-SPA 定义了几个关键的生命周期钩子：

```js
// 子应用需要导出的生命周期钩子
export function bootstrap(props) {
  // 应用初始化
  return Promise.resolve();
}

export function mount(props) {
  // 应用挂载
  return Promise.resolve();
}

export function unmount(props) {
  // 应用卸载
  return Promise.resolve();
}

// 可选的钩子
export function update(props) {
  // 应用更新
  return Promise.resolve();
}
```

### 2.2 qiankun 生命周期钩子

qiankun 在 Single-SPA 的基础上扩展了生命周期钩子：

```js
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子
 */
export async function bootstrap() {
  console.log("react app bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常在这里触发应用的渲染
 */
export async function mount(props) {
  console.log("props from main framework", props);
  ReactDOM.render(
    <App />,
    props.container
      ? props.container.querySelector("#root")
      : document.getElementById("root")
  );
}

/**
 * 应用每次切出/卸载会调用的方法，通常在这里卸载微应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container
      ? props.container.querySelector("#root")
      : document.getElementById("root")
  );
}

/**
 * 可选，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log("update props", props);
}
```

### 2.3 预加载策略

为了提高用户体验，可以实现应用的预加载。

```js
// 使用 qiankun 的预加载功能
import { registerMicroApps, start, prefetchApps } from 'qiankun';

// 注册应用
registerMicroApps([...]);

// 预加载指定的微应用
prefetchApps([
  { name: 'app1', entry: '//localhost:8081' },
  { name: 'app2', entry: '//localhost:8082' },
]);

// 启动
start();
```

也可以实现更细粒度的预加载控制：

```js
// 基于用户行为的预加载
document.querySelector("#app1-link").addEventListener("mouseenter", () => {
  // 当用户鼠标悬停在链接上时，预加载应用
  import("./app1/index.js");
});
```

## 3. 样式隔离

在微前端架构中，不同子应用的样式可能会相互影响，需要进行样式隔离。

### 3.1 BEM 命名约定

使用 BEM（Block Element Modifier）命名规范避免样式冲突。

```css
/* app1 中的样式 */
.app1-header__nav--active {
  color: red;
}

/* app2 中的样式 */
.app2-header__nav--active {
  color: blue;
}
```

### 3.2 CSS Modules

使用 CSS Modules 可以在构建时自动添加唯一的类名。

```js
// App.jsx
import styles from "./App.module.css";

function App() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>Header</header>
    </div>
  );
}
```

```css
/* App.module.css */
.container {
  padding: 20px;
}

.header {
  font-size: 24px;
}
```

编译后:

```html
<div class="App_container_1X7Tk">
  <header class="App_header_2Sf4t">Header</header>
</div>
```

### 3.3 Shadow DOM

使用 Shadow DOM 提供了更强的样式隔离能力。

```js
class MicroApp extends HTMLElement {
  constructor() {
    super();
    // 创建 Shadow DOM
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // 在 Shadow DOM 中渲染应用
    this.shadowRoot.innerHTML = `
      <style>
        .container { padding: 20px; }
        .header { font-size: 24px; }
      </style>
      <div class="container">
        <header class="header">Header</header>
      </div>
    `;
  }
}

customElements.define("micro-app", MicroApp);
```

### 3.4 CSS-in-JS

使用 CSS-in-JS 库如 styled-components 可以生成唯一的类名。

```js
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.header`
  font-size: 24px;
`;

function App() {
  return (
    <Container>
      <Header>Header</Header>
    </Container>
  );
}
```

### 3.5 qiankun 的样式隔离

qiankun 提供了两种样式隔离模式：

```js
// 注册微应用时配置样式隔离
registerMicroApps([
  {
    name: "app1",
    entry: "//localhost:8080",
    container: "#container",
    activeRule: "/app1",
    props: { name: "app1" },
    sandbox: {
      // 实验性：严格样式隔离，会影响性能
      strictStyleIsolation: false,
      // 推荐：添加选择器前缀的方式，性能好
      experimentalStyleIsolation: true,
    },
  },
]);
```

## 4. JavaScript 隔离

在微前端架构中，不同子应用的 JavaScript 变量可能会相互污染，需要进行 JavaScript 隔离。

### 4.1 使用 IIFE（立即执行函数表达式）

将应用代码包装在 IIFE 中，防止全局变量泄露。

```js
(function () {
  // 应用代码
  const privateVar = "app1 private";

  // 只暴露必要的接口
  window.app1 = {
    publicMethod: function () {
      console.log("app1 public method");
    },
  };
})();
```

### 4.2 使用 JavaScript Proxy

使用 Proxy 对全局对象进行代理，实现变量隔离。

```js
function createSandbox() {
  const rawWindow = window;
  const fakeWindow = {};

  // 创建一个代理对象
  const proxy = new Proxy(fakeWindow, {
    // 读取属性
    get(target, prop) {
      // 优先从 fakeWindow 读取
      if (prop in target) {
        return target[prop];
      }
      // 否则从原始 window 对象读取
      return rawWindow[prop];
    },
    // 设置属性
    set(target, prop, value) {
      // 设置属性时只修改 fakeWindow
      target[prop] = value;
      return true;
    },
  });

  return {
    proxy,
    // 清理函数
    cleanup() {
      Object.keys(fakeWindow).forEach((key) => {
        delete fakeWindow[key];
      });
    },
  };
}

// 使用沙箱
const { proxy, cleanup } = createSandbox();

// 在沙箱中执行微前端应用代码
(function (window) {
  window.appName = "App1";
  console.log(window.appName); // App1
})(proxy);

// 验证全局对象未被污染
console.log(window.appName); // undefined

// 清理沙箱
cleanup();
```

### 4.3 qiankun 的沙箱机制

qiankun 提供了多种沙箱机制：

- **快照沙箱（SnapshotSandbox）**：适用于不支持 Proxy 的旧浏览器
- **代理沙箱（ProxySandbox）**：基于 Proxy 实现的沙箱，性能更好
- **遗留沙箱（LegacySandbox）**：兼容模式

```js
// 启动 qiankun 时配置沙箱
start({
  sandbox: {
    strictStyleIsolation: false,
    experimentalStyleIsolation: true,
    // 是否禁用沙箱
    disable: false,
    // 是否使用单实例模式
    loose: false,
    // 需要共享的全局变量
    globals: ["__globalVar"],
  },
});
```

## 5. 状态管理

在微前端架构中，不同子应用可能需要共享状态，以下是几种状态管理的方式。

### 5.1 基于 Redux 的状态管理

使用 Redux 作为全局状态管理。

```js
// 主应用中创建 store
import { createStore } from "redux";

const rootReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const store = createStore(rootReducer);

// 通过 props 传递给子应用
registerApplication(
  "app1",
  () => import("./app1"),
  (location) => location.pathname.startsWith("/app1"),
  { store }
);
```

```js
// 子应用中使用 store
export function mount(props) {
  const { store } = props;

  // 订阅 store 变化
  const unsubscribe = store.subscribe(() => {
    console.log("Store updated:", store.getState());
  });

  // 派发 action
  store.dispatch({
    type: "SET_USER",
    payload: { id: "123", name: "John" },
  });

  // 在卸载时取消订阅
  return () => {
    unsubscribe();
  };
}
```

### 5.2 基于 MobX 的状态管理

使用 MobX 作为全局状态管理。

```js
// 主应用中创建 store
import { observable, action } from "mobx";

class AppStore {
  @observable user = null;

  @action setUser(user) {
    this.user = user;
  }
}

const store = new AppStore();

// 通过 props 传递给子应用
registerApplication(
  "app1",
  () => import("./app1"),
  (location) => location.pathname.startsWith("/app1"),
  { store }
);
```

### 5.3 使用 qiankun 的全局状态

qiankun 提供了 initGlobalState API 用于全局状态管理。

```js
// 主应用中初始化全局状态
import { initGlobalState } from "qiankun";

// 初始化全局状态
const initialState = { user: { name: "John" } };
const actions = initGlobalState(initialState);

// 监听状态变化
actions.onGlobalStateChange((state, prev) => {
  console.log("主应用观察到状态变化:", state, prev);
});

// 更新状态
actions.setGlobalState({ user: { name: "Jack" } });
```

```js
// 子应用中获取全局状态
export function mount(props) {
  const { onGlobalStateChange, setGlobalState } = props;

  // 监听全局状态变化
  onGlobalStateChange((state, prev) => {
    console.log("子应用观察到状态变化:", state, prev);
  });

  // 更新全局状态
  setGlobalState({ user: { name: "Tom" } });
}
```

## 6. 微前端路由管理

在微前端架构中，不同子应用的路由需要协同工作。

### 6.1 基于 history API 的路由

使用 history API 管理路由。

```js
// 主应用中创建 history 对象
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

// 监听路由变化
history.listen(({ location, action }) => {
  console.log(`当前路径: ${location.pathname}, 操作类型: ${action}`);
});

// 通过 props 传递 history
registerApplication(
  "app1",
  () => import("./app1"),
  (location) => location.pathname.startsWith("/app1"),
  { history }
);
```

```js
// 子应用中使用 history
export function mount(props) {
  const { history } = props;

  // 路由跳转
  document.querySelector("#nav-link").addEventListener("click", () => {
    history.push("/app2");
  });
}
```

### 6.2 基于 React Router 的路由管理

在 React 应用中使用 React Router。

```jsx
// 主应用
import { BrowserRouter, Switch, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/app1" component={MicroApp1} />
        <Route path="/app2" component={MicroApp2} />
      </Switch>
    </BrowserRouter>
  );
}

// MicroApp1 组件负责加载微前端应用1
function MicroApp1() {
  React.useEffect(() => {
    // 加载并挂载应用1
    loadApp("app1", "#app1-container");
    return () => {
      // 卸载应用1
      unloadApp("app1");
    };
  }, []);

  return <div id="app1-container"></div>;
}
```

### 6.3 基于 Vue Router 的路由管理

在 Vue 应用中使用 Vue Router。

```js
// 主应用
import Vue from "vue";
import VueRouter from "vue-router";
import { loadApp, unloadApp } from "./micro-app-loader";

Vue.use(VueRouter);

const routes = [
  {
    path: "/app1",
    component: {
      render: (h) => h("div", { attrs: { id: "app1-container" } }),
      mounted() {
        loadApp("app1", "#app1-container");
      },
      beforeDestroy() {
        unloadApp("app1");
      },
    },
  },
  {
    path: "/app2",
    component: {
      render: (h) => h("div", { attrs: { id: "app2-container" } }),
      mounted() {
        loadApp("app2", "#app2-container");
      },
      beforeDestroy() {
        unloadApp("app2");
      },
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});
```

## 7. 微前端中的性能优化

微前端架构可能引入额外的性能开销，以下是一些性能优化策略。

### 7.1 代码分割

使用代码分割减少初始加载时间。

```js
// 使用动态导入
const AdminDashboard = () => import("./components/AdminDashboard");

// React.lazy
const UserProfile = React.lazy(() => import("./components/UserProfile"));
```

### 7.2 资源共享

共享公共依赖，减少重复加载。

```js
// 使用 webpack Module Federation
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      remotes: {
        // 加载远程模块
        app2: "app2@http://localhost:3002/remoteEntry.js",
      },
      exposes: {
        // 暴露给其他应用的模块
        "./Button": "./src/Button",
      },
      shared: {
        // 共享依赖
        react: { singleton: true },
        "react-dom": { singleton: true },
        "react-router-dom": { singleton: true },
      },
    }),
  ],
};
```

### 7.3 预加载与懒加载

结合预加载和懒加载策略优化用户体验。

```js
// 预加载
import { prefetchApps } from "qiankun";

prefetchApps([{ name: "app1", entry: "//localhost:8081" }]);

// 用户切换路由时懒加载
router.beforeEach((to, from, next) => {
  if (to.path.startsWith("/app2") && !isAppLoaded("app2")) {
    loadApp("app2").then(() => next());
  } else {
    next();
  }
});
```

### 7.4 缓存策略

实现有效的缓存策略，减少重复请求。

```js
// 服务端设置合适的缓存头
app.get("*.js", (req, res) => {
  res.set({
    "Cache-Control": "public, max-age=31536000",
    "Content-Type": "application/javascript",
  });
});

// 前端使用 Service Worker 缓存
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").then((registration) => {
      console.log("ServiceWorker registration successful");
    });
  });
}
```

## 8. 微前端中的调试

微前端应用的调试可能比单体应用更复杂，以下是一些调试策略。

### 8.1 开发环境配置

配置开发环境，方便单独开发和调试微前端应用。

```js
// package.json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "start:standalone": "webpack serve --env standalone --mode development"
  }
}

// webpack.config.js
module.exports = (env = {}) => {
  return {
    entry: env.standalone ? './src/standalone.js' : './src/index.js',
    // ...
  };
};

// src/standalone.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// 独立运行时的入口
ReactDOM.render(<App />, document.getElementById('root'));
```

### 8.2 日志管理

实现统一的日志管理，便于排查问题。

```js
// 创建统一的日志服务
class LogService {
  static log(appName, level, ...args) {
    console.log(`[${appName}][${level}]`, ...args);

    // 在生产环境中可以将日志发送到服务器
    if (process.env.NODE_ENV === "production") {
      this.sendToServer({
        appName,
        level,
        message: args.join(" "),
        timestamp: new Date().toISOString(),
      });
    }
  }

  static sendToServer(logData) {
    fetch("/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logData),
    });
  }
}

// 在微前端应用中使用
LogService.log("app1", "info", "Application initialized");
```

### 8.3 错误边界

使用错误边界捕获并优雅处理子应用中的错误。

```jsx
// React 错误边界
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    LogService.log(this.props.appName, "error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>应用 {this.props.appName} 出现错误</h2>
          <p>{this.state.error.toString()}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 在主应用中使用
<ErrorBoundary appName="app1">
  <div id="app1-container"></div>
</ErrorBoundary>;
```

### 8.4 开发工具扩展

开发浏览器扩展，提供微前端专用的开发工具。

```js
// 浏览器扩展代码示例
chrome.devtools.panels.create("微前端调试", null, "panel.html", (panel) => {
  panel.onShown.addListener((panelWindow) => {
    // 初始化面板
  });
});

// 收集微前端应用信息
function collectMicroAppInfo() {
  return {
    apps: window.__POWERED_BY_QIANKUN__ ? window.__QIANKUN_APPS__ : [],
    currentApp: window.__CURRENT_APP__,
    globalState: window.__GLOBAL_STATE__,
  };
}
```

## 9. 进阶项目实例：使用 qiankun 构建微前端应用

以下是一个使用 qiankun 构建微前端应用的实例。

### 9.1 主应用设置

```bash
# 创建主应用
mkdir main-app
cd main-app
npm init -y
npm install qiankun vue vue-router
```

```js
// src/main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { registerMicroApps, start, initGlobalState } from "qiankun";

Vue.config.productionTip = false;

// 初始化全局状态
const initialState = { user: null };
const actions = initGlobalState(initialState);

// 注册微前端应用
registerMicroApps([
  {
    name: "react-app",
    entry: "//localhost:3001",
    container: "#container",
    activeRule: "/react-app",
    props: {
      getGlobalState: actions.getGlobalState,
      setGlobalState: actions.setGlobalState,
      onGlobalStateChange: actions.onGlobalStateChange,
    },
  },
  {
    name: "vue-app",
    entry: "//localhost:3002",
    container: "#container",
    activeRule: "/vue-app",
    props: {
      getGlobalState: actions.getGlobalState,
      setGlobalState: actions.setGlobalState,
      onGlobalStateChange: actions.onGlobalStateChange,
    },
  },
]);

// 监听全局状态变化
actions.onGlobalStateChange((state, prev) => {
  console.log("主应用全局状态变更", state, prev);
});

// 启动 qiankun
start();

// 挂载 Vue 应用
new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
```

### 9.2 React 子应用配置

```bash
# 创建 React 子应用
npx create-react-app react-app
cd react-app
```

```js
// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./public-path";

let root = null;

function render(props) {
  const { container } = props;
  root = ReactDOM.render(
    <App {...props} />,
    container
      ? container.querySelector("#root")
      : document.getElementById("root")
  );
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render({});
}

// 导出生命周期钩子
export async function bootstrap() {
  console.log("react app bootstraped");
}

export async function mount(props) {
  console.log("react app mount", props);
  render(props);
}

export async function unmount(props) {
  console.log("react app unmount");
  ReactDOM.unmountComponentAtNode(
    props.container
      ? props.container.querySelector("#root")
      : document.getElementById("root")
  );
}
```

```js
// config-overrides.js
module.exports = {
  webpack: function (config, env) {
    // 配置微前端相关设置
    config.output.library = `reactApp`;
    config.output.libraryTarget = "umd";
    config.output.jsonpFunction = `webpackJsonp_reactApp`;
    config.output.publicPath = "http://localhost:3001/";

    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.headers = {
        "Access-Control-Allow-Origin": "*",
      };
      return config;
    };
  },
};
```

### 9.3 Vue 子应用配置

```bash
# 创建 Vue 子应用
vue create vue-app
cd vue-app
```

```js
// src/main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./public-path";

Vue.config.productionTip = false;

let instance = null;

function render(props = {}) {
  const { container } = props;

  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount(container ? container.querySelector("#app") : "#app");
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

// 导出生命周期钩子
export async function bootstrap() {
  console.log("vue app bootstraped");
}

export async function mount(props) {
  console.log("vue app mount", props);
  render(props);
}

export async function unmount() {
  console.log("vue app unmount");
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
}
```

```js
// vue.config.js
module.exports = {
  devServer: {
    port: 3002,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    output: {
      library: `vueApp`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_vueApp`,
    },
  },
};
```

## 总结

在本进阶篇中，我们深入探讨了微前端架构的关键技术点，包括应用通信、生命周期管理、样式隔离、JavaScript 隔离、状态管理、路由管理和性能优化等。这些进阶知识将帮助你构建更加健壮、可维护的微前端应用。

微前端架构虽然带来了一些复杂性，但它为大型前端应用的开发提供了很好的解决方案。通过合理的设计和实践，可以充分发挥微前端架构的优势，为用户提供更好的体验。

在下一篇高级篇中，我们将进一步探讨微前端的高级主题，如自动化部署、监控、安全性、国际化等，帮助你掌握微前端架构的全部知识。

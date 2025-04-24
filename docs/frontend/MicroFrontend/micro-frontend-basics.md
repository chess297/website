---
title: 微前端基础知识
sidebar_position: 1
---

# 微前端基础知识

## 1. 微前端的概念

微前端是一种前端架构模式，它将前端应用分解为更小、更易于管理的部分，并允许每个部分由不同的团队开发、测试和部署，同时对用户来说，这些部分被组合成一个无缝的整体应用。

### 1.1 微前端的定义

就如同微服务将后端应用拆分成多个松耦合的服务一样，微前端将前端应用拆分成多个前端应用，每个应用可以独立开发、独立部署。

### 1.2 为什么需要微前端

随着业务的不断发展，前端应用越来越庞大，单体前端应用面临以下挑战：

- **代码库膨胀**：随着功能的增加，代码库变得庞大而难以维护
- **技术栈更新**：现有应用使用旧的技术栈，难以引入新技术
- **团队扩大**：多个团队同时工作在同一个代码库中，容易产生冲突
- **部署风险**：整体应用作为一个整体部署，任何小更新都需要重新部署整个应用

微前端架构正是为了解决以上问题而提出的。

## 2. 微前端的核心原则

微前端架构基于以下几个核心原则：

### 2.1 团队自治

每个微前端应用由一个独立团队端到端负责，从开发到部署。

```
Team A ──► Micro Frontend A
Team B ──► Micro Frontend B
Team C ──► Micro Frontend C
```

### 2.2 技术栈无关

每个微前端可以选择自己的技术栈，而不影响整体应用的功能。

```js
// React 微前端
const ReactApp = () => <div>React App</div>;

// Vue 微前端
const VueApp = {
  template: "<div>Vue App</div>",
};

// Angular 微前端
@Component({
  selector: "angular-app",
  template: "<div>Angular App</div>",
})
class AngularApp {}
```

### 2.3 松耦合

微前端之间应该是松耦合的，一个微前端的变化不应该影响其他微前端。

### 2.4 独立部署

每个微前端应用可以独立部署，不需要协调其他应用的发布。

## 3. 微前端的实现方式

微前端有多种实现方式，以下是几种常见的方法：

### 3.1 基于路由的分发

使用前端路由将不同路径映射到不同的微前端应用。

```js
// 主应用中的路由配置
const routes = [
  { path: "/app1/*", component: () => mountApp1() },
  { path: "/app2/*", component: () => mountApp2() },
  { path: "/app3/*", component: () => mountApp3() },
];
```

### 3.2 使用 iframe

使用 iframe 将每个微前端应用嵌入到主应用中。

```html
<div id="container">
  <iframe src="https://app1.example.com"></iframe>
  <iframe src="https://app2.example.com"></iframe>
</div>
```

### 3.3 Web Components

使用 Web Components 将每个微前端封装为自定义元素。

```js
// 定义一个微前端组件
class MicroFrontend1 extends HTMLElement {
  connectedCallback() {
    this.innerHTML = "<div>Micro Frontend 1</div>";
    // 加载微前端应用
  }
}

// 注册自定义元素
customElements.define("micro-frontend-1", MicroFrontend1);
```

```html
<!-- 在主应用中使用 -->
<micro-frontend-1></micro-frontend-1>
```

### 3.4 JavaScript 集成

通过动态加载 JavaScript 脚本的方式集成微前端。

```js
function loadApp(url) {
  const script = document.createElement("script");
  script.src = url;
  script.onload = () => {
    // 微前端加载完成后的回调
    window.microApp.mount("#container");
  };
  document.head.appendChild(script);
}

loadApp("https://app1.example.com/main.js");
```

## 4. 常见的微前端框架

市场上已经出现了一些成熟的微前端框架，可以帮助我们更容易地构建微前端应用：

### 4.1 Single-SPA

Single-SPA 是一个用于前端微服务的 JavaScript 框架，它允许在同一个页面上协同使用多个框架。

```js
// 注册一个应用
import { registerApplication, start } from "single-spa";

registerApplication(
  "app1",
  () => import("./app1/main.js"),
  (location) => location.pathname.startsWith("/app1")
);

start();
```

### 4.2 qiankun

qiankun 是基于 Single-SPA 的增强版微前端框架，由蚂蚁金服开发。

```js
// 主应用
import { registerMicroApps, start } from "qiankun";

registerMicroApps([
  {
    name: "react-app",
    entry: "//localhost:7100",
    container: "#container",
    activeRule: "/react-app",
  },
  {
    name: "vue-app",
    entry: "//localhost:7200",
    container: "#container",
    activeRule: "/vue-app",
  },
]);

start();
```

### 4.3 Module Federation

Webpack 5 引入的新特性，允许在多个独立构建之间共享模块。

```js
// webpack.config.js
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/components/Button",
      },
      shared: ["react", "react-dom"],
    }),
  ],
};
```

## 5. 微前端的基本架构

一个典型的微前端架构包含以下组件：

### 5.1 容器应用（Container）

容器应用负责集成各个微前端应用，处理路由，并提供公共功能。

```js
// 容器应用
class Container {
  constructor() {
    this.microFrontends = [];
  }

  registerMicroFrontend(name, mountFn, unmountFn) {
    this.microFrontends.push({ name, mountFn, unmountFn });
  }

  mount(name, container) {
    const app = this.microFrontends.find((app) => app.name === name);
    if (app) {
      app.mountFn(container);
    }
  }

  unmount(name) {
    const app = this.microFrontends.find((app) => app.name === name);
    if (app) {
      app.unmountFn();
    }
  }
}
```

### 5.2 微前端应用（Micro Frontend）

每个微前端应用是一个独立的应用，有自己的构建过程和部署流程。

```js
// 微前端应用导出挂载和卸载方法
export function mount(container) {
  // 将应用挂载到容器元素上
  ReactDOM.render(<App />, container);
}

export function unmount() {
  // 清理资源
  ReactDOM.unmountComponentAtNode(container);
}
```

### 5.3 共享依赖

微前端之间可以共享一些通用的依赖，如 React、Vue 等库，以减少重复加载。

## 6. 微前端的优势与挑战

### 6.1 优势

- **技术栈无关性**：不同团队可以使用不同的技术栈
- **独立开发部署**：每个微前端可以独立开发和部署
- **团队自治**：每个团队可以端到端负责自己的微前端
- **渐进式升级**：可以逐步将现有应用迁移到新技术栈

### 6.2 挑战

- **初始加载性能**：多个微前端可能导致重复依赖，增加加载时间
- **跨应用通信**：微前端之间的通信需要特别处理
- **一致的用户体验**：确保不同微前端提供一致的用户体验
- **复杂的调试**：跨多个应用的调试可能比单体应用更复杂

## 7. 微前端的适用场景

微前端并不适用于所有项目，以下场景特别适合使用微前端架构：

- 大型企业应用，有多个团队共同开发
- 需要集成遗留系统和新系统
- 需要逐步升级技术栈的应用
- 不同业务模块变化频率差异较大的应用

## 8. 入门实例：创建一个简单的微前端应用

以下是使用 Single-SPA 创建一个简单微前端应用的步骤：

### 8.1 创建容器应用

```bash
# 创建容器应用
mkdir container
cd container
npm init -y
npm install single-spa
```

```js
// index.js
import { registerApplication, start } from "single-spa";

// 注册微前端应用
registerApplication(
  "app1",
  () => import("./app1/index.js"),
  (location) => location.pathname.startsWith("/app1")
);

registerApplication(
  "app2",
  () => import("./app2/index.js"),
  (location) => location.pathname.startsWith("/app2")
);

// 启动
start();
```

### 8.2 创建微前端应用

```bash
# 创建微前端应用1
mkdir -p app1
cd app1
npm init -y
npm install react react-dom
```

```js
// app1/index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// 导出生命周期函数
export function bootstrap() {
  return Promise.resolve();
}

export function mount(props) {
  return new Promise((resolve) => {
    ReactDOM.render(<App />, document.getElementById("app1"));
    resolve();
  });
}

export function unmount() {
  return new Promise((resolve) => {
    ReactDOM.unmountComponentAtNode(document.getElementById("app1"));
    resolve();
  });
}
```

### 8.3 HTML 入口

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>微前端示例</title>
  </head>
  <body>
    <nav>
      <a href="/app1">应用1</a>
      <a href="/app2">应用2</a>
    </nav>

    <div id="app1"></div>
    <div id="app2"></div>

    <script src="./index.js"></script>
  </body>
</html>
```

## 总结

微前端是一种前端架构模式，它允许多个团队使用不同的技术栈独立开发、测试和部署前端应用的不同部分。虽然它带来了一些挑战，但在大型应用和多团队协作的场景下，微前端可以提高开发效率和代码可维护性。

本文介绍了微前端的基本概念、核心原则、实现方式、常见框架以及基本架构。在后续的进阶和高级篇章中，我们将进一步深入探讨微前端的高级主题，如状态管理、性能优化和安全性等。

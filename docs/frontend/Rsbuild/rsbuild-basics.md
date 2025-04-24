# Rsbuild 基础知识

## 1. Rsbuild 简介

Rsbuild 是一个用于构建 Web 应用的增强版构建工具,基于 Rspack 开发,由字节跳动开源。它提供了一套完整的构建解决方案,可以帮助开发者快速搭建现代 Web 应用。

### 1.1 主要特性

1. **高性能**

   - 基于 Rust 开发的 Rspack
   - 多核并行构建
   - 智能缓存策略

2. **开箱即用**

   - 零配置即可使用
   - 内置常用功能
   - 支持多种框架

3. **可扩展性**
   - 插件系统
   - 丰富的 API
   - 自定义配置

## 2. 快速开始

### 2.1 安装

```bash
# npm
npm install @rsbuild/core -D

# yarn
yarn add @rsbuild/core -D

# pnpm
pnpm add @rsbuild/core -D
```

### 2.2 基本配置

```js
// rsbuild.config.ts
import { defineConfig } from "@rsbuild/core";

export default defineConfig({
  source: {
    entry: {
      index: "./src/index.ts",
    },
  },
});
```

## 3. 核心概念

### 3.1 构建目标

Rsbuild 支持多种构建目标:

- web - 构建 Web 应用
- node - 构建 Node.js 应用
- web-worker - 构建 Web Worker

### 3.2 入口配置

支持多种入口配置方式:

```js
export default defineConfig({
  source: {
    // 字符串形式
    entry: "./src/index.ts",

    // 对象形式
    entry: {
      main: "./src/main.ts",
      admin: "./src/admin.ts",
    },

    // 函数形式
    entry: async () => ({
      main: "./src/main.ts",
    }),
  },
});
```

## 4. 常用配置

### 4.1 开发服务器

```js
export default defineConfig({
  dev: {
    server: {
      port: 3000,
      host: "0.0.0.0",
      https: true,
    },
  },
});
```

### 4.2 构建优化

```js
export default defineConfig({
  performance: {
    chunkSplit: {
      strategy: "split-by-module",
    },
    removeConsole: ["log", "warn"],
    removeSourceMap: true,
  },
});
```

## 5. 插件系统

### 5.1 使用插件

```js
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
});
```

### 5.2 常用插件

- @rsbuild/plugin-react - React 支持
- @rsbuild/plugin-vue - Vue 支持
- @rsbuild/plugin-svgr - SVG 组件支持
- @rsbuild/plugin-type-check - TypeScript 类型检查

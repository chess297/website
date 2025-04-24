# Rsbuild 进阶知识

## 1. 高级配置

### 1.1 Module Federation

Rsbuild 支持 Module Federation 实现微前端架构:

```js
export default defineConfig({
  moduleFederation: {
    // 共享依赖
    shared: {
      react: { singleton: true },
      "react-dom": { singleton: true },
    },
    // 远程模块
    remotes: {
      app2: "app2@http://localhost:3002/remoteEntry.js",
    },
    // 暴露模块
    exposes: {
      "./Button": "./src/components/Button",
    },
  },
});
```

### 1.2 构建产物分析

使用内置的构建分析工具:

```js
export default defineConfig({
  tools: {
    bundleAnalyzer: true,
  },
});
```

## 2. 性能优化

### 2.1 代码分割策略

```js
export default defineConfig({
  performance: {
    chunkSplit: {
      strategy: "split-by-experience",
      splitChunks: {
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },
  },
});
```

### 2.2 Tree Shaking 优化

```js
export default defineConfig({
  performance: {
    buildConfig: {
      treeshaking: {
        enable: true,
        exclude: ["lodash"],
      },
    },
  },
});
```

## 3. 自定义插件开发

### 3.1 插件结构

```ts
import type { RsbuildPlugin } from "@rsbuild/core";

export function myPlugin(): RsbuildPlugin {
  return {
    name: "my-plugin",

    setup(api) {
      api.onBeforeBuild(({ config }) => {
        // 构建前的操作
      });

      api.onAfterBuild(() => {
        // 构建后的操作
      });
    },
  };
}
```

### 3.2 常用生命周期

- onBeforeBuild - 构建开始前
- onAfterBuild - 构建完成后
- onBeforeCreateCompiler - 创建编译器前
- onAfterCreateCompiler - 创建编译器后
- onDevCompileDone - 开发环境编译完成
- onBeforeStartDevServer - 开发服务器启动前

## 4. 多环境配置

### 4.1 环境变量

```js
export default defineConfig({
  source: {
    define: {
      "process.env.API_URL": JSON.stringify(process.env.API_URL),
    },
  },
});
```

### 4.2 条件编译

```js
export default defineConfig({
  tools: {
    conditionalCompile: {
      env: process.env.NODE_ENV,
      conditions: {
        DEVELOPMENT: process.env.NODE_ENV === "development",
        PRODUCTION: process.env.NODE_ENV === "production",
      },
    },
  },
});
```

## 5. 高级集成

### 5.1 与 TypeScript 集成

```js
export default defineConfig({
  tools: {
    typescript: {
      useTypeCheck: true,
      useTypescriptLoader: true,
    },
  },
});
```

### 5.2 PostCSS 配置

```js
export default defineConfig({
  tools: {
    postcss: {
      postcssOptions: {
        plugins: ["postcss-preset-env", "autoprefixer"],
      },
    },
  },
});
```

## 6. 调试技巧

### 6.1 Source Map 配置

```js
export default defineConfig({
  output: {
    sourceMap: {
      js: "source-map",
      css: "source-map",
    },
  },
});
```

### 6.2 构建日志

```js
export default defineConfig({
  dev: {
    logging: {
      level: "verbose",
      detail: true,
    },
  },
});
```

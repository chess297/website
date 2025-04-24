# Rsbuild 高级知识

## 1. 构建引擎深入

### 1.1 Rspack 核心原理

Rsbuild 底层基于 Rspack 构建引擎,了解其核心机制:

```js
// Rspack 核心编译流程
class RspackCompiler {
  constructor(options) {
    this.hooks = {
      entryOption: new SyncBailHook(["context", "entry"]),
      beforeCompile: new AsyncSeriesHook(["params"]),
      compile: new SyncHook(["params"]),
      make: new AsyncParallelHook(["compilation"]),
      afterCompile: new AsyncSeriesHook(["compilation"]),
    };
  }

  run(callback) {
    const onCompiled = (err, compilation) => {
      if (err) return callback(err);

      if (compilation.hooks.needAdditionalPass.call()) {
        compilation.needAdditionalPass = true;
        const stats = new Stats(compilation);
        stats.startTime = startTime;
        stats.endTime = Date.now();
        this.hooks.done.callAsync(stats, (err) => {
          if (err) return callback(err);
          this.compile(onCompiled);
        });
        return;
      }

      return callback(null, compilation);
    };
  }
}
```

### 1.2 性能优化底层实现

深入 Rsbuild 性能优化的技术细节:

```js
export default defineConfig({
  performance: {
    // 自定义分包策略
    chunkSplit: {
      strategy: "custom",
      customSplitting: {
        react: [/node_modules\/react/],
        utils: [/src\/utils/],
        vendors: [/node_modules/],
      },
    },
    // 并行处理配置
    parallel: {
      workers: "auto", // 自动检测 CPU 核心数
      workerThreads: true, // 启用 worker_threads
      workerParallelJobs: 50, // 单个 worker 可并行任务数
    },
    // 缓存优化
    cache: {
      filesystem: true,
      buildDependencies: {
        config: [__filename], // 构建配置变化时清除缓存
      },
      compression: "brotli", // 使用 brotli 压缩缓存
      name: "production-cache",
      version: "1.0",
    },
  },
});
```

## 2. 工程化实践

### 2.1 模块联邦高级配置

完整的微前端架构配置示例:

```js
export default defineConfig({
  moduleFederation: {
    name: "host",
    filename: "remoteEntry.js",
    remotes: {
      app1: "app1@http://localhost:3001/remoteEntry.js",
      app2: "app2@http://localhost:3002/remoteEntry.js",
    },
    exposes: {
      "./Header": "./src/components/Header",
      "./Footer": "./src/components/Footer",
    },
    shared: {
      react: {
        singleton: true,
        requiredVersion: "^18.0.0",
        strictVersion: true,
        eager: true,
      },
      "react-dom": {
        singleton: true,
        requiredVersion: "^18.0.0",
        strictVersion: true,
        eager: true,
      },
      "react-router-dom": {
        singleton: true,
        requiredVersion: "^6.0.0",
      },
    },
  },
  runtime: {
    // 运行时配置
    prefetch: ["app1", "app2"],
    injectScripts: ["shared-deps.js"],
  },
});
```

### 2.2 自定义运行时优化

```js
export default defineConfig({
  source: {
    runtime: {
      // 自定义运行时代码
      inlineRuntime: false,
      runtimeChunk: {
        name: "runtime",
      },
      // 运行时优化
      optimization: {
        moduleIds: "deterministic",
        chunkIds: "deterministic",
        mangleExports: "deterministic",
        innerGraph: true,
        sideEffects: true,
      },
    },
  },
});
```

## 3. 插件系统高级开发

### 3.1 自定义编译插件

实现复杂的编译流程干预:

```ts
import type { RsbuildPlugin } from "@rsbuild/core";

interface CustomPluginOptions {
  transformImports?: boolean;
  injectEnv?: boolean;
}

export function customBuildPlugin(
  options: CustomPluginOptions = {}
): RsbuildPlugin {
  return {
    name: "custom-build-plugin",

    setup(api) {
      // 编译前处理
      api.onBeforeCreateCompiler(({ configs }) => {
        configs.forEach((config) => {
          if (options.transformImports) {
            // 自定义 import 转换
            config.module.rules.push({
              test: /\.(js|ts)x?$/,
              use: [
                {
                  loader: "custom-import-loader",
                  options: {
                    /* ... */
                  },
                },
              ],
            });
          }
        });
      });

      // 资源处理
      api.modifyRsbuildConfig((config) => {
        if (options.injectEnv) {
          config.source.define = {
            ...config.source.define,
            "process.env.CUSTOM_VAR": JSON.stringify(process.env.CUSTOM_VAR),
          };
        }
        return config;
      });

      // 构建完成处理
      api.onAfterBuild(({ stats }) => {
        const assets = stats.toJson().assets || [];
        // 自定义资源处理逻辑
        assets.forEach((asset) => {
          if (asset.name.endsWith(".js")) {
            // 处理 JS 资源
          }
        });
      });
    },
  };
}
```

### 3.2 高级生命周期钩子

```ts
interface CustomPlugin extends RsbuildPlugin {
  setup(api: PluginAPI) {
    // 编译器创建前
    api.onBeforeCreateCompiler(({ configs }) => {
      // 修改 webpack/rspack 配置
    });

    // 开发服务器启动前
    api.onBeforeStartDevServer(({ serverConfig }) => {
      // 配置开发服务器
    });

    // 开发环境编译完成
    api.onDevCompileDone(({ isFirstCompile, stats }) => {
      if (isFirstCompile) {
        // 首次编译完成处理
      }
    });

    // 构建产物生成前
    api.onBeforeGenerate(({ bundleAssets }) => {
      // 处理构建产物
    });

    // 构建完成
    api.onAfterBuild(({ stats }) => {
      // 生成构建报告
    });
  }
}
```

## 4. 高级部署方案

### 4.1 多环境部署配置

```js
export default defineConfig({
  output: {
    // 智能 CDN 分发
    cdn: {
      strategy: "adaptive",
      domains: ["https://cdn1.example.com", "https://cdn2.example.com"],
      publicPath: "[hash]",
    },
    // 差异化部署配置
    deployment: {
      production: {
        baseUrl: "https://prod.example.com",
        compress: true,
        sourceMap: false,
      },
      staging: {
        baseUrl: "https://staging.example.com",
        compress: true,
        sourceMap: true,
      },
      development: {
        baseUrl: "http://localhost:3000",
        compress: false,
        sourceMap: true,
      },
    },
  },
  tools: {
    // 自动化部署工具配置
    deploy: {
      provider: "custom",
      options: {
        script: "deploy.sh",
        args: process.env.DEPLOY_ARGS,
      },
    },
  },
});
```

### 4.2 高可用性保障

```js
export default defineConfig({
  performance: {
    // 错误监控与恢复
    errorMonitor: {
      enabled: true,
      reportErrors: true,
      maxRetries: 3,
      onError: (error) => {
        // 错误上报逻辑
      },
    },
    // 构建失败保护
    buildProtection: {
      maxErrors: 10,
      maxWarnings: 50,
      preventFailure: true,
    },
  },
  output: {
    // 回滚方案
    rollback: {
      enabled: true,
      keepVersions: 3,
      trigger: "manual",
    },
  },
});
```

## 5. 高级调试与监控

### 5.1 性能分析工具

```js
export default defineConfig({
  tools: {
    analyzer: {
      // 构建分析
      bundleAnalyzer: {
        openAnalyzer: false,
        analyzerMode: "static",
        reportFilename: "bundle-report.html",
        defaultSizes: "gzip",
      },
      // 性能追踪
      speedMeasure: {
        enabled: true,
        outputFormat: "human",
        outputTarget: "./speed-measure.json",
        granularity: "module",
      },
    },
    // 构建耗时分析
    progress: {
      profile: true,
      renderProgressBar: true,
      details: true,
    },
  },
});
```

### 5.2 自定义监控系统

```js
export default defineConfig({
  tools: {
    monitor: {
      // 构建性能监控
      performance: {
        timeline: true,
        memory: true,
        cpu: true,
        io: true,
      },
      // 自定义指标收集
      metrics: {
        collect: true,
        customMetrics: {
          buildTime: (stats) => stats.endTime - stats.startTime,
          bundleSize: (stats) => calculateBundleSize(stats),
          chunkCount: (stats) => stats.chunks.length,
        },
        report: (metrics) => {
          // 上报监控数据
          sendMetricsToMonitor(metrics);
        },
      },
    },
  },
});
```

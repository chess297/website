# Webpack 高级应用

## 1. Webpack 原理深入

### 1.1 Tapable 和钩子系统

```javascript
const { SyncHook, AsyncSeriesHook } = require("tapable");

class Compiler {
  constructor() {
    this.hooks = {
      start: new SyncHook(["config"]),
      done: new AsyncSeriesHook(["stats"]),
    };
  }

  run() {
    this.hooks.start.call(this.config);
    // 异步钩子调用
    this.hooks.done.promise(stats).then(() => {
      console.log("编译完成");
    });
  }
}
```

### 1.2 Compiler 和 Compilation

```javascript
class MyPlugin {
  apply(compiler) {
    // Compiler 钩子
    compiler.hooks.entryOption.tap("MyPlugin", (context, entry) => {
      // 在 entry 配置完成后执行
    });

    // Compilation 钩子
    compiler.hooks.compilation.tap("MyPlugin", (compilation) => {
      compilation.hooks.optimize.tap("MyPlugin", () => {
        // 在优化阶段执行
      });
    });
  }
}
```

## 2. 自定义 Loader 开发

### 2.1 同步 Loader

```javascript
module.exports = function (source) {
  const options = this.getOptions();

  // 源代码转换
  const transformedSource = someTransformation(source, options);

  // 返回转换后的代码
  return transformedSource;
};
```

### 2.2 异步 Loader

```javascript
module.exports = function (source) {
  const callback = this.async();

  someAsyncOperation(source, (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};
```

### 2.3 Pitching Loader

```javascript
module.exports = function (source) {
  return source;
};

module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  // 在实际执行 loader 之前调用
  if (someCondition) {
    // 跳过后续 loader
    return someContent;
  }
};
```

## 3. 构建优化高级技巧

### 3.1 持久化缓存

```javascript
module.exports = {
  cache: {
    type: "filesystem",
    buildDependencies: {
      config: [__filename],
    },
    name: "production-cache",
  },
};
```

### 3.2 预编译资源模块

```javascript
const AutoDllPlugin = require("autodll-webpack-plugin");

module.exports = {
  plugins: [
    new AutoDllPlugin({
      inject: true,
      filename: "[name].dll.js",
      entry: {
        vendor: ["react", "react-dom", "redux", "react-redux"],
      },
    }),
  ],
};
```

## 4. 多页面应用配置

### 4.1 多入口配置

```javascript
module.exports = {
  entry: {
    pageOne: "./src/pageOne/index.js",
    pageTwo: "./src/pageTwo/index.js",
    pageThree: "./src/pageThree/index.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "pageOne.html",
      template: "./src/pageOne/template.html",
      chunks: ["pageOne"],
    }),
    new HtmlWebpackPlugin({
      filename: "pageTwo.html",
      template: "./src/pageTwo/template.html",
      chunks: ["pageTwo"],
    }),
    new HtmlWebpackPlugin({
      filename: "pageThree.html",
      template: "./src/pageThree/template.html",
      chunks: ["pageThree"],
    }),
  ],
};
```

## 5. 自定义统计信息

### 5.1 统计配置

```javascript
module.exports = {
  stats: {
    assets: true,
    colors: true,
    errors: true,
    errorDetails: true,
    hash: true,
  },
};
```

### 5.2 自定义性能分析

```javascript
const webpack = require("webpack");

new webpack.ProgressPlugin((percentage, message, ...args) => {
  // 自定义进度信息处理
  console.info(percentage, message, ...args);
});
```

## 6. 高级优化配置

### 6.1 懒加载优化

```javascript
// 路由懒加载示例
const routes = {
  component: () =>
    import(
      /* webpackChunkName: "route" */
      /* webpackPrefetch: true */
      "./routes/MyRoute"
    ),
};
```

### 6.2 prefetch/preload

```javascript
// 预获取
import(/* webpackPrefetch: true */ "./path/to/component.js");

// 预加载
import(/* webpackPreload: true */ "./path/to/component.js");
```

## 7. 构建可视化分析

### 7.1 Bundle 分析

```javascript
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "bundle-report.html",
      openAnalyzer: false,
    }),
  ],
};
```

### 7.2 速度分析

```javascript
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin({
  outputFormat: "human",
  outputTarget: "./speed-measure.json",
});

module.exports = smp.wrap({
  // webpack config
});
```

## 8. ESM 和 CommonJS 互操作

### 8.1 混合模块类型处理

```javascript
module.exports = {
  experiments: {
    outputModule: true,
    topLevelAwait: true,
    asyncWebAssembly: true,
  },
};
```

## 9. WebAssembly 集成

### 9.1 Wasm 加载配置

```javascript
module.exports = {
  experiments: {
    asyncWebAssembly: true,
    importAsync: true,
    importAwait: true,
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: "webassembly/async",
      },
    ],
  },
};
```

## 10. 自定义构建报告

### 10.1 构建信息收集

```javascript
class BuildReportPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("BuildReportPlugin", (stats) => {
      const report = {
        hash: stats.hash,
        time: stats.time,
        errors: stats.hasErrors(),
        warnings: stats.hasWarnings(),
        assets: stats.toJson().assets.map((asset) => ({
          name: asset.name,
          size: asset.size,
        })),
      };

      require("fs").writeFileSync(
        "./build-report.json",
        JSON.stringify(report, null, 2)
      );
    });
  }
}
```

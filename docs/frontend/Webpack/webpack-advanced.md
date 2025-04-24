# Webpack 进阶技巧

## 1. 代码分割（Code Splitting）

### 1.1 动态导入

```javascript
// 动态导入示例
const getComponent = () => import("./components/heavy-component");

button.onclick = () => {
  getComponent().then((module) => {
    document.body.appendChild(module.default());
  });
};
```

### 1.2 SplitChunksPlugin 配置

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

## 2. 缓存优化

### 2.1 输出文件名哈希

```javascript
module.exports = {
  output: {
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].chunk.js",
  },
};
```

### 2.2 模块标识符优化

```javascript
module.exports = {
  optimization: {
    moduleIds: "deterministic",
    chunkIds: "deterministic",
  },
};
```

## 3. Tree Shaking 深入

### 3.1 配置 package.json

```json
{
  "sideEffects": ["*.css", "*.scss"]
}
```

### 3.2 优化配置

```javascript
module.exports = {
  optimization: {
    usedExports: true,
    minimize: true,
    concatenateModules: true,
  },
};
```

## 4. 性能优化

### 4.1 速度优化

```javascript
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  // webpack 配置
});
```

### 4.2 并行处理

```javascript
const ThreadsPlugin = require("threads-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 4,
            },
          },
          "babel-loader",
        ],
      },
    ],
  },
  plugins: [new ThreadsPlugin()],
};
```

## 5. 模块联邦（Module Federation）

### 5.1 主应用配置

```javascript
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host",
      filename: "remoteEntry.js",
      remotes: {
        app1: "app1@http://localhost:3001/remoteEntry.js",
      },
      shared: ["react", "react-dom"],
    }),
  ],
};
```

### 5.2 远程应用配置

```javascript
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/Button",
      },
      shared: ["react", "react-dom"],
    }),
  ],
};
```

## 6. 自定义插件开发

### 6.1 插件基本结构

```javascript
class MyWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync("MyWebpackPlugin", (compilation, callback) => {
      // 在这里处理文件
      compilation.assets["filename.txt"] = {
        source: () => "content",
        size: () => "content".length,
      };
      callback();
    });
  }
}

module.exports = MyWebpackPlugin;
```

## 7. 环境变量和模式

### 7.1 环境配置

```javascript
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.EnvironmentPlugin(["API_KEY"]),
  ],
};
```

### 7.2 多配置文件

```javascript
// webpack.common.js、webpack.dev.js、webpack.prod.js
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  // 其他开发环境特定配置
});
```

## 8. Source Maps 进阶

### 8.1 不同环境配置

```javascript
// 开发环境
module.exports = {
  devtool: "eval-cheap-module-source-map",
};

// 生产环境
module.exports = {
  devtool: "source-map",
};
```

## 9. 构建性能优化实践

### 9.1 DLL 动态链接库

```javascript
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: {
    vendor: ["react", "react-dom"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].dll.js",
    library: "[name]_[fullhash]",
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dist", "[name]-manifest.json"),
      name: "[name]_[fullhash]",
    }),
  ],
};
```

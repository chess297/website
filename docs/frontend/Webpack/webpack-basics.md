# Webpack 基础知识

## 1. Webpack 核心概念

### 1.1 入口（Entry）

入口起点指示 webpack 应该使用哪个模块来作为构建其内部依赖图的开始。

```javascript
// webpack.config.js
module.exports = {
  entry: "./src/index.js",
};
```

### 1.2 输出（Output）

output 属性告诉 webpack 在哪里输出它所创建的 bundle，以及如何命名这些文件。

```javascript
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
```

### 1.3 加载器（Loaders）

webpack 只能理解 JavaScript 和 JSON 文件，loader 让 webpack 能够去处理其他类型的文件。

```javascript
module.exports = {
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.ts$/, use: "ts-loader" },
    ],
  },
};
```

### 1.4 插件（Plugins）

插件可以用于执行范围更广的任务，如打包优化、资源管理、注入环境变量等。

```javascript
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
};
```

## 2. 基本配置

### 2.1 开发环境配置

```javascript
module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    hot: true,
  },
};
```

### 2.2 生产环境配置

```javascript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "production",
  optimization: {
    minimize: true,
  },
  plugins: [new MiniCssExtractPlugin()],
};
```

## 3. 资源模块

### 3.1 处理图片

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

### 3.2 处理字体和其他文件

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
  },
};
```

## 4. 开发工具

### 4.1 使用 source maps

```javascript
module.exports = {
  devtool: "inline-source-map",
};
```

### 4.2 开发服务器

```javascript
module.exports = {
  devServer: {
    static: "./dist",
    open: true,
    hot: true,
    port: 8080,
    compress: true,
  },
};
```

## 5. 常用命令

```bash
# 安装 webpack
npm install webpack webpack-cli --save-dev

# 运行开发服务器
npm run serve

# 构建生产版本
npm run build
```

## 6. 配置文件示例

完整的 webpack.config.js 示例：

```javascript
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ],
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    hot: true,
  },
};
```

# Webpack 面试题

## 1. 基础概念类问题

### Q1: 什么是 Webpack？它的主要作用是什么？

**答：** Webpack 是一个现代 JavaScript 应用程序的静态模块打包工具。它的主要作用包括：

- 模块打包：将多个模块打包成一个或多个 bundle
- 代码转换：通过 loader 处理非 JavaScript 文件
- 资源优化：压缩、合并、tree shaking 等
- 开发便利：提供开发服务器、热更新等功能

### Q2: Webpack 的核心概念有哪些？

**答：** Webpack 的核心概念包括：

1. Entry（入口）：webpack 构建的起点
2. Output（输出）：打包后的文件存放位置
3. Loader（加载器）：处理非 JavaScript 文件
4. Plugin（插件）：扩展 webpack 功能
5. Mode（模式）：development、production 或 none

### Q3: loader 和 plugin 的区别是什么？

**答：**

- **Loader:**

  - 用于转换某些类型的模块
  - 是一个转换器，将 A 文件进行编译形成 B 文件
  - 运行在打包文件之前
  - 例如：css-loader, babel-loader

- **Plugin:**
  - 扩展 webpack 的功能
  - 是一个扩展器，丰富 webpack 本身
  - 在整个编译周期都起作用
  - 例如：HtmlWebpackPlugin, CleanWebpackPlugin

## 2. 进阶优化类问题

### Q4: 如何提高 Webpack 的构建速度？

**答：** 常用的优化方法包括：

1. 使用 cache-loader 或 babel-loader 的 cacheDirectory 选项
2. 使用 thread-loader 进行多线程打包
3. 合理使用 sourceMap
4. 使用 webpack.DllPlugin 处理第三方库
5. 配置 resolve.modules 指定模块搜索目录

```javascript
module.exports = {
  resolve: {
    modules: [path.resolve(__dirname, "node_modules")],
    extensions: [".js", ".jsx", ".json"],
  },
};
```

### Q5: 什么是 Tree Shaking？如何实现？

**答：**

- Tree Shaking 是一个术语，指移除 JavaScript 中未引用的代码（dead-code）
- 实现条件：
  1. 使用 ES2015 模块语法（import/export）
  2. 确保没有编译器将 ES2015 模块语法转换为 CommonJS 模块
  3. 在 package.json 中添加 "sideEffects" 属性
  4. 使用 production mode 或启用压缩工具

### Q6: 如何进行代码分割？

**答：** 代码分割的主要方式有：

1. 入口起点：使用 entry 配置手动分割
2. 动态导入：使用 import() 语法
3. 防止重复：使用 SplitChunksPlugin

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
      },
    },
  },
};
```

## 3. 实践应用类问题

### Q7: 如何配置多页面应用？

**答：** 多页面配置主要涉及：

1. 多入口配置
2. 多个 HtmlWebpackPlugin 实例
3. 分割公共代码

```javascript
module.exports = {
  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "page1.html",
      chunks: ["page1"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "page2.html",
      chunks: ["page2"],
    }),
  ],
};
```

### Q8: 如何处理图片等静态资源？

**答：** 处理静态资源的方法：

1. 使用 asset modules (Webpack 5)
2. 使用适当的 loader (url-loader, file-loader)

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 4kb
          },
        },
      },
    ],
  },
};
```

### Q9: 如何实现热更新？

**答：** 实现热更新的步骤：

1. 配置 devServer
2. 启用 HotModuleReplacementPlugin
3. 在代码中处理热更新逻辑

```javascript
module.exports = {
  devServer: {
    hot: true,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
};
```

## 4. 原理深入类问题

### Q10: Webpack 的构建流程是什么？

**答：** Webpack 的主要构建流程：

1. 初始化参数：从配置文件和 Shell 语句中读取与合并参数
2. 开始编译：用上一步得到的参数初始化 Compiler 对象
3. 确定入口：根据配置中的 entry 找出所有的入口文件
4. 编译模块：从入口文件出发，调用所有配置的 Loader 对模块进行翻译
5. 完成模块编译：得到每个模块被翻译后的最终内容以及它们之间的依赖关系
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
7. 输出完成：根据配置确定输出的路径和文件名，把文件内容写入到文件系统

### Q11: 什么是 Chunk？什么是 Bundle？

**答：**

- **Chunk:** 是 Webpack 在进行模块的依赖分析的时候，代码分割出来的代码块
- **Bundle:** 是 Webpack 打包出来的文件
- 一个 Chunk 可能会生成多个 Bundle，一个 Bundle 可能是一个 Chunk 的子集

### Q12: Webpack 的模块热替换(HMR)原理是什么？

**答：** HMR 的核心原理：

1. webpack-dev-server 开启一个本地服务，建立 WebSocket 连接
2. webpack 监听源文件的变化，即当开发者保存文件时触发 webpack 的重新编译
3. webpack-dev-server 通过 websocket 向客户端推送更新信息
4. HMR Runtime 根据收到的信息请求新的模块代码
5. HMR Runtime 针对新旧模块进行对比，决定是否更新模块
6. 如果更新模块，则发出更新信号，触发相应的回调函数

## 5. 工程化实践类问题

### Q13: 如何优化 Webpack 的打包体积？

**答：** 常用的优化方法包括：

1. 开启 Tree Shaking
2. 使用 optimization.splitChunks 分割代码
3. 使用 terser-webpack-plugin 压缩代码
4. 使用 compression-webpack-plugin 开启 Gzip 压缩
5. 合理使用 source-map
6. 优化图片资源

### Q14: 如何确保 webpack 打包的质量？

**答：** 质量保证措施：

1. 使用 webpack-bundle-analyzer 分析打包结果
2. 配置 optimization.moduleIds 和 chunkIds 保持稳定性
3. 使用 speed-measure-webpack-plugin 监控打包速度
4. 合理配置 source-map
5. 编写自动化测试用例
6. 实施持续集成（CI）

### Q15: 如何处理 webpack 打包时的跨域问题？

**答：** 处理跨域的方法：

1. 配置 devServer 的 proxy

```javascript
module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: { "^/api": "" },
        changeOrigin: true,
      },
    },
  },
};
```

2. 使用 CORS
3. 使用环境变量区分开发和生产环境的接口地址

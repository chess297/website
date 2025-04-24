---
title: CSS 高级知识
sidebar_position: 3
---

# CSS 高级知识

## 1. CSS 架构设计

### BEM 命名规范

```css
/* 块（Block） */
.block {
}

/* 元素（Element） */
.block__element {
}

/* 修饰符（Modifier） */
.block--modifier {
}
.block__element--modifier {
}

/* 实际应用示例 */
.card {
}
.card__header {
}
.card__body {
}
.card__footer {
}
.card--featured {
}
.card__title--large {
}
```

### OOCSS 原则

```css
/* 结构与皮肤分离 */
.button {
  /* 结构 */
  display: inline-block;
  padding: 10px 20px;
  border-radius: 4px;
}

.button-primary {
  /* 皮肤 */
  background-color: #007bff;
  color: white;
}

/* 容器与内容分离 */
.container {
  width: 80%;
  margin: 0 auto;
}

.content {
  font-size: 16px;
  line-height: 1.5;
}
```

### SMACSS 分层

```css
/* 1. Base */
html,
body,
form {
  margin: 0;
  padding: 0;
}

/* 2. Layout */
.l-header {
  height: 60px;
}

.l-sidebar {
  width: 200px;
}

/* 3. Module */
.nav {
}
.nav-item {
}

/* 4. State */
.is-active {
}
.is-hidden {
}

/* 5. Theme */
.theme-dark {
}
.theme-light {
}
```

## 2. CSS 模块化

### CSS Modules

```css
/* button.module.css */
.button {
  /* 局部作用域 */
  composes: base from "./base.css";
  padding: 10px 20px;
}

.primary {
  composes: button;
  background: blue;
}

/* 使用变量 */
@value colors: "./colors.css";
@value primary, secondary from colors;

.button {
  color: primary;
  border-color: secondary;
}
```

### CSS-in-JS

```javascript
// styled-components 示例
const Button = styled.button`
  background: ${(props) => (props.primary ? "blue" : "white")};
  color: ${(props) => (props.primary ? "white" : "black")};
  padding: 10px 20px;
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
  }
`;

// emotion 示例
const style = css`
  background: #fff;
  padding: 20px;
  border-radius: 4px;

  &:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;
```

## 3. 高级动画技巧

### 性能优化动画

```css
/* 使用 transform 和 opacity 实现高性能动画 */
.optimized-animation {
  /* 启用硬件加速 */
  transform: translateZ(0);
  will-change: transform, opacity;

  /* 使用 transform 而不是位置属性 */
  transform: translate(100px, 100px);

  /* 使用 opacity 而不是 visibility */
  opacity: 0;
  transition: transform 0.3s, opacity 0.3s;
}

/* 使用 requestAnimationFrame 控制动画 */
.raf-animation {
  animation: none; /* 在 JS 中使用 requestAnimationFrame */
}
```

### 高级动画效果

```css
/* 3D 转换和视角 */
.container {
  perspective: 1000px;
}

.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card:hover {
  transform: rotateY(180deg);
}

/* 动画组合 */
.complex-animation {
  animation: slideIn 0.5s ease-out, fadeIn 0.5s ease-out, scale 0.5s ease-out;
}

/* 路径动画 */
.path-animation {
  offset-path: path("M 0,0 C 25,25 75,25 100,0");
  animation: move 3s infinite;
}

@keyframes move {
  100% {
    offset-distance: 100%;
  }
}
```

## 4. CSS 工程化

### PostCSS 配置

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require("autoprefixer"),
    require("postcss-preset-env")({
      stage: 3,
      features: {
        "nesting-rules": true,
        "custom-media-queries": true,
        "custom-selectors": true,
      },
    }),
    require("cssnano"),
  ],
};
```

### CSS 预处理器高级特性

```scss
// SCSS 高级特性
@mixin flex-center($direction: row) {
  display: flex;
  flex-direction: $direction;
  align-items: center;
  justify-content: center;
}

// 函数
@function calculate-width($col, $total: 12) {
  @return percentage($col / $total);
}

// 条件语句
@mixin respond-to($breakpoint) {
  @if $breakpoint == "small" {
    @media (max-width: 576px) {
      @content;
    }
  } @else if $breakpoint == "medium" {
    @media (max-width: 768px) {
      @content;
    }
  }
}

// 循环
@for $i from 1 through 12 {
  .col-#{$i} {
    width: calculate-width($i);
  }
}
```

## 5. CSS Houdini API

### Paint API

```javascript
// 自定义画笔
registerPaint(
  "cornerShape",
  class {
    paint(ctx, size, properties) {
      // 绘制自定义图形
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size.width, 0);
      ctx.lineTo(0, size.height);
      ctx.fill();
    }
  }
);
```

```css
.custom-corner {
  /* 使用自定义画笔 */
  background-image: paint(cornerShape);
}
```

### Properties and Values API

```css
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.gradient-border {
  --angle: 0deg;
  border-image: conic-gradient(from var(--angle), red, blue) 1;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}
```

## 6. 响应式设计进阶

### 容器查询

```css
@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
}

.card-container {
  container-type: inline-size;
  container-name: card;
}
```

### 新一代响应式布局

```css
/* 自适应容器 */
.adaptive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

/* Flexbox 响应式组件 */
.flex-component {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;

  & > * {
    flex: 1 1 calc(var(--responsive-width, 300px));
    min-width: 0;
  }
}
```

## 7. 主题系统设计

### 动态主题

```css
/* 定义主题变量 */
:root {
  /* 亮色主题 */
  --primary-light: #007bff;
  --background-light: #ffffff;
  --text-light: #333333;

  /* 暗色主题 */
  --primary-dark: #409eff;
  --background-dark: #1a1a1a;
  --text-dark: #ffffff;
}

/* 主题切换 */
[data-theme="light"] {
  --primary: var(--primary-light);
  --background: var(--background-light);
  --text: var(--text-light);
}

[data-theme="dark"] {
  --primary: var(--primary-dark);
  --background: var(--background-dark);
  --text: var(--text-dark);
}

/* 使用主题变量 */
.component {
  background-color: var(--background);
  color: var(--text);
}

/* 自动暗色主题 */
@media (prefers-color-scheme: dark) {
  :root {
    --primary: var(--primary-dark);
    --background: var(--background-dark);
    --text: var(--text-dark);
  }
}
```

### 主题定制系统

```css
/* 主题配置 */
.theme-config {
  /* 颜色系统 */
  --theme-primary: #007bff;
  --theme-secondary: #6c757d;
  --theme-success: #28a745;
  --theme-danger: #dc3545;

  /* 间距系统 */
  --spacing-unit: 4px;
  --spacing-small: calc(var(--spacing-unit) * 2);
  --spacing-medium: calc(var(--spacing-unit) * 4);
  --spacing-large: calc(var(--spacing-unit) * 6);

  /* 字体系统 */
  --font-family-base: system-ui, -apple-system, sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.5;

  /* 圆角系统 */
  --border-radius-small: 4px;
  --border-radius-medium: 8px;
  --border-radius-large: 12px;

  /* 阴影系统 */
  --shadow-small: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-medium: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-large: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

## 8. CSS 性能优化

### 选择器优化

```css
/* 避免深层次选择器 */
/* 不推荐 */
.header .nav .list .item a {
}

/* 推荐 */
.nav-link {
}

/* 避免通配符选择器 */
/* 不推荐 */
* {
  box-sizing: border-box;
}

/* 推荐 */
html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
```

### 渲染性能

```css
/* 减少重排重绘 */
.performance {
  /* 使用 transform 代替位置改变 */
  transform: translate(10px, 20px);

  /* 使用 opacity 代替显示隐藏 */
  opacity: 0;

  /* 启用 GPU 加速 */
  transform: translateZ(0);

  /* 控制层叠上下文 */
  isolation: isolate;
  z-index: 1;
}

/* 避免大量样式计算 */
.efficient {
  /* 使用类名切换代替样式操作 */
  &.is-active {
    /* 状态样式 */
  }
}
```

## 9. 响应式图像和视频

### 现代响应式图像

```css
/* 使用 srcset 和 sizes */
img {
  max-width: 100%;
  height: auto;
}

/* 使用 object-fit 控制图像填充 */
.cover-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  object-position: center;
}

/* 图片艺术指导 */
picture {
  display: block;

  source {
    width: 100%;
    height: auto;
  }
}

/* 背景图像响应式 */
.responsive-background {
  background-image: image-set(
    url("image-1x.jpg") 1x,
    url("image-2x.jpg") 2x,
    url("image-3x.jpg") 3x
  );
}
```

### 响应式视频

```css
/* 响应式视频容器 */
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 比例 */
  height: 0;
  overflow: hidden;

  iframe,
  video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

/* 视频背景 */
.video-background {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  z-index: -1;
  background-size: cover;
}
```

## 10. 国际化和本地化

### RTL 支持

```css
/* 使用逻辑属性 */
.component {
  margin-inline-start: 20px;
  padding-inline-end: 10px;
  border-inline-start: 1px solid;
}

/* 使用 dir 属性 */
[dir="rtl"] .component {
  /* RTL 特定样式 */
}

/* 使用 CSS 逻辑值 */
.flex-container {
  flex-direction: row;
}

[dir="rtl"] .flex-container {
  flex-direction: row-reverse;
}
```

### 多语言支持

```css
/* 字体回退 */
:lang(zh) {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

:lang(ja) {
  font-family: "Hiragino Kaku Gothic Pro", "Meiryo", sans-serif;
}

:lang(ar) {
  font-family: "Arabic UI", system-ui, sans-serif;
  line-height: 1.8;
}

/* 文本方向 */
[dir="rtl"] {
  text-align: right;
}

/* 特定语言样式调整 */
:lang(ja) .text {
  line-height: 1.7;
}

:lang(ar) .title {
  letter-spacing: normal;
}
```

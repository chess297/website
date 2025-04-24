---
title: CSS 进阶知识
sidebar_position: 2
---

# CSS 进阶知识

## 1. Flexbox 布局

### 基本概念

```css
.flex-container {
  /* 开启 flex 布局 */
  display: flex;

  /* 或者行内 flex */
  display: inline-flex;
}
```

### 容器属性

```css
.flex-container {
  /* 主轴方向 */
  flex-direction: row | row-reverse | column | column-reverse;

  /* 是否换行 */
  flex-wrap: nowrap | wrap | wrap-reverse;

  /* 主轴对齐 */
  justify-content: flex-start | flex-end | center | space-between | space-around
    | space-evenly;

  /* 交叉轴对齐 */
  align-items: stretch | flex-start | flex-end | center | baseline;

  /* 多行对齐 */
  align-content: flex-start | flex-end | center | space-between | space-around |
    stretch;
}
```

### 项目属性

```css
.flex-item {
  /* 排序 */
  order: 0;

  /* 放大比例 */
  flex-grow: 0;

  /* 缩小比例 */
  flex-shrink: 1;

  /* 基准大小 */
  flex-basis: auto;

  /* flex 简写 */
  flex: none | auto | [ <flex-grow> <flex-shrink>? || <flex-basis>];

  /* 单独对齐方式 */
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

## 2. Grid 布局

### 基本概念

```css
.grid-container {
  /* 开启 grid 布局 */
  display: grid;

  /* 或者行内 grid */
  display: inline-grid;
}
```

### 容器属性

```css
.grid-container {
  /* 定义列 */
  grid-template-columns: 100px 100px 100px;
  /* 或使用 fr 单位 */
  grid-template-columns: 1fr 1fr 1fr;
  /* 或使用 repeat() */
  grid-template-columns: repeat(3, 1fr);

  /* 定义行 */
  grid-template-rows: 100px auto;

  /* 定义网格区域 */
  grid-template-areas:
    "header header header"
    "nav main aside"
    "footer footer footer";

  /* 列间距 */
  column-gap: 20px;

  /* 行间距 */
  row-gap: 20px;

  /* 间距简写 */
  gap: 20px;

  /* 项目对齐方式 */
  justify-items: start | end | center | stretch;
  align-items: start | end | center | stretch;

  /* 内容对齐方式 */
  justify-content: start | end | center | stretch | space-around | space-between
    | space-evenly;
  align-content: start | end | center | stretch | space-around | space-between |
    space-evenly;
}
```

### 项目属性

```css
.grid-item {
  /* 指定项目位置 */
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;

  /* 简写形式 */
  grid-column: 1 / 3;
  grid-row: 1 / 3;

  /* 或者更简单的形式 */
  grid-area: 1 / 1 / 3 / 3;

  /* 使用模板区域名称 */
  grid-area: header;

  /* 单独对齐方式 */
  justify-self: start | end | center | stretch;
  align-self: start | end | center | stretch;
}
```

## 3. 动画

### 关键帧动画

```css
/* 定义动画 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 使用动画 */
.animated-element {
  animation: slideIn 1s ease-out forwards;

  /* 动画属性详解 */
  animation-name: slideIn;
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
```

### 多关键帧动画

```css
@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.pulsing-element {
  animation: pulse 2s ease-in-out infinite;
}
```

## 4. 过渡效果

### 复杂过渡

```css
.complex-transition {
  /* 初始状态 */
  opacity: 0.5;
  transform: scale(1) rotate(0);
  background-color: #fff;

  /* 过渡设置 */
  transition: opacity 0.3s ease-in-out, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s linear;
}

.complex-transition:hover {
  /* 终止状态 */
  opacity: 1;
  transform: scale(1.2) rotate(45deg);
  background-color: #f0f0f0;
}
```

### 过渡时机控制

```css
.staggered-transition {
  transition: all 0.3s;
}

.staggered-transition:hover .child:nth-child(1) {
  transition-delay: 0s;
}

.staggered-transition:hover .child:nth-child(2) {
  transition-delay: 0.1s;
}

.staggered-transition:hover .child:nth-child(3) {
  transition-delay: 0.2s;
}
```

## 5. 阴影效果

### 盒子阴影

```css
.box-shadow-examples {
  /* 基础阴影 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  /* 多重阴影 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 4px 8px rgba(0, 0, 0, 0.1);

  /* 内阴影 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

### 文字阴影

```css
.text-shadow-examples {
  /* 基础文字阴影 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);

  /* 发光效果 */
  text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);

  /* 多重文字阴影 */
  text-shadow: 2px 2px 0 #ff0000, 4px 4px 0 #00ff00;
}
```

## 6. 渐变

### 线性渐变

```css
.gradient-examples {
  /* 基础渐变 */
  background: linear-gradient(to right, #ff0000, #00ff00);

  /* 多色渐变 */
  background: linear-gradient(45deg, #ff0000, #00ff00, #0000ff);

  /* 重复渐变 */
  background: repeating-linear-gradient(
    45deg,
    #ff0000 0px,
    #ff0000 10px,
    #00ff00 10px,
    #00ff00 20px
  );
}
```

### 径向渐变

```css
.radial-gradient-examples {
  /* 基础径向渐变 */
  background: radial-gradient(circle, #ff0000, #00ff00);

  /* 位置控制 */
  background: radial-gradient(circle at top right, #ff0000, #00ff00);

  /* 大小控制 */
  background: radial-gradient(
    circle farthest-corner at center,
    #ff0000,
    #00ff00
  );
}
```

## 7. 滤镜效果

### 基础滤镜

```css
.filter-examples {
  /* 模糊 */
  filter: blur(5px);

  /* 亮度 */
  filter: brightness(150%);

  /* 对比度 */
  filter: contrast(200%);

  /* 灰度 */
  filter: grayscale(100%);

  /* 色相旋转 */
  filter: hue-rotate(90deg);

  /* 反相 */
  filter: invert(100%);

  /* 透明度 */
  filter: opacity(50%);

  /* 饱和度 */
  filter: saturate(200%);

  /* 褐色 */
  filter: sepia(100%);
}
```

### 组合滤镜

```css
.combined-filters {
  filter: contrast(150%) brightness(120%) blur(2px);
}
```

## 8. 混合模式

### 背景混合

```css
.blend-mode-examples {
  /* 背景混合模式 */
  background-blend-mode: multiply;

  /* 多背景混合 */
  background: url("texture.png"), linear-gradient(red, blue);
  background-blend-mode: overlay;
}
```

### 内容混合

```css
.mix-blend-examples {
  /* 元素内容混合 */
  mix-blend-mode: difference;

  /* 隔离混合 */
  isolation: isolate;
}
```

## 9. 自定义属性（CSS 变量）

### 变量定义与使用

```css
:root {
  /* 定义全局变量 */
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing-unit: 8px;
  --max-width: 1200px;
}

.component {
  /* 使用变量 */
  color: var(--primary-color);
  margin: var(--spacing-unit);

  /* 局部变量 */
  --component-padding: 16px;
  padding: var(--component-padding);

  /* 使用默认值 */
  margin: var(--undefined-var, 20px);
}
```

### 动态变量

```css
.theme-switcher {
  --bg-color: #ffffff;

  /* 媒体查询中改变变量值 */
  @media (prefers-color-scheme: dark) {
    --bg-color: #000000;
  }

  background-color: var(--bg-color);
}
```

## 10. 性能优化

### 硬件加速

```css
.hardware-accelerated {
  /* 触发硬件加速 */
  transform: translateZ(0);
  /* 或 */
  will-change: transform;

  /* 3D 变换 */
  transform: translate3d(0, 0, 0);
}
```

### 性能考虑

```css
/* 避免使用昂贵的属性 */
.performance-conscious {
  /* 替代 box-shadow */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));

  /* 使用 transform 而不是改变 top/left */
  transform: translate(100px, 100px);

  /* 避免频繁改变触发布局的属性 */
  width: 100%;
  height: auto;
}
```

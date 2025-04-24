---
title: CSS 基础知识
sidebar_position: 1
---

# CSS 基础知识

## 1. CSS 简介

CSS（层叠样式表）是用于控制网页样式和布局的语言。

### 使用方式

```html
<!-- 1. 内联样式 -->
<div style="color: red;">内联样式</div>

<!-- 2. 内部样式表 -->
<style>
  div {
    color: red;
  }
</style>

<!-- 3. 外部样式表 -->
<link rel="stylesheet" href="styles.css" />
```

## 2. 选择器

### 基础选择器

```css
/* 标签选择器 */
div {
  color: black;
}

/* 类选择器 */
.className {
  font-size: 16px;
}

/* ID选择器 */
#uniqueId {
  background-color: #fff;
}

/* 通配符选择器 */
* {
  margin: 0;
  padding: 0;
}
```

### 组合选择器

```css
/* 后代选择器 */
.parent .child {
  color: blue;
}

/* 子元素选择器 */
.parent > .child {
  color: red;
}

/* 相邻兄弟选择器 */
.sibling + .target {
  color: green;
}

/* 通用兄弟选择器 */
.sibling ~ .target {
  color: yellow;
}
```

### 属性选择器

```css
/* 具有某个属性的元素 */
[type] {
  border: 1px solid black;
}

/* 具有特定属性值的元素 */
[type="text"] {
  padding: 5px;
}

/* 属性值包含特定词的元素 */
[class*="button"] {
  cursor: pointer;
}
```

## 3. 盒模型

### 基本概念

```css
.box {
  /* 内容区域 */
  width: 200px;
  height: 100px;

  /* 内边距 */
  padding: 20px;

  /* 边框 */
  border: 1px solid black;

  /* 外边距 */
  margin: 10px;

  /* 盒模型类型 */
  box-sizing: border-box; /* 或 content-box */
}
```

### margin 折叠

```css
/* 垂直方向的margin会发生折叠 */
.box1 {
  margin-bottom: 20px;
}

.box2 {
  margin-top: 30px;
}
/* 实际间距是30px，取较大值 */
```

## 4. 颜色和背景

### 颜色表示方法

```css
.color-examples {
  /* 关键字 */
  color: red;

  /* 十六进制 */
  color: #ff0000;

  /* RGB */
  color: rgb(255, 0, 0);

  /* RGBA */
  color: rgba(255, 0, 0, 0.5);

  /* HSL */
  color: hsl(0, 100%, 50%);

  /* HSLA */
  color: hsla(0, 100%, 50%, 0.5);
}
```

### 背景属性

```css
.background-example {
  /* 背景颜色 */
  background-color: #f0f0f0;

  /* 背景图片 */
  background-image: url("image.jpg");

  /* 背景重复 */
  background-repeat: no-repeat;

  /* 背景位置 */
  background-position: center center;

  /* 背景大小 */
  background-size: cover;

  /* 简写方式 */
  background: #f0f0f0 url("image.jpg") no-repeat center/cover;
}
```

## 5. 文本样式

### 字体属性

```css
.text-styling {
  /* 字体族 */
  font-family: Arial, sans-serif;

  /* 字体大小 */
  font-size: 16px;

  /* 字体粗细 */
  font-weight: bold;

  /* 字体样式 */
  font-style: italic;

  /* 简写方式 */
  font: italic bold 16px/1.5 Arial, sans-serif;
}
```

### 文本属性

```css
.text-properties {
  /* 文本对齐 */
  text-align: center;

  /* 文本装饰 */
  text-decoration: underline;

  /* 行高 */
  line-height: 1.5;

  /* 字母间距 */
  letter-spacing: 1px;

  /* 单词间距 */
  word-spacing: 2px;

  /* 文本转换 */
  text-transform: uppercase;
}
```

## 6. 显示与定位

### display 属性

```css
.display-types {
  /* 块级元素 */
  display: block;

  /* 行内元素 */
  display: inline;

  /* 行内块元素 */
  display: inline-block;

  /* 隐藏元素 */
  display: none;
}
```

### position 属性

```css
.positioning {
  /* 相对定位 */
  position: relative;
  top: 10px;
  left: 20px;

  /* 绝对定位 */
  position: absolute;
  top: 0;
  right: 0;

  /* 固定定位 */
  position: fixed;
  bottom: 20px;
  right: 20px;

  /* 粘性定位 */
  position: sticky;
  top: 0;
}
```

## 7. 浮动布局

### 基本浮动

```css
.float-layout {
  /* 向左浮动 */
  float: left;

  /* 向右浮动 */
  float: right;

  /* 清除浮动 */
  clear: both;
}
```

### 清除浮动

```css
/* 使用伪元素清除浮动 */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

/* 或使用 overflow */
.container {
  overflow: hidden;
}
```

## 8. 常见单位

### 绝对单位

```css
.absolute-units {
  /* 像素 */
  width: 100px;

  /* 英寸 */
  margin: 1in;

  /* 厘米 */
  padding: 1cm;

  /* 毫米 */
  border: 1mm solid black;
}
```

### 相对单位

```css
.relative-units {
  /* 相对于根元素的字体大小 */
  font-size: 1rem;

  /* 相对于父元素的字体大小 */
  padding: 1.5em;

  /* 视口宽度的1% */
  width: 50vw;

  /* 视口高度的1% */
  height: 50vh;

  /* 相对于父元素的宽度的百分比 */
  margin: 10%;
}
```

## 9. 转换与过渡

### 基本变换

```css
.transform-examples {
  /* 平移 */
  transform: translate(100px, 50px);

  /* 旋转 */
  transform: rotate(45deg);

  /* 缩放 */
  transform: scale(1.5);

  /* 倾斜 */
  transform: skew(10deg);

  /* 组合变换 */
  transform: translate(100px) rotate(45deg) scale(1.5);
}
```

### 简单过渡

```css
.transition-example {
  /* 单个属性过渡 */
  transition: background-color 0.3s ease;

  /* 多个属性过渡 */
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.transition-example:hover {
  background-color: blue;
  transform: scale(1.1);
}
```

## 10. 响应式设计基础

### 视口设置

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### 媒体查询

```css
/* 基本媒体查询 */
@media screen and (max-width: 768px) {
  .container {
    width: 100%;
  }
}

/* 多条件媒体查询 */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .container {
    width: 750px;
  }
}
```

### 响应式图片

```css
.responsive-image {
  max-width: 100%;
  height: auto;
}

/* 响应式背景图片 */
.responsive-background {
  background-image: url("large.jpg");
  background-size: cover;
}

@media screen and (max-width: 768px) {
  .responsive-background {
    background-image: url("small.jpg");
  }
}
```

---
title: CSS 高频面试题
sidebar_position: 1
---

## 核心知识点

- 选择器优先级、继承、层叠
- 盒模型、BFC、margin 合并
- Flex 布局、Grid 布局
- 浮动、定位、清除浮动
- 响应式设计、媒体查询
- 动画与过渡
- CSS 预处理器（Sass/Less）
- 常见布局方案（圣杯/双飞翼/自适应等）

## 高频面试题

### 1. 说说盒模型的理解？

- 标准盒模型：width=内容区宽度，IE 盒模型：width=内容+padding+border。

### 2. 选择器优先级如何计算？

- !important > 内联样式 > id > class/属性/伪类 > 标签/伪元素 > 通配符。

### 3. 什么是 BFC？

- 块级格式化上下文，解决浮动、margin 重叠等问题。

### 4. 如何实现水平垂直居中？

- flex 布局、grid 布局、绝对定位+transform、line-height 等。

### 5. 清除浮动的方式？

- 父元素 overflow:hidden、clearfix 伪元素、display:flow-root。

### 6. Flex 和 Grid 区别？

- Flex 一维布局，Grid 二维布局。

### 7. 响应式设计常用方法？

- 媒体查询、百分比/弹性单位、rem/em、vw/vh、flex/grid。

### 8. 伪类和伪元素区别？

- 伪类(:hover)是状态，伪元素(::before)是结构。

### 9. 如何隐藏元素？

- display:none、visibility:hidden、opacity:0、移出视口。

### 10. 动画和过渡的区别？

- 过渡是状态变化触发，动画可自定义关键帧。

### 11. 如何实现三栏/圣杯/双飞翼布局？

- float、flex、grid、绝对定位等多种方式。

### 12. rem 和 em 区别？

- rem 相对根元素，em 相对父元素。

### 13. 如何制作一个自适应正方形？

- 利用 padding 百分比或 aspect-ratio。

### 14. 如何实现图片等比缩放？

- max-width:100%；height:auto。

### 15. CSS 如何实现文本溢出省略号？

- 单行：overflow:hidden; white-space:nowrap; text-overflow:ellipsis;
- 多行：display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;

---

# 代码题示例

## 1. 圣杯布局（flex 版）

```css
.container {
  display: flex;
}
.left,
.right {
  width: 200px;
}
.center {
  flex: 1;
}
```

## 2. 垂直居中（flex 版）

```css
.parent {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## 3. 多行文本溢出省略号

```css
.ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

---

# 面试技巧

- 多画图，结合实际项目
- 理解布局原理，能手写常见布局
- 关注新特性（flex、grid、变量、aspect-ratio）
- 不懂的题目坦诚说明思路

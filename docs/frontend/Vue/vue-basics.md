---
title: Vue 基础知识
sidebar_position: 1
---

## Vue 实例创建

```js
const app = Vue.createApp({
  data() {
    return {
      message: "Hello Vue!",
    };
  },
});
```

## 基础语法

### 模板语法

- 文本插值：使用 `{{ }}` 语法
- 指令：v-bind, v-on, v-if, v-for 等
- 动态属性绑定：:attribute
- 事件处理：@event

### 组件基础

```vue
// 组件注册 app.component('my-component', { props: ['title'], template: `
<div class="component">
      <h3>{{ title }}</h3>
    </div>
` })
```

## 核心概念

### 1. 响应式数据

- ref：用于基本类型数据
- reactive：用于对象类型数据
- computed：计算属性
- watch：侦听器

### 2. 生命周期钩子

- setup()
- onMounted()
- onUpdated()
- onUnmounted()

### 3. 组件通信

- Props 父传子
- Emit 子传父
- Provide/Inject
- EventBus

### 4. 条件渲染

```vue
<template>
  <div v-if="condition">满足条件时显示</div>
  <div v-else>不满足条件时显示</div>
</template>
```

### 5. 列表渲染

```vue
<template>
  <ul>
    <li v-for="(item, index) in items" :key="index">
      {{ item.name }}
    </li>
  </ul>
</template>
```

### 6. 表单处理

- v-model 双向绑定
- 表单验证
- 修饰符：.lazy, .number, .trim

## 最佳实践

1. 始终使用 key 配合 v-for
2. 组件名使用多词命名
3. Props 定义尽可能详细
4. 避免 v-if 和 v-for 一起使用
5. 使用组合式 API 组织代码

## 工具和开发环境

1. Vue CLI / Vite
2. Vue DevTools
3. VS Code + Volar
4. ESLint + Prettier

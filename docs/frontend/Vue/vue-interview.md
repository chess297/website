---
sidebar_position: 4
---

# Vue 面试题

## 1. Vue 基础概念

### Q: Vue 2 和 Vue 3 的主要区别是什么？

A: 主要区别包括：

1. 响应式系统：
   - Vue 2 使用 Object.defineProperty
   - Vue 3 使用 Proxy，性能更好，功能更完整
2. 组合式 API：
   - Vue 3 引入组合式 API，提供更灵活的代码组织方式
3. 性能提升：
   - 更小的包体积
   - 更好的 Tree-shaking
   - 编译优化

### Q: Vue 的响应式原理是什么？

A: Vue 3 的响应式原理：

1. 使用 Proxy 拦截对象的访问和修改
2. 通过 track 收集依赖
3. 通过 trigger 触发更新
4. 实现原理示例：

```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key);
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      trigger(target, key);
      return true;
    },
  });
}
```

## 2. 组件相关

### Q: 组件通信有哪些方式？

A: 主要的通信方式：

1. props/emit：父子组件通信
2. provide/inject：跨层级组件通信
3. Vuex/Pinia：全局状态管理
4. EventBus：事件总线（不推荐）
5. refs：直接访问子组件

### Q: 说说你对插槽的理解？

A: 插槽分为：

1. 默认插槽
2. 具名插槽
3. 作用域插槽

```vue
<!-- 父组件 -->
<template>
  <Child>
    <template #default="{ data }">
      {{ data }}
    </template>
  </Child>
</template>

<!-- 子组件 -->
<template>
  <slot :data="data"></slot>
</template>
```

## 3. 生命周期

### Q: Vue 3 的生命周期钩子有哪些？

A: 主要的生命周期钩子：

1. setup()
2. onBeforeMount()
3. onMounted()
4. onBeforeUpdate()
5. onUpdated()
6. onBeforeUnmount()
7. onUnmounted()
8. onErrorCaptured()

### Q: setup 和 created 的区别？

A:

- setup 是组合式 API 的入口，在创建组件实例时就调用，早于 beforeCreate
- created 是选项式 API 的生命周期钩子，在实例创建后调用
- setup 中无法访问 this，而 created 中可以

## 4. 性能优化

### Q: Vue 项目如何做性能优化？

A: 主要优化方向：

1. 编码优化：

   - 使用 computed 缓存
   - v-show vs v-if 合理使用
   - keep-alive 缓存组件
   - 合理使用异步组件

2. 打包优化：

   - 路由懒加载
   - Tree-shaking
   - 代码分割
   - CDN 加速

3. 运行时优化：
   - 虚拟列表
   - 防抖节流
   - Web Workers
   - 服务端渲染

## 5. 状态管理

### Q: Vuex 和 Pinia 的区别？

A: 主要区别：

1. 设计理念：

   - Vuex 基于模块化设计
   - Pinia 采用 stores 的概念，更简单直接

2. TypeScript 支持：

   - Pinia 对 TS 支持更好
   - 自动类型推导

3. 开发体验：
   - Pinia 不需要 mutations
   - 可以直接修改状态
   - 更好的代码分割

## 6. 路由

### Q: Vue Router 的导航守卫有哪些？

A: 主要的导航守卫：

1. 全局守卫：

   - beforeEach
   - afterEach
   - beforeResolve

2. 路由独享守卫：

   - beforeEnter

3. 组件内守卫：
   - beforeRouteEnter
   - beforeRouteUpdate
   - beforeRouteLeave

## 7. 高级特性

### Q: Vue 3 中的 Composition API 对比 Options API 有什么优势？

A: 主要优势：

1. 更好的代码组织
2. 更好的逻辑复用
3. 更好的类型推导
4. 更小的包体积

### Q: 如何实现动态组件？

A:

```vue
<template>
  <component :is="currentComponent" />
</template>

<script>
export default {
  data() {
    return {
      currentComponent: "ComponentA",
    };
  },
};
</script>
```

## 8. 工程化

### Q: 如何处理跨域问题？

A: 主要解决方案：

1. 开发环境：

   ```js
   // vue.config.js
   module.exports = {
     devServer: {
       proxy: {
         "/api": {
           target: "http://example.com",
           changeOrigin: true,
         },
       },
     },
   };
   ```

2. 生产环境：
   - Nginx 反向代理
   - CORS 配置
   - 后端接口配置

### Q: Vue 项目如何做单元测试？

A: 主要测试方案：

1. 测试工具：

   - Vue Test Utils
   - Jest
   - Vitest

2. 测试内容：
   - 组件渲染
   - 用户交互
   - 生命周期
   - Vuex/Pinia
   - 异步操作

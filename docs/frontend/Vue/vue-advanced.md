---
title: Vue 进阶知识
sidebar_position: 2
---

## 1. 组合式 API 深入

### setup 函数

```js
import { ref, onMounted } from "vue";

export default {
  setup() {
    const count = ref(0);

    onMounted(() => {
      console.log("组件已挂载");
    });

    return { count };
  },
};
```

### 组合式函数（Composables）

```js
// useCounter.js
import { ref } from "vue";

export function useCounter() {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return { count, increment };
}
```

## 2. 自定义指令

```js
app.directive("focus", {
  mounted(el) {
    el.focus();
  },
});
```

## 3. 插件开发

```js
const myPlugin = {
  install(app, options) {
    // 添加全局属性
    app.config.globalProperties.$myMethod = () => {};

    // 注册全局组件
    app.component("MyGlobalComponent", {});

    // 注入全局方法
    app.provide("key", "value");
  },
};
```

## 4. 高级组件模式

### 异步组件

```js
const AsyncComponent = defineAsyncComponent(() =>
  import("./components/AsyncComponent.vue")
);
```

### 函数式组件

```js
const FunctionalComponent = (props, context) => {
  return h("div", context.attrs, props.text);
};
```

### 递归组件

```vue
<template>
  <div v-if="treeData">
    {{ treeData.label }}
    <TreeComponent
      v-for="child in treeData.children"
      :key="child.id"
      :tree-data="child"
    />
  </div>
</template>
```

## 5. 性能优化

### 1. 虚拟列表

- vue-virtual-scroller 使用
- 自定义虚拟列表实现

### 2. 组件懒加载

- 路由懒加载
- 组件异步加载
- 图片懒加载

### 3. 状态管理优化

- Vuex/Pinia 模块化
- 合理的状态拆分
- Action 队列管理

## 6. 路由进阶

### 导航守卫

```js
router.beforeEach((to, from, next) => {
  // 权限验证逻辑
  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});
```

### 路由元信息

```js
const routes = [
  {
    path: "/admin",
    meta: {
      requiresAuth: true,
      roles: ["admin"],
    },
  },
];
```

## 7. 动画和过渡

### 列表过渡

```vue
<template>
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
</template>
```

### 状态过渡

```js
watch(count, (newCount, oldCount) => {
  gsap.to(element, {
    duration: 0.5,
    value: newCount,
  });
});
```

## 8. 测试策略

### 单元测试

- Vue Test Utils
- Jest 配置
- 组件测试
- Vuex/Pinia 测试

### E2E 测试

- Cypress
- Playwright
- 测试用例编写
- CI/CD 集成

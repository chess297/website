---
title: React 高频面试题
sidebar_position: 5
---

本页整理了 React 面试中常见的高频问题及简要答案，适合面试前快速查阅和自测。

## 1. React 的核心理念是什么？

- 声明式 UI、组件化、单向数据流、虚拟 DOM。

## 2. 说说 React 的生命周期（类组件）

- 挂载：constructor → getDerivedStateFromProps → render → componentDidMount
- 更新：getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate
- 卸载：componentWillUnmount

## 3. 函数组件如何实现副作用？

- 使用 useEffect。

```jsx
useEffect(() => {
  // 副作用逻辑
  return () => {
    // 清理逻辑
  };
}, [deps]);
```

## 4. 说说 useState 和 useReducer 的区别

- useState 适合简单状态，useReducer 适合复杂/多状态逻辑。

## 5. 说说 useCallback 和 useMemo 的区别

- useCallback 记忆回调函数，useMemo 记忆计算结果。

## 6. 组件通信方式有哪些？

- props、context、回调函数、全局状态管理（Redux、MobX）、自定义事件等。

## 7. React 性能优化常用手段？

- React.memo、useMemo、useCallback、shouldComponentUpdate、PureComponent、代码分割、虚拟列表、事件委托等。

## 8. 说说虚拟 DOM 的原理

- 用 JS 对象描述 DOM 结构，diff 算法找出变化，最小化真实 DOM 操作。

## 9. 受控组件和非受控组件区别？

- 受控组件由 state 控制，非受控组件由 DOM 自己管理。

## 10. 说说 React 中的 key 有什么作用？

- 帮助 React 区分元素身份，提升列表渲染性能，避免不必要的重渲染。

## 11. 介绍一下 React 事件机制

- 合成事件，跨浏览器兼容，事件委托到根节点。

## 12. 说说 Context 的使用场景和注意点

- 用于跨层级传递数据，避免 props drilling。注意不要滥用，避免组件过度重渲染。

## 13. 说说 React 的代码分割实现方式

- React.lazy、Suspense、动态 import。

## 14. 说说 SSR/SSG 的原理和优缺点

- SSR：服务端渲染，首屏快、SEO 好，但服务器压力大。
- SSG：静态生成，适合内容不常变的网站。

## 15. 常见的 React 性能分析工具有哪些？

- React DevTools、Profiler、Lighthouse、webpack-bundle-analyzer。

---

# 代码题示例

## 1. 实现一个自定义 Hook：usePrevious

```jsx
import { useRef, useEffect } from "react";
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
```

## 2. 实现防抖 Hook：useDebounce

```jsx
import { useState, useEffect } from "react";
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}
```

## 3. 虚拟列表的基本实现思路？

- 只渲染可视区域的元素，常用库：react-window、react-virtualized。

## 4. 组件如何避免重复渲染？

- 使用 React.memo、useMemo、useCallback，合理拆分组件。

---

# 面试技巧

- 回答时结合实际项目经验
- 代码题尽量写出可运行的代码
- 不懂的题目坦诚说明思路
- 多用“为什么”解释背后的原理

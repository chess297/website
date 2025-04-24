---
title: JavaScript 高频面试题
sidebar_position: 1
---

## 核心知识点

- 变量声明（var/let/const）与作用域、提升
- 数据类型与类型转换
- 原型与原型链、继承
- 闭包、this、作用域链
- 异步编程（Promise、async/await、事件循环）
- 深浅拷贝、== 与 === 区别
- 防抖/节流、事件委托
- ES6+ 新特性（解构、展开、箭头函数、模块化等）
- DOM/BOM 操作

## 高频面试题

### 1. 说说 var/let/const 区别？

- var 有变量提升、函数/全局作用域，可重复声明。
- let/const 无提升、块级作用域，不可重复声明，const 声明常量。

### 2. 解释原型和原型链

- 每个对象有 **proto** 指向其构造函数 prototype，形成链式结构，查找属性时沿原型链查找。

### 3. 什么是闭包？

- 闭包是函数和其词法作用域的组合，常用于数据私有化、工厂函数等。

### 4. this 的几种绑定方式？

- 默认绑定、隐式绑定、显示绑定（call/apply/bind）、new 绑定、箭头函数不绑定 this。

### 5. 事件循环和微任务/宏任务？

- JS 单线程，事件循环机制，微任务（Promise.then、MutationObserver）优先于宏任务（setTimeout、setInterval）。

### 6. 如何实现深拷贝？

- JSON.parse(JSON.stringify(obj))（有缺陷），递归遍历，或使用 lodash 的 cloneDeep。

### 7. == 和 === 区别？

- == 会类型转换，=== 严格相等不转换类型。

### 8. Promise 的状态有哪些？

- pending、fulfilled、rejected。

### 9. 如何实现防抖和节流？

- 防抖：n 秒后只执行一次，节流：n 秒内只执行一次。

### 10. 如何判断数组？

- Array.isArray(obj)

### 11. 解释 call、apply、bind 区别？

- call/apply 立即调用，参数不同，bind 返回新函数。

### 12. 说说 ES6 的常用新特性

- let/const、解构、展开、箭头函数、模板字符串、Promise、模块化、Set/Map、Class 等。

### 13. 如何实现继承？

- 原型链继承、构造函数继承、组合继承、ES6 class extends。

### 14. 什么是事件委托？

- 利用事件冒泡，将事件绑定到父元素，通过 e.target 判断来源。

### 15. typeof null 是什么？为什么？

- object，历史遗留 bug。

---

# 代码题示例

## 1. 实现数组去重

```js
function unique(arr) {
  return [...new Set(arr)];
}
```

## 2. 实现防抖函数 debounce

```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

## 3. 实现节流函数 throttle

```js
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last > delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}
```

---

# 面试技巧

- 多用代码举例，结合项目经验
- 理解原理，能画图更佳
- 不懂的题目坦诚说明思路
- 关注 ES6+ 新特性和异步编程

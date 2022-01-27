---
title: Vue概览
tags: [Vue]
---

vue算是一个非常🔥的一个前端框架了，特别是国内，尤其的火爆。vue3出来之后，把vue2的很多缺点都弥补了，并且拥抱了TypeScript，妥妥的快乐。

## 底层原理核心

### 一些重要概念

- `compiler`，编译模块，将html模板编译成`ast`语法树，然后再编译成`render`函数
- ` Dep`类，主要用于数据劫持后，调用get进行的依赖收集
- `Watcher`类，主要用于观察被Dep劫持的数据
  - 渲染`Watcher`，Dep派发数据set之后，触发组件update
  - 计算`Watcher`，Dep派发数据set之后，触发数据计算
  - 监听`Watcher`，Dep派发数据set之后，触发用户对数据的监听回调

### 初始化到页面渲染

[1.初始化构造函数](./vue/Vue2/原理/初始化Vue构造器)  
[2.new Vue()](./vue/Vue2/原理/初始化Vue构造器)  
[3.依赖手机 Object.defineProperty](./vue/Vue2/原理/初始化Vue构造器)  
[4.render函数生成vnode，update渲染页面](./vue/Vue2/原理/初始化Vue构造器)  


### 页面更新机制

先理解几个概念：
- 依赖收集：每个组件会绑定一个Watcher对象，每个属性会绑定一个Dep对象，每个Dep对象又会收集引用了这个对象的组件的Watcher对象
- 观察者监听：属性修改，会触发对应Dep对象的notify方法通知 Watcher队列进行更新
- Watcher分为渲染Watcher和用户Watcher，渲染Watcher主要用于监听数据变化执行页面update更新的，用户Watcher是用于用户使用watcher方法监听数据变化的

会有两个队列：  
一、更新函数队列，包含nextTick和watcher的函数队列；  
二、Watcher的页面渲染队列  

1. 首次渲染直接执行update显示页面
2. 通过依赖收集，每个属性的Dep对象会收集到引用到这个属性的Watcher对象，修改属性会通过Dep的notify触发Watcher的update方法
3. update方法会将自身加入到一个页面渲染的更新队列中，准备好所有的更新
4. 等到事件循环调用，并且上个任务执行完毕，会触发更新函数队列执行。

### 组件化

## 最佳实践

### 融合TypeSciprt

### 自建组件库

### 性能优化


## 其他

### Vue周边生态：
- [Vuex](https://next.vuex.vuejs.org/zh/index.html)
- [VueRouter](https://next.vuex.vuejs.org/zh/index.html)
- [ElementUI](https://element-plus.gitee.io/zh-CN/component/button.html)

### 参考资料：
- [Vue2](https://cn.vuejs.org/)
- [Vue3](https://v3.cn.vuejs.org/)


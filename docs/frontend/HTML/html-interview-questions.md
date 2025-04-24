---
title: HTML 高频面试题
sidebar_position: 1
---

## 核心知识点

- HTML5 新特性（语义化标签、音视频、表单增强、离线存储等）
- 语义化、可访问性（a11y）
- DOM 结构与节点类型
- 常用 meta 标签
- 跨域与安全（CSP、XSS、CSRF）
- SEO 基础
- 本地存储（localStorage、sessionStorage、cookie）
- 表单与校验

## 高频面试题

### 1. HTML5 有哪些新特性？

- 语义化标签、音视频、canvas、表单增强、localStorage、sessionStorage、Web Worker、离线缓存等。

### 2. 语义化标签的作用？

- 提升可读性、SEO、可访问性。

### 3. 常见的 meta 标签有哪些？

- charset、viewport、keywords、description、http-equiv、robots。

### 4. 如何实现页面重定向？

- meta refresh、location.href、HTTP 3xx。

### 5. localStorage、sessionStorage、cookie 区别？

- localStorage 永久存储，sessionStorage 会话级，cookie 可设置过期、支持 http 传递。

### 6. 如何防止 XSS 攻击？

- 输入校验、输出转义、CSP、安全 API。

### 7. 如何提升页面性能？

- 资源压缩合并、懒加载、CDN、缓存、预加载、减少重排重绘。

### 8. 什么是跨域？如何解决？

- 同源策略限制，解决：CORS、JSONP、postMessage、代理等。

### 9. 如何实现图片懒加载？

- 原生 loading="lazy"、IntersectionObserver、手动监听滚动。

### 10. 如何实现自适应布局？

- 媒体查询、弹性单位、viewport、rem、flex/grid。

### 11. 如何实现 SEO 优化？

- 语义化标签、合理 title/description、robots、结构化数据、服务端渲染。

### 12. input 有哪些类型？

- text、password、email、number、date、file、checkbox、radio、range、color 等。

### 13. 如何实现表单校验？

- 原生 required、pattern、type，JS 自定义校验。

### 14. 什么是可访问性（a11y）？

- 让残障人士也能访问，常用 aria-\* 属性、语义化标签、键盘操作支持。

### 15. script 标签的 defer 和 async 区别？

- defer：文档解析完后按顺序执行，async：下载完立即执行，顺序不保证。

---

# 代码题示例

## 1. HTML5 语义化结构示例

```html
<header>
  <nav>导航</nav>
</header>
<main>
  <article>内容</article>
  <aside>侧边栏</aside>
</main>
<footer>页脚</footer>
```

## 2. 图片懒加载

```html
<img src="img.jpg" loading="lazy" />
```

## 3. 自定义表单校验

```html
<input type="text" required pattern="[A-Za-z]{3,}" />
```

---

# 面试技巧

- 关注语义化、可访问性和安全
- 结合 SEO、性能优化实际场景
- 不懂的题目坦诚说明思路

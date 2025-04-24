---
title: JavaScript 高级知识
sidebar_position: 4
---

# JavaScript 高级知识

## 1. JavaScript 引擎和执行过程

现代 JavaScript 引擎（V8、SpiderMonkey、JavaScriptCore 等）采用 JIT（即时编译）技术，结合了解释执行和编译执行的优点。

### 执行过程

JavaScript 代码的执行主要包含以下阶段：

1. **解析（Parsing）**：源代码被解析成抽象语法树（AST）
2. **编译（Compilation）**：AST 被转换为字节码，或直接被 JIT 编译为机器码
3. **执行（Execution）**：执行字节码或机器码
4. **优化（Optimization）**：监控代码运行情况，对热点代码进行优化

### V8 引擎工作流程

```
源代码 → Parser → AST → Ignition(解释器) → 字节码 → TurboFan(编译器) → 优化的机器码
```

V8 的两阶段处理：

- **Ignition**：将 AST 转为字节码并执行，收集类型信息
- **TurboFan**：基于类型反馈进行优化，将热点代码编译为高效的机器码

### 隐藏类和内联缓存

V8 引擎使用两项重要优化技术：

```javascript
// 隐藏类示例
function Point(x, y) {
  this.x = x;
  this.y = y;
}

// 创建相同隐藏类的对象
const p1 = new Point(1, 2);
const p2 = new Point(3, 4);

// 破坏隐藏类的行为
const p3 = new Point(5, 6);
p3.z = 7; // 创建新的隐藏类

// 建议总是以相同顺序初始化对象属性
function Person() {
  this.name = ""; // 始终先初始化所有属性
  this.age = 0;
}
```

## 2. 元编程技术

元编程是编写能够操作代码（如读取、生成或修改）的代码，JavaScript 提供了多种元编程特性。

### Symbol

Symbol 是 ES6 引入的原始数据类型，用于创建唯一的标识符。

```javascript
// 创建 Symbol
const mySymbol = Symbol("描述");
const mySymbol2 = Symbol("描述"); // mySymbol !== mySymbol2

// 全局 Symbol
const globalSymbol = Symbol.for("全局键");
const sameGlobalSymbol = Symbol.for("全局键"); // globalSymbol === sameGlobalSymbol

// 内置 Symbol
const obj = {
  [Symbol.iterator]: function* () {
    yield 1;
    yield 2;
  },
};

// 遍历对象
for (const item of obj) {
  console.log(item); // 1, 2
}
```

### 反射 API

Reflect 提供了用于拦截 JavaScript 操作的方法。

```javascript
// 对象属性操作
const obj = { x: 1, y: 2 };
Reflect.has(obj, "x"); // true
Reflect.get(obj, "x"); // 1
Reflect.set(obj, "z", 3); // true
Reflect.deleteProperty(obj, "y"); // true
Reflect.ownKeys(obj); // ['x', 'z']

// 函数调用与构造
function greet(name) {
  this.message = `Hello ${name}`;
}
const context = {};
Reflect.apply(greet, context, ["张三"]); // 函数应用
console.log(context.message); // "Hello 张三"

const instance = Reflect.construct(greet, ["李四"]); // 构造对象
console.log(instance.message); // "Hello 李四"
```

### 代理 Proxy

Proxy 对象用于创建一个对另一个对象的访问进行拦截和自定义操作的对象。

```javascript
const target = {
  name: "张三",
  age: 30,
};

const handler = {
  // 拦截属性读取
  get(target, prop, receiver) {
    console.log(`正在获取 ${prop} 属性`);
    return Reflect.get(target, prop, receiver);
  },

  // 拦截属性设置
  set(target, prop, value, receiver) {
    if (prop === "age" && typeof value !== "number") {
      throw new TypeError("age 必须是数字");
    }
    console.log(`正在设置 ${prop} = ${value}`);
    return Reflect.set(target, prop, value, receiver);
  },

  // 拦截 in 操作符
  has(target, prop) {
    console.log(`正在检查 ${prop} 是否存在`);
    return Reflect.has(target, prop);
  },

  // 拦截 delete 操作
  deleteProperty(target, prop) {
    console.log(`正在删除 ${prop}`);
    return Reflect.deleteProperty(target, prop);
  },
};

const proxy = new Proxy(target, handler);

proxy.name; // "正在获取 name 属性"
proxy.age = 31; // "正在设置 age = 31"
"name" in proxy; // "正在检查 name 是否存在"
delete proxy.age; // "正在删除 age"
```

### 装饰器 (Decorators)

装饰器是用于修改类和类成员的特殊声明，目前处于 TC39 提案阶段。

```javascript
// 类装饰器
function logged(constructorFn) {
  console.log(`创建类: ${constructorFn.name}`);
  return constructorFn;
}

// 方法装饰器
function measure(target, name, descriptor) {
  const original = descriptor.value;

  descriptor.value = function (...args) {
    console.time(name);
    const result = original.apply(this, args);
    console.timeEnd(name);
    return result;
  };

  return descriptor;
}

@logged
class Example {
  @measure
  doSomething(x) {
    console.log(`执行计算，参数: ${x}`);
    return x * 2;
  }
}

const example = new Example();
example.doSomething(42);
```

## 3. Web API 和 DOM 操作

### DOM 高级操作

```javascript
// DocumentFragment - 高效 DOM 操作
function renderList(data) {
  const fragment = document.createDocumentFragment();

  data.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    fragment.appendChild(li);
  });

  document.getElementById("list").appendChild(fragment);
}

// MutationObserver - 监听 DOM 变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log("DOM 变化:", mutation.type);
    console.log("变化的节点:", mutation.target);
  });
});

observer.observe(document.body, {
  childList: true, // 监听子节点变化
  attributes: true, // 监听属性变化
  subtree: true, // 监听所有后代节点
});

// 虚拟 DOM 基本原理
function createElement(type, props, ...children) {
  return { type, props, children };
}

function createDOMNode(vNode) {
  if (typeof vNode === "string") {
    return document.createTextNode(vNode);
  }

  const element = document.createElement(vNode.type);

  // 设置属性
  for (const [key, value] of Object.entries(vNode.props || {})) {
    element.setAttribute(key, value);
  }

  // 添加子节点
  vNode.children.forEach((child) => {
    element.appendChild(createDOMNode(child));
  });

  return element;
}

const vNode = createElement(
  "div",
  { class: "container" },
  createElement("h1", {}, "标题"),
  createElement("p", {}, "内容")
);

document.body.appendChild(createDOMNode(vNode));
```

### Web Workers

Web Workers 允许在后台线程执行 JavaScript，不会阻塞主线程。

```javascript
// main.js - 主线程
const worker = new Worker("worker.js");

worker.addEventListener("message", (event) => {
  console.log("从Worker收到结果:", event.data);
});

worker.postMessage({
  numbers: Array.from({ length: 10000000 }, (_, i) => i),
});

// worker.js - 工作线程
self.addEventListener("message", (event) => {
  const { numbers } = event.data;

  // 耗时计算
  const sum = numbers.reduce((a, b) => a + b, 0);

  self.postMessage({ sum });
});
```

### ServiceWorker

ServiceWorker 是一种特殊的 Web Worker，可以拦截网络请求并缓存资源，实现离线应用。

```javascript
// 注册 ServiceWorker
navigator.serviceWorker
  .register("/sw.js")
  .then((registration) => {
    console.log("ServiceWorker 注册成功:", registration.scope);
  })
  .catch((error) => {
    console.error("ServiceWorker 注册失败:", error);
  });

// sw.js - ServiceWorker 文件
const CACHE_NAME = "my-site-cache-v1";
const urlsToCache = ["/", "/styles.css", "/script.js"];

// 安装事件 - 预缓存资源
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 拦截请求
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存命中 - 返回缓存的响应
      if (response) {
        return response;
      }

      // 未命中 - 获取网络响应并缓存
      return fetch(event.request).then((response) => {
        // 检查是否有效响应
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // 克隆响应（因为响应流只能被消费一次）
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
```

## 4. 高级异步模式

### 可取消的 Promise

原生 Promise 不支持取消，但我们可以实现可取消的 Promise：

```javascript
function createCancelablePromise(promise) {
  let isCanceled = false;

  // 包装原始 Promise
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (value) => (isCanceled ? reject({ isCanceled: true }) : resolve(value)),
      (error) => (isCanceled ? reject({ isCanceled: true }) : reject(error))
    );
  });

  // 添加取消方法
  return {
    promise: wrappedPromise,
    cancel: () => {
      isCanceled = true;
    },
  };
}

// 使用示例
function fetchData() {
  return new Promise((resolve) => setTimeout(() => resolve("数据"), 5000));
}

const { promise, cancel } = createCancelablePromise(fetchData());

promise
  .then((data) => console.log("收到数据:", data))
  .catch((error) => {
    if (error.isCanceled) {
      console.log("请求已被取消");
    } else {
      console.error("发生错误:", error);
    }
  });

// 3秒后取消
setTimeout(() => {
  cancel();
  console.log("取消已请求");
}, 3000);
```

### Generator 异步控制流

Generator 可以用于控制异步流程。

```javascript
function* fetchSequence() {
  try {
    const users = yield fetch("/users").then((r) => r.json());
    console.log("用户列表:", users);

    const user = yield fetch(`/users/${users[0].id}`).then((r) => r.json());
    console.log("用户详情:", user);

    const posts = yield fetch(`/users/${user.id}/posts`).then((r) => r.json());
    console.log("用户帖子:", posts);

    return { user, posts };
  } catch (error) {
    console.error("操作失败:", error);
  }
}

// 手动执行 Generator
function run(generator) {
  const iterator = generator();

  function iterate(result) {
    if (result.done) return Promise.resolve(result.value);

    return Promise.resolve(result.value)
      .then((value) => iterate(iterator.next(value)))
      .catch((error) => iterate(iterator.throw(error)));
  }

  return iterate(iterator.next());
}

run(fetchSequence).then((result) => {
  console.log("所有操作完成:", result);
});
```

### 响应式编程

使用 RxJS 库进行响应式编程。

```javascript
// 需要先安装: npm install rxjs

import { fromEvent, interval } from "rxjs";
import {
  map,
  filter,
  throttleTime,
  takeUntil,
  switchMap,
} from "rxjs/operators";

// 简单示例：从点击事件到响应
const button = document.getElementById("myButton");

fromEvent(button, "click")
  .pipe(
    throttleTime(1000), // 节流，每秒最多响应一次
    map((event) => event.clientX), // 转换事件为坐标
    filter((x) => x > 200) // 只处理 x > 200 的点击
  )
  .subscribe((x) => {
    console.log(`处理点击坐标: ${x}`);
  });

// 复杂示例：拖拽实现
const element = document.getElementById("draggable");

fromEvent(element, "mousedown")
  .pipe(
    switchMap((start) => {
      // 捕获起始位置
      const startX = start.clientX;
      const startY = start.clientY;
      const elemLeft = parseInt(element.style.left) || 0;
      const elemTop = parseInt(element.style.top) || 0;

      // 监听鼠标移动
      return fromEvent(document, "mousemove").pipe(
        map((move) => {
          // 计算新位置
          return {
            left: elemLeft + (move.clientX - startX),
            top: elemTop + (move.clientY - startY),
          };
        }),
        takeUntil(fromEvent(document, "mouseup")) // 鼠标松开时停止
      );
    })
  )
  .subscribe((position) => {
    // 更新元素位置
    element.style.left = `${position.left}px`;
    element.style.top = `${position.top}px`;
  });
```

## 5. Web 安全最佳实践

### XSS 防护

跨站脚本攻击（XSS）是指攻击者将恶意代码插入网页，使其在用户浏览器中执行。

```javascript
// 不安全的实现
function displayMessage(message) {
  document.getElementById("output").innerHTML = message;
}

// 安全实现 - 内容转义
function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function displayMessageSafely(message) {
  document.getElementById("output").textContent = message; // 使用 textContent 而非 innerHTML
  // 或者
  // document.getElementById('output').innerHTML = escapeHTML(message);
}

// 内容安全策略 (CSP)
// 在服务器响应头中添加:
// Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com
```

### CSRF 防护

跨站请求伪造（CSRF）是攻击者诱导用户在已登录网站上执行非预期操作的攻击。

```javascript
// CSRF 防御机制
// 1. 添加 CSRF Token
const csrfToken = getRandomToken(); // 生成随机 token
document.cookie = `csrf_token=${csrfToken}; SameSite=Strict; Secure`;

// 表单中添加隐藏字段
const form = document.getElementById("myForm");
const tokenInput = document.createElement("input");
tokenInput.type = "hidden";
tokenInput.name = "csrf_token";
tokenInput.value = csrfToken;
form.appendChild(tokenInput);

// 2. 发送 AJAX 请求时添加 token
fetch("/api/update", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-CSRF-Token": csrfToken,
  },
  body: JSON.stringify(data),
});

// 3. 使用 SameSite Cookie
document.cookie = "session=value; SameSite=Strict"; // 禁止跨站发送
```

### 其他安全实践

```javascript
// 安全的 iframe 配置
const iframe = document.createElement("iframe");
iframe.src = "https://example.com";
iframe.sandbox = "allow-scripts allow-same-origin"; // 限制 iframe 权限
iframe.allow = "camera: none; microphone: none"; // 限制设备访问
document.body.appendChild(iframe);

// 安全的本地存储使用
function storeData(key, data) {
  // 永远不要存储敏感信息!
  if (containsSensitiveData(data)) {
    console.error("不应在本地存储敏感信息");
    return false;
  }

  localStorage.setItem(key, JSON.stringify(data));
  return true;
}

// 子资源完整性 (SRI)
// <script src="https://cdn.example.com/library.js"
//         integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC"
//         crossorigin="anonymous"></script>
```

## 6. JavaScript 设计模式

### 创建型模式

```javascript
// 单例模式
const Singleton = (function () {
  let instance;

  function createInstance() {
    return {
      publicMethod: function () {
        return "Hello from Singleton!";
      },
      publicProperty: "Test Singleton",
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

// 工厂模式
class UserFactory {
  static createUser(type) {
    switch (type) {
      case "admin":
        return new AdminUser();
      case "regular":
        return new RegularUser();
      case "guest":
        return new GuestUser();
      default:
        throw new Error("无效用户类型");
    }
  }
}

// 建造者模式
class RequestBuilder {
  constructor() {
    this.url = "";
    this.method = "GET";
    this.headers = {};
    this.body = null;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  setMethod(method) {
    this.method = method;
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  setBody(body) {
    this.body = body;
    return this;
  }

  build() {
    return {
      url: this.url,
      method: this.method,
      headers: this.headers,
      body: this.body,
    };
  }
}

// 使用建造者模式
const request = new RequestBuilder()
  .setURL("/api/data")
  .setMethod("POST")
  .setHeader("Content-Type", "application/json")
  .setBody({ name: "张三" })
  .build();
```

### 结构型模式

```javascript
// 装饰器模式
function readonly(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

class Example {
  @readonly
  staticValue() {
    return 42;
  }
}

// 适配器模式
class OldAPI {
  getUsers() {
    return { users: [{ name: "张三", surname: "李" }] };
  }
}

class NewAPI {
  getUsers() {
    return [{ firstName: "张三", lastName: "李" }];
  }
}

class APIAdapter {
  constructor() {
    this.api = new OldAPI();
  }

  getUsers() {
    const data = this.api.getUsers();
    return data.users.map((user) => ({
      firstName: user.name,
      lastName: user.surname,
    }));
  }
}

// 代理模式
const realSubject = {
  request: function () {
    return "响应";
  },
};

const proxySubject = {
  request: function () {
    // 可以在调用真实对象之前执行额外的逻辑
    console.log("代理: 调用真实主体前");
    const result = realSubject.request();
    console.log("代理: 调用真实主体后");
    return result;
  },
};
```

### 行为型模式

```javascript
// 观察者模式
class Subject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data) {
    this.observers.forEach((observer) => observer.update(data));
  }
}

class Observer {
  update(data) {
    console.log("Observer updated with data:", data);
  }
}

// 策略模式
const paymentStrategies = {
  creditCard: function (amount) {
    console.log(`使用信用卡支付 ${amount} 元`);
  },

  paypal: function (amount) {
    console.log(`使用 PayPal 支付 ${amount} 元`);
  },

  wechat: function (amount) {
    console.log(`使用微信支付 ${amount} 元`);
  },
};

function checkout(amount, paymentMethod) {
  return paymentStrategies[paymentMethod](amount);
}

// 命令模式
class Command {
  execute() {}
  undo() {}
}

class AddTextCommand extends Command {
  constructor(editor, text) {
    super();
    this.editor = editor;
    this.text = text;
  }

  execute() {
    this.editor.addText(this.text);
  }

  undo() {
    this.editor.removeText(this.text);
  }
}

class Editor {
  constructor() {
    this.content = "";
  }

  addText(text) {
    this.content += text;
  }

  removeText(text) {
    this.content = this.content.replace(text, "");
  }
}

// 使用命令模式
const editor = new Editor();
const command = new AddTextCommand(editor, "Hello World");
command.execute(); // 添加文本
command.undo(); // 撤销操作
```

## 7. 性能优化高级技巧

### 代码优化

```javascript
// 1. 避免内存泄漏
function createCache() {
  // 使用 WeakMap 存储对象引用，当键对象不再引用时，相关项会被自动垃圾回收
  const cache = new WeakMap();

  return {
    set(key, value) {
      cache.set(key, value);
    },
    get(key) {
      return cache.get(key);
    },
  };
}

// 2. 使用 Web Workers 进行 CPU 密集型计算
function calculatePrimes(max) {
  if (window.Worker) {
    const worker = new Worker("primeWorker.js");

    worker.onmessage = function (e) {
      console.log("找到的质数数量:", e.data);
    };

    worker.postMessage(max);
  } else {
    // 降级处理
  }
}

// primeWorker.js
self.addEventListener("message", function (e) {
  const max = e.data;
  const primes = findPrimes(max);
  self.postMessage(primes.length);
});

function findPrimes(max) {
  // 埃拉托斯特尼筛法
  const sieve = Array(max).fill(true);
  const primes = [];

  for (let i = 2; i < max; i++) {
    if (sieve[i]) {
      primes.push(i);
      for (let j = i * i; j < max; j += i) {
        sieve[j] = false;
      }
    }
  }

  return primes;
}
```

### 渲染性能优化

```javascript
// requestAnimationFrame - 优化动画
function animate() {
  // 执行动画计算和 DOM 更新
  element.style.left = `${position}px`;
  position += 5;

  if (position < 1000) {
    // 与浏览器的渲染周期同步
    requestAnimationFrame(animate);
  }
}

requestAnimationFrame(animate);

// 虚拟列表 - 处理长列表
class VirtualList {
  constructor(container, itemHeight, totalItems, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.renderItem = renderItem;
    this.visibleItems = Math.ceil(container.clientHeight / itemHeight) + 2;
    this.startIndex = 0;
    this.endIndex = this.startIndex + this.visibleItems;

    // 创建滚动容器
    this.scrollContainer = document.createElement("div");
    this.scrollContainer.style.height = `${totalItems * itemHeight}px`;
    this.scrollContainer.style.position = "relative";
    container.appendChild(this.scrollContainer);

    // 添加滚动监听
    container.addEventListener("scroll", this.onScroll.bind(this));

    // 初始渲染
    this.renderItems();
  }

  onScroll() {
    const scrollTop = this.container.scrollTop;
    const newStartIndex = Math.floor(scrollTop / this.itemHeight);

    if (newStartIndex !== this.startIndex) {
      this.startIndex = newStartIndex;
      this.endIndex = this.startIndex + this.visibleItems;
      this.renderItems();
    }
  }

  renderItems() {
    // 清除旧内容
    this.scrollContainer.innerHTML = "";

    // 只渲染可见区域的项目
    for (
      let i = this.startIndex;
      i < this.endIndex && i < this.totalItems;
      i++
    ) {
      const itemEl = this.renderItem(i);
      itemEl.style.position = "absolute";
      itemEl.style.top = `${i * this.itemHeight}px`;
      itemEl.style.height = `${this.itemHeight}px`;
      this.scrollContainer.appendChild(itemEl);
    }
  }
}

// 使用示例
const container = document.getElementById("listContainer");
const virtualList = new VirtualList(
  container,
  50, // 每项高度
  10000, // 总项目数
  (index) => {
    const div = document.createElement("div");
    div.textContent = `项目 #${index}`;
    return div;
  }
);
```

### 网络优化

```javascript
// 预取资源
function prefetchCriticalAssets() {
  // 预取下一页
  const linkRel = document.createElement("link");
  linkRel.rel = "prefetch";
  linkRel.href = "/next-page.html";
  document.head.appendChild(linkRel);

  // DNS 预解析
  const linkDns = document.createElement("link");
  linkDns.rel = "dns-prefetch";
  linkDns.href = "https://api.example.com";
  document.head.appendChild(linkDns);

  // 预连接
  const linkConnect = document.createElement("link");
  linkConnect.rel = "preconnect";
  linkConnect.href = "https://cdn.example.com";
  document.head.appendChild(linkConnect);
}

// 资源优先级提示
function setPriorityHints() {
  // 关键CSS资源使用高优先级
  const criticalCss = document.querySelector('link[href="critical.css"]');
  criticalCss.importance = "high";

  // 非关键图片使用低优先级
  const lazyImages = document.querySelectorAll(".lazy-image");
  lazyImages.forEach((img) => {
    img.importance = "low";
    img.loading = "lazy"; // 原生懒加载
  });
}

// 智能缓存控制
function setupCaching() {
  if ("caches" in window) {
    // 缓存 API
    caches.open("app-v1").then((cache) => {
      cache.addAll(["/", "/styles.css", "/app.js", "/logo.svg"]);
    });
  }
}
```

## 总结

JavaScript 高级知识涵盖了深入的语言特性、编程模式和最佳实践。掌握这些高级概念对于构建高性能、可靠且安全的现代 Web 应用至关重要。继续进阶可探索 JavaScript 在 WebAssembly 集成、PWA 开发、微前端架构等新兴领域的应用。

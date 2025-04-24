---
title: JavaScript 进阶知识
sidebar_position: 3
---

# JavaScript 进阶知识

## 1. 原型与原型链

JavaScript 是基于原型的语言，理解原型机制对深入掌握 JavaScript 至关重要。

### 原型对象

每个 JavaScript 函数都有一个 `prototype` 属性，指向该函数的原型对象。当函数作为构造函数使用时，新创建的对象会从这个原型对象继承属性。

```javascript
function Person(name) {
  this.name = name;
}

// 在原型上添加方法
Person.prototype.sayHello = function () {
  return `你好，我是${this.name}`;
};

const person1 = new Person("张三");
console.log(person1.sayHello()); // "你好，我是张三"
```

### 原型链

每个 JavaScript 对象都有一个内部属性 `[[Prototype]]`（在大多数环境中通过 `__proto__` 访问），指向它的原型对象。当访问一个对象的属性时，如果对象本身没有这个属性，JavaScript 会沿着原型链向上查找。

```javascript
// 原型链示例
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function () {
  return `${this.name} 正在吃东西`;
};

function Dog(name, breed) {
  Animal.call(this, name); // 继承属性
  this.breed = breed;
}

// 设置原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// 添加 Dog 特有的方法
Dog.prototype.bark = function () {
  return "汪汪汪！";
};

const myDog = new Dog("旺财", "哈士奇");
console.log(myDog.eat()); // "旺财 正在吃东西" (继承自 Animal)
console.log(myDog.bark()); // "汪汪汪！" (Dog 自己的方法)
```

### 实现继承的方式

```javascript
// 1. 原型链继承
function Parent() {
  this.colors = ["red", "blue"];
}
function Child() {}
Child.prototype = new Parent();

// 2. 构造函数继承
function Child(name) {
  Parent.call(this, name); // 继承属性
}

// 3. 组合继承
function Child(name) {
  Parent.call(this, name); // 继承属性
}
Child.prototype = new Parent(); // 继承方法
Child.prototype.constructor = Child;

// 4. 原型式继承
const parent = { name: "parent" };
const child = Object.create(parent);

// 5. 寄生组合继承
function inheritPrototype(Child, Parent) {
  const prototype = Object.create(Parent.prototype);
  prototype.constructor = Child;
  Child.prototype = prototype;
}
```

## 2. 闭包与高阶函数

### 闭包详解

闭包是指函数与其词法环境的结合，这个环境包含了函数创建时存在的所有局部变量。

```javascript
function createCounter() {
  let count = 0; // 私有变量

  return {
    increment: function () {
      count++;
      return count;
    },
    decrement: function () {
      count--;
      return count;
    },
    getCount: function () {
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount()); // 1
```

闭包的主要应用：

1. **数据私有化**：创建私有变量，限制对数据的直接访问
2. **模块化模式**：创建拥有公共和私有部分的模块
3. **函数工厂**：创建定制化的函数
4. **回调函数**：在异步操作中保存状态

### 高阶函数

高阶函数是指接受一个或多个函数作为参数，或者返回一个函数的函数。

```javascript
// 函数作为参数
function map(arr, fn) {
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(fn(arr[i]));
  }
  return result;
}

const numbers = [1, 2, 3, 4];
const doubled = map(numbers, (x) => x * 2);
console.log(doubled); // [2, 4, 6, 8]

// 返回函数的函数
function multiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = multiplier(2);
const triple = multiplier(3);
console.log(double(5)); // 10
console.log(triple(5)); // 15
```

常见的高阶函数包括：`map`, `filter`, `reduce`, `forEach`, `some`, `every` 等。

### 函数柯里化

柯里化是把接受多个参数的函数变换成一系列只接受单一参数的函数的技术。

```javascript
// 普通函数
function add(x, y, z) {
  return x + y + z;
}

// 柯里化
function curriedAdd(x) {
  return function (y) {
    return function (z) {
      return x + y + z;
    };
  };
}

console.log(add(1, 2, 3)); // 6
console.log(curriedAdd(1)(2)(3)); // 6

// 通用柯里化函数
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

const curriedAdd2 = curry(add);
console.log(curriedAdd2(1)(2)(3)); // 6
console.log(curriedAdd2(1, 2)(3)); // 6
console.log(curriedAdd2(1)(2, 3)); // 6
```

## 3. 异步编程

JavaScript 是单线程语言，异步编程是处理并发操作的重要方式。

### 回调函数

最早的异步处理方式，但容易导致回调地狱(Callback Hell)。

```javascript
function fetchData(callback) {
  setTimeout(() => {
    callback("数据");
  }, 1000);
}

fetchData((data) => {
  console.log(data);
  fetchData((data2) => {
    console.log(data2);
    fetchData((data3) => {
      console.log(data3);
      // 回调地狱...
    });
  });
});
```

### Promise

Promise 是 ES6 引入的异步编程解决方案，可以链式调用避免回调地狱。

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 成功时调用 resolve
      resolve("数据");
      // 失败时调用 reject
      // reject(new Error('出错了'));
    }, 1000);
  });
}

fetchData()
  .then((data) => {
    console.log(data);
    return fetchData();
  })
  .then((data) => {
    console.log(data);
    return fetchData();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.error("错误:", err);
  })
  .finally(() => {
    console.log("无论成功失败都会执行");
  });

// Promise.all - 并行执行多个 Promise
Promise.all([fetchData(), fetchData(), fetchData()]).then((results) => {
  console.log(results); // ['数据', '数据', '数据']
});

// Promise.race - 返回最先完成的 Promise 结果
Promise.race([
  new Promise((resolve) => setTimeout(() => resolve("快"), 500)),
  new Promise((resolve) => setTimeout(() => resolve("慢"), 1000)),
]).then((result) => {
  console.log(result); // '快'
});
```

### async/await

ES2017 引入的 async/await 语法，建立在 Promise 之上，使异步代码看起来像同步代码。

```javascript
async function fetchAllData() {
  try {
    const data1 = await fetchData();
    console.log(data1);

    const data2 = await fetchData();
    console.log(data2);

    const data3 = await fetchData();
    console.log(data3);

    return "全部完成";
  } catch (error) {
    console.error("错误:", error);
  }
}

// 并行处理
async function fetchDataParallel() {
  try {
    const [data1, data2, data3] = await Promise.all([
      fetchData(),
      fetchData(),
      fetchData(),
    ]);

    console.log(data1, data2, data3);
  } catch (error) {
    console.error("错误:", error);
  }
}

fetchAllData().then((result) => console.log(result));
```

### 事件循环机制 (Event Loop)

JavaScript 的事件循环是其异步编程的核心机制。

```
   ┌───────────────────────────┐
┌─>│           宏任务           │
│  │  (setTimeout, setInterval) │
│  └───────────────┬───────────┘
│                  │
│  ┌───────────────v───────────┐
│  │           微任务           │
│  │  (Promise, MutationObserver)│
│  └───────────────┬───────────┘
│                  │
│  ┌───────────────v───────────┐
└──┤         渲染/更新          │
   └───────────────────────────┘
```

```javascript
console.log("1"); // 同步任务

setTimeout(() => {
  console.log("2"); // 宏任务
}, 0);

Promise.resolve().then(() => {
  console.log("3"); // 微任务
});

console.log("4"); // 同步任务

// 输出顺序: 1, 4, 3, 2
```

## 4. 深入对象与类

### ES6 类语法

ES6 引入了 `class` 关键字，使得创建类更加直观。

```javascript
class Person {
  // 构造函数
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // 实例方法
  sayHello() {
    return `你好，我是${this.name}`;
  }

  // 静态方法
  static create(name, age) {
    return new Person(name, age);
  }

  // 获取器
  get info() {
    return `${this.name}, ${this.age}岁`;
  }

  // 设置器
  set info(value) {
    [this.name, this.age] = value.split(",");
  }
}

// 类的继承
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age); // 调用父类构造函数
    this.grade = grade;
  }

  study() {
    return `${this.name}正在学习`;
  }

  // 方法重写
  sayHello() {
    return `${super.sayHello()}, 我是${this.grade}年级的学生`;
  }
}

const student = new Student("张三", 15, "高一");
console.log(student.sayHello());
```

### Object 高级特性

```javascript
// 描述符
const person = {};
Object.defineProperty(person, "name", {
  value: "张三",
  writable: true, // 是否可写
  enumerable: true, // 是否可枚举
  configurable: true, // 是否可配置
});

// 防止对象被修改
const obj = { prop: 42 };

// 防止添加新属性
Object.preventExtensions(obj);

// 禁止添加/删除属性，但允许修改已有属性
Object.seal(obj);

// 完全冻结对象，不允许添加/删除/修改
Object.freeze(obj);

// 代理对象
const target = { name: "张三", age: 25 };
const handler = {
  get(target, prop) {
    console.log(`访问了 ${prop} 属性`);
    return target[prop];
  },
  set(target, prop, value) {
    console.log(`设置 ${prop} 属性为 ${value}`);
    target[prop] = value;
    return true;
  },
};

const proxy = new Proxy(target, handler);
console.log(proxy.name); // "访问了 name 属性" "张三"
proxy.age = 26; // "设置 age 属性为 26"
```

## 5. 函数式编程

函数式编程是一种编程范式，使用纯函数作为主要构建块。

### 函数式编程的核心概念

1. **纯函数**：相同输入总是产生相同输出，没有副作用
2. **不可变性**：数据不应被修改，而是创建新数据
3. **函数组合**：将多个简单函数组合成复杂函数
4. **高阶函数**：接受或返回函数的函数

```javascript
// 纯函数
function add(a, b) {
  return a + b;
}

// 非纯函数（有副作用）
let total = 0;
function addToTotal(value) {
  total += value; // 修改了外部变量
  return total;
}

// 不可变性
const arr = [1, 2, 3];
// 不要这样做：arr.push(4);
// 而是创建新数组：
const newArr = [...arr, 4];

// 函数组合
function compose(...fns) {
  return function (x) {
    return fns.reduceRight((value, fn) => fn(value), x);
  };
}

const double = (x) => x * 2;
const increment = (x) => x + 1;
const doubleAndIncrement = compose(increment, double);

console.log(doubleAndIncrement(3)); // 7 (3*2+1)
```

### 常用的函数式编程工具

```javascript
// map - 转换数组的每个元素
const numbers = [1, 2, 3, 4];
const doubled = numbers.map((n) => n * 2);

// filter - 筛选数组元素
const evens = numbers.filter((n) => n % 2 === 0);

// reduce - 将数组归约为单一值
const sum = numbers.reduce((acc, n) => acc + n, 0);

// 函数式编程常用技巧
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((v, f) => f(v), x);
const trace = (label) => (value) => {
  console.log(`${label}: ${value}`);
  return value;
};

const processNumbers = pipe(
  trace("初始值"),
  (arr) => arr.map((n) => n * 2),
  trace("加倍后"),
  (arr) => arr.filter((n) => n > 5),
  trace("过滤后"),
  (arr) => arr.reduce((sum, n) => sum + n, 0),
  trace("最终和")
);

processNumbers([1, 2, 3, 4]);
```

## 6. 模块化编程

模块化是一种将代码分割成独立功能块的开发方式，使代码更易于维护和复用。

### CommonJS (Node.js)

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = {
  add,
  multiply,
};

// main.js
const math = require("./math");
console.log(math.add(1, 2)); // 3
console.log(math.multiply(2, 3)); // 6

// 解构导入
const { add, multiply } = require("./math");
```

### ES Modules (ES6)

```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// 默认导出
export default function divide(a, b) {
  return a / b;
}

// main.js
import divide, { add, multiply } from "./math.js";
console.log(add(1, 2)); // 3
console.log(multiply(2, 3)); // 6
console.log(divide(6, 2)); // 3

// 重命名导入
import { add as sum } from "./math.js";
console.log(sum(1, 2)); // 3

// 导入所有
import * as math from "./math.js";
console.log(math.add(1, 2)); // 3
```

### 模块模式 (Module Pattern)

在 ES6 模块之前的常用模块化方式。

```javascript
// 立即执行函数表达式(IIFE)
const calculator = (function () {
  // 私有变量
  let result = 0;

  // 公共 API
  return {
    add(value) {
      result += value;
      return this;
    },
    subtract(value) {
      result -= value;
      return this;
    },
    getResult() {
      return result;
    },
  };
})();

calculator.add(5).subtract(2);
console.log(calculator.getResult()); // 3
```

## 7. 内存管理与优化

JavaScript 是垃圾回收型语言，但深入理解内存管理有助于编写高效代码。

### 垃圾回收机制

JavaScript 引擎使用两种主要的垃圾回收算法：

1. **引用计数**：计算对象被引用的次数，当引用为 0 时回收
2. **标记清除**：从根对象开始，标记所有可达对象，然后清除未标记对象

### 常见的内存泄漏

```javascript
// 1. 全局变量
function leak() {
  leakyVar = "我没有声明，会变成全局变量";
}

// 2. 忘记清理定时器
function startTimer() {
  const timer = setInterval(() => {
    // 一些操作
  }, 1000);

  // 记得在适当的时候清理
  // clearInterval(timer);
}

// 3. 闭包引用
function createLeak() {
  const largeData = new Array(1000000).fill("x");

  return function () {
    // 即使只用了一次，也会一直保持对 largeData 的引用
    console.log(largeData[0]);
  };
}

// 4. DOM引用
function setupNode() {
  const node = document.getElementById("myElement");

  node.addEventListener("click", () => {
    // 这里使用了 node 引用
    console.log(node.id);
  });

  // 即使 node 从 DOM 中移除，回调中的引用也会阻止它被垃圾回收
  document.body.removeChild(node);
}
```

### 性能优化技巧

```javascript
// 1. 对象缓存
function cachingExample() {
  const cache = {};

  return function (input) {
    if (cache[input]) {
      return cache[input]; // 使用缓存结果
    }

    const result = expensiveOperation(input);
    cache[input] = result; // 缓存结果
    return result;
  };
}

// 2. 使用合适的数据结构
// 频繁查找应使用 Map 或 Object
const userMap = new Map();
userMap.set("user1", { name: "张三" });

// 唯一值集合应使用 Set
const uniqueIds = new Set([1, 2, 3]);

// 3. 避免频繁 DOM 操作
function badDOMCode() {
  for (let i = 0; i < 1000; i++) {
    document.body.innerHTML += `<div>${i}</div>`; // 非常慢
  }
}

function goodDOMCode() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 1000; i++) {
    const div = document.createElement("div");
    div.textContent = i;
    fragment.appendChild(div);
  }
  document.body.appendChild(fragment); // 只操作一次 DOM
}
```

## 总结

JavaScript 进阶知识涵盖了更深层次的语言特性和模式，如原型、闭包、异步编程等。掌握这些知识可以帮助你更好地理解 JavaScript 的工作原理，编写更高效、可维护的代码，也是面试中的重要考察点。继续深入学习，可以探索 JavaScript 的高级特性，如元编程、渐进式增强、Web APIs 等内容。

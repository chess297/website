---
title: JavaScript 基础知识
sidebar_position: 2
---

# JavaScript 基础知识

## 1. JavaScript 简介

JavaScript 是一种轻量级的、解释型的、面向对象的、具有函数优先特性的编程语言，主要用于为网页添加交互功能。它是网页制作的三大核心技术之一（HTML、CSS、JavaScript）。

### 历史和发展

- 1995 年：Brendan Eich 在网景公司创建了 JavaScript
- 1997 年：ECMA 国际标准化组织发布 ECMAScript 标准
- 2015 年：ECMAScript 6 (ES6) 发布，带来重大更新
- 现在：每年发布新版本，不断演进

### JavaScript 的特点

- 解释执行（无需编译）
- 动态类型（变量类型可变）
- 原型继承（而非类继承）
- 函数是一等公民
- 单线程执行模型
- 事件驱动

## 2. 基本语法

### 变量声明

```javascript
// var - 函数作用域，有变量提升
var name = "张三";

// let - 块级作用域，无变量提升
let age = 25;

// const - 块级作用域，常量（不可重新赋值）
const PI = 3.14159;
```

### 数据类型

JavaScript 有 8 种数据类型：

**基本数据类型(7 种)**：

- **Number**：整数和浮点数，如 42 或 3.14159
- **String**：字符串，如 "Hello, world"
- **Boolean**：布尔值，true 或 false
- **Undefined**：未定义，变量声明但未赋值时的默认值
- **Null**：空值
- **Symbol**：(ES6) 唯一且不可变的数据类型
- **BigInt**：(ES2020) 任意精度的整数

**引用数据类型(1 种)**：

- **Object**：对象、数组、函数等

### 类型判断

```javascript
// typeof 操作符
typeof 42; // "number"
typeof "hello"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" (JavaScript 的一个历史遗留bug)
typeof Symbol(); // "symbol"
typeof {}; // "object"
typeof []; // "object"
typeof function () {}; // "function"

// instanceof 操作符 - 检查对象是否为某个构造函数的实例
[] instanceof Array; // true

// Array.isArray() - 专门用于检查数组
Array.isArray([]); // true
```

### 运算符

```javascript
// 算术运算符
let sum = 5 + 10; // 加法
let diff = 10 - 5; // 减法
let product = 5 * 10; // 乘法
let quotient = 10 / 5; // 除法
let remainder = 10 % 3; // 取余
let power = 2 ** 3; // 幂运算 (ES7)

// 赋值运算符
let x = 10;
x += 5; // x = x + 5
x -= 5; // x = x - 5

// 比较运算符
10 == "10"; // true (类型转换后相等)
10 === "10"; // false (严格相等，类型不同)
10 != "10"; // false
10 !== "10"; // true
10 > 5; // true
10 >= 10; // true

// 逻辑运算符
true && false; // false (逻辑与)
true || false; // true (逻辑或)
!true; // false (逻辑非)
```

### 条件语句

```javascript
// if语句
if (age >= 18) {
  console.log("成年人");
} else if (age >= 12) {
  console.log("青少年");
} else {
  console.log("儿童");
}

// switch语句
switch (fruit) {
  case "苹果":
    console.log("红色水果");
    break;
  case "香蕉":
    console.log("黄色水果");
    break;
  default:
    console.log("未知水果");
}

// 三元运算符
let status = age >= 18 ? "成年" : "未成年";
```

### 循环

```javascript
// for循环
for (let i = 0; i < 5; i++) {
  console.log(i);
}

// while循环
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// do...while循环
let j = 0;
do {
  console.log(j);
  j++;
} while (j < 5);

// for...of循环(ES6) - 遍历可迭代对象
const arr = [1, 2, 3];
for (const item of arr) {
  console.log(item);
}

// for...in循环 - 遍历对象属性
const person = { name: "张三", age: 25 };
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}
```

## 3. 函数

### 函数声明

```javascript
// 函数声明
function greet(name) {
  return `你好，${name}！`;
}

// 函数表达式
const greet = function (name) {
  return `你好，${name}！`;
};

// 箭头函数(ES6)
const greet = (name) => {
  return `你好，${name}！`;
};
// 简化形式
const greet = (name) => `你好，${name}！`;
```

### 参数和返回值

```javascript
// 默认参数(ES6)
function greet(name = "访客") {
  return `你好，${name}！`;
}

// 剩余参数(ES6)
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

// 返回值
function divide(a, b) {
  if (b === 0) {
    return "不能除以零";
  }
  return a / b;
}
```

### 作用域和闭包

```javascript
// 全局作用域
let globalVar = "我是全局变量";

function example() {
  // 函数作用域
  let localVar = "我是局部变量";
  console.log(globalVar); // 可以访问全局变量

  // 块级作用域
  if (true) {
    let blockVar = "我是块级变量";
    console.log(localVar); // 可以访问外部变量
  }
  // console.log(blockVar); // 错误：blockVar未定义
}

// 闭包示例
function createCounter() {
  let count = 0;
  return function () {
    return ++count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
```

## 4. 数组和对象

### 数组操作

```javascript
// 创建数组
let fruits = ["苹果", "香蕉", "橙子"];
let numbers = new Array(1, 2, 3);

// 访问元素
console.log(fruits[0]); // "苹果"

// 修改元素
fruits[1] = "梨子";

// 常用方法
fruits.push("草莓"); // 在末尾添加元素
fruits.pop(); // 移除末尾元素并返回
fruits.unshift("葡萄"); // 在开头添加元素
fruits.shift(); // 移除开头元素并返回
fruits.slice(1, 2); // 提取子数组(不改变原数组)
fruits.splice(1, 1, "桃子"); // 删除、插入或替换元素
fruits.concat(["西瓜"]); // 合并数组
fruits.join(", "); // 将数组元素连接成字符串
fruits.indexOf("苹果"); // 查找元素索引
fruits.includes("苹果"); // 检查数组是否包含指定元素

// 数组遍历
fruits.forEach((item, index) => {
  console.log(`${index}: ${item}`);
});

// 数组转换
const numbers = [1, 2, 3, 4];
const doubled = numbers.map((num) => num * 2);
const evenNumbers = numbers.filter((num) => num % 2 === 0);
const sum = numbers.reduce((total, num) => total + num, 0);
```

### 对象操作

```javascript
// 创建对象
let person = {
  name: "张三",
  age: 25,
  greet: function () {
    return `你好，我是${this.name}`;
  },
};

// 访问属性
console.log(person.name); // 点表示法
console.log(person["name"]); // 方括号表示法

// 修改属性
person.age = 26;
person["age"] = 26;

// 添加新属性
person.gender = "男";

// 删除属性
delete person.age;

// 检查属性
"name" in person; // true
person.hasOwnProperty("name"); // true

// 对象方法调用
console.log(person.greet());

// 解构赋值(ES6)
const { name, age } = person;
```

## 5. 字符串操作

```javascript
// 字符串创建
let str1 = "Hello";
let str2 = "World";
let str3 = `Hello ${str2}`; // 模板字符串(ES6)

// 字符串属性
str1.length; // 5

// 字符串方法
str1.charAt(1); // "e"
str1.indexOf("l"); // 2 (第一次出现的索引)
str1.lastIndexOf("l"); // 3 (最后一次出现的索引)
str1.concat(" ", str2); // "Hello World"
str1.slice(1, 3); // "el"
str1.substring(1, 3); // "el"
str1.toLowerCase(); // "hello"
str1.toUpperCase(); // "HELLO"
str1.trim(); // 去除两端空格
str1.replace("H", "J"); // "Jello"
str1.split(""); // ["H", "e", "l", "l", "o"]
str1.includes("el"); // true
str1.startsWith("He"); // true
str1.endsWith("lo"); // true
```

## 6. 错误处理

```javascript
// try...catch
try {
  // 可能出错的代码
  const result = someUndefinedFunction();
} catch (error) {
  console.error("发生错误:", error.message);
} finally {
  // 无论是否出错都会执行的代码
  console.log("清理资源");
}

// 抛出自定义错误
function divide(a, b) {
  if (b === 0) {
    throw new Error("除数不能为零");
  }
  return a / b;
}

// 错误类型
try {
  // ...
} catch (error) {
  if (error instanceof TypeError) {
    console.log("类型错误");
  } else if (error instanceof ReferenceError) {
    console.log("引用错误");
  } else {
    console.log("其他错误");
  }
}
```

## 7. JSON 处理

```javascript
// 对象转 JSON 字符串
const person = { name: "张三", age: 25 };
const jsonString = JSON.stringify(person);
console.log(jsonString); // '{"name":"张三","age":25}'

// JSON 字符串转对象
const jsonStr = '{"name":"李四","age":30}';
const obj = JSON.parse(jsonStr);
console.log(obj.name); // "李四"
```

## 8. 定时器

```javascript
// setTimeout - 延迟执行
const timeoutId = setTimeout(() => {
  console.log("3秒后执行");
}, 3000);

// 清除 setTimeout
clearTimeout(timeoutId);

// setInterval - 定期执行
const intervalId = setInterval(() => {
  console.log("每2秒执行一次");
}, 2000);

// 清除 setInterval
clearInterval(intervalId);
```

## 总结

JavaScript 基础知识涵盖了语言的核心特性和基本用法。掌握这些基础后，可以进一步学习更高级的概念，如面向对象编程、异步编程、DOM 操作等。持续练习和实践是提高 JavaScript 技能的关键。

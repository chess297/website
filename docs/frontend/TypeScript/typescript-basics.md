---
title: TypeScript 基础知识
sidebar_position: 1
---

## TypeScript 简介

TypeScript 是 JavaScript 的超集，添加了类型系统和对 ES6+ 的支持。它由 Microsoft 开发和维护。

## 安装和配置

```bash
# 全局安装 TypeScript
npm install -g typescript

# 初始化 tsconfig.json
tsc --init
```

## 基础类型

### 1. 原始类型

```typescript
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];
```

### 2. 特殊类型

```typescript
let u: undefined = undefined;
let n: null = null;
let v: void = undefined;
let a: any = 4;
let never: never; // 永远不会有返回值的函数
```

## 接口（Interface）

```typescript
interface Person {
  name: string;
  age: number;
  readonly id: number; // 只读属性
  optional?: string; // 可选属性
}

let user: Person = {
  name: "Tom",
  age: 25,
  id: 1,
};
```

## 类（Class）

```typescript
class Animal {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`);
  }
}
```

## 函数

### 1. 函数类型

```typescript
function add(x: number, y: number): number {
  return x + y;
}

// 箭头函数
let myAdd: (x: number, y: number) => number = (x: number, y: number): number =>
  x + y;
```

### 2. 可选参数和默认参数

```typescript
function buildName(firstName: string, lastName?: string): string {
  return lastName ? firstName + " " + lastName : firstName;
}

function greeting(name: string = "World"): string {
  return `Hello, ${name}!`;
}
```

## 泛型（Generics）

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// 使用方式
let output1 = identity<string>("myString");
let output2 = identity(123); // 类型推断
```

## 模块系统

```typescript
// 导出
export interface StringValidator {
  isAcceptable(s: string): boolean;
}

// 导入
import { StringValidator } from "./StringValidator";
```

## 类型断言

```typescript
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
// 或
let strLength2: number = (someValue as string).length;
```

## 类型推断

TypeScript 可以根据上下文自动推断类型：

```typescript
let x = 3; // 推断为 number
let arr = [1, 2, null]; // 推断为 number[]
```

## 最佳实践

1. 始终启用严格模式（strict: true）
2. 避免使用 any 类型
3. 接口优于类型别名
4. 使用 readonly 来防止意外修改
5. 合理使用类型推断

## 开发工具

1. Visual Studio Code
2. TSLint/ESLint
3. TypeScript Playground
4. ts-node（运行 TypeScript 文件）

## 类型系统基础概念

### 1. 结构化类型系统

TypeScript 采用结构化类型系统(Structural Type System)，也称为"鸭子类型"：

```typescript
interface Point {
  x: number;
  y: number;
}

function logPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// 正常工作，因为结构匹配
const point3d = { x: 12, y: 26, z: 89 };
logPoint(point3d); // logs "12, 26"
```

### 2. 类型推导

TypeScript 的类型推导系统非常强大：

```typescript
// 变量类型推导
let message = "hello!"; // 推导为 string 类型

// 上下文类型推导
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button); // <- 自动推导为 MouseEvent
};

// 返回类型推导
function createZoo() {
  return [
    { name: "Lion", age: 4 },
    { name: "Zebra", age: 2 },
  ]; // 推导为 { name: string, age: number }[]
}
```

### 3. 类型保护机制

TypeScript 提供了多种类型保护机制：

```typescript
// typeof 类型保护
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + value;
  }
  return padding + value;
}

// instanceof 类型保护
class Bird {
  fly() {}
  layEggs() {}
}

class Fish {
  swim() {}
  layEggs() {}
}

function getSmallPet(): Fish | Bird {
  // ...
  return new Fish();
}

const pet = getSmallPet();
if (pet instanceof Bird) {
  pet.fly();
}

// in 操作符类型保护
interface A {
  x: number;
}
interface B {
  y: string;
}

function doStuff(q: A | B) {
  if ("x" in q) {
    // q: A
  } else {
    // q: B
  }
}

// 自定义类型保护
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

### 4. 高级类型特性

```typescript
// 联合类型（Union Types）
type StringOrNumber = string | number;

// 交叉类型（Intersection Types）
type Combined = { a: string } & { b: number };

// 类型别名（Type Aliases）
type Point = {
  x: number;
  y: number;
};

// 字面量类型（Literal Types）
type Direction = "North" | "South" | "East" | "West";
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// 可辨识联合（Discriminated Unions）
interface Circle {
  kind: "circle";
  radius: number;
}
interface Square {
  kind: "square";
  sideLength: number;
}
type Shape = Circle | Square;

// 索引类型（Index Types）
interface ErrorContainer {
  [prop: string]: string;
}
```

### 5. 模块化类型定义

```typescript
// 导出类型定义
export interface User {
  id: number;
  name: string;
}

export type UserRole = "admin" | "user" | "guest";

// 导入类型定义
import type { User, UserRole } from "./types";

// 命名空间组织类型
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

### 6. 类型兼容性规则

```typescript
// 对象类型兼容性
interface Pet {
  name: string;
}
interface Dog {
  name: string;
  breed: string;
}
let pet: Pet;
let dog: Dog = { name: "Rover", breed: "Collie" };
pet = dog; // OK

// 函数类型兼容性
let x = (a: number) => 0;
let y = (b: number, s: string) => 0;
x = y; // Error
y = x; // OK

// 泛型类型兼容性
interface Empty<T> {}
let x: Empty<number>;
let y: Empty<string>;
x = y; // OK，因为结构相同

// 类的兼容性检查
class Animal {
  feet: number;
  constructor(name: string, numFeet: number) {}
}
class Size {
  feet: number;
  constructor(meters: number) {}
}
let a: Animal;
let s: Size;
a = s; // OK
s = a; // OK
```

## 工具链与配置

### 1. 编译器配置详解

```json
{
  "compilerOptions": {
    // 基础配置
    "target": "es2020", // 编译目标版本
    "module": "esnext", // 模块系统
    "lib": ["es2020", "dom"], // 包含的库文件
    "outDir": "./dist", // 输出目录

    // 模块解析
    "moduleResolution": "node", // 模块解析策略
    "baseUrl": "./src", // 基础目录
    "paths": {
      // 路径映射
      "@/*": ["*"]
    },

    // 类型检查
    "strict": true, // 严格模式
    "noImplicitAny": true, // 禁止隐式any
    "strictNullChecks": true, // 严格的null检查

    // 构建优化
    "incremental": true, // 增量编译
    "tsBuildInfoFile": "./cache", // 编译缓存
    "skipLibCheck": true, // 跳过库文件检查

    // JSX支持
    "jsx": "react", // JSX处理方式
    "jsxFactory": "React.createElement",

    // 装饰器支持
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,

    // 源码映射
    "sourceMap": true, // 生成sourceMap
    "declaration": true, // 生成声明文件
    "declarationMap": true // 声明文件的sourceMap
  },
  "include": ["src/**/*"], // 包含的文件
  "exclude": ["node_modules"] // 排除的文件
}
```

### 2. 开发工具配置

#### VSCode 配置

```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["typescript", "typescriptreact"]
}
```

#### ESLint 配置

```json
{
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### 3. 常用开发工具

#### 类型检查工具

- TSLint (已弃用，推荐使用 ESLint)
- ESLint + @typescript-eslint
- Type Coverage

#### 编译工具

- tsc (TypeScript 官方编译器)
- ts-node (直接运行 TypeScript)
- ts-jest (Jest 的 TypeScript 预处理器)
- babel-loader + @babel/preset-typescript

#### IDE 插件

- TypeScript Language Features
- TypeScript Import Sorter
- TypeScript Hero
- Pretty TypeScript Errors

### 4. 调试配置

#### VSCode Launch 配置

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug TypeScript",
      "program": "${workspaceFolder}/src/index.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "sourceMaps": true
    }
  ]
}
```

#### 断点调试

```typescript
// 使用 debugger 语句
function debugMe() {
  let x = 1;
  debugger; // IDE会在这里停住
  x++;
  return x;
}

// 使用 console
console.log("Debug info");
console.warn("Warning message");
console.error("Error occurred");
```

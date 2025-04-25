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

## 更多基础类型

### 字面量类型

```typescript
// 字符串字面量类型
type Direction = "north" | "south" | "east" | "west";
let direction: Direction = "north"; // 只能是这四个值之一

// 数字字面量类型
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let diceRoll: DiceRoll = 1;

// 布尔字面量类型
type TRUE = true;
let t: TRUE = true; // 只能是 true
```

### 枚举类型

```typescript
// 数字枚举
enum Status {
  Active = 1,
  Inactive = 2,
  Pending = 3,
}

// 字符串枚举
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// 常量枚举
const enum Constants {
  Max = 100,
  Min = 0,
}
```

### 工具类型

TypeScript 提供了多个实用的工具类型：

```typescript
// 1. Partial - 使所有属性可选
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type PartialTodo = Partial<Todo>;
// 等价于:
// {
//   title?: string;
//   description?: string;
//   completed?: boolean;
// }

// 2. Required - 使所有属性必需
interface Props {
  a?: number;
  b?: string;
}

const obj: Required<Props> = { a: 5, b: "hello" }; // 必须提供所有属性

// 3. Record - 创建属性为指定类型的对象类型
type PageInfo = Record<"home" | "about" | "contact", { title: string }>;
// 等价于:
// {
//   home: { title: string },
//   about: { title: string },
//   contact: { title: string }
// }

// 4. Pick - 从类型中选择部分属性
interface Person {
  name: string;
  age: number;
  address: string;
}

type NameAndAge = Pick<Person, "name" | "age">;
// 等价于:
// {
//   name: string;
//   age: number;
// }

// 5. Omit - 从类型中排除部分属性
type AddressOnly = Omit<Person, "name" | "age">;
// 等价于:
// {
//   address: string;
// }
```

### 高级工具类型

```typescript
// 1. ReturnType - 获取函数返回值类型
function getUser() {
  return { name: "John", age: 30 };
}

type User = ReturnType<typeof getUser>;
// 等价于:
// {
//   name: string;
//   age: number;
// }

// 2. Parameters - 获取函数参数类型
function buildUser(name: string, age: number) {
  return { name, age };
}

type BuildUserParams = Parameters<typeof buildUser>;
// 等价于: [string, number]

// 3. InstanceType - 获取构造函数实例类型
class Point {
  constructor(public x: number, public y: number) {}
}

type PointInstance = InstanceType<typeof Point>;
// 等价于 Point

// 4. ThisType - 指定 this 上下文类型
interface ThisContext {
  name: string;
}

interface Methods {
  hello(): void;
}

type ObjectWithMethods = Methods & ThisType<ThisContext>;
```

## 类型断言最佳实践

```typescript
// 1. 双重断言
let someValue: unknown = "this is a string";
let strLength: number = (someValue as unknown as string).length;

// 2. 非空断言
function processValue(value: string | null) {
  // 使用 ! 断言值不为 null
  console.log(value!.length);
}

// 3. 类型谓词
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function processValue(value: unknown) {
  if (isString(value)) {
    console.log(value.length); // value 被推断为 string 类型
  }
}
```

## 配置文件详解

详细的 tsconfig.json 配置选项：

```json
{
  "compilerOptions": {
    // 基础选项
    "target": "es2020", // 指定 ECMAScript 目标版本
    "module": "commonjs", // 指定模块系统
    "lib": ["es2020", "dom"], // 指定要包含的库文件
    "sourceMap": true, // 生成相应的 .map 文件

    // 严格类型检查
    "strict": true, // 启用所有严格类型检查选项
    "noImplicitAny": true, // 禁止隐式的 any 类型
    "strictNullChecks": true, // 启用严格的 null 检查

    // 模块解析
    "baseUrl": "./", // 基础目录
    "paths": {
      // 路径映射
      "@/*": ["src/*"]
    },
    "esModuleInterop": true, // 启用 ES 模块互操作性

    // 高级选项
    "experimentalDecorators": true, // 启用装饰器
    "emitDecoratorMetadata": true // 为装饰器发出类型元数据
  },
  "include": [
    "src/**/*" // 指定要编译的文件
  ],
  "exclude": [
    "node_modules", // 指定要排除的文件
    "**/*.spec.ts"
  ]
}
```

## 类型系统最佳实践

1. **类型推断**

   - 尽可能利用 TypeScript 的类型推断
   - 避免不必要的类型注解
   - 使用 as const 进行字面量推断

2. **类型安全**

   - 避免使用 any
   - 使用 unknown 代替 any
   - 严格开启 strictNullChecks

3. **代码组织**

   - 使用命名空间组织代码
   - 适当使用模块导入导出
   - 合理使用类型声明文件

4. **错误处理**

   - 使用自定义类型守卫
   - 合理使用可选链和空值合并
   - 异常处理类型化

5. **性能考虑**
   - 避免过度使用泛型
   - 合理使用类型缓存
   - 控制类型计算的复杂度

```

```

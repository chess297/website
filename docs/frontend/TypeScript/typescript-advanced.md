---
title: TypeScript 进阶知识
sidebar_position: 2
---

## 高级类型

### 1. 联合类型和交叉类型
```typescript
// 联合类型
type StringOrNumber = string | number;

// 交叉类型
type Combined = { id: number } & { name: string };
```

### 2. 类型保护
```typescript
function isString(value: any): value is string {
  return typeof value === "string";
}

function processValue(value: string | number) {
  if (isString(value)) {
    // 这里 value 被识别为 string 类型
    return value.toUpperCase();
  }
  // 这里 value 被识别为 number 类型
  return value.toFixed(2);
}
```

### 3. 映射类型
```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

## 装饰器（Decorators）

### 1. 类装饰器
```typescript
function logged(constructor: Function) {
  console.log(`Creating new instance of: ${constructor.name}`);
}

@logged
class Person {
  constructor(public name: string) {}
}
```

### 2. 方法装饰器
```typescript
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

class Example {
  @enumerable(false)
  method() {}
}
```

## 高级接口技巧

### 1. 索引类型
```typescript
interface StringArray {
  [index: number]: string;
}

interface Dictionary {
  [key: string]: any;
}
```

### 2. 接口继承
```typescript
interface Shape {
  color: string;
}

interface Square extends Shape {
  sideLength: number;
}
```

## 泛型进阶

### 1. 泛型约束
```typescript
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

### 2. 泛型工具类型
```typescript
// Record
type PageInfo = Record<'home' | 'about' | 'contact', { title: string }>;

// Exclude
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"

// Extract
type T1 = Extract<"a" | "b" | "c", "a" | "f">; // "a"

// NonNullable
type T2 = NonNullable<string | number | null | undefined>; // string | number
```

## 模块化高级特性

### 1. 动态导入
```typescript
async function loadModule() {
  const module = await import('./module');
  module.doSomething();
}
```

### 2. 命名空间
```typescript
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```

## TypeScript 配置进阶

### 1. tsconfig.json 高级配置
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 2. 项目引用
```json
{
  "references": [
    { "path": "./tsconfig.shared.json" },
    { "path": "./tsconfig.server.json" }
  ]
}
```

## 实践技巧

1. 使用条件类型优化代码
2. 合理使用类型推导
3. 使用 const assertions
4. 利用 satisfies 操作符进行类型检查
5. 使用 infer 关键字进行类型推断

## 调试和性能优化

1. sourceMap 配置和使用
2. 编译性能优化策略
3. 类型声明文件管理
4. 代码分割和按需加载

## 条件类型进阶

### 分布式条件类型
```typescript
type StringsOrNumbers<T> = T extends any[] ? string[] : number;
type Res1 = StringsOrNumbers<string|number>; // string[] | number

// 避免分布式行为
type NoDistribute<T> = [T] extends [any] ? string[] : number;
type Res2 = NoDistribute<string|number>; // number
```

### 条件类型推断
```typescript
// 提取Promise值类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type PromiseType = UnwrapPromise<Promise<string>>; // string

// 提取函数返回类型
type ReturnTypeCustom<T> = T extends (...args: any[]) => infer R ? R : never;
type FuncReturn = ReturnTypeCustom<() => number>; // number

// 提取构造函数参数类型
type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;
```

### 复杂条件类型
```typescript
// 递归条件类型
type DeepNonNullable<T> = T extends object
  ? { [P in keyof T]: DeepNonNullable<T[P]> }
  : NonNullable<T>;

// 联合类型转交叉类型
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends 
  ((k: infer I) => void) ? I : never;
```

## 类型体操进阶

### 1. 字符串操作类型
```typescript
// 首字母大写
type Capitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;

// 驼峰命名转换
type CamelCase<S extends string> = S extends `${infer L}-${infer R}`
  ? `${L}${Capitalize<CamelCase<R>>}`
  : S;

// 获取字符串长度
type StringLength<S extends string> = 
  S extends `${infer _}${infer Rest}`
    ? [unknown, ...StringLength<Rest>]["length"]
    : 0;
```

### 2. 数组操作类型
```typescript
// 数组长度
type Length<T extends any[]> = T["length"];

// 数组头部
type Head<T extends any[]> = T extends [infer H, ...any[]] ? H : never;

// 数组尾部
type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;

// 数组Push
type Push<T extends any[], E> = [...T, E];

// 数组合并
type Concat<T extends any[], U extends any[]> = [...T, ...U];
```

### 3. 对象操作类型
```typescript
// 深度只读
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

// 深度可选
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

// 选择可选属性
type OptionalKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];
```

## 装饰器模式进阶

### 1. 方法重写装饰器
```typescript
function override(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  if (!descriptor.value.__isOverride) {
    throw new Error(`${propertyKey} is not marked as override in base class`);
  }
  return descriptor;
}

class Parent {
  greet() {
    return "Hello";
  }
}

class Child extends Parent {
  @override
  greet() {
    return super.greet() + " World";
  }
}
```

### 2. 属性验证装饰器
```typescript
function validate(validationFn: (value: any) => boolean) {
  return function(target: any, propertyKey: string) {
    let value: any;
    
    const getter = function() {
      return value;
    };
    
    const setter = function(newVal: any) {
      if (!validationFn(newVal)) {
        throw new Error(`Invalid value for ${propertyKey}`);
      }
      value = newVal;
    };
    
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

class User {
  @validate((age: number) => age >= 0 && age <= 120)
  age: number = 0;
}
```

## 高级类型实战

### 1. 可序列化类型
```typescript
type Primitive = string | number | boolean | null | undefined;

type Serializable<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
  ? Array<Serializable<U>>
  : T extends object
  ? { [K in keyof T]: Serializable<T[K]> }
  : never;

// 使用示例
interface ComplexObject {
  id: number;
  name: string;
  data: {
    values: number[];
    metadata: {
      created: Date;  // Date 将被排除
    };
  };
}

type SerializableObject = Serializable<ComplexObject>;
```

### 2. 函数类型工具
```typescript
// 函数参数类型转换
type FunctionParametersToObject<T extends (...args: any[]) => any> = 
  T extends (...args: infer P) => any ? 
    { [K in keyof P]: P[K] } : never;

// 柯里化类型
type Curry<F> = F extends (...args: infer A) => infer R
  ? A extends [infer First, ...infer Rest]
    ? (arg: First) => Curry<(...args: Rest) => R>
    : R
  : never;
```

## 类型系统性能优化

### 1. 类型计算缓存
```typescript
// 使用接口延迟计算
interface CachedCalculation<T> {
  type: T;
}

type HeavyCalculation<T> = CachedCalculation<T> extends { type: infer U } ? U : never;

// 避免过度使用条件类型
type SimpleUnion = "a" | "b" | "c";
// 而不是
type ComplexUnion<T> = T extends "a" ? "a" : T extends "b" ? "b" : "c";
```

### 2. 类型构建优化
```typescript
// 使用映射类型而不是联合类型转换
type Keys = "a" | "b" | "c";
type BetterWay = { [K in Keys]: string };
// 而不是
type WorseWay = 
  | { a: string, b?: string, c?: string }
  | { a?: string, b: string, c?: string }
  | { a?: string, b?: string, c: string };
```

## 工程实践最佳案例

### 1. API 类型定义
```typescript
// 通用响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 通用请求类型
interface PaginationParams {
  page: number;
  pageSize: number;
}

// API 请求函数类型
type ApiFunction<P extends any[], R> = (...args: P) => Promise<ApiResponse<R>>;

// 使用示例
interface UserData {
  id: number;
  name: string;
}

const fetchUsers: ApiFunction<[PaginationParams], UserData[]> = 
  async (params) => {
    // 实现...
    return { code: 200, message: "success", data: [] };
  };
```

### 2. 状态管理类型
```typescript
// 状态定义
interface State {
  user: {
    id: number;
    name: string;
  } | null;
  theme: "light" | "dark";
  settings: Record<string, unknown>;
}

// Action 定义
type ActionType = 
  | { type: "SET_USER"; payload: State["user"] }
  | { type: "SET_THEME"; payload: State["theme"] }
  | { type: "UPDATE_SETTINGS"; payload: Partial<State["settings"]> };

// Reducer 类型
type Reducer<S, A> = (state: S, action: A) => S;

// 类型安全的 reducer
const reducer: Reducer<State, ActionType> = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "UPDATE_SETTINGS":
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    default:
      return state;
  }
};
```
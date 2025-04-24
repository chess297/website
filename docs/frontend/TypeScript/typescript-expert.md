---
title: TypeScript 高级知识
sidebar_position: 3
---

## 类型系统深入

### 1. 条件类型（Conditional Types）
```typescript
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";
```

### 2. 递归类型
```typescript
type JSONValue = 
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

### 3. 高级映射类型
```typescript
// 将所有属性变为可选的同时保持只读
type DeepPartialReadonly<T> = {
  readonly [P in keyof T]?: T[P] extends object
    ? DeepPartialReadonly<T[P]>
    : T[P];
};

// 移除类型中的所有可选属性
type RequiredProperties<T> = {
  [P in keyof T]-?: T[P];
};
```

## 类型推断高级技巧

### 1. infer 关键字进阶
```typescript
// 提取函数返回类型
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// 提取构造函数实例类型
type InstanceType<T> = T extends new (...args: any[]) => infer R ? R : any;

// 提取数组元素类型
type ElementType<T> = T extends (infer U)[] ? U : never;
```

### 2. 分发条件类型
```typescript
type ToArray<T> = T extends any ? T[] : never;
type StrNumArr = ToArray<string | number>; // string[] | number[]

// 防止类型分发
type NoDistribute<T> = [T] extends [any] ? T[] : never;
```

## 装饰器进阶

### 1. 参数装饰器
```typescript
function validate(target: any, propertyKey: string, parameterIndex: number) {
  // 参数验证逻辑
}

class Example {
  greet(@validate name: string) {
    return `Hello ${name}!`;
  }
}
```

### 2. 属性装饰器
```typescript
function format(formatString: string) {
  return function (target: any, propertyKey: string): any {
    let value: string;
    
    const getter = function() {
      return `${formatString} ${value}`;
    };
    
    const setter = function(newVal: string) {
      value = newVal;
    };
    
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  };
}
```

## 高级类型操作

### 1. 类型体操
```typescript
// 字符串字面量操作
type Trim<S extends string> = S extends ` ${infer R}` | `${infer R} `
  ? Trim<R>
  : S;

// 联合类型转交叉类型
type UnionToIntersection<U> = 
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// 提取必需属性
type RequiredKeys<T> = {
  [K in keyof T]: {} extends Pick<T, K> ? never : K
}[keyof T];
```

### 2. 高级类型推导
```typescript
// 获取函数的参数类型元组
type Parameters<T> = T extends (...args: infer P) => any ? P : never;

// 获取Promise的resolved值类型
type Awaited<T> = T extends Promise<infer U> ? U : T;

// 递归展开Promise
type DeepAwaited<T> = T extends Promise<infer U>
  ? DeepAwaited<U>
  : T;
```

## 模块系统高级特性

### 1. 模块扩充
```typescript
declare module "lodash" {
  interface LoDashStatic {
    customFunction<T>(arr: T[]): T;
  }
}
```

### 2. 环境声明
```typescript
declare global {
  interface Window {
    customProperty: string;
  }
  
  interface Array<T> {
    customMethod(): T;
  }
}
```

## 编译器API和AST

### 1. 使用编译器API
```typescript
import * as ts from "typescript";

function createCompilerHost(options: ts.CompilerOptions): ts.CompilerHost {
  return {
    getSourceFile: (fileName, languageVersion) => {
      const source = ts.createSourceFile(
        fileName,
        fs.readFileSync(fileName).toString(),
        languageVersion
      );
      return source;
    },
    // ... 其他必需的方法
  };
}
```

### 2. AST转换
```typescript
function transform(context: ts.TransformationContext) {
  return (sourceFile: ts.SourceFile) => {
    function visit(node: ts.Node): ts.Node {
      if (ts.isCallExpression(node)) {
        // 转换逻辑
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(sourceFile, visit);
  };
}
```

## 性能优化极致技巧

1. 类型计算的性能优化
2. 按需加载类型定义
3. 项目结构优化
4. 编译缓存策略
5. 类型声明文件优化

## TypeScript 5.0+ 新特性

1. const 类型参数
2. `using` 声明
3. 装饰器元数据
4. 隐式类型导入
5. 模板字符串类型改进

## 高级类型系统

### 1. 类型系统设计模式
```typescript
// 访问者模式
interface Visitor<T> {
  visit(element: T): void;
}

interface Visitable {
  accept<T>(visitor: Visitor<T>): void;
}

// 工厂模式
interface Factory<T> {
  create(...args: any[]): T;
}

// 单例模式
class Singleton {
  private static instance: Singleton;
  private constructor() {}

  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
```

### 2. 高级类型运算
```typescript
// 联合类型分发
type UnionToTuple<T> = 
  (T extends any ? (t: T) => 0 : never) extends
  (t: infer U) => 0 ? U : never;

// 对象深度比较
type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false;

// 递归类型转换
type DeepPromiseValueType<T> = T extends Promise<infer U>
  ? DeepPromiseValueType<U>
  : T;
```

### 3. 类型约束模式
```typescript
// 确保类实现特定方法
type Constructor<T = {}> = new (...args: any[]) => T;

function withMethod<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    method() {
      // 实现...
    }
  };
}

// 类型安全的事件系统
type EventMap = {
  click: MouseEvent;
  keypress: KeyboardEvent;
};

class TypeSafeEventEmitter {
  private handlers: Partial<{
    [K in keyof EventMap]: ((e: EventMap[K]) => void)[];
  }> = {};

  on<K extends keyof EventMap>(event: K, handler: (e: EventMap[K]) => void) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    (this.handlers[event] as any[]).push(handler);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    const handlers = this.handlers[event] || [];
    handlers.forEach(handler => handler(data));
  }
}
```

## 编译器插件开发

### 1. 自定义转换器
```typescript
import * as ts from "typescript";

function createTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return (context) => {
    const visit: ts.Visitor = (node) => {
      if (ts.isCallExpression(node)) {
        // 转换调用表达式
      }
      return ts.visitEachChild(node, visit, context);
    };
    return (node) => ts.visitNode(node, visit) as T;
  };
}

// 使用转换器
const program = ts.createProgram(["./src/index.ts"], {});
const transformer = createTransformer();
const result = ts.transform(sourceFile, [transformer]);
```

### 2. 类型检查插件
```typescript
import * as ts from "typescript";

function createTypeChecker(program: ts.Program) {
  const checker = program.getTypeChecker();
  
  function checkNode(node: ts.Node) {
    const type = checker.getTypeAtLocation(node);
    if (checker.isTypeAssignableTo(type, someType)) {
      // 执行类型检查逻辑
    }
  }

  return {
    checkNode
  };
}
```

## 高级泛型应用

### 1. 高阶泛型组件
```typescript
// 泛型组件包装器
type ComponentWrapper<P> = {
  <T extends P>(Component: React.ComponentType<T>): 
    React.ComponentType<Omit<T, keyof P>>;
}

// 泛型高阶组件
function withData<T, P>(
  WrappedComponent: React.ComponentType<P & { data: T }>,
  fetchData: () => Promise<T>
): React.ComponentType<Omit<P, "data">> {
  return class extends React.Component<P> {
    state = { data: null as T | null };

    async componentDidMount() {
      const data = await fetchData();
      this.setState({ data });
    }

    render() {
      const { data } = this.state;
      return data ? (
        <WrappedComponent {...this.props} data={data} />
      ) : null;
    }
  };
}
```

### 2. 类型安全的Redux
```typescript
// Action类型
type ActionCreator<T extends string, P = void> = P extends void
  ? { type: T }
  : { type: T; payload: P };

// Reducer类型
type Reducer<S, A> = (state: S, action: A) => S;

// Store类型
interface Store<S, A> {
  getState(): S;
  dispatch(action: A): void;
  subscribe(listener: () => void): () => void;
}

// createStore实现
function createStore<S, A>(
  reducer: Reducer<S, A>,
  initialState: S
): Store<S, A> {
  let state = initialState;
  const listeners: (() => void)[] = [];

  return {
    getState: () => state,
    dispatch: (action: A) => {
      state = reducer(state, action);
      listeners.forEach(listener => listener());
    },
    subscribe: (listener: () => void) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      };
    }
  };
}
```

## 类型系统内部原理

### 1. 结构化类型系统
```typescript
// TypeScript使用结构化类型系统
interface Point2D {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

let point2D: Point2D = { x: 0, y: 0 };
let point3D: Point3D = { x: 0, y: 0, z: 0 };

// point2D = point3D; // 有效
// point3D = point2D; // 无效：缺少z属性
```

### 2. 类型擦除
```typescript
// 运行时类型信息保留
function preserveRuntime<T>(value: T) {
  return {
    value,
    type: typeof value
  };
}

// 使用装饰器保留类型信息
function Reflect() {
  return function (target: any) {
    target.prototype.__type = target.name;
  };
}

@Reflect()
class Example {
  // 类型信息在运行时可用
}
```

## 工程化最佳实践

### 1. monorepo类型管理
```typescript
// tsconfig.base.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}

// packages/core/tsconfig.json
{
  "extends": "../../tsconfig.base.json",
  "references": [
    { "path": "../shared" }
  ]
}
```

### 2. 类型声明优化
```typescript
// 优化类型导入
import type { SomeType } from './types';

// 内联类型导出
export interface { /* ... */ }

// 按需类型导出
export type { SomeType };

// 类型声明文件组织
// index.d.ts
declare module 'my-library' {
  export interface Options {
    // ...
  }
  export function init(options: Options): void;
}
```

### 3. 构建优化
```typescript
// webpack配置
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // 仅转译，提升构建速度
              experimentalWatchApi: true,
              happyPackMode: true // 多线程构建
            }
          }
        ]
      }
    ]
  }
};

// 类型检查优化
{
  "compilerOptions": {
    "incremental": true, // 增量编译
    "tsBuildInfoFile": "./buildcache", // 构建缓存
    "skipLibCheck": true // 跳过库文件检查
  }
}
```
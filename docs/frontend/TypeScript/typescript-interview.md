---
title: TypeScript 面试题
sidebar_position: 4
---

## 基础概念

### 1. TypeScript 和 JavaScript 的区别是什么？

TypeScript 是 JavaScript 的超集，主要区别包括：

- TypeScript 支持静态类型检查
- 支持接口、泛型等面向对象特性
- 支持 ES6+ 的特性并可编译为低版本 JavaScript
- 具有更好的代码提示和重构支持
- 编译时类型检查，避免运行时错误

### 2. any、unknown 和 never 类型的区别？

```typescript
// any：任意类型，跳过类型检查
let valueAny: any = 42;
valueAny.foo.bar; // 不会报错

// unknown：安全的any，需要类型检查后使用
let valueUnknown: unknown = 42;
if (typeof valueUnknown === "number") {
  valueUnknown.toFixed(); // 正确
}

// never：永远不会有返回值的类型
function error(message: string): never {
  throw new Error(message);
}
```

### 3. interface 和 type 的区别？

主要区别：

```typescript
// Interface 可以合并声明
interface User {
  name: string;
}
interface User {
  age: number;
}

// Type 不能合并声明
type Animal = {
  name: string;
};
// Error: Duplicate identifier 'Animal'
type Animal = {
  age: number;
};

// Interface 只能描述对象结构
// Type 可以描述联合类型、交叉类型等
type StringOrNumber = string | number;
type TextAlign = "left" | "right" | "center";
```

## 进阶问题

### 1. 如何实现泛型约束？

```typescript
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): number {
  return arg.length;
}

// 正确
logLength("hello");
logLength([1, 2, 3]);
// 错误
logLength(123); // 数字没有length属性
```

### 2. 解释装饰器的原理和使用场景

```typescript
// 类装饰器
function log(target: Function) {
  console.log(`Class ${target.name} is defined`);
}

@log
class Example {
  // ...
}

// 方法装饰器
function measure(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const start = performance.now();
    const result = originalMethod.apply(this, args);
    const end = performance.now();
    console.log(`${propertyKey} took ${end - start}ms`);
    return result;
  };
}
```

### 3. 如何处理 this 的类型问题？

```typescript
class Handler {
  info: string;
  // 方法一：使用箭头函数
  onClick = () => {
    this.info = "clicked";
  };

  // 方法二：显式指定this类型
  onTouch(this: Handler, e: TouchEvent) {
    this.info = "touched";
  }
}
```

## 高级问题

### 1. 实现一个类型递归

```typescript
// 实现深度Readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 使用示例
interface Person {
  name: string;
  profile: {
    age: number;
    address: string;
  };
}

type ReadonlyPerson = DeepReadonly<Person>;
```

### 2. 条件类型和映射类型的实际应用

```typescript
// 提取Promise返回类型
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// 将所有属性变为可选
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// 组合使用
type AsyncFuncReturnType<T> = T extends (...args: any[]) => Promise<infer U>
  ? U
  : never;
```

### 3. TypeScript 性能优化相关问题

关键点：

1. 合理使用类型推断，避免过度类型注解
2. 避免使用过于复杂的类型运算
3. 使用 Project References 管理大型项目
4. 正确配置 tsconfig.json
5. 合理使用类型断言避免不必要的类型检查

## 实战问题

### 1. 如何优雅地处理后端 API 类型？

```typescript
// API 响应类型
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 用户类型
interface User {
  id: number;
  name: string;
}

// API 函数
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  // 实现...
}
```

### 2. 实现类型安全的事件系统

```typescript
type EventMap = {
  click: { x: number; y: number };
  change: string;
};

class TypedEventEmitter {
  on<K extends keyof EventMap>(
    event: K,
    callback: (data: EventMap[K]) => void
  ) {
    // 实现...
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    // 实现...
  }
}
```

### 3. 如何处理动态导入的类型？

```typescript
// 类型安全的动态导入
async function importModule(path: string) {
  type Module = typeof import("./some-module");
  const module: Module = await import(path);
  return module;
}
```

## 项目实践问题

### 1. 如何组织大型项目中的类型定义？

最佳实践：

1. 使用 barrel files (index.ts) 导出类型
2. 按领域划分类型文件
3. 使用命名空间管理全局类型
4. 合理使用类型别名和接口

### 2. TypeScript 项目中的单元测试

```typescript
// 示例：Jest + TypeScript
describe("User Service", () => {
  it("should create user", async () => {
    const user: User = {
      name: "Test User",
      email: "test@example.com",
    };

    const result = await createUser(user);
    expect(result.id).toBeDefined();
  });
});
```

### 3. 模块化和依赖注入

```typescript
// 依赖注入示例
interface ILogger {
  log(message: string): void;
}

class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log(message);
  }
}

class UserService {
  constructor(private logger: ILogger) {}

  createUser(name: string) {
    this.logger.log(`Creating user: ${name}`);
    // 实现...
  }
}
```

## 进阶考察点

### 1. 类型体操实现

```typescript
// 实现一个 Flatten 类型
type Flatten<T> = T extends any[]
  ? T extends (infer Item)[]
    ? Flatten<Item>
    : never
  : T;

// 测试
type NestedArray = [1, [2, [3, 4]], 5];
type FlatArray = Flatten<NestedArray>; // 1 | 2 | 3 | 4 | 5

// 实现 Promise 链类型
type PromiseChain<T> = T extends Promise<infer U> ? PromiseChain<U> : T;

// 测试
type DeepPromise = Promise<Promise<Promise<string>>>;
type UnwrappedType = PromiseChain<DeepPromise>; // string
```

### 2. 高级映射类型实践

```typescript
// 实现深度可选类型
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 实现只读递归类型
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 实现部分属性可选
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = PartialBy<User, "email" | "name">;
```

### 3. 条件类型应用

```typescript
// 提取对象中的函数类型
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

// 提取对象中的非函数类型
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

interface Mixed {
  id: number;
  name: string;
  getName(): string;
  setName(name: string): void;
}

type FuncProps = FunctionPropertyNames<Mixed>; // "getName" | "setName"
type NonFuncProps = NonFunctionPropertyNames<Mixed>; // "id" | "name"
```

## 实战场景问题

### 1. 实现类型安全的事件总线

```typescript
type EventMap = {
  "user:login": { userId: string; timestamp: number };
  "user:logout": { timestamp: number };
  error: Error;
};

class TypeSafeEventBus {
  private handlers = new Map<keyof EventMap, Array<(data: any) => void>>();

  on<K extends keyof EventMap>(event: K, handler: (data: EventMap[K]) => void) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach((handler) => handler(data));
  }
}

// 使用示例
const bus = new TypeSafeEventBus();
bus.on("user:login", ({ userId, timestamp }) => {
  console.log(`User ${userId} logged in at ${timestamp}`);
});
```

### 2. 实现一个带类型的依赖注入容器

```typescript
type Constructor<T = any> = new (...args: any[]) => T;

class Container {
  private services = new Map<string, any>();

  register<T>(
    token: string,
    clazz: Constructor<T>,
    dependencies: string[] = []
  ) {
    this.services.set(token, {
      clazz,
      dependencies,
    });
  }

  resolve<T>(token: string): T {
    const service = this.services.get(token);
    if (!service) {
      throw new Error(`Service ${token} not found`);
    }

    const dependencies = service.dependencies.map((dep) => this.resolve(dep));
    return new service.clazz(...dependencies);
  }
}

// 使用示例
interface ILogger {
  log(message: string): void;
}

class Logger implements ILogger {
  log(message: string) {
    console.log(message);
  }
}

class UserService {
  constructor(private logger: ILogger) {}

  createUser(name: string) {
    this.logger.log(`Creating user: ${name}`);
  }
}

const container = new Container();
container.register("logger", Logger);
container.register("userService", UserService, ["logger"]);
```

### 3. 响应式状态管理类型设计

```typescript
type Subscriber<T> = (value: T) => void;

class Observable<T> {
  private value: T;
  private subscribers: Set<Subscriber<T>> = new Set();

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T): void {
    this.value = newValue;
    this.notify();
  }

  subscribe(subscriber: Subscriber<T>): () => void {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }

  private notify(): void {
    this.subscribers.forEach((subscriber) => subscriber(this.value));
  }
}

// 使用示例
interface State {
  count: number;
  text: string;
}

const state = new Observable<State>({
  count: 0,
  text: "",
});

const unsubscribe = state.subscribe(({ count, text }) => {
  console.log(`Count: ${count}, Text: ${text}`);
});
```

## 高级技巧问题

### 1. 实现类型安全的管道操作符

```typescript
type Pipe = {
  <A>(value: A): A;
  <A, B>(value: A, fn1: (input: A) => B): B;
  <A, B, C>(value: A, fn1: (input: A) => B, fn2: (input: B) => C): C;
  <A, B, C, D>(
    value: A,
    fn1: (input: A) => B,
    fn2: (input: B) => C,
    fn3: (input: C) => D
  ): D;
};

const pipe: Pipe = (value: any, ...fns: Array<(input: any) => any>) => {
  return fns.reduce((acc, fn) => fn(acc), value);
};

// 使用示例
const addOne = (x: number) => x + 1;
const toString = (x: number) => x.toString();
const wrap = (x: string) => `(${x})`;

const result = pipe(
  1,
  addOne, // 2
  toString, // "2"
  wrap // "(2)"
);
```

### 2. 实现可组合的高阶组件类型

```typescript
type HOC<P> = (
  Component: React.ComponentType<P>
) => React.ComponentType<Omit<P, keyof InjectedProps>>;

interface InjectedProps {
  theme: "light" | "dark";
}

const withTheme: HOC<Props & InjectedProps> = (Component) => {
  return function ThemedComponent(props: Props) {
    const theme = useTheme(); // 假设有这样的hook
    return <Component {...props} theme={theme} />;
  };
};

// 组合多个HOC
const compose = <P>(...hocs: Array<HOC<any>>) => {
  return (BaseComponent: React.ComponentType<P>) => {
    return hocs.reduceRight((acc, hoc) => hoc(acc), BaseComponent);
  };
};
```

### 3. 实现类型安全的 RPC 调用

```typescript
interface RPCMethods {
  "user.get": {
    input: { id: number };
    output: { name: string; email: string };
  };
  "user.create": {
    input: { name: string; email: string };
    output: { id: number };
  };
}

class TypeSafeRPC {
  async call<T extends keyof RPCMethods>(
    method: T,
    params: RPCMethods[T]["input"]
  ): Promise<RPCMethods[T]["output"]> {
    const response = await fetch("/rpc", {
      method: "POST",
      body: JSON.stringify({ method, params }),
    });
    return response.json();
  }
}

// 使用示例
const rpc = new TypeSafeRPC();
async function example() {
  const user = await rpc.call("user.get", { id: 1 });
  const newUser = await rpc.call("user.create", {
    name: "John",
    email: "john@example.com",
  });
}
```

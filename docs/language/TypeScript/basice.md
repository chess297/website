# TypeScript 基础

## 基础类型

### 布尔值

```typescript
let isDone: boolean = false;
```

### 数字

```typescript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

### 字符串

```typescript
let name: string = "bob";
let age: number = 37;
let sentence: string = `Hello, my name is ${name}.
I'll be ${age + 1} years old next month.`;
```

### 数组

```typescript
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3];
```

### 元组 Tuple

```typescript
let x: [string, number];
x = ["hello", 10]; // OK
x = [10, "hello"]; // Error
```

### 枚举

```typescript
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

### Any

```typescript
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

### Void

```typescript
function warnUser(): void {
  console.log("This is my warning message");
}
```

### Null 和 Undefined

```typescript
let u: undefined = undefined;
let n: null = null;
```

### Never

```typescript
function error(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

### Object

```typescript
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

### 类型断言

```typescript
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

### 类型别名

```typescript
type StringOrNumber = string | number;

let sample: StringOrNumber = 123;
```

### 联合类型

```typescript
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

### 类型保护

```typescript
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}
```

### 类型谓词

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

### 类型守卫

```typescript
interface Bird {
  fly();
  layEggs();
}

interface Fish {
  swim();
  layEggs();
}

function getSmallPet(): Fish | Bird {
  // ...
}

let pet = getSmallPet();

if ((pet as Fish).swim) {
  (pet as Fish).swim();
} else {
  (pet as Bird).fly();
}
```

### 类型推断

```typescript
let myFavoriteNumber = "seven";
myFavoriteNumber = 7;
```

### 类型兼容性

```typescript
interface X {
  a: string;
}

interface Y {
  a: string;
  b: number;
}

let x: X = { a: "hello" };
let y: Y = { a: "hello", b: 42 };

x = y; // OK
y = x; // Error
```

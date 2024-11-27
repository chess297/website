# Rust 基础

## 基础语法

### 变量

Rust 中的变量是不可变的，默认情况下是不可变的。要声明一个可变变量，需要使用 `mut` 关键字。

```rust
let mut x = 5;

x = 6;
```

### 函数

Rust 中的函数使用 `fn` 关键字声明，函数参数和返回值类型需要在函数签名中指定。

```rust
fn main() {
    println!("Hello, world!");
}

fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

### 控制流

Rust 中的控制流语句包括 `if`、`else`、`loop`、`while` 和 `for`。

```rust
fn main() {
    let number = 6;

    if number % 2 == 0 {
        println!("{} is even", number);
    } else {
        println!("{} is odd", number);
    }

    let mut count = 0;
    loop {
        count += 1;
        if count == 10 {
            break;
        }
    }

    let mut count = 0;
    while count < 5 {
        count += 1;
    }
}
```

### 数据类型

Rust 中的数据类型包括整数、浮点数、布尔值、字符、字符串、数组、元组、结构体、枚举、切片、向量等。

```rust
fn main() {
    let x: i32 = 5;
    let y: f64 = 3.14;
    let z: bool = true;
    let c: char = 'a';
    let s: &str = "hello";
    let arr: [i32; 5] = [1, 2, 3, 4, 5];
    let tup: (i32, f64, bool) = (1, 3.14, true);
}
```

### 结构体

Rust 中的结构体是一种自定义的数据类型，可以包含多个字段。

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 5, y: 10 };
    println!("p.x = {}, p.y = {}", p.x, p.y);
}
```

### 枚举

Rust 中的枚举是一种自定义的数据类型，可以包含多个变体。

```rust
enum Color {
    Red,
    Green,
    Blue,
}

fn main() {
    let c = Color::Red;
}
```

### 模块

Rust 中的模块是一种组织代码的方式，可以将代码分成多个文件和子模块。

```rust
mod my_module {
    pub fn my_function() {
        println!("Hello from my_module!");
    }
}

fn main() {
    my_module::my_function();
}
```

### 错误处理

Rust 中的错误处理使用 `Result` 类型，可以表示成功或失败。

```rust
fn main() {
    let result: Result<i32, &str> = Ok(5);
    match result {
        Ok(value) => println!("Success: {}", value),
}
```

### 泛型

Rust 中的泛型是一种编程技术，可以编写可以处理多种类型的代码。

```rust
fn main() {
    let x: i32 = 5;
    let y: f64 = 3.14;
    let z: bool = true;

    let a = add(x, y);
    let b = add(x, z);
}

fn add<T: Add<Output = T>>(a: T, b: T) -> T {
    a + b
}
```

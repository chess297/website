---
title: Golang 基础知识
sidebar_position: 1
---

# Golang 基础知识

## 1. 基本语法

### 1.1 变量声明

```go
// 标准声明
var name string
var age int
// 简短声明
name := "张三"
age := 18
```

### 1.2 数据类型

- 基本类型：int, float64, bool, string
- 复合类型：array, slice, map, struct
- 引用类型：pointer, interface, function, channel

### 1.3 流程控制

```go
// if 条件判断
if age >= 18 {
    fmt.Println("成年人")
} else {
    fmt.Println("未成年")
}

// for 循环
for i := 0; i < 10; i++ {
    fmt.Println(i)
}

// switch 分支
switch os := runtime.GOOS; os {
case "darwin":
    fmt.Println("OS X")
case "linux":
    fmt.Println("Linux")
default:
    fmt.Printf("%s\n", os)
}
```

## 2. 函数

### 2.1 函数定义

```go
func add(x int, y int) int {
    return x + y
}

// 多返回值
func swap(x, y string) (string, string) {
    return y, x
}
```

### 2.2 defer 语句

```go
func main() {
    defer fmt.Println("world")
    fmt.Println("hello")
}
```

## 3. 结构体和接口

### 3.1 结构体

```go
type Person struct {
    Name string
    Age  int
}

func (p Person) SayHello() {
    fmt.Printf("Hello, I'm %s\n", p.Name)
}
```

### 3.2 接口

```go
type Speaker interface {
    Speak() string
}

type Dog struct {
    Name string
}

func (d Dog) Speak() string {
    return "Woof!"
}
```

## 4. 并发编程基础

### 4.1 goroutine

```go
func say(s string) {
    for i := 0; i < 5; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    go say("world")
    say("hello")
}
```

### 4.2 channel

```go
func sum(s []int, c chan int) {
    sum := 0
    for _, v := range s {
        sum += v
    }
    c <- sum
}

func main() {
    s := []int{7, 2, 8, -9, 4, 0}
    c := make(chan int)
    go sum(s[:len(s)/2], c)
    go sum(s[len(s)/2:], c)
    x, y := <-c, <-c
    fmt.Println(x + y)
}
```

## 5. 错误处理

### 5.1 error 接口

```go
type error interface {
    Error() string
}

func divide(x, y float64) (float64, error) {
    if y == 0 {
        return 0, errors.New("除数不能为零")
    }
    return x / y, nil
}
```

### 5.2 panic 和 recover

```go
func handlePanic() {
    if r := recover(); r != nil {
        fmt.Println("Recovered from", r)
    }
}

func main() {
    defer handlePanic()
    panic("发生了严重错误")
}
```

# Swift 基础

## 基础语法

### 变量与常量

```swift
// 常量
let name = "zhangsan"
// 变量
var age = 18
```

### 数据类型

```swift
// 整型
let num1: Int = 10
// 浮点型
let num2: Double = 3.14
// 字符串
let str: String = "Hello, World!"
// 布尔型
let flag: Bool = true
```

### 类型转换

```swift
// 整型转浮点型
let num1: Int = 10
let num2: Double = Double(num1)
// 浮点型转整型
let num3: Double = 3.14
let num4: Int = Int(num3)
// 字符串转整型
let str: String = "123"
let num5: Int = Int(str) ?? 0
// 字符串转浮点型
let str: String = "3.14"
let num6: Double = Double(str) ?? 0.0
```

### 字符串拼接

```swift
let str1: String = "Hello"
let str2: String = "World"
let str3: String = str1 + str2
```

### 字符串插值

```swift
let name: String = "zhangsan"
let age: Int = 18
let str: String = "My name is \(name), I'm \(age) years old."
```

### 数组

```swift
// 创建数组
let arr1: [Int] = [1, 2, 3, 4, 5]
let arr2: [String] = ["a", "b", "c"]
// 访问数组元素
let num: Int = arr1[0]
// 修改数组元素
arr1[0] = 10
// 添加数组元素
arr1.append(6)
// 删除数组元素
arr1.remove(at: 0)
```

### 字典

```swift
// 创建字典
let dict1: [String: Int] = ["a": 1, "b": 2, "c": 3]
let dict2: [Int: String] = [1: "a", 2: "b", 3: "c"]
// 访问字典元素
let num: Int = dict1["a"]?? 0
// 修改字典元素
dict1["a"] = 10
// 添加字典元素
dict1["d"] = 4
// 删除字典元素
dict1.removeValue(forKey: "a")
```

### 循环

```swift
// for循环
for i in 0..<10 {
    print(i)
}
// while循环
var i = 0
while i < 10 {
    print(i)
    i += 1
}
// repeat-while循环
var j = 0
repeat {
    print(j)
    j += 1
} while j < 10
```

### 条件语句

```swift
// if语句
let num: Int = 10
if num > 0 {
    print("num is positive")
} else if num < 0 {
    print("num is negative")
} else {
    print("num is zero")
}
// switch语句
let num: Int = 10
switch num {
case 0:
    print("num is zero")
case 1..<10:
    print("num is between 1 and 9")
case 10:
    print("num is 10")
default:
    print("num is greater than 10")
}
```

### 函数

```swift
// 无参无返回值函数
func sayHello() {
    print("Hello, World!")
}
// 有参无返回值函数
func sayHello(name: String) {
    print("Hello, \(name)!")
}
// 无参有返回值函数
func getAge() -> Int {
    return 18
}
// 有参有返回值函数
func add(a: Int, b: Int) -> Int {
    return a + b
}
// 调用函数
sayHello()
sayHello(name: "zhangsan")
let age: Int = getAge()
let sum: Int = add(a: 1, b: 2)
```

### 闭包

```swift
// 无参无返回值闭包
let closure1 = {
    print("Hello, World!")
}
// 有参无返回值闭包
let closure2 = { (name: String) in
    print("Hello, \(name)!")
}
// 无参有返回值闭包
let closure3 = {
    return 18
}
// 有参有返回值闭包
let closure4 = { (a: Int, b: Int) -> Int in
    return a + b
}
// 调用闭包
closure1()
closure2(name: "zhangsan")
let age: Int = closure3()
let sum: Int = closure4(1, 2)
```

### 枚举

```swift
// 枚举
enum Direction {
    case north
    case south
    case east
    case west
}
// 使用枚举
let direction: Direction = .north
switch direction {
case .north:
    print("go north")
case.south:
    print("go south")
case.east:
    print("go east")
case.west:
    print("go west")
}
```

### 类与对象

```swift
// 类
class Person {
    var name: String
    var age: Int
    init(name: String, age: Int) {
        self.name = name
        self.age = age
    }
    func sayHello() {
        print("Hello, my name is \(name), I'm \(age) years old.")
    }
}
// 对象
let person: Person = Person(name: "zhangsan", age: 18)
person.sayHello()
```

### 结构体

```swift
// 结构体
struct Point {
    var x: Int
    var y: Int
    func move(dx: Int, dy: Int) {
        x += dx
        y += dy
    }
}
// 使用结构体
let point: Point = Point(x: 0, y: 0)
point.move(dx: 1, dy: 2)
```

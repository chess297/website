# Dart 基础

## 变量

### 变量声明

```dart
var name = 'Bob';

String name = 'Bob';
```

### 默认值

未初始化的变量默认值为 `null`。即使变量被声明为非 `null` 类型。

```dart
int lineCount;
assert(lineCount == null);
```

### final 和 const

`final` 和 `const` 都可以用来声明常量，`final` 变量只能赋值一次，而 `const` 变量是编译时常量。

```dart
final name = 'Bob';
const bar = 1000000;
```

### 类型

Dart 是强类型语言，变量必须声明类型。

```dart
var name = 'Bob';
```

## 函数

### 函数声明

```dart
int add(int a, int b) {
  return a + b;
}
```

### 箭头函数

```dart
int add(int a, int b) => a + b;
```

### 可选参数

```dart
void printInfo(String name, [int age]) {
  print('name = $name, age = $age');
}
```

### 默认参数值

```dart
void printInfo(String name, [int age = 18]) {
  print('name = $name, age = $age');
}
```

### 命名参数

```dart
void printInfo(String name, {int age}) {

}
```

### 匿名函数

```dart
var add = (int a, int b) => a + b;
```

## 集合

### List

```dart
var list = [1, 2, 3];
```

### Map

```dart
var map = {'name': 'Bob', 'age': 18};
```

## 类

### 类声明

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void printInfo() {
    print('name = $name, age = $age');
  }
}
```

### 构造函数

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  Person.fromJson(Map<String, dynamic> json)
      : name = json['name'],
        age = json['age'];
}
```

### 继承

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void printInfo() {
    print('name = $name, age = $age');
  }
}

class Student extends Person {
  String school;

  Student(String name, int age, this.school) : super(name, age);

  @override
  void printInfo() {
    super.printInfo();
    print('school = $school');
  }
}
```

### 接口

Dart 没有接口（interface）这个概念，类和抽象类都可以作为其他类的接口。

```dart
abstract class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void printInfo();
}

class Student extends Person {
  String school;

  Student(String name, int age, this.school) : super(name, age);

  @override
  void printInfo() {
    super.printInfo();
    print('school = $school');
  }
}
```

### Mixin

```dart
mixin Logger {
  void log(String msg) {
    print(msg);
  }
}

class Person with Logger {
  String name;
  int age;
  Person(this.name, this.age);
  void printInfo() {
    log('name = $name, age = $age');
  }
}
```

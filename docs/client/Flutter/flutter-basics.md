---
title: Flutter基础
sidebar_position: 2
---

# Flutter 基础

## Flutter 简介

### Flutter 是什么

Flutter 是 Google 开发的开源 UI 软件开发工具包，它可以让开发者使用一套代码库高效地构建多平台应用。Flutter 使用 Dart 语言开发，提供了丰富的预建 UI 组件（称为 widget）。

### Flutter 的优势和特点

1. **跨平台开发**

   - 一套代码运行在 Android、iOS、Web、Desktop 等平台
   - 统一的 UI 渲染，确保各平台视觉体验一致
   - 降低开发和维护成本

2. **高性能**

   - 直接编译成原生代码
   - 自带渲染引擎 Skia
   - 60fps 的流畅体验

3. **热重载**
   - 支持开发过程中的实时预览
   - 加快开发调试效率
   - 无需重新编译即可查看修改效果

### Flutter 架构概述

Flutter 的架构分为四层：

1. **Framework 层**

   - Widgets（UI 组件）
   - Rendering（渲染）
   - Painting（绘制）
   - Foundation（基础功能）

2. **Engine 层**

   - Skia 图形引擎
   - Dart 运行时
   - Text 渲染引擎

3. **Platform 层**

   - 系统 API 调用
   - 平台特定功能

4. **硬件层**
   - CPU/GPU
   - 设备硬件功能

## 开发环境搭建

### Flutter SDK 安装

1. **下载 Flutter SDK**

   ```bash
   # macOS使用homebrew安装
   brew install flutter

   # 或直接下载SDK
   # 从flutter.dev下载SDK压缩包
   ```

2. **配置环境变量**

   ```bash
   export PATH="$PATH:[PATH_TO_FLUTTER_SDK]/flutter/bin"
   ```

3. **验证安装**
   ```bash
   flutter doctor
   ```

### 开发工具配置

1. **VS Code 配置**

   - 安装 Flutter 插件
   - 安装 Dart 插件
   - 配置 Flutter SDK 路径

2. **Android Studio 配置**
   - 安装 Flutter 插件
   - 安装 Dart 插件
   - 配置 Flutter 和 Dart SDK

### 创建第一个 Flutter 应用

1. **创建新项目**

   ```bash
   flutter create my_app
   cd my_app
   flutter run
   ```

2. **项目结构说明**
   ```
   my_app/
   ├── lib/            # 主要代码目录
   ├── test/          # 测试代码目录
   ├── android/       # Android平台相关
   ├── ios/           # iOS平台相关
   ├── web/           # Web平台相关
   └── pubspec.yaml   # 项目配置文件
   ```

## Dart 语言基础

### 变量和数据类型

1. **变量声明**

   ```dart
   // 变量声明和初始化
   var name = 'Bob';  // 类型推断
   String name = 'Bob';  // 显式类型声明
   dynamic name = 'Bob';  // 动态类型
   ```

2. **数据类型**

   ```dart
   // 数字
   int age = 25;
   double price = 23.5;

   // 字符串
   String message = 'Hello';

   // 布尔
   bool isValid = true;

   // 列表
   List<String> fruits = ['apple', 'banana'];

   // 映射
   Map<String, int> scores = {
     'math': 90,
     'history': 85
   };
   ```

### 函数和方法

```dart
// 基本函数声明
int add(int a, int b) {
  return a + b;
}

// 箭头函数
void printName(String name) => print(name);

// 可选参数
void greet(String name, [String? title]) {
  print('Hello ${title ?? ''} $name');
}

// 命名参数
void createUser({
  required String name,
  int age = 0,
}) {
  // ...
}
```

### 类和对象

```dart
class Person {
  // 属性
  final String name;
  int age;

  // 构造函数
  Person(this.name, this.age);

  // 命名构造函数
  Person.guest() : name = 'Guest', age = 18;

  // 方法
  void introduce() {
    print('I am $name, $age years old');
  }
}
```

### 异步编程

```dart
// Future使用
Future<String> fetchData() async {
  try {
    final response = await http.get('api.example.com/data');
    return response.body;
  } catch (e) {
    return 'Error: $e';
  }
}

// Stream使用
Stream<int> countStream(int max) async* {
  for (int i = 0; i < max; i++) {
    yield i;
    await Future.delayed(Duration(seconds: 1));
  }
}
```

## Widget 基础

### Widget 的概念

Widget 是 Flutter 应用程序的基本构建块，描述了 UI 在给定当前配置和状态下应该如何呈现。

### StatelessWidget

```dart
class WelcomeText extends StatelessWidget {
  final String name;

  const WelcomeText(this.name, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text('Welcome $name!');
  }
}
```

### StatefulWidget

```dart
class Counter extends StatefulWidget {
  const Counter({Key? key}) : super(key: key);

  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int _count = 0;

  void _increment() {
    setState(() {
      _count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_count'),
        ElevatedButton(
          onPressed: _increment,
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

### 常用基础 Widget

1. **Text**

```dart
Text(
  'Hello Flutter',
  style: TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
  ),
)
```

2. **Container**

```dart
Container(
  padding: EdgeInsets.all(8.0),
  margin: EdgeInsets.symmetric(vertical: 10.0),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(8.0),
    boxShadow: [
      BoxShadow(
        color: Colors.grey.withOpacity(0.5),
        spreadRadius: 2,
        blurRadius: 5,
      ),
    ],
  ),
  child: Text('Container Example'),
)
```

3. **Row/Column**

```dart
Row(
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  children: [
    Icon(Icons.star),
    Text('Row Example'),
    ElevatedButton(
      onPressed: () {},
      child: Text('Click'),
    ),
  ],
)

Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text('Item 1'),
    Text('Item 2'),
    Text('Item 3'),
  ],
)
```

4. **Stack**

```dart
Stack(
  children: [
    Image.network('background.jpg'),
    Positioned(
      bottom: 10,
      right: 10,
      child: Text('Overlay Text'),
    ),
  ],
)
```

## 布局和样式

### 布局原理

Flutter 的布局模型基于以下概念：

1. **约束传递**：父 widget 向子 widget 传递约束
2. **大小确定**：子 widget 根据约束确定自身大小
3. **位置放置**：父 widget 根据自身规则放置子 widget

### 常用布局 Widget

1. **Padding**

```dart
Padding(
  padding: EdgeInsets.all(16.0),
  child: Text('Padded Text'),
)
```

2. **Center**

```dart
Center(
  child: Text('Centered Text'),
)
```

3. **Expanded**

```dart
Row(
  children: [
    Expanded(
      flex: 2,
      child: Container(color: Colors.red),
    ),
    Expanded(
      flex: 1,
      child: Container(color: Colors.blue),
    ),
  ],
)
```

### 样式定制

```dart
Container(
  decoration: BoxDecoration(
    gradient: LinearGradient(
      colors: [Colors.blue, Colors.green],
    ),
    borderRadius: BorderRadius.circular(8),
    boxShadow: [
      BoxShadow(
        color: Colors.grey.withOpacity(0.5),
        spreadRadius: 2,
        blurRadius: 5,
      ),
    ],
  ),
  child: Text(
    'Styled Text',
    style: TextStyle(
      fontSize: 20,
      fontWeight: FontWeight.bold,
      color: Colors.white,
    ),
  ),
)
```

### 主题设置

```dart
MaterialApp(
  theme: ThemeData(
    primarySwatch: Colors.blue,
    textTheme: TextTheme(
      headline1: TextStyle(
        fontSize: 24,
        fontWeight: FontWeight.bold,
      ),
      bodyText1: TextStyle(
        fontSize: 16,
        color: Colors.black87,
      ),
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        primary: Colors.blue,
        onPrimary: Colors.white,
      ),
    ),
  ),
  home: MyHomePage(),
)
```

## 状态管理基础

### setState

```dart
class CounterWidget extends StatefulWidget {
  @override
  _CounterWidgetState createState() => _CounterWidgetState();
}

class _CounterWidgetState extends State<CounterWidget> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $_counter'),
        ElevatedButton(
          onPressed: _incrementCounter,
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

### InheritedWidget

```dart
class DataProvider extends InheritedWidget {
  final String data;
  final Widget child;

  DataProvider({
    required this.data,
    required this.child,
  }) : super(child: child);

  static DataProvider? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<DataProvider>();
  }

  @override
  bool updateShouldNotify(DataProvider oldWidget) {
    return data != oldWidget.data;
  }
}
```

### Provider 入门

```dart
// 1. 添加依赖
// pubspec.yaml
// dependencies:
//   provider: ^6.0.0

// 2. 创建数据模型
class Counter with ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

// 3. 提供数据
void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => Counter(),
      child: MyApp(),
    ),
  );
}

// 4. 使用数据
class CounterWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Consumer<Counter>(
      builder: (context, counter, child) {
        return Text('Count: ${counter.count}');
      },
    );
  }
}
```

## Flutter 导航和路由

### 基础导航

```dart
// 导航到新页面
Navigator.push(
  context,
  MaterialPageRoute(builder: (context) => SecondPage()),
);

// 返回上一页
Navigator.pop(context);
```

### 命名路由

```dart
// 1. 定义路由
MaterialApp(
  routes: {
    '/': (context) => HomePage(),
    '/second': (context) => SecondPage(),
    '/third': (context) => ThirdPage(),
  },
);

// 2. 使用命名路由导航
Navigator.pushNamed(context, '/second');
```

### 路由传参

```dart
// 1. 带参数的页面
class DetailPage extends StatelessWidget {
  final String id;

  const DetailPage({required this.id});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Text('Detail page: $id'),
    );
  }
}

// 2. 传递参数
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => DetailPage(id: '123'),
  ),
);

// 3. 使用命名路由传参
MaterialApp(
  onGenerateRoute: (settings) {
    if (settings.name == '/detail') {
      final args = settings.arguments as Map<String, dynamic>;
      return MaterialPageRoute(
        builder: (context) => DetailPage(id: args['id']),
      );
    }
    return null;
  },
);

// 调用
Navigator.pushNamed(
  context,
  '/detail',
  arguments: {'id': '123'},
);
```

## 用户交互

### 手势识别

```dart
GestureDetector(
  onTap: () {
    print('Tapped!');
  },
  onDoubleTap: () {
    print('Double tapped!');
  },
  onLongPress: () {
    print('Long pressed!');
  },
  child: Container(
    padding: EdgeInsets.all(12.0),
    color: Colors.blue,
    child: Text('Tap me!'),
  ),
)
```

### 输入处理

```dart
TextField(
  decoration: InputDecoration(
    labelText: 'Username',
    hintText: 'Enter your username',
    prefixIcon: Icon(Icons.person),
    border: OutlineInputBorder(),
  ),
  onChanged: (value) {
    print('Current value: $value');
  },
  onSubmitted: (value) {
    print('Submitted: $value');
  },
)
```

### 表单处理

```dart
class LoginForm extends StatefulWidget {
  @override
  _LoginFormState createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final _formKey = GlobalKey<FormState>();
  String _email = '';
  String _password = '';

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          TextFormField(
            decoration: InputDecoration(labelText: 'Email'),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your email';
              }
              return null;
            },
            onSaved: (value) {
              _email = value ?? '';
            },
          ),
          TextFormField(
            decoration: InputDecoration(labelText: 'Password'),
            obscureText: true,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter your password';
              }
              return null;
            },
            onSaved: (value) {
              _password = value ?? '';
            },
          ),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                _formKey.currentState!.save();
                print('Email: $_email, Password: $_password');
              }
            },
            child: Text('Submit'),
          ),
        ],
      ),
    );
  }
}
```

## 网络请求

### HTTP 请求基础

```dart
// 1. 添加依赖
// pubspec.yaml
// dependencies:
//   http: ^0.13.0

import 'package:http/http.dart' as http;
import 'dart:convert';

// GET请求
Future<void> fetchData() async {
  try {
    final response = await http.get(
      Uri.parse('https://api.example.com/data'),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print(data);
    } else {
      throw Exception('Failed to load data');
    }
  } catch (e) {
    print('Error: $e');
  }
}

// POST请求
Future<void> createUser(String name, String email) async {
  try {
    final response = await http.post(
      Uri.parse('https://api.example.com/users'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
      }),
    );

    if (response.statusCode == 201) {
      print('User created successfully');
    } else {
      throw Exception('Failed to create user');
    }
  } catch (e) {
    print('Error: $e');
  }
}
```

### RESTful API 调用

```dart
class ApiService {
  static const baseUrl = 'https://api.example.com';

  // GET请求
  Future<List<dynamic>> getUsers() async {
    final response = await http.get(Uri.parse('$baseUrl/users'));
    return jsonDecode(response.body);
  }

  // POST请求
  Future<Map<String, dynamic>> createUser(Map<String, dynamic> userData) async {
    final response = await http.post(
      Uri.parse('$baseUrl/users'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(userData),
    );
    return jsonDecode(response.body);
  }

  // PUT请求
  Future<Map<String, dynamic>> updateUser(
    String id,
    Map<String, dynamic> userData,
  ) async {
    final response = await http.put(
      Uri.parse('$baseUrl/users/$id'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(userData),
    );
    return jsonDecode(response.body);
  }

  // DELETE请求
  Future<void> deleteUser(String id) async {
    await http.delete(Uri.parse('$baseUrl/users/$id'));
  }
}
```

### JSON 解析

```dart
// 1. 定义模型类
class User {
  final int id;
  final String name;
  final String email;

  User({
    required this.id,
    required this.name,
    required this.email,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
    };
  }
}

// 2. 使用模型类
Future<List<User>> fetchUsers() async {
  final response = await http.get(Uri.parse('https://api.example.com/users'));

  if (response.statusCode == 200) {
    final List<dynamic> jsonList = jsonDecode(response.body);
    return jsonList.map((json) => User.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load users');
  }
}
```

## 本地存储

### SharedPreferences

```dart
// 1. 添加依赖
// pubspec.yaml
// dependencies:
//   shared_preferences: ^2.0.0

import 'package:shared_preferences/shared_preferences.dart';

// 保存数据
Future<void> saveData() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('username', 'John');
  await prefs.setInt('age', 25);
  await prefs.setBool('isLoggedIn', true);
}

// 读取数据
Future<void> loadData() async {
  final prefs = await SharedPreferences.getInstance();
  final username = prefs.getString('username') ?? '';
  final age = prefs.getInt('age') ?? 0;
  final isLoggedIn = prefs.getBool('isLoggedIn') ?? false;
}

// 删除数据
Future<void> removeData() async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.remove('username');
  // 或清除所有数据
  await prefs.clear();
}
```

### 文件操作

```dart
import 'dart:io';
import 'package:path_provider/path_provider.dart';

// 获取本地文件路径
Future<String> get _localPath async {
  final directory = await getApplicationDocumentsDirectory();
  return directory.path;
}

// 获取本地文件
Future<File> get _localFile async {
  final path = await _localPath;
  return File('$path/counter.txt');
}

// 写入文件
Future<void> writeCounter(int counter) async {
  final file = await _localFile;
  await file.writeAsString('$counter');
}

// 读取文件
Future<int> readCounter() async {
  try {
    final file = await _localFile;
    final contents = await file.readAsString();
    return int.parse(contents);
  } catch (e) {
    return 0;
  }
}
```

### SQLite 基础

```dart
// 1. 添加依赖
// pubspec.yaml
// dependencies:
//   sqflite: ^2.0.0
//   path: ^1.8.0

import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

// 数据库助手类
class DatabaseHelper {
  static final DatabaseHelper instance = DatabaseHelper._init();
  static Database? _database;

  DatabaseHelper._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('notes.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 1,
      onCreate: _createDB,
    );
  }

  Future<void> _createDB(Database db, int version) async {
    await db.execute('''
      CREATE TABLE notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    ''');
  }

  // 插入数据
  Future<int> insert(Map<String, dynamic> row) async {
    final db = await instance.database;
    return await db.insert('notes', row);
  }

  // 查询数据
  Future<List<Map<String, dynamic>>> queryAll() async {
    final db = await instance.database;
    return await db.query('notes');
  }

  // 更新数据
  Future<int> update(Map<String, dynamic> row) async {
    final db = await instance.database;
    final id = row['id'];
    return await db.update(
      'notes',
      row,
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  // 删除数据
  Future<int> delete(int id) async {
    final db = await instance.database;
    return await db.delete(
      'notes',
      where: 'id = ?',
      whereArgs: [id],
    );
  }
}

// 使用示例
void main() async {
  // 插入笔记
  final note = {
    'title': 'First Note',
    'content': 'This is my first note',
    'createdAt': DateTime.now().toIso8601String(),
  };

  final id = await DatabaseHelper.instance.insert(note);

  // 查询所有笔记
  final notes = await DatabaseHelper.instance.queryAll();

  // 更新笔记
  final updatedNote = {
    'id': 1,
    'title': 'Updated Note',
    'content': 'This note has been updated',
    'createdAt': DateTime.now().toIso8601String(),
  };

  await DatabaseHelper.instance.update(updatedNote);

  // 删除笔记
  await DatabaseHelper.instance.delete(1);
}
```

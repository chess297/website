# Python 基础

## Python 基础语法

### 变量

```python
a = 1
b = 2
c = a + b
print(c)
```

### 注释

```python
# 单行注释
"""
多行注释
"""
```

### 输入输出

```python
# 输入
name = input("请输入你的名字：")
print("你好，" + name)

# 输出
print("Hello, World!")
```

### 数据类型

- 整型（int）
- 浮点型（float）
- 字符串（str）
- 布尔型（bool）
- 列表（list）
- 元组（tuple）
- 字典（dict）
- 集合（set）

### 运算符

- 算术运算符：+、-、\*、/、//、%、\*\*
- 比较运算符：==、!=、>、<、>=、<=
- 逻辑运算符：and、or、not

### 条件语句

```python
if a > 0:
    print("a 是正数")
elif a < 0:
    print("a 是负数")
else:
    print("a 是零")
```

### 循环语句

```python
# for 循环
for i in range(5):
    print(i)

# while 循环
i = 0
while i < 5:
    print(i)
    i += 1
```

### 函数

```python
def add(a, b):
    return a + b

result = add(1, 2)
print(result)
```

### 类

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def say_hello(self):
        print("Hello, my name is " + self.name)
```

### 模块

```python
import math

print(math.sqrt(16))
```

### 异常处理

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("除数不能为零")
finally:
    print("程序结束")
```

### 文件操作

```python
# 写入文件
with open("test.txt", "w") as f:
    f.write("Hello, World!")

# 读取文件
with open("test.txt", "r") as f:
    content = f.read()
    print(content)
```

### 网络编程

```python
import socket

# 创建 socket 对象
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 连接服务器
s.connect(("www.baidu.com", 80))

# 发送数据
```

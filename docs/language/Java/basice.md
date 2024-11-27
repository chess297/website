# Java 基础

## 基础概念

### JVM

> JVM 是 Java 语言的核心，它屏蔽了底层操作系统的差异性，让 Java 程序可以在不同的操作系统上运行。

### JDK

> JDK 是 Java 语言的开发工具包，它包含了 JRE 和一些开发工具，如编译器、调试器等。

### JRE

> JRE 是 Java 语言的运行环境，它包含了 JVM 和一些运行时库，如 Java 类库等。

### Java SE

> Java SE 是 Java 语言的标准版，它包含了 JRE 和一些开发工具，如编译器、调试器等。

### Java EE

> Java EE 是 Java 语言的企业版，它包含了 Java SE 和一些企业级应用开发工具，如 Servlet、JSP、EJB 等。

### Java ME

> Java ME 是 Java 语言的小型版，它包含了 Java SE 和一些移动设备开发工具，如 MIDP、PIM 等。

## 基础语法

### 变量

> 变量是程序中存储数据的容器，它可以存储不同类型的数据，如整数、浮点数、字符串等。

```java
int a = 1;
double b = 1.0;
```

### 数据类型

> 数据类型是程序中存储数据的类型，它可以分为基本数据类型和引用数据类型。

```java
// 基本数据类型
int a = 1;
double b = 1.0;
char c = 'a';
boolean d = true;

// 引用数据类型
String str = "Hello World";
```

### 运算符

> 运算符是程序中用于操作数据的符号，它可以分为算术运算符、关系运算符、逻辑运算符等。

```java
// 算术运算符
int a = 1 + 2;
int b = 1 - 2;
int c = 1 * 2;
```

### 流程控制

> 流程控制是程序中控制程序执行顺序的语句，它可以分为条件语句和循环语句。

```java
// 条件语句
if (a > 0) {
    System.out.println("a is positive");
} else if (a < 0) {
    System.out.println("a is negative");
} else {
    System.out.println("a is zero");
}

// 循环语句
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
```

### 方法

> 方法是程序中用于执行特定任务的代码块，它可以接受参数并返回结果。

```java
public static int add(int a, int b) {
    return a + b;
}
```

### 类和对象

> 类是程序中用于描述对象的模板，对象是类的实例。

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }
}

Person p = new Person("Tom", 18);
System.out.println(p.getName());
System.out.println(p.getAge());
```

## 常用类

### String

> String 是 Java 语言中用于表示字符串的类，它可以存储和操作字符串。

```java
String str = "Hello World";
System.out.println(str.length());
System.out.println(str.toUpperCase());
System.out.println(str.toLowerCase());
System.out.println(str.indexOf("World"));
System.out.println(str.substring(0, 5));
```

### StringBuilder

> StringBuilder 是 Java 语言中用于高效地操作字符串的类，它可以存储和修改字符串。

```java
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(" ");
sb.append("World");
System.out.println(sb.toString());
```

### ArrayList

> ArrayList 是 Java 语言中用于存储对象的类，它可以动态地增加和删除元素。

```java
ArrayList<String> list = new ArrayList<>();
list.add("Hello");
list.add("World");
System.out.println(list.get(0));
System.out.println(list.get(1));
list.remove(0);
System.out.println(list.size());
```

### HashMap

> HashMap 是 Java 语言中用于存储键值对的类，它可以高效地查找和修改键值对。

```java
HashMap<String, Integer> map = new HashMap<>();
map.put("Tom", 18);
map.put("Jerry", 20);
System.out.println(map.get("Tom"));
System.out.println(map.get("Jerry"));
map.remove("Tom");
System.out.println(map.size());
```

## 常用工具类

### Math

> Math 是 Java 语言中用于进行数学计算的类，它可以进行各种数学运算。

```java
double a = Math.random();
double b = Math.sqrt(4);
double c = Math.pow(2, 3);
double d = Math.max(1, 2);
double e = Math.min(1, 2);
double f = Math.abs(-1);
double g = Math.round(1.5);
double h = Math.ceil(1.5);
double i = Math.floor(1.5);

```

### Random

> Random 是 Java 语言中用于生成随机数的类，它可以生成各种类型的随机数。

```java
Random random = new Random();
int a = random.nextInt();
int b = random.nextInt(10);
double c = random.nextDouble();
```

### Date

> Date 是 Java 语言中用于表示日期和时间的类，它可以获取和设置日期和时间。

```java
Date date = new Date();
System.out.println(date.getTime());
System.out.println(date.toLocaleString());
```

### SimpleDateFormat

> SimpleDateFormat 是 Java 语言中用于格式化日期和时间的类，它可以按照指定的格式输出日期和时间。

```java
SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
String dateStr = sdf.format(new Date());
System.out.println(dateStr);
```

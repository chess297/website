---
title: Golang 面试题
sidebar_position: 4
---

# Golang 面试题

## 1. 基础概念

### Q1: Go 语言的特点是什么？

Go 语言的主要特点包括：

- 简单的并发编程支持（goroutine 和 channel）
- 快速的编译速度
- 垃圾回收机制
- 静态类型和编译型语言
- 跨平台支持
- 内置测试和性能分析工具

### Q2: := 和 = 的区别？

- := 是简短变量声明，用于声明和初始化新变量
- = 是赋值操作符，用于给已声明的变量赋值

```go
// := 示例
name := "张三"  // 声明并初始化

// = 示例
var age int
age = 25  // 赋值
```

### Q3: make 和 new 的区别？

- make 只用于创建 slice、map 和 channel，并完成初始化
- new 用于分配内存，返回指针，适用于任何类型

```go
// make 示例
slice := make([]int, 0, 10)
m := make(map[string]int)

// new 示例
p := new(int)  // 返回 *int
```

## 2. 并发编程

### Q4: goroutine 和线程的区别？

1. 内存占用：
   - goroutine 初始栈大小仅 2KB
   - 线程一般占用 2MB 栈空间
2. 调度：
   - goroutine 由 Go runtime 调度
   - 线程由操作系统调度
3. 创建和销毁：
   - goroutine 创建和销毁的开销很小
   - 线程创建和销毁的开销较大

### Q5: channel 的基本用法和注意事项？

```go
// 基本用法
ch := make(chan int)    // 无缓冲
ch := make(chan int, 1) // 有缓冲

// 发送和接收
ch <- 1    // 发送
value := <-ch  // 接收

// 关闭channel
close(ch)

// 注意事项：
// 1. 不要在接收端关闭channel
// 2. 防止重复关闭channel
// 3. 确保所有数据发送完成后再关闭
```

### Q6: 如何处理 panic？

```go
func handlePanic() {
    defer func() {
        if err := recover(); err != nil {
            fmt.Printf("Recovered from panic: %v\n", err)
        }
    }()

    // 可能发生panic的代码
}
```

## 3. 内存管理

### Q7: Go 的内存分配原理？

1. 内存分配器：
   - 基于 TCMalloc 实现
   - 使用内存池和多级缓存
2. 对象分类：
   - 小对象（0-32KB）：从 P 的本地缓存分配
   - 大对象（>32KB）：直接从堆分配
3. 内存管理：
   - span 管理
   - 垃圾回收
   - 内存释放

### Q8: Go 垃圾回收的工作原理？

1. 三色标记法：
   - 白色：潜在垃圾
   - 灰色：正在扫描
   - 黑色：活跃对象
2. 垃圾回收步骤：
   - 标记准备
   - 扫描标记
   - 清除阶段
3. 特点：
   - 并发执行
   - 写屏障
   - STW(Stop The World)时间短

## 4. 性能优化

### Q9: 如何进行性能分析？

```go
// 1. 使用 pprof
import _ "net/http/pprof"

// 2. 运行分析
go tool pprof http://localhost:6060/debug/pprof/heap
go tool pprof http://localhost:6060/debug/pprof/profile

// 3. 使用 trace
f, err := os.Create("trace.out")
defer f.Close()
trace.Start(f)
defer trace.Stop()
```

### Q10: 如何提高服务性能？

1. 并发处理：
   - 合理使用 goroutine
   - 控制并发数量
2. 内存优化：
   - 对象复用
   - 减少内存分配
3. CPU 优化：
   - 避免不必要的计算
   - 使用高效的算法
4. I/O 优化：
   - 使用缓冲 I/O
   - 批处理操作

## 5. 实践问题

### Q11: 项目中如何实现优雅关闭？

```go
func gracefulShutdown(server *http.Server) {
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit

    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    if err := server.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }
}
```

### Q12: 如何处理配置管理？

```go
type Config struct {
    Server struct {
        Port    int    `yaml:"port"`
        Host    string `yaml:"host"`
        Timeout int    `yaml:"timeout"`
    } `yaml:"server"`

    Database struct {
        DSN string `yaml:"dsn"`
    } `yaml:"database"`
}

func loadConfig() (*Config, error) {
    data, err := ioutil.ReadFile("config.yaml")
    if err != nil {
        return nil, err
    }

    var config Config
    err = yaml.Unmarshal(data, &config)
    return &config, err
}
```

## 面试技巧

- 准备具体的项目经验和示例
- 理解底层原理和实现机制
- 关注性能优化和最佳实践
- 熟悉 Go 的特色功能和应用场景
- 能够解释代码的优缺点

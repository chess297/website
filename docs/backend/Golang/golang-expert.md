---
title: Golang 高级知识
sidebar_position: 3
---

# Golang 高级知识

## 1. 内存管理和垃圾回收

### 1.1 内存分配原理

- 堆上分配：大对象、逃逸分析后的对象
- 栈上分配：小对象、局部变量
- TCMalloc 算法：线程缓存分配

### 1.2 垃圾回收机制

```go
// 垃圾回收触发条件示例
func memoryIntensive() {
    runtime.GC() // 手动触发GC
    var stats runtime.MemStats
    runtime.ReadMemStats(&stats)
    fmt.Printf("HeapAlloc = %v MB\n", stats.HeapAlloc / 1024 / 1024)
}

// GC 调优示例
func init() {
    // 设置 GC 目标百分比
    debug.SetGCPercent(100)
    // 设置最大内存使用
    debug.SetMemoryLimit(1024 * 1024 * 100) // 100MB
}
```

## 2. 深入 Channel

### 2.1 无缓冲 vs 有缓冲

```go
// 无缓冲channel的特性演示
func unbufferedChannel() {
    ch := make(chan int)
    go func() {
        ch <- 1 // 发送方会阻塞，直到有接收方准备好
    }()
    fmt.Println(<-ch) // 接收方会阻塞，直到有数据可用
}

// 有缓冲channel的特性演示
func bufferedChannel() {
    ch := make(chan int, 2)
    ch <- 1  // 不会阻塞
    ch <- 2  // 不会阻塞
    // ch <- 3  // 会阻塞，因为channel已满
}
```

### 2.2 Channel 实现原理

```go
// channel 的内部结构示例
type hchan struct {
    qcount   uint           // 当前队列中的元素数量
    dataqsiz uint          // 环形队列的大小
    buf      unsafe.Pointer // 指向环形队列的指针
    elemsize uint16        // 元素大小
    closed   uint32        // 是否已关闭
    elemtype *_type        // 元素类型
    sendx    uint          // 发送索引
    recvx    uint          // 接收索引
    recvq    waitq         // 等待接收的goroutine队列
    sendq    waitq         // 等待发送的goroutine队列
    lock     mutex         // 互斥锁
}
```

## 3. 网络编程

### 3.1 高性能 HTTP 服务器

```go
func highPerformanceServer() {
    mux := http.NewServeMux()

    // 使用连接池
    transport := &http.Transport{
        MaxIdleConns:        100,
        MaxIdleConnsPerHost: 100,
        IdleConnTimeout:     90 * time.Second,
    }

    client := &http.Client{
        Transport: transport,
        Timeout:   10 * time.Second,
    }

    // 使用自定义的Server配置
    server := &http.Server{
        Addr:         ":8080",
        Handler:      mux,
        ReadTimeout:  5 * time.Second,
        WriteTimeout: 10 * time.Second,
        IdleTimeout:  120 * time.Second,
    }

    server.ListenAndServe()
}
```

### 3.2 WebSocket 实现

```go
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
    upgrader := websocket.Upgrader{
        ReadBufferSize:  1024,
        WriteBufferSize: 1024,
        CheckOrigin: func(r *http.Request) bool {
            return true // 在生产环境中应该严格检查origin
        },
    }

    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return
    }
    defer conn.Close()

    for {
        messageType, p, err := conn.ReadMessage()
        if err != nil {
            return
        }
        if err := conn.WriteMessage(messageType, p); err != nil {
            return
        }
    }
}
```

## 4. 系统编程

### 4.1 系统调用

```go
func systemCall() {
    // 使用syscall包进行底层系统调用
    fd, err := syscall.Socket(syscall.AF_INET, syscall.SOCK_STREAM, 0)
    if err != nil {
        log.Fatal(err)
    }
    defer syscall.Close(fd)

    // 设置socket选项
    err = syscall.SetsockoptInt(fd, syscall.SOL_SOCKET, syscall.SO_REUSEADDR, 1)
}
```

### 4.2 信号处理

```go
func handleSignals() {
    sigs := make(chan os.Signal, 1)
    done := make(chan bool, 1)

    signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

    go func() {
        sig := <-sigs
        fmt.Println("接收到信号:", sig)
        done <- true
    }()

    fmt.Println("等待信号...")
    <-done
}
```

## 5. 编译和链接

### 5.1 交叉编译

```bash
# 交叉编译示例
GOOS=linux GOARCH=amd64 go build main.go
GOOS=windows GOARCH=amd64 go build main.go
GOOS=darwin GOARCH=arm64 go build main.go
```

### 5.2 Cgo 集成

```go
/*
#include <stdio.h>
#include <stdlib.h>

void print_hello() {
    printf("Hello from C!\n");
}
*/
import "C"
import "fmt"

func callC() {
    C.print_hello()

    // 在Go中使用C的字符串
    cs := C.CString("Hello from Go!")
    defer C.free(unsafe.Pointer(cs))
    C.printf("%s\n", cs)
}
```

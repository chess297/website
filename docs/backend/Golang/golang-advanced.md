---
title: Golang 进阶知识
sidebar_position: 2
---

# Golang 进阶知识

## 1. 高级并发模式

### 1.1 Context

```go
func handleRequest(ctx context.Context) {
    // 创建子context，设置超时
    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
    defer cancel()

    select {
    case <-time.After(3 * time.Second):
        fmt.Println("overslept")
    case <-ctx.Done():
        fmt.Println(ctx.Err()) // 输出 "context deadline exceeded"
    }
}
```

### 1.2 工作池模式

```go
func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d processing job %d\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)

    // 启动3个worker
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }

    // 发送9个任务
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)

    // 收集结果
    for a := 1; a <= 9; a++ {
        <-results
    }
}
```

## 2. 反射编程

### 2.1 基本反射

```go
func inspectType(x interface{}) {
    t := reflect.TypeOf(x)
    v := reflect.ValueOf(x)

    fmt.Printf("Type: %v\n", t)
    fmt.Printf("Value: %v\n", v)
}

type User struct {
    Name string
    Age  int
}

// 使用反射修改结构体字段
func modifyField(i interface{}, fieldName string, value interface{}) {
    v := reflect.ValueOf(i).Elem()
    field := v.FieldByName(fieldName)
    field.Set(reflect.ValueOf(value))
}
```

### 2.2 反射性能优化

```go
// 缓存反射类型信息
var typeCache = make(map[reflect.Type]map[string]int)

func getFieldIndex(t reflect.Type, field string) int {
    if cache, ok := typeCache[t]; ok {
        return cache[field]
    }

    cache := make(map[string]int)
    for i := 0; i < t.NumField(); i++ {
        cache[t.Field(i).Name] = i
    }
    typeCache[t] = cache
    return cache[field]
}
```

## 3. 性能优化

### 3.1 内存管理

```go
// 使用对象池
var bufPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func processData(data []byte) {
    buf := bufPool.Get().(*bytes.Buffer)
    defer bufPool.Put(buf)
    buf.Reset()
    // 使用buffer处理数据
}
```

### 3.2 CPU 优化

```go
// 避免频繁的内存分配
func optimizedAppend(slice []int, elements ...int) []int {
    total := len(slice) + len(elements)
    if total > cap(slice) {
        // 使用成倍扩容策略
        newCap := cap(slice) * 2
        if newCap < total {
            newCap = total
        }
        newSlice := make([]int, len(slice), newCap)
        copy(newSlice, slice)
        slice = newSlice
    }
    return append(slice, elements...)
}
```

## 4. 代码测试

### 4.1 单元测试

```go
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        x, y     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -2, -3, -5},
        {"zero", 0, 0, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            if got := Add(tt.x, tt.y); got != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d", tt.x, tt.y, got, tt.expected)
            }
        })
    }
}
```

### 4.2 基准测试

```go
func BenchmarkFibonacci(b *testing.B) {
    for n := 0; n < b.N; n++ {
        Fibonacci(20)
    }
}
```

## 5. 微服务设计

### 5.1 服务发现

```go
type Service struct {
    Name     string
    Version  string
    URL      string
    Metadata map[string]string
}

type Registry interface {
    Register(*Service) error
    Deregister(*Service) error
    GetService(name string) ([]*Service, error)
}
```

### 5.2 断路器模式

```go
type CircuitBreaker struct {
    timeout   time.Duration
    maxErrors int
    errors    int
    lastError time.Time
    state     state
    mutex     sync.RWMutex
}

func (cb *CircuitBreaker) Execute(work func() error) error {
    if !cb.canExecute() {
        return ErrCircuitOpen
    }

    err := work()
    cb.recordResult(err)
    return err
}
```

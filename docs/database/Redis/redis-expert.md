---
title: Redis 高级知识
sidebar_position: 3
---

# Redis 高级知识

## 1. Redis 内核剖析

### 1.1 事件驱动模型

1. **文件事件**

   - 基于 epoll/kqueue/select
   - 单线程非阻塞 IO
   - 事件处理器

2. **时间事件**
   - 定时任务
   - serverCron 函数
   - 过期键处理

### 1.2 数据结构实现

#### 1. 简单动态字符串 (SDS)

```c
struct sdshdr {
    int len;        // 字符串长度
    int free;       // 未使用空间
    char buf[];     // 字符数组
};
```

#### 2. 字典 (Dict)

```c
typedef struct dictht {
    dictEntry **table;  // 哈希表数组
    unsigned long size; // 哈希表大小
    unsigned long sizemask; // 掩码
    unsigned long used; // 已使用节点数
} dictht;
```

## 2. 高可用架构设计

### 2.1 Redis Sentinel

#### 架构原理

```conf
# sentinel.conf
sentinel monitor mymaster 127.0.0.1 6379 2
sentinel down-after-milliseconds mymaster 5000
sentinel failover-timeout mymaster 60000
sentinel parallel-syncs mymaster 1
```

#### 故障转移流程

1. 主观下线检测
2. 客观下线确认
3. Leader 选举
4. 故障转移执行

### 2.2 Cluster 深入

#### 数据分片算法

```python
# CRC16 算法
def slot_number(key):
    return crc16(key) % 16384

# 节点槽位分配
def assign_slots(nodes):
    slots_per_node = 16384 / len(nodes)
    # 分配算法实现
```

#### 集群通信协议

- PING/PONG 心跳消息
- MEET 节点握手
- FAIL 节点下线通知
- PUBLISH 消息广播

## 3. 分布式锁实现

### 3.1 基于 SET 命令

```bash
# 加锁
SET resource_name unique_value NX PX 30000

# 解锁（Lua脚本）
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

### 3.2 Redlock 算法

```python
def acquire_lock(resource, ttl):
    # 获取当前时间戳
    start = current_time_ms()

    # 尝试在多个实例上获取锁
    for redis_instance in redis_instances:
        try:
            if redis_instance.set(resource, token, nx=True, px=ttl):
                acquired_instances.append(redis_instance)
        except:
            continue

    # 计算获取锁消耗的时间
    elapsed = current_time_ms() - start

    # 检查是否获得了足够多的锁
    if len(acquired_instances) >= N/2+1 and elapsed < ttl:
        return True
    else:
        release_lock(resource, token)
        return False
```

## 4. 缓存设计进阶

### 4.1 缓存更新策略

#### Cache-Aside Pattern

```python
def get_user(user_id):
    # 先查缓存
    user = cache.get(f"user:{user_id}")
    if user is None:
        # 缓存未命中，查数据库
        user = db.get_user(user_id)
        if user is not None:
            # 写入缓存
            cache.set(f"user:{user_id}", user, ex=3600)
    return user
```

#### Write-Through Pattern

```python
def update_user(user):
    # 先更新数据库
    db.update_user(user)
    # 再更新缓存
    cache.set(f"user:{user.id}", user, ex=3600)
```

### 4.2 缓存穿透防护

#### 布隆过滤器实现

```python
def initialize_bloom_filter():
    # 使用Redis中的位图实现布隆过滤器
    pipe = redis.pipeline()
    for item in db.get_all_ids():
        for seed in range(k_hash_functions):
            bit_pos = hash_function(item, seed) % filter_size
            pipe.setbit("bloomfilter", bit_pos, 1)
    pipe.execute()
```

### 4.3 热点数据处理

```python
def get_hot_key(key):
    # 多级缓存
    value = local_cache.get(key)
    if value is None:
        value = redis.get(key)
        if value is not None:
            local_cache.set(key, value, ttl=10)  # 短期本地缓存
    return value
```

## 5. 性能调优深入

### 5.1 内存管理优化

#### 压缩数据结构

```bash
# 配置字符串压缩
CONFIG SET list-compress-depth 1
CONFIG SET hash-max-ziplist-entries 512
CONFIG SET zset-max-ziplist-entries 128
```

#### 内存碎片优化

```bash
# 碎片整理
CONFIG SET activedefrag yes
CONFIG SET active-defrag-threshold-lower 10
CONFIG SET active-defrag-threshold-upper 100
```

### 5.2 延迟分析

```bash
# 延迟监控
redis-cli --latency

# 定时任务延迟分析
redis-cli --latency-history

# 延迟直方图
redis-cli --latency-dist
```

## 6. 运维实践

### 6.1 大规模部署

#### Redis Cloud 架构

```yaml
# Docker Compose配置示例
version: "3"
services:
  redis-master:
    image: redis:6
    volumes:
      - ./redis.conf:/etc/redis/redis.conf
    command: redis-server /etc/redis/redis.conf
    ports:
      - "6379:6379"
    networks:
      - redis-net

  redis-slave:
    image: redis:6
    command: redis-server --slaveof redis-master 6379
    networks:
      - redis-net

  sentinel:
    image: redis:6
    command: redis-sentinel /etc/redis/sentinel.conf
    volumes:
      - ./sentinel.conf:/etc/redis/sentinel.conf
    networks:
      - redis-net

networks:
  redis-net:
    driver: bridge
```

### 6.2 性能基准测试

```bash
# 基准测试命令
redis-benchmark -h localhost -p 6379 -c 50 -n 100000

# 自定义测试场景
redis-benchmark -t set,get -n 100000 --csv

# 管道测试
redis-benchmark -P 16 -n 100000
```

## 7. 扩展功能开发

### 7.1 自定义命令

```c
// 创建自定义命令
void MyCommandFunction(RedisModuleCtx *ctx, RedisModuleString **argv, int argc) {
    // 命令实现
}

// 注册命令
if (RedisModule_CreateCommand(ctx, "MYCOMMAND",
    MyCommandFunction, "write deny-oom", 1, 1, 1) == REDISMODULE_ERR) {
    return REDISMODULE_ERR;
}
```

### 7.2 模块开发

```c
// 模块入口点
int RedisModule_OnLoad(RedisModuleCtx *ctx) {
    if (RedisModule_Init(ctx, "MyModule", 1,
        REDISMODULE_APIVER_1) == REDISMODULE_ERR) {
        return REDISMODULE_ERR;
    }

    // 注册命令
    if (RedisModule_CreateCommand(ctx, ...) == REDISMODULE_ERR) {
        return REDISMODULE_ERR;
    }

    return REDISMODULE_OK;
}
```

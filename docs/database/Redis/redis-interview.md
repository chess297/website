---
title: Redis 面试题
sidebar_position: 4
---

# Redis 面试题精选

## 1. 核心概念

### Q1: Redis 为什么这么快？

Redis 高性能的主要原因：

1. **内存存储**：所有数据都在内存中，避免了磁盘 IO
2. **单线程模型**：避免了线程切换和竞态条件
3. **IO 多路复用**：基于 epoll/kqueue 实现高效的事件处理
4. **优化的数据结构**：如 SDS、跳表等

### Q2: Redis 的数据类型及应用场景？

1. **String**

```bash
# 计数器
INCR page_view

# 分布式锁
SET lock_key unique_value NX PX 10000
```

2. **Hash**

```bash
# 用户信息
HSET user:1 name "张三" age 25 city "北京"
```

3. **List**

```bash
# 消息队列
LPUSH queue_name msg
BRPOP queue_name 0
```

4. **Set**

```bash
# 好友关系
SADD user:1:friends 2 3 4
SISMEMBER user:1:friends 2
```

5. **Sorted Set**

```bash
# 排行榜
ZADD leaderboard 89 "user1" 95 "user2"
ZREVRANGE leaderboard 0 2
```

## 2. 持久化机制

### Q3: RDB 和 AOF 的区别？

1. **RDB（快照）**

   - 优点：恢复快、文件小
   - 缺点：可能丢失最后一次快照后的数据
   - 适用：容忍数据丢失、追求快速恢复

2. **AOF（日志）**
   - 优点：数据安全性高、易读性好
   - 缺点：文件大、恢复慢
   - 适用：对数据安全性要求高的场景

### Q4: 如何选择持久化方式？

```conf
# 同时使用 RDB 和 AOF
save 900 1
save 300 10
appendonly yes
appendfsync everysec
```

建议策略：

1. 小规模数据：AOF
2. 大规模数据：RDB
3. 高可用要求：RDB + AOF

## 3. 高可用方案

### Q5: Redis Sentinel 和 Cluster 有什么区别？

1. **Sentinel（哨兵）**

```bash
# 主从复制 + 故障转移
sentinel monitor mymaster 127.0.0.1 6379 2
```

2. **Cluster（集群）**

```bash
# 分片 + 高可用
cluster-enabled yes
cluster-config-file nodes.conf
```

主要区别：

- Sentinel：主从架构，注重高可用
- Cluster：分片架构，注重扩展性

### Q6: Redis Cluster 如何实现数据分片？

```python
# 槽位分配原理
total_slots = 16384
key_slot = CRC16(key) % total_slots

# 节点分配
slots_per_node = total_slots / node_count
```

分片策略：

1. 虚拟槽分区
2. 一致性哈希
3. 数据迁移

## 4. 缓存设计

### Q7: 如何解决缓存穿透问题？

1. **布隆过滤器**

```python
# 布隆过滤器实现
def check_exists(key):
    if not bloom_filter.exists(key):
        return None
    value = cache.get(key)
    if value is None:
        value = db.get(key)
        cache.set(key, value)
    return value
```

2. **空值缓存**

```python
def get_user(id):
    value = cache.get(f"user:{id}")
    if value is None:  # 未命中
        value = db.get(id)
        cache.set(f"user:{id}", value or "", ex=60)  # 空值也缓存
    return value
```

### Q8: 如何处理缓存雪崩？

1. **过期时间打散**

```python
def set_with_random_expire(key, value):
    base_expire = 3600  # 基础过期时间
    random_expire = random.randint(-300, 300)  # 随机范围
    cache.set(key, value, ex=base_expire + random_expire)
```

2. **多级缓存**

```python
def get_with_multi_level_cache(key):
    # 本地缓存
    value = local_cache.get(key)
    if value:
        return value

    # Redis缓存
    value = redis_cache.get(key)
    if value:
        local_cache.set(key, value, ttl=10)
        return value

    # 数据库
    value = db.get(key)
    redis_cache.set(key, value, ex=3600)
    local_cache.set(key, value, ttl=10)
    return value
```

## 5. 性能优化

### Q9: Redis 内存优化有哪些方法？

1. **内存配置**

```conf
maxmemory 1gb
maxmemory-policy allkeys-lru
```

2. **数据结构优化**

```bash
# 使用Hash压缩
HSET user:1 name "张三" age "25"  # 代替多个String

# 使用BitMap
SETBIT online_users 1001 1  # 代替Set记录用户在线状态
```

3. **过期策略**

```python
# 惰性删除 + 定期删除
EXPIRE key seconds
```

### Q10: 如何提高 Redis 读写性能？

1. **批量操作**

```bash
# Pipeline批量操作
PIPELINE
SET key1 value1
SET key2 value2
EXEC
```

2. **合理使用数据结构**

```bash
# 使用HMSET代替多次SET
HMSET user:1 name "张三" age 25 city "北京"

# 使用MGET代替多次GET
MGET key1 key2 key3
```

## 6. 运维管理

### Q11: Redis 常见性能问题排查？

1. **延迟问题**

```bash
# 检查慢查询
SLOWLOG GET 10

# 监控延迟
redis-cli --latency
```

2. **内存问题**

```bash
# 内存分析
INFO memory
MEMORY USAGE key
```

### Q12: Redis 部署最佳实践？

1. **高可用部署**

```yaml
# Docker Compose部署示例
version: "3"
services:
  redis-master:
    image: redis:6
    volumes:
      - ./redis.conf:/etc/redis/redis.conf

  redis-slave:
    image: redis:6
    command: redis-server --slaveof redis-master 6379

  redis-sentinel:
    image: redis:6
    command: redis-sentinel /etc/redis/sentinel.conf
```

2. **监控告警**

```bash
# 关键指标监控
INFO stats
INFO clients
INFO memory
```

## 7. 开发实践

### Q13: Redis 如何实现分布式锁？

1. **基础实现**

```python
def acquire_lock(lock_name, acquire_time=10):
    identifier = str(uuid.uuid4())
    end = time.time() + acquire_time

    while time.time() < end:
        if redis.setnx(lock_name, identifier):
            redis.expire(lock_name, acquire_time)
            return identifier
        time.sleep(0.1)
    return False

def release_lock(lock_name, identifier):
    pipe = redis.pipeline(True)
    try:
        pipe.watch(lock_name)
        if pipe.get(lock_name) == identifier:
            pipe.multi()
            pipe.delete(lock_name)
            pipe.execute()
            return True
    except:
        pass
    return False
```

2. **Redlock 算法**

```python
def acquire_redlock(resource, ttl=100):
    servers = ['redis://localhost:6379', 'redis://localhost:6380']
    locks = []

    for server in servers:
        try:
            client = redis.from_url(server)
            if client.set(resource, token, nx=True, px=ttl):
                locks.append(client)
        except:
            continue

    if len(locks) > len(servers)/2:
        return True, locks
    else:
        release_redlock(resource, locks)
        return False, []
```

### Q14: Redis 事务实现原理是什么？

1. **ACID 特性**

- 原子性：MULTI/EXEC/DISCARD
- 一致性：命令检查
- 隔离性：单线程
- 持久性：取决于持久化配置

2. **事务用法**

```bash
MULTI
INCR counter
INCR counter
EXEC
```

## 面试技巧总结

1. **原理理解**

- 掌握核心原理
- 理解设计思想
- 熟悉最佳实践

2. **实战经验**

- 准备实际案例
- 性能优化经验
- 问题排查方法

3. **技术广度**

- 了解常见方案
- 掌握对比优劣
- 场景应用能力

4. **热点问题**

- 分布式锁实现
- 缓存设计模式
- 集群方案选择

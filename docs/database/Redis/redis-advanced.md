---
title: Redis 进阶知识
sidebar_position: 2
---

# Redis 进阶知识

## 1. 持久化深入研究

### 1.1 RDB 持久化

#### 原理与配置

```conf
# redis.conf
save 900 1      # 900秒内有1个键被修改，则触发保存
save 300 10     # 300秒内有10个键被修改，则触发保存
save 60 10000   # 60秒内有10000个键被修改，则触发保存

# 文件名配置
dbfilename dump.rdb

# 文件保存路径
dir ./
```

#### 自动保存与手动保存

```bash
# 手动保存（同步）
SAVE

# 手动保存（异步）
BGSAVE

# 获取最后一次保存状态
LASTSAVE
```

### 1.2 AOF 持久化

#### 基本配置

```conf
# 开启AOF
appendonly yes

# 同步策略
appendfsync always    # 每次写入都同步
appendfsync everysec  # 每秒同步一次
appendfsync no       # 由操作系统决定同步时机

# AOF文件名
appendfilename "appendonly.aof"
```

#### 重写机制

```bash
# 手动触发重写
BGREWRITEAOF

# 自动重写配置
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
```

## 2. 主从复制进阶

### 2.1 复制原理

1. **完整重同步流程**

   - 主节点创建 RDB 文件
   - 发送 RDB 到从节点
   - 发送缓冲区数据

2. **部分重同步**
   - 复制偏移量
   - 复制积压缓冲区
   - 服务器运行 ID

### 2.2 配置示例

主节点配置：

```conf
# redis.conf (master)
bind 0.0.0.0
protected-mode yes
requirepass "master-password"
masterauth "master-password"
```

从节点配置：

```conf
# redis.conf (slave)
replicaof 192.168.1.100 6379
masterauth "master-password"
replica-read-only yes
```

### 2.3 监控与维护

```bash
# 查看复制状态
INFO replication

# 查看主从延迟
PING
INFO replication | grep lag

# 手动同步
SLAVEOF NO ONE  # 断开复制
SLAVEOF host port  # 开启复制
```

## 3. Redis Cluster

### 3.1 集群架构

```conf
# 开启集群模式
cluster-enabled yes

# 集群配置文件
cluster-config-file nodes-6379.conf

# 节点超时时间
cluster-node-timeout 5000
```

### 3.2 集群操作

```bash
# 创建集群
redis-cli --cluster create 127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 \
  127.0.0.1:7004 127.0.0.1:7005 127.0.0.1:7006 \
  --cluster-replicas 1

# 添加节点
redis-cli --cluster add-node new_host:new_port existing_host:existing_port

# 删除节点
redis-cli --cluster del-node host:port node_id

# 重新分片
redis-cli --cluster reshard host:port
```

### 3.3 故障转移

```bash
# 手动故障转移
CLUSTER FAILOVER

# 查看集群状态
CLUSTER INFO
CLUSTER NODES
```

## 4. 内存优化

### 4.1 内存配置

```conf
# 设置最大内存
maxmemory 1gb

# 内存策略
maxmemory-policy noeviction   # 不淘汰
maxmemory-policy allkeys-lru  # 所有键随机淘汰
maxmemory-policy volatile-lru # 设置过期时间的键淘汰
maxmemory-policy allkeys-random  # 随机淘汰
```

### 4.2 内存分析

```bash
# 内存使用统计
INFO memory

# 大键分析
redis-cli --bigkeys

# 内存碎片率
INFO memory | grep mem_fragmentation_ratio
```

## 5. 性能优化

### 5.1 慢查询分析

```conf
# 配置慢查询日志
slowlog-log-slower-than 10000  # 微秒
slowlog-max-len 128
```

```bash
# 获取慢查询日志
SLOWLOG get [n]
SLOWLOG len
SLOWLOG reset
```

### 5.2 Pipeline 优化

```python
# Python示例
pipe = redis.pipeline(transaction=False)
for i in range(100):
    pipe.set(f"key:{i}", f"value:{i}")
pipe.execute()
```

### 5.3 网络优化

```conf
# TCP keepalive
tcp-keepalive 300

# 客户端超时
timeout 0

# 最大客户端数量
maxclients 10000
```

## 6. 安全加固

### 6.1 网络安全

```conf
# 绑定地址
bind 127.0.0.1 192.168.1.100

# 保护模式
protected-mode yes

# SSL/TLS配置
tls-port 6379
tls-cert-file redis.crt
tls-key-file redis.key
tls-ca-cert-file ca.crt
```

### 6.2 访问控制

```bash
# 设置密码
CONFIG SET requirepass "complex_password"

# ACL配置
ACL SETUSER myuser on >password ~cached:* +get +set +del

# 查看ACL规则
ACL LIST
```

## 7. 监控告警

### 7.1 INFO 命令监控

```bash
# 服务器信息
INFO server

# 客户端连接信息
INFO clients

# 内存信息
INFO memory

# 持久化信息
INFO persistence
```

### 7.2 自定义监控指标

```bash
# 键空间通知
CONFIG SET notify-keyspace-events KEA

# 事件订阅
PSUBSCRIBE __keyspace@0__:*
PSUBSCRIBE __keyevent@0__:expired
```

## 8. Lua 脚本

### 8.1 基本用法

```bash
# 执行Lua脚本
EVAL "return redis.call('set',KEYS[1],ARGV[1])" 1 mykey myvalue

# 脚本缓存
SCRIPT LOAD "return redis.call('get',KEYS[1])"
EVALSHA sha1 1 mykey
```

### 8.2 原子性操作

```lua
-- 计数器示例
local key = KEYS[1]
local value = redis.call('get', key)
if not value then
    value = 0
end
value = value + 1
redis.call('set', key, value)
return value
```

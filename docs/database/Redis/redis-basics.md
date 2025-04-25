---
title: Redis 基础知识
sidebar_position: 1
---

# Redis 基础知识

## 1. Redis 简介

### 1.1 什么是 Redis？

Redis (Remote Dictionary Server) 是一个开源的内存数据结构存储系统，可以用作：

- 数据库
- 缓存
- 消息中间件
- 队列

### 1.2 Redis 特点

1. **高性能**

   - 基于内存操作
   - 单线程模型
   - IO 多路复用

2. **数据类型丰富**

   - String（字符串）
   - Hash（哈希）
   - List（列表）
   - Set（集合）
   - Sorted Set（有序集合）
   - Bitmap
   - HyperLogLog
   - Geo

3. **持久化支持**

   - RDB 快照
   - AOF 日志

4. **原子性操作**
   - 单个操作原子性
   - 支持事务

## 2. 安装与配置

### 2.1 安装 Redis

```bash
# Ubuntu/Debian
apt-get update
apt-get install redis-server

# CentOS/RHEL
yum install redis

# macOS
brew install redis

# Windows
# 下载 Windows 版本安装包
```

### 2.2 基础配置

配置文件位置：

- Linux: /etc/redis/redis.conf
- macOS: /usr/local/etc/redis.conf

常用配置项：

```conf
# 基本配置
port 6379
bind 127.0.0.1
daemonize yes
requirepass your_password

# 内存配置
maxmemory 1gb
maxmemory-policy allkeys-lru

# 持久化配置
save 900 1
save 300 10
save 60 10000
```

## 3. 基本操作

### 3.1 连接 Redis

```bash
# 本地连接
redis-cli

# 远程连接
redis-cli -h host -p port -a password
```

### 3.2 数据类型操作

#### String 操作

```bash
# 设置键值
SET key value
SET name "张三"

# 获取值
GET key
GET name

# 设置过期时间
SETEX key seconds value
SETEX session:token 3600 "abc123"

# 自增自减
INCR counter
DECR counter
```

#### Hash 操作

```bash
# 设置哈希字段
HSET user:1 name "张三" age 25
HSET user:1 email "zhangsan@example.com"

# 获取哈希字段
HGET user:1 name
HGETALL user:1

# 删除哈希字段
HDEL user:1 email
```

#### List 操作

```bash
# 添加元素
LPUSH mylist "first"
RPUSH mylist "last"

# 获取元素
LRANGE mylist 0 -1
LPOP mylist
RPOP mylist

# 列表长度
LLEN mylist
```

#### Set 操作

```bash
# 添加成员
SADD myset "element1"
SADD myset "element2"

# 获取所有成员
SMEMBERS myset

# 判断元素是否存在
SISMEMBER myset "element1"

# 集合运算
SINTER set1 set2
SUNION set1 set2
SDIFF set1 set2
```

#### Sorted Set 操作

```bash
# 添加成员和分数
ZADD leaderboard 100 "player1"
ZADD leaderboard 200 "player2"

# 获取排名
ZRANGE leaderboard 0 -1
ZREVRANGE leaderboard 0 -1

# 获取分数
ZSCORE leaderboard "player1"
```

## 4. 数据管理

### 4.1 数据库操作

```bash
# 切换数据库
SELECT 1

# 清空当前数据库
FLUSHDB

# 清空所有数据库
FLUSHALL
```

### 4.2 键管理

```bash
# 查看所有键
KEYS *

# 获取键类型
TYPE key

# 检查键是否存在
EXISTS key

# 删除键
DEL key

# 设置过期时间
EXPIRE key seconds
TTL key
```

## 5. 事务处理

```bash
# 开始事务
MULTI

# 执行命令
SET user:1:name "张三"
SET user:1:age "25"

# 提交事务
EXEC

# 回滚事务
DISCARD
```

## 6. 发布订阅

```bash
# 订阅频道
SUBSCRIBE channel1

# 发布消息
PUBLISH channel1 "Hello World"

# 取消订阅
UNSUBSCRIBE channel1

# 查看频道订阅者数量
PUBSUB NUMSUB channel1
```

## 7. 备份与恢复

```bash
# 创建RDB快照
SAVE
BGSAVE

# 开启AOF
CONFIG SET appendonly yes

# 手动重写AOF文件
BGREWRITEAOF
```

## 8. 性能监控

```bash
# 获取服务器信息
INFO

# 获取内存使用情况
INFO memory

# 监控命令执行
MONITOR

# 获取慢日志
SLOWLOG get 10
```

## 9. 安全配置

### 9.1 访问控制

```bash
# 设置密码
CONFIG SET requirepass "your_password"

# 验证密码
AUTH "your_password"
```

### 9.2 命令重命名

```conf
# redis.conf
rename-command FLUSHALL ""
rename-command FLUSHDB ""
rename-command CONFIG ""
```

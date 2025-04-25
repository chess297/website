---
title: MySQL 高级知识
sidebar_position: 3
---

# MySQL 高级知识

## 1. MySQL 内核剖析

### 1.1 存储引擎架构

#### 插件式存储引擎

```c
// 存储引擎接口定义
struct st_handler_place {
    const char *name;     // 存储引擎名称
    const char *author;   // 作者
    const char *descr;    // 描述
    uint32 flags;         // 特性标志
    uint32 version;       // 版本号
    // ... 其他接口方法
};
```

#### 查询执行流程

1. **连接管理**

   - 身份验证
   - 权限检查
   - 连接池复用

2. **查询缓存** (8.0 已移除)

```sql
-- 查询缓存配置(5.7及之前版本)
query_cache_type = 0
query_cache_size = 0
```

3. **解析优化**

   - 词法分析
   - 语法分析
   - 预处理器
   - 查询优化器

4. **存储引擎层**
   - 访问表和索引
   - 事务处理
   - 并发控制

### 1.2 InnoDB 架构深入

#### 内存架构

```plaintext
Buffer Pool
├── 数据页 (16KB)
│   ├── 新数据页
│   └── 热点数据页
├── 索引页
├── 插入缓冲
├── 自适应哈希索引
└── 锁信息

额外内存池
├── 排序缓冲
├── 连接缓冲
└── 锁结构
```

#### 磁盘架构

```plaintext
系统表空间 (ibdata1)
├── 数据字典
├── 双写缓冲
├── 回滚段
└── 插入缓冲

独立表空间 (.ibd)
├── 数据页
├── 索引页
└── UNDO页
```

## 2. 事务与锁机制深入

### 2.1 事务实现原理

#### undo log 实现

```sql
-- 查看undo日志配置
SHOW VARIABLES LIKE '%innodb_undo%';

-- undo日志空间
CREATE UNDO TABLESPACE undo_003
ADD DATAFILE 'undo_003.ibu';

-- 清理历史undo
SET GLOBAL innodb_purge_rseg_truncate_frequency = 128;
```

#### redo log 实现

```ini
# redo日志配置
innodb_log_file_size = 1G
innodb_log_files_in_group = 3
innodb_log_buffer_size = 16M

# 刷盘策略
innodb_flush_log_at_trx_commit = 1
```

### 2.2 锁机制实现

#### 锁类型实现

```sql
-- 意向锁示例
CREATE TABLE products (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    stock INT,
    version INT
) ENGINE = InnoDB;

-- 乐观锁实现
UPDATE products
SET stock = stock - 1, version = version + 1
WHERE id = 1 AND version = 1;

-- 悲观锁实现
SELECT * FROM products
WHERE id = 1 FOR UPDATE;
```

#### 死锁检测

```sql
-- 查看死锁信息
SHOW ENGINE INNODB STATUS;

-- 死锁检测配置
innodb_deadlock_detect = ON
innodb_lock_wait_timeout = 50

-- 事务等待图
SELECT r.trx_id waiting_trx_id,
       r.trx_mysql_thread_id waiting_thread,
       b.trx_id blocking_trx_id,
       b.trx_mysql_thread_id blocking_thread
FROM information_schema.innodb_lock_waits w
INNER JOIN information_schema.innodb_trx b
    ON b.trx_id = w.blocking_trx_id
INNER JOIN information_schema.innodb_trx r
    ON r.trx_id = w.requesting_trx_id;
```

## 3. 查询优化器原理

### 3.1 优化器组件

#### 成本估算模型

```sql
-- 查看优化器成本常数
SHOW VARIABLES LIKE 'optimizer_switch';

-- 成本计算公式
读取成本 = 行数 × I/O成本
CPU成本 = 行数 × CPU计算成本
总成本 = 读取成本 + CPU成本
```

#### 统计信息收集

```sql
-- 收集表统计信息
ANALYZE TABLE users;

-- 查看表统计信息
SELECT * FROM information_schema.STATISTICS
WHERE table_schema = 'mydb'
AND table_name = 'users';

-- 直方图统计
ANALYZE TABLE users
UPDATE HISTOGRAM ON age, score;
```

### 3.2 执行计划生成

#### 连接算法

```sql
-- Nested Loop Join
SELECT /*+ NO_HASH_JOIN(t1,t2) */ *
FROM t1, t2
WHERE t1.id = t2.id;

-- Hash Join (MySQL 8.0+)
SELECT /*+ HASH_JOIN(t1,t2) */ *
FROM t1, t2
WHERE t1.id = t2.id;

-- 排序合并连接
SELECT /*+ MERGE(t1,t2) */ *
FROM t1, t2
WHERE t1.id = t2.id;
```

#### 子查询处理

```sql
-- 子查询转换为JOIN
SELECT * FROM t1
WHERE id IN (SELECT id FROM t2);
-- 优化为
SELECT DISTINCT t1.*
FROM t1 JOIN t2 ON t1.id = t2.id;

-- 子查询物化
SELECT * FROM t1
WHERE id IN (
    SELECT /*+ MATERIALIZE */ id
    FROM t2 WHERE status = 'active'
);
```

## 4. 缓冲池管理

### 4.1 缓冲池内部结构

#### LRU 算法实现

```plaintext
缓冲池
├── Young 区域 (5/8)
│   └── 最近访问的页
└── Old 区域 (3/8)
    └── 较少访问的页

配置参数：
innodb_old_blocks_pct = 37     # Old区域比例
innodb_old_blocks_time = 1000  # 停留时间窗口
```

#### 预读机制

```sql
-- 线性预读
innodb_read_ahead_threshold = 56

-- 随机预读
SET GLOBAL innodb_random_read_ahead = ON;
```

### 4.2 刷新机制

#### 脏页刷新策略

```ini
# 后台刷新线程
innodb_page_cleaners = 4

# 刷新阈值
innodb_max_dirty_pages_pct = 90
innodb_max_dirty_pages_pct_lwm = 10

# 刷新算法
innodb_flush_neighbors = 0  # MySQL 8.0默认关闭
```

#### Checkpoint 机制

```plaintext
检查点类型：
1. Sharp Checkpoint
   - 数据库关闭时
   - 所有脏页刷新

2. Fuzzy Checkpoint
   - Master线程周期性刷新
   - 脏页比例超限
   - redo log空间不足
   - 空闲页不足
```

## 5. 复制技术深入

### 5.1 二进制日志

#### binlog 格式

```sql
-- 查看当前格式
SHOW VARIABLES LIKE 'binlog_format';

-- 支持的格式
STATEMENT：记录SQL语句
ROW：记录行变更
MIXED：混合模式
```

#### binlog 写入机制

```plaintext
写入流程：
1. 事务执行
2. prepare阶段
3. 写入binlog
4. commit阶段

参数配置：
sync_binlog = 1          # 每次事务都刷盘
binlog_cache_size = 4M   # 每个事务的缓存大小
```

### 5.2 复制实现原理

#### 基于 GTID 复制

```sql
-- 启用GTID
gtid_mode = ON
enforce_gtid_consistency = ON

-- GTID状态查看
SHOW MASTER STATUS;
SHOW SLAVE STATUS;

-- 从库并行复制配置
slave_parallel_type = LOGICAL_CLOCK
slave_parallel_workers = 16
```

#### 复制过滤器

```sql
-- 主库过滤
binlog_do_db = mydb
binlog_ignore_db = test

-- 从库过滤
replicate_do_db = mydb
replicate_ignore_db = test
replicate_wild_do_table = mydb.%
```

## 6. 分布式数据库架构

### 6.1 分库分表方案

#### 水平分片

```sql
-- 按用户ID分片
CREATE TABLE users_0 (
    id BIGINT,
    name VARCHAR(100),
    PRIMARY KEY(id)
) ENGINE = InnoDB;

-- 分片规则
id % 256 = 0  -- 存储到 users_0
id % 256 = 1  -- 存储到 users_1
...
```

#### 垂直分片

```sql
-- 用户基础信息表
CREATE TABLE user_basic (
    id BIGINT,
    name VARCHAR(100),
    email VARCHAR(100),
    PRIMARY KEY(id)
);

-- 用户扩展信息表
CREATE TABLE user_extend (
    user_id BIGINT,
    address TEXT,
    preferences JSON,
    PRIMARY KEY(user_id)
);
```

### 6.2 分布式事务

#### XA 事务

```sql
-- XA事务示例
XA START 'xatest';
UPDATE account_1 SET balance = balance - 100;
XA END 'xatest';
XA PREPARE 'xatest';
XA COMMIT 'xatest';

-- 查看XA事务
XA RECOVER;
```

#### 柔性事务

```plaintext
TCC模式：
Try     - 预留资源
Confirm - 确认执行
Cancel  - 取消执行

SAGA模式：
T1 -> T2 -> T3 -> Tn
补偿：C1 <- C2 <- C3 <- Cn
```

## 7. 性能优化高级技巧

### 7.1 SQL 优化进阶

#### 分页优化

```sql
-- 传统分页
SELECT * FROM products
ORDER BY id
LIMIT 10000, 20;

-- 优化方案1：使用书签
SELECT * FROM products
WHERE id > 10000
ORDER BY id
LIMIT 20;

-- 优化方案2：延迟关联
SELECT p.*
FROM products p
JOIN (
    SELECT id
    FROM products
    ORDER BY id
    LIMIT 10000, 20
) tmp USING(id);
```

#### 排序优化

```sql
-- 优化ORDER BY
CREATE INDEX idx_user_created
ON users(status, created_at);

-- 使用索引排序
SELECT * FROM users
WHERE status = 1
ORDER BY created_at DESC;

-- 优化限制内存排序
SET max_length_for_sort_data = 4096;
```

### 7.2 服务器参数调优

#### 内存参数

```ini
# InnoDB缓冲池
innodb_buffer_pool_size = RAM的50%-70%
innodb_buffer_pool_instances = CPU核心数

# 排序和连接缓冲
sort_buffer_size = 2M
join_buffer_size = 2M
read_rnd_buffer_size = 2M

# 临时表
tmp_table_size = 64M
max_heap_table_size = 64M
```

#### I/O 参数

```ini
# 文件系统参数
innodb_flush_method = O_DIRECT
innodb_write_io_threads = 8
innodb_read_io_threads = 8

# 日志参数
innodb_log_file_size = 1G
innodb_log_files_in_group = 3
innodb_flush_log_at_trx_commit = 1
```

### 7.3 硬件优化

#### 磁盘 I/O 优化

```bash
# 使用多个磁盘
innodb_data_home_dir = /disk1/mysql/data
innodb_log_group_home_dir = /disk2/mysql/logs

# RAID配置
RAID 10：高性能高可靠
RAID 5：平衡性能和容量
```

#### CPU 优化

```ini
# 并发连接
max_connections = 2000
back_log = 3000

# 线程池
thread_handling = pool-of-threads
thread_pool_size = CPU核心数
```

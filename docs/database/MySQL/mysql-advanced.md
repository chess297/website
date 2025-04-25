---
title: MySQL 进阶知识
sidebar_position: 2
---

# MySQL 进阶知识

## 1. 存储引擎深入研究

### 1.1 InnoDB 存储引擎

#### 架构特点

1. **缓冲池管理**

```sql
-- 查看缓冲池配置
SHOW VARIABLES LIKE 'innodb_buffer_pool%';

-- 监控缓冲池状态
SHOW ENGINE INNODB STATUS;

-- 推荐配置
innodb_buffer_pool_size = 物理内存的 50%-70%
innodb_buffer_pool_instances = 8  -- CPU核心数
```

2. **事务处理**

```sql
-- ACID特性实现
- 原子性：undo log
- 一致性：double write buffer
- 隔离性：锁机制 + MVCC
- 持久性：redo log
```

3. **MVCC 实现**

```sql
-- 查看事务版本号
SHOW VARIABLES LIKE 'tx_isolation';

-- 行记录的隐藏列
DB_TRX_ID: 事务ID
DB_ROLL_PTR: 回滚指针
DB_ROW_ID: 行ID
```

### 1.2 MyISAM vs InnoDB

#### 功能对比

| 特性     | MyISAM | InnoDB     |
| -------- | ------ | ---------- |
| 事务支持 | 否     | 是         |
| 锁粒度   | 表锁   | 行锁       |
| 外键     | 否     | 是         |
| MVCC     | 否     | 是         |
| 崩溃恢复 | 不支持 | 支持       |
| 全文索引 | 支持   | 5.6 后支持 |

#### 适用场景

```sql
-- MyISAM适用
CREATE TABLE logs (
    id INT AUTO_INCREMENT,
    message TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=MyISAM;  -- 日志、文档等只读场景

-- InnoDB适用
CREATE TABLE orders (
    id INT AUTO_INCREMENT,
    user_id INT,
    amount DECIMAL(10,2),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;  -- 订单、用户等需要事务的场景
```

## 2. 查询优化深入

### 2.1 执行计划详解

#### EXPLAIN 输出列详解

```sql
-- 示例查询
EXPLAIN SELECT
    u.name,
    COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id
HAVING order_count > 10;

-- 关键字段解释
id: 查询序号
select_type: 查询类型（SIMPLE, PRIMARY, SUBQUERY等）
table: 表名
partitions: 分区信息
type: 访问类型（const, eq_ref, ref, range等）
possible_keys: 可能用到的索引
key: 实际使用的索引
key_len: 索引使用的长度
ref: 索引比较的列
rows: 预估需要扫描的行数
filtered: 按表条件过滤的比例
Extra: 额外信息
```

#### 访问类型详解

```sql
-- system/const（最好）
EXPLAIN SELECT * FROM users WHERE id = 1;

-- eq_ref
EXPLAIN SELECT * FROM orders o
JOIN users u ON u.id = o.user_id
WHERE o.status = 'completed';

-- ref
EXPLAIN SELECT * FROM users
WHERE name = 'John';

-- range
EXPLAIN SELECT * FROM users
WHERE age BETWEEN 20 AND 30;

-- index
EXPLAIN SELECT name FROM users;

-- ALL（最差）
EXPLAIN SELECT * FROM users
WHERE YEAR(created_at) = 2025;
```

### 2.2 查询优化器

#### 优化器追踪

```sql
-- 开启优化器追踪
SET optimizer_trace="enabled=on";

-- 执行查询
SELECT * FROM users WHERE age > 25;

-- 查看优化过程
SELECT * FROM information_schema.OPTIMIZER_TRACE;
```

#### 优化器提示

```sql
-- 强制使用索引
SELECT /*+ INDEX(users idx_age) */ *
FROM users WHERE age > 25;

-- 忽略索引
SELECT /*+ IGNORE_INDEX(users idx_age) */ *
FROM users WHERE age > 25;

-- 设置连接算法
SELECT /*+ NO_HASH_JOIN(u,o) */
    u.name, o.order_id
FROM users u
JOIN orders o ON u.id = o.user_id;
```

### 2.3 SQL 优化实例

#### 子查询优化

```sql
-- 优化前（相关子查询）
SELECT *
FROM orders o
WHERE o.amount > (
    SELECT AVG(amount)
    FROM orders
    WHERE user_id = o.user_id
);

-- 优化后（使用JOIN）
SELECT o.*
FROM orders o
JOIN (
    SELECT user_id, AVG(amount) as avg_amount
    FROM orders
    GROUP BY user_id
) t ON o.user_id = t.user_id
WHERE o.amount > t.avg_amount;
```

#### JOIN 优化

```sql
-- 小表驱动大表
SELECT *
FROM small_table s
LEFT JOIN big_table b ON s.id = b.small_id;

-- 利用索引优化
CREATE INDEX idx_small_id ON big_table(small_id);
```

## 3. 性能优化最佳实践

### 3.1 数据库设计优化

#### 表设计优化

```sql
-- 字段设计
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT,  -- 使用无符号整数
    name VARCHAR(50),                   -- 合适的字段长度
    status TINYINT,                     -- 用小字段存储状态
    created_at TIMESTAMP,               -- 使用timestamp节省空间
    PRIMARY KEY (id),
    INDEX idx_status_created (status, created_at)  -- 复合索引
);

-- 表分区
CREATE TABLE orders (
    id BIGINT,
    created_at DATETIME,
    amount DECIMAL(10,2)
)
PARTITION BY RANGE (UNIX_TIMESTAMP(created_at)) (
    PARTITION p_2024 VALUES LESS THAN (UNIX_TIMESTAMP('2025-01-01')),
    PARTITION p_2025 VALUES LESS THAN (UNIX_TIMESTAMP('2026-01-01')),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

#### 索引优化策略

```sql
-- 避免过度索引
-- 一个表的索引数量通常不超过5个
CREATE INDEX idx_composite ON users(name, age, city);  -- 替代三个单列索引

-- 区分度查询
SELECT COUNT(DISTINCT column_name) / COUNT(*) as selectivity
FROM table_name;

-- 前缀索引
CREATE INDEX idx_email ON users(email(10));  -- 只索引邮箱前10个字符
```

### 3.2 配置优化

#### 内存参数优化

```ini
# InnoDB缓冲池
innodb_buffer_pool_size = 12G
innodb_buffer_pool_instances = 8

# 查询缓存（MySQL 8.0后移除）
query_cache_type = 0
query_cache_size = 0

# 排序缓冲
sort_buffer_size = 2M
read_rnd_buffer_size = 2M

# 临时表
tmp_table_size = 64M
max_heap_table_size = 64M
```

#### 并发参数优化

```ini
# 连接数
max_connections = 2000
max_user_connections = 1800

# 线程池
thread_cache_size = 100

# 表缓存
table_open_cache = 4000
table_definition_cache = 2000
```

### 3.3 监控与诊断

#### 性能监控

```sql
-- 查看系统状态
SHOW GLOBAL STATUS;

-- 查看线程状态
SHOW PROCESSLIST;

-- 查看InnoDB状态
SHOW ENGINE INNODB STATUS;

-- 查看表状态
SHOW TABLE STATUS;
```

#### 慢查询分析

```sql
-- 开启慢查询日志
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 2;

-- 使用pt-query-digest分析
pt-query-digest /var/log/mysql/mysql-slow.log

-- 诊断示例查询
EXPLAIN ANALYZE
SELECT /*+ MAX_EXECUTION_TIME(1000) */
    u.name,
    COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id
HAVING order_count > 10;
```

## 4. 主从复制进阶

### 4.1 复制模式

#### 异步复制

```sql
-- 主库配置
server-id = 1
log-bin = mysql-bin
binlog_format = ROW

-- 从库配置
server-id = 2
relay_log = relay-bin
read_only = 1
```

#### 半同步复制

```sql
-- 主库配置
INSTALL PLUGIN rpl_semi_sync_master SONAME 'semisync_master.so';
SET GLOBAL rpl_semi_sync_master_enabled = 1;
SET GLOBAL rpl_semi_sync_master_timeout = 10000;

-- 从库配置
INSTALL PLUGIN rpl_semi_sync_slave SONAME 'semisync_slave.so';
SET GLOBAL rpl_semi_sync_slave_enabled = 1;
```

#### 组复制

```sql
-- 组复制配置
SET GLOBAL group_replication_bootstrap_group = ON;
START GROUP_REPLICATION;

-- 监控组状态
SELECT * FROM performance_schema.replication_group_members;
SELECT * FROM performance_schema.replication_group_member_stats;
```

### 4.2 复制优化

#### 并行复制

```sql
-- 从库配置
SET GLOBAL slave_parallel_type = 'LOGICAL_CLOCK';
SET GLOBAL slave_parallel_workers = 8;

-- 监控复制延迟
SHOW SLAVE STATUS;
```

#### 复制过滤

```sql
-- 主库配置
binlog-do-db = mydb
binlog-ignore-db = test

-- 从库配置
replicate-do-db = mydb
replicate-ignore-db = test
```

## 5. 高可用架构

### 5.1 MGR (MySQL Group Replication)

#### 单主模式

```sql
-- 配置文件
loose-group_replication_group_name = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
loose-group_replication_start_on_boot = OFF
loose-group_replication_local_address = "192.168.1.10:33061"
loose-group_replication_group_seeds = "192.168.1.10:33061,192.168.1.11:33061"
loose-group_replication_bootstrap_group = OFF

-- 启动组复制
SET GLOBAL group_replication_bootstrap_group=ON;
START GROUP_REPLICATION;
```

#### 多主模式

```sql
-- 切换到多主模式
SET GLOBAL group_replication_single_primary_mode=OFF;
SET GLOBAL group_replication_enforce_update_everywhere_checks=ON;
```

### 5.2 读写分离

#### ProxySQL 配置

```sql
-- 添加服务器
INSERT INTO mysql_servers(hostgroup_id,hostname,port) VALUES (1,'master',3306);
INSERT INTO mysql_servers(hostgroup_id,hostname,port) VALUES (2,'slave1',3306);
INSERT INTO mysql_servers(hostgroup_id,hostname,port) VALUES (2,'slave2',3306);

-- 配置规则
INSERT INTO mysql_query_rules (rule_id,active,match_pattern,destination_hostgroup,apply) VALUES (1,1,'^SELECT.*FOR UPDATE$',1,1);
INSERT INTO mysql_query_rules (rule_id,active,match_pattern,destination_hostgroup,apply) VALUES (2,1,'^SELECT',2,1);
```

#### MySQL Router 配置

```ini
[routing:primary]
bind_address=0.0.0.0
bind_port=7001
destinations=primary.example.com:3306
mode=read-write

[routing:secondary]
bind_address=0.0.0.0
bind_port=7002
destinations=secondary1.example.com:3306,secondary2.example.com:3306
mode=read-only
```

## 6. 安全加固

### 6.1 加密

#### 数据加密

```sql
-- 创建加密表空间
CREATE TABLESPACE ts1
ADD DATAFILE 'ts1.ibd'
ENCRYPTION = 'Y';

-- 创建加密表
CREATE TABLE sensitive_data (
    id INT,
    data BLOB
) TABLESPACE ts1 ENCRYPTION = 'Y';
```

#### 传输加密

```sql
-- 配置SSL
ALTER INSTANCE RELOAD TLS;

-- 要求SSL连接
ALTER USER 'username'@'hostname' REQUIRE SSL;

-- 验证SSL连接
SHOW STATUS LIKE 'Ssl_cipher';
```

### 6.2 审计

#### 审计日志配置

```sql
-- 安装审计插件
INSTALL PLUGIN audit_log SONAME 'audit_log.so';

-- 配置审计
SET GLOBAL audit_log_policy = 'ALL';
SET GLOBAL audit_log_format = 'JSON';
```

#### 审计规则示例

```sql
-- 审计特定用户
SET GLOBAL audit_log_include_accounts = 'user1@localhost,user2@localhost';

-- 审计特定数据库
SET GLOBAL audit_log_include_databases = 'db1,db2';
```

## 7. 性能测试

### 7.1 基准测试工具

#### sysbench

```bash
# CPU测试
sysbench cpu --cpu-max-prime=20000 run

# 内存测试
sysbench memory --memory-block-size=1K --memory-total-size=100G run

# OLTP测试
sysbench oltp_read_write \
    --table-size=1000000 \
    --mysql-db=test \
    --mysql-user=root \
    --mysql-password=password \
    run
```

#### mysqlslap

```bash
# 并发测试
mysqlslap --concurrency=50,100 --iterations=3 \
    --query="SELECT * FROM users WHERE id=1;" \
    --create-schema=test

# 压力测试
mysqlslap --concurrency=50 --iterations=200 \
    --auto-generate-sql \
    --auto-generate-sql-load-type=mixed \
    --auto-generate-sql-add-autoincrement \
    --engine=innodb
```

### 7.2 性能分析工具

#### Performance Schema

```sql
-- 开启所有监控
UPDATE performance_schema.setup_instruments
SET ENABLED = 'YES', TIMED = 'YES';

-- 查看SQL统计
SELECT * FROM performance_schema.events_statements_summary_by_digest
ORDER BY sum_timer_wait DESC;

-- 查看表访问统计
SELECT * FROM performance_schema.table_io_waits_summary_by_table
ORDER BY sum_timer_wait DESC;
```

#### sys schema

```sql
-- 查看消耗资源的SQL
SELECT * FROM sys.statements_with_runtimes_in_95th_percentile;

-- 查看等待事件
SELECT * FROM sys.waits_global_by_latency;

-- 查看未使用的索引
SELECT * FROM sys.schema_unused_indexes;
```

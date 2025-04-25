---
title: MySQL 基础知识
sidebar_position: 1
---

# MySQL 基础知识

## 1. 数据库基础概念

### 1.1 什么是数据库？

数据库是按照数据结构来组织、存储和管理数据的仓库。最典型的数据库模型有：

- **层次式数据库**：以层次结构组织数据
- **网络式数据库**：允许一个节点有多个父节点
- **关系型数据库**：以关系（表）形式组织数据
- **面向对象数据库**：将数据组织为对象

### 1.2 什么是关系型数据库？

关系型数据库是建立在关系模型基础上的数据库，具有以下特点：

- 数据以表格形式存储
- 表之间可以建立关联关系
- 支持事务处理
- 使用 SQL 语言操作
- 支持多用户并发访问

### 1.3 MySQL 特点

1. **开源免费**

   - 社区版完全免费
   - 企业版提供商业支持

2. **跨平台**

   - Windows
   - Linux
   - macOS
   - Unix

3. **支持多种存储引擎**

   - InnoDB（默认）
   - MyISAM
   - Memory
   - CSV
   - Archive

4. **优秀的性能和扩展性**

   - 支持多 CPU
   - 支持大数据量
   - 支持集群部署

5. **强大的安全机制**
   - 访问权限控制
   - SSL 连接加密
   - 数据加密存储

## 2. 安装与配置

### 2.1 各平台安装方法

#### Windows

```bash
# 下载 MySQL Installer
# 运行安装程序
# 选择 Server Only 或 Custom 安装类型
# 配置 root 密码
```

#### Linux (Ubuntu)

```bash
# 安装 MySQL
sudo apt update
sudo apt install mysql-server

# 安全配置
sudo mysql_secure_installation

# 启动服务
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### macOS

```bash
# 使用 Homebrew 安装
brew install mysql

# 启动服务
brew services start mysql

# 安全配置
mysql_secure_installation
```

### 2.2 基础配置

配置文件位置：

- Windows: C:\\ProgramData\\MySQL\\MySQL Server 8.0\\my.ini
- Linux: /etc/mysql/my.cnf
- macOS: /usr/local/etc/my.cnf

常用配置项：

```ini
[mysqld]
# 字符集
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

# 端口
port=3306

# 最大连接数
max_connections=1000

# 缓冲池大小
innodb_buffer_pool_size=1G

# 日志配置
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2
```

## 3. 基本操作

### 3.1 数据库操作

```sql
-- 创建数据库
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 查看所有数据库
SHOW DATABASES;

-- 使用数据库
USE mydb;

-- 查看当前数据库
SELECT DATABASE();

-- 删除数据库
DROP DATABASE mydb;

-- 修改数据库字符集
ALTER DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3.2 表操作

#### 创建表

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
    CONSTRAINT chk_email CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
```

#### 修改表

```sql
-- 添加列
ALTER TABLE users ADD COLUMN age INT CHECK (age >= 0);

-- 修改列
ALTER TABLE users MODIFY COLUMN username VARCHAR(100);

-- 删除列
ALTER TABLE users DROP COLUMN age;

-- 添加索引
ALTER TABLE users ADD INDEX idx_email (email);

-- 添加外键
ALTER TABLE orders ADD CONSTRAINT fk_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE ON UPDATE CASCADE;
```

#### 表信息查看

```sql
-- 查看表结构
DESC users;
SHOW CREATE TABLE users;

-- 查看表索引
SHOW INDEX FROM users;

-- 查看表状态
SHOW TABLE STATUS LIKE 'users';
```

## 4. 数据类型详解

### 4.1 数值类型

#### 整数类型

| 类型      | 字节 | 最小值   | 最大值  |
| --------- | ---- | -------- | ------- |
| TINYINT   | 1    | -128     | 127     |
| SMALLINT  | 2    | -32768   | 32767   |
| MEDIUMINT | 3    | -8388608 | 8388607 |
| INT       | 4    | -2^31    | 2^31-1  |
| BIGINT    | 8    | -2^63    | 2^63-1  |

使用示例：

```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quantity SMALLINT UNSIGNED DEFAULT 0,
    price DECIMAL(10,2) NOT NULL,
    weight FLOAT(7,2),
    details JSON
);
```

#### 小数类型

- DECIMAL(M,D)：精确小数
- FLOAT：单精度浮点数
- DOUBLE：双精度浮点数

```sql
-- 价格使用 DECIMAL
price DECIMAL(10,2)  -- 总共10位，小数点后2位

-- 科学计算使用 DOUBLE
distance DOUBLE(16,8)
```

### 4.2 字符串类型

#### CHAR 和 VARCHAR

```sql
-- 固定长度字符串
state CHAR(2)  -- 例如：'CA', 'NY'

-- 可变长度字符串
description VARCHAR(1000)  -- 最大1000个字符
```

#### TEXT 类型

```sql
-- 文本类型
content TEXT  -- 最大64KB
content MEDIUMTEXT  -- 最大16MB
content LONGTEXT  -- 最大4GB
```

#### ENUM 和 SET

```sql
-- ENUM（单选）
status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'

-- SET（多选）
permissions SET('read', 'write', 'execute')
```

### 4.3 日期和时间类型

```sql
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    event_date DATE,  -- YYYY-MM-DD
    start_time TIME,  -- HH:MM:SS
    created_at DATETIME,  -- YYYY-MM-DD HH:MM:SS
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    year_only YEAR  -- YYYY
);
```

使用示例：

```sql
-- 插入日期时间
INSERT INTO events (event_date, start_time, created_at)
VALUES
('2025-04-25', '14:30:00', '2025-04-25 14:30:00');

-- 日期时间函数
SELECT
    DATE_FORMAT(event_date, '%W, %M %D, %Y') as formatted_date,
    TIME_FORMAT(start_time, '%h:%i %p') as formatted_time,
    DATEDIFF(event_date, CURDATE()) as days_until_event
FROM events;
```

## 5. SQL 语句详解

### 5.1 DML (数据操作语言)

#### INSERT 语句

```sql
-- 单行插入
INSERT INTO users (username, email)
VALUES ('john_doe', 'john@example.com');

-- 多行插入
INSERT INTO users (username, email) VALUES
    ('user1', 'user1@example.com'),
    ('user2', 'user2@example.com'),
    ('user3', 'user3@example.com');

-- INSERT ... SELECT
INSERT INTO users_backup
SELECT * FROM users WHERE created_at < '2025-01-01';
```

#### UPDATE 语句

```sql
-- 基本更新
UPDATE users
SET status = 'inactive'
WHERE last_login < DATE_SUB(NOW(), INTERVAL 6 MONTH);

-- 多表更新
UPDATE users u
JOIN user_profiles up ON u.id = up.user_id
SET u.email = up.new_email
WHERE up.email_verified = true;

-- 使用子查询更新
UPDATE products
SET price = price * 1.1
WHERE category_id IN (SELECT id FROM categories WHERE name = 'Electronics');
```

#### DELETE 语句

```sql
-- 基本删除
DELETE FROM users
WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- 多表删除
DELETE u, up
FROM users u
JOIN user_profiles up ON u.id = up.user_id
WHERE u.status = 'banned';

-- 使用限制删除
DELETE FROM logs
ORDER BY created_at ASC
LIMIT 1000;
```

### 5.2 DQL (数据查询语言)

#### SELECT 基础

```sql
-- 基本查询
SELECT
    id,
    username,
    email,
    created_at
FROM users
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;

-- 聚合函数
SELECT
    COUNT(*) as total_users,
    COUNT(DISTINCT country) as total_countries,
    AVG(age) as average_age,
    MIN(created_at) as earliest_user,
    MAX(created_at) as latest_user
FROM users
WHERE status = 'active';

-- 分组查询
SELECT
    country,
    COUNT(*) as user_count,
    AVG(age) as avg_age
FROM users
GROUP BY country
HAVING COUNT(*) > 100
ORDER BY user_count DESC;
```

#### JOIN 查询

```sql
-- INNER JOIN
SELECT
    u.username,
    o.order_number,
    o.total_amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed';

-- LEFT JOIN
SELECT
    u.username,
    COUNT(o.id) as total_orders
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.username;

-- 多表JOIN
SELECT
    u.username,
    o.order_number,
    p.name as product_name,
    oi.quantity,
    oi.price as unit_price
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.status = 'completed';
```

#### 子查询

```sql
-- WHERE 子查询
SELECT *
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- FROM 子查询
SELECT category_name, avg_price
FROM (
    SELECT
        c.name as category_name,
        AVG(p.price) as avg_price
    FROM categories c
    JOIN products p ON c.id = p.category_id
    GROUP BY c.id, c.name
) as category_stats
WHERE avg_price > 100;

-- EXISTS 子查询
SELECT *
FROM users u
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.user_id = u.id AND o.total_amount > 1000
);
```

## 6. 索引详解

### 6.1 索引类型

#### 主键索引

```sql
-- 在创建表时定义
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50)
);

-- 或者后续添加
ALTER TABLE users ADD PRIMARY KEY (id);
```

#### 唯一索引

```sql
-- 创建唯一索引
CREATE UNIQUE INDEX idx_username ON users(username);

-- 多列唯一索引
CREATE UNIQUE INDEX idx_email_phone ON users(email, phone);
```

#### 普通索引

```sql
-- 创建普通索引
CREATE INDEX idx_created_at ON users(created_at);

-- 多列索引
CREATE INDEX idx_name_age ON users(name, age);
```

#### 全文索引

```sql
-- 创建全文索引
CREATE FULLTEXT INDEX idx_content ON articles(title, content);

-- 使用全文索引查询
SELECT * FROM articles
WHERE MATCH(title, content) AGAINST('mysql tutorial' IN NATURAL LANGUAGE MODE);
```

### 6.2 索引最佳实践

1. **选择合适的列建立索引**

```sql
-- 经常用于查询条件的列
CREATE INDEX idx_status ON orders(status);

-- 经常用于排序的列
CREATE INDEX idx_created_at ON logs(created_at);

-- 经常用于连接的列
CREATE INDEX idx_user_id ON orders(user_id);
```

2. **避免索引失效的情况**

```sql
-- 错误示例（索引失效）
SELECT * FROM users WHERE YEAR(created_at) = 2025;

-- 正确示例
SELECT * FROM users
WHERE created_at >= '2025-01-01'
AND created_at < '2026-01-01';
```

3. **合理使用复合索引**

```sql
-- 创建复合索引
CREATE INDEX idx_name_age_city ON users(name, age, city);

-- 符合最左前缀原则的查询
SELECT * FROM users WHERE name = 'John' AND age = 25;  -- 使用索引
SELECT * FROM users WHERE name = 'John';  -- 使用索引
SELECT * FROM users WHERE age = 25;  -- 不使用索引
```

## 7. 事务处理

### 7.1 事务基础操作

```sql
-- 开启事务
START TRANSACTION;

-- 执行操作
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

-- 提交事务
COMMIT;

-- 回滚事务
ROLLBACK;
```

### 7.2 事务隔离级别

```sql
-- 查看当前隔离级别
SELECT @@transaction_isolation;

-- 设置隔离级别
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- 可选的隔离级别
-- READ UNCOMMITTED
-- READ COMMITTED
-- REPEATABLE READ （默认）
-- SERIALIZABLE
```

### 7.3 事务特性演示

```sql
-- 原子性演示
START TRANSACTION;
INSERT INTO orders (user_id, amount) VALUES (1, 100);
INSERT INTO order_items (order_id, product_id) VALUES (LAST_INSERT_ID(), 1);
-- 如果任何语句失败，整个事务都会回滚
COMMIT;

-- 隔离性演示（READ COMMITTED）
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
START TRANSACTION;
-- 事务1
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- 此时其他会话看不到未提交的更改
COMMIT;
```

## 8. 用户管理和安全

### 8.1 用户管理

```sql
-- 创建用户
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'password123';

-- 修改密码
ALTER USER 'app_user'@'localhost' IDENTIFIED BY 'new_password123';

-- 删除用户
DROP USER 'app_user'@'localhost';
```

### 8.2 权限管理

```sql
-- 授予特定权限
GRANT SELECT, INSERT, UPDATE ON mydb.* TO 'app_user'@'localhost';

-- 授予所有权限
GRANT ALL PRIVILEGES ON mydb.* TO 'admin'@'localhost';

-- 查看用户权限
SHOW GRANTS FOR 'app_user'@'localhost';

-- 撤销权限
REVOKE INSERT, UPDATE ON mydb.* FROM 'app_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 8.3 安全最佳实践

1. **使用强密码策略**

```sql
-- 设置密码过期策略
ALTER USER 'app_user'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;

-- 设置密码历史
ALTER USER 'app_user'@'localhost' PASSWORD HISTORY 5;

-- 设置密码重用间隔
ALTER USER 'app_user'@'localhost' PASSWORD REUSE INTERVAL 365 DAY;
```

2. **限制连接来源**

```sql
-- 只允许特定IP访问
CREATE USER 'app_user'@'192.168.1.%' IDENTIFIED BY 'password123';

-- 使用SSL连接
ALTER USER 'app_user'@'localhost' REQUIRE SSL;
```

## 9. 备份与恢复

### 9.1 使用 mysqldump 备份

```bash
# 备份单个数据库
mysqldump -u root -p mydb > mydb_backup.sql

# 备份特定表
mysqldump -u root -p mydb users orders > tables_backup.sql

# 备份所有数据库
mysqldump -u root -p --all-databases > full_backup.sql
```

### 9.2 还原备份

```bash
# 还原数据库
mysql -u root -p mydb < mydb_backup.sql

# 还原特定表
mysql -u root -p mydb < tables_backup.sql

# 还原所有数据库
mysql -u root -p < full_backup.sql
```

### 9.3 使用二进制日志恢复

```sql
-- 查看二进制日志
SHOW BINARY LOGS;

-- 查看二进制日志事件
SHOW BINLOG EVENTS IN 'mysql-bin.000001';

-- 使用特定时间点恢复
mysqlbinlog --start-datetime="2025-04-25 10:00:00" \
            --stop-datetime="2025-04-25 11:00:00" \
            mysql-bin.000001 | mysql -u root -p
```

---
title: Nginx 面试题
sidebar_position: 4
---

# Nginx 面试题

## 基础概念

### 1. 什么是 Nginx？有哪些主要特性？

Nginx 是一个高性能的 HTTP 和反向代理服务器，主要特性包括：

- 高并发处理能力
- 低内存消耗
- 高可靠性
- 模块化设计
- 热部署支持
- 事件驱动模型

### 2. 正向代理和反向代理的区别？

**正向代理：**

- 代理客户端
- 客户端知道目标服务器
- 服务器不知道实际客户端
- 典型例子：VPN

**反向代理：**

- 代理服务器端
- 客户端不知道实际服务器
- 服务器端接收反向代理服务器的请求
- 典型例子：负载均衡

### 3. Nginx 的进程模型是怎样的？

Nginx 采用多进程模型：

- 一个 Master 进程
- 多个 Worker 进程
- Cache Loader 进程
- Cache Manager 进程

Master 进程主要负责：

- 读取配置文件
- 创建/管理 Worker 进程
- 平滑升级

Worker 进程主要负责：

- 处理实际的请求
- 事件循环处理

## 配置相关

### 4. location 指令的匹配规则优先级是怎样的？

从高到低依次是：

1. `=` 精确匹配
2. `^~` 前缀匹配
3. `~` 正则匹配（区分大小写）
4. `~*` 正则匹配（不区分大小写）
5. 普通前缀匹配

```nginx
location = /exact {...}     # 精确匹配
location ^~ /images/ {...}  # 前缀匹配
location ~ \.php$ {...}     # 正则匹配
location ~* \.jpg$ {...}    # 不区分大小写的正则匹配
location /prefix {...}      # 普通前缀匹配
```

### 5. 如何配置 Nginx 实现负载均衡？有哪些算法？

负载均衡配置示例：

```nginx
upstream backend {
    # 轮询（默认）
    server backend1.example.com;
    server backend2.example.com;

    # 权重
    server backend3.example.com weight=3;
    server backend4.example.com weight=1;

    # IP哈希
    ip_hash;
    server backend5.example.com;
    server backend6.example.com;

    # 最少连接
    least_conn;
    server backend7.example.com;
    server backend8.example.com;
}
```

主要算法：

1. 轮询（默认）
2. 加权轮询
3. IP 哈希
4. 最少连接
5. 加权最少连接
6. URL 哈希
7. 响应时间

## 性能优化

### 6. 如何优化 Nginx 的性能？

1. **系统层面：**

- 增加工作进程数
- 增加工作连接数
- 使用 epoll 事件模型
- 开启零拷贝技术

2. **配置层面：**

```nginx
# 开启gzip压缩
gzip on;
gzip_min_length 1k;
gzip_comp_level 6;

# 开启缓存
proxy_cache_path /path/to/cache levels=1:2 keys_zone=my_cache:10m;

# 启用零拷贝
sendfile on;
tcp_nopush on;
```

3. **硬件层面：**

- SSD 硬盘
- 足够的内存
- 多核 CPU

### 7. Nginx 常见的优化配置参数有哪些？

```nginx
# 工作进程数
worker_processes auto;

# 工作连接数
worker_connections 10240;

# 超时设置
keepalive_timeout 65;
client_header_timeout 15;
client_body_timeout 15;
send_timeout 15;

# 缓冲区设置
client_header_buffer_size 32k;
large_client_header_buffers 4 32k;
client_max_body_size 8m;

# 文件缓存
open_file_cache max=1000 inactive=20s;
open_file_cache_valid 30s;
open_file_cache_min_uses 2;
open_file_cache_errors on;
```

## 安全相关

### 8. Nginx 如何配置 SSL 证书？

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # SSL优化配置
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;
}
```

### 9. 如何防止常见的 Web 攻击？

1. **防止 SQL 注入：**

```nginx
# 过滤特殊字符
if ($request_uri ~* "[;'<>]") {
    return 444;
}
```

2. **防止 XSS 攻击：**

```nginx
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "default-src 'self'";
```

3. **防止 CSRF 攻击：**

```nginx
add_header X-Frame-Options "SAMEORIGIN";
```

4. **限制请求频率：**

```nginx
limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;
limit_req zone=one burst=5 nodelay;
```

## 故障处理

### 10. 如何排查 Nginx 的性能问题？

1. **查看错误日志：**

```nginx
error_log /var/log/nginx/error.log debug;
```

2. **配置访问日志：**

```nginx
log_format detailed '$remote_addr - [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_user_agent" $request_time';
```

3. **使用监控工具：**

```nginx
location = /nginx_status {
    stub_status on;
    access_log off;
}
```

4. **系统监控：**

- 使用 top 命令查看 CPU 使用情况
- 使用 free 命令查看内存使用情况
- 使用 netstat 查看网络连接状态

### 11. 如何实现 Nginx 的平滑升级？

1. **备份配置文件**

```bash
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup
```

2. **发送 USR2 信号进行升级**

```bash
kill -USR2 `cat /var/run/nginx.pid`
```

3. **发送 WINCH 信号关闭旧进程**

```bash
kill -WINCH `cat /var/run/nginx.pid.oldbin`
```

4. **验证新进程**

```bash
ps aux | grep nginx
```

## 扩展知识

### 12. Nginx 和其他 Web 服务器的区别？

对比 Apache：

1. 架构不同

   - Nginx：事件驱动，异步非阻塞
   - Apache：预 fork 模型，同步阻塞

2. 性能差异

   - Nginx：处理静态资源快，内存消耗低
   - Apache：功能更全面，配置灵活

3. 使用场景
   - Nginx：高并发场景，反向代理
   - Apache：传统应用，支持更多处理器

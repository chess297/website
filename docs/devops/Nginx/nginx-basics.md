---
title: Nginx 基础
sidebar_position: 1
---

# Nginx 基础知识

## 1. Nginx 简介

Nginx 是一个高性能的 HTTP 和反向代理服务器，也是一个 IMAP/POP3/SMTP 代理服务器。

### 1.1 主要特点

- 高并发、高性能
- 低内存消耗
- 高度模块化设计
- 热部署支持
- 跨平台支持

### 1.2 应用场景

- HTTP 服务器
- 反向代理服务器
- 负载均衡器
- 静态资源服务器
- 安全防护

## 2. 安装与配置

### 2.1 安装方法

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx

# macOS
brew install nginx
```

### 2.2 基础配置文件结构

```nginx
# /etc/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    access_log /var/log/nginx/access.log;

    server {
        listen 80;
        server_name example.com;

        location / {
            root /usr/share/nginx/html;
            index index.html;
        }
    }
}
```

## 3. 基本指令

### 3.1 server 指令

```nginx
server {
    listen 80;                # 监听端口
    server_name example.com;  # 域名
    root /var/www/html;      # 网站根目录
    index index.html;        # 默认页面
}
```

### 3.2 location 指令

```nginx
location / {
    root /var/www/html;
    index index.html;
}

location /api {
    proxy_pass http://localhost:3000;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    include fastcgi_params;
}
```

### 3.3 反向代理配置

```nginx
upstream backend {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
}

server {
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 4. 常用功能

### 4.1 静态文件服务

```nginx
location /static/ {
    root /var/www;
    expires 30d;
    add_header Cache-Control "public, no-transform";
}
```

### 4.2 GZIP 压缩

```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
gzip_min_length 1000;
gzip_comp_level 6;
```

### 4.3 SSL 配置

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

## 5. 日志配置

### 5.1 访问日志

```nginx
access_log /var/log/nginx/access.log main;

log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                '$status $body_bytes_sent "$http_referer" '
                '"$http_user_agent"';
```

### 5.2 错误日志

```nginx
error_log /var/log/nginx/error.log warn;
```

## 6. 常用命令

```bash
# 启动 Nginx
nginx

# 停止 Nginx
nginx -s stop

# 重新加载配置
nginx -s reload

# 测试配置文件
nginx -t

# 查看版本
nginx -v
```

## 7. 配置优化建议

1. 开启 worker 进程
2. 配置 worker_connections
3. 开启 gzip 压缩
4. 配置缓存
5. 配置日志切割
6. 配置超时时间
7. 配置文件包含

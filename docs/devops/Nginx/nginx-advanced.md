---
title: Nginx 进阶
sidebar_position: 2
---

# Nginx 进阶知识

## 1. 负载均衡详解

### 1.1 负载均衡算法

```nginx
upstream backend {
    # 轮询（默认）
    server backend1.example.com;
    server backend2.example.com;

    # 权重
    server backend3.example.com weight=3;
    server backend4.example.com weight=1;

    # IP 哈希
    ip_hash;
    server backend5.example.com;
    server backend6.example.com;

    # 最少连接
    least_conn;
    server backend7.example.com;
    server backend8.example.com;
}
```

### 1.2 健康检查

```nginx
upstream backend {
    server backend1.example.com max_fails=3 fail_timeout=30s;
    server backend2.example.com max_fails=3 fail_timeout=30s;

    check interval=3000 rise=2 fall=5 timeout=1000 type=http;
    check_http_send "HEAD / HTTP/1.0\r\n\r\n";
    check_http_expect_alive http_2xx http_3xx;
}
```

## 2. 缓存机制

### 2.1 代理缓存配置

```nginx
http {
    proxy_cache_path /path/to/cache levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;

    server {
        location / {
            proxy_cache my_cache;
            proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
            proxy_cache_valid 200 301 302 1h;
            proxy_cache_valid 404 1m;
            proxy_cache_key $scheme$request_method$host$request_uri;
        }
    }
}
```

### 2.2 FastCGI 缓存

```nginx
http {
    fastcgi_cache_path /path/to/cache levels=1:2 keys_zone=fastcgi_cache:10m max_size=10g inactive=60m use_temp_path=off;

    server {
        location ~ \.php$ {
            fastcgi_cache fastcgi_cache;
            fastcgi_cache_valid 200 60m;
            fastcgi_cache_key $request_method$request_uri;
            fastcgi_cache_use_stale error timeout invalid_header http_500;
        }
    }
}
```

## 3. 安全配置

### 3.1 SSL/TLS 高级配置

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;

    # 优化 SSL 设置
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # 现代兼容性配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # HSTS 配置
    add_header Strict-Transport-Security "max-age=63072000" always;
}
```

### 3.2 访问控制

```nginx
# IP 白名单/黑名单
location /admin {
    allow 192.168.1.0/24;
    allow 10.0.0.0/8;
    deny all;

    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;
}

# 防盗链
location ~* \.(gif|jpg|jpeg|png|bmp|swf)$ {
    valid_referers none blocked example.com *.example.com;
    if ($invalid_referer) {
        return 403;
    }
}
```

## 4. 性能优化

### 4.1 连接优化

```nginx
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    use epoll;
    worker_connections 65535;
    multi_accept on;
}

http {
    keepalive_timeout 65;
    keepalive_requests 100;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
}
```

### 4.2 缓冲区优化

```nginx
client_body_buffer_size 128k;
client_max_body_size 10m;
client_header_buffer_size 1k;
large_client_header_buffers 4 4k;
output_buffers 1 32k;
postpone_output 1460;
```

### 4.3 系统调优

```nginx
# 文件描述符限制
worker_rlimit_nofile 65535;

# 进程限制
worker_processes auto;
worker_cpu_affinity auto;

# 超时设置
client_header_timeout 60;
client_body_timeout 60;
send_timeout 60;
proxy_connect_timeout 60;
proxy_send_timeout 60;
proxy_read_timeout 60;
```

## 5. 监控和调试

### 5.1 状态监控

```nginx
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
}
```

### 5.2 debug 配置

```nginx
error_log /var/log/nginx/error.log debug;

# 特定模块的调试日志
events {
    debug_connection 192.168.1.1;
}

http {
    log_format debug_format '$remote_addr - $remote_user [$time_local] '
                           '"$request" $status $body_bytes_sent '
                           '"$http_referer" "$http_user_agent" "$gzip_ratio"';

    access_log /var/log/nginx/access.log debug_format;
}
```

## 6. 动态模块

### 6.1 HTTP 动态模块加载

```nginx
load_module modules/ngx_http_geoip_module.so;
load_module modules/ngx_http_image_filter_module.so;

http {
    geoip_country /etc/nginx/geoip/GeoIP.dat;
    geoip_city /etc/nginx/geoip/GeoLiteCity.dat;
}
```

### 6.2 Stream 模块配置

```nginx
stream {
    upstream backend {
        server backend1.example.com:12345;
        server backend2.example.com:12345;
    }

    server {
        listen 12345;
        proxy_pass backend;
    }
}
```

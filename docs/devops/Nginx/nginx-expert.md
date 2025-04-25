---
title: Nginx 高级
sidebar_position: 3
---

## 1. Nginx 内部架构

### 1.1 进程模型

Nginx 采用多进程模型：

- Master 进程：负责管理 Worker 进程
- Worker 进程：处理实际的请求
- Cache Manager 进程：管理缓存
- Cache Loader 进程：加载缓存

```bash
# 进程结构示意
master process
 ├── cache loader process
 ├── cache manager process
 ├── worker process 1
 ├── worker process 2
 └── worker process n
```

### 1.2 事件驱动模型

```nginx
events {
    # 选择最优的事件模型
    use epoll;  # Linux
    use kqueue; # BSD
    use select; # 低版本系统

    # 并发连接数配置
    worker_connections 10240;
    multi_accept on;
    accept_mutex on;
}
```

## 2. 高级特性配置

### 2.1 流量控制

```nginx
# 限制连接数
limit_conn_zone $binary_remote_addr zone=addr:10m;
limit_conn addr 100;

# 限制请求率
limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;
limit_req zone=one burst=5 nodelay;

# IP 访问频率限制
geo $limit {
    default 1;
    10.0.0.0/8 0;
    192.168.0.0/24 0;
}

map $limit $limit_key {
    0 "";
    1 $binary_remote_addr;
}
```

### 2.2 动态模块开发

```c
// 自定义模块示例
ngx_module_t ngx_http_custom_module = {
    NGX_MODULE_V1,
    &ngx_http_custom_module_ctx,
    ngx_http_custom_commands,
    NGX_HTTP_MODULE,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NGX_MODULE_V1_PADDING
};
```

### 2.3 Lua 脚本集成

```nginx
http {
    lua_package_path "/path/to/lua/?.lua;;";

    init_by_lua_block {
        -- 初始化 Lua 环境
    }

    server {
        location /api {
            content_by_lua_block {
                -- 处理请求的 Lua 代码
                ngx.say("Hello from Lua!")
            }
        }
    }
}
```

## 3. 高级应用场景

### 3.1 WebSocket 代理

```nginx
map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
}

server {
    location /websocket {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;
        proxy_set_header Host $host;
    }
}
```

### 3.2 gRPC 代理

```nginx
server {
    listen 50051 http2;

    location / {
        grpc_pass grpc://backend;
        grpc_set_header Host $host;
        grpc_set_header X-Real-IP $remote_addr;
    }
}
```

### 3.3 流媒体服务

```nginx
rtmp {
    server {
        listen 1935;
        chunk_size 4096;

        application live {
            live on;
            record off;

            hls on;
            hls_path /tmp/hls;
            hls_fragment 3;
            hls_playlist_length 60;
        }
    }
}
```

## 4. 高级优化技巧

### 4.1 内核参数优化

```bash
# /etc/sysctl.conf
net.core.somaxconn = 32768
net.ipv4.tcp_max_tw_buckets = 6000
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_tw_recycle = 1
net.ipv4.tcp_fin_timeout = 30
```

### 4.2 文件系统优化

```nginx
location /static/ {
    aio on;
    directio 512;
    output_buffers 2 128k;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
}
```

### 4.3 SSL 优化

```nginx
ssl_session_cache shared:SSL:50m;
ssl_session_timeout 1d;
ssl_session_tickets off;

ssl_dhparam /etc/nginx/dhparam.pem;
ssl_ecdh_curve secp384r1;

ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
```

## 5. 性能监控与调优

### 5.1 性能监控

```nginx
location = /basic_status {
    stub_status;
}

location = /detailed_status {
    vhost_traffic_status_display;
    vhost_traffic_status_display_format html;
}
```

### 5.2 日志分析

```nginx
log_format detailed '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    '$request_time $upstream_response_time '
                    '$pipe $connection $connection_requests';

map $status $loggable {
    ~^[23] 0;
    default 1;
}
```

### 5.3 性能测试

```bash
# 使用 ab 进行压力测试
ab -n 100000 -c 1000 http://localhost/

# 使用 wrk 进行压力测试
wrk -t12 -c400 -d30s http://localhost/
```

## 6. 故障排除

### 6.1 调试技巧

```nginx
error_log /var/log/nginx/error.log debug;

location / {
    error_log /var/log/nginx/debug.log debug;
    access_log /var/log/nginx/access.log detailed;

    add_header X-Debug-Message $request_time;
    add_header X-Debug-Path $request_filename;
}
```

### 6.2 常见问题解决

1. 连接数耗尽

```nginx
worker_rlimit_nofile 65535;
events {
    worker_connections 65535;
}
```

2. 上传文件大小限制

```nginx
client_max_body_size 100m;
client_body_buffer_size 128k;
```

3. 代理超时

```nginx
proxy_connect_timeout 60s;
proxy_send_timeout 60s;
proxy_read_timeout 60s;
```

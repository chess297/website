---
title: Next.js 高级知识
sidebar_position: 3
---

# Next.js 高级知识

本文将介绍 Next.js 的高级特性和架构设计,适合有一定 Next.js 开发经验的开发者阅读。

## 1. 自定义服务器

### 1.1 基本服务器配置

```typescript
// server.ts
import { createServer } from "http";
import { parse } from "url";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  }).listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
```

### 1.2 与 Express 集成

```typescript
// server.ts
import express from "express";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 自定义路由
  server.get("/custom-route", (req, res) => {
    return app.render(req, res, "/index", req.query);
  });

  // API 中间件
  server.use("/api", (req, res, next) => {
    // API 请求处理逻辑
    next();
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
});
```

## 2. 高级构建配置

### 2.1 自定义 Webpack 配置

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 自定义 webpack 配置
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
          options: {
            // MDX 选项
          },
        },
      ],
    });

    // 添加插件
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.BUILD_ID": JSON.stringify(buildId),
      })
    );

    return config;
  },
};

module.exports = nextConfig;
```

### 2.2 构建优化

```typescript
// next.config.js
const nextConfig = {
  // 优化构建输出
  output: "standalone",

  // 优化构建性能
  swcMinify: true,

  // 实验性功能
  experimental: {
    // 启用 SWC 编译器的新特性
    swcPlugins: [["@swc/plugin-styled-components", {}]],

    // 优化服务器组件
    serverComponents: true,

    // 启用增量构建
    incrementalBuild: true,
  },

  // 优化静态资源
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
  },
};
```

## 3. 性能监控与优化

### 3.1 性能监控实现

```typescript
// lib/performance.ts
export function reportWebVitals(metric: any) {
  const { id, name, label, value } = metric;

  // 发送到分析服务
  analytics.send({
    metric_name: name,
    metric_value: value,
    metric_id: id,
    metric_label: label,
  });
}

// pages/_app.tsx
export function reportWebVitals(metric: any) {
  switch (metric.name) {
    case "FCP":
      // 首次内容绘制
      console.log("FCP:", Math.round(metric.value * 10) / 10);
      break;
    case "LCP":
      // 最大内容绘制
      console.log("LCP:", Math.round(metric.value * 10) / 10);
      break;
    case "TTFB":
      // 首字节时间
      console.log("TTFB:", Math.round(metric.value * 10) / 10);
      break;
    case "Next.js-hydration":
      // 水合时间
      console.log(
        "Hydration:",
        Math.round(metric.startTime * 10) / 10,
        "->",
        Math.round((metric.startTime + metric.value) * 10) / 10
      );
      break;
  }
}
```

### 3.2 自定义性能指标

```typescript
// hooks/usePerformance.ts
import { useEffect, useState } from "react";

export function usePerformance() {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    cls: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 首次内容绘制
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          setMetrics((prev) => ({
            ...prev,
            fcp: entries[0].startTime,
          }));
        }
      }).observe({ entryTypes: ["paint"] });

      // 最大内容绘制
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        if (entries.length > 0) {
          setMetrics((prev) => ({
            ...prev,
            lcp: entries[entries.length - 1].startTime,
          }));
        }
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // 累积布局偏移
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        let totalShiftScore = 0;
        entries.forEach((entry) => {
          totalShiftScore += entry.value;
        });
        setMetrics((prev) => ({
          ...prev,
          cls: totalShiftScore,
        }));
      }).observe({ entryTypes: ["layout-shift"] });
    }
  }, []);

  return metrics;
}
```

## 4. 高级状态管理

### 4.1 服务器状态管理

```typescript
// lib/ServerStateContext.tsx
import { createContext, useContext, useReducer } from "react";

type State = {
  data: any;
  error: Error | null;
  isLoading: boolean;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: any }
  | { type: "FETCH_ERROR"; error: Error };

const ServerStateContext = createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

function serverStateReducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true };
    case "FETCH_SUCCESS":
      return { data: action.payload, isLoading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.error };
    default:
      return state;
  }
}

export function ServerStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(serverStateReducer, {
    data: null,
    error: null,
    isLoading: false,
  });

  return (
    <ServerStateContext.Provider value={{ state, dispatch }}>
      {children}
    </ServerStateContext.Provider>
  );
}
```

### 4.2 客户端状态同步

```typescript
// lib/useSync.ts
import { useEffect } from "react";
import { useStore } from "./store";

export function useSync(serverData: any) {
  const syncWithServer = useStore((state) => state.syncWithServer);

  useEffect(() => {
    if (serverData) {
      syncWithServer(serverData);
    }
  }, [serverData, syncWithServer]);
}

// 在组件中使用
export default function Page({ initialData }) {
  useSync(initialData);
  // ...
}
```

## 5. 微前端架构

### 5.1 Module Federation 配置

```typescript
// next.config.js
const { withModuleFederation } = require("@module-federation/nextjs-mf");

module.exports = withModuleFederation({
  name: "host",
  filename: "static/chunks/remoteEntry.js",
  exposes: {
    "./Header": "./components/Header",
    "./Footer": "./components/Footer",
  },
  remotes: {
    shop: "shop@http://localhost:3001/_next/static/chunks/remoteEntry.js",
    blog: "blog@http://localhost:3002/_next/static/chunks/remoteEntry.js",
  },
  shared: {
    react: {
      singleton: true,
      requiredVersion: false,
    },
    "react-dom": {
      singleton: true,
      requiredVersion: false,
    },
  },
});
```

### 5.2 远程组件加载

```typescript
// components/RemoteComponent.tsx
import dynamic from "next/dynamic";
import { Suspense } from "react";

const RemoteComponent = dynamic(() => import("shop/ProductList"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default function ProductSection() {
  return (
    <Suspense fallback="Loading...">
      <RemoteComponent />
    </Suspense>
  );
}
```

## 6. 安全加固

### 6.1 安全中间件

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./lib/rate-limit";

export async function middleware(request: NextRequest) {
  // 速率限制
  const limiter = await rateLimit(request);
  if (!limiter.success) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": limiter.reset,
      },
    });
  }

  // CORS 配置
  if (request.nextUrl.pathname.startsWith("/api")) {
    const response = NextResponse.next();
    response.headers.set(
      "Access-Control-Allow-Origin",
      "https://allowed-origin.com"
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return response;
  }

  // 内容安全策略
  const response = NextResponse.next();
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  );

  // 其他安全头
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}
```

### 6.2 高级认证

```typescript
// lib/auth.ts
import { getSession } from "next-auth/react";
import { verify } from "jsonwebtoken";
import { prisma } from "./prisma";

export async function validateToken(token: string) {
  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub as string },
      select: {
        id: true,
        role: true,
        permissions: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}

export async function requireAuth(context: any) {
  const session = await getSession(context);
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function withPermission(permission: string) {
  return async function (context: any) {
    const session = await requireAuth(context);
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { permissions: true },
    });

    if (!user?.permissions.includes(permission)) {
      throw new Error("Forbidden");
    }

    return user;
  };
}
```

## 7. 高级部署策略

### 7.1 多区域部署

```typescript
// next.config.js
module.exports = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: process.env.NEXT_PUBLIC_API_URL + "/:path*",
        },
      ],
      afterFiles: [
        {
          source: "/:path*",
          destination: "/_edge/:path*",
          has: [
            {
              type: "header",
              key: "x-geo-location",
              value: "US",
            },
          ],
        },
      ],
    };
  },
};

// pages/_edge/[...path].tsx
export const config = {
  runtime: "edge",
};

export default function EdgePage({ params }) {
  // 边缘计算逻辑
}
```

### 7.2 容器化部署

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 依赖阶段
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# 生产阶段
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# 添加非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### 7.3 自动扩缩容配置

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nextjs-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nextjs
  template:
    metadata:
      labels:
        app: nextjs
    spec:
      containers:
        - name: nextjs
          image: nextjs-app:latest
          ports:
            - containerPort: 3000
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nextjs-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nextjs-app
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 80
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## 8. 监控和可观测性

### 8.1 应用监控

```typescript
// lib/monitoring.ts
import { metrics, trace } from "@opentelemetry/api";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";

// 创建指标记录器
const meter = metrics.getMeter("next-app");
const requestCounter = meter.createCounter("http_requests_total", {
  description: "Count of HTTP requests",
});

// 创建追踪器
const tracer = trace.getTracer("next-app");

export function trackRequest(method: string, path: string, statusCode: number) {
  requestCounter.add(1, {
    method,
    path,
    status: statusCode.toString(),
  });
}

export async function withTrace<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  return tracer.startActiveSpan(name, async (span) => {
    try {
      const result = await fn();
      span.end();
      return result;
    } catch (error) {
      span.recordException(error as Error);
      span.setStatus({ code: 2 }); // ERROR
      span.end();
      throw error;
    }
  });
}
```

### 8.2 错误追踪

```typescript
// lib/error-tracking.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: process.env.NODE_ENV === "development",
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express(),
    new Sentry.Integrations.Prisma(),
  ],
});

export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.withScope((scope) => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        scope.setExtra(key, value);
      });
    }
    Sentry.captureException(error);
  });
}

// 在组件中使用
export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}
```

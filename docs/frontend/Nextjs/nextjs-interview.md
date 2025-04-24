---
title: Next.js 面试题
sidebar_position: 4
---

# Next.js 面试题精选

本文整理了 Next.js 相关的高频面试题，帮助你更好地准备技术面试。

## 1. Next.js 基础概念

### Q1: Next.js 和 React 的关系是什么？

**答**: Next.js 是一个基于 React 的全栈开发框架。它在 React 的基础上添加了很多企业级特性：

- 内置的服务端渲染(SSR)和静态站点生成(SSG)
- 基于文件系统的路由
- 自动代码分割
- 内置图像优化
- API 路由支持
- 开发环境支持热更新
- TypeScript 支持
- 等等

### Q2: Next.js 中的渲染方式有哪些？

**答**: Next.js 支持多种渲染方式：

1. **服务端渲染(SSR)**：每次请求时在服务器生成页面
2. **静态站点生成(SSG)**：构建时预渲染页面
3. **增量静态再生成(ISR)**：在后台定期重新生成页面
4. **客户端渲染(CSR)**：在浏览器中渲染页面
5. **服务器组件**：在服务器上渲染 React 组件

### Q3: 什么是 Next.js 的文件系统路由？

**答**: Next.js 使用基于文件系统的路由机制：

- `app/page.tsx` 对应路由 `/`
- `app/about/page.tsx` 对应路由 `/about`
- `app/blog/[slug]/page.tsx` 对应动态路由 `/blog/:slug`
  这种方式使路由结构更直观，无需额外配置。

## 2. 性能优化

### Q4: Next.js 如何优化图片加载？

**答**: Next.js 通过内置的 Image 组件提供多种优化：

```typescript
import Image from "next/image";

function MyImage() {
  return (
    <Image
      src="/my-image.jpg"
      alt="优化的图片"
      width={500}
      height={300}
      placeholder="blur"
      loading="lazy"
      quality={75}
    />
  );
}
```

优化包括：

- 自动图片尺寸优化
- 延迟加载
- 模糊占位符
- WebP/AVIF 格式支持
- 自动响应式图片

### Q5: Next.js 中如何实现代码分割？

**答**: Next.js 提供多种代码分割方式：

1. **自动路由级分割**：每个页面自动成为单独的包
2. **动态导入**：

```typescript
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(() => import("../components/heavy"));
```

3. **模块级分割**：

```typescript
import { lazy } from "react";

const LazyComponent = lazy(() => import("../components/lazy"));
```

### Q6: 如何优化 Next.js 应用的首次加载性能？

**答**:

1. 使用服务器组件减少客户端 JavaScript
2. 实现页面预加载

```typescript
import { useRouter } from "next/router";

function MyLink() {
  const router = useRouter();
  return (
    <div onMouseEnter={() => router.prefetch("/about")}>
      <Link href="/about">关于我们</Link>
    </div>
  );
}
```

3. 优化字体加载

```typescript
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
```

4. 使用静态生成减少服务器负载

```typescript
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
```

## 3. 数据获取

### Q7: Next.js 中获取数据的方式有哪些？

**答**: Next.js 提供多种数据获取方式：

1. **服务器组件中获取**：

```typescript
async function getData() {
  const res = await fetch("https://api.example.com/data");
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}
```

2. **使用 getStaticProps**：

```typescript
export async function getStaticProps() {
  const data = await fetchData();
  return {
    props: { data },
    revalidate: 60, // ISR
  };
}
```

3. **使用 getServerSideProps**：

```typescript
export async function getServerSideProps(context) {
  const { params, req, res } = context;
  const data = await fetchData(params.id);
  return {
    props: { data },
  };
}
```

### Q8: Next.js 13 App Router 中的数据缓存机制是怎样的？

**答**: Next.js 13 提供了多层数据缓存：

1. **请求缓存**：

```typescript
// 默认缓存
const data = await fetch("https://api.example.com/data");

// 不缓存
const data = await fetch("https://api.example.com/data", {
  cache: "no-store",
});

// 设置重新验证时间
const data = await fetch("https://api.example.com/data", {
  next: { revalidate: 3600 },
});
```

2. **数据缓存**：

```typescript
import { cache } from "react";

const getData = cache(async () => {
  const res = await fetch("...");
  return res.json();
});
```

## 4. 路由和导航

### Q9: Next.js 的动态路由是如何工作的？

**答**: Next.js 支持多种动态路由模式：

1. **基本动态路由**：

```typescript
// app/blog/[slug]/page.tsx
export default function Page({ params }: { params: { slug: string } }) {
  return <div>Post: {params.slug}</div>;
}
```

2. **捕获所有路由**：

```typescript
// app/[...slug]/page.tsx
export default function Page({ params }: { params: { slug: string[] } }) {
  return <div>Path: {params.slug.join("/")}</div>;
}
```

3. **可选动态路由**：

```typescript
// app/[[...slug]]/page.tsx
export default function Page({ params }: { params?: { slug: string[] } }) {
  return <div>Optional path: {params?.slug?.join("/")}</div>;
}
```

### Q10: 如何在 Next.js 中实现路由保护？

**答**: 可以通过中间件实现路由保护：

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};
```

## 5. 状态管理

### Q11: Next.js 中如何管理全局状态？

**答**: Next.js 中有多种状态管理方案：

1. **Context API**：

```typescript
import { createContext, useContext, useState } from "react";

const AppContext = createContext<any>(null);

export function AppProvider({ children }) {
  const [state, setState] = useState({});
  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
}
```

2. **Zustand**：

```typescript
import create from "zustand";

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

3. **Redux Toolkit**：

```typescript
import { createSlice, configureStore } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "app",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
  },
});
```

## 6. 部署和优化

### Q12: Next.js 应用如何部署到生产环境？

**答**: Next.js 支持多种部署方式：

1. **Vercel 部署**：

```bash
vercel
```

2. **Docker 部署**：

```dockerfile
FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Q13: Next.js 13 的 App Router 和 Pages Router 有什么区别？

**答**: 主要区别包括：

1. **文件约定**：

- App Router: `app/about/page.tsx`
- Pages Router: `pages/about.tsx`

2. **数据获取**：

- App Router: 使用服务器组件和 fetch API
- Pages Router: 使用 getStaticProps/getServerSideProps

3. **布局**：

- App Router: 使用 layout.tsx
- Pages Router: 使用 \_app.tsx 和 \_document.tsx

4. **渲染模型**：

- App Router: 默认服务器组件
- Pages Router: 默认客户端组件

### Q14: Next.js 中如何处理 SEO？

**答**:

1. **使用 Metadata API**：

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的网站",
  description: "网站描述",
  openGraph: {
    title: "分享标题",
    description: "分享描述",
    images: ["/og-image.jpg"],
  },
};
```

2. **动态元数据**：

```typescript
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return {
    title: product.title,
    description: product.description,
  };
}
```

3. **使用 robots.txt 和 sitemap.xml**：

```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: "/private/",
      },
    ],
    sitemap: "https://example.com/sitemap.xml",
  };
}
```

### Q15: 如何优化 Next.js 的构建时间？

**答**:

1. **使用构建缓存**：

```typescript
// next.config.js
module.exports = {
  experimental: {
    turbotrace: {
      memoryLimit: 4000,
    },
  },
};
```

2. **优化依赖**：

```json
{
  "dependencies": {
    "lodash-es": "^4.17.21" // 使用 ES 模块版本
  }
}
```

3. **配置 Webpack**：

```typescript
// next.config.js
module.exports = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        "react/jsx-runtime.js": "preact/compat/jsx-runtime",
        react: "preact/compat",
        "react-dom": "preact/compat",
      });
    }
    return config;
  },
};
```

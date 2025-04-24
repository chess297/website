---
title: Next.js 基础知识
sidebar_position: 1
---

# Next.js 基础知识

Next.js 是一个用于生产环境的 React 框架,它让构建全栈 Web 应用变得简单而强大。本文将介绍 Next.js 的基础概念和核心特性。

## 1. Next.js 简介

### 1.1 什么是 Next.js

Next.js 是一个基于 React 的全栈开发框架,由 Vercel 开发和维护。它提供了:

- 直观的基于页面的路由系统
- 预渲染,支持静态生成(SSG)和服务器端渲染(SSR)
- 自动代码拆分以提高加载速度
- 客户端路由与无缝页面过渡
- 内置 CSS 和 Sass 支持,并支持任何 CSS-in-JS 库
- 开发环境支持快速刷新
- API 路由构建 API 功能
- 完全可扩展

### 1.2 为什么选择 Next.js

- **零配置**: 内置 TypeScript、打包、路由等支持
- **混合渲染**: 灵活的静态与服务端渲染
- **改善性能**: 自动图像优化、代码分割
- **开发体验**: 快速刷新、TypeScript 支持
- **可扩展性**: 支持各种插件和集成

## 2. 创建 Next.js 项目

### 2.1 使用 create-next-app

```bash
npx create-next-app@latest my-next-app
# 或使用 yarn
yarn create next-app my-next-app
# 或使用 pnpm
pnpm create next-app my-next-app
```

### 2.2 项目结构

```plaintext
my-next-app/
  ├── app/                 # App Router 目录
  │   ├── layout.tsx      # 根布局
  │   ├── page.tsx        # 首页
  │   └── [...route]/     # 路由文件
  ├── public/             # 静态资源
  ├── components/         # React组件
  ├── styles/            # 样式文件
  ├── package.json       # 项目依赖
  └── next.config.js     # Next.js配置
```

## 3. 路由系统

### 3.1 基于文件的路由

Next.js 13+ 提供了两种路由系统:

1. **App Router (推荐)**:

```plaintext
app/
  ├── page.tsx           # 首页 (/)
  ├── about/
  │   └── page.tsx      # 关于页 (/about)
  └── blog/
      └── [slug]/
          └── page.tsx  # 博客文章页 (/blog/[slug])
```

2. **Pages Router (传统)**:

```plaintext
pages/
  ├── index.tsx         # 首页 (/)
  ├── about.tsx        # 关于页 (/about)
  └── blog/
      └── [slug].tsx   # 博客文章页 (/blog/[slug])
```

### 3.2 动态路由

```typescript
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>博客文章: {params.slug}</h1>;
}
```

## 4. 数据获取

### 4.1 服务端组件数据获取

```typescript
// app/posts/page.tsx
async function getData() {
  const res = await fetch("https://api.example.com/posts");
  return res.json();
}

export default async function Posts() {
  const posts = await getData();
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### 4.2 客户端数据获取

```typescript
"use client";

import { useState, useEffect } from "react";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://api.example.com/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## 5. 样式处理

### 5.1 CSS 模块

```typescript
// styles/Home.module.css
.container {
  padding: 2rem;
}

// app/page.tsx
import styles from './styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Welcome to Next.js</h1>
    </div>
  )
}
```

### 5.2 全局样式

```typescript
// app/global.css
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
}

// app/layout.tsx
import './global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## 6. 静态资源处理

### 6.1 图片组件

```typescript
import Image from "next/image";

export default function Avatar() {
  return (
    <Image src="/avatar.png" alt="用户头像" width={64} height={64} priority />
  );
}
```

### 6.2 字体优化

```typescript
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

## 7. API 路由

### 7.1 创建 API 端点

```typescript
// app/api/hello/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Hello World" });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data: body });
}
```

### 7.2 使用 API 路由

```typescript
"use client";

async function submitData(data: any) {
  const res = await fetch("/api/hello", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}
```

## 8. 环境变量

### 8.1 配置环境变量

```plaintext
# .env.local
DATABASE_URL=mysql://user:password@localhost:3306/mydb
API_KEY=your-api-key
```

### 8.2 使用环境变量

```typescript
// 服务端组件中使用
const dbUrl = process.env.DATABASE_URL;
const apiKey = process.env.API_KEY;

// 客户端使用 (需要 NEXT_PUBLIC_ 前缀)
const publicKey = process.env.NEXT_PUBLIC_API_KEY;
```

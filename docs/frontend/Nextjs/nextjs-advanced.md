---
title: Next.js 进阶知识
sidebar_position: 2
---

# Next.js 进阶知识

本文将深入探讨 Next.js 的进阶特性和最佳实践,帮助你构建更复杂、更高性能的应用。

## 1. 渲染策略

### 1.1 服务器组件

Server Components 是 React 18 引入的新特性,Next.js 默认采用:

```typescript
// app/ServerComponent.tsx
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function ServerComponent() {
  const data = await getData()
  return <div>{data.message}</div>
}
```

优势:
- 减少客户端 JavaScript 体积
- 直接访问后端资源
- 保持敏感数据在服务器
- 改善首次加载性能

### 1.2 客户端组件

当需要交互性或浏览器 API 时使用:

```typescript
'use client'

import { useState } from 'react'

export default function ClientComponent() {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### 1.3 混合渲染模式

组合使用服务器和客户端组件:

```typescript
// app/page.tsx
import ClientCounter from './ClientCounter'

// 这是一个服务器组件
export default async function Page() {
  const data = await fetchData()
  
  return (
    <div>
      <h1>{data.title}</h1>
      {/* 嵌入客户端组件 */}
      <ClientCounter />
    </div>
  )
}
```

## 2. 高级路由功能

### 2.1 并行路由

```typescript
// app/@modal/(.)photos/[id]/page.tsx
export default function PhotoModal({ params }: { params: { id: string } }) {
  return (
    <dialog>
      <img src={`/photos/${params.id}`} />
    </dialog>
  )
}
```

### 2.2 拦截路由

```typescript
// app/(.)share/[id]/page.tsx
export default function ShareSheet({ params }: { params: { id: string } }) {
  return (
    <div className="modal">
      <h2>分享 {params.id}</h2>
      {/* 分享选项 */}
    </div>
  )
}
```

### 2.3 路由组

```typescript
// app/(shop)/layout.tsx
export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="shop-layout">
      <nav>{/* 商店导航 */}</nav>
      {children}
    </div>
  )
}
```

## 3. 数据缓存和重新验证

### 3.1 缓存策略

```typescript
// 默认缓存
const data = await fetch('https://api.example.com/data')

// 不缓存
const realtimeData = await fetch('https://api.example.com/data', {
  cache: 'no-store'
})

// 设置重新验证时间
const cachedData = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 } // 1小时后重新验证
})
```

### 3.2 按需重新验证

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const { path, tag } = await request.json()
  
  if (path) {
    revalidatePath(path)
  }
  
  if (tag) {
    revalidateTag(tag)
  }
  
  return Response.json({ revalidated: true })
}
```

## 4. 中间件和安全

### 4.1 配置中间件

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 检查认证
  const token = request.cookies.get('token')
  
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // 添加安全头
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*']
}
```

### 4.2 错误处理

```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>出错了!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>重试</button>
    </div>
  )
}
```

## 5. 性能优化

### 5.1 图像优化

```typescript
import Image from 'next/image'

export default function Gallery() {
  return (
    <div>
      <Image
        src="/large-image.jpg"
        alt="优化的图片"
        width={800}
        height={600}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..."
        priority={true}
        loading="eager"
        sizes="(max-width: 768px) 100vw, 800px"
      />
    </div>
  )
}
```

### 5.2 字体优化

```typescript
import { Inter, Roboto_Mono } from 'next/font/google'
 
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})
 
const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-roboto-mono',
})
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.className} ${roboto_mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### 5.3 脚本优化

```typescript
import Script from 'next/script'

export default function Layout() {
  return (
    <>
      {/* 第三方脚本优化加载 */}
      <Script
        src="https://www.google-analytics.com/analytics.js"
        strategy="lazyOnload"
        onLoad={() => console.log('脚本加载完成')}
      />
      
      {/* 关键脚本优先加载 */}
      <Script
        src="/important.js"
        strategy="beforeInteractive"
      />
    </>
  )
}
```

## 6. 状态管理和数据持久化

### 6.1 使用 Zustand

```typescript
import create from 'zustand'

interface Store {
  count: number
  increment: () => void
  decrement: () => void
}

const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))

export default useStore
```

### 6.2 结合 React Query

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

## 7. 国际化

### 7.1 配置多语言路由

```typescript
// middleware.ts
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let locales = ['en', 'zh', 'ja']
let defaultLocale = 'en'

function getLocale(request: Request): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return match(languages, locales, defaultLocale)
}

export function middleware(request: Request) {
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    return Response.redirect(new URL(`/${locale}${pathname}`, request.url))
  }
}
```

### 7.2 翻译管理

```typescript
// messages/zh.json
{
  "header": {
    "welcome": "欢迎访问",
    "login": "登录"
  }
}

// app/[lang]/layout.tsx
import { getDictionary } from '@/lib/dictionaries'

export default async function Layout({
  children,
  params: { lang }
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const dict = await getDictionary(lang)

  return (
    <html lang={lang}>
      <body>
        <header>
          <h1>{dict.header.welcome}</h1>
          <button>{dict.header.login}</button>
        </header>
        {children}
      </body>
    </html>
  )
}
```

## 8. 测试和部署

### 8.1 单元测试

```typescript
// __tests__/Home.test.tsx
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'
 
describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})
```

### 8.2 E2E测试

```typescript
// e2e/home.spec.ts
import { test, expect } from '@playwright/test'

test('should navigate to the about page', async ({ page }) => {
  await page.goto('/')
  await page.click('text=About')
  await expect(page).toHaveURL('/about')
})
```

### 8.3 部署配置

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // 用于容器化部署
  images: {
    domains: ['example.com'], // 允许的图片域名
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    serverActions: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```
---
title: NestJS + Prisma ORM
description: 本章节将介绍 NestJS 如何使用 Prisma 进行开发。
---

[Prisma](https://www.prisma.io/)， 是一个支持多种数据库的开源的数据库工具，主要有下面的一些功能：

- 数据模型管理
- 数据库迁移
- 数据库查询

## 使用 Prisma 进行数据库模型管理

> Prisma 提供了一种声明式的方式来定义数据库模型，可以根据 [Prisma Schema](https://www.prisma.io/docs/orm/prisma-schema/overview) 来生成数据库模型和对应的 TypeScript 类型。
>
> 简单来说就是可以通过这个功能，生成代码和修改数据库模型。

### 示例

```prisma
// prisma/schema.prisma
datasource db { // 数据源：一个文件中只能定义一个datasource
  provider = "postgresql" // 数据库类型
  url      = env("DATABASE_URL") // 数据库连接字符串，可以通过环境变量来配置。
//   url      = "postgresql://localhost:5432/mydb?schema=public" // 也可以直接指定数据库连接字符串
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean  @default(false)
  title     String   @db.VarChar(255)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
}

enum Role {
  USER
  ADMIN
}
```

## 使用 Prisma 进行数据库迁移

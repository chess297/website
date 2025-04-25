---
title: NestJS 中使用配置
---

## 项目初始化

```bash
nest new project-name
```

## 项目结构

```text
├── src
│   ├── auth
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   └── dto
│   │       ├── login.dto.ts
│   │       └── register.dto.ts
│   ├── common
│   │   ├── config
│   │   │   ├── config.module.ts
│   │   │   └── config.service.ts
│   │   ├── decorators
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── enums
│   │   │   ├── role.enum.ts
│   │   │   └── status.enum.ts
│   │   ├── exceptions
│   │   │   ├── http-exception.filter.ts
│   │   │   └── http-exception.ts
│   │   ├── guards
│   │   │   ├── auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── interceptors
│   │   │   └── log.interceptor.ts
│   │   ├── pipes
│   │   │   └── validation.pipe.ts
│   │   └── utils
│   │       ├── bcrypt.util.ts
│   │       ├── jwt.util.ts
│   │       └── response.util.ts
│   ├── database
│   │   ├── database.module.ts
│   │   └── database.service.ts
│   ├── modules
│   │   ├── user
│   │   │   ├── user.controller.ts
│   │   │   ├── user.module.ts
│   │   │   ├── user.service.ts
│   │   │   └── dto
│   │   │       └── user.dto.ts
│   │   └── role
│   │       ├── role.controller.ts
│   │       ├── role.module.ts
│   │       ├── role.service.ts
│   │       └── dto
│   │           └── role.dto.ts
│   ├── main.ts
│   └── app.module.ts
├── test
│   └── app.e2e-spec.ts
├── .env
├── .eslintrc.js
├── .gitignore
├── nest-cli.json
├── package.json
├── README.md
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

## 配置文件

### js-yaml 配置加载

```bash
npm install js-yaml
```

```yaml
#config.yaml
database:
  host: localhost
  port: 3306
  username: root
  password: password
  database: nestjs
jwt:
  secret: secret
  expiresIn: 7d
```

### joi 配置校验

```bash
npm install joi
```

### 为什么不是 dotenv？

- dotenv 只能读取 .env 文件，不能读取 .env.local 文件，所以需要使用 js-yaml 来读取配置文件。

## DTO 数据校验

### class-validator

```bash
npm install class-validator class-transformer
```

## 数据操作

### Prisma

#### 为什么不是 TypeORM？

- synchronize 当 synchronize 设置为 true 时，会同步数据库，有可能会删除数据，所以尽量不要使用。

#### Redis

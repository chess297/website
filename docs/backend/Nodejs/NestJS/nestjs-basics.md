---
title: NestJS 基础知识
sidebar_position: 1
---

## 什么是 NestJS？

NestJS 是一个用于构建高效、可靠和可扩展的服务器端应用程序的框架。它基于 TypeScript 和 Node.js，并结合了面向对象编程（OOP）、函数式编程（FP）和函数响应式编程（FRP）的元素。

NestJS 在架构上深受 Angular 的影响，采用了模块化的结构，使得应用程序的代码组织更加清晰。它提供了一套完整的开发工具，可以帮助开发者快速构建企业级应用。

## 核心概念

### 1. 模块 (Modules)

模块是 NestJS 应用程序的基本构建块，用于组织相关的组件，例如控制器、服务和中间件等。每个 NestJS 应用至少有一个根模块。

```typescript
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // 导出服务以供其他模块使用
  imports: [], // 导入其他模块
})
export class UsersModule {}
```

### 2. 控制器 (Controllers)

控制器负责处理传入的请求和向客户端返回响应。

```typescript
import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### 3. 提供者 (Providers)

提供者是 NestJS 中的基本概念，可以被视为服务、存储库、工厂等。提供者的主要思想是依赖注入（DI）。

```typescript
import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  private readonly users: any[] = [];

  create(createUserDto: CreateUserDto) {
    this.users.push(createUserDto);
    return createUserDto;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find((user) => user.id === id);
  }
}
```

### 4. 中间件 (Middleware)

中间件是在路由处理器之前调用的函数。它可以访问请求和响应对象，以及应用程序的请求响应周期中的 `next()` 中间件函数。

```typescript
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... ${req.method} ${req.path}`);
    next();
  }
}
```

在模块中使用中间件：

```typescript
import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { LoggerMiddleware } from "./common/middleware/logger.middleware";
import { UsersController } from "./users/users.controller";

@Module({
  controllers: [UsersController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("users");
  }
}
```

### 5. 管道 (Pipes)

管道是用来转换输入数据或验证输入数据的工具。

```typescript
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException("Value is required");
    }
    return value;
  }
}
```

使用内置的验证管道：

```typescript
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("users")
export class UsersController {
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }
}
```

### 6. 守卫 (Guards)

守卫是用来决定一个请求是否应该被处理程序处理的工具。

```typescript
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

使用守卫：

```typescript
import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";

@Controller("users")
export class UsersController {
  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return "This route is protected";
  }
}
```

### 7. 拦截器 (Interceptors)

拦截器可以：

- 在函数执行前/后绑定额外的逻辑
- 转换从函数返回的结果
- 转换从函数抛出的异常
- 扩展基本函数行为
- 根据特定条件完全重写函数

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Before...");

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

使用拦截器：

```typescript
import { Controller, Get, UseInterceptors } from "@nestjs/common";
import { LoggingInterceptor } from "./logging.interceptor";

@Controller("users")
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  @Get()
  findAll() {
    return "This route uses an interceptor";
  }
}
```

### 8. 异常过滤器 (Exception Filters)

异常过滤器负责处理应用程序中所有未处理的异常。

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

使用异常过滤器：

```typescript
import {
  Controller,
  Get,
  UseFilters,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpExceptionFilter } from "./http-exception.filter";

@Controller("users")
@UseFilters(HttpExceptionFilter)
export class UsersController {
  @Get()
  findAll() {
    throw new HttpException("Forbidden", HttpStatus.FORBIDDEN);
  }
}
```

## 数据传输对象 (DTO)

DTO 是一种用于定义如何通过网络发送数据的对象。

```typescript
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;
}
```

## 执行顺序

NestJS 应用程序中各个组件的执行顺序如下：

1. 中间件
2. 守卫
3. 拦截器（控制器方法之前）
4. 管道
5. 控制器方法处理
6. 拦截器（控制器方法之后）
7. 异常过滤器（如果有异常）

## 安装和使用

### 安装 NestJS CLI

```bash
npm i -g @nestjs/cli
```

### 创建新项目

```bash
nest new project-name
```

### 项目结构

一个典型的 NestJS 项目结构：

```
project-name/
├── src/
│   ├── app.controller.spec.ts  # 控制器测试文件
│   ├── app.controller.ts       # 基本控制器
│   ├── app.module.ts           # 根模块
│   ├── app.service.ts          # 基本服务
│   └── main.ts                 # 应用程序入口文件
├── test/                       # 测试目录
├── nest-cli.json               # NestJS CLI 配置
├── package.json                # npm 配置
├── tsconfig.json               # TypeScript 配置
└── tsconfig.build.json         # TypeScript 构建配置
```

### 运行应用程序

```bash
# 开发模式
npm run start

# 监听模式
npm run start:dev

# 生产模式
npm run start:prod
```

## 总结

NestJS 是一个强大且灵活的 Node.js 框架，它结合了面向对象编程、函数式编程和函数响应式编程的元素。通过采用模块化架构，它提供了一种构建可扩展、可测试和可维护的 API 的优雅方式。

核心概念包括模块、控制器、提供者、中间件、管道、守卫、拦截器和异常过滤器。这些概念共同工作，为开发人员提供了构建健壮应用程序的工具。

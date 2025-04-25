---
title: NestJS 进阶知识
sidebar_position: 2
---

# NestJS 进阶知识

## 高级配置管理

### 环境变量与配置

在实际应用中，不同的环境（开发、测试、生产）需要不同的配置。NestJS 提供了多种方法来处理这种情况。

#### 使用 ConfigModule

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as Joi from "joi";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid("development", "production", "test")
          .default("development"),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default("1d"),
      }),
      load: [() => ({ custom: "config" })], // 自定义配置加载器
    }),
  ],
})
export class AppModule {}
```

然后，可以在服务中使用配置：

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    const port = this.configService.get<number>("PORT");
    return `Hello World! Running on port ${port}`;
  }
}
```

### 使用自定义配置文件

除了环境变量，还可以使用 YAML 或 JSON 格式的配置文件。

```typescript
// config.yaml 加载
import { readFileSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";

const YAML_CONFIG_FILENAME = "config.yaml";

export default () => {
  return yaml.load(
    readFileSync(join(process.cwd(), YAML_CONFIG_FILENAME), "utf8")
  );
};
```

在模块中:

```typescript
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
})
export class AppModule {}
```

## 数据库集成进阶

### TypeORM 高级特性

#### 事务处理

```typescript
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Order } from "./entities/order.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private dataSource: DataSource
  ) {}

  async createUserWithOrder(userData: any, orderData: any) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = this.usersRepository.create(userData);
      await queryRunner.manager.save(user);

      const order = new Order();
      order.user = user;
      order.items = orderData.items;
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return { user, order };
    } catch (err) {
      // 如果发生错误，回滚事务
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      // 无论如何，都必须释放查询运行器
      await queryRunner.release();
    }
  }
}
```

#### 关系和级联

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn()
  user: User;
}
```

### MongoDB 集成

```typescript
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./schemas/user.schema";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://localhost/nest"),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

用户模型和服务:

```typescript
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
```

### Prisma 集成

Prisma 是一个现代的数据库 ORM，提供类型安全和自动生成的查询构建器。

```typescript
// prisma.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: any) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
```

在服务中使用 Prisma:

```typescript
import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { User, Prisma } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }
}
```

## 认证与授权

### JWT 认证

```typescript
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: "your_jwt_secret", // 在实际应用中，请从环境变量中获取
      signOptions: { expiresIn: "60m" },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
```

JWT 策略和认证服务:

```typescript
// jwt.strategy.ts
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "your_jwt_secret", // 在实际应用中，请从环境变量中获取
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}

// auth.service.ts
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

### 基于角色的授权

```typescript
// roles.decorator.ts
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// 在控制器中使用
import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("users")
export class UsersController {
  @Get("admin-only")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  getAdminData() {
    return "This is only for admins";
  }
}
```

## 微服务架构

### 基于消息的微服务

```typescript
// main.ts (微服务)
import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.REDIS,
      options: {
        url: "redis://localhost:6379",
      },
    }
  );
  await app.listen();
}
bootstrap();

// users.controller.ts (微服务)
import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { UsersService } from "./users.service";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: "get_user" })
  getUser(id: number) {
    return this.usersService.findOne(id);
  }
}

// app.module.ts (网关)
import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "USERS_SERVICE",
        transport: Transport.REDIS,
        options: {
          url: "redis://localhost:6379",
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// app.controller.ts (网关)
import { Controller, Get, Param, Inject } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Controller()
export class AppController {
  constructor(
    @Inject("USERS_SERVICE") private readonly usersClient: ClientProxy
  ) {}

  @Get("users/:id")
  getUser(@Param("id") id: number): Observable<any> {
    return this.usersClient.send({ cmd: "get_user" }, id);
  }
}
```

### gRPC 集成

```typescript
// main.ts (微服务)
import { NestFactory } from "@nestjs/core";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { join } from "path";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: "hero",
        protoPath: join(__dirname, "hero/hero.proto"),
      },
    }
  );
  await app.listen();
}
bootstrap();

// hero.controller.ts
import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { HeroById } from "./interfaces/hero-by-id.interface";
import { Hero } from "./interfaces/hero.interface";

@Controller()
export class HeroController {
  private readonly heroes: Hero[] = [
    { id: 1, name: "John" },
    { id: 2, name: "Doe" },
  ];

  @GrpcMethod("HeroService", "FindOne")
  findOne(data: HeroById): Hero {
    return this.heroes.find(({ id }) => id === data.id);
  }
}
```

## 缓存策略

### 内存缓存

```typescript
import { Module, CacheModule } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// 在控制器中使用
import {
  Controller,
  Get,
  UseInterceptors,
  CacheInterceptor,
} from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
```

### Redis 缓存

```typescript
import { Module, CacheModule } from "@nestjs/common";
import * as redisStore from "cache-manager-redis-store";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: "localhost",
      port: 6379,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

## 文件上传与处理

### 使用 multer 处理文件上传

```typescript
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("upload")
export class UploadController {
  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error("只允许图片文件!"), false);
        }
        cb(null, true);
      },
    })
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      originalname: file.originalname,
      filename: file.filename,
    };
  }
}
```

### 处理多个文件

```typescript
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("uploads")
export class UploadsController {
  @Post()
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      // 限制最多10个文件
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    })
  )
  uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map((file) => ({
      originalname: file.originalname,
      filename: file.filename,
    }));
  }
}
```

## 任务调度

### Cron 任务

```typescript
import { Injectable } from "@nestjs/common";
import { Cron, CronExpression, Interval, Timeout } from "@nestjs/schedule";

@Injectable()
export class TasksService {
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log("Called every 10 seconds");
  }

  @Interval(5000)
  handleInterval() {
    console.log("Called every 5 seconds");
  }

  @Timeout(60000)
  handleTimeout() {
    console.log("Called once after 60 seconds");
  }

  @Cron("45 * * * * *")
  handleCustomCron() {
    console.log("Called at 45 seconds of every minute");
  }
}
```

在模块中注册任务模块:

```typescript
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TasksService } from "./tasks.service";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService],
})
export class TasksModule {}
```

## 高级日志记录

### 自定义日志拦截器

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { ip, method, originalUrl } = request;
    const userAgent = request.get("user-agent") || "";

    const now = Date.now();

    return next.handle().pipe(
      tap((response) => {
        const responseTime = Date.now() - now;
        this.logger.log(
          `${method} ${originalUrl} ${ip} ${userAgent} ${responseTime}ms`
        );
      })
    );
  }
}
```

### 集成外部日志系统

例如，使用 Winston 进行日志记录:

```typescript
import { Module } from "@nestjs/common";
import { WinstonModule } from "nest-winston";
import * as winston from "winston";

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message }) => {
              return `${timestamp} ${level}: ${message}`;
            })
          ),
        }),
        new winston.transports.File({ filename: "combined.log" }),
        new winston.transports.File({ filename: "errors.log", level: "error" }),
      ],
    }),
  ],
})
export class AppModule {}
```

## 高级特性与优化技巧

### 自定义装饰器

#### 参数装饰器

```typescript
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  }
);
```

使用示例：

```typescript
@Get('profile')
getProfile(@User('email') email: string) {
  return `User email: ${email}`;
}
```

#### 复合装饰器

```typescript
import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "./roles.guard";

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata("roles", roles),
    UseGuards(AuthGuard("jwt"), RolesGuard)
  );
}
```

### 高级依赖注入技术

#### 自定义提供者

```typescript
const CONNECTION = "CONNECTION";

const connectionFactory = {
  provide: CONNECTION,
  useFactory: (configService: ConfigService) => {
    return new DatabaseConnection(configService.get("db"));
  },
  inject: [ConfigService],
};

@Module({
  providers: [connectionFactory],
})
export class AppModule {}
```

#### 动态模块和异步配置

```typescript
@Module({})
export class ConfigurableModuleClass {
  static register(options: Record<string, any>): DynamicModule {
    return {
      module: ConfigurableModuleClass,
      providers: [
        {
          provide: "CONFIG_OPTIONS",
          useValue: options,
        },
      ],
      exports: ["CONFIG_OPTIONS"],
    };
  }

  static registerAsync(options: {
    useFactory: (
      ...args: any[]
    ) => Promise<Record<string, any>> | Record<string, any>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: ConfigurableModuleClass,
      imports: options.imports || [],
      providers: [
        {
          provide: "CONFIG_OPTIONS",
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ],
      exports: ["CONFIG_OPTIONS"],
    };
  }
}
```

### 性能优化

#### 响应压缩

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  await app.listen(3000);
}
```

#### 缓存优化

```typescript
import { CacheModule, Module } from "@nestjs/common";
import * as redisStore from "cache-manager-redis-store";

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: "localhost",
        port: 6379,
        ttl: 60 * 60, // 1 hour
        max: 100, // maximum number of items in cache
      }),
    }),
  ],
})
export class AppModule {}
```

### 错误处理与监控

#### 全局异常过滤器

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import * as Sentry from "@sentry/node";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 发送错误到 Sentry
    Sentry.captureException(exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        exception instanceof Error
          ? exception.message
          : "Internal server error",
    });
  }
}
```

#### 健康检查

```typescript
import { Controller, Get } from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from "@nestjs/terminus";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck("nestjs-docs", "https://docs.nestjs.com"),
      () => this.http.pingCheck("google", "https://google.com"),
    ]);
  }
}
```

### 测试最佳实践

#### 高级单元测试

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./user.entity";

describe("UserService", () => {
  let service: UserService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const result = ["test"];
      mockRepository.find.mockResolvedValue(result);
      expect(await service.findAll()).toBe(result);
    });
  });
});
```

#### E2E 测试

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("AppController (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/users (GET)", () => {
    return request(app.getHttpServer())
      .get("/users")
      .expect(200)
      .expect("Content-Type", /json/)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

### WebSocket 和实时通信

#### 高级 WebSocket 实现

```typescript
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "events",
})
export class EventsGateway {
  @SubscribeMessage("events")
  handleEvent(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket
  ): string {
    client.broadcast.emit("events", data);
    return data;
  }
}
```

### GraphQL 高级功能

#### 自定义指令

```typescript
import { Directive } from "@nestjs/graphql";

@Directive("@upper")
export class Recipe {
  title: string;
}

// Schema 定义
const typeDefs = `
  directive @upper on FIELD_DEFINITION

  type Recipe {
    title: String! @upper
  }
`;
```

## 总结

本节内容涵盖了 NestJS 的进阶主题，包括配置管理、数据库集成、认证授权、微服务架构、缓存策略、文件上传、任务调度和高级日志记录等。掌握这些技术可以帮助你构建更复杂、更健壮的 NestJS 应用程序。

在实际开发中，你可能需要根据项目需求组合使用这些技术，并结合基础知识来创建高质量的后端系统。

以上高级特性涵盖了 NestJS 的深层应用，包括自定义装饰器、依赖注入进阶、性能优化、错误处理与监控、测试最佳实践以及 WebSocket 和 GraphQL 的高级应用。这些知识点将帮助你构建更健壮、可维护的企业级应用。

记住，这些高级特性应该根据具体项目需求来使用，不是所有项目都需要实现所有功能。选择合适的特性来满足你的业务需求才是最重要的。

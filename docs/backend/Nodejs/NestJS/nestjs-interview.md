---
title: NestJS 面试题
sidebar_position: 4
---

# NestJS 面试题

## 基础概念

### 1. 什么是 NestJS？它的主要特点是什么？

NestJS 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的框架。主要特点包括：

- 基于 TypeScript 构建，提供完整的类型支持
- 采用面向对象编程（OOP）、函数式编程（FP）和函数响应式编程（FRP）的概念
- 架构设计受 Angular 影响，采用模块化结构
- 内置依赖注入系统
- 支持多种服务器平台（Express、Fastify）
- 提供完整的测试支持
- 内置多种功能模块（认证、缓存、WebSocket 等）

### 2. NestJS 中的模块是什么？为什么需要模块化？

模块是 NestJS 应用程序的基本构建块，用于组织相关的组件、服务和功能。模块化的优势：

- 提高代码的可维护性和可重用性
- 实现关注点分离
- 便于管理依赖关系
- 支持惰性加载，提高应用性能

示例代码：

```typescript
@Module({
  imports: [UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
```

### 3. 什么是控制器（Controller）？如何创建一个控制器？

控制器负责处理传入的请求并返回响应。创建控制器的步骤：

```typescript
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }
}
```

### 4. 什么是提供者（Provider）？它们的作用是什么？

提供者是 NestJS 依赖注入系统的基础，主要用途：

- 封装业务逻辑
- 提供可复用的服务
- 管理依赖关系
- 实现面向接口编程

示例：

```typescript
@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  create(user: User) {
    this.users.push(user);
    return user;
  }

  findAll() {
    return this.users;
  }
}
```

## 进阶问题

### 5. NestJS 中的依赖注入是如何工作的？

NestJS 使用强大的依赖注入系统来管理类之间的依赖关系：

- 通过构造函数注入依赖
- 使用 @Injectable() 装饰器标记服务
- 支持属性注入和构造函数注入
- 可以使用自定义提供者

示例：

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService
  ) {}
}
```

### 6. 如何在 NestJS 中实现中间件？中间件的执行顺序是什么？

中间件实现和执行顺序：

```typescript
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log("Request...");
    next();
  }
}

// 在模块中应用中间件
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("users");
  }
}
```

执行顺序：

1. 全局中间件
2. 模块中间件
3. 全局守卫
4. 控制器守卫
5. 路由守卫
6. 全局拦截器
7. 控制器拦截器
8. 路由拦截器
9. 全局管道
10. 控制器管道
11. 路由管道
12. 路由参数管道

### 7. NestJS 中的管道（Pipe）是什么？如何使用？

管道用于数据转换和验证：

```typescript
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // 验证或转换逻辑
    return value;
  }
}

// 在控制器中使用
@Post()
createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

### 8. 解释 NestJS 中的异常过滤器

异常过滤器用于统一处理应用程序中的异常：

```typescript
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

## 高级问题

### 9. 如何在 NestJS 中实现自定义装饰器？

创建自定义装饰器的方法：

```typescript
// 参数装饰器
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  }
);

// 方法装饰器
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
```

### 10. NestJS 中如何处理文件上传？

文件上传处理示例：

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadFile(@UploadedFile() file: Express.Multer.File) {
  return {
    originalname: file.originalname,
    filename: file.filename,
  };
}

// 多文件上传
@Post('uploads')
@UseInterceptors(FilesInterceptor('files'))
async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
  return files.map(file => ({
    originalname: file.originalname,
    filename: file.filename,
  }));
}
```

### 11. 如何在 NestJS 中实现缓存？

缓存实现方式：

```typescript
// 启用缓存
@Module({
  imports: [
    CacheModule.register({
      ttl: 5, // 秒
      max: 10, // 最大缓存项数
    }),
  ],
})
// 在控制器中使用
@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  @Get()
  @CacheKey("custom_key")
  @CacheTTL(20)
  findAll() {
    return this.appService.findAll();
  }
}
```

### 12. NestJS 中如何实现请求的速率限制？

使用 `@nestjs/throttler` 实现速率限制：

```typescript
// 全局配置
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
  ],
})
// 在控制器中使用
@Controller("auth")
@UseGuards(ThrottlerGuard)
export class AuthController {
  @Throttle(5, 60)
  @Post("login")
  async login() {
    // 登录逻辑
  }
}
```

## 性能优化问题

### 13. 如何优化 NestJS 应用的性能？

性能优化策略：

1. 使用适当的缓存策略

```typescript
@CacheKey('users_cache')
@CacheTTL(30)
async findAll() {
  return this.usersRepository.find();
}
```

2. 实现数据库查询优化

```typescript
@QueryBuilder()
async findUsers() {
  return this.usersRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.profile', 'profile')
    .where('user.isActive = :isActive', { isActive: true })
    .cache(true)
    .getMany();
}
```

3. 启用压缩

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  await app.listen(3000);
}
```

### 14. 在 NestJS 中如何处理大量并发请求？

处理高并发的策略：

1. 使用连接池

```typescript
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'user',
      password: 'password',
      database: 'db',
      extra: {
        max: 25, // 连接池最大连接数
        connectionTimeoutMillis: 3000,
      },
    }),
  ],
})
```

2. 实现队列处理

```typescript
@Injectable()
export class EmailService {
  @Process("email")
  async handleEmail(job: Job) {
    // 处理邮件发送
  }
}
```

## 微服务相关问题

### 15. 如何在 NestJS 中实现微服务架构？

微服务实现示例：

```typescript
// 微服务端
const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  AppModule,
  {
    transport: Transport.TCP,
    options: {
      host: "localhost",
      port: 3001,
    },
  }
);

// 客户端
@Injectable()
export class AppService {
  constructor(@Inject("USER_SERVICE") private readonly client: ClientProxy) {}

  async getUser(id: number) {
    return this.client.send({ cmd: "get_user" }, id);
  }
}
```

### 16. NestJS 中如何处理服务间通信？

服务间通信方式：

1. TCP 通信

```typescript
@MessagePattern({ cmd: 'sum' })
async accumulate(data: number[]): Promise<number> {
  return (data || []).reduce((a, b) => a + b);
}
```

2. Redis 发布/订阅

```typescript
@EventPattern('user_created')
async handleUserCreated(data: Record<string, unknown>) {
  // 处理用户创建事件
}
```

## 最佳实践问题

### 17. 如何在 NestJS 中进行单元测试和 e2e 测试？

测试示例：

```typescript
// 单元测试
describe("UsersService", () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});

// e2e 测试
describe("UsersController (e2e)", () => {
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
      .expect("Content-Type", /json/);
  });
});
```

### 18. NestJS 中如何处理环境配置？

环境配置最佳实践：

```typescript
// 配置服务
@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    this.envConfig = dotenv.parse(fs.readFileSync(`.env.${process.env.NODE_ENV}`));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

// 配置模块
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .required(),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
      }),
    }),
  ],
})
```

## 安全相关问题

### 19. 如何在 NestJS 中实现安全防护？

安全防护措施：

1. 实现 CORS

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ["http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
}
```

2. 使用 Helmet 中间件

```typescript
import * as helmet from "helmet";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
}
```

3. 实现 CSRF 保护

```typescript
import * as csurf from "csurf";

app.use(csurf());
```

### 20. 如何在 NestJS 中处理身份认证和授权？

身份认证和授权实现：

1. JWT 认证

```typescript
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
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

2. 基于角色的授权

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>("roles", context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.some((role) => user.roles?.includes(role));
  }
}
```

## 总结

这些面试题涵盖了 NestJS 的主要概念和实践，从基础的模块和控制器，到高级的微服务和性能优化。要成功回答这些问题，需要：

1. 深入理解 NestJS 的核心概念
2. 具备实际的项目经验
3. 了解最佳实践和设计模式
4. 熟悉性能优化和安全防护措施
5. 掌握测试和调试技巧

准备面试时，建议：

- 动手实践这些概念
- 理解每个功能背后的原理
- 思考实际应用场景
- 准备相关的代码示例
- 关注 NestJS 的最新发展

---
title: Flutter进阶
sidebar_position: 3
---

# Flutter 进阶

## 高级状态管理

### Provider 深入

```dart
// 1. 多Provider的使用
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => UserProvider()),
    ChangeNotifierProvider(create: (_) => ThemeProvider()),
    ProxyProvider<UserProvider, CartProvider>(
      update: (_, userProvider, previous) =>
        CartProvider(userProvider, previous),
    ),
  ],
  child: MyApp(),
)

// 2. Provider.value的使用
Provider.value(
  value: someValue,
  child: ChildWidget(),
)

// 3. 选择性重建
Selector<MyProvider, MyData>(
  selector: (_, provider) => provider.specificData,
  builder: (_, data, __) => MyWidget(data),
)
```

### Riverpod

```dart
// 1. 定义Provider
final counterProvider = StateNotifierProvider<Counter, int>((ref) {
  return Counter();
});

class Counter extends StateNotifier<int> {
  Counter() : super(0);

  void increment() => state++;
}

// 2. 使用Provider
class CounterWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);

    return Text('Count: $count');
  }
}

// 3. 依赖管理
final userProvider = FutureProvider((ref) async {
  final repository = ref.watch(repositoryProvider);
  return repository.fetchUser();
});
```

### GetX

```dart
// 1. 状态管理
class Controller extends GetxController {
  var count = 0.obs;

  void increment() => count++;
}

// 2. 依赖注入
class HomeController extends GetxController {
  final ApiService apiService = Get.find();
}

Get.put(ApiService());

// 3. 路由管理
GetMaterialApp(
  getPages: [
    GetPage(name: '/', page: () => HomePage()),
    GetPage(
      name: '/details/:id',
      page: () => DetailsPage(),
      transition: Transition.fade,
    ),
  ],
)
```

### Bloc 模式

```dart
// 1. 事件定义
abstract class CounterEvent {}
class IncrementPressed extends CounterEvent {}
class DecrementPressed extends CounterEvent {}

// 2. 状态定义
class CounterState {
  final int count;
  CounterState(this.count);
}

// 3. Bloc实现
class CounterBloc extends Bloc<CounterEvent, CounterState> {
  CounterBloc() : super(CounterState(0)) {
    on<IncrementPressed>((event, emit) {
      emit(CounterState(state.count + 1));
    });

    on<DecrementPressed>((event, emit) {
      emit(CounterState(state.count - 1));
    });
  }
}

// 4. UI集成
BlocBuilder<CounterBloc, CounterState>(
  builder: (context, state) {
    return Text('Count: ${state.count}');
  },
)
```

## 自定义 Widget

### CustomPaint 详解

```dart
class CustomShapeWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CustomPaint(
      painter: CustomShapePainter(),
      child: Container(
        height: 200,
        width: 200,
      ),
    );
  }
}

class CustomShapePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.fill;

    final path = Path();
    path.moveTo(0, size.height * 0.7);
    path.quadraticBezierTo(
      size.width * 0.25,
      size.height * 0.7,
      size.width * 0.5,
      size.height * 0.8,
    );
    path.quadraticBezierTo(
      size.width * 0.75,
      size.height * 0.9,
      size.width,
      size.height * 0.8,
    );
    path.lineTo(size.width, size.height);
    path.lineTo(0, size.height);
    path.close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => false;
}
```

### 自定义 RenderObject

```dart
class CustomRenderWidget extends SingleChildRenderObjectWidget {
  CustomRenderWidget({Key? key, Widget? child})
      : super(key: key, child: child);

  @override
  RenderObject createRenderObject(BuildContext context) {
    return CustomRenderBox();
  }
}

class CustomRenderBox extends RenderBox {
  @override
  void performLayout() {
    if (child != null) {
      child!.layout(constraints, parentUsesSize: true);
      size = child!.size;
    } else {
      size = constraints.smallest;
    }
  }

  @override
  void paint(PaintingContext context, Offset offset) {
    if (child != null) {
      context.paintChild(child!, offset);
    }

    final canvas = context.canvas;
    final paint = Paint()
      ..color = Colors.blue
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.0;

    canvas.drawRect(
      offset & size,
      paint,
    );
  }
}
```

### Widget 生命周期深入理解

```dart
class LifecycleWidget extends StatefulWidget {
  @override
  _LifecycleWidgetState createState() => _LifecycleWidgetState();
}

class _LifecycleWidgetState extends State<LifecycleWidget>
    with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    print('1. initState');
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    print('2. didChangeDependencies');
  }

  @override
  void didUpdateWidget(LifecycleWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    print('3. didUpdateWidget');
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    print('App state: $state');
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    print('4. dispose');
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    print('5. build');
    return Container();
  }
}
```

### 性能优化技巧

1. **使用 const 构造函数**

```dart
// 优化前
Widget build(BuildContext context) {
  return Container(
    padding: EdgeInsets.all(8.0),
    child: Text('Hello'),
  );
}

// 优化后
Widget build(BuildContext context) {
  return const Padding(
    padding: EdgeInsets.all(8.0),
    child: Text('Hello'),
  );
}
```

2. **避免重建**

```dart
// 使用ValueNotifier避免整个组件重建
class OptimizedWidget extends StatelessWidget {
  final ValueNotifier<int> _counter = ValueNotifier<int>(0);

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<int>(
      valueListenable: _counter,
      builder: (context, value, child) {
        return Text('Count: $value');
      },
    );
  }
}
```

## 动画系统

### 隐式动画

```dart
// 1. AnimatedContainer
AnimatedContainer(
  duration: Duration(milliseconds: 300),
  curve: Curves.easeInOut,
  width: _expanded ? 200.0 : 100.0,
  height: _expanded ? 200.0 : 100.0,
  color: _expanded ? Colors.blue : Colors.red,
)

// 2. AnimatedOpacity
AnimatedOpacity(
  duration: Duration(milliseconds: 300),
  opacity: _visible ? 1.0 : 0.0,
  child: Container(
    width: 100,
    height: 100,
    color: Colors.blue,
  ),
)
```

### 显式动画

```dart
class AnimatedLogo extends StatefulWidget {
  @override
  _AnimatedLogoState createState() => _AnimatedLogoState();
}

class _AnimatedLogoState extends State<AnimatedLogo>
    with SingleTickerProviderStateMixin {
  late AnimationController controller;
  late Animation<double> animation;

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      duration: Duration(seconds: 2),
      vsync: this,
    );

    animation = Tween<double>(begin: 0, end: 300).animate(
      CurvedAnimation(
        parent: controller,
        curve: Curves.easeInOut,
      ),
    )..addListener(() {
      setState(() {});
    });

    controller.repeat(reverse: true);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: animation.value,
      height: animation.value,
      color: Colors.blue,
    );
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }
}
```

### Hero 动画

```dart
// 1. 起始页面
Hero(
  tag: 'imageHero',
  child: Image.network(
    'https://example.com/image.jpg',
    width: 100,
  ),
)

// 2. 目标页面
Hero(
  tag: 'imageHero',
  child: Image.network(
    'https://example.com/image.jpg',
    width: 300,
  ),
)
```

### 交织动画

```dart
class StaggeredAnimation extends StatefulWidget {
  @override
  _StaggeredAnimationState createState() => _StaggeredAnimationState();
}

class _StaggeredAnimationState extends State<StaggeredAnimation>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _opacity;
  late Animation<double> _width;
  late Animation<double> _height;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: Duration(milliseconds: 2000),
      vsync: this,
    );

    _opacity = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.0, 0.3, curve: Curves.easeIn),
      ),
    );

    _width = Tween<double>(
      begin: 50.0,
      end: 200.0,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.3, 0.6, curve: Curves.easeIn),
      ),
    );

    _height = Tween<double>(
      begin: 50.0,
      end: 200.0,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.6, 1.0, curve: Curves.easeIn),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Opacity(
          opacity: _opacity.value,
          child: Container(
            width: _width.value,
            height: _height.value,
            color: Colors.blue,
          ),
        );
      },
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
```

## 国际化和本地化

### intl 包使用

```dart
// 1. 添加依赖
// pubspec.yaml
// dependencies:
//   intl: ^0.17.0
//   flutter_localizations:
//     sdk: flutter

// 2. 配置本地化
MaterialApp(
  localizationsDelegates: [
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
  ],
  supportedLocales: [
    Locale('en', ''),
    Locale('zh', ''),
  ],
)

// 3. 使用本地化字符串
import 'package:intl/intl.dart';

String message = Intl.message(
  'Hello {name}',
  name: 'greeting',
  args: [name],
  desc: 'Greeting message',
);
```

### 多语言支持

```dart
// 1. 创建本地化类
class AppLocalizations {
  final Locale locale;

  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(
      context,
      AppLocalizations,
    )!;
  }

  static Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'title': 'Hello World',
      'message': 'Welcome to Flutter',
    },
    'zh': {
      'title': '你好，世界',
      'message': '欢迎使用Flutter',
    },
  };

  String get title {
    return _localizedValues[locale.languageCode]!['title']!;
  }

  String get message {
    return _localizedValues[locale.languageCode]!['message']!;
  }
}

// 2. 创建代理
class AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) {
    return ['en', 'zh'].contains(locale.languageCode);
  }

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(AppLocalizationsDelegate old) => false;
}
```

### 资源管理

```yaml
# pubspec.yaml
flutter:
  assets:
    - assets/images/
    - assets/fonts/
    - assets/translations/

  fonts:
    - family: CustomFont
      fonts:
        - asset: assets/fonts/CustomFont-Regular.ttf
        - asset: assets/fonts/CustomFont-Bold.ttf
          weight: 700
```

## 平台集成

### 原生平台集成

```dart
// 1. 平台通道定义
static const platform = MethodChannel('samples.flutter.dev/battery');

// 2. 调用原生方法
try {
  final int result = await platform.invokeMethod('getBatteryLevel');
  batteryLevel = 'Battery level: $result%';
} on PlatformException catch (e) {
  batteryLevel = "Failed to get battery level: '${e.message}'.";
}

// 3. 原生端实现（Android）
class MainActivity: FlutterActivity() {
  private val CHANNEL = "samples.flutter.dev/battery"

  override fun configureFlutterEngine(@NonNull flutterEngine: FlutterEngine) {
    super.configureFlutterEngine(flutterEngine)
    MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler {
      call, result ->
      if (call.method == "getBatteryLevel") {
        val batteryLevel = getBatteryLevel()
        result.success(batteryLevel)
      } else {
        result.notImplemented()
      }
    }
  }
}
```

### Platform Channels

```dart
// 1. EventChannel示例
static const EventChannel eventChannel =
    EventChannel('samples.flutter.dev/charging');

StreamSubscription? _subscription;

void startListening() {
  _subscription = eventChannel.receiveBroadcastStream().listen(
    (dynamic event) {
      print('Received event: $event');
    },
    onError: (dynamic error) {
      print('Error: $error');
    },
  );
}

// 2. BasicMessageChannel示例
static final BasicMessageChannel<String> platform =
    BasicMessageChannel<String>(
  'samples.flutter.dev/message',
  StringCodec(),
);

// 发送消息
String reply = await platform.send('Hello from Flutter');

// 接收消息
platform.setMessageHandler((String? message) async {
  return 'Reply from Flutter';
});
```

### 插件开发基础

```dart
// 1. 插件项目结构
my_plugin/
  ├── android/          # Android平台实现
  ├── ios/             # iOS平台实现
  ├── lib/             # Dart API
  └── pubspec.yaml     # 插件配置

// 2. 插件实现示例
class MyPlugin {
  static const MethodChannel _channel =
      MethodChannel('my_plugin');

  static Future<String> get platformVersion async {
    final String version = await _channel.invokeMethod('getPlatformVersion');
    return version;
  }
}

// 3. 使用插件
import 'package:my_plugin/my_plugin.dart';

String platformVersion = await MyPlugin.platformVersion;
```

## 网络编程进阶

### Dio 详解

```dart
// 1. 基本配置
final dio = Dio(BaseOptions(
  baseUrl: 'https://api.example.com',
  connectTimeout: Duration(seconds: 5),
  receiveTimeout: Duration(seconds: 3),
  headers: {
    'Authorization': 'Bearer $token',
  },
));

// 2. 拦截器
dio.interceptors.add(InterceptorsWrapper(
  onRequest: (options, handler) {
    // 请求拦截
    return handler.next(options);
  },
  onResponse: (response, handler) {
    // 响应拦截
    return handler.next(response);
  },
  onError: (DioError e, handler) {
    // 错误处理
    return handler.next(e);
  },
));

// 3. 高级功能
// 文件上传
FormData formData = FormData.fromMap({
  'file': await MultipartFile.fromFile('./text.txt'),
  'info': 'file upload',
});

Response response = await dio.post('/upload', data: formData);

// 下载文件
await dio.download(
  'http://example.com/file',
  './example.pdf',
  onReceiveProgress: (received, total) {
    print('${(received / total * 100).toStringAsFixed(0)}%');
  },
);
```

### WebSocket

```dart
// 1. WebSocket连接
final channel = WebSocketChannel.connect(
  Uri.parse('ws://echo.websocket.org'),
);

// 2. 发送消息
channel.sink.add('Hello!');

// 3. 接收消息
StreamBuilder(
  stream: channel.stream,
  builder: (context, snapshot) {
    if (snapshot.hasData) {
      return Text('Received: ${snapshot.data}');
    }
    return CircularProgressIndicator();
  },
)

// 4. 关闭连接
channel.sink.close();
```

### GraphQL 集成

```dart
// 1. 配置客户端
final HttpLink httpLink = HttpLink(
  'https://api.example.com/graphql',
);

final GraphQLClient client = GraphQLClient(
  link: httpLink,
  cache: GraphQLCache(),
);

// 2. 查询
const String readRepositories = r'''
  query ReadRepositories($nRepositories: Int!) {
    viewer {
      repositories(last: $nRepositories) {
        nodes {
          id
          name
          viewerHasStarred
        }
      }
    }
  }
''';

final QueryOptions options = QueryOptions(
  document: gql(readRepositories),
  variables: {
    'nRepositories': 50,
  },
);

final QueryResult result = await client.query(options);

// 3. 变更
const String starRepository = r'''
  mutation StarRepository($id: ID!) {
    addStar(input: {starrableId: $id}) {
      starrable {
        viewerHasStarred
      }
    }
  }
''';

final MutationOptions options = MutationOptions(
  document: gql(starRepository),
  variables: {
    'id': repositoryId,
  },
);

final QueryResult result = await client.mutate(options);
```

## 数据持久化

### Hive 数据库

```dart
// 1. 定义模型
@HiveType(typeId: 0)
class Person extends HiveObject {
  @HiveField(0)
  late String name;

  @HiveField(1)
  late int age;
}

// 2. 初始化
await Hive.initFlutter();
await Hive.openBox<Person>('persons');

// 3. CRUD操作
// 添加数据
final box = Hive.box<Person>('persons');
final person = Person()
  ..name = 'John'
  ..age = 25;
box.add(person);

// 读取数据
final allPersons = box.values.toList();

// 更新数据
person.age = 26;
person.save();

// 删除数据
person.delete();
```

### Floor ORM

```dart
// 1. 定义实体
@entity
class Person {
  @primaryKey
  final int id;

  final String name;
  final int age;

  Person(this.id, this.name, this.age);
}

// 2. 定义DAO
@dao
abstract class PersonDao {
  @Query('SELECT * FROM Person')
  Future<List<Person>> findAllPersons();

  @Query('SELECT * FROM Person WHERE id = :id')
  Stream<Person?> findPersonById(int id);

  @insert
  Future<void> insertPerson(Person person);

  @update
  Future<void> updatePerson(Person person);

  @delete
  Future<void> deletePerson(Person person);
}

// 3. 定义数据库
@Database(version: 1, entities: [Person])
abstract class AppDatabase extends FloorDatabase {
  PersonDao get personDao;
}

// 4. 使用数据库
final database = await $FloorAppDatabase
    .databaseBuilder('app_database.db')
    .build();

final personDao = database.personDao;
```

### 加密存储

```dart
// 1. 使用flutter_secure_storage
final storage = FlutterSecureStorage();

// 写入数据
await storage.write(key: 'token', value: 'my-secure-token');

// 读取数据
String? token = await storage.read(key: 'token');

// 删除数据
await storage.delete(key: 'token');

// 2. 使用encrypt包加密
final key = Key.fromLength(32);
final iv = IV.fromLength(16);
final encrypter = Encrypter(AES(key));

// 加密
final encrypted = encrypter.encrypt('Hello', iv: iv);

// 解密
final decrypted = encrypter.decrypt(encrypted, iv: iv);
```

### 缓存策略

```dart
class CacheManager {
  static const cacheTimeout = Duration(hours: 1);
  final _cache = <String, CacheEntry>{};

  Future<T> getData<T>(
    String key,
    Future<T> Function() fetcher,
  ) async {
    if (_cache.containsKey(key)) {
      final entry = _cache[key]!;
      if (DateTime.now().difference(entry.timestamp) < cacheTimeout) {
        return entry.data as T;
      }
      _cache.remove(key);
    }

    final data = await fetcher();
    _cache[key] = CacheEntry(data, DateTime.now());
    return data;
  }

  void clearCache() {
    _cache.clear();
  }
}

class CacheEntry {
  final dynamic data;
  final DateTime timestamp;

  CacheEntry(this.data, this.timestamp);
}
```

## 测试

### 单元测试

```dart
void main() {
  group('Counter', () {
    test('value should start at 0', () {
      final counter = Counter();
      expect(counter.value, 0);
    });

    test('value should be incremented', () {
      final counter = Counter();
      counter.increment();
      expect(counter.value, 1);
    });

    test('value should be decremented', () {
      final counter = Counter();
      counter.decrement();
      expect(counter.value, -1);
    });
  });
}
```

### Widget 测试

```dart
void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    // 构建widget
    await tester.pumpWidget(MyApp());

    // 验证初始状态
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);

    // 点击按钮
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();

    // 验证结果
    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
```

### 集成测试

```dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('App flow test', (WidgetTester tester) async {
    app.main();
    await tester.pumpAndSettle();

    // 登录流程
    await tester.enterText(
      find.byType(TextField).first,
      'test@example.com',
    );
    await tester.enterText(
      find.byType(TextField).last,
      'password',
    );
    await tester.tap(find.byType(ElevatedButton));
    await tester.pumpAndSettle();

    // 验证登录后的页面
    expect(find.text('Welcome'), findsOneWidget);
  });
}
```

## 调试技巧

### DevTools 使用

1. **启动 DevTools**

```bash
flutter pub global activate devtools
flutter pub global run devtools
```

2. **性能分析**

- 使用 CPU Profiler 分析性能瓶颈
- 使用 Memory 视图监控内存使用
- 使用 Timeline 查看帧渲染情况

3. **调试布局**

- 使用 Layout Explorer 检查布局问题
- 使用 Widget Inspector 定位 UI 问题

### 性能分析

```dart
// 1. 性能监控
class PerformanceOverlay extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        MyApp(),
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          child: SizedBox(
            height: 100,
            child: CustomPerformanceOverlay(),
          ),
        ),
      ],
    );
  }
}

// 2. 帧监控
final timing = await SchedulerBinding.instance!.currentFrameTimeStamp;
```

### 内存泄漏检测

1. **使用 Flutter Memory Profiler**
2. **检查 dispose 方法**
3. **监控 Stream 订阅**
4. **避免循环引用**

### 界面调试

```dart
// 1. 调试边框
debugPaintSizeEnabled = true;

// 2. 调试基线
debugPaintBaselinesEnabled = true;

// 3. 调试重绘
debugRepaintRainbowEnabled = true;

// 4. 自定义调试信息
debugPrint('Custom debug info');
```

### 网络调试

1. **使用 Charles/Fiddler 抓包**
2. **配置代理**

```dart
dio.options.proxy = 'localhost:8888';
```

3. **日志拦截器**

```dart
dio.interceptors.add(LogInterceptor(
  requestBody: true,
  responseBody: true,
));
```

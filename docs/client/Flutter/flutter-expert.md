---
title: Flutter高级
sidebar_position: 4
---

# Flutter 高级

## 性能优化

### 渲染优化

```dart
// 1. 使用RepaintBoundary隔离重绘区域
RepaintBoundary(
  child: MyComplexWidget(),
)

// 2. 优化build方法
class OptimizedWidget extends StatelessWidget {
  const OptimizedWidget({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const CustomWidget(); // 使用const构造函数
  }
}

// 3. 使用IndexedStack懒加载
IndexedStack(
  index: _currentIndex,
  children: [
    HomeScreen(),
    ProfileScreen(),
    SettingsScreen(),
  ],
)
```

### 内存优化

```dart
// 1. 图片缓存管理
class ImageCacheManager {
  static void clearCache() {
    // 清除内存缓存
    PaintingBinding.instance.imageCache.clear();
    // 清除磁盘缓存
    DefaultCacheManager().emptyCache();
  }

  static void limitCacheSize() {
    PaintingBinding.instance.imageCache.maximumSize = 100;
    PaintingBinding.instance.imageCache.maximumSizeBytes = 50 << 20; // 50MB
  }
}

// 2. 大列表优化
ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) {
    return KeepAliveWrapper(
      child: ItemWidget(item: items[index]),
    );
  },
)

// 3. 自动释放资源
class ResourceManager {
  final List<StreamSubscription> _subscriptions = [];
  final List<AnimationController> _controllers = [];

  void dispose() {
    for (var subscription in _subscriptions) {
      subscription.cancel();
    }
    for (var controller in _controllers) {
      controller.dispose();
    }
    _subscriptions.clear();
    _controllers.clear();
  }
}
```

### 启动优化

```dart
// 1. 延迟加载
Future<void> initializeApp() async {
  // 必要的初始化
  await SharedPreferences.getInstance();

  // 延迟加载的资源
  Future.delayed(Duration(seconds: 2), () {
    precacheImage(AssetImage('assets/large_image.png'), context);
    loadHeavyLibraries();
  });
}

// 2. 并行初始化
Future<void> parallelInitialization() async {
  await Future.wait([
    initializeDatabase(),
    loadConfiguration(),
    prefetchData(),
  ]);
}

// 3. 资源预加载
class AssetPreloader {
  static Future<void> preloadAssets(BuildContext context) async {
    final manifestContent = await DefaultAssetBundle.of(context)
        .loadString('AssetManifest.json');
    final Map<String, dynamic> manifestMap = json.decode(manifestContent);

    final imagePaths = manifestMap.keys
        .where((String key) => key.contains('images/'))
        .toList();

    for (var path in imagePaths) {
      precacheImage(AssetImage(path), context);
    }
  }
}
```

## 架构设计

### Clean Architecture

```dart
// 1. 领域层（Domain Layer）
abstract class UserRepository {
  Future<User> getUser(String id);
  Future<void> saveUser(User user);
}

class GetUserUseCase {
  final UserRepository repository;

  GetUserUseCase(this.repository);

  Future<User> execute(String id) {
    return repository.getUser(id);
  }
}

// 2. 数据层（Data Layer）
class UserRepositoryImpl implements UserRepository {
  final UserRemoteDataSource remoteDataSource;
  final UserLocalDataSource localDataSource;

  UserRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<User> getUser(String id) async {
    try {
      final user = await remoteDataSource.getUser(id);
      await localDataSource.cacheUser(user);
      return user;
    } catch (e) {
      return localDataSource.getLastKnownUser();
    }
  }
}

// 3. 表现层（Presentation Layer）
class UserBloc extends Cubit<UserState> {
  final GetUserUseCase getUserUseCase;

  UserBloc(this.getUserUseCase) : super(UserInitial());

  Future<void> getUser(String id) async {
    emit(UserLoading());
    try {
      final user = await getUserUseCase.execute(id);
      emit(UserLoaded(user));
    } catch (e) {
      emit(UserError(e.toString()));
    }
  }
}
```

### MVVM 架构

```dart
// 1. Model
class User {
  final String id;
  final String name;
  final String email;

  User({
    required this.id,
    required this.name,
    required this.email,
  });
}

// 2. ViewModel
class UserViewModel extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadUser(String id) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _user = await userRepository.getUser(id);
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}

// 3. View
class UserScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => UserViewModel(),
      child: Consumer<UserViewModel>(
        builder: (context, viewModel, child) {
          if (viewModel.isLoading) {
            return CircularProgressIndicator();
          }
          if (viewModel.error != null) {
            return Text(viewModel.error!);
          }
          return UserDetailsWidget(user: viewModel.user!);
        },
      ),
    );
  }
}
```

### 依赖注入

```dart
// 1. 使用GetIt
final getIt = GetIt.instance;

void setupDependencies() {
  // 注册单例
  getIt.registerSingleton<ApiClient>(ApiClient());

  // 注册工厂
  getIt.registerFactory<UserRepository>(
    () => UserRepositoryImpl(
      remoteDataSource: getIt<UserRemoteDataSource>(),
      localDataSource: getIt<UserLocalDataSource>(),
    ),
  );

  // 注册懒加载单例
  getIt.registerLazySingleton<AuthenticationService>(
    () => AuthenticationServiceImpl(),
  );
}

// 2. 使用Provider
MultiProvider(
  providers: [
    Provider<ApiClient>(
      create: (_) => ApiClient(),
    ),
    ProxyProvider<ApiClient, UserRepository>(
      update: (_, client, __) => UserRepositoryImpl(client),
    ),
    ChangeNotifierProxyProvider<UserRepository, UserViewModel>(
      update: (_, repository, __) => UserViewModel(repository),
    ),
  ],
  child: MyApp(),
)

// 3. 使用riverpod
final apiClientProvider = Provider((ref) => ApiClient());

final userRepositoryProvider = Provider((ref) {
  final client = ref.watch(apiClientProvider);
  return UserRepositoryImpl(client);
});

final userViewModelProvider = StateNotifierProvider<UserViewModel, UserState>((ref) {
  final repository = ref.watch(userRepositoryProvider);
  return UserViewModel(repository);
});
```

## 平台特定实现

### Platform-Specific Code

```dart
// 1. 平台检测
if (Platform.isAndroid) {
  // Android特定实现
} else if (Platform.isIOS) {
  // iOS特定实现
} else if (Platform.isWeb) {
  // Web特定实现
}

// 2. 条件导入
import 'package:flutter/foundation.dart' show kIsWeb;
import 'dart:io' if (dart.library.html) 'dart:html';

// 3. 平台特定Widget
class PlatformWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    if (Platform.isIOS) {
      return CupertinoButton(
        child: Text('iOS Style'),
        onPressed: () {},
      );
    }
    return ElevatedButton(
      child: Text('Android Style'),
      onPressed: () {},
    );
  }
}
```

### FFI (Foreign Function Interface)

```dart
// 1. 定义C函数接口
class NativeLibrary {
  static DynamicLibrary? _lib;

  static void initialize() {
    if (Platform.isAndroid) {
      _lib = DynamicLibrary.open('libnative.so');
    } else if (Platform.isIOS) {
      _lib = DynamicLibrary.process();
    }
  }

  static final int Function(int x, int y) add = _lib!
      .lookup<NativeFunction<Int32 Function(Int32, Int32)>>('add')
      .asFunction();
}

// 2. 使用FFI调用原生代码
void main() {
  NativeLibrary.initialize();
  final result = NativeLibrary.add(5, 3);
  print('5 + 3 = $result');
}
```

### 自定义平台视图

```dart
// 1. 定义平台视图工厂
class NativeViewFactory extends PlatformViewFactory {
  NativeViewFactory() : super(StandardMessageCodec());

  @override
  PlatformView create(
    BuildContext context,
    int viewId,
    dynamic args,
  ) {
    return NativeView(viewId: viewId);
  }
}

// 2. 实现平台视图
class NativeView implements PlatformView {
  final int viewId;

  NativeView({required this.viewId});

  @override
  Widget build(BuildContext context) {
    // 返回平台特定的视图
    if (Platform.isAndroid) {
      return AndroidView(
        viewType: 'native-view',
        onPlatformViewCreated: _onPlatformViewCreated,
      );
    }
    return UiKitView(
      viewType: 'native-view',
      onPlatformViewCreated: _onPlatformViewCreated,
    );
  }

  void _onPlatformViewCreated(int id) {
    // 处理视图创建完成事件
  }

  @override
  void dispose() {
    // 清理资源
  }
}
```

## 安全与加密

### 代码混淆

```yaml
# android/app/build.gradle
android {
buildTypes {
release {
minifyEnabled true
proguardFiles getDefaultProguardFile('proguard-android.txt'),
'proguard-rules.pro'
}
}
}
```

### 安全存储

```dart
// 1. 加密存储
class SecureStorage {
  static final _storage = FlutterSecureStorage();
  static final _key = Key.fromSecureRandom(32);
  static final _encrypter = Encrypter(AES(_key));

  static Future<void> saveSecure(String key, String value) async {
    final encrypted = _encrypter.encrypt(value, iv: IV.fromSecureRandom(16));
    await _storage.write(key: key, value: encrypted.base64);
  }

  static Future<String?> readSecure(String key) async {
    final encrypted = await _storage.read(key: key);
    if (encrypted == null) return null;

    final decrypted = _encrypter.decrypt64(encrypted, iv: IV.fromLength(16));
    return decrypted;
  }
}

// 2. 生物认证
class BiometricAuth {
  static Future<bool> authenticate() async {
    final localAuth = LocalAuthentication();
    try {
      return await localAuth.authenticate(
        localizedReason: '请进行生物认证',
        options: const AuthenticationOptions(
          useErrorDialogs: true,
          stickyAuth: true,
          biometricOnly: true,
        ),
      );
    } catch (e) {
      return false;
    }
  }
}
```

### 网络安全

```dart
// 1. 证书锁定
class SecureHttpClient extends HttpClient {
  @override
  Future<HttpClientRequest> getUrl(Uri url) async {
    final request = await super.getUrl(url);
    request.headers.add('X-Security-Header', _generateSecurityToken());
    return request;
  }

  bool _validateCertificate(X509Certificate cert) {
    // 实现证书验证逻辑
    final trustedFingerprint = 'expected-fingerprint';
    return cert.fingerprint == trustedFingerprint;
  }
}

// 2. API安全
class SecureApiClient {
  final String baseUrl;
  final String apiKey;

  SecureApiClient({
    required this.baseUrl,
    required this.apiKey,
  });

  Future<Response> secureRequest(
    String path, {
    required String method,
    Map<String, dynamic>? body,
  }) async {
    final timestamp = DateTime.now().millisecondsSinceEpoch.toString();
    final nonce = _generateNonce();
    final signature = _generateSignature(timestamp, nonce);

    return await dio.request(
      path,
      options: Options(
        method: method,
        headers: {
          'X-Api-Key': apiKey,
          'X-Timestamp': timestamp,
          'X-Nonce': nonce,
          'X-Signature': signature,
        },
      ),
      data: body,
    );
  }
}
```

## 监控与运维

### 崩溃收集

```dart
// 1. 错误处理
void main() {
  runZonedGuarded(
    () {
      WidgetsFlutterBinding.ensureInitialized();
      FlutterError.onError = (FlutterErrorDetails details) {
        // 处理Flutter框架错误
        reportError(details.exception, details.stack);
      };

      runApp(MyApp());
    },
    (error, stack) {
      // 处理其他未捕获的错误
      reportError(error, stack);
    },
  );
}

// 2. 错误上报
class ErrorReporter {
  static Future<void> reportError(
    dynamic error,
    StackTrace? stackTrace,
  ) async {
    // 收集设备信息
    final deviceInfo = await _collectDeviceInfo();

    // 构建错误报告
    final errorReport = {
      'error': error.toString(),
      'stackTrace': stackTrace?.toString(),
      'deviceInfo': deviceInfo,
      'timestamp': DateTime.now().toIso8601String(),
    };

    // 上报到服务器
    await _sendErrorReport(errorReport);
  }
}
```

### 性能监控

```dart
// 1. 性能追踪
class PerformanceMonitor {
  static final _instance = PerformanceMonitor._();
  factory PerformanceMonitor() => _instance;
  PerformanceMonitor._();

  final _metrics = <String, List<Duration>>{};

  void startTrace(String name) {
    if (!_metrics.containsKey(name)) {
      _metrics[name] = [];
    }
    _metrics[name]!.add(DateTime.now().difference(DateTime.epoch));
  }

  void endTrace(String name) {
    final start = _metrics[name]?.last;
    if (start != null) {
      final duration = DateTime.now().difference(DateTime.epoch) - start;
      print('$name took ${duration.inMilliseconds}ms');
    }
  }
}

// 2. 内存监控
class MemoryMonitor {
  static void printMemoryUsage() {
    final current = ProcessInfo.currentRss;
    final peak = ProcessInfo.maxRss;
    print('Current memory: ${current ~/ 1024}KB');
    print('Peak memory: ${peak ~/ 1024}KB');
  }
}
```

### 日志系统

```dart
// 1. 日志管理
class Logger {
  static final Logger _instance = Logger._internal();
  factory Logger() => _instance;
  Logger._internal();

  Future<void> log(
    String message, {
    LogLevel level = LogLevel.info,
    Object? error,
    StackTrace? stackTrace,
  }) async {
    final entry = LogEntry(
      timestamp: DateTime.now(),
      level: level,
      message: message,
      error: error,
      stackTrace: stackTrace,
    );

    // 本地存储
    await _saveLog(entry);

    // 远程上报
    if (level >= LogLevel.error) {
      await _reportLog(entry);
    }
  }
}

// 2. 日志聚合
class LogAggregator {
  static Future<void> uploadLogs() async {
    final logs = await _readLocalLogs();
    final batch = _prepareBatch(logs);
    await _uploadBatch(batch);
  }

  static Future<void> scheduledUpload() async {
    Timer.periodic(Duration(hours: 1), (_) {
      uploadLogs();
    });
  }
}
```

### APM 接入

```dart
// 1. 应用性能监控
class APMService {
  static void trackScreenLoad(String screenName) {
    final startTime = DateTime.now();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final duration = DateTime.now().difference(startTime);
      _reportScreenLoad(screenName, duration);
    });
  }

  static void trackNetworkCall(
    String api,
    Duration duration,
    int statusCode,
  ) {
    _reportNetworkCall(api, duration, statusCode);
  }
}

// 2. 用户行为分析
class AnalyticsService {
  static void trackEvent(
    String eventName, {
    Map<String, dynamic>? parameters,
  }) {
    final event = {
      'name': eventName,
      'parameters': parameters,
      'timestamp': DateTime.now().toIso8601String(),
      'sessionId': _currentSessionId,
    };

    _reportEvent(event);
  }

  static void trackUserFlow(List<String> screens) {
    _reportUserFlow(screens);
  }
}
```

## 多媒体处理

### 音视频处理

```dart
// 1. 视频播放器
class CustomVideoPlayer extends StatefulWidget {
  @override
  _CustomVideoPlayerState createState() => _CustomVideoPlayerState();
}

class _CustomVideoPlayerState extends State<CustomVideoPlayer> {
  late VideoPlayerController _controller;

  @override
  void initState() {
    super.initState();
    _controller = VideoPlayerController.network(
      'https://example.com/video.mp4',
    )..initialize().then((_) {
      setState(() {});
    });
  }

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: _controller.value.aspectRatio,
      child: VideoPlayer(_controller),
    );
  }
}

// 2. 音频处理
class AudioManager {
  static final _player = AudioPlayer();

  static Future<void> playAudio(String url) async {
    await _player.setUrl(url);
    await _player.play();
  }

  static Future<void> processAudio(String path) async {
    final file = File(path);
    final bytes = await file.readAsBytes();
    // 进行音频处理
  }
}
```

### 相机进阶

```dart
// 1. 自定义相机控制
class CustomCameraController {
  late CameraController _controller;

  Future<void> initialize() async {
    final cameras = await availableCameras();
    _controller = CameraController(
      cameras.first,
      ResolutionPreset.high,
      enableAudio: true,
    );
    await _controller.initialize();
  }

  Future<XFile> takePicture() async {
    return await _controller.takePicture();
  }

  Future<void> startVideoRecording() async {
    await _controller.startVideoRecording();
  }
}

// 2. 图像处理
class ImageProcessor {
  static Future<ui.Image> applyFilter(
    ui.Image image,
    ImageFilter filter,
  ) async {
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);

    canvas.drawImage(image, Offset.zero, Paint());

    final picture = recorder.endRecording();
    return await picture.toImage(
      image.width,
      image.height,
    );
  }
}
```

### AR/VR 集成

```dart
// 1. AR功能
class ARViewController {
  ARKitController? arKitController;

  void onARKitViewCreated(ARKitController controller) {
    arKitController = controller;
    _addBox();
  }

  void _addBox() {
    final node = ARKitNode(
      geometry: ARKitBox(
        width: 0.2,
        height: 0.2,
        length: 0.2,
        materials: [
          ARKitMaterial(
            diffuse: ARKitMaterialProperty.color(Colors.blue),
          )
        ],
      ),
    );

    arKitController?.add(node);
  }
}

// 2. VR展示
class VRViewer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return VrPanorama(
      onImageLoaded: () {
        print('VR全景图加载完成');
      },
      onError: (String error) {
        print('VR错误: $error');
      },
    );
  }
}
```

### 图片处理

```dart
// 1. 图片压缩
class ImageCompressor {
  static Future<File> compressImage(
    File file, {
    int quality = 85,
    int? targetWidth,
    int? targetHeight,
  }) async {
    final result = await FlutterImageCompress.compressAndGetFile(
      file.absolute.path,
      file.absolute.path.replaceAll('.jpg', '_compressed.jpg'),
      quality: quality,
      minWidth: targetWidth ?? 1024,
      minHeight: targetHeight ?? 1024,
    );

    return File(result!.path);
  }
}

// 2. 图片滤镜
class ImageFilterApplier {
  static Future<ui.Image> applyColorFilter(
    ui.Image image,
    ColorFilter colorFilter,
  ) async {
    final recorder = ui.PictureRecorder();
    final canvas = Canvas(recorder);
    final paint = Paint()..colorFilter = colorFilter;

    canvas.drawImage(image, Offset.zero, paint);

    final picture = recorder.endRecording();
    return await picture.toImage(
      image.width,
      image.height,
    );
  }
}

// 3. 图片缓存
class ImageCache {
  static final cache = LruCache<String, Uint8List>(
    maximumSize: 100,
  );

  static Future<void> cacheImage(String url) async {
    if (!cache.containsKey(url)) {
      final response = await http.get(Uri.parse(url));
      cache.put(url, response.bodyBytes);
    }
  }

  static Uint8List? getCachedImage(String url) {
    return cache.get(url);
  }
}
```

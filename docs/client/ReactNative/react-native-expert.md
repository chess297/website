---
title: React Native 高级知识
sidebar_position: 3
---

# React Native 高级知识

## 1. 架构优化

### 1.1 代码分离与动态加载

```jsx
// 使用动态导入优化初始加载时间
const LazyComponent = React.lazy(() => import("./HeavyComponent"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 1.2 内存管理

```jsx
class OptimizedComponent extends React.Component {
  // 清理资源和事件监听
  componentWillUnmount() {
    this.cleanup();
  }

  cleanup = () => {
    // 取消网络请求
    this.apiCall?.cancel();
    // 清理定时器
    clearTimeout(this.timer);
    // 移除事件监听
    this.subscription?.remove();
  };
}
```

## 2. 原生功能集成

### 2.1 原生 UI 组件

```jsx
// 注册原生视图
import { requireNativeComponent } from "react-native";

const CustomNativeView = requireNativeComponent("CustomView");

// 使用原生视图
function CustomView(props) {
  return (
    <CustomNativeView
      style={props.style}
      onNativeEvent={props.onEvent}
      {...props}
    />
  );
}
```

### 2.2 桥接原生 API

```jsx
// 创建原生模块桥接
import { NativeModules, NativeEventEmitter } from "react-native";

const { LocationModule } = NativeModules;
const locationEmitter = new NativeEventEmitter(LocationModule);

// 监听原生事件
const subscription = locationEmitter.addListener(
  "locationUpdate",
  (location) => {
    console.log("New location:", location);
  }
);

// 调用原生方法
LocationModule.startLocationUpdates();
```

## 3. 跨平台兼容

### 3.1 平台特定代码

```jsx
// Platform.select 用法
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
      default: {
        // fallback for web
      },
    }),
  },
});

// 平台特定文件
// MyComponent.ios.js
// MyComponent.android.js
// MyComponent.web.js
import MyComponent from "./MyComponent";
```

### 3.2 自适应布局

```jsx
import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// 根据屏幕宽度计算大小
const scale = SCREEN_WIDTH / 375; // 以 iPhone 6 为基准

function normalize(size) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

const responsiveStyles = StyleSheet.create({
  container: {
    width: normalize(200),
    padding: normalize(10),
  },
  text: {
    fontSize: normalize(16),
  },
});
```

## 4. 高级动画

### 4.1 复杂动画组合

```jsx
import { Animated } from "react-native";

function ComplexAnimation() {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const startAnimation = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: 100,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 100,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scale, {
        toValue: 1.5,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateX }, { translateY }, { scale }],
      }}
    >
      <Text>复杂动画示例</Text>
    </Animated.View>
  );
}
```

### 4.2 自定义动画驱动

```jsx
function CustomAnimationDriver() {
  const progress = useRef(new Animated.Value(0)).current;

  const customInterpolation = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        transform: [
          {
            rotate: customInterpolation,
          },
        ],
      }}
    />
  );
}
```

## 5. 安全性

### 5.1 数据加密

```jsx
import { NativeModules } from "react-native";
import CryptoJS from "crypto-js";

const { EncryptionModule } = NativeModules;

// 使用原生加密模块
async function encryptSensitiveData(data) {
  try {
    const encryptedData = await EncryptionModule.encrypt(JSON.stringify(data));
    return encryptedData;
  } catch (error) {
    console.error("加密失败:", error);
    return null;
  }
}

// JavaScript 端加密
function encryptWithAES(text, key) {
  return CryptoJS.AES.encrypt(text, key).toString();
}
```

### 5.2 安全存储

```jsx
import EncryptedStorage from "react-native-encrypted-storage";

async function storeSecureData(key, value) {
  try {
    await EncryptedStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("存储失败:", error);
  }
}

async function getSecureData(key) {
  try {
    const data = await EncryptedStorage.getItem(key);
    return JSON.parse(data);
  } catch (error) {
    console.error("读取失败:", error);
    return null;
  }
}
```

## 6. 监控与优化

### 6.1 性能监控

```jsx
import { PerformanceObserver } from "react-native";

// 监控渲染性能
class PerformanceMonitor {
  static init() {
    if (__DEV__) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}: ${entry.duration}ms`);
        }
      });

      observer.observe({ entryTypes: ["measure"] });
    }
  }

  static measure(name, fn) {
    if (__DEV__) {
      const start = performance.now();
      fn();
      const duration = performance.now() - start;
      console.log(`${name} took ${duration}ms`);
    } else {
      fn();
    }
  }
}
```

### 6.2 内存泄漏检测

```jsx
class MemoryLeakDetector {
  static subscriptions = new Set();

  static track(subscription) {
    this.subscriptions.add(subscription);
  }

  static untrack(subscription) {
    this.subscriptions.delete(subscription);
  }

  static checkLeaks() {
    if (__DEV__ && this.subscriptions.size > 0) {
      console.warn(
        `检测到 ${this.subscriptions.size} 个未清理的订阅`
      );
    }
  }
}

// 在组件中使用
componentDidMount() {
  this.subscription = api.subscribe();
  MemoryLeakDetector.track(this.subscription);
}

componentWillUnmount() {
  this.subscription.unsubscribe();
  MemoryLeakDetector.untrack(this.subscription);
}
```

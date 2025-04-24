---
title: React Native 面试题
sidebar_position: 4
---

# React Native 面试题

## 1. 基础概念

### 1.1 React Native 是什么？

React Native 是一个由 Facebook 开发的开源移动应用框架。它允许开发者使用 React 和原生平台的功能来创建 Android 和 iOS 应用。

主要特点:

- 使用 JavaScript 和 React 开发
- 转换为原生组件
- 支持热重载
- 一次编写,跨平台运行

### 1.2 React Native 与原生开发的区别

1. **开发效率**

   - React Native: 开发速度快,一套代码多端运行
   - 原生开发: 开发速度较慢,需要分别开发

2. **性能表现**

   - React Native: 接近原生,但有 JavaScript 桥接开销
   - 原生开发: 性能最优

3. **开发成本**
   - React Native: 成本较低,维护单一代码库
   - 原生开发: 需要维护多个代码库,成本较高

## 2. 核心问题

### 2.1 React Native 的工作原理是什么？

React Native 的架构包含三个主要部分:

1. **JavaScript 引擎**

   - 运行 JavaScript 代码
   - 处理业务逻辑
   - 生成虚拟 DOM

2. **Bridge (桥接层)**

   - 负责 JavaScript 和原生代码的通信
   - 使用异步消息传递
   - 序列化和反序列化数据

3. **原生层**
   - 包含原生 UI 组件
   - 处理原生 API 调用
   - 渲染界面

### 2.2 解释 React Native 的性能优化策略

1. **减少桥接通信**

```jsx
// 不好的做法
function BadExample() {
  return (
    <View>
      {data.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => console.log(item)}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// 好的做法
const handlePress = useCallback((id) => {
  console.log(id);
}, []);

function GoodExample() {
  return (
    <View>
      {data.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => handlePress(item.id)}>
          <Text>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
```

2. **使用原生驱动动画**

```jsx
Animated.timing(opacity, {
  toValue: 1,
  useNativeDriver: true, // 启用原生驱动
}).start();
```

3. **列表性能优化**

```jsx
<FlatList
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
  removeClippedSubviews={true}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
/>
```

## 3. 进阶问题

### 3.1 如何处理 React Native 的调试和错误追踪？

1. **开发环境调试**

- Chrome DevTools
- React Native Debugger
- React Developer Tools

2. **错误监控**

```jsx
if (!__DEV__) {
  // 生产环境错误处理
  ErrorUtils.setGlobalHandler((error) => {
    // 发送错误到监控平台
    reportError(error);
  });
}
```

### 3.2 如何实现 React Native 和原生代码的交互？

1. **原生模块调用**

```jsx
// JavaScript
import { NativeModules } from "react-native";
const { CalendarModule } = NativeModules;

// 调用原生方法
await CalendarModule.createCalendarEvent("Birthday Party", "My House");
```

2. **原生 UI 组件**

```jsx
// JavaScript
import { requireNativeComponent } from "react-native";
const CustomButton = requireNativeComponent("CustomButton");

// 使用原生组件
<CustomButton color="blue" onPress={this.handlePress} />;
```

## 4. 架构问题

### 4.1 React Native 项目如何做状态管理？

1. **Context + Hooks**

```jsx
const AppContext = React.createContext(null);

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
```

2. **Redux**

```jsx
// 配置 Store
const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiMiddleware),
});
```

### 4.2 React Native 的代码组织和最佳实践是什么？

1. **目录结构**

```plaintext
src/
├── components/     # 可复用组件
├── screens/        # 页面组件
├── navigation/     # 导航配置
├── store/         # 状态管理
├── services/      # API 服务
├── utils/         # 工具函数
└── assets/        # 静态资源
```

2. **组件设计原则**

- 单一职责
- 组件复用
- 状态提升
- 合理拆分

## 5. 实践问题

### 5.1 如何处理 React Native 应用的热更新？

1. **CodePush 集成**

```jsx
import codePush from "react-native-code-push";

let codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_START,
};

export default codePush(codePushOptions)(App);
```

2. **版本控制**

```jsx
async function checkUpdate() {
  try {
    const update = await codePush.checkForUpdate();
    if (update) {
      await update.download();
      await update.install(codePush.InstallMode.IMMEDIATE);
    }
  } catch (error) {
    console.error("更新失败:", error);
  }
}
```

### 5.2 React Native 的测试策略是什么？

1. **单元测试**

```jsx
import { render, fireEvent } from "@testing-library/react-native";

describe("Button", () => {
  it("handles press correctly", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="测试" onPress={onPress} />);

    fireEvent.press(getByText("测试"));
    expect(onPress).toHaveBeenCalled();
  });
});
```

2. **端到端测试**

```jsx
describe("Login Flow", () => {
  it("should login successfully", async () => {
    await element(by.id("email")).typeText("test@example.com");
    await element(by.id("password")).typeText("password");
    await element(by.id("login-button")).tap();

    await expect(element(by.text("Welcome"))).toBeVisible();
  });
});
```

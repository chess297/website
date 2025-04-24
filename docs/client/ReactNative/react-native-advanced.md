---
title: React Native 进阶知识
sidebar_position: 2
---

# React Native 进阶知识

## 1. 性能优化

### 1.1 避免重复渲染

```jsx
// 使用 React.memo 优化函数组件
const ExpensiveComponent = React.memo(({ data }) => {
  return (
    <View>
      {data.map((item) => (
        <Text key={item.id}>{item.name}</Text>
      ))}
    </View>
  );
});

// 使用 useMemo 缓存计算结果
const MemoizedValue = () => {
  const [items, setItems] = useState([]);
  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  return <Text>总价: {totalPrice}</Text>;
};
```

### 1.2 列表性能优化

```jsx
import { FlatList, VirtualizedList } from "react-native";

function OptimizedList() {
  const renderItem = useCallback(({ item }) => <ListItem item={item} />, []);

  const keyExtractor = useCallback((item) => item.id.toString(), []);

  return (
    <FlatList
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
    />
  );
}
```

## 2. 原生模块集成

### 2.1 创建原生模块

```java
// Android: CustomModule.java
public class CustomModule extends ReactContextBaseJavaModule {
  @Override
  public String getName() {
    return "CustomModule";
  }

  @ReactMethod
  public void showToast(String message) {
    Toast.makeText(getReactApplicationContext(),
      message,
      Toast.LENGTH_SHORT
    ).show();
  }
}
```

```swift
// iOS: CustomModule.swift
@objc(CustomModule)
class CustomModule: NSObject {
  @objc
  func showAlert(_ message: String) {
    DispatchQueue.main.async {
      // 显示原生弹窗
    }
  }
}
```

### 2.2 使用原生模块

```jsx
import { NativeModules } from "react-native";

const { CustomModule } = NativeModules;

// 调用原生方法
CustomModule.showToast("Hello from Native!");
```

## 3. 动画与手势

### 3.1 Animated API

```jsx
import { Animated, Easing } from "react-native";

function AnimatedComponent() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [150, 0],
            }),
          },
        ],
      }}
    >
      <Text>淡入动画</Text>
    </Animated.View>
  );
}
```

### 3.2 手势响应系统

```jsx
import { PanResponder } from "react-native";

function DraggableCard() {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: () => {
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        transform: [{ translateX: pan.x }, { translateY: pan.y }],
      }}
    >
      <Text>拖拽我</Text>
    </Animated.View>
  );
}
```

## 4. 状态管理进阶

### 4.1 Context API

```jsx
const ThemeContext = React.createContext("light");

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <Button
      title={`当前主题: ${theme}`}
      onPress={() => setTheme(theme === "light" ? "dark" : "light")}
    />
  );
}
```

### 4.2 Redux Middleware

```jsx
// 自定义中间件
const logger = (store) => (next) => (action) => {
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", store.getState());
  return result;
};

// 配置 Store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger).concat(thunk),
});
```

## 5. 测试

### 5.1 单元测试

```jsx
import { render, fireEvent } from "@testing-library/react-native";

describe("Button Component", () => {
  it("should handle press correctly", () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress} title="测试按钮" />);

    fireEvent.press(getByText("测试按钮"));
    expect(onPress).toHaveBeenCalled();
  });
});
```

### 5.2 集成测试

```jsx
import { navigateToScreen } from "./navigation";

describe("Navigation Flow", () => {
  it("should navigate through app correctly", async () => {
    await navigateToScreen("Home");
    expect(screen.currentScreen).toBe("Home");

    await navigateToScreen("Details");
    expect(screen.currentScreen).toBe("Details");
  });
});
```

## 6. 代码组织

### 6.1 项目结构

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

### 6.2 组件设计模式

```jsx
// 容器组件
function UserContainer() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  return <UserProfile user={user} />;
}

// 展示组件
function UserProfile({ user }) {
  if (!user) return <LoadingSpinner />;

  return (
    <View>
      <Text>{user.name}</Text>
      <Text>{user.email}</Text>
    </View>
  );
}
```

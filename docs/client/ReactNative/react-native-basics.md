---
title: React Native 基础知识
sidebar_position: 1
---

# React Native 基础知识

## 1. 环境搭建

### 1.1 开发环境要求

- Node.js (推荐 LTS 版本)
- JDK (Android 开发需要)
- Android Studio (Android 开发)
- Xcode (iOS 开发，仅 macOS)
- CocoaPods (iOS 依赖管理)

### 1.2 创建新项目

```bash
# 使用 React Native CLI
npx react-native@latest init MyApp

# 或使用 Expo CLI (推荐新手使用)
npx create-expo-app MyApp
```

## 2. 基础组件

### 2.1 核心组件

```jsx
import {
  View, // 容器组件，类似 div
  Text, // 文本组件
  Image, // 图片组件
  ScrollView, // 滚动视图
  TextInput, // 输入框
} from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Hello React Native!</Text>
      <Image
        source={require("./assets/logo.png")}
        style={{ width: 100, height: 100 }}
      />
      <TextInput
        placeholder="请输入文本"
        onChangeText={(text) => console.log(text)}
      />
    </View>
  );
}
```

### 2.2 样式与布局

```jsx
import { StyleSheet } from "react-native";

// 使用 Flexbox 布局
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
});
```

## 3. 导航

### 3.1 React Navigation

```jsx
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 3.2 页面跳转

```jsx
function HomeScreen({ navigation }) {
  return (
    <View>
      <Button
        title="跳转到详情页"
        onPress={() =>
          navigation.navigate("Details", {
            itemId: 86,
            title: "详情页",
          })
        }
      />
    </View>
  );
}

function DetailsScreen({ route }) {
  const { itemId, title } = route.params;
  return (
    <View>
      <Text>ID: {itemId}</Text>
      <Text>标题: {title}</Text>
    </View>
  );
}
```

## 4. 网络请求

### 4.1 Fetch API

```jsx
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error);
  }
}
```

### 4.2 Axios

```jsx
import axios from "axios";

// 配置默认值
axios.defaults.baseURL = "https://api.example.com";

// 发送请求
async function getData() {
  try {
    const response = await axios.get("/users");
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
```

## 5. 状态管理

### 5.1 React Hooks

```jsx
import { useState, useEffect } from "react";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser().then((data) => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <ActivityIndicator />;
  return <Text>{user.name}</Text>;
}
```

### 5.2 Redux

```jsx
import { createSlice, configureStore } from "@reduxjs/toolkit";

const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});
```

## 6. 本地存储

### 6.1 AsyncStorage

```jsx
import AsyncStorage from "@react-native-async-storage/async-storage";

// 存储数据
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

// 读取数据
const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
```

## 7. 调试工具

### 7.1 React Native Debugger

- 集成了 React DevTools
- Redux DevTools
- 网络请求监控
- Console 日志

### 7.2 Chrome DevTools

```jsx
// 在开发模式下使用
console.log("调试信息");
console.warn("警告信息");
console.error("错误信息");
```

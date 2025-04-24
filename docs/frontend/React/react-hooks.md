---
sidebar_position: 3
---

# React Hooks 详解

React Hooks 是 React 16.8 版本中引入的特性，它允许你在不编写 class 的情况下使用状态和其他 React 特性。Hooks 的出现使函数组件变得更加强大，解决了类组件中存在的一些问题。

## 为什么使用 Hooks？

Hooks 解决了 React 中的几个问题：

1. **难以复用有状态逻辑**：在 Hooks 出现前，复用组件逻辑需要使用高阶组件或 render props 模式，导致组件层级嵌套过深。
2. **复杂组件难以理解**：类组件中，相关逻辑被分散在不同的生命周期方法中，而 Hooks 可以按照逻辑关联来组织代码。
3. **类组件的困惑**：类组件中的 this 指向、绑定事件处理器等问题对开发者不够友好。

## 基础 Hook

### useState

`useState`是最基本的 Hook，用于在函数组件中添加状态管理。

```jsx
import React, { useState } from "react";

function Counter() {
  // 声明一个叫"count"的state变量，初始值为0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点击我</button>
    </div>
  );
}
```

**useState 特点：**

- 接收一个参数作为初始状态
- 返回一个包含两个元素的数组：当前状态和更新状态的函数
- 可以多次调用创建多个状态
- 更新函数可以接收新值或函数（接收旧状态返回新状态）

**useState 中的函数式更新：**

```jsx
// 直接传入新值
setCount(count + 1);

// 函数式更新，适合依赖之前的状态更新
setCount((prevCount) => prevCount + 1);
```

**使用对象作为状态时的注意点：**

```jsx
const [user, setUser] = useState({ name: "John", age: 25 });

// 错误的更新方式，会完全替换对象
setUser({ name: "Mike" }); // age属性丢失

// 正确的更新方式，保留其他属性
setUser((prevUser) => ({ ...prevUser, name: "Mike" }));
```

**惰性初始化状态：**

如果初始状态需要通过复杂计算得出，可以传入一个函数：

```jsx
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

### useEffect

`useEffect`用于处理函数组件中的副作用，如数据获取、订阅、DOM 操作等。

```jsx
import React, { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // 类似于componentDidMount和componentDidUpdate
  useEffect(() => {
    // 更新文档标题
    document.title = `你点击了 ${count} 次`;

    // 返回一个清理函数，类似componentWillUnmount
    return () => {
      document.title = "React App";
    };
  }, [count]); // 仅在count变更时执行

  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点击我</button>
    </div>
  );
}
```

**useEffect 的依赖数组：**

- 不提供依赖数组：每次渲染后执行
- 空依赖数组 `[]`：仅在组件挂载时执行，等同于`componentDidMount`
- 有依赖的数组 `[a, b]`：在 a 或 b 变化时执行

**清理副作用：**

当组件卸载或依赖变化前需要清理时，从 effect 中返回一个函数：

```jsx
useEffect(() => {
  const subscription = someAPI.subscribe();

  // 清理函数
  return () => {
    subscription.unsubscribe();
  };
}, [someAPI]);
```

**使用多个 Effect 分离关注点：**

```jsx
function UserStatus() {
  const [isOnline, setIsOnline] = useState(null);
  const [user, setUser] = useState(null);

  // 处理用户数据获取
  useEffect(() => {
    fetchUser().then((user) => setUser(user));
  }, []);

  // 处理在线状态
  useEffect(() => {
    if (!user) return;

    const handleStatusChange = (status) => {
      setIsOnline(status.isOnline);
    };

    ChatAPI.subscribeToUserStatus(user.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromUserStatus(user.id, handleStatusChange);
    };
  }, [user]);

  // ...
}
```

### useContext

`useContext`用于快速访问 React Context，避免嵌套 Consumer 组件。

```jsx
import React, { useContext } from "react";

// 创建Context
const ThemeContext = React.createContext("light");

function ThemedButton() {
  // 使用Context
  const theme = useContext(ThemeContext);

  return <button className={theme}>按钮</button>;
}

// 父组件提供Context值
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <ThemedButton />
    </ThemeContext.Provider>
  );
}
```

`useContext` 接收一个 Context 对象（React.createContext 的返回值）并返回该 Context 的当前值。当 Provider 更新值时，使用该 Context 的组件会重新渲染。

## 额外的 Hook

### useReducer

`useReducer`是 useState 的替代方案，适用于复杂的状态逻辑。

```jsx
import React, { useReducer } from "react";

// 定义reducer函数
function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  // 使用useReducer
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </>
  );
}
```

**useReducer 与 Redux 的区别：**

- useReducer 是 React 内置的，不需要额外安装
- useReducer 是组件级别的状态管理，而 Redux 是全局状态管理
- useReducer 通常用于单个组件的复杂状态逻辑，Redux 用于跨组件/跨应用的状态共享

**使用场景：**

- 当状态逻辑复杂，包含多个子值
- 当下一个状态依赖于之前的状态
- 当需要把状态更新深入传递给子组件时（可以通过 context 传递 dispatch）

### useCallback

`useCallback`返回一个记忆化的回调函数，只有当依赖项改变时才会更新。

```jsx
import React, { useState, useCallback } from "react";

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(false);

  // 只有当count变化时，handleClick才会更新
  const handleClick = useCallback(() => {
    console.log("Button clicked, count:", count);
  }, [count]);

  return (
    <>
      <Button onClick={handleClick}>Click me</Button>
      <button onClick={() => setOtherState(!otherState)}>
        Toggle other state
      </button>
    </>
  );
}

// 使用React.memo优化子组件
const Button = React.memo(({ onClick, children }) => {
  console.log("Button rendered");
  return <button onClick={onClick}>{children}</button>;
});
```

**使用场景：**

- 传递回调给使用了引用相等性避免不必要渲染的子组件
- 作为其他 Hook 的依赖项，避免不必要的 effect 执行

### useMemo

`useMemo`返回一个记忆化的值，只有当依赖项改变时才重新计算。

```jsx
import React, { useState, useMemo } from "react";

function ExpensiveCalculation({ a, b }) {
  const [otherState, setOtherState] = useState(false);

  // 只有当a或b变化时才重新计算
  const result = useMemo(() => {
    console.log("Computing result...");
    return computeExpensiveValue(a, b);
  }, [a, b]);

  return (
    <>
      <div>Result: {result}</div>
      <button onClick={() => setOtherState(!otherState)}>
        Toggle other state
      </button>
    </>
  );
}
```

**使用场景：**

- 避免昂贵的计算
- 避免对象引用变化导致的不必要渲染
- 作为其他 hook 的依赖，避免不必要的 effect 执行

**useCallback 和 useMemo 的区别：**

- useCallback 记忆化回调函数本身，返回函数的引用
- useMemo 记忆化函数的执行结果，返回值

### useRef

`useRef`返回一个可变的 ref 对象，其`.current`属性被初始化为传入的参数。

```jsx
import React, { useRef, useEffect } from "react";

function TextInputWithFocusButton() {
  // 创建ref
  const inputRef = useRef(null);

  // 点击按钮时聚焦输入框
  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>聚焦输入框</button>
    </>
  );
}
```

**useRef 的特点：**

- `.current`属性变更不会引发组件重新渲染
- 可以存储任何可变值，类似于类的实例属性
- 对 DOM 的引用会在 DOM 更新后设置，在 effect 之前

**使用场景：**

1. **访问 DOM 节点或 React 元素**
2. **保存不需要触发重新渲染的可变值**

```jsx
function Timer() {
  const [count, setCount] = useState(0);

  // 使用ref存储interval ID
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((c) => c + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  // 清除interval
  const handleStopClick = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <>
      <div>Timer: {count}</div>
      <button onClick={handleStopClick}>Stop</button>
    </>
  );
}
```

### useImperativeHandle

`useImperativeHandle`用于自定义暴露给父组件的实例值，配合`forwardRef`使用。

```jsx
import React, { useRef, useImperativeHandle, forwardRef } from "react";

// 子组件，使用forwardRef接收ref
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  // 自定义暴露给父组件的实例值
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    // 只暴露我们想要的方法
    blur: () => {
      inputRef.current.blur();
    },
  }));

  return <input ref={inputRef} />;
});

// 父组件
function ParentComponent() {
  const fancyInputRef = useRef();

  const handleClick = () => {
    fancyInputRef.current.focus();
    // 可以调用focus，但不能直接访问DOM元素
  };

  return (
    <>
      <FancyInput ref={fancyInputRef} />
      <button onClick={handleClick}>Focus input</button>
    </>
  );
}
```

**使用场景：**

- 需要精确控制暴露给父组件的实例值
- 想要隐藏子组件内部实现细节

### useLayoutEffect

`useLayoutEffect`与`useEffect`功能相似，但在 DOM 变更后同步触发，阻塞视觉更新。

```jsx
import React, { useState, useLayoutEffect, useRef } from "react";

function Tooltip() {
  const [tooltipHeight, setTooltipHeight] = useState(0);
  const tooltipRef = useRef();

  useLayoutEffect(() => {
    // 在DOM更新后同步测量
    const height = tooltipRef.current.getBoundingClientRect().height;
    setTooltipHeight(height);
    // 此处的状态更新会在浏览器绘制前处理
  }, []); // 空依赖数组表示仅在挂载时运行

  return (
    <div>
      <div
        ref={tooltipRef}
        style={{ position: "absolute", top: -tooltipHeight }}
      >
        Tooltip content
      </div>
      <button>Hover me</button>
    </div>
  );
}
```

**useEffect vs useLayoutEffect：**

- `useEffect`在浏览器绘制后异步执行
- `useLayoutEffect`在 DOM 变更后，浏览器绘制前同步执行
- 大多数情况下应使用`useEffect`，除非需要 DOM 测量或操作立即反映在视觉上

### useDebugValue

`useDebugValue`用于在 React DevTools 中显示自定义 hook 的标签。

```jsx
import { useState, useEffect, useDebugValue } from "react";

// 自定义hook
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    // ...实际逻辑
  }, [friendID]);

  // 在DevTools中显示此hook的标签
  useDebugValue(isOnline ? "Online" : "Offline");

  return isOnline;
}
```

### React 18 新增 Hooks

#### useDeferredValue

`useDeferredValue`允许你延迟更新 UI 的某些部分，类似于防抖但由 React 控制。

```jsx
import React, { useState, useDeferredValue } from "react";

function SearchResults({ query }) {
  // 创建一个延迟版本的query
  const deferredQuery = useDeferredValue(query);

  // 搜索结果使用延迟值，不会阻塞用户输入
  const results = useMemo(() => {
    return computeExpensiveSearchResults(deferredQuery);
  }, [deferredQuery]);

  return (
    <div>
      {results.map((result) => (
        <div key={result.id}>{result.name}</div>
      ))}
    </div>
  );
}
```

#### useTransition

`useTransition`允许你将某些状态更新标记为非紧急，可被中断，从而保持 UI 的响应性。

```jsx
import React, { useState, useTransition } from "react";

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState("home");

  function selectTab(nextTab) {
    // 将状态更新标记为过渡
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    <>
      {
        // 显示加载指示器
        isPending && <Spinner />
      }

      <TabButton isActive={tab === "home"} onClick={() => selectTab("home")}>
        Home
      </TabButton>
      <TabButton isActive={tab === "about"} onClick={() => selectTab("about")}>
        About
      </TabButton>

      <div>
        {tab === "home" && <HomeTab />}
        {tab === "about" && <AboutTab />}
      </div>
    </>
  );
}
```

#### useSyncExternalStore

`useSyncExternalStore`用于订阅外部数据源，确保在并发渲染中也能一致地读取外部数据。

```jsx
import { useSyncExternalStore } from "react";

// 使用Redux存储作为示例
function TodosApp() {
  const todos = useSyncExternalStore(
    // 订阅函数
    (onStoreChange) => {
      const unsubscribe = store.subscribe(onStoreChange);
      return unsubscribe;
    },
    // 获取当前状态
    () => store.getState().todos,
    // 获取服务器端状态（可选，用于SSR）
    () => initialState.todos
  );

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

#### useId

`useId`是一个用于生成唯一 ID 的 hook，适用于需要唯一标识符的组件，特别是在 SSR 场景下。

```jsx
import React, { useId } from "react";

function NameField() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>Name:</label>
      <input id={id} type="text" />
    </div>
  );
}
```

## 自定义 Hook

自定义 Hook 是一种将组件逻辑提取到可重用函数中的方式。自定义 Hook 是一个以"use"开头的 JavaScript 函数，可以调用其他 Hook。

```jsx
import { useState, useEffect } from "react";

// 自定义Hook用于获取窗口尺寸
function useWindowSize() {
  // 状态用于存储窗口尺寸
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // 处理窗口大小变化的函数
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // 初始化调用一次
    handleResize();

    // 添加事件监听器
    window.addEventListener("resize", handleResize);

    // 清理函数
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 空依赖数组表示仅在挂载和卸载时执行

  return windowSize;
}

// 使用自定义Hook
function WindowSizeDisplay() {
  const windowSize = useWindowSize();

  return (
    <div>
      Window width: {windowSize.width}px
      <br />
      Window height: {windowSize.height}px
    </div>
  );
}
```

**更多实用自定义 Hook 示例：**

1. **useLocalStorage** - 在 localStorage 中持久化状态

```jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
```

2. **useFetch** - 处理数据获取和加载状态

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(url, { signal });
        const result = await response.json();

        if (!signal.aborted) {
          setData(result);
          setError(null);
        }
      } catch (error) {
        if (!signal.aborted) {
          setError(error);
          setData(null);
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [url]);

  return { data, loading, error };
}
```

3. **useOnClickOutside** - 检测点击元素外部

```jsx
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// 使用示例
function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useOnClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Menu</button>

      {isOpen && (
        <div className="menu" ref={menuRef}>
          <a href="#">Item 1</a>
          <a href="#">Item 2</a>
        </div>
      )}
    </div>
  );
}
```

## Hook 的使用规则

使用 Hook 时必须遵循两个规则：

1. **只在最顶层使用 Hook**
   - 不要在循环、条件或嵌套函数中调用 Hook
   - 确保 Hook 在每次渲染时都以相同的顺序被调用

```jsx
// 错误示例：条件中使用Hook
if (condition) {
  useEffect(() => {
    // ...
  });
}

// 正确示例
useEffect(() => {
  if (condition) {
    // ...
  }
}, [condition]);
```

2. **只在 React 函数中调用 Hook**
   - 只在函数组件中调用 Hook
   - 只在自定义 Hook 中调用其他 Hook

## ESLint 插件

React 提供了一个 ESLint 插件 `eslint-plugin-react-hooks`，可以帮助你强制执行 Hook 的规则:

```bash
npm install eslint-plugin-react-hooks --save-dev
```

然后在你的 ESLint 配置中添加:

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error", // 检查Hook规则
    "react-hooks/exhaustive-deps": "warn" // 检查effect依赖
  }
}
```

## 从类组件迁移到 Hook

### 生命周期方法迁移

| 类组件                                         | Hooks                                     |
| ---------------------------------------------- | ----------------------------------------- |
| `constructor`                                  | `useState`, `useRef`                      |
| `componentDidMount`                            | `useEffect(() => {}, [])`                 |
| `componentDidUpdate`                           | `useEffect(() => {}, [dependencies])`     |
| `componentWillUnmount`                         | `useEffect(() => { return () => {}}, [])` |
| `shouldComponentUpdate`                        | `React.memo`, 有条件地使用状态和 effect   |
| `getDerivedStateFromProps`                     | 在渲染期间直接更新 state                  |
| `getSnapshotBeforeUpdate`, `componentDidCatch` | 目前尚无 Hook 等效项，仍需使用类          |

### 迁移示例：

**从类组件：**

```jsx
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      width: window.innerWidth,
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    return (
      <div>
        <p>Window width: {this.state.width}</p>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

**迁移为函数组件：**

```jsx
function Example() {
  const [count, setCount] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);

  // 处理title更新，替代componentDidMount和componentDidUpdate
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]); // 仅在count变化时执行

  // 处理窗口大小变化，替代componentDidMount和componentWillUnmount
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // 仅在组件挂载和卸载时执行

  return (
    <div>
      <p>Window width: {width}</p>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## Hook 常见陷阱与解决方案

### 1. 依赖数组不完整

**问题**：忘记在依赖数组中包含所有 effect 中使用的值。

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  // 错误：query是依赖但未列出
  useEffect(() => {
    fetchResults(query).then((data) => {
      setResults(data);
    });
  }, []); // 缺少query依赖

  // ...
}
```

**解决方案**：添加所有依赖或使用 ESLint 插件。

```jsx
// 正确：query作为依赖
useEffect(() => {
  fetchResults(query).then((data) => {
    setResults(data);
  });
}, [query]);
```

### 2. 过度依赖导致无限循环

**问题**：在 effect 中创建的对象/函数被用作其他 effect 的依赖。

```jsx
function ChatRoom({ roomId }) {
  // 每次渲染都创建新的options对象
  const options = {
    roomId,
    maxMessages: 100,
  };

  // 因为options每次渲染都变化，这个effect会无限循环
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // options每次都是新引用
}
```

**解决方案**：将对象/函数移入 effect 或使用 useMemo/useCallback 记忆化。

```jsx
function ChatRoom({ roomId }) {
  // 解决方案1：将对象创建移入effect
  useEffect(() => {
    const options = {
      roomId,
      maxMessages: 100,
    };

    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // 只依赖原始值

  // 解决方案2：使用useMemo
  const options = useMemo(() => {
    return {
      roomId,
      maxMessages: 100,
    };
  }, [roomId]); // 只有roomId变化时options才会改变

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);
}
```

### 3. useState 的函数更新形式

**问题**：直接使用当前 state 进行更新可能导致竞态问题。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // 问题：如果快速连续点击，可能无法正确递增
  function handleClick() {
    setCount(count + 1); // 依赖于上一次渲染中的count
  }

  // ...
}
```

**解决方案**：使用函数式更新。

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // 解决方案：使用函数式更新
  function handleClick() {
    setCount((prevCount) => prevCount + 1); // 不依赖于上一次渲染中的值
  }

  // ...
}
```

### 4. useEffect 中的数据获取

**问题**：在 useEffect 中获取数据但没有处理竞态条件。

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 没有处理竞态条件
    fetchUser(userId).then((data) => {
      setUser(data); // 可能设置旧的请求结果
    });
  }, [userId]);

  // ...
}
```

**解决方案**：使用 cleanup 函数或 AbortController 取消过时的请求。

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchUser(userId).then((data) => {
      if (isMounted) {
        setUser(data); // 只在组件仍然挂载时更新
      }
    });

    return () => {
      isMounted = false; // 清理函数设置标记
    };
  }, [userId]);

  // 或者使用 AbortController (更现代的方式)
  useEffect(() => {
    const abortController = new AbortController();

    async function fetchData() {
      try {
        const data = await fetchUser(userId, {
          signal: abortController.signal,
        });
        setUser(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          // 处理实际错误，忽略中止错误
        }
      }
    }

    fetchData();

    return () => {
      abortController.abort(); // 取消请求
    };
  }, [userId]);
}
```

## 性能优化

### 1. 使用记忆化避免昂贵的重新计算

```jsx
// 使用useMemo记忆化昂贵的计算
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// 使用useCallback记忆化回调函数
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 2. 避免不必要的状态更新

```jsx
// 检查值是否真的改变
const handleChange = (newValue) => {
  if (value !== newValue) {
    setValue(newValue);
  }
};
```

### 3. 使用 React.memo 避免不必要的组件重新渲染

```jsx
const MemoizedComponent = React.memo(function MyComponent(props) {
  // 只有当props改变时才会重新渲染
});

// 自定义比较函数
const areEqual = (prevProps, nextProps) => {
  return prevProps.value === nextProps.value;
};

const MemoizedWithCustomCompare = React.memo(MyComponent, areEqual);
```

## 总结

React Hooks 彻底改变了 React 组件的编写方式，使函数组件具有了类组件的所有功能，同时提供了更简洁、可复用的代码组织方式。掌握 Hooks 不仅是应对面试的必备技能，也是成为高效 React 开发者的关键。

记住以下要点：

1. Hook 必须在最顶层调用，不能在条件语句、循环或嵌套函数中调用
2. 只能在 React 函数组件或自定义 Hook 中调用 Hook
3. 依赖数组应包含 effect 中使用的所有变量
4. 自定义 Hook 是复用状态逻辑的最佳方式
5. 性能优化应在需要时应用，过早优化可能导致代码复杂度增加

通过合理使用 React Hooks，你可以编写更简洁、可维护、高性能的 React 应用。

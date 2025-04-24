---
sidebar_position: 2
---

# React 基础知识

React 是一个用于构建用户界面的 JavaScript 库，由 Facebook（现 Meta）开发和维护。自 2013 年开源以来，React 已经成为前端开发中最受欢迎的库之一。以下是 React 的核心概念和基础知识，掌握这些对面试非常重要。

## React 的核心理念

### 声明式编程

React 采用声明式编程范式，让你描述 UI 应该是什么样子，而不是命令式地指定如何去实现。你只需声明你想要的结果，React 负责实现过程。

```jsx
// 声明式
const element = <h1>Hello, world!</h1>;

// 命令式(不使用React的方式)
const element = document.createElement("h1");
element.innerText = "Hello, world!";
document.body.appendChild(element);
```

### 组件化

React 应用由组件构建而成。组件是可重用、独立且封装的代码单元，它们接收输入（props）并返回 React 元素。

```jsx
// 函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 类组件
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 单向数据流

React 的数据流是单向的，从父组件向下流向子组件。这种单向数据流使得应用更加可预测，更易于调试。

### 虚拟 DOM

React 使用虚拟 DOM 来优化性能。虚拟 DOM 是内存中对实际 DOM 的一种轻量级表示。当组件状态变化时，React 先更新虚拟 DOM，然后比较（diff）虚拟 DOM 与实际 DOM 的差异，最后只更新实际变化的部分，减少重绘和重排，提高性能。

## JSX 语法

JSX 是 JavaScript 的语法扩展，让你可以在 JavaScript 中编写类似 HTML 的代码。

```jsx
const element = <h1>Hello, {name}</h1>;
```

在底层，JSX 会被 Babel 编译为 React.createElement()调用：

```js
const element = React.createElement("h1", null, "Hello, ", name);
```

### JSX 的特点：

1. **大括号内可以嵌入任意 JavaScript 表达式**

   ```jsx
   const element = <h1>Hello, {formatName(user)}</h1>;
   ```

2. **JSX 本身也是表达式**

   ```jsx
   const element = isLoggedIn ? <UserGreeting /> : <GuestGreeting />;
   ```

3. **使用花括号包裹 css 属性**

   ```jsx
   const divStyle = {
     color: "blue",
     backgroundColor: "lightgrey",
   };
   const element = <div style={divStyle}>Hello World!</div>;
   ```

4. **防止 XSS 攻击**
   JSX 会自动转义嵌入的值，防止 XSS 注入攻击。

## Props 与 State

### Props

Props（属性）是组件的输入，它们是从父组件传递给子组件的只读数据。

```jsx
// 父组件
function App() {
  return <Welcome name="Sara" />;
}

// 子组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

**Props 的特点：**

- 只读，不能修改
- 可以传递任何 JavaScript 值，包括函数和 JSX
- 可以使用属性展开运算符

```jsx
const props = { firstName: "Ben", lastName: "Hector" };
return <Greeting {...props} />;
```

### State

State 是组件的内部状态，由组件自己管理。当 state 变化时，React 会重新渲染组件。

在函数组件中使用 useState 钩子：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

在类组件中使用 this.state：

```jsx
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

**State 的特点：**

- 不要直接修改 State，应使用 setState()或 useState 返回的 setter 函数
- State 更新可能是异步的
- State 更新会被合并（类组件）
- 数据流向下（单向数据流）

## 生命周期方法（类组件）

React 组件有以下生命周期阶段：

### 挂载阶段

- **constructor()** - 初始化 state、绑定方法等
- **static getDerivedStateFromProps()** - 在 render 前调用，返回对象更新 state
- **render()** - 渲染组件
- **componentDidMount()** - 组件挂载后执行，适合进行网络请求、添加订阅等

### 更新阶段

- **static getDerivedStateFromProps()**
- **shouldComponentUpdate()** - 决定是否重新渲染，用于优化
- **render()**
- **getSnapshotBeforeUpdate()** - 在更新前捕获一些信息
- **componentDidUpdate()** - 组件更新后执行

### 卸载阶段

- **componentWillUnmount()** - 组件卸载前执行，清理订阅、定时器等

### 错误处理

- **static getDerivedStateFromError()**
- **componentDidCatch()**

## 组件通信方式

1. **父子组件通信**：

   - 父传子：通过 props
   - 子传父：通过回调函数

2. **兄弟组件通信**：

   - 通过共同的父组件
   - 使用状态管理库（如 Redux、Context API）

3. **跨多层级组件通信**：
   - Context API
   - 状态管理库

## React 中的事件处理

React 事件使用驼峰命名，并传递函数而不是字符串：

```jsx
<button onClick={handleClick}>Click me</button>
```

在类组件中绑定 this：

```jsx
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };
    // 绑定this
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState((state) => ({
      isToggleOn: !state.isToggleOn,
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? "ON" : "OFF"}
      </button>
    );
  }
}
```

在函数组件中则不需要考虑 this 问题：

```jsx
function Toggle() {
  const [isToggleOn, setIsToggleOn] = useState(true);

  function handleClick() {
    setIsToggleOn(!isToggleOn);
  }

  return <button onClick={handleClick}>{isToggleOn ? "ON" : "OFF"}</button>;
}
```

## 条件渲染

```jsx
function Greeting({ isLoggedIn }) {
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

// 或使用三元运算符
function Greeting({ isLoggedIn }) {
  return <>{isLoggedIn ? <UserGreeting /> : <GuestGreeting />}</>;
}

// 或使用逻辑与运算符
function Mailbox({ unreadMessages }) {
  return (
    <div>
      <h1>Hello!</h1>
      {unreadMessages.length > 0 && (
        <h2>You have {unreadMessages.length} unread messages.</h2>
      )}
    </div>
  );
}
```

## 列表渲染

使用 map()方法渲染列表时，记得添加 key 属性：

```jsx
function NumberList({ numbers }) {
  return (
    <ul>
      {numbers.map((number) => (
        <li key={number.toString()}>{number}</li>
      ))}
    </ul>
  );
}
```

**关于 key**：

- key 帮助 React 识别哪些元素发生了变化
- key 在兄弟节点间必须唯一
- 尽量使用稳定的 ID 作为 key，而不是索引（可能导致性能问题和组件状态错误）

## 表单处理

React 中有两种表单输入组件：

1. **受控组件**：表单数据由 React 组件控制

```jsx
function NameForm() {
  const [value, setValue] = useState("");

  function handleChange(event) {
    setValue(event.target.value);
  }

  function handleSubmit(event) {
    alert("A name was submitted: " + value);
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={value} onChange={handleChange} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

2. **非受控组件**：表单数据由 DOM 本身处理

```jsx
function FileInput() {
  const fileInput = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    alert(`Selected file - ${fileInput.current.files[0].name}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Upload file:
        <input type="file" ref={fileInput} />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## React.Fragment

Fragment 允许你将子列表分组，而无需向 DOM 添加额外节点：

```jsx
function Table() {
  return (
    <table>
      <tbody>
        <tr>
          <Columns />
        </tr>
      </tbody>
    </table>
  );
}

function Columns() {
  return (
    <React.Fragment>
      <td>Hello</td>
      <td>World</td>
    </React.Fragment>
  );
}

// 简写语法
function Columns() {
  return (
    <>
      <td>Hello</td>
      <td>World</td>
    </>
  );
}
```

## 高阶组件（HOC）

高阶组件是一个函数，接受一个组件并返回一个新组件。它是复用组件逻辑的一种高级技巧。

```jsx
function withSubscription(WrappedComponent, selectData) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: selectData(DataSource, props),
      };
    }

    // 生命周期方法

    render() {
      // 通过props传递所有属性和注入的数据
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}

// 使用
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);
```

## 严格模式

StrictMode 是一个用来突出显示应用程序中潜在问题的工具。它不渲染任何可见的 UI，只为其后代元素触发额外的检查和警告。

```jsx
<React.StrictMode>
  <App />
</React.StrictMode>
```

严格模式检查：

- 识别不安全的生命周期方法
- 关于使用过时 API 的警告
- 检测意外的副作用
- 确保可重用的状态

## React 中的代码分割

代码分割可以帮助"懒加载"当前用户所需的内容，能够显著提高应用性能。

```jsx
// 动态导入
import React, { Suspense } from "react";

const OtherComponent = React.lazy(() => import("./OtherComponent"));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```

## React 中的错误边界

错误边界是 React 组件，它可以捕获并打印发生在其子组件树任何位置的 JavaScript 错误，并且会渲染出备用 UI：

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新状态，下次渲染将显示备用UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 自定义备用UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// 使用
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>;
```

## 总结

掌握这些 React 基础知识对于面试和实际开发都非常重要。在面试中，这些概念往往是考官最关心的部分，也是真实项目开发中最常用到的知识点。深入理解这些概念，对你的面试和工作都将大有裨益。

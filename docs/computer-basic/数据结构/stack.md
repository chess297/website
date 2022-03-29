---
title: Stack栈结构
---

## Stack栈结构

### 特性

- 后进先出

```typescript
interface Stack<T>{
    push:(val:T)=>void;
    pop:()=>T;
}
```

### 常见算法

#### 有效的括号

```typescript
function isValid(str) {
    const stack = []
    for (let i = 0; i <str.length; i++) {
        const c = s[i]
        if(c === '(' || c ==='{' || c==='['){
            stack.push(c)
        }else{
            const top = stack[stack.length-1]
            if((t === '(' && c === ')')||t === '{' && c === '}'||t === '[' && c === ']' ){
                stack.pop()
            }else{
                return false
            }
        }
    }
    return true
}
```

#### 函数调用堆栈

```typescript

```

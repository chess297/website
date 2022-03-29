---
title: 树(Tree)
tags: [数据结构,树]
---

## 常见算法

- 深度(dfs)/广度(bfs)优先遍历
- 先(preorder)中(inorder)后(postorder)序遍历

```typescript
// 深度优先遍历
const dfs = (root)=>{
    console.log(root.val)
    root.children.forEach(dfs)
}
```

```typescript
// 广度优先遍历
const bfs = (root)=>{
    const queue = [root]
    while (queue.length>0){
        const r = queue.shift()
        console.log(r.val)
        r.children.forEach(queue.push)
    }
}
```

```typescript
// 先序遍历
const preorder = (root)=>{ // 递归版
    if(!root)return
    console.log(root.val)
    preorder(root.left)
    preorder(root.right)
}
const preorder = (root)=>{ // 非递归版
    const stack = [root]
    while (stack.length>0){
        const top = stack.pop()
        console.log(top.val)
        if(top.right)stack.push(top.right)
        if(top.left)stack.push(top.left)
    }
}
```

```typescript
// 中序遍历
const inorder = (root)=>{
    if(!root)return
    inorder(root.left)
    console.log(root.val)
    inorder(root.right)
}
```

```typescript
// 后序遍历
const postorder = (root)=>{
    if(!root)return
    postorder(root.left)
    postorder(root.right)
    console.log(root.val)
}
```

### 常见算法

#### 二叉树的最大深度

#### 二叉树的最小深度

#### 二叉树的层序遍历

#### 二叉树的中序遍历

#### 路径总和

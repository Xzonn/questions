---
title: React Hooks 的工作原理是什么？
category: React
date: 2025-07-08 11:31
difficulty: 困难
excerpt: 解释 React Hooks 的内部机制，包括链表结构和闭包的使用。
tags:
- Hooks
- Fiber架构
- Fiber
---
React Hooks 的原理是基于链表结构和闭包机制，在 Fiber 架构下高效管理函数组件的状态与生命周期。核心要点包括以下方面：

### 🔒 原理的核心机制
1. **链表结构（Linked List）**  
   React 内部使用单向链表来记录和关联组件的 Hook 状态。每个函数组件对应一个 Fiber 节点，其 `memoizedState` 属性存储一个单向链表。每个链节点代表一个 Hook（如 `useState` 或 `useEffect`），确保组件多次渲染时状态能够正确追溯：
   - 首次渲染时，React 初始化 Hook 对象并将其加入链表。
   - 后续渲染时，React 按固定顺序遍历链表以匹配状态与对应 Hook。

2. **闭包保存上下文**  
   Hooks 利用 JavaScript 闭包特性保存函数组件的当前状态（如 `state` 变量）和回调（如 `setState` 函数）。具体表现为：
   - 闭包内部封闭当前作用域，确保重复调用 Hook 时能访问最新状态。
   - 如 `useState` 依赖闭包缓存 `state` 值，触发重新渲染时不丢失上下文。

3. **严格的调用顺序规则**  
   Hooks 必须始终保持同一调用顺序（如每次渲染时必须按 `useState`、`useEffect` 等顺序排列），因为 React 通过顺序位置标识链表中的状态。以下行为会破坏顺序一致性：
   - 在条件语句或循环中调用 Hooks（禁用操作如 `if (condition) { useState() }`）；
   - 普通函数顶层调用要求确保顺序稳定。

4. **副作用处理与 Fiber 架构整合**  
   React 在 Fiber 节点生命周期中同步管理 Hooks：
   - 组件挂载时，为首次 Hook 调用创建关联节点。
   - 更新时依赖调用索引定位状态变更。
   - 副作用（如 `useEffect`）根据依赖项数组（`dependencies`）触发回调后置执行。

### ⚙️ 简化实现示例
以下代码片段模拟 `useState` 的核心实现逻辑，演示链表与闭包运作模式：

```javascript
// === Hook 对象定义 === 
const FiberNode = { 
  memoizedState: null // 链表头 
};

function createHookNode(value, next = null) { 
  return { value, next }; // 简化链表节点结构 
}

function useState(initialState) {
  // 1. 保存状态值到闭包内环境
  const context = FiberNode; 
  let stateNode = context.memoizedState;
  
  // 2. 若不存在则创建新状态节点
  if (!stateNode) { 
    stateNode = createHookNode(initialState);
    context.memoizedState = stateNode;
  }

  // 3. 获取当前值并绑定更新函数
  const value = stateNode.value;
  const setValue = (newValue) => { 
    stateNode.value = newValue; // 更新闭包中的值 
    console.log("Re-render triggered by setValue"); 
  };
  
  return [value, setValue]; // 对外暴露值引用和更动逻辑 
}

// === 组件使用场景伪用 === 
function MyComponent() { 
  // useHooks 统一格式固定位置调用：
  const [a, setA] = useState(1); 
  const [b, setB] = useState('test'); 
  
  return ...; 
} 
```

该示例显示关键实现约束：

- 新状态对象追加至列表尾后；
- 连续依次访问顺序规则。

通过结合链表、闭包和全局作用标识, 使函数组件能安全重用状态上下文完整替代了原来 Class 实现方式需要大量 boilerplate 内容（如实例构造和生命周期挂钩方法冗余操作）。

### 🧩 规则与依赖关系
- **规则要求**  
   - 仅在函数组件的顶级调用 Hooks；  
   - 避免修改调用数量或层次位置。
- **依赖项控制效果延迟执行** (如使用 useEffect) :
   - 不传依赖 `[]`： 首次渲染和每次更新之后触发    
   - 空数组 `[]` : 仅第一次挂载完毕时刻执行       
   - 变量数组 `[a, b]`: 值变更新后才去启动操作链.
这三点实现了从逻辑重用设计出发使开发过程更符合无副作用导向思路。

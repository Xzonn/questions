---
title: 如何实现一个无限累加的 sum 函数？
category: JavaScript
date: 2025-07-07 12:12
difficulty: 中等
excerpt: 使用闭包和链式调用来实现无限累加功能。
tags:
- 闭包
- 函数
- 高级技巧
---
实现一个无限累加的 `sum` 函数需利用闭包存储累加值，并通过返回新函数支持链式调用，最终通过 `valueOf` 或调用转换方法返回结果。核心步骤如下：

1. **定义基础函数**：  
   - 初始函数接收部分参数并保存在闭包中。
   - 返回一个新函数，该函数可继续接收参数并更新闭包内的累加数组。

2. **实现链式调用**：  
   - 新函数返回自身，支持连续调用（如 `sum(1)(2)(3)`）。

3. **处理结果计算**：  
   - 重写返回函数的 `valueOf` 方法，调用时对累加数组求和。
   - 或通过 `toString`/隐式转换触发计算。

**代码实现**（JavaScript）：  
```javascript
function sum(...args) {
  const accumulated = [...args]; // 闭包存储累加值
  
  function adder(...newArgs) {
    accumulated.push(...newArgs); // 更新累加数组
    return adder; // 支持链式调用
  }

  adder.valueOf = function() {
    return accumulated.reduce((acc, val) => acc + val, 0); // 累加结果
  };

  return adder;
}
```

**应用示例**：
```javascript
console.log(sum(2, 3)(2).valueOf()); // 输出：7（2 + 3 + 2）
console.log(sum(1)(2)(3)(4).valueOf()); // 输出：10（1 + 2 + 3 + 4）
```

**注意事项**：  
- `valueOf` 需在链式调用末尾触发计算；  
- 若需多次获取中间结果，可在每次调用后手动执行 `.valueOf()`；  
- 需隐式转换时（如 `console.log(sum(1)(2))`）可能触发 `valueOf`，直接输出数值结果。

**关键特性**：
- 闭包存储累加数据，避免全局污染。
- 通过函数返回实现无限参数扩展。

此模式适用于函数式编程中的参数渐进传递和复杂逻辑组合场景，如分阶段数据输入和动态数学计算。

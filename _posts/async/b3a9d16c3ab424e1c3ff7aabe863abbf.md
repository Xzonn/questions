---
title: 如何实现 Promise.race？
category: 异步编程
date: 2025-07-06
---
Promise.race 是 JavaScript 的 Promise 对象的静态方法，用于接收一组 Promise 实例，当输入对象中的任何一员率先完成或拒绝时，立即进入相应状态，以其结果返回一个新 Promise。实现基于以下原则结合源码，需在语言支持的环境中扩展定义；其核心理念是利用每个 Promise 对象的状态机机制快速响应。具体步骤如下：

1. **方法定义**：覆盖 Promise.race 方法，输入可迭代 Promise 集合：
   - 确保传入参数为数组类型，如非则抛出类型错误。
   - 返回一个包装型 Promise 实例。

2. **状态处理机制**：
   - 新建 Promise 对象后遍历输入数组：若元素是 Promise，则调用其 then/reject 将新 Promise 的解析/拒绝功能注入；若元素非 Promise，视为同步解析值。
   - 任一输入元素完成时触发回调，将结果传给最终 promise，忽略后续对象变化。

代码实现示例参考源码兼容写法：
```javascript
Promise.race = function(promises) {
    // 输入安全校验：
    if (!Array.isArray(promises)) {
        throw new TypeError('Argument must be an array of promises');
    }
    return new Promise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            Promise.resolve(promises[i])   // 标准化处理非 Promise 类型
                .then(val => resolve(val)) // 任一 promise 解析即通知
                .catch(err => reject(err)); // 同样处理潜在错误
        }
    });
};
```

使用场景举例：中定时器场景：
```javascript
const p1 = new Promise(resolve => setTimeout(resolve, 3000, '3s'));
const p2 = new Promise((_, reject) => setTimeout(() => reject('failed'), 2000));
Promise.race([p1, p2]).then(console.log, console.error); 
//输出 'failed' 因p2快失败
```
需注意该方法用于竞争模式如请求限时、性能优先，使用中若遇无效 Promise，自动按同步值处理。

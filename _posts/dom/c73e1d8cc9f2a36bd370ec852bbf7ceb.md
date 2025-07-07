---
title: 如何找到当前页面出现次数最多的HTML标签？
category: DOM操作
date: 2025-07-07
---
要统计当前页面中某个 HTML 标签的出现频率并找出最大值，可以通过在浏览器控制台中运行 JavaScript 代码实现，需结合 DOM 操作完成。该方法如下：

1.  **获取所有元素标签名**：
    -   使用 `document.querySelectorAll('*')` 选择页面中的所有元素节点。
    -   转换为数组并使用 `map` 提取标签名称：`[...document.querySelectorAll('*')].map(v => v.tagName)`。

2.  **计数标签出现次数**：
    -   使用 `Array.reduce()` 累计各标签出现次数：
    ```javascript
    [...document.querySelectorAll('*')]
        .map(v => v.tagName)
        .reduce((acc, tag) => {
            acc[tag] = (acc[tag] || 0) + 1;
            return acc;
        }, {})
    ```
    如参考所描述，`reduce` 会将标签累计为一个对象形如 `{ 'DIV': 102, 'SPAN': 25, ... }`。

3.  **确定出现次数最高的标签**：
    -   将累计对象转为键值对数组：`Object.entries(acc)`。
    -   用 `sort()` 按计数值降序排序：`.sort((a, b) => b - a)`。
    -   获取结果数组中的首项 (最多出现的标签)。

**完整代码示例**：
在控制台粘贴并执行：
```javascript
const tagCounts = Object.entries([...document.querySelectorAll('*')]
    .map(v => v.tagName)
    .reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {})
).sort((a, b) => b - a);

console.log(`出现次数最多的标签：${tagCounts}, 出现次数：${tagCounts}`);
```
此代码返回频率最高的标签及其次数；若要取多个标签，可修改 `slice(0, n)`。需确保代码在浏览器运行时无渲染阻塞。

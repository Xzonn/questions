---
title: 如何将一维数组转换为二维数组？
category: JavaScript
date: 2025-07-09 12:29:03
difficulty: 简单
excerpt: 探讨了多种方法，包括使用 for 循环、reduce、while 循环和 Array.from，实现了一维数组到二维数组的转换。
tags:
- 数组操作
- 数组
- 算法
---
在 JavaScript 中，将一维数组转为二维数组可以通过多种方法实现，以下是几种常见方式：

### 1. 使用 for 循环（基础方法）

通过循环每次截取固定长度的子数组：
```javascript
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const arr = [1, 2, 3, 4, 5, 6];
console.log(chunkArray(arr, 2)); 
// 输出: [[1, 2], [3, 4], [5, 6]]
```

### 2. 使用 reduce 方法（函数式编程）

通过累积器逐步构建二维数组：
```javascript
function chunkArray(array, size) {
  return array.reduce((acc, _, index) => {
    if (index % size === 0) {
      acc.push(array.slice(index, index + size));
    }
    return acc;
  }, []);
}

const arr = ['a', 'b', 'c', 'd'];
console.log(chunkArray(arr, 3)); 
// 输出: [['a', 'b', 'c'], ['d']]
```

### 3. 使用 while 循环和 splice

通过修改原数组动态截取：
```javascript
function chunkArray(array, size) {
  const result = [];
  while (array.length > 0) {
    result.push(array.splice(0, size));
  }
  return result;
}

const arr = [10, 20, 30, 40, 50];
console.log(chunkArray([...arr], 3)); 
// 输出: [[10, 20, 30], [40, 50]]
```

### 4. 使用 Array.from（ES6）

利用数组构造函数和映射函数：
```javascript
const chunkArray = (array, size) => 
  Array.from({ length: Math.ceil(array.length / size) }, (_, index) => 
    array.slice(index * size, index * size + size)
  );

const arr = [true, false, null, undefined];
console.log(chunkArray(arr, 2));
// 输出: [[true, false], [null, undefined]]
```

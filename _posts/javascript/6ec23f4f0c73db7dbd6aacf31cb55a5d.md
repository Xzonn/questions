---
title: 什么是 TypedArray？
category: JavaScript
date: 2025-07-09 12:14:24
difficulty: 中等
excerpt: TypedArray 是 JavaScript 的类数组结构，用于高效处理二进制数据。它依赖于 ArrayBuffer，并通过固定元素类型提供高性能的数据操作。
tags:
- 数据结构
- TypedArray
- ArrayBuffer
---
TypedArray 是 JavaScript 中的一种类数组数据结构，专为高效处理二进制数据而设计。它是一个抽象基类，不能被直接实例化，具体实现由多个子类提供（如 `Int8Array`、`Uint8Array`、`Float32Array` 等）。与传统 JavaScript Array 不同，TypedArray 直接操作底层二进制数据缓冲区 `ArrayBuffer`，在性能密集型应用（如图像处理、音频编码和数据加密）中有明显优势。

### 核心概念

1. **元素类型固定：**
   - 每个 TypedArray 子类（如 `Uint8Array`）定义元素的特定数据类型（如 8 位无符号整数）。
   - 值范围约束，溢出时自动处理（截断或归一化），例如超出 `Uint8Array` 范围（0-255）的值：
     ```javascript
     let array = new Uint8Array([256, 257, 258]);
     console.log(array); // 输出：[0, 1, 2]
     ```

2. **基于 ArrayBuffer：**
   - TypedArray 依赖于底层二进制缓冲区 `ArrayBuffer` 提供数据。
   - `buffer`、`byteLength` 和 `byteOffset` 是关键属性：
     - `array.buffer`: 访问底层 `ArrayBuffer` 对象。
     - `array.byteLength`: 数组以字节计算的长度（如 `new Uint8Array(4)` 的 `byteLength` 为 4）。
     - `array.byteOffset`: 相对于原始缓冲区的字节偏移位置。

3. **高性能机制：**
   - 使用连续内存，避免数组的动态分配开销，提升数值计算效率（尤其适用于大数据处理）。
   - 实例基于字节级视图共享同一个缓冲区，可多视图转换：
     ```javascript
     let intArray = new Int8Array(5); // 创建一个 8 位有符号整数数组
     let floatView = new Float32Array(intArray.buffer); // 转换视图
     console.log(floatView);
     ```

### 核心子类和类型

- 常见 TypedArray 子类涵盖不同数据类型：
  | 子类                 | 描述                   | 元素位宽 | 数据类型范围           |
  |----------------------|------------------------|---------|------------------------|
  | `Int8Array`          | 8 位有符号整数         | 1 字节  | -128 到 127           |
  | `Uint8Array`         | 8 位无符号整数         | 1 字节  | 0 到 255              |
  | `Uint8ClampedArray`  | 8 位无符号整数（不溢出）| 1 字节  | 值超过边界 clamp       |
  | `Int16Array`         | 16 位有符号整数        | 2 字节  | -32768 到 32767       |
  | `Float32Array`       | 32 位 IEEE 浮点数      | 4 字节  | 近似 ±1.2×10^{-38} 至 ±3.4×10^{38} |
- 创建方式以数字长度、数组或缓冲为依据：
  ```javascript
  // 基于长度
  let array1 = new Int8Array(8);

  // 基于现有数组
  let source = [1, 2, 3];
  let array2 = new Int16Array(source);

  // 基于 ArrayBuffer 视图
  let buffer = new ArrayBuffer(8);
  let array3 = new Float32Array(buffer);
  ```

### 比较普通 JavaScript Array

- **内存和性能差异：** TypedArray 使用连续固定字节缓冲，比灵活的类型动态 Array 更快。
- **类型安全差异：** Array 元素可为任意对象；TypedArray 限于数值类型。
- **行为差异：** TypedArray 的元素插入如超出范围值自动截断，而 Array 无范围约束。

TypedArray 广泛应用于 WebAssembly 交互、Canvas 操作和 Node.js 中，是优化前端和后端性能的底层工具选择。

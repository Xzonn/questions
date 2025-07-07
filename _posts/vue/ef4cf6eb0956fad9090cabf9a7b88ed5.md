---
title: Vue 中的 v-show 和 v-if 有什么区别？
category: Vue
date: 2025-07-06 21:08
difficulty: 中等
excerpt: 比较分析 Vue 中 v-show 和 v-if 的区别，包括它们的工作原理、性能影响和适用场景。
tags:
- 条件渲染
- 性能优化
- Vue.js
---
在 Vue 中, `v-if` 和 `v-show` 都是用于条件性地控制元素的显示与隐藏的指令, 但它们在工作原理、性能影响以及适用场景上有着本质区别。

1. **渲染方式:**  
   - `v-if`: 是一种 "真正的条件渲染"。它会动态地在 DOM 中创建或移除元素。当条件为 `true` 时, 元素被渲染到 DOM; 条件为 `false` 时, 元素直接从 DOM 中销毁, 同时其内部的事件监听器和子组件也被卸载。  
   - `v-show`: 仅控制 CSS 的 `display` 属性(如设为 `display: none`)来切换元素的可见性, 元素始终存在于 DOM 中, 并不会创建或销毁。

2. **性能影响:**  
   - `v-if` 有较低的初始渲染开销 (当初始条件为 `false` 时, 元素不渲染), 但较高的切换开销 (每次切换时涉及元素的销毁和重建过程, 可能触发生命周期钩子如 `beforeMount` 和 `mounted`)。  
   - `v-show` 则有较高的初始渲染开销 (无论初始条件如何, 元素都会被编译并渲染到 DOM), 但较低的切换开销 (仅通过 CSS 属性修改显示状态)。比较如下:

     ```markdown
     | 指令     | 初始渲染开销 | 切换开销 |
     |---------|------------|--------|
     | `v-if` | 低          | 高     |
     | `v-show`| 高         | 低     |
     ```

3. **适用场景:**  
   - 使用 `v-show` 时适用于频繁切换 (如按钮切换的 UI 效果), 因为它通过简单的 CSS 切换减少渲染性能消耗。例如:
     ``` vue
     <template>
       <div>
         <button @click="showElement = !showElement">Toggle</button>
         <p v-show="showElement">This text toggles with low cost.</p>
       </div>
     </template>
     ```
   - 使用 `v-if` 更适用于条件逻辑复杂或很少变化的场景 (如加载态的全局组件), 避免不必要的初次编译浪费。另外, `v-if` 支持配合 `v-else` 或 `<template>` 标签用于多条件分支, 而 `v-show` 不行。示例如下：
     ``` vue
     <template>
       <div>
         <p v-if="showElement">Shown element</p>
         <p v-else>Alternative content</p>
       </div>
     </template>
     ```
  
总之, 选择 `v-if` 可优化初始渲染性能和内存管理, 选择 `v-show` 可提升动态切换的效率。

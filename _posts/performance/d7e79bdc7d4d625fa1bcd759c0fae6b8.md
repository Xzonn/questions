---
title: 前端内存泄漏的常见场景及排查方法是什么？
category: 性能优化
date: 2025-07-06
---
前端内存泄漏指程序中动态分配的内存因错误未被释放或无法释放，导致内存消耗持续增加，最终引发性能下降、浏览器崩溃或自动刷新。以下是常见场景及排查方法：

### 常见内存泄漏场景
1. **未移除的事件监听器**：DOM 元素绑定事件（如 `addEventListener`）后未解绑即移除元素，导致回调函数及其作用域链持续占用内存。  
   ```javascript
   // 泄漏示例
   const btn = document.getElementById('btn');
   btn.addEventListener('click', () => {}); // 移除前需 btn.removeEventListener('click', handler)
   ```

2. **未清除的定时器或延时器**：`setInterval` 或 `setTimeout` 不手动关闭（`clearInterval` 或 `clearTimeout`）会使回调长期占用内存。

3. **闭包长期持有引用**：闭包捕获的外部变量未被释放，导致相关变量和对象无法被垃圾回收。  
   ```javascript
   // 泄漏示例（data 被闭包持有）
   function init() {
     const data = new Array(1000000).fill('leak');
     return () => console.log(data);
   }
   const hold = init();
   ```

4. **全局变量误用或过度创建**：未声明的变量（如 `a = 10`）或冗余全局对象驻留内存，因全局作用域未销毁而无法释放。

5. **无效的 DOM 引用保留**：JavaScript 中引用了已从文档移除的 DOM 元素，该元素无法被回收。

6. **缓存失控**：未设置过期时间（TTL）或大小上限，内存缓存（如大对象数组）无限增长。

### 排查方法
1. **Chrome DevTools 工具链使用**：  
   - **Heap Snapshot**（内存快照）：抓取堆快照并对比增量快照，筛选引用链查看无法回收的对象（例如，查找“Detached Nodes”）。  
   - **Timeline/Memory 面板**：实时监控内存趋势；若曲线反复上升无回落，即可疑泄漏点。

2. **代码审查关键点**：  
   - 移除事件监听（例如 React 中在 `useEffect` 的返回函数中解绑）。  
   - 清除定时器（在组件卸载或页面切换时执行 `clearInterval`）。  
   - 手动置空引用（如将大对象变量赋值为 `null`）以提高 GC 触发几率。

3. **测试实践**：  
   - 性能测试环境模拟真实负载，结合循环操作（如添加/移除组件）观察内存波动。  
   - 优先排查生命周期变长的对象（如全局变量和闭包闭包变量）。

4. **预防策略**：  
   - 弱引用工具：优先使用 `WeakMap` 存储关键引用以防止缓存意外泄漏。  
   - 生命周期管控：确保应用层面明确销毁（如清除副作用资源）。

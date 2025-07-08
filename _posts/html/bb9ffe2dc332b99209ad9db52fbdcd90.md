---
title: HTML 元素的默认 display 属性是多少？
category: HTML
date: 2025-07-08 11:21:46
difficulty: 简单
excerpt: HTML 元素的默认 display 属性取决于其类型，分为 block、inline 和 list-item 等。
tags:
- CSS
- 布局
---
HTML元素的默认 `display` 属性并不是统一的，取决于元素本身的不同类型；这是由HTML规范和浏览器提供的默认样式表定义的。以下通过常见元素的类别说明默认值：

1. **块级元素（例如 `div`, `p`, `h1` 到 `h6`, `table`）**:
   - 默认值为 `display: block;`。这些元素会独占一行，宽度铺满父容器。
   ```css
   div, p, h1 { display: block; }
   ```

2. **行内元素（例如 `span`, `a`, `em`, `strong`）**:
   - 默认值为 `display: inline;`。这些元素会在同一行内显示，宽度基于内容，高、边距等设置受限。
   ```css
   span, a { display: inline; }
   ```

3. **列表项目和其他特定元素**:
   - 如 `<li>`: 默认值为 `display: list-item;`，创建出带有列表项的显式。
   - 如 `<head>`: 默认值为 `display: none;`，元素及其子元素被隐藏且移除布局空间。
   ```css
   li { display: list-item; }
   head { display: none; }
   ```

4. **元素类型变体**:
   - 所有元素未显式定义时的底层原理在HTML规范文档中概述，浏览器会通过默认用户代理样式表实现该行为。
   - 需要注意区别如 `visibility: hidden;` 的视觉隐藏 (保留空间) 与 `display: none;` 的结构影响。

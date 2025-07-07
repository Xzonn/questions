---
title: position:sticky如何工作？适用于哪些场景？
category: CSS
date: 2025-07-07
---
### 工作方式
`position: sticky`是相对定位（relative）和固定定位（fixed）的结合体，工作机制分两种状态：
1.  **相对定位状态**：在初始滚动时，元素像 `position: relative` 一样保留在文档流中，设置的方向属性（如 `top` 值）此时无效。
2.  **固定定位状态**：当滚动位置达到设定的阈值（如 `top: 100px`），元素切换至类似 `position: fixed` 的行为，固定在视口的指定位置（如距离视口顶部100px），直至其父元素完全离开视口范围。

### 生效条件
*   必须指定 `top`、`bottom`、`left`、`right` 中的至少一个阈值（如 `top: 20px`）。
*   父元素不能设置 `overflow: hidden` 或 `overflow: auto`，避免破坏滚动上下文。
*   父元素高度需大于或等于sticky元素的高度，确保有足够滚动空间。
*   仅在父元素内部生效，父元素移出视口时会解除固定定位。

### 适用场景
1.  **导航条固定**：页面向下滚动时导航条贴顶显示（如知乎右侧广告栏）：
    ```css
    nav {
      position: sticky;
      top: 0;
    }
    ```
2.  **表格表头固定**：滚动长表格时保持表头可见：
    ```css
    th {
      position: sticky;
      top: 0;
    }
    ```
3.  **筛选工具栏固定**：页面滚动时保持在视口内（如美团移动端商品筛选框）。
4.  **侧边栏定位**：滚动主要内容时可常驻重要操作按钮（如目录或购物车）。

### 注意事项
兼容性方面需考虑老旧浏览器（如IE）不支持，可通过polyfill（如`stickyfill.js`）兼容。

### 完整示例
```html
<div class="container">
  <div class="sticky-box">我将在滚动到距顶部10px时固定</div>
</div>
```
```css
.container {
  height: 2000px; 
}
.sticky-box {
  position: sticky;
  top: 10px; /*触发固定定位的阈值*/
}
```

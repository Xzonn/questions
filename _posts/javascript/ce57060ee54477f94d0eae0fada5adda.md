---
title: 如何设置和删除 Cookie？
category: JavaScript
date: 2025-07-06
---
设置和删除 Cookie 可以通过客户端 JavaScript 实现，方法主要依赖于 `document.cookie` API。  
以下是详细的实现方案：  

**设置 Cookie**  
设置 Cookie 时，需指定名称、值、过期时间及其他属性：  
```javascript
function setCookie(name, value, daysToExpire = 0) {
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
  const expires = daysToExpire > 0 ? `; expires=${expiryDate.toUTCString()}` : "";
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=/; secure`; // ; secure 标识仅在 HTTPS 下安全
}
```  
参数：  
- `name`：Cookie 名称。  
- `value`：Cookie 值；使用 `encodeURIComponent` 转义敏感字符确保安全。  
- `daysToExpire`：过期天数，0 表示关闭浏览器时失效（会话 Cookie），正整数表示永久 Cookie。  
示例设置一个名为 "userId"、值 "12345"、5 天后过期、全局路径的 Cookie：
```javascript
setCookie("userId", "12345", 5);
```
可选扩展属性：
- `path` / `domain` 定义访问范围，需与首次设置值一致避免冲突。  

**删除 Cookie**  
要删除一个 Cookie，必须创建一个同名但无效的值，设置 `expires` 为过去时间：  
```javascript
function deleteCookie(name) {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`; // ; path=/ 确保覆盖全局路径
}
```  
示例删除名称为 "userId" 的 Cookie：
```javascript
deleteCookie("userId");
```

这些方法跨浏览器兼容且基于标准 DOM 操作，应用于登陆认证、用户偏好保存等场景；删除时值仍在当前页面存在但后续失效。

---
title: 如何实现前端的单点登录？
category: 网络协议
date: 2025-07-08 13:05:47
difficulty: 困难
excerpt: 介绍多种单点登录实现方案，包括 Cookie 共享、Token 与认证中心以及标准化协议，讨论安全性及跨域处理。
tags:
- SSO
- 身份验证
- 认证
---
单点登录 (Single Sign-On, SSO) 允许用户通过一次登录访问多个关联应用，避免了重复验证。以下是常见实现方案： 

1. **基于 Cookie 共享**：  
   - 同顶级域名 (e.g., `.example.com`) 的应用可通过 Cookie 自动共享用户凭证。  
     实现流程：  
     - 用户登录应用 A 后，应用服务器 A 发送包含用户信息的 Cookie 至浏览器。  
     - 用户访问应用 B 时，浏览器自动携带该 Cookie 到服务器 B 完成登录。  
     - Java 后台示例（使用 Filter 拦截）：  
     
         ```java
         public class SSOFilter implements Filter {
           public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) {
             HttpServletRequest request = (HttpServletRequest) req;
             Cookie[] cookies = request.getCookies();
             // 验证 Cookie 并授权
             if (isValid(cookies)) chain.doFilter(req, resp);
             else redirectToLogin(request);
           }
         }
         ```

2. **基于 Token (JWT) 与认证中心 (IdP)**：  
   - 引入身份提供者 (IdP)：  
     - 用户登录时被重定向到 IdP（如 OAuth2 或 JWT 服务器）验证。  
     - IdP 签发安全令牌（e.g., JWT，包含用户 ID 和签名）。  
     - 令牌返回浏览器或应用系统实现登录状态共享。  
   - 前端配合处理：  
     - 将 Token 写入多个域的 LocalStorage（跨域操作）：  
     ```javascript
     const token = result.data.token;
     // 动态 iframe 写入其他域 Storage
     const iframe = document.createElement('iframe');
     iframe.src = 'https://domain-b.com/set-sso?token=' + token;
     document.body.appendChild(iframe);
     ```
   
3. **标准化协议实现**：  
   - OAuth2 / OpenID Connect 整合到后端服务：  
     步骤：  
     1. 用户访问应用时，前端向后端认证服务发送凭证。  
     2. 授权成功后网关下发 Token 并存储（如 Vue 项目路由控制）。  
     3. 微服务架构集成（Spring Gateway + Security）：  
         
         ```xml
         <!-- Spring Gateway 依赖 -->
         <dependency>
           <groupId>org.springframework.cloud</groupId>
           <artifactId>spring-cloud-starter-gateway</artifactId>
         </dependency>
         <dependency>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-security</artifactId>
         </dependency>
         ```

关键成功因素：  
- **安全性**：使用 HTTPS 传输凭据，签名防篡改 Token。  
- **浏览器限制**：不同顶级域系统需采用 Token + 回调（如 iframe 辅助）。

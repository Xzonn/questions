---
title: 跨域问题产生的原因及解决方案是什么？
category: 网络协议
date: 2025-07-06
---
跨域问题主要由浏览器的**同源策略**（Same-origin policy）引起。该策略是一种安全机制，要求两个 URL 的协议、域名和端口号必须完全相同才能允许资源共享。如果三者有任一不匹配（例如不同协议、域名或端口），浏览器会阻止前端访问跨域资源以防止恶意脚本获取敏感数据。  

解决方案主要包括以下几类：  
1. **CORS（跨域资源共享）**  
   - 服务器端在响应头中设置 `Access-Control-Allow-Origin` 字段允许指定源的访问：  
     ```http
     Access-Control-Allow-Origin: * // 允许所有源
     Access-Control-Allow-Origin: https://example.com // 允许特定源
     ```  
     对于非简单请求（如 `PUT`, `DELETE`），浏览器会先发送 `OPTIONS` 预检请求验证服务器配置是否合法。后端语言可实现全局配置（如 Spring Boot）或接口级注解（如 `@CrossOrigin`），示例：  
     ```java
     @Configuration
     public class CorsConfig implements WebMvcConfigurer {
         @Override
         public void addCorsMappings(CorsRegistry registry) {
             registry.addMapping("/**")
                 .allowedOrigins("*")
                 .allowedMethods("GET", "POST", "PUT", "DELETE")
                 .allowCredentials(false);
         }
     }
     ```  
     优点：支持所有 HTTP 方法，兼容现代前端框架；缺点：需后端配合调整。  

2. **代理服务器**  
   - 前端配置代理转发到后端，如 Webpack 或 Vite:  
     ```javascript
     // vite.config.js
     export default {
       server: {
         proxy: {
           "/api": {
             target: "http://backend.com:8080", // 目标后端地址
             changeOrigin: true, // 允许跨域
             rewrite: (path) => path.replace("/api", ""), // 路径重写
           },
         },
       },
     };
     ```  
     浏览器访问本地代理路径（如 `/api/data`），转发后避开跨域问题。  
     优点：开发环境易于配置，适用于 Vite/React/Vue；缺点：部署环境需类似 Nginx 反向代理。  

3. **JSONP**  
   - 利用 `<script>` 标签的跨域特性实现 get 请求，请求 URL 注入回调函数名：  
     ```javascript
     function handleResponse(data) { console.log(data); }
     const script = document.createElement("script");
     script.src = "https://api.example.com/data?callback=handleResponse";
     document.body.appendChild(script);
     ```  
     服务端返回类似 `handleResponse({ "key": "value" })` 的响应代码。  
     优点：兼容旧浏览器；缺点：仅支持 GET 方法，数据格式有限。  

4. **API 网关或 Nginx 配置**  
   - 在网关层设置 CORS 策略，如 Nginx 添加以下配置：  
     ```nginx
     server {
       listen 80;
       location / {
         add_header "Access-Control-Allow-Origin" "*";
         proxy_pass http://backend-server;
       }
     }
     ```  
     或通过 Spring Cloud Gateway 定义跨域规则。  
     优点：单点管理跨域规则；缺点：基础设施层操作较复杂。  

5. **其他方案**  
   - **postMessage**: HTML5 API 安全地在不同源窗口间传输数据。  
   - **document.domain**: 针对相同父域名的站点（如 a.site.com 和 b.site.com）。  
   - **WebSocket**: 非 HTTP 协议实现全双工通信。  

根据项目需求，推荐优先使用 CORS 或代理模式实现安全和标准化处理。

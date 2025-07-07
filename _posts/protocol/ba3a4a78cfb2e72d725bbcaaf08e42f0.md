---
title: 常见的HTTP请求头有哪些？
category: 网络协议
date: 2025-07-07
---
HTTP 请求头是客户端在请求中向服务器传递附加信息的 key-value 对，常见的类型包括：  
- **Host**：指定请求资源的主机名（例如，`www.example.com`），用于处理多域名共享 IP 的情况 (如虚拟主机技术)，确保了请求的正确路由。  
- **User-Agent**：客户端端标识浏览器类型、操作系统或设备信息，例如：`User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36`。  
- **Accept**：表示客户端期望的响应内容类型（如文本格式、JSON 或图像），其值形如：`Accept: application/json, text/html;q=0.8`。  
- **Content-Type**：适用于 POST、PUT 等请求方式，指定消息正文中的数据格式类型（例如 `Content-Type: application/x-www-form-urlencoded` 或 `Content-Type: application/json`）。  

其他常见请求头通常在请求中起到控制作用：
- 缓存相关头字段如 **Cache-Control**、**Expires**（摘要中未重点出现，为完整介绍补充常见的通用性）。
- 认证类头字段如 **Authorization**（如在包含 JWT token 的场景中）。
  
相关编码示例：  
```
curl -X "POST" "http://example.com/api" \
  -H "Host: example.com" \
  -H "User-Agent: curl/8.2.1" \
  -H "Accept: */*" \
  -H "Content-Type: application/json" \
  -d '{ "name":"test" }'
```  

请注意，请求头的使用依赖于具体的 HTTP 协议方式场景。

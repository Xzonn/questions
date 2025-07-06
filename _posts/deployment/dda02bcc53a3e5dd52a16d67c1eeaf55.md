---
title: 如何配置 Nginx 作为反向代理？
category: 部署与运维
date: 2025-07-06
---
配置 Nginx 作为反向代理可将客户端请求转发到后端服务器（如应用服务器），从而实现负载均衡、缓存和安全等目的。以下是基于联网资料的完整步骤：

1. **安装 Nginx**（如未安装）
   - 在 Linux 系统中，使用系统包管理工具安装 Nginx，例如在 Ubuntu 中使用命令：
     ```bash
     sudo apt update
     sudo apt install nginx
     ```


2. **编辑配置文件**
   - 主配置文件通常位于 `/etc/nginx/nginx.conf` 或 `/etc/nginx/sites-enabled/default`。
   - 使用文本编辑器打开文件：`sudo nano /etc/nginx/nginx.conf`。

3. **添加反向代理配置**
   - **定义 `upstream` 块**：指定后端服务器组和负载均衡策略（轮询、最少连接等）。
   - **添加 `server` 和 `location` 块**：监听端口，并将请求转发的目标地址目标服务地址。
     ```nginx
     http {
         upstream backend {
             server 192.168.1.100:8080; # 后端服务器地址和端口
             server 192.168.1.101:8080 weight=3; # 可设置权重和策略如 least_conn
         }

         server {
             listen 80; # 监听端口
             server_name yourdomain.com; # 域名或 IP

             location / {
                 proxy_pass http://backend; # 转发到上游组
                 # 传递请求头以保留客户端信息
                 proxy_set_header Host $host;
                 proxy_set_header X-Real-IP $remote_addr;
                 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                 proxy_set_header X-Forwarded-Proto $scheme;
                 # 可选：配置缓存、超时等
             }

             error_page 500 502 503 504 /50x.html; # 错误处理
             location = /50x.html {
                 root /usr/share/nginx/html;
             }
         }
     }
     ```
4. **保存并重启 Nginx**
   - **测试语法**：运行命令检测配置是否有误。
     ```bash
     sudo nginx -t
     ```
     - 输出 "syntax is OK" 表示正常。
   - **重启服务**：用新配置重启动 Nginx。
     ```bash
     sudo systemctl restart nginx # 整体重启
     sudo nginx -s reload # 平滑重载（无损重加载）
     ```
5. **验证配置**
   - 浏览器中访问 `yourdomain.com` 或本地服务器地址。
   - 检查 Nginx 日志确认请求成功传递到后端服务器（如日志位置一般在 `/var/log/nginx/access.log`）。

**多个反向代理配置示例**
- 监听不通口服务多个域或服务:
  ```nginx
  server {
      listen 8081;
      server_name site1.com;
      location / {
          proxy_pass http://localhost:8070; # Tomcat服务器地址或其他应用
      }
  }
  server {
      listen 8082;
      server_name site2.com;
      location / {
          proxy_pass http://localhost:8080; 
      }
  }
  ```


注意事项：
- 传递请求头是确保后端服务器获取客户端真实来源的主要方式。
- 在生产环境中使用 HTTPS 添加 SSL/TLS 认证协议。
- 负载均衡策略可避免单个后端服务端节点服务端过载。

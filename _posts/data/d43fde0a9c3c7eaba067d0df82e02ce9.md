---
title: Redis 在后端应用中有哪些典型应用场景？
category: 数据管理
date: 2025-07-07 12:19
difficulty: 中等
excerpt: 探讨 Redis 在缓存、计数器、会话管理及限流等多场景的应用及其代码实现。
tags:
- Redis
- 数据库
- 数据存储
---
Redis 作为高性能内存数据库，在后端应用中广泛应用以下场景：  

1. **缓存**：  
    - 存储热点数据（如商品信息、用户信息），减少数据库压力。例如：  
      ```javascript  
      // 用户信息缓存示例  
      const userKey = `user:${userId}`;  
      const cachedUser = await redis.get(userKey);  
      if (!cachedUser) {  
          const userData = await db.query("SELECT * FROM users WHERE id=?", [userId]);  
          redis.setex(userKey, 3600, JSON.stringify(userData)); // 缓存1小时  
      }  
      ```  
2. **计数器与排行榜**：  
    - 视频播放量、点赞数、销售统计等原子计数操作。  
    - 通过 `INCR` 或 `ZSET` 实现排行榜。例如：  
      ```bash  
      redis> INCR video:play:123          # 视频播放次数+1  
      redis> ZINCRBY leaderboard 1 user42 # 用户积分+1  
      ```  
3. **会话管理（Session）**：  
    - 分布式场景下存储用户登录状态（如JWT、Token等），解决多服务器状态共享问题。  

4. **限流与频率控制**：  
    - 限制短信验证码请求频率（如1分钟内仅允许1次发送）：  
      ```php  
      $key = "sms_limit:$phone";  
      $lastSent = redis.get($key);  
      if ($lastSent) return "请求过频";  
      redis.setex($key, 60, time()); // 设置60秒过期  
      ```  
5. **队列系统**：  
    - 处理异步任务（邮件发送、日志处理），通过 `LPUSH/RPOP` 构建消息队列。  

6. **社交网络功能**：  
    - 实现共同好友（`SINTER`）、关注关系（`SET`）、实时消息通知（Pub/Sub）。  

7. **分布式锁**：  
    - 控制并发访问共享资源（如抢购库存）使用 `SETNX`：  
      ```python  
      lock = redis.set("lock_key", "token", nx=True, ex=10)  
      if lock:  
          process_order()  # 获取锁后执行逻辑  
      ```  
8. **数据筛选与标签系统**：  
    - 多标签商品筛选（`SADD`/`SMEMBERS`）、用户个性化推荐（位图统计 `BITOP`）。  

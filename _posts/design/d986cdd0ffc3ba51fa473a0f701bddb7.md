---
title: 什么是熔断机制？微服务如何做熔断？
category: 设计模式
date: 2025-07-08 12:44
difficulty: 困难
excerpt: 熔断机制是微服务架构中的关键设计模式，用于防止级联故障。通过动态状态切换（关闭、打开、半开）隔离异常服务，并使用如 Hystrix 的工具实现熔断。
tags:
- 微服务
- 熔断机制
- 容错机制
---
熔断机制（Circuit Breaker）在微服务架构中是一种重要的设计模式，用于防止分布式系统中的级联故障，当某个服务失败导致整体崩溃时启动熔断器保护。它可以手动或自动激活，基于状态机工作。以下是详解：

### 1. 熔断机制的定义
- **核心概念**：熔断机制类似于电路中的保险丝，当某个服务的失败率过高（如连续超时或异常），触发熔断器直接切断流量给该服务，防止资源耗尽引发雪崩效应。
- **目标**：确保系统核心功能的高可用性，通过隔离故障服务并快速降级处理提升可靠性。

### 2. 熔断机制的核心原理
熔断器运作于三种状态动态切换：
- **Closed 状态（关闭状态）**：
  - 允许正常调用所有请求监控。
  - 统计连续失败次数或失败率，如果达到阈值（例如默认 5 秒内 20 次失败超过 50%），则熔断器进入 Open 状态。
- **Open 状态（打开状态）**：
  - 直接屏蔽掉服务的输入请求，确保系统在崩溃时快速结束。
  - 避免不断向该服务重复调用产生的阻塞，防止资源短缺进而保持可用性的提升。
  - 预设超时时间如 10s 之后进入半开状态恢复测试功能。
- **Half-Open 状态（半开状态）**：
  - 允许少量试探请求调用目标服务进行测试恢复过程。
  - 如果没有失败就恢复正常操作并复位熔断进入关闭状态；反之则再次切换到开始阶段处理故障周期运行测试尝试更多资源重置失败。
核心点是通过这些状态间的转换自适应异常发现能力实现弹性防护系统。

### 3. 在微服务中如何做熔断
在微服务架构如 Spring Cloud 中，使用框架如 **Hystrix** 或 **Resilience4j** 来实现：
- **步骤概述**：
  1. **添加依赖**：引入相应库到服务。
  2. **配置熔断器**：定义阈值设置、触发熔断状态的条件规则和时间阈值定义故障范围。
  3. **实现代码**：在 API 层中加入 fallback 策略处理无效后系统输出返回友好错误信息而非等待状态。
- **常见示例以 Hystrix 实践场景中**：
  - 使用 `@HystrixCommand` 标注目标控制器层方法设置监控逻辑并降级策略。
  - 添加 `fallbackMethod` 后备逻辑确保回退策略有效执行。
例如核心 Java 代码示范了熔断整合方式：

```java
@Service
public class HystrixService {

    @HystrixCommand(fallbackMethod = "paymentInfoFallback", commandProperties = {
            @HystrixProperty(name = "execution.isolation.thread.timeoutInMilliseconds", value = "3000"),
            @HystrixProperty(name = "circuitBreaker.requestVolumeThreshold", value = "10"),
            @HystrixProperty(name = "circuitBreaker.errorThresholdPercentage", value = "60")
    });
    public String paymentProcess(Integer id) {
        // 尝试调用外部服务逻辑
        if (serviceFailed()) {
            throw new RuntimeException();
        }
        return "成功执行支付";
    }

    public String paymentInfoFallback(Integer id) {
        return "系统繁忙，请稍后重试"; // 这里是后备策略实现快速返回默认值避免延迟
    }
}
```

这里设定为 `timeoutInMilliseconds=3000` 超时触发后尝试切换到 Open 状态开始回退路径实现简单容错机制。当超过错误率阈值时触发熔断机制，通过后备逻辑保护可用状态的稳定运行。

### 4. 与降级等其他设计的区别（用于避免混淆理解关键点问题含义区别表达核心属性）
熔断与常规降级机制如 `服务熔断` 不同，针对服务中调用链路的核心设计差异：
- **熔断**：在单机独立点崩溃时触发自动切断功能并监测数据，重点是隔离故障服务和状态管理核心属性如测试机制状态转换模式特性强调防止级联影响系统状态。
- **降级**：是在资源压力过大时基于核心功能手动切换到简单操作，保护资源关键区别在于没有自动恢复策略需要提前设定后备逻辑功能定义明确状态模式差异。
因此，微服务里部署这些模式强调稳定性，核心是通过降级触发熔断实施保障实现。

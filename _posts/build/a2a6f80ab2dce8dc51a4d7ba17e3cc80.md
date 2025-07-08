---
title: Git stash 的作用是什么？如何使用？
category: 工程化与构建
date: 2025-07-07 10:56
difficulty: 中等
excerpt: Git stash 用于临时保存未提交的更改，允许开发者在切换任务时保持工作区干净。中等难度。
tags:
- 版本控制
- Git
- stash
---
git stash 是 Git 版本控制工具中的一个命令，用于临时保存当前工作目录（工作区和暂存区）中的未提交更改。主要作用是在允许开发任务中断的场景（如切换分支修复紧急 Bug）下，将更改暂时存储到一个称为“stash stack”的区域中，从而使工作区恢复到干净状态（最后一次提交点的内容），事后再恢复进度继续开发。

在开发过程中，使用它需要遵循以下基本步骤和相关命令：

### 1. 保存未提交的更改
- 执行基本存储命令（不包含 untracked 文件）：
  ```bash
  git stash
  ```
  或使用推荐的新语法并添加描述消息：
  ```bash
  git stash push -m "添加任务描述消息"  #
  ```
- 如果需要保存 untracked 文件（例如新的日志文件）：
  ```bash
  git stash push -u  # -u 表示包含未跟踪文件
  ```
- 保存指定文件：
  ```bash
  git stash push path/to/file.txt  #
  ```
保存后，工作区立即变得干净，相当于 `git reset --hard HEAD` 的效果。

### 2. 查看已存储的 stash 列表
- 列出所有保存条目：
  ```bash
  git stash list  # 返回形如 stash@{n}: message 的列表，其中 n 是唯一索引
  ```
输出结果显示不同 stash 的描述消息。

### 3. 恢复指定的 stash 更改
- 应用最近一次的 stash（不删除栈记录）：
  ```bash
  git stash apply  #
  ```
- 应用并立即从栈中移除最近的 stash：
  ```bash
  git stash pop  #
  ```
- 针对特定索引的 stash：
  ```bash
  git stash apply stash@{1}  # 应用索引为 1 的 stash
  ```
- 创建一个新分支并恢复相应 stash：
  ```bash
  git stash branch <new-branch-name> stash@{n}  #
  ```

### 4. 删除已保存的 stash
- 移除单个 stash（默认为最近记录）：
  ```bash
  git stash drop  # 删除最旧的（stash@{0}）
  git stash drop stash@{1}  # 删除具体索引的 stash
  ```
- 清空所有 stash 条目：
  ```bash
  git stash clear  #
  ```
- 使用 `stash show` 可在应用前预览更改差异：
  ```bash
  git stash show -p  # 检查 stash 的详细变更。
  ```

主要应用场景包括：
- **中断当前开发去处理临时任务**：从 dev 分支暂存未完成的更改，切换到 main 分支修复 Bug，之后返回恢复进度。
- **管理多个并行工件的堆栈存储**，避免混淆工作副本。
为避免栈区累积过多历史记录，推荐在恢复后执行 git stash drop 清理无用条目。

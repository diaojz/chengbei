# Codex 告别重复授权：从 config.toml 到命令规则的完整教程

如果你只用 Codex，这一篇就够了。你不需要理解 Claude Code 的 `settings.json`，也不需要安装任何 Claude Hook。

最终目标是：Codex 在当前仓库内可以连续读取、修改、运行测试；只有越过工作区或遇到真正高风险操作时才找你确认。

> 核对日期：2026-08-10。开始前请参考 [Codex Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference)。

## 第一步：备份现有配置

```bash
mkdir -p ~/.codex
cp ~/.codex/config.toml ~/.codex/config.toml.bak-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
```

如果文件原本不存在，备份命令会跳过。

## 第二步：理解两个不能混为一谈的开关

- `approval_policy`：什么时候暂停并询问你；
- `sandbox_mode`：即使不询问，Codex 最多能接触哪里。

我日常使用的是：

```toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"
```

意思是：工作区内常规操作可以连续完成，越界时再申请。它和 `never + danger-full-access` 完全不同。

## 第三步：写入完整的脱敏版 `config.toml`

打开：

```bash
${EDITOR:-nano} ~/.codex/config.toml
```

如果你已经有模型、MCP、插件或代理配置，请把下面字段**合并进去**，不要覆盖整个文件。

```toml
# ~/.codex/config.toml

# 只有确实需要越权时才申请
approval_policy = "on-request"

# 工作区内允许读写，工作区外仍受限制
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
# 需要安装依赖、查询文档或访问 API 的项目才开启
network_access = true

# 工作流确实需要写入的工作区外缓存目录
writable_roots = [
  "/Users/<YOUR_NAME>/.cache",
  "/Users/<YOUR_NAME>/.npm",
  "/Users/<YOUR_NAME>/Library/Caches",
]

# 只添加你维护并确认安全的项目
[projects."/Users/<YOUR_NAME>/Projects/my-app"]
trust_level = "trusted"
```

你必须替换 `<YOUR_NAME>` 和示例项目路径。不需要联网就把 `network_access` 改成 `false`；不需要额外缓存目录就删掉 `writable_roots`，权限越少越好。

## 第四步：命令级白名单不存在，真正能调的是 `approval_policy.granular`

> **勘误（2026-08-10）**：这一步此前写的是「用 `~/.codex/rules/default.rules` + `prefix_rule()` 持久化某个命令前缀」。核对 [Codex Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference) 后确认：**这套规则文件和 `prefix_rule` 语法不存在，是我当时写错的**，Codex 没有类似 Claude Code `permissions.allow` 那种「给单条命令永久放行」的持久化白名单机制。已改成下面经核实的写法，为之前的错误说明道歉。

Codex 真正能调的粒度，是把 `approval_policy` 从「整体开关」换成按类别拆开的 `granular` 形式：

```toml
# 整体开关（第二步已经用过）
approval_policy = "on-request"
```

如果 `on-request` 仍然太吵，可以只关掉你确认安全的那一类确认，而不是整体切到 `never`：

```toml
[approval_policy.granular]
sandbox_approval = false   # 沙箱内的常规操作不再逐次确认
rules = true                # 涉及规则/策略变更时仍然询问
mcp_elicitations = true
request_permissions = true
skill_approval = true
```

`sandbox_mode = "workspace-write"` 已经把「能碰哪里」锁死在工作区内；`granular` 只决定「在这个范围内还要不要再问你」，两者分工不重叠。

不要为了省事把 `approval_policy` 整体改成：

```toml
# 不建议
approval_policy = "never"
```

这会连越界操作也一并放行，等价于把红线也关掉——和 `sandbox_mode = "danger-full-access"` 一样，只应该出现在你完全清楚后果的场景（见下方「可选：Codex 被其他 Agent 委派」）。

## 第五步：校验 TOML，不要等启动时报错

```bash
python3 - <<'PY'
import pathlib, tomllib
p = pathlib.Path.home() / ".codex/config.toml"
tomllib.loads(p.read_text())
print("TOML OK:", p)
PY
```

出现 `TOML OK` 后，重启 Codex 或新开会话。

## 第六步：做四项验收

在一个可丢弃的测试仓库里让 Codex：

1. 读取一个文件；
2. 新建 `permission-test.txt`；
3. 运行项目测试；
4. 尝试写入工作区外的路径。

前三项应该顺畅完成，第四项应该被拒绝或要求升级。只测试“能不能干活”不够，还必须测试“能不能越界”。

## 可选：Codex 被其他 Agent 委派

如果 Codex 通过 MCP 被上层 Agent 调用，中途没有人替它点击审批。这个**特殊场景**可以按次覆盖：

```bash
claude mcp add -s user codex -- \
  codex mcp-server \
  -c approval_policy=never \
  -c sandbox_mode=workspace-write
```

这里仍保留 `workspace-write`，任务结束后由上层 Agent 复核 diff。不要把日常默认配置也照搬成 `never`，更不要与 `danger-full-access` 组合。

## 一段可以直接交给 Codex 的配置提示词

```text
请帮我减少 Codex 在开发过程中重复弹出授权确认，但不要关闭安全边界。

先只读检查 ~/.codex/config.toml；不得显示任何密钥、Token、Cookie 或代理口令。

目标配置：
1. approval_policy = "on-request"；
2. sandbox_mode = "workspace-write"；
3. 仅当当前项目确实需要联网时，设置 [sandbox_workspace_write] network_access = true；
4. 如果 on-request 仍然太吵，评估是否需要 [approval_policy.granular] 按类别（sandbox_approval / rules / mcp_elicitations / request_permissions / skill_approval）精细放开，而不是整体改成 never；
5. 禁止宽泛放行 bash、zsh、python3、node、sudo、rm；
6. 不得开启 danger-full-access，不得把默认 approval_policy 改为 never；
7. 保留现有模型、MCP、插件、通知、代理和其他无关字段。

执行步骤：创建带时间戳备份 → 给出拟修改方案 → 等我确认 → 字段级合并 → 校验 TOML → 展示精简 diff → 告诉我哪些操作以后不再询问、哪些仍会被拦截，并给出回滚命令但不要自动回滚。
```

## 回滚

找到刚才的备份：

```bash
ls -t ~/.codex/config.toml.bak-* | head
```

确认目标后再恢复：

```bash
cp <BACKUP_PATH> ~/.codex/config.toml
```

真正成熟的 Codex 权限配置不是“永远不问”，而是把确认留给越界与不可逆动作。

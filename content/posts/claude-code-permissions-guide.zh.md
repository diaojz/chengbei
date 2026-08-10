# Claude Code 告别重复点 Yes：settings.json、自动模式与 Hook 完整教程

如果你只用 Claude Code，这一篇就够了。你不需要创建 Codex 的 `config.toml`，也不需要理解 Codex 的 `prefix_rule`。

最终目标是：日常读写、测试和 lint 可以连续完成；`.env`、SSH 密钥、递归删除、强推与提权仍然被明确拒绝。

> 核对日期：2026-08-10。开始前请参考 [Claude Code Permissions](https://code.claude.com/docs/en/permissions)。先运行 `claude --version`；旧版本不支持 `auto` 时使用 `default`。

## 第一步：备份

```bash
mkdir -p ~/.claude
cp ~/.claude/settings.json ~/.claude/settings.json.bak-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true
```

全局配置是 `~/.claude/settings.json`；只对当前项目生效的个人配置是 `<project>/.claude/settings.local.json`。

## 第二步：写入完整的脱敏版 `settings.json`

如果文件里已有代理、插件、状态栏或其他 Hook，请做字段级合并，不要覆盖整个文件。

```json
{
  "cleanupPeriodDays": 30,
  "permissions": {
    "defaultMode": "auto",
    "allow": [
      "Read",
      "Edit",
      "Write",
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(npm run test *)",
      "Bash(npm run lint *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(//Users/<YOUR_NAME>/.ssh/**)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)"
    ],
    "additionalDirectories": []
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash|Read|Edit|Write|NotebookEdit",
        "hooks": [
          {
            "type": "command",
            "command": "\"/Users/<YOUR_NAME>/.claude/hooks/safety-guard.sh\"",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

必须替换 `<YOUR_NAME>`。如果版本不支持 `auto`：

```json
"defaultMode": "default"
```

`auto` 是风险分类器自动判断，不是 `bypassPermissions`；显式 deny 仍然生效。不要把白名单写成 `Bash(*)`。

## 第三步：为什么还需要 Hook

静态 allow/deny 只能按工具和参数模式匹配。有些风险需要更细的判断：删除缓存与删除家目录不同，正常 push 与临时修改 remote 把源码推走也不同。

`PreToolUse` Hook 会在工具真正执行前检查工具名与完整参数。

创建包装器：

```bash
mkdir -p ~/.claude/hooks
${EDITOR:-nano} ~/.claude/hooks/safety-guard.sh
```

写入：

```sh
#!/bin/sh
GUARD="$HOME/.claude/hooks/safety-guard.cjs"

deny() {
  printf '%s' "{\"hookSpecificOutput\":{\"hookEventName\":\"PreToolUse\",\"permissionDecision\":\"deny\",\"permissionDecisionReason\":\"安全守卫不可用：$1。为避免静默失守，本次操作已拒绝。\"}}"
  exit 0
}

[ -f "$GUARD" ] || deny "找不到 safety-guard.cjs"
NODE=$(command -v node 2>/dev/null)
[ -n "$NODE" ] && [ -x "$NODE" ] || deny "找不到 Node.js"
exec "$NODE" "$GUARD" "$@"
```

创建守卫：

```bash
${EDITOR:-nano} ~/.claude/hooks/safety-guard.cjs
```

写入：

```js
const fs = require("node:fs");

let event;
try {
  event = JSON.parse(fs.readFileSync(0, "utf8") || "{}");
} catch {
  process.exit(0);
}

const tool = event.tool_name || "";
const input = event.tool_input || {};

function deny(reason) {
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason
    }
  }));
  process.exit(0);
}

if (tool === "Bash") {
  const command = String(input.command || "");
  const rules = [
    [/\brm\s+(-[a-z]*f|-[a-z]*r[a-z]*|--force|--recursive)/i, "禁止强制或递归删除"],
    [/\b(mkfs|shred|sudo)\b/i, "禁止擦盘、粉碎文件或提权"],
    [/curl[^\n|]*\|\s*(sh|bash|zsh)/i, "禁止下载后直接执行脚本"],
    [/git\s+remote\s+(add|set-url)/i, "禁止修改 Git 远端"],
    [/git\s+push[^\n]*(http|git@|ssh:\/\/)/i, "禁止向显式外部地址推送"],
    [/\b(printenv|env)\s*$/i, "禁止导出全部环境变量"]
  ];
  for (const [pattern, reason] of rules) {
    if (pattern.test(command)) deny(`${reason}：${command.slice(0, 120)}`);
  }
}

const file = String(input.file_path || input.path || input.notebook_path || "");
const sensitive = [
  /\.ssh\//i,
  /\.env(\.|$)/i,
  /\.aws\/credentials/i,
  /\.netrc$/i,
  /\.(pem|key)$/i
];
if (file && sensitive.some(pattern => pattern.test(file))) {
  deny(`禁止访问敏感文件：${file}`);
}
```

赋予执行权限并校验：

```bash
chmod +x ~/.claude/hooks/safety-guard.sh
jq empty ~/.claude/settings.json
node --check ~/.claude/hooks/safety-guard.cjs
```

包装器采用 fail-closed：守卫文件丢失或 Node 不可用时直接拒绝，而不是静默放行。

## 第四步：在 Claude Code 中检查规则来源

重新启动 Claude Code，运行：

```text
/permissions
```

确认规则来自预期的用户级或项目级 settings 文件。

至少测试：

1. 常规读取与编辑应放行；
2. 测试和 lint 应放行；
3. 读取 `.env` 应拒绝；
4. 在可丢弃目录里尝试递归删除，应被 Hook 拦截。

## 可选：远程审批 Hook

只有你已经运行了自己的本机审批服务，才增加：

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "http",
            "url": "http://127.0.0.1:<PORT>/permission",
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

普通终端用户不要照抄。没有对应服务，这个 URL 没有任何意义。

## 一段可以直接交给 Claude Code 的配置提示词

```text
请帮我减少 Claude Code 在开发过程中重复弹出授权确认，但不要开启 bypassPermissions，也不要取消安全红线。

先只读检查 ~/.claude/settings.json、当前项目的 .claude/settings.json 和 .claude/settings.local.json；不得显示任何密钥、Token、Cookie、代理口令或真实凭据。

目标：
1. 根据当前 Claude Code 版本判断 permissions.defaultMode 是否支持 auto；支持则给出 auto 方案，不支持则使用 default；
2. 把 Read、Edit、Write，以及当前项目实际存在的 test、lint、git status、git diff 等高频可逆操作加入精确 permissions.allow；
3. 在 permissions.deny 中保护 .env、.env.*、SSH 密钥，并拒绝 rm -rf 与 git push --force；
4. 不得使用 Bash(*)；不得删除现有 deny、hooks、env、plugins、statusLine 或其他无关字段；
5. 如果增加 PreToolUse Hook，使用独立包装脚本并 fail-closed；不得配置不存在的 PermissionRequest HTTP 服务；
6. 只做字段级合并，不覆盖整个 settings.json。

执行步骤：创建带时间戳备份 → 给出拟修改方案 → 等我确认 → 修改 → jq 校验 JSON → 校验 Hook 语法和执行权限 → 展示精简 diff → 列出以后自动放行与仍会拒绝的操作 → 给出回滚命令但不要自动回滚。
```

## 一个常见维护坑

部分第三方供应商切换工具会整文件重写 `settings.json`，导致权限、Hook、状态栏一起消失。修改完成后可以保留一份不入 Git 的金样：

```bash
cp ~/.claude/settings.json ~/.claude/settings.json.gold
```

金样可能包含凭据，必须加入 `.gitignore`，绝不能上传。

Claude Code 的正确目标不是“自动同意一切”，而是让白名单负责效率、让 deny 与 Hook 负责睡得着。

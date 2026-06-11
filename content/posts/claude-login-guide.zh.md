# Claude 账号登录问题 · 完整解决方案

学员里十个有八个卡在「Claude 登不上去」这一步。这篇把所有可能的卡点和对应方案讲清楚，照着选一条路走就行。

## 先搞清楚为什么登不上

Anthropic 对国内 IP 做了严格的风控。具体表现是：

- **能打开网页，但登录就转圈、或者直接报错**
- **注册时收不到邮箱验证码**
- **注册成功，但用一两天账号就被 suspend**
- **网页能用，Claude Code 命令行报 401 / 403**

原因不是「梯子不行」那么简单，常见三类：

1. **IP 不纯净**：你用的节点 IP 段被大量人共用过，已经被 Anthropic 标记。
2. **节点漂移**：你前一秒在日本 IP，下一秒切到美国 IP，账号自动判为异常。
3. **地区不支持**：Anthropic 官方不支持中国大陆地区注册，从注册手机号到付款都会卡。

## 你有三条路可以选

下面这三条，**任选一条**就够了。不用全做。

### 路线 A · 直接用中转网关（推荐 · 零基础首选）

不用自己注册 Claude 账号，不用配梯子，不用关心 IP 干净不干净。直接用我搭的中转网关：

- **网关地址**：`https://gw.chengbei.org`
- **注册一个账号 → 拿一个 API Key → 填进 Claude Code 就能用**
- 走的是我自建在海外的服务器，IP 长期固定、没被 Anthropic 标记
- 同时兼容 Claude / GPT / Gemini / DeepSeek 多家模型，一个 Key 全搞定

适合：**所有学员**。除非你有强烈的「我必须用官方账号」的理由，否则直接走这条。

### 路线 B · 注册官方账号 + 配独立梯子

如果你坚持要用官方账号（比如想用 Claude.ai 网页对话、订 Pro 看交互式 UI），需要满足：

1. **海外手机号**：用 sms-activate / SMS-Man 这类平台买虚拟号收验证码（约 ¥3-10 一次）。
2. **海外邮箱**：Gmail / Outlook 都行，注册时也要走梯子。
3. **独享住宅 IP 梯子**：**不是机场，不是共享节点**。要找住宅 IP（Residential Proxy），常见的有 IPRoyal、Bright Data，或者自建（Vultr / DigitalOcean 开一台 VPS 装 sing-box）。
4. **IP 不能换**：注册到使用全程用同一个出口 IP。换了就大概率被封。

适合：愿意折腾、想长期持有官方账号的人。新手建议跳过。

### 路线 C · 用 Cursor / Trae 这类已经内置 Claude 的工具

部分 IDE 自带 Claude 调用，账号在它们那边，不需要你登录 Anthropic：

- **Cursor**：付费版自带 Claude Sonnet / Opus
- **Trae**：国内可用，内置 Claude（字节出的）
- **Windsurf**：类似

适合：只想用 Claude 写代码、不在意是不是在终端里用的人。但**这条路你享受不到 Claude Code 的完整能力**（agent 模式、自定义命令、skill 等），所以课程里我们不走这条。

## 三条路的对比

| 维度 | A · 中转网关 | B · 官方账号 | C · 内置工具 |
|---|---|---|---|
| 难度 | 极低 | 高 | 低 |
| 月成本 | 按用量 ~$3-10 | $20 Pro + 节点费 | $20 Cursor 等 |
| 能用 Claude Code | ✅ 完整 | ✅ 完整 | ❌ 部分 |
| 稳定性 | 高 | 看节点 | 高 |
| 封号风险 | 无（用我的池子） | 中-高 | 无 |

## 推荐路线 A · 具体怎么接入 Claude Code

三步搞定：

**1. 去 `https://gw.chengbei.org` 注册**

打开网页 → 注册账号 → 进控制台 → 创建一个 API Key（建议起个有意义的名字，比如「我的-MacBook」）→ 复制下来备用。

**2. 给 Claude Code 配上中转地址**

打开终端，跑这两条命令（把 `<你的Key>` 换成上一步拿到的 Key）：

```bash
export ANTHROPIC_BASE_URL="https://gw.chengbei.org/api"
export ANTHROPIC_API_KEY="<你的Key>"
```

想永久生效，就把这两行写进你的 shell 配置文件（zsh 写 `~/.zshrc`，bash 写 `~/.bashrc`）。

**3. 测试一下**

```bash
claude
```

进入 Claude Code，随便问一句「你好」，能正常回复就成了。

如果报 401 / 403，先回去检查 Key 是不是复制全了（前后空格也算）。还不行就看下一篇 [Claude 登录常见问题 FAQ](#/p/claude-login-faq)。

## 我已经买了 Claude Pro，要不要换中转？

**可以两个都留着，按场景用：**

- 网页对话、看图、长上下文聊天 → 继续用官方 Pro
- 终端写代码（Claude Code） → 走中转网关

为什么这么搭？官方 Pro 的 Claude Code 在大陆经常抽风（IP 风控 + Cloudflare 拦截），而中转网关跑在海外固定 IP 上，写代码这种高频场景反而稳定。

## 一句话总结

> 90% 的学员问题，路线 A 全部解决。先把 `gw.chengbei.org` 用起来，专心学课，账号那点事别再耗精力了。

遇到具体报错，去看下一篇：**[Claude 登录常见问题 FAQ](#/p/claude-login-faq)**。

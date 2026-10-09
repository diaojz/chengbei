# AI 编程圈看着像在换工具，调查里谁才是主力？

最近看 AI 编程的讨论，很容易产生一种错觉：打开 X，像是人人都在同时开好几个 Claude Code；转到另一个帖子，又成了 Codex 多 Agent；再往下刷，有人把 OpenClaw 接进 Telegram，有人用 Pi 接 MiniMax，还有人只认 Cursor。

看多了，难免想问一句：**现在大家到底都在用什么？**

我把这轮资料翻了一遍，发现答案得先看你说的“用”是哪一种。是过去一年试过一次，还是现在上班每天都在用？是代码编辑器里的补全，还是能自己读仓库、改文件、跑命令的 Agent？这些问题混在一起，榜单自然越看越乱。

![两份开发者调查的 AI 编程工具数据。Stack Overflow 统计过去一年用过哪些工具；JetBrains 统计工作中的采用率。两组数字口径不同，不能合并为单一排名。](/assets/img/posts/ai-coding-agent-landscape-2026/chart-adoption.svg)

## 先把两份调查放在桌上

Stack Overflow 2026 开发者调查问的是“过去一年用过哪些编码 Agent 或助手”。这道多选题有 12,255 份有效回答：Claude Code 被 65.5% 的人选中，GitHub Copilot 是 58.7%，Codex 是 29.5%。Cursor、Antigravity、Gemini Code Assist、OpenCode 和 JetBrains AI 也都在名单里。[原始题目与数据](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent)

这不是“当前主力榜”。一个人过去一年可能试过好几种工具，所以百分比相加超过 100% 很正常。它能说明哪些名字已经进入开发者视野，不能说明谁每天都在用。

另一份调查问得更接近“工作主力”。JetBrains 在 2026 年 5 到 7 月调查了 15,000 多名专业开发者，并对样本做了加权。报告给出的工作采用率是：Claude Code 约 39%，Copilot 约 21%，Codex 约 16%，OpenCode 约 7%。另有 31% 的开发者说，Claude Code 是自己最常用的 AI 编程工具。[JetBrains 调查与方法说明](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)

两边的样本和问法不一样，数字不能拿来直接比高低。但它们指向的方向差不多：**Claude Code 现在很突出，Copilot 的用户底子仍然大，Codex 正在往前追。**这比“某个工具已经统治全场”更接近调查所能支持的结论。

JetBrains 还发现，90% 的受访专业开发者每周至少用一种编码 Agent，68% 每天用。Stack Overflow 则报告，65.9% 的受访者在工作中使用 AI 编码助手或编码 Agent。AI 编程已经不是很小一群人的新鲜玩具了；但“用 AI 问问题、补全几行代码”和“把任务交给 Agent 自己动手”，仍是两种不同的使用深度。[Stack Overflow 总体 AI 使用数据](https://survey.stackoverflow.co/2026/ai/data/ai-select)

## 这场变化，是怎么发生的？

![AI 编程 Agent 的产品与调查时间线。标注的是官方公告日期或调查采集期，不表示产品从该日才开始存在。](/assets/img/posts/ai-coding-agent-landscape-2026/chart-timeline.svg)

时间线里有几个节点挺能说明问题。2025 年 2 月，Anthropic 把 Claude Code 作为早期研究预览介绍出来；4 月，OpenAI 发布能在本机终端工作的 Codex CLI；5 月，Codex 云端 Agent 和 GitHub Copilot Coding Agent 相继登场，任务开始可以交给云端执行，再以改动或 PR 的形式拿回来审。9 月，Copilot Coding Agent 正式可用。[Anthropic](https://www.anthropic.com/news/claude-3-7-sonnet) · [Codex CLI](https://openai.com/index/introducing-o3-and-o4-mini/) · [Codex 云端 Agent](https://openai.com/index/o3-o4-mini-codex-system-card-addendum/) · [Copilot 预览](https://github.blog/changelog/2025-05-19-github-copilot-coding-agent-in-public-preview/) · [Copilot 正式发布](https://github.blog/changelog/2025-09-25-github-copilot-coding-agent-is-now-generally-available/)

到了 2026 年，大家争论的已经不只是模型谁更聪明。有人想留在 IDE 里边写边问，有人喜欢在终端把整件事交给 Agent，也有人把 issue 扔给云端，过一会儿回来审 PR。**入口和做事方式都变多了，工具自然也不只剩一个答案。**

## 名字看起来都像工具，其实不在同一层

![AI 编程方案的组成图：工作界面、Agent、模型和服务连接是不同组件，一套工作流可以按需组合。](/assets/img/posts/ai-coding-agent-landscape-2026/chart-stack.svg)

这里最容易混淆的是：Claude Code、Codex、OpenCode、Pi 这些是 Agent 或执行框架；Claude、GPT、Gemini、DeepSeek、MiniMax、Qwen、Grok 是模型；OpenRouter、LiteLLM 这类服务负责连接或路由。IDE 是你工作的界面。它们可以组成一套方案，但不是同一类产品。

比如，Claude Code 配 Claude、Codex 配 OpenAI 模型，是省心的原生组合；Copilot、Cursor、Windsurf 和 JetBrains 则更贴近编辑器工作流。想自己挑模型的人，会看 OpenCode、Pi、Cline 或 Aider。OpenCode 的官方文档列出 75 多个模型 Provider，也支持本地模型；选择多，自己就得多做兼容性检查。[OpenCode Provider 文档](https://github.com/anomalyco/opencode/blob/dev/packages/web/src/content/docs/providers.mdx)

Pi 接 MiniMax、或直接用 MiniMax Code，是现在能看到的另一种路线；Qwen Code、Grok Build 也各有自己的 Agent 产品。至于 OpenClaw，它更像接入消息渠道、管理多个 Agent 的编排平台，和“终端里直接改代码”的 CLI 不完全是一类东西。[Pi](https://github.com/badlogic/pi-mono) · [MiniMax Code](https://github.com/MiniMax-AI/minimax-code) · [Qwen Code](https://github.com/QwenLM/qwen-code) · [Grok Build](https://docs.x.ai/build/overview) · [OpenClaw 多 Agent 文档](https://docs.openclaw.ai/multi-agent)

顺便提一句，Grok 和 Groq 不是一回事：Grok 是 xAI 的模型，Grok Build 是它的编码 Agent；Groq 提供模型推理服务，属于服务接入这一层。[Groq 编码文档](https://console.groq.com/docs/coding-with-groq)

## 社交平台上的“玩法”，可以参考，但别当成民调

Claude Code 的创建者 Boris Cherny 在 X 上分享过自己的用法：终端里并行跑多个 Claude 会话，也同时用云端会话；他还特别提到，要让 Agent 有办法验证自己做的事。[Boris Cherny 的原帖](https://x.com/bcherny/status/2007179832300581177)

OpenClaw 这边，创业者 Nikil Viswanathan 分享过用多个 Telegram 群组分别管理 Agent 的做法。[Nikil 的原帖](https://x.com/nikil/status/2024290446789472591) 这些例子很有启发，但它们回答的是“有人怎么用”，不是“多数人怎么用”。愿意公开配置、分享技巧的人，本来就更容易出现在信息流里；不能因为刷到很多，就当成市场占有率。

小红书上能检索到的内容，教程和推广占比较显眼，我没找到足够多可交叉核对的真实配置样本，因此不拿它来排使用率。这部分我宁愿留白，也不想把热度写成事实。

## 那现在的主流，怎么说才不夸张？

如果看调查，Claude Code、Copilot 和 Codex 是当前最靠前的一组，Cursor 也仍然是常见选择。若把范围缩到开源、多模型和可自己折腾的工具，OpenCode、Pi、Cline、Aider 等很值得看。OpenClaw 的 GitHub 星数很高，但它覆盖的是消息入口和多 Agent 编排，不能拿来当编码 CLI 的用户数。

截至 2026 年 10 月 9 日，我从 GitHub API 读到的 Stars 大致是：OpenClaw 39.1 万、OpenCode 21.2 万、Codex CLI 仓库 12.8 万、Pi 11.4 万。这个数字说明项目被关注，不等于有多少人在日常使用；它也没法和 Claude Code、Cursor 这类闭源产品公平比较。[OpenClaw](https://github.com/openclaw/openclaw) · [OpenCode](https://github.com/anomalyco/opencode) · [Codex CLI](https://github.com/openai/codex) · [Pi](https://github.com/badlogic/pi-mono)

所以我会把现在的局面概括成一句话：**主流用户更多在用成熟的一体化工具；喜欢折腾的人用开源 Agent 接自己选的模型；需要远程调度的人再叠一层 Bot 或编排平台。**这三种需求都是真实存在的，只是不能拿社交媒体上最热闹的一种，替代整个市场。

如果只是想选一个开始，先想清楚自己需要什么：留在 IDE、在终端交任务、还是换模型更自由。再按调查中的主流产品试用，通常比先搭一整套多 Agent 系统更容易判断是否合适。工具会变，但“它能不能稳定完成我的实际任务”仍然是最有用的标准。

<details>
<summary>数据口径与参考来源</summary>

- Stack Overflow 2026 编码 Agent 题：过去一年是否用过，多选；“used”样本 n=12,255。[原始数据](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent)
- JetBrains Developer Ecosystem Survey 2026：2026 年 5–7 月采集，15,000+ 专业开发者，采用加权样本；[报告与方法](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)。JetBrains 也经营开发者工具，其自有产品数据需带着这一背景阅读。
- 产品时间线采用厂商或 GitHub 的公告日期；调查数据对应调查采集期，不以报告发布日期替代。
- GitHub Stars 是 2026-10-09 读取的 API 快照，按千位取整，只作开源项目关注度参考。
- X 帖文说明公开个案，不用于推算整体使用比例。
</details>

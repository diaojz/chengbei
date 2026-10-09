# AI 编程 Agent 到底谁在用？先把工具、模型和热度分开

这阵子聊 AI 编程，很容易听到几种互相矛盾的说法：有人觉得 Claude Code 已经一统天下，有人说现在主力都换成 Codex；有人在 OpenClaw 里挂好几个 Bot，也有人拿 Pi 接 MiniMax，甚至全套跑本地模型。

这些做法都能找到真实使用者。问题是，社交平台上谁发得多，不等于谁用得多；GitHub 星星多，也不等于企业采购多。想看清现在的主流，得把几种证据分开。

![两份开发者调查的 AI 编程工具数据。Stack Overflow 统计过去一年用过哪些工具；JetBrains 统计工作中的工具采用率。两组数字口径不同，不能合并为单一排名。](/assets/img/posts/ai-coding-agent-landscape-2026/chart-adoption.svg)

## 调查里，谁排在前面？

Stack Overflow 2026 开发者调查问的是：过去一年用过哪些编码 Agent 或助手。该题的“用过”样本为 12,255 人，是多选题。Claude Code 有 65.5% 的受访者选中，GitHub Copilot 为 58.7%，OpenAI Codex 为 29.5%；后面依次还有 Cursor、Google Antigravity、Gemini Code Assist、OpenCode、JetBrains AI 等。[题目与原始数据](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent)

这组数据适合回答“开发者过去一年碰过哪些工具”，不适合直接回答“现在谁是主力”。一个人可以同时用 Claude Code、Copilot 和 Codex，百分比相加超过 100% 很正常。

JetBrains 的 2026 开发者生态调查问的是工作中采用情况，采集时间为 2026 年 5 至 7 月，覆盖 15,000 多名专业开发者，并按地区、就业状态、语言等因素加权。报告称，Claude Code 的工作采用率约 39%，GitHub Copilot 约 21%，Codex 约 16%；OpenCode 约 7%。Claude Code 还是 31% 开发者最常用的 AI 编程工具。按这份调查的口径，它不只是“大家听说过”，也有不少人把它当主力。[JetBrains 调查及方法说明](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)

两份调查的样本、题目和时间都不相同，不能把 65.5% 和 39% 放在一起说谁高谁低。不过方向是一致的：**Claude Code 目前在专业开发者调查里很突出，Copilot 仍有很大的存量用户，Codex 正在快速追上。**

Stack Overflow 还报告，65.9% 的受访者目前在工作中使用 AI 编码助手或编码 Agent；一般用途的 AI 聊天工具为 62.5%，Agent 或自动化工作流为 26.2%。这也说明，“使用 AI 写代码”和“把任务交给可操作仓库的 Agent”还不是一回事。[Stack Overflow 总体 AI 使用数据](https://survey.stackoverflow.co/2026/ai/data/ai-select)

## 这两年，产品形态怎么变了

![AI 编程 Agent 产品与调查时间线。标注的是官方公告日期或调查采集期，不表示产品从该日才开始存在。](/assets/img/posts/ai-coding-agent-landscape-2026/chart-timeline.svg)

2025 年初，Anthropic 把 Claude Code 作为早期研究预览公开介绍：它能读代码、改文件、运行测试，也能使用命令行工具。4 月，OpenAI 发布可在本机终端运行的开源 Codex CLI；5 月又公布运行在云端容器里的 Codex Agent。同期，GitHub 让 Copilot Coding Agent 进入公开预览，任务可以从 Issue 派发，在云端后台完成并交回 PR；同年 9 月，该功能正式可用。[Anthropic 公告](https://www.anthropic.com/news/claude-3-7-sonnet) · [Codex CLI 公告](https://openai.com/index/introducing-o3-and-o4-mini/) · [Codex 云端 Agent 说明](https://openai.com/index/o3-o4-mini-codex-system-card-addendum/) · [Copilot Agent 预览](https://github.blog/changelog/2025-05-19-github-copilot-coding-agent-in-public-preview/) · [Copilot Agent 正式可用](https://github.blog/changelog/2025-09-25-copilot-coding-agent-is-now-generally-available/)

到了 2026 年，调查已经能看到本地终端 Agent、IDE 里的 Agent 和云端异步 Agent 同时被使用。JetBrains 报告中，90% 的专业开发者每周至少使用一种编码 Agent，68% 每天使用；这里的“Agent”覆盖本地和远程产品，并不专指某一个品牌。

因此，今天的变化不只是“模型越来越会写代码”，也是任务入口和执行方式变多了：你可以在终端盯着 Agent 改代码，可以留在 IDE 里边写边问，也可以把一个 Issue 派到云上，稍后回来审 PR。

## 方案不是一个榜单，而是几层组合

![AI 编程方案的层级图：入口、Agent、模型和连接路由是不同组件，一套工作流可以按需组合。](/assets/img/posts/ai-coding-agent-landscape-2026/chart-stack.svg)

把常见名字放回各自的位置，大致就清楚了：

| 这一层 | 常见选择 | 主要负责什么 |
|---|---|---|
| 入口与工作界面 | VS Code、JetBrains、Cursor、终端、GitHub、Telegram | 人在哪里下任务、查看结果和审查改动 |
| Agent / Harness | Claude Code、Codex、Copilot Coding Agent、OpenCode、Pi、Aider、Cline、Qwen Code、MiniMax Code、Grok Build | 读取项目、调用工具、执行修改并组织工作循环 |
| 模型 | Claude、GPT、Gemini、DeepSeek、MiniMax、Qwen、Grok 等 | 提供理解、推理、代码生成等能力 |
| Provider / 路由 | 官方 API、OpenRouter、LiteLLM 等 | 连接模型服务；可选负责模型选择或统一接口 |
| 消息入口与编排 | OpenClaw 等 | 把消息渠道、多个 Agent 和工作区连接起来 |

这几层并非总能随意拼装。Agent 对模型 API、工具调用、多模态输入和上下文长度的要求不同，标着“支持某 Provider”也不代表所有模型功能都能完整使用。接入第三方中转或兼容接口时，最好用实际项目验证工具调用、长任务、图像输入和失败恢复。还有两个容易混淆的名字：**Grok 是 xAI 的模型，Grok Build 是 xAI 的编码 Agent；Groq 则是提供模型推理服务的平台，不是 Grok 的另一个拼法。**[Grok Build 文档](https://docs.x.ai/build/overview) · [Groq 编码文档](https://console.groq.com/docs/coding-with-groq)

目前常见的组合思路有四种：

1. **原生闭环：Claude Code + Claude，或 Codex + OpenAI 模型。** 安装和使用相对直接，工具通常围绕自家模型打磨。适合希望把复杂任务交给 Agent、又不想自己搭太多连接层的人。
2. **IDE 内工作：Copilot、Cursor、Windsurf、JetBrains 等。** 适合想在编辑器里保留熟悉操作的人。这里既包括补全和问答，也包括能跨文件执行任务的 Agent，不能把两者混为一谈。
3. **开放工具接自选模型：OpenCode、Pi、Aider、Cline 等。** 适合更在意模型选择、可配置性或本地运行的人。OpenCode 官方文档列出 75+ Provider 和本地模型支持；这种灵活性也意味着需要自己确认各家接口是否兼容。[OpenCode Provider 文档](https://github.com/anomalyco/opencode/blob/dev/packages/web/src/content/docs/providers.mdx)
4. **云端异步或消息编排：Codex 云端、Copilot Coding Agent、Devin、Jules，以及 OpenClaw 一类平台。** 适合把边界清晰的任务交给后台跑，或从手机消息入口调度 Agent。前者通常以分支和 PR 交付，后者更像多渠道的个人助理/编排入口，不能简单当成同一种“编程 CLI”。[OpenClaw 多 Agent 文档](https://docs.openclaw.ai/multi-agent)

至于 Pi + MiniMax，这确实是多模型可插拔路线的一个具体例子。Pi 是可以接不同模型的编码 Agent 框架，MiniMax 也发布了自己的终端编码 Agent。它值得关注，但目前我没有找到可与 Stack Overflow、JetBrains 调查同口径的用户规模数据，所以不能说它已经是使用人数最多的方案。[Pi 项目](https://github.com/badlogic/pi-mono) · [MiniMax Code 项目](https://github.com/MiniMax-AI/minimax-code)

## GitHub 星数能说明什么？

截至 2026 年 10 月 9 日，我通过 GitHub REST API 读取了几个开源项目的 Stars：OpenClaw 约 39.1 万，OpenCode 约 21.2 万，Codex CLI 仓库约 12.8 万，Pi 约 11.4 万；Cline 约 7 万，Goose 约 5.5 万，Aider 约 4.9 万。数值按千位取整，项目持续变化。[OpenClaw](https://github.com/openclaw/openclaw) · [OpenCode](https://github.com/anomalyco/opencode) · [Codex CLI](https://github.com/openai/codex) · [Pi](https://github.com/badlogic/pi-mono) · [Cline](https://github.com/cline/cline) · [Goose](https://github.com/block/goose) · [Aider](https://github.com/Aider-AI/aider)

这个榜单看的是开源仓库关注度，不是活跃用户、企业部署或付费规模。OpenClaw 的星数尤其不能直接和编码 Agent 对比：它覆盖消息接入与多 Agent 路由，使用场景比“在终端改代码”宽得多。闭源产品也没有同口径的仓库指标。

## 社交平台上，大家具体怎么玩

公开讨论里能找到一些重度用户的具体做法。Claude Code 的创建者 Boris Cherny 分享过自己在终端并行运行多个 Claude 会话，也会用云端会话；他的帖子还强调给 Agent 留验证工作的反馈回路。[Boris Cherny 的 X 帖文](https://x.com/bcherny/status/2007179832300581177)

OpenClaw 方面，创业者 Nikil Viswanathan 分享过用多个 Telegram 群组分别管理 Agent 的做法。[Nikil 的 X 帖文](https://x.com/nikil/status/2024290446789472591)另一些人会让一个 Agent 负责实现、另一个做审查或复现。它们都是可核对的公开个案，不足以说明“多数人都这么用”。

这些实践能说明“可以怎么搭”，但不能说明“多数人都这么用”。X 上更容易看到愿意公开分享配置的重度用户；小红书公开可检索内容里教程和推广帖较多，我没有找到足以代表用户整体的、可复核配置样本。因此本文不把社交平台热度折算成市场份额。

## 所以，当前主流到底是什么？

如果“主流”指调查里被更多开发者使用，答案是 **Claude Code、GitHub Copilot 和 Codex 处在第一梯队**，Cursor 仍然重要。若看开源和多模型玩法，OpenCode、Pi、Cline、Aider 等有清晰的一席之地。若看从手机消息调度多个 Agent，OpenClaw 是值得留意的编排路线，但它不代表传统编码 CLI 的使用率。

这也解释了为什么社交媒体给人的印象会和调查有出入：最活跃的讨论往往来自爱折腾新工具的人，而调查样本覆盖的开发者面更宽。网上能看到最有趣的组合，不一定是人最多的组合。

我现在更愿意把这张图当作一张路线图，而不是冠军榜：先决定你需要的是 IDE 内协作、终端执行、云端异步，还是多模型切换；再选 Agent；最后验证模型和 Provider 的兼容性。选一套能稳定完成自己手头任务的流程，比追着每周换一个新工具实在。

## 资料与口径

- Stack Overflow Developer Survey 2026 的 AI Agent 题：过去一年使用情况，多选；具体选项和人数见[原始数据页](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent)。
- JetBrains Developer Ecosystem Survey 2026：报告说明样本超过 15,000 名专业开发者、按地区等因素加权；采用率为 2026 年 5–7 月数据，详见[原报告及方法说明](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)。JetBrains 本身也经营开发者工具，因此阅读其自家产品数据时应保留这一背景。
- 时间线以产品厂商或 GitHub 的公告日期为准；市场采用率来自调查采集期，不把发布日期当作数据采集日期。
- GitHub Stars 为 2026 年 10 月 9 日 API 读取的瞬时值，变化快，仅作项目关注度参考。
- 社交平台帖文用于说明公开玩法，不用于推算使用比例。

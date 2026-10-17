# AI 交互形态与术语审校

## 交互形态演进与相关概念

### Takeaway

建议把主线讲成“人提供问题 → 人提供更好的指令 → 人管理多轮任务所需的信息 → 模型调用工具并循环执行 → 人设计运行边界与验证机制”，而不要把 Prompt engineering、Context engineering、agent、harness 描述为一条严格、统一命名的行业阶段序列。MCP 是连接模型/客户端与外部工具、数据源的开放协议之一，不是“上下文协议”的全称，也不等于 agent 或 harness。

### Cited Findings
- MCP 的正式全称是 **Model Context Protocol**。官方将其称为连接 AI 应用与外部系统的开放标准，采用 host/client/server 架构；server 可暴露 tools、resources、prompts。翻译宜用“模型上下文协议”。[MCP Introduction](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)；[MCP Architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture)
- MCP 工具调用的边界：协议定义发现和调用工具的交互方式；实际应用仍需控制授权、用户确认与执行安全。它不是 AI 行为的完整“规范框架”。[MCP Tools](https://modelcontextprotocol.io/docs/2026-07-28/server/tools)
- OpenAI 的官方提示词指南把 prompt engineering 描述为编写指令以引导模型输出的实践；该实践在 2023 年生成式 AI 普及后广受关注，但它不是新出现的正式职业资格/标准职称。[OpenAI Prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- “Prompt engineer 年薪百万”是媒体/招聘市场中的个别岗位与薪酬叙述，不宜作为普遍事实。提示词设计能力仍有用，但模型指令遵循能力增强、产品界面和工作流吸收复杂度后，许多用户不再需要掌握复杂提示模板；这属于趋势判断，应以“门槛下降/部分内化”表述，不宜说该能力消失。[OpenAI Prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering)
- **Context engineering**（上下文工程）近年常用于描述：为模型在特定任务时选择、组织、更新有效上下文，包括指令、对话历史、检索内容、工具结果等。术语尚未形成单一标准定义；不等同于“context learning”。[Anthropic: Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- **In-context learning**（上下文学习/语境学习）是模型在输入中看到任务说明或示例后，临时表现出任务学习能力的研究术语，通常不意味着模型权重被更新；不是“多轮聊天”或“上下文工程”的同义词。[Brown et al., Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165)
- Agent 通常指模型在循环中决定下一步、调用工具、观察结果并继续，直到完成任务或交还控制；“agent”并没有唯一严格定义。Anthropic 建议区分预先编排的 workflows 与由模型动态控制流程的 agents。[Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- Coding agent 是可使用代码编辑、终端、测试、检索等工具完成软件任务的 agent 类应用；可以宽泛地译作“编码智能体”，但“代理”是 agent 的字面翻译，中文听众可能误解为网络代理/中介。建议首讲用“智能体（agent）”，之后用“编码智能体/编程智能体”。[OpenAI Codex](https://openai.com/index/introducing-codex/)；[Anthropic Claude Code overview](https://docs.anthropic.com/en/docs/claude-code/overview)
- **Harness** 在 agent 工程语境里是围绕模型的运行环境/控制层：提供工具、上下文组装、权限、循环控制、状态与检查/验证机制。它不是 MCP 的别名，也不是一个已标准化、模块固定的协议；不同团队对 harness 的范围定义略有差异。[OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)；[Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)

### Inferences
- 语音识别中的“哈尼斯 / Hannes / 哈里斯 / Holis”按上下文大概率都在说 **harness**（音近“哈尼斯”），不是名为 H1 或 Holis 的通用 AI 框架。推荐统一改成“agent harness（智能体运行框架/运行环境）”，并把权限、工具清单、上下文、执行循环、验证等作为常见组成，而非声称每个 harness 都有同一套固定模块。
- “上下文提示词功能是 CE，context learning”建议改为：“后来大家开始重视 context engineering（上下文工程）：不仅写一句提示词，还要为任务准备合适的上下文，例如历史对话、文件、检索结果和工具返回。它和研究术语 in-context learning（上下文学习）不是一回事。”
- 可把能力变化作为易懂的讲述线索，但避免暗示技术年代严格切分：提示词工程偏“怎么说”；上下文工程偏“给它什么信息、如何组织”；agent 偏“让模型能采取行动并迭代”；harness 偏“用什么运行机制、权限与验证来约束和支撑它”。

### Gaps
- “H1”无法从语音文本或一项通用标准确认其所指；除非能回听音频，不建议保留该缩写。
- “提示词工程师”具体何时作为招聘职位兴起、年薪百万是否有代表性，需要具体招聘数据与地区/年份限定；仅凭媒体故事不能推断其普遍性。

## 产品边界：Claude Code、Codex、Manus、OpenClaw、WorkBuddy

### Takeaway

这些产品都可涉及 agent 式能力，但产品形态、运行权限、主要任务与部署边界不同，不能统称成一个“AI 操作系统”，也不宜把某个产品宣传中的 autonomous/agent 直接解释为完全自主或安全地替用户操作所有软件。应根据官方定义讲“编码智能体、通用任务智能体、个人助理/自动化代理”等类别，并提醒具体能力随版本变化。

### Cited Findings
- **Claude Code**：Anthropic 定义为 agentic coding tool，可理解代码库、编辑文件、运行命令并与开发工具集成；主要定位软件开发工作流。[Claude Code overview](https://docs.anthropic.com/en/docs/claude-code/overview)
- **OpenAI Codex**：OpenAI 将 Codex 描述为云端软件工程 agent，可在隔离环境中并行处理工程任务；它与 ChatGPT 产品内 Codex 能力、Codex CLI/本地工具形态需区分，具体入口会随产品演进。[Introducing Codex](https://openai.com/index/introducing-codex/)；[Codex CLI](https://github.com/openai/codex)
- **Manus**：官方将其定位为通用 AI agent，目标是处理用户委派的复杂任务；这是厂商产品定位，不足以证明它是操作系统或能可靠操作所有外部应用。[Manus](https://manus.im/)
- **OpenClaw**：官方项目描述为可自托管的个人 AI assistant，连接用户已有渠道并运行在用户自己的设备/环境；其开放式工具与本地部署特征，意味着权限配置和暴露面属于产品使用边界。[OpenClaw repository](https://github.com/openclaw/openclaw)；[OpenClaw docs](https://docs.openclaw.ai/)
- **WorkBuddy**：腾讯云官方产品介绍将其描述为 AI 办公/智能体产品，提供办公任务处理能力，面向个人和团队办公场景；准确功能应以当前官方页面和版本为准。[WorkBuddy](https://www.workbuddy.ai/)
- 这些产品的 agent 能力不等价于操作系统：Agent 是完成任务的应用/运行模式；操作系统通常管理底层计算资源、进程、文件、权限及应用运行。现有产品可能集成操作系统 API、浏览器、终端或云沙箱，但不能据此称其已取代 iOS/Android/Windows/macOS。[Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)；[OpenAI Codex](https://openai.com/index/introducing-codex/)

### Inferences
- 直播中可把 Claude Code、Codex 作为“编码 agent/开发工具”；Manus 作为“通用任务 agent 产品”；OpenClaw 作为“可自托管、可接入消息渠道的个人助理框架/项目”；WorkBuddy 作为“办公场景产品”。需要强调产品迭代快，以上是品类而非永久能力清单。
- “AI 操作系统”宜作为预测或比喻提出：谁能统一调度个人数据、应用、权限和硬件，谁可能成为重要入口；但目前不能把这些 agent 产品的现状表述成已具有传统操作系统的资源管理和生态控制能力。

### Gaps
- 厂商页面会更新，WorkBuddy 与 Manus 的具体接入渠道、权限范围、商业版本功能应在直播前按当时产品文档复核。
- “豆包手机”相关能力与系统级访问权限涉及机型、合作状态和地区版本，不能从短视频或媒体报道推断为所有应用都可被无条件调用；本任务未做逐机型/逐版本验证。

## 语音稿其他需校正的术语

### Takeaway

优先保留可核实的术语并改正明显音近错词；模型名、版本号、公司归属、融资与估值等快变事实不能靠语音转写校准，须另做时点核查。特别是“训练了全 GitHub 所有代码所以模型突然开窍”属于过度简化的因果叙述，不应作为确定事实。

### Cited Findings
- GPT-4 技术报告说明其训练方法和数据细节未公开，不能据此断言 GPT-4 是通过“微软把 GitHub 全部代码交给 OpenAI 训练”而产生能力跃迁。[GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)
- OpenAI 公开的 Codex 研究介绍了 GPT-3 的代码能力，并提到使用来自 GitHub 的公开代码数据训练 Codex；这是早期 Codex 研究，不等同于“GPT-4 全部训练了 GitHub”。[OpenAI: Introducing Codex](https://openai.com/index/openai-codex/)
- 2025 年 OpenAI 使用 **“Harness engineering”** 描述工程师通过仓库结构、约束和工具环境来支撑 coding agents 的实践；这个术语可对应用户讲的 AI “缰绳/运行框架”，但它属于工程实践概念，不是统一的产业标准。[OpenAI: Harness engineering](https://openai.com/index/harness-engineering/)
- “模型规模越来越大，因此上下文容量也必然变大”并不严谨：参数量（模型权重规模）与上下文窗口（一次推理可处理的 token 上限）是不同指标，不能直接画等号。[OpenAI API: Models](https://platform.openai.com/docs/models)；[Anthropic context windows](https://docs.anthropic.com/en/docs/build-with-claude/context-windows)

### Inferences
- “Clang code / CLIPCODE / 克劳 code”应为 **Claude Code**；“ChatGPT 4.0”多半指 GPT-4o 时应核对语境，不建议未经确认替换；“Hannes/哈里斯/Holis”应暂按 **harness** 标注待回听确认。
- “算法”不是 2016/2017 才出现；推荐系统和机器学习更早已存在。若讲个人经历，可说“我在 2016/2017 年左右明显感受到算法推荐岗位进入更多公司的业务团队”，避免称为算法的诞生。
- “程序员都不太会写代码的算法岗”会造成误解：算法工程师通常也需要编程，工作重点更多在建模、实验、数据和算法工程化，岗位职责因公司而异。
- 讲行业演进时，避免把“所有互联网公开文本都被模型读过”“Codex 可独立完成开发”“agent 可直接部署生产”等绝对表达。宜改成“训练数据覆盖大量公开/授权/人工生成数据；在一定工具和权限范围内可完成多步开发任务；关键操作仍需要授权、测试和人工验收”。

### Gaps
- Claude Code 3.5/3.7 的确切发布时间、当时能力与后续模型版本名称需依 Anthropic 官方历史公告单独校对；不能把语音里的“Sonnet 5.5、Opus 5.5、GPT-5.6、Grok 4.7、Gemini Flash 4.0”等当成已核实名称。版本漂移非常快，直播稿应标注核验日期。
- 用户说的“顿悟/开智/开窍”可能对应行业讨论中的“GPT-4 时刻”、scaling/emergent abilities、模型能力跃迁等说法，但未能确认其特指某一个正式事件或专业术语。建议说“体验上像突然开窍”，明确这是使用者感受，不是已证实的单一机制。

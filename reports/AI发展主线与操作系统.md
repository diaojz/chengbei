# 把 AI 从聊天讲到系统

这场直播最有力的主线，不是“AI 又出了哪些新工具”，而是计算能力怎样一步步从少数机构的机器，变成人人桌上的电脑、口袋里的联网设备，再变成能理解意图并调用工具的软件代理。推荐算法让软件开始替不同的人分发不同内容；生成式模型又让软件能按人的意图生成答案和方案；Agent 则把模型接入工具、执行和反馈循环。我的核心判断是：**AI 正在争夺一种新的平台入口——跨应用理解意图、协调行动并管理授权的控制层**。它可能成为传统操作系统之上的 Agent 层，也可能被 Android、iOS、Windows 等现有系统吸收；“AI 操作系统”目前是有解释力的趋势假说，不是已经定型、必将取代手机操作系统的事实。整场直播可以围绕一个问题推进：当软件从“等人逐个打开”变成“人说目标、系统代为协调”，谁来连接应用、数据、权限与用户信任？

## 开场可以这样讲：每一代计算都在降低使用门槛

“我想从一台大到占满房间的电脑讲起。早期计算机昂贵、笨重，只能由少数机构使用；后来个人电脑把计算带到办公桌，互联网把电脑彼此连起来，智能手机又把联网电脑装进口袋。每一轮变化，大家一开始都容易低估：这么贵、这么复杂的东西，普通人真的用得上吗？当然，那个‘全世界只需要五台电脑’的故事流传很广，却没有可靠的一手证据证明它真是 IBM 总裁 Watson 的原话，所以我把它当作一则来源存疑的时代寓言，而不当成历史事实。今天 AI 也走在类似的路上：先回答问题，再调用工具做事。接下来我想讨论的不是又一个聊天框，而是当 AI 开始替我们跨软件完成任务，谁会成为它的入口、运行环境和规则制定者？”

## 从房间里的计算机到口袋里的联网电脑

历史部分建议按“可获得性、交互方式、连接能力”三条线讲，而不是把某家公司说成单独发明了一个时代。ENIAC 于 1946 年公开亮相，是早期大型、可编程、通用电子数字计算机的重要里程碑，体量约占一间大房间；“市场只需要五台电脑”则是后来常归于 IBM 总裁 Thomas J. Watson 的轶闻，尚无可靠同期记录支持，适合作为“人们曾低估计算普及”的引子，但要立即说明归属存疑。([宾夕法尼亚大学 ENIAC 史料](https://www.seas.upenn.edu/about/history-heritage/eniac/)，[Snopes 对五台电脑说法的核查](https://www.snopes.com/fact-check/thomas-watson-five-computers/))

个人电脑没有由一个人或一家公司一夜发明。微软 1985 年推出 Windows 1.0，提供图形化操作环境；苹果 Macintosh 于 1984 年上市，把鼠标和图形界面带入更广的个人电脑市场，但它不是世界上第一台图形电脑。接下来，Tim Berners-Lee 在 CERN 提出并实现 World Wide Web。**Web 是运行在互联网之上的信息系统，互联网本身更早存在**。2007 年 iPhone 将电话、音乐播放器和互联网通信体验整合进一台触屏设备，显著推动智能手机普及，但它既不是第一部智能手机，也不是移动互联网的起点。([微软 Windows 历史](https://news.microsoft.com/announcement/windows-1-0/)，[Apple Macintosh 发布档案](https://www.apple.com/newsroom/1984/01/24Apple-Introduces-Macintosh/)，[CERN：Web 的诞生](https://home.cern/science/computing/birth-web)，[Apple iPhone 发布公告](https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/))

移动网络的代际升级降低了视频、云服务、移动支付等产品的延迟和传输成本，但不能讲成“4G 发明了微信支付”或“5G 必然创造某个新应用”。应用规模化通常来自网络、设备、支付基础设施、商业模式和用户习惯共同成熟。更适合口播的句子是：“技术的价值常常要等到产品、基础设施和使用习惯碰到一起，才显现出来；我们很难只凭网络规格预言具体赢家。”([ITU 3G/IMT-2000](https://www.itu.int/rec/R-REC-M.1457/en)，[ITU 4G/IMT-Advanced](https://www.itu.int/rec/R-REC-M.2012/en)，[ITU 5G/IMT-2020 愿景](https://www.itu.int/rec/R-REC-M.2083/en))

## 软件从分发内容走向理解意图

推荐算法不是 2016 或 2017 年才出现。Netflix 早在 2006 年就推出 Netflix Prize，目标是改进电影推荐；YouTube 2016 年发表的推荐系统论文则展示了大规模深度学习推荐系统。你可以把 2016—17 年讲成“我在工作中明显感到算法岗位和个性化分发变得普遍”，不要说算法在那时诞生。两个人打开同一款 App 看到不同内容，是推荐系统按用户行为和其他信号排序分发的直观例子。([Netflix Prize](https://www.netflixprize.com/)，[YouTube 推荐系统论文](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/))

生成式 AI 带来的变化，可用“软件从替用户分发内容，走向按用户意图生成答案和方案”概括。传统搜索通常让人找资料、比较来源、自己综合；聊天模型把一部分检索、归纳和表达压缩进对话。但模型生成的是概率性输出，流畅不等于真实。GPT-4 于 2023 年发布，技术报告展示了多项任务上的能力，同时明确没有披露模型架构、训练计算、数据集构成等细节。微软 2018 年收购 GitHub，并不能证明 OpenAI 把全部 GitHub 代码喂给 GPT-4；OpenAI 早期 Codex 研究确实提到用公开 GitHub 代码训练代码模型，但这与 GPT-4 的数据构成是两回事。([GPT-4 技术报告](https://arxiv.org/abs/2303.08774)，[微软收购 GitHub 公告](https://news.microsoft.com/2018/06/04/microsoft-to-acquire-github-for-7-5-billion/)，[OpenAI Codex 研究介绍](https://openai.com/index/openai-codex/))

“模型突然开窍”可以保留为观众熟悉的体验比喻，但不应把它讲成已证实的单一机制。研究界把某些随规模扩大而出现、在小模型中测不到的能力称为“涌现能力”；也有研究指出，部分突变观感可能来自离散评测指标，能力增长本身未必突然。更稳妥的说法是：“模型、训练与对齐方法、推理策略、数据和工具链一起进步；当它跨过一个具体任务的可用门槛，我们的体验就像它突然开窍了。”([涌现能力研究](https://arxiv.org/abs/2206.07682)，[对涌现现象的再分析](https://arxiv.org/abs/2304.15004))

## 从提示词到 Agent，关键变化是执行闭环

这段不要讲成三个有统一年份的“时代”，而讲成人与 AI 分工逐渐改变：提示词工程关注“怎么说清任务”；上下文工程关注“给模型哪些历史、文件、检索材料和工具结果”；Agent 让模型在工具调用、观察结果、再行动的循环里推进任务；harness 则是围绕 Agent 提供工具、上下文、权限、状态和验证的运行环境。**Context engineering（上下文工程）不是 in-context learning（上下文学习），后者是模型根据输入中的说明或示例临时完成任务的研究概念**。MCP 全称 Model Context Protocol，是连接 AI 应用与工具、数据源的开放协议，不是“上下文协议”这一宽泛概念，也不是 Agent 的权限框架。语音中的“Hannes/Holis/H1”应统一改成“harness（智能体运行框架/运行环境）”，除非回听音频后发现另有所指。([Anthropic 上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，[上下文学习论文](https://arxiv.org/abs/2005.14165)，[MCP 介绍](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)，[Anthropic Agent 构建实践](https://www.anthropic.com/engineering/building-effective-agents))

可乐鸡翅例子可以贯穿这一段：早期要反复给角色、背景和格式要求；后来模型更能遵循简单指令；再后来它能参考你的饮食偏好、已有食材和前文讨论；接上工具后，它或许能列购物清单、查库存、准备订单。但“能调用工具”不等于“能不经确认替你付款”，涉及交易、删改、部署等高影响操作仍要有授权、边界和验证。MCP 规定工具如何被发现和调用，实际授权与安全仍由应用实现。([MCP 工具说明](https://modelcontextprotocol.io/docs/2026-07-28/server/tools))

编码是 Agent 较早显出实用价值的场景之一，因为代码能在沙箱或开发环境中运行、测试并返回可检查的结果；不过这是一种产品分析，不是唯一原因，也不意味着 Agent 可以稳定独立交付生产系统。Anthropic 于 2025 年 2 月随 Claude 3.7 Sonnet 推出 Claude Code 研究预览；“Claude Code 3.7”是把模型版本和产品名混在一起。说“它能在受限环境里读代码、改文件、运行命令、结合测试迭代”比说“AI 已替代所有程序员”准确。([Claude 3.7 Sonnet 与 Claude Code 公告](https://www.anthropic.com/news/claude-3-7-sonnet)，[Claude Code GA 公告](https://www.anthropic.com/news/claude-code-now-generally-available))

## AI 操作系统更像一场入口与控制权之争

你的未来判断可以更有锋芒，也要把“预测”和“现状”分开：**如果 AI 要替人跨应用完成任务，关键竞争就不只是模型回答得多聪明，而是谁能让它安全、稳定地访问用户授权的数据、应用动作和设备能力。** 可以把“AI 操作系统”定义为三项能力的组合：自然语言意图入口、跨应用/工具的行动协调、身份与权限/记忆/审计治理。达到这些能力的一部分，不等于已经成为传统 OS。传统操作系统还要管理进程、内存、文件、设备资源和应用运行；当前 Claude Code、Codex、Manus 等各有 Agent 或应用定位，不能因为会调用工具就统称为 OS。([NIST OS 术语](https://csrc.nist.gov/glossary/term/OS)，[Anthropic Agent 实践](https://www.anthropic.com/engineering/building-effective-agents)，[OpenAI Codex](https://openai.com/index/introducing-codex/))

手机 Agent 确实需要系统接口，但未必需要新系统。Apple 的 App Intents 允许开发者向 Siri、Shortcuts 等系统能力暴露结构化动作；Android 无障碍服务可以读取界面节点并执行用户授权的界面操作，但其设计目的和平台政策限制了把它当成无边界自动化通道。欧盟 DMA 下关于 Android AI 互操作性的政策争议，也说明系统入口和第三方 Agent 的访问权正在成为平台竞争与监管议题。较可信的未来不是“iOS/Android 必然消失”，而是 Agent API、意图分发、授权确认和跨应用互操作会成为操作系统竞争的新层。([Apple App Intents](https://developer.apple.com/documentation/AppIntents)，[Android AccessibilityService](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService)，[欧盟 Android AI 互操作进程](https://digital-markets-act.ec.europa.eu/commission-provides-guidance-google-ai-interoperability-android-and-sharing-google-search-data-under-2026-07-16_en))

英伟达的例子可用来说明软件生态如何增加平台价值，但不要把 CUDA 叫成通用操作系统。CUDA Toolkit 提供编译器、运行时、加速库、调试和优化工具；cuDNN、cuBLAS、NCCL、TensorRT、Nsight、NGC 等分别覆盖深度学习算子、线性代数、多 GPU 通信、推理优化、性能分析和预置容器/模型。它们降低开发者使用 GPU 的摩擦，积累开发习惯与经过调优的工作流，带来迁移成本；它们并不证明所有 AI 只能跑在 NVIDIA 上，也无法单独量化对市值的因果贡献。([NVIDIA CUDA](https://developer.nvidia.com/cuda)，[CUDA-X Libraries](https://developer.nvidia.com/cuda/cuda-x-libraries)，[TensorRT](https://developer.nvidia.com/TensorRT)，[NVIDIA Deep Learning Software](https://developer.nvidia.com/deep-learning-software))

“掌握操作系统的人就成首富”不成立为历史定律。系统和应用商店能够影响分发、接口和生态分成，因此可能带来平台议价权；实际价值还取决于硬件销量、网络效应、商业模式、竞争、互补产品和监管。直播中可以说：“入口层有很强的价值捕获机会，但谁赢、能收多少租，还要看开发者愿不愿意接、用户信不信任、平台开放到什么程度。”

## 让观众带走一张可检验的路线图

直播提纲可以压成五幕：第一幕，计算从房间走到桌面、网络再走进口袋，解释“能力普及”如何打开新产品空间；第二幕，推荐算法让软件开始理解用户差异，生成式 AI 让软件开始理解人的表达意图；第三幕，提示词、上下文、Agent、harness 依次改变人机分工，强调这是一条能力线索而非严格的年代分期；第四幕，以编码 Agent 展示“能回答”走向“能行动”，同时讲清测试、权限和人工验收；第五幕，提出 AI OS 假说：未来争夺的是跨应用意图入口与执行控制层，并用可检验问题收尾——它能否稳定跨应用完成高价值任务？用户是否愿意授予权限？开发者是否愿意提供标准动作接口？现有 OS 会吸收它，还是第三方/云端 Agent 能建立独立入口？

| 幕 | 观众要听懂什么 | 转场句 / 画面建议 |
|---|---|---|
| 1. 算力走向大众 | 计算机、PC、Web、智能手机与移动网络是可获得性、交互和连接的连续变化 | “每一代都先让人觉得太贵或用不上，后来才长出新习惯。” |
| 2. 软件开始认识人 | 推荐系统按人分发内容；生成式模型按意图组织答案 | 同一个 App，两个人看到不同首页；随后切到同一个问题得到的自然语言回答 |
| 3. 从会回答到能行动 | Prompt、上下文、Agent、harness 分别改变指令、信息、行动和边界 | 用可乐鸡翅贯穿：问做法、结合偏好、列采购、需要授权下单 |
| 4. Agent 的早期落点 | 编码任务容易运行、测试、回看结果，因而较早出现可用闭环 | 演示“读需求—改代码—跑测试—人工验收”，强调错误仍需发现 |
| 5. AI OS 是待检验假说 | 新平台入口可能是意图、跨应用协调和权限治理的组合 | 收尾问三个问题：能否稳定跨 App？用户肯否授权？开发者肯否开放动作？ |

| 口述说法 | 建议替换成 | 原因 / 证据 |
|---|---|---|
| “全世界只能卖两台/五台电脑”，归于 Watson | “五台电脑是常归于 Watson、但缺乏可靠同期出处的轶闻。” | 不把来源存疑的引语当史实。([Snopes](https://www.snopes.com/fact-check/thomas-watson-five-computers/)) |
| “微软发明 Windows，做了电脑” | “微软推出 Windows 操作环境；个人电脑由多家公司和产业链共同发展。” | Windows 是软件，不代表微软因此成为电脑硬件制造商。([Microsoft](https://news.microsoft.com/announcement/windows-1-0/)) |
| Macintosh 是第一台图形电脑；Web 就是互联网 | “Macintosh 推广了图形界面；Web 是互联网之上的信息系统。” | 避免把重要商业化/普及节点说成技术首创，避免混淆网络与应用系统。([CERN](https://home.cern/science/computing/birth-web)) |
| 算法在 2016/17 才出现，算法岗不写代码 | “推荐系统早已存在；我在 2016/17 年左右明显感到相关岗位扩张。” | Netflix Prize 2006 年已聚焦推荐；算法工程师通常也需要编程。([Netflix Prize](https://www.netflixprize.com/)) |
| GPT-4 因微软把整个 GitHub 喂给 OpenAI 才开窍 | “GPT-4 数据细节未公开；代码能力提升不能归因于未经证实的全量 GitHub 训练。” | GPT-4 报告未披露训练集；Codex 早期研究提及公开 GitHub 代码，不等于 GPT-4 训练事实。([GPT-4 报告](https://arxiv.org/abs/2303.08774)，[Codex](https://openai.com/index/openai-codex/)) |
| “顿悟/开窍”是模型发生的单一机制 | “体验上像突然开窍；学术上的涌现能力有定义，也有测量方式争议。” | 部分突变现象可能来自评测指标选择。([涌现能力](https://arxiv.org/abs/2206.07682)，[再分析](https://arxiv.org/abs/2304.15004)) |
| Context engineering = context learning；MCP 是上下文协议 | “上下文工程是组织任务信息；in-context learning 是模型根据输入示例临时表现任务能力；MCP 是 Model Context Protocol。” | 三个术语分别指信息设计、模型行为和工具/数据连接协议。([上下文工程](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)，[MCP](https://modelcontextprotocol.io/docs/2026-07-28/getting-started/intro)) |
| “Hannes/Holis/H1”是通用 AI 框架 | “大概率指 harness，即 Agent 的运行环境/控制层；回听后再定稿。” | Harness 尚无单一标准模块，不要讲成名为 H1/Holis 的协议。([OpenAI Harness engineering](https://openai.com/index/harness-engineering/)) |
| Claude Code 3.7 | “Claude Code 随 Claude 3.7 Sonnet 于 2025 年 2 月作为研究预览推出。” | 前者是产品，后者是模型版本。([Anthropic](https://www.anthropic.com/news/claude-3-7-sonnet)) |
| 参数越多，上下文自然越长 | “参数规模与上下文窗口是不同指标。” | 模型权重数量不能推出一次推理可处理的 token 上限。([OpenAI models](https://platform.openai.com/docs/models)，[Anthropic context windows](https://docs.anthropic.com/en/docs/build-with-claude/context-windows)) |
| Agent 有了工具就能安全替人做完所有事 | “Agent 可在授权工具和运行边界内行动；高影响操作要确认、测试、审计。” | 工具协议不自动提供授权、安全和正确性保证。([MCP tools](https://modelcontextprotocol.io/docs/2026-07-28/server/tools)) |
| 操作系统掌权者必成首富；AI OS 必然取代 iOS/Android | “系统入口可能带来分发与议价权；AI OS 是一种竞争方向，替代结果未定。” | 生态、商业模式、用户信任、开发者接口和监管共同影响结果。([NIST OS](https://csrc.nist.gov/glossary/term/OS)，[欧盟 Android AI 互操作](https://digital-markets-act.ec.europa.eu/commission-provides-guidance-google-ai-interoperability-android-and-sharing-google-search-data-under-2026-07-16_en)) |
| 人形机器人不适合所有工作；一人公司/岗位消失已是现实 | “机器人形态需按任务、成本和效率比较；一人公司及岗位变化属于预测。” | 这些是趋势判断，不是本次来源支持的既成事实。 |

## 直播前必须复核的快变内容

录制时把产品名称、版本号、收费额度、市场估值、用户量、豆包手机具体机型/系统版本/可调用 App 范围、Manus 与 WorkBuddy 的功能，以及 OpenAI、Anthropic、Google、xAI、DeepSeek、智谱的最新模型名称重新查官方公告，并在画面或口播中标注核对日期。尤其删除未核实的“Opus 5.5、Sonnet 5.5、GPT-5.6、Grok 4.7、Gemini Flash 4.0”等语音转写名称，不要照稿念。市值和“用户量破亿”须注明统计口径、日期及来源。不得把“美国政府叫停某模型”“模型能挖出人类多年未发现的 bug”“某公司估值几十亿美元”等说法凭印象讲成定论；若要保留，必须补上具体政策文件、案例、估值交易原文。5G/3G 速度也要标明理论峰值还是商用实测、地区和年份，最好不放入主线，以免把传播机制讲成单因果。

## Conclusion

最能让观众听懂的判断不是“AI 会取代操作系统”，而是“软件的入口可能从 App 图标变成意图；软件的价值可能从提供功能，转向代表用户协调功能”。下一轮平台竞争会围绕三件事展开：**谁听懂意图，谁拿到可审计的执行权限，谁能让应用和用户都愿意参与**。把它称为 AI OS，能帮观众抓住方向；把它当作已经确定的产品结局，则会过度承诺。把预测讲成一组能观察、能被推翻的问题，反而能让这场直播更有洞见，也更可信。

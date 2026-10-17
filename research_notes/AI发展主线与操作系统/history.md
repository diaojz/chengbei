# 计算机到移动互联网再到生成式 AI：历史节点研究笔记

## 计算机、个人电脑、互联网与移动网络的历史主线

### Takeaway
演讲可以用“计算能力从少数机构掌握，逐渐成为个人可用、随身携带、持续联网的基础设施”串联计算机、PC、Web、智能手机与移动网络。ENIAC 是早期电子通用计算机的重要代表，但“全世界只卖得出两台/五台”不应当作可靠史实；它更适合作为当时对计算市场规模认知有限的寓言，并明确标为流传说法。

### Cited Findings
- ENIAC（Electronic Numerical Integrator and Computer）由宾夕法尼亚大学团队设计建造，1946 年公开亮相，是早期大型、可编程、通用电子数字计算机的重要里程碑；其体量约占一间大房间，主要服务弹道计算。宾大历史资料可作机构一手来源：[ENIAC at Penn Engineering](https://www.seas.upenn.edu/about/history-heritage/eniac/)。
- “世界市场大约需要五台计算机”常被归于 IBM 总裁 Thomas J. Watson（有时说 1943 年），但可追溯的一手演讲、信件或同时代记录没有在本次查证中找到。不要把这句话作为 Watson 的确证原话；可表述为“后来广泛流传、归属存疑的轶闻”。参见 [Snopes 对五台电脑引语的核查](https://www.snopes.com/fact-check/thomas-watson-five-computers/)；这是事实核查而非同期一手档案。
- Microsoft 官方历史将 Windows 1.0 发布记为 1985 年 11 月 20 日；它提供图形界面运行环境，但“微软发明了 Windows，做了电脑”不准确：Windows 是操作系统/图形环境，微软并非因此成为个人电脑硬件制造商。[Microsoft Windows history](https://news.microsoft.com/announcement/windows-1-0/)。
- Apple Macintosh 于 1984 年推出，Apple 的产品发布档案可核其发布时间；Macintosh 并非首个图形用户界面或首台图形电脑，适合说它把图形界面与鼠标交互带入更广泛的个人电脑市场。[Apple Macintosh 1984 archive](https://www.apple.com/newsroom/1984/01/24Apple-Introduces-Macintosh/)。
- Tim Berners-Lee 在 CERN 发明 World Wide Web；他于 1989 年提出信息管理设想，1990 年开发首个浏览器/服务器，1991 年向互联网社群开放。Web 是运行在互联网之上的信息系统，不等于互联网本身。[CERN: The birth of the Web](https://home.cern/science/computing/birth-web)。
- Apple 于 2007 年 1 月 9 日发布 iPhone，强调电话、宽屏 iPod 和互联网通信设备三合一。它不是智能手机或移动互联网的起点，但显著推动触屏智能手机成为大众产品。[Apple 2007 iPhone announcement](https://www.apple.com/newsroom/2007/01/09Apple-Reinvents-the-Phone-with-iPhone/)。
- ITU 将 IMT-2000 作为 3G 全球框架，IMT-Advanced 对应 4G；ITU-R 对 5G 的正式愿景为 IMT-2020。代际名称对应标准和能力目标，不是某一项应用诞生的单一原因。[ITU IMT-2000](https://www.itu.int/rec/R-REC-M.1457/en)；[ITU IMT-Advanced](https://www.itu.int/rec/R-REC-M.2012/en)；[ITU IMT-2020](https://www.itu.int/rec/R-REC-M.2083/en)。
- 更快、更普及的移动网络降低了视频、云服务、移动支付等服务的延迟与传输成本，是它们规模化的重要条件；但不能简化成“3G 已经能瞬间加载图片，4G/5G 分别直接创造了微信支付/某款产品”。网络、智能手机、支付基础设施、商业模式和用户习惯共同作用。ITU 的 IMT-2020 愿景同时强调增强移动宽带、海量机器通信、超可靠低延迟通信，说明 5G 的许多设想是应用需求与网络能力协同演进，而非“先有网络必然长出某应用”。[ITU IMT-2020](https://www.itu.int/rec/R-REC-M.2083/en)。

### Inferences
- 可用“从少数人能接触的昂贵计算资源，到每个人桌上的电脑，再到口袋里的联网电脑”做历史主线。将“算力可及性/交互方式/连接能力”作为每一代变化的三个观察维度，是演讲组织方式，不是来源中的原话。
- “五台电脑”故事可保留为引子，但须当场揭示其来源不可靠，避免让轶闻承担历史证据。

### Gaps
- 本轮未找到“五台电脑”说法的最早可核同期出处，因此不能断言准确说话者、年份或原文。若演讲必须讲此故事，建议只说“常被误传为 Watson 的一句话”，不要给出确定引号。
- “3G、4G 速度各是多少、何时足以承载某应用”需要按标准理论峰值、商用网络实测和地区分别处理；不宜用单个速度值代表整代网络。

## 推荐算法、生成式模型与“能力跃迁”

### Takeaway
2010 年代中期，推荐系统已成为大规模互联网服务的重要产品机制，用户看到不同内容的例子有坚实依据；但 AI/算法并非 2016–17 才出现。ChatGPT/GPT-4 的代码能力可谈“模型能力和产品工具链快速改善”，不宜讲成 OpenAI 把 GitHub 全量喂给 GPT-4 后突然开窍：OpenAI 没有公开这种训练细节，GPT-4 技术报告也明确限制了披露训练数据与架构信息。

### Cited Findings
- YouTube 研究团队 2016 年发表的推荐系统论文描述了由候选生成和排序组成、用于 YouTube 大规模视频推荐的深度神经网络系统；这是解释“同一应用对不同用户呈现不同内容”的直接一手研究来源。[Deep Neural Networks for YouTube Recommendations (2016)](https://research.google/pubs/deep-neural-networks-for-youtube-recommendations/)。
- Netflix 的个性化推荐早于 2016 年；Netflix 2006 年宣布 Netflix Prize，目标是改善电影推荐准确度，说明推荐系统不应被讲成 2016–17 年才“出现”。[Netflix Prize announcement (2006)](https://www.netflixprize.com/)。
- GPT-4 发布于 2023 年 3 月 14 日。OpenAI 报告称 GPT-4 在若干专业/学术基准上表现提升，并展示了文本与图像输入能力；报告特别指出，为竞争与安全考虑，不提供关于架构（包括模型大小）、硬件、训练计算量、数据集构造、训练方法等进一步细节。因此“训练进了全 GitHub”没有此报告支持。[GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)；[OpenAI GPT-4 announcement](https://openai.com/index/gpt-4/)。
- GPT-4 技术报告提到模型在多项考试和编码任务上的能力表现，但这不等于它能稳定地独立交付生产软件；生产能力还受工具调用、运行环境、验证循环、权限和人为监督影响。[GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)。
- “涌现能力”有学术定义与争论。Wei 等人在 2022 年将其定义为小模型中不存在、模型规模达到一定程度后出现的能力，并汇总若干基准现象。[Emergent Abilities of Large Language Models (2022)](https://arxiv.org/abs/2206.07682)。
- 后续论文指出，一些所谓涌现可能是由离散/非线性评测指标导致的表观突变；换用连续指标时，能力增长可能更平滑。这意味着“顿悟/开窍”是有传播力的比喻，不是公认的模型内部机制解释。[Are Emergent Abilities of Large Language Models a Mirage? (2023)](https://arxiv.org/abs/2304.15004)。
- GitHub 是微软于 2018 年收购的平台，而 GPT-4 在 2023 年发布；时间顺序不能证明“微软先拥有 GitHub，因此 OpenAI 将所有 GitHub 代码训练进 GPT-4”。OpenAI 未披露足以验证该说法的训练集清单。[Microsoft to acquire GitHub (2018)](https://news.microsoft.com/2018/06/04/microsoft-to-acquire-github-for-7-5-billion/)；[GPT-4 Technical Report](https://arxiv.org/abs/2303.08774)。

### Inferences
- 推荐系统到大模型的叙事转折，可讲成软件从“根据行为分发内容”进一步走向“根据自然语言意图生成内容/方案”。这是产品交互范式的概括，不是说推荐算法被大模型取代。
- “突然开窍”建议改为“规模扩大、训练与对齐方法、数据、推理策略、工具和产品工程共同推动能力跃迁；外部观察者有时会把跨过某个任务门槛描述为涌现”。避免把复杂进展归因于单一 GitHub 数据集或一个未经证实的单点事件。

### Gaps
- GPT-4 的训练数据构成与代码语料比例未公开，无法判断 GitHub 的具体贡献。
- “可以进入生产环境”必须限定任务、模型版本、错误成本与人工验证；不能由一次基准分数或演示推导出普遍可靠性。

## Claude Code 时间线与适合演讲的历史解释

### Takeaway
Claude Code 的公开产品时间线并不支持“Claude 3.7 之前就以 Claude Code 产品形态发布”或“Claude Code 3.7 版本”。Claude Code 于 2025 年 2 月随 Claude 3.7 Sonnet 发布研究预览；Claude 3.5 Sonnet 是此前的模型版本，并在编码能力和计算机使用方面持续升级。演讲应区分“模型版本”与“编码代理产品”。

### Cited Findings
- Anthropic 于 2024 年 10 月 22 日发布升级版 Claude 3.5 Sonnet，并推出 computer use 公测；公告强调其软件编码和工具操作能力，但这不是 Claude Code 的正式产品发布时间。[Claude 3.5 Sonnet and computer use](https://www.anthropic.com/news/3-5-models-and-computer-use)。
- Anthropic 于 2025 年 2 月 24 日发布 Claude 3.7 Sonnet，并同时宣布 Claude Code 作为研究预览产品。官方将 Claude Code 描述为可在终端中工作的 agentic coding tool，可理解代码库、编辑文件、运行命令并与开发工具协作。[Claude 3.7 Sonnet and Claude Code](https://www.anthropic.com/news/claude-3-7-sonnet)。
- Claude 3.7 Sonnet 发布公告将该模型定位为混合推理模型，支持标准模式与扩展思考模式；“Claude Code 3.7”应修正为“Claude 3.7 Sonnet 发布时推出 Claude Code 研究预览”。[Anthropic announcement](https://www.anthropic.com/news/claude-3-7-sonnet)。
- Anthropic 2025 年 5 月宣布 Claude Code research preview 转为一般可用（GA），可用于定位产品成熟与开放范围变化。[Claude Code is now generally available](https://www.anthropic.com/news/claude-code-now-generally-available)。

### Inferences
- 可将编码代理视为生成式模型转向“行动”的早期醒目场景：代码可被执行、测试、比较结果，反馈循环容易自动化；这是为什么 agentic coding 比“让模型直接操作厨房/家庭”更早实用的一种解释。它是合理的产品分析，非 Anthropic 公告证明的唯一原因。
- “Agent 取代十几种程序员岗位”“一人公司”属于预测/宏观判断，需要明确标注为观点，不能写成已被历史证明的事实。

### Gaps
- Anthropic 公告证明了 Claude Code 的发布日期与定位，但不能证明它“用自身完成自身迭代”的程度。若要在直播中讲自我开发比例，需要另找团队的一手访谈或案例，并把协作监督情况讲清楚。
- 对其他同期工具（Codex、Cursor、Trae 等）的相对能力与市场先后，本笔记未作比较；需要按具体版本和日期另查官方发布记录。

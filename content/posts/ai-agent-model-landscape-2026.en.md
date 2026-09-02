# The Models Arrived Together. The Agents Had Already Moved On

By Chengbei

The terminal felt unusually crowded on the first day of September. Claude Code had just displayed an update notice; Codex CLI was refreshing in the next pane. Browser tabs held Anthropic’s Fable 5.1, SpaceXAI’s Grok 4.6, Google’s Gemini 3.1 Pro, still in Preview, and OpenAI’s summer release, GPT-5.6. Kimi, GLM, Qwen, DeepSeek, and other Chinese contenders were filling the same window with updates of their own.

<figure>
  <img src="/assets/img/posts/ai-agent-model-landscape-2026/cover.png" alt="A developer facing surrounding displays filled with model and agent networks">
  <figcaption>Models arrived at the workbench together, but the real competition had already expanded to agents and complete workflows.</figcaption>
</figure>

That cadence creates an easy illusion: that this release season is still about an ever-longer benchmark table. The consequential shift is happening outside the table. Model vendors are competing for the terminal, the IDE, the repository, and the cloud execution environment. The unit of competition is no longer a model. It is a system that can finish the job.

> The dividing line is not who wins a few more benchmark points. It is who can turn intelligence into sustained, controlled, deliverable action.

## What each vendor actually shipped

<figure>
  <img src="/assets/img/posts/ai-agent-model-landscape-2026/chart-4-timeline.png" alt="Timeline of major model releases and the Cursor acquisition from February through September 2026">
  <figcaption>The 2026 release cadence accelerated sharply after June, alongside consolidation around agent entry points.</figcaption>
</figure>

### Anthropic separates its highest-capability tier

On 2026-09-01, Anthropic released Claude Fable 5.1 and Claude Mythos 5.1. They are not one vaguely named “Claude 5.1,” nor are they wholly separate models. They share the same underlying model and differ in safeguards and access. Fable is available to all users as the highest-capability tier for coding, knowledge work, and long-horizon agentic tasks. Mythos is restricted to trusted users in cybersecurity and life sciences. The naming confusion is understandable: “Mythos” is semantically closer than “Fable” to the Chinese word for myth.

Fable 5.1 has a 1M-token context and costs $10 for input, $50 for output, and $0.25 for cache reads per million tokens. Anthropic now has a legible ladder: Haiku 4.5 for low latency and subagents; Sonnet 5 for scaled agentic execution; Opus 5 for everyday premium work; and Fable 5.1 at the top in capability and price.

The headline evidence for the leap is vendor-produced. In Anthropic’s official self-test using the same Terminal-Bench 4.0 harness, Fable 5.1 scored 55.8%, Fable 5 scored 42.0%, Opus 5 scored 52.3%, and GPT-5.6 Sol scored 37.3%. The result is notable, but it remains an Anthropic official self-test, not an independent verdict. On the 2026-09-02 LMArena Text Overall snapshot, `claude-fable-5`—the predecessor, not the too-new 5.1—ranked first at 1508±5. All of the global top three were Anthropic models, which is meaningful evidence that the underlying text experience is strong.

Claude Code may matter more than the benchmark. Its latest stable npm release was 2.1.258 on 2026-09-01. In November 2025, Anthropic said the product had reached $1 billion in run-rate revenue roughly six months after launch, with Netflix, Spotify, KPMG, L'Oréal, and Salesforce among enterprise customers. On the same day, Anthropic acquired Bun while committing to keep it open source under MIT. Combined with its $30 billion Series G on 2026-02-12 at a $380 billion post-money valuation, the company is clearly joining models, developer tools, and runtime infrastructure into one chain.

Market-share evidence points in the same direction but needs context. Menlo Ventures’ *2025 State of Generative AI in Enterprise* estimated Anthropic’s share of US enterprise LLM spending rose from 24% in 2024 to 40% in 2025. That is a research estimate, not audited Anthropic revenue, and Menlo Ventures is also an Anthropic investor.

### OpenAI is turning Codex into a platform

OpenAI released GPT-5.6 on 2026-07-09 in three tiers: flagship Sol, balanced Terra, and high-throughput, low-cost Luna. All have a 1,050,000-token context window, with up to 922,000 input and 128,000 output tokens. They support none, low, medium, high, xhigh, and max reasoning effort, with a 2026-02-16 knowledge cutoff.

Sol costs $4 input, $0.40 cached input, and $20 output per million tokens; those are promotional prices lasting at least until 2026-11-21. Terra costs $2, $0.20, and $12; Luna costs $0.20, $0.02, and $1.20. The ladder is operationally useful: teams can allocate reasoning spend by task value without changing API semantics.

The independent Artificial Analysis Intelligence Index scores GPT-5.6 Sol (max) at 61, precisely 60.93, in v4.1.1’s composite of 9 evaluations. On Terminal-Bench 2.0, Codex agent + GPT-5.6 Sol (max) scored 37.27%, or 123/330. The latter is a system result for the agent plus model, not a bare-model score—a distinction that matters in this market.

For coding, GPT-5.3-Codex is officially positioned as the “strongest agentic coding model.” It has a 400K context, works only through the Responses API, and costs $1.75 input, $0.175 cached input, and $14 output per million tokens. Pro subscribers also have a GPT-5.3-Codex-Spark research preview without public benchmark results. Codex now spans an open-source CLI, IDE extension, desktop app, and Web/Cloud. CLI 0.152.1 was the latest stable release, while its GitHub repository showed 120,864 stars and 18,517 forks when checked on 2026-09-02. Those figures measure open-source attention, not users.

OpenAI’s other moat is procurement. GPT-5.6 is the preferred model in Microsoft 365 Copilot and can be deployed through Oracle Cloud commitments. Samsung has deployed ChatGPT Enterprise and Codex globally; about 9,000 NTT DATA employees use them. The planned Ona acquisition, announced on 2026-06-11, is intended to strengthen secure, persistent cloud execution for Codex. The Cerebras-powered GPT-5.6 Sol Ultrafast tier previewed on 2026-08-13 carries claims of up to 14 times the speed and 750 output tokens per second; these are official supplier specifications, not independent tests.

### Google pairs a multimodal foundation with asynchronous agents

Google’s current flagship remains Gemini 3.1 Pro, released as a Preview on 2026-02-19—not the “coming soon” Gemini 3.5 Pro. It supports 1M input context, 64K output, and text, image, video, audio, and PDF inputs. The newer Gemini 3.7 Flash occupies a different tier for low-cost agent workloads at scale; its version number does not make it the flagship replacement.

Google’s official single-attempt self-tests report 80.6% on SWE-bench Verified, 54.2% on SWE-bench Pro Public, 68.5% on Terminal-Bench 2.0 with the Terminus-2 harness, 33.5% on APEX-Agents, and 77.1% on ARC-AGI-2 with ARC Prize verification. They suggest a high ceiling, but they remain Google self-tests from single attempts.

The more strategic story is the tooling: Gemini CLI is open source under Apache 2.0, with v0.58.0 as its latest stable release; Antigravity is an AI-first platform for multi-agent and complex application development; Jules is an asynchronous repository agent that can work in the background and submit PRs. Integration with Google Cloud and Workspace gives Gemini a life beyond a multimodal chat box.

### SpaceXAI bets on long tasks—and Cursor

The company formerly called xAI now officially uses SpaceXAI. Grok 4.6, released on 2026-08-12, targets long-horizon agents, multi-step research, cross-repository work, and interactive or visual application generation. It is integrated with Cursor, Grok Build, OpenRouter, Vercel, and Cloudflare.

The independent Artificial Analysis Intelligence Index gives it about 61—precisely 60.923—essentially tied with GPT-5.6 Sol at 60.930. In one official SpaceXAI table, the vendor-reported results are 69.9% on CursorBench v3.2, 65.9% on DeepSWE v1.1, 61.3% on FrontierCode v1.1 Extended, and 26.0% on Terminal-Bench v3.0. That last number cannot be placed directly beside Anthropic’s Terminal-Bench 4.0 or OpenAI’s Terminal-Bench 2.0: the versions and harnesses differ, so the decimals create precision without comparability.

Grok Code Fast 1, released on 2025-08-28, launched with GitHub Copilot, Cursor, Cline, Roo Code, Kilo Code, opencode, and Windsurf. Its 70.8% SWE-bench Verified result is also vendor-reported with a proprietary harness and should not be compared mechanically across tables.

### Chinese models: the Chinese-language board changes the picture

Kimi K3 emphasizes agentic coding and knowledge work, supported by Kimi Code, Kimi Agent, Kimi Agent Swarm, and Kimi Claw. GLM-5.3 targets coding agents, tool use, and long workflows; GLM Coding Plan works with Claude Code, Codex, Cline, and OpenCode, starting at $18 per month. Closed-service Qwen3.8-Max sits alongside some Qwen3.x weights released under Apache-2.0 and the Qwen3-Coder model, but there is no reliable public source confirming a standalone Alibaba terminal agent positioned against Claude Code or Codex.

DeepSeek V4-Pro reached GA on 2026-08-13, natively supports the OpenAI Responses API, and can be configured for Codex. Uncached input costs $0.22–0.66 per million tokens and output costs $0.66–1.32. The multimodal experimental V4-Flash-Vision-Exp branch followed on 2026-08-21. MiniMax M3 targets coding and the agentic frontier with native multimodality, a 1M context with 512K guaranteed, and MiniMax Code. MiniMax’s vendor-reported PostTrainBench score is 37.1, ranking third behind Opus 4.7 at 42.4 and GPT-5.5 at 39.3. That comparison uses older-generation rivals. Because its site is inconsistent about current openness, the careful description is that MiniMax has announced an open-weight direction while full release status remains to be seen.

ByteDance released Seed2.1 on 2026-06-23 and officially describes it as a new generation of agent-capable models spanning general agents, end-to-end coding, and native multimodality. Its leadership claims are vendor-reported, and no matching LMArena entry could be confirmed, so there is no reason to invent a score. ERNIE 5.1 has an Arena entry, but no first-party page confirming an exact release date and price was found. Tencent HY3 remains in Preview. Step-3.5-Flash is labeled Apache-2.0 by LMArena. With no reliable public data for a contemporary flagship, 01.AI is left outside the ranking.

## Use tiers, not decimal-point theater

The seductive approach to a model comparison is to pour every score into one column and crown a winner. But each score carries its own benchmark version, harness, and publication date; brand-new models especially lack stable independent results. A more responsible backbone is the 2026-09-02 LMArena Text Overall snapshot, where vendors share one blind-testing protocol, supplemented by coding and agent evaluations. The output should be tiers, not a fake scientific total order.

| Tier | Vendors and representative models | Basis for judgment |
|---|---|---|
| Global frontier | Anthropic Fable 5.1/Mythos 5.1; OpenAI GPT-5.6 Sol; Google Gemini 3.1 Pro; SpaceXAI Grok 4.6 | Fable 5, Anthropic’s predecessor, is first on LMArena; GPT-5.6 Sol and Grok 4.6 are around 61 on the independent index; Gemini posts strong official coding self-tests. Each wins somewhere; none dominates every dimension |
| Frontier challengers | Kimi K3; GLM-5.3; Qwen3.8-Max | LMArena ranks them 10th, 17th, and 20th, with point-estimate gaps of 19, 26, and 29 from the leader |
| Solid, with a wider gap | ERNIE 5.1; DeepSeek V4-Pro; MiniMax M3 | LMArena ranks them 40th, 50th, and 77th; DeepSeek’s pricing is especially strong |
| Early or watchlist | HY3 Preview; Step-3.5-Flash; 01.AI and others | The first two rank 130th and 154th; reliable current progress for 01.AI could not be confirmed |

<figure>
  <img src="/assets/img/posts/ai-agent-model-landscape-2026/chart-1-lmarena-gap.png" alt="LMArena global text scores and ranks comparing the leader with mainland Chinese models">
  <figcaption>Kimi, GLM, and Qwen sit in the upper group on the global text board, with a visible but not categorical gap from the leader.</figcaption>
</figure>

<figure>
  <img src="/assets/img/posts/ai-agent-model-landscape-2026/chart-5-lmarena-chinese-gap.png" alt="LMArena Chinese text scores and ranks comparing the leader with mainland Chinese models">
  <figcaption>On the Chinese-language board, Qwen, Kimi, and GLM move closer to the leader and reorder among themselves.</figcaption>
</figure>

The challenger tier looks far apart in rank but not like a chasm in score. Kimi K3 Max is 1489±5, GLM-5.3 Max is 1482±7, and Qwen3.8-Max is 1479±6, versus the leader’s 1508±5—a point-estimate gap of 19–29. Rankings at LMArena’s crowded top are sensitive to modest score differences. “Noticeable, not discontinuous” is more accurate.

The Chinese-language board also changes the internal order. Claude Opus 5 Max leads Text Chinese at 1569±18. Qwen3.8-Max is the highest-ranked mainland Chinese model, at Rank 10 with 1535±21, ahead of Kimi K3 at Rank 16 with 1529±18 and GLM-5.3 at Rank 17 with 1528±27. For Chinese-speaking developers, this matters more than a global ordinal: the domestic leaders are closer in Chinese usage than the overall table suggests.

## Three names and two stories people keep getting wrong

“xAI acquired Cursor” is false. SpaceX—not xAI—was the buyer. Reuters reported on 2026-06-16 that SpaceX and Cursor parent Anysphere had signed a $60 billion all-stock agreement. Cursor announced completion on 2026-08-14 and said the process began with joint model training that April. Before the acquisition, Cursor announced a $2.3 billion Series D at a $29.3 billion post-money valuation on 2025-11-13. Cursor continued operating after the deal, with access to SpaceX compute for model training, and Grok 4.6 is now integrated. On 2026-08-29, OpenAI said it planned to stop supplying models to SpaceX-owned Cursor, disrupting the former multi-model relationship. The confusion is partly understandable because the xAI site now carries the “SpaceXAI” name, but a post-merger brand cannot rewrite the identity of the buyer.

“Groq is Grok” is equally wrong. Groq is an independent AI inference infrastructure company founded by Jonathan Ross in 2016; it builds LPU hardware and GroqCloud. Grok is SpaceXAI’s model brand. Groq announced $650 million in new growth capital on 2026-06-22. It had signed a non-exclusive inference technology license with NVIDIA on 2025-12-24; its founder and some team members joined NVIDIA, while Groq officially said the company would continue independently. In its work accelerating Meta’s Llama API, Groq claims up to 625 tokens per second. It also says it operates 13 data centers and serves more than 5 million developers. Those are vendor-reported, unaudited figures. The two names share a sound and nothing else.

## The agent ecosystem: some build the whole vehicle, others supply the engine

| Company | Terminal and entry point | Cloud, asynchronous, and IDE layer | Strategic shape |
|---|---|---|---|
| Anthropic | Claude Code | Background/multi-agent work, scheduled tasks, VS Code/JetBrains plugins | Deep first-party integration, with Bun strengthening infrastructure |
| OpenAI | Open-source Codex CLI | Codex Web/Cloud, IDE extension, desktop app | ChatGPT subscription allowance plus API billing |
| Google | Open-source Gemini CLI | Jules and Antigravity | Deep Cloud and Workspace integration |
| SpaceXAI | Grok Build and Cursor | Integrated Cursor IDE workflow | Model plus first-party product surface |
| Z.ai | Existing popular tool surfaces | Claude Code, Codex, Cline compatibility | Swap in a cheaper model without changing the shell |
| Moonshot | Kimi Code | Kimi Agent Swarm and related products | A matrix of agent products |
| Alibaba | Qwen3-Coder and cloud API | No confirmed standalone terminal agent | Model plus cloud services, between the two strategies |
| DeepSeek | No first-party CLI | Claude Code, Codex, Copilot CLI adapters | Distribution through integration |
| MiniMax | MiniMax Code | Claude Code, Codex CLI, Cursor support | Open-weight direction plus low pricing |

<figure>
  <img src="/assets/img/posts/ai-agent-model-landscape-2026/chart-2-pricing-tiers.png" alt="API input and output pricing tiers for leading Anthropic, OpenAI, and DeepSeek models">
  <figcaption>Leading vendors segment product lines by budget, while DeepSeek occupies a distinctly lower input-output price band.</figcaption>
</figure>

<figure>
  <img src="/assets/img/posts/ai-agent-model-landscape-2026/chart-3-terminal-bench.png" alt="Four-model comparison from Anthropic's official Terminal-Bench 4.0 self-test">
  <figcaption>Fable 5.1 leads Anthropic’s official self-test; these are vendor-reported results, not an independent evaluation.</figcaption>
</figure>

Two businesses are emerging. Anthropic, OpenAI, Google, and SpaceXAI/Cursor want to own the model, shell, and execution environment. Z.ai, DeepSeek, and MiniMax deliberately enter workflows somebody else built and compete for the model slot. Alibaba sits between them. Full-stack control can produce a smoother experience and higher switching costs. The component strategy preserves developer choice but pushes competition directly toward price, compatibility, and reliability.

## How I would choose today

For everyday coding and scripts under a tight budget, especially in Chinese, I would start with GLM Coding Plan, DeepSeek V4, or Kimi Code. DeepSeek V4-Flash input can be as low as $0.007–0.22 per million tokens. The Chinese board also shows that low cost no longer automatically means being conspicuously less capable. Compliance, on-premises integration, and fluency with Chinese instructions often shape daily experience more than several positions on an overall leaderboard.

For complex, long-running autonomous work where stability justifies a premium, I would first examine Claude Code + Fable 5.1. That is not blind faith in a vendor benchmark. It is the combination of Anthropic’s official Terminal-Bench 4.0 self-test moving from 42.0% for the prior generation to 55.8%, and the enterprise adoption implied by Claude Code’s $1 billion run-rate revenue. It is suited to the workflow where you hand over a difficult task and leave to do something else. Its price clearly belongs to the highest tier too.

For very long documents and mixed image, video, and PDF input, Gemini 3.1 Pro + Antigravity/Jules deserves attention. Google’s advantage is not just multimodality; it is the possibility of one coherent experience across a development platform, asynchronous repository work, Cloud, and Workspace.

Teams already dependent on Cursor and focused on turning ideas into visual applications should treat Grok 4.6 as more than a bare-model score. After SpaceX acquired Cursor, the model and IDE are becoming more tightly coupled. The product is the workflow.

For enterprise procurement with compliance and audit requirements, GPT-5.6’s position inside Microsoft 365 Copilot and availability through existing Oracle Cloud commitments are practical advantages. Model selection is often less about who wins a laboratory metric and more about who can enter existing contracts, permissions, and audit systems.

Where data cannot leave the jurisdiction and domestic deployment is mandatory, using a Chinese model no longer means assuming a large capability sacrifice. Kimi, GLM, and Qwen are at a noticeable but non-discontinuous distance from the international frontier, and closer still in Chinese. The meaningful test is your repository, task chain, and infrastructure—not an abstract argument over the “strongest” brand.

## The cursor lands on the workflow

The most useful signal from this September release season is not the arrival of more flagship names. It is that models are becoming replaceable components inside agent systems. The strongest model may win one difficult inference; the complete toolchain can win the work that happens every day.

Developers therefore do not need a permanent champion. Use a stable end-to-end system for high-risk long tasks, a cost-efficient model for routine volume, and route multimodal or enterprise workloads according to ecosystem and procurement. Differentiation will live less in a dazzling chat response and more in whether a task keeps running, recovers from failure, respects permissions, and produces something deliverable.

Release pages will always be replaced by newer release pages. What remains is the system you trust with real work.

## References

### Anthropic

- [Anthropic — Claude Fable and Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1)（2026-09-01）
- [Anthropic — Claude Fable 5 and Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)（2026-06-09）
- [Anthropic — Claude Opus 5](https://www.anthropic.com/news/claude-opus-5)（2026-07-24）
- [Anthropic — Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5)（2026-06-30）
- [Anthropic — Claude Haiku 4.5](https://www.anthropic.com/news/claude-haiku-4-5)（2025-10-15）
- [npm — @anthropic-ai/claude-code](https://www.npmjs.com/package/@anthropic-ai/claude-code)（2026-09-02）
- [Anthropic GitHub — Claude Code Changelog](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)（2026-09-02）
- [Anthropic — Anthropic acquires Bun as Claude Code reaches $1B milestone](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone)（2025-12-03）
- [Menlo Ventures — 2025 State of Generative AI in the Enterprise](https://menlovc.com/2025-the-state-of-generative-ai-in-the-enterprise/)（2025-12-09）
- [Anthropic — $30 billion Series G at $380 billion post-money valuation](https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation)（2026-02-12）

### OpenAI

- [OpenAI — Introducing GPT-5.6](https://openai.com/index/gpt-5-6)（2026-07-09）
- [OpenAI API Docs — GPT-5.6 Sol](https://developers.openai.com/api/docs/models/gpt-5.6-sol)（2026-09-02）
- [OpenAI API Docs — GPT-5.6 Terra](https://developers.openai.com/api/docs/models/gpt-5.6-terra)（2026-09-02）
- [OpenAI API Docs — GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna)（2026-09-02）
- [OpenAI API Docs — GPT-5.3-Codex](https://developers.openai.com/api/docs/models/gpt-5.3-codex)（2026-09-02）
- [Artificial Analysis — GPT-5.6 Sol](https://artificialanalysis.ai/models/releases/gpt-5-6-sol)（2026-09-02）
- [Terminal-Bench — Terminal-Bench 2.0 leaderboard](https://www.tbench.ai/leaderboard/terminal-bench/2.0)（2026-09-02）
- [OpenAI Codex GitHub — v0.152.1](https://github.com/openai/codex/releases/tag/rust-v0.152.1)（2026-09-01）
- [OpenAI Codex — GitHub repository](https://github.com/openai/codex)（2026-09-02）
- [OpenAI — GPT-5.6 in Microsoft 365 Copilot](https://openai.com/index/gpt-5-6-preferred-model-microsoft-365-copilot)（2026-07-10）
- [OpenAI — OpenAI on Oracle Cloud](https://openai.com/index/openai-on-oracle-cloud)（2026-06-11）
- [OpenAI — Samsung Electronics deploys ChatGPT Enterprise and Codex](https://openai.com/index/samsung-electronics-chatgpt-codex-deployment)（2026-06-22）
- [OpenAI — NTT DATA](https://openai.com/index/ntt-data)（2026-07-22）
- [OpenAI — OpenAI to acquire Ona](https://openai.com/index/openai-to-acquire-ona)（2026-06-11）
- [OpenAI — Previewing GPT-5.6 Sol Ultrafast](https://openai.com/index/previewing-ultrafast)（2026-08-13）
- [Reuters — OpenAI to end model partnership with SpaceX-owned Cursor](https://www.reuters.com/business/media-telecom/openai-end-partnership-with-spacexs-cursor-2026-08-29/)（2026-08-29）

### Google

- [Google DeepMind — Gemini 3.1 Pro model card](https://deepmind.google/models/model-cards/gemini-3-1-pro/)（2026-02-19）
- [Google DeepMind — Gemini models](https://deepmind.google/models/gemini/)（2026-09-02）
- [Google DeepMind — Gemini Pro](https://deepmind.google/models/gemini/pro/)（2026-09-02）
- [Google — Gemini CLI](https://github.com/google-gemini/gemini-cli)（2026-09-02）
- [Google — Gemini CLI Releases](https://github.com/google-gemini/gemini-cli/releases)（2026-09-02）
- [Google — Jules](https://jules.google/)（2026-09-02）

### SpaceXAI · xAI · Groq · Cursor

- [SpaceXAI — Grok 4.6](https://x.ai/news/grok-4-6)（2026-08-12）
- [xAI — Grok Code Fast 1](https://x.ai/news/grok-code-fast-1)（2025-08-28）
- [Artificial Analysis — Grok 4.6](https://artificialanalysis.ai/models/grok-4-6)（2026-09-02）
- [Cursor — Joining SpaceX](https://cursor.com/blog/joining-spacex)（2026-08-14）
- [Cursor — Series D](https://cursor.com/blog/series-d)（2025-11-13）
- [Reuters — SpaceX to buy Cursor parent Anysphere for $60 billion](https://www.reuters.com/legal/transactional/spacex-buy-anysphere-60-billion-2026-06-16/)（2026-06-16）
- [Groq — Company](https://groq.com/company)（2026-09-02）
- [Groq — $650M growth capital](https://groq.com/newsroom/groq-raises-usd650m-to-scale-its-ai-inference-cloud-business)（2026-06-22）
- [Groq — Non-exclusive NVIDIA inference technology license](https://groq.com/newsroom/groq-and-nvidia-enter-non-exclusive-inference-technology-licensing-agreement-to-accelerate-ai-inference-at-global-scale)（2025-12-24）
- [Groq — Meta and Groq collaborate on the Llama API](https://groq.com/newsroom/meta-and-groq-collaborate-to-deliver-fast-inference-for-the-official-llama-api)（2025-04-29）

### 国内模型

- [LMArena — Text Overall leaderboard](https://lmarena.ai/leaderboard/text)（2026-09-02）
- [LMArena — Text Chinese leaderboard](https://lmarena.ai/leaderboard/text/chinese)（2026-09-02）
- [Z.ai — GLM-5.3 Model API](https://z.ai/model-api)（2026-09-02）
- [Z.ai — GLM Coding Plan](https://z.ai/landing-page/coding-plan)（2026-09-02）
- [Kimi — Kimi K3](https://www.kimi.com/en)（2026-09-02）
- [Kimi — Agent](https://www.kimi.com/en/agent)（2026-09-02）
- [Kimi — Agent Swarm](https://www.kimi.com/en/agent-swarm)（2026-09-02）
- [Qwen — Qwen3](https://qwenlm.github.io/blog/qwen3/)（2026-09-02）
- [Qwen — Qwen3-Coder](https://qwenlm.github.io/blog/qwen3-coder/)（2026-09-02）
- [DeepSeek — DeepSeek V4-Pro GA](https://api-docs.deepseek.com/news/news260813)（2026-08-13）
- [DeepSeek — V4-Flash-Vision-Exp](https://api-docs.deepseek.com/news/news260821)（2026-08-21）
- [DeepSeek — Codex integration](https://api-docs.deepseek.com/quick_start/agent_integrations/codex)（2026-09-02）
- [DeepSeek — API pricing](https://api-docs.deepseek.com/quick_start/pricing)（2026-09-02）
- [ByteDance Seed — Seed2.1](https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity)（2026-06-23）
- [MiniMax — MiniMax M3](https://www.minimax.io/models/text/m3)（2026-09-02）
- [MiniMax — MiniMax Code](https://code.minimax.io)（2026-09-02）

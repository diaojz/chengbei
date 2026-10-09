# Who Uses AI Coding Agents? Separate the Tools, Models, and Hype

Conversations about AI coding often sound contradictory. Some people say Claude Code has taken over; others say they have moved to Codex. Some run several bots through OpenClaw, while others connect Pi to MiniMax or run an open model locally.

These workflows exist. But the loudest posts on social media do not tell us which tools have the most users, and GitHub stars are not enterprise adoption. To understand what is mainstream, we need to keep those signals separate.

![Two developer surveys on AI coding tools. Stack Overflow asks which tools respondents used in the past year; JetBrains reports adoption at work. The figures use different definitions and should not be combined into one ranking.](/assets/img/posts/ai-coding-agent-landscape-2026/chart-adoption.svg)

## Which tools appear in the surveys?

Stack Overflow's 2026 Developer Survey asked which coding agents or assistants respondents had used during the previous year. The “used” group for this question had 12,255 respondents, and the question allowed multiple selections. Claude Code was selected by 65.5%, GitHub Copilot by 58.7%, and OpenAI Codex by 29.5%. Cursor, Google Antigravity, Gemini Code Assist, OpenCode, and JetBrains AI followed.[Original question and data](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent)

This answers “which tools have developers tried in the past year,” not “which one is their current main tool.” Respondents could select several tools, so the percentages are not expected to add up to 100%.

JetBrains' 2026 Developer Ecosystem Survey asked about adoption at work. It ran from May to July 2026, included more than 15,000 professional developers, and was weighted by factors including region, employment status, and programming language. The report puts Claude Code's adoption at work at about 39%, GitHub Copilot at 21%, Codex at 16%, and OpenCode at 7%. Claude Code was the most-used AI coding tool for 31% of developers.[JetBrains survey and methodology](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)

The two surveys ask different questions of different samples at different times, so 65.5% and 39% should not be compared directly. Their broad direction is consistent: **Claude Code is prominent among professional developers, Copilot still has a large installed base, and Codex is catching up quickly.**

Stack Overflow also reports that 65.9% of respondents currently use AI coding assistants or coding agents at work; 62.5% use general-purpose AI chat tools, and 26.2% use AI agents or automated workflows. “Using AI for code” and “delegating work to an agent that can operate on a repository” are not the same thing.[Stack Overflow AI usage data](https://survey.stackoverflow.co/2026/ai/data/ai-select)

## How the product landscape changed

![A timeline of AI coding agent launches and survey milestones. Dates mark official announcements or survey fieldwork, not necessarily the first existence of each product.](/assets/img/posts/ai-coding-agent-landscape-2026/chart-timeline.svg)

In early 2025, Anthropic introduced Claude Code as an early research preview. It could read code, edit files, run tests, and use command-line tools. In April, OpenAI released Codex CLI, an open-source coding agent for local terminals; in May it also described a cloud-based Codex agent. Around the same time, GitHub put Copilot Coding Agent into public preview: tasks could be assigned from an issue, run in the cloud, and returned as a pull request. GitHub announced general availability in September.[Anthropic](https://www.anthropic.com/news/claude-3-7-sonnet) · [Codex CLI](https://openai.com/index/introducing-o3-and-o4-mini/) · [Codex cloud agent](https://openai.com/index/o3-o4-mini-codex-system-card-addendum/) · [Copilot preview](https://github.blog/changelog/2025-05-19-github-copilot-coding-agent-in-public-preview/) · [Copilot general availability](https://github.blog/changelog/2025-09-25-copilot-coding-agent-is-now-generally-available/)

By 2026, surveys were capturing local terminal agents, IDE agents, and asynchronous cloud agents at the same time. JetBrains reported that 90% of professional developers used some form of coding agent at least weekly, and 68% used one daily. “Agent” here includes local and remote products; it does not refer to one brand.

The shift is not only that models have become better at writing code. There are more ways to hand work to them: watch an agent modify a local project, stay inside an IDE, or assign an issue to a cloud agent and review the pull request later.

## A setup is a stack of components

![A layered diagram of an AI coding setup: interface, agent, model, and provider routing are separate components that can be combined.](/assets/img/posts/ai-coding-agent-landscape-2026/chart-stack.svg)

| Layer | Examples | What it does |
|---|---|---|
| Interface | VS Code, JetBrains, Cursor, terminal, GitHub, Telegram | Where people assign tasks, inspect results, and review changes |
| Agent / harness | Claude Code, Codex, Copilot Coding Agent, OpenCode, Pi, Aider, Cline, Qwen Code, MiniMax Code, Grok Build | Reads a project, calls tools, makes changes, and runs the work loop |
| Model | Claude, GPT, Gemini, DeepSeek, MiniMax, Qwen, Grok, local models | Supplies reasoning, code generation, and related capabilities |
| Provider / router | Official APIs, OpenRouter, LiteLLM | Connects to model services and may handle model selection or a unified interface |
| Messaging and orchestration | OpenClaw and similar platforms | Connects chat channels, agents, and workspaces |

These layers cannot always be combined freely. Agents have different requirements for model APIs, tool calls, image input, and context length. A provider appearing on a compatibility list does not guarantee that every model feature will work. Test tool use, long tasks, image input, and recovery behavior in a real project before relying on a third-party endpoint. Two similar names are easy to confuse: **Grok is an xAI model family, Grok Build is xAI’s coding agent, and Groq is an inference service—not another spelling of Grok.**[Grok Build docs](https://docs.x.ai/build/overview) · [Groq coding docs](https://console.groq.com/docs/coding-with-groq)

Four common patterns stand out:

1. **Native stack: Claude Code with Claude, or Codex with OpenAI models.** This is usually straightforward to set up, and the tools are tuned around their own model families.
2. **IDE-based work: Copilot, Cursor, Windsurf, JetBrains, and others.** Useful if you want to stay in a familiar editor. These products may offer autocomplete, chat, and agents that execute multi-file tasks; those are different capabilities.
3. **Open agent with a model of your choice: OpenCode, Pi, Aider, or Cline.** This suits people who value model choice, configuration, or local execution. OpenCode's documentation lists more than 75 providers and local model support, but compatibility still needs to be checked.[OpenCode provider docs](https://github.com/anomalyco/opencode/blob/dev/packages/web/src/content/docs/providers.mdx)
4. **Asynchronous cloud work or messaging orchestration: Codex cloud, Copilot Coding Agent, Devin, Jules, and platforms such as OpenClaw.** Cloud agents can take bounded tasks and return branches or pull requests; messaging platforms can act as remote entry points for agents. They are different product categories.[OpenClaw multi-agent docs](https://docs.openclaw.ai/multi-agent)

Pi with MiniMax is one example of the open, model-selectable route. Pi is a coding agent framework that can connect to different models, and MiniMax publishes a terminal coding agent of its own. It is a notable ecosystem direction, but I could not find user-count data measured on the same basis as the Stack Overflow or JetBrains surveys. I therefore cannot claim it is among the most-used setups.[Pi](https://github.com/badlogic/pi-mono) · [MiniMax Code](https://github.com/MiniMax-AI/minimax-code)

## What GitHub stars can and cannot tell us

On October 9, 2026, I read the GitHub REST API star counts for several open-source projects: OpenClaw had about 391,000 stars, OpenCode 212,000, the Codex CLI repository 128,000, and Pi 114,000. Cline had about 70,000, Goose 55,000, and Aider 49,000. Counts are rounded to the nearest thousand and change over time.[OpenClaw](https://github.com/openclaw/openclaw) · [OpenCode](https://github.com/anomalyco/opencode) · [Codex CLI](https://github.com/openai/codex) · [Pi](https://github.com/badlogic/pi-mono) · [Cline](https://github.com/cline/cline) · [Goose](https://github.com/block/goose) · [Aider](https://github.com/Aider-AI/aider)

This is a measure of attention to open-source repositories, not active users, enterprise deployments, or paid adoption. OpenClaw is especially hard to compare with coding agents: it covers messaging and multi-agent routing, so its use cases are broader than editing code in a terminal. Closed-source products also have no equivalent repository metric.

## What people share on social platforms

Public posts show specific power-user workflows. Claude Code creator Boris Cherny has described running several Claude sessions in parallel in his terminal as well as cloud sessions; his post also stresses giving agents a feedback loop to verify their work.[Boris Cherny on X](https://x.com/bcherny/status/2007179832300581177)

For OpenClaw, entrepreneur Nikil Viswanathan shared a setup that uses separate Telegram group chats to manage agents.[Nikil on X](https://x.com/nikil/status/2024290446789472591) Other developers ask one agent to implement and another to review or reproduce the result. These are verifiable public examples, not evidence that most developers use the same setup. X over-represents people who like publishing their setups. Public Xiaohongshu results leaned heavily toward tutorials and promotion; I did not find enough verifiable configuration samples to treat them as representative. I have not converted social attention into market share.

## So, what is mainstream?

If “mainstream” means tools used by more developers in surveys, **Claude Code, GitHub Copilot, and Codex are in the leading group**, with Cursor still important. For open-source and model-flexible workflows, OpenCode, Pi, Cline, and Aider have clear niches. OpenClaw is worth watching as a messaging and orchestration route, but its stars do not measure adoption of coding CLIs.

This explains why social media can feel different from the survey data. The most visible discussions often come from people who actively experiment with new tools; surveys cover a broader set of developers. The most interesting setup online is not necessarily the one used by the most people.

I would treat this as a map, not a winner-takes-all ranking: first decide whether you want IDE collaboration, local terminal execution, asynchronous cloud tasks, or model switching. Then choose an agent and verify that it works reliably with your model and provider. A workflow that consistently handles your actual tasks is more useful than changing tools every week.

## Sources and methodology

- The Stack Overflow Developer Survey 2026 agent question asks about tools used in the previous year; it is multi-select. Counts and exact options are available in the [raw data](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent).
- JetBrains' 2026 Developer Ecosystem Survey included more than 15,000 professional developers and was weighted by region and other factors. Adoption figures refer to May–July 2026; see the [report and methodology](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/). JetBrains also sells developer tools, so its own product figures should be read with that context.
- Timeline dates are taken from company or GitHub announcements. Adoption figures refer to survey fieldwork, not publication dates.
- GitHub stars are snapshots read from the REST API on October 9, 2026. They change over time and are only a proxy for repository attention.
- Social posts illustrate public workflows; they do not estimate prevalence.

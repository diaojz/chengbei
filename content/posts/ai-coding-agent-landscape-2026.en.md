# The AI Coding Crowd Seems to Switch Tools Every Week. What Do Developers Actually Use?

AI coding discussions can make it feel as if everyone is running several Claude Code sessions, or has moved to Codex, or wired a fleet of bots into OpenClaw, or connected Pi to MiniMax, or simply uses Cursor.

After reading enough of these posts, the obvious question is: **what are developers actually using?**

The answer depends on what “using” means. Did someone try a tool once in the past year, or do they rely on it at work every day? Are we talking about autocomplete in an editor, or an agent that can read a repository, edit files, and run commands? Mix those questions together and the rankings become confusing.

![Two developer surveys on AI coding tools. Stack Overflow asks which tools respondents used in the past year; JetBrains reports adoption at work. The figures use different definitions and should not be combined into one ranking.](/assets/img/posts/ai-coding-agent-landscape-2026/chart-adoption-v2.svg)

## Put the two surveys side by side

Stack Overflow’s 2026 Developer Survey asked which coding agents or assistants respondents had used in the previous year. It was a multi-select question with 12,255 responses in the “used” group: Claude Code was selected by 65.5%, GitHub Copilot by 58.7%, and Codex by 29.5%. Cursor, Antigravity, Gemini Code Assist, OpenCode, and JetBrains AI were also on the list.[Original question and data](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent)

This is not a ranking of current primary tools. A developer may have tried several products in the past year, so the percentages are not expected to add up to 100%. It tells us which names have reached developers, not which one they use every day.

JetBrains asked a question closer to “what do you use at work?” Its 2026 Developer Ecosystem Survey covered more than 15,000 professional developers between May and July, with weighting applied to the sample. The report puts work adoption at about 39% for Claude Code, 21% for Copilot, 16% for Codex, and 7% for OpenCode. Claude Code was the most-used AI coding tool for 31% of developers.[JetBrains survey and methodology](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/)

The samples and questions differ, so the figures should not be compared directly. But both point in a similar direction: **Claude Code is prominent, Copilot still has a large user base, and Codex is catching up.** That is better supported than saying one tool has taken over the whole market.

JetBrains also found that 90% of surveyed professionals used some form of coding agent at least weekly, and 68% used one daily. Stack Overflow reported that 65.9% of respondents use AI coding assistants or agents at work. AI coding is no longer a tiny experiment, but asking AI a question or accepting autocomplete is still different from delegating work to an agent.[Stack Overflow AI usage data](https://survey.stackoverflow.co/2026/ai/data/ai-select)

## How did the landscape get here?

![A timeline of AI coding agent announcements and survey fieldwork. Dates mark official announcements or research periods, not necessarily the first existence of each product.](/assets/img/posts/ai-coding-agent-landscape-2026/chart-timeline-v2.svg)

A few dates help explain the shift. In February 2025, Anthropic introduced Claude Code as an early research preview. OpenAI released the local, open-source Codex CLI in April. In May, Codex’s cloud agent and GitHub Copilot Coding Agent appeared: work could be sent to the cloud, then returned as changes or a pull request for review. GitHub announced general availability in September.[Anthropic](https://www.anthropic.com/news/claude-3-7-sonnet) · [Codex CLI](https://openai.com/index/introducing-o3-and-o4-mini/) · [Codex cloud agent](https://openai.com/index/o3-o4-mini-codex-system-card-addendum/) · [Copilot preview](https://github.blog/changelog/2025-05-19-github-copilot-coding-agent-in-public-preview/) · [Copilot general availability](https://github.blog/changelog/2025-09-25-github-copilot-coding-agent-is-now-generally-available/)

By 2026, the debate was no longer only about which model writes better code. Some developers want to stay inside an IDE; others hand a whole task to a terminal agent; some assign an issue to the cloud and review the pull request later. **There are more entry points and ways of working, so there is no longer one obvious answer.**

## They look like one category, but they are different layers

![A diagram of an AI coding setup: interface, agent, model, and provider routing are separate components that can be combined.](/assets/img/posts/ai-coding-agent-landscape-2026/chart-stack-v2.svg)

The names are easy to mix up. Claude Code, Codex, OpenCode, and Pi are agents or agent frameworks. Claude, GPT, Gemini, DeepSeek, MiniMax, Qwen, and Grok are models. OpenRouter and LiteLLM connect to or route between model services. The IDE is the workspace. These pieces can form one setup, but they are not the same kind of product.

Claude Code with Claude, or Codex with OpenAI models, is a straightforward native setup. Copilot, Cursor, Windsurf, and JetBrains are closer to editor-based workflows. Developers who want to choose models themselves often look at OpenCode, Pi, Cline, or Aider. OpenCode’s documentation lists more than 75 model providers and local model support; with more choice comes more compatibility checking.[OpenCode provider docs](https://github.com/anomalyco/opencode/blob/dev/packages/web/src/content/docs/providers.mdx)

Pi with MiniMax, or MiniMax Code itself, is another route. Qwen Code and Grok Build are also coding-agent products. OpenClaw sits a little differently: it connects messaging channels and can route work across multiple agents, so it is not quite the same product category as a CLI that edits code directly.[Pi](https://github.com/badlogic/pi-mono) · [MiniMax Code](https://github.com/MiniMax-AI/minimax-code) · [Qwen Code](https://github.com/QwenLM/qwen-code) · [Grok Build](https://docs.x.ai/build/overview) · [OpenClaw multi-agent docs](https://docs.openclaw.ai/multi-agent)

One more naming trap: Grok is an xAI model, and Grok Build is its coding agent. Groq provides model inference services; it is a different company and a different layer.[Groq coding docs](https://console.groq.com/docs/coding-with-groq)

## Social posts show workflows, not a poll

Claude Code creator Boris Cherny has shared that he runs several Claude sessions in parallel in his terminal, along with cloud sessions. He also stressed that agents need a way to verify their work.[Boris Cherny on X](https://x.com/bcherny/status/2007179832300581177)

For OpenClaw, entrepreneur Nikil Viswanathan shared a setup using separate Telegram group chats to manage agents.[Nikil on X](https://x.com/nikil/status/2024290446789472591) These posts are useful examples of what people build, but they answer “how does someone use it?” rather than “what do most developers use?” People who publish their setups are more visible in a feed; visibility is not market share.

Public Xiaohongshu results leaned toward tutorials and promotions. I could not find enough verifiable real-world configurations to use them as adoption data, so I have left that question open instead of guessing.

## What is mainstream, then?

In the surveys, Claude Code, Copilot, and Codex are in the leading group, with Cursor still a common choice. For open-source and model-flexible workflows, OpenCode, Pi, Cline, and Aider have clear niches. OpenClaw has many GitHub stars, but it covers messaging and multi-agent orchestration; its stars do not measure adoption of coding CLIs.

On October 9, 2026, I read roughly 391,000 GitHub stars for OpenClaw, 212,000 for OpenCode, 128,000 for the Codex CLI repository, and 114,000 for Pi. These numbers show attention to the projects, not how many people use them every day. They also cannot fairly be compared with closed-source products such as Claude Code or Cursor.[OpenClaw](https://github.com/openclaw/openclaw) · [OpenCode](https://github.com/anomalyco/opencode) · [Codex CLI](https://github.com/openai/codex) · [Pi](https://github.com/badlogic/pi-mono)

So I would describe the current landscape this way: **most developers are choosing mature, integrated tools; people who like to tinker connect open agents to models of their choice; and those who want remote control add a bot or orchestration layer.** All three are real use cases, but the loudest one on social media does not stand for the whole market.

If you are choosing where to start, first decide whether you want to stay in an IDE, delegate tasks in a terminal, or switch models freely. Then try a mainstream product against your real work. It is usually easier to judge than building a multi-agent stack first. Tools will change; whether one can reliably complete your actual tasks is still the useful test.

<details>
<summary>Data definitions and sources</summary>

- Stack Overflow Developer Survey 2026 coding-agent question: multi-select use in the previous year; n=12,255 in the “used” group.[Raw data](https://survey.stackoverflow.co/2026/ai/data/ai-code-agent)
- JetBrains Developer Ecosystem Survey 2026: fielded May–July 2026, 15,000+ professional developers, weighted sample; [report and methodology](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/). JetBrains also sells developer tools, so its own product figures should be read with that context.
- Product timeline dates come from company or GitHub announcements. Survey figures refer to fieldwork dates, not publication dates.
- GitHub Stars are API snapshots read on October 9, 2026, rounded to the nearest thousand. They are only a proxy for open-source project attention.
- X posts document public examples and are not used to estimate overall adoption.
</details>

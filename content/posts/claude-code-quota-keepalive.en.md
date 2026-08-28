# Align Claude Code's 5-Hour Usage Windows with Scheduled Routines

Claude usage, including Claude Code, is measured in rolling five-hour windows. A window starts with the first actual request made inside it; it does not reset for everyone at a fixed time of day. That detail matters: when you finally sit down for a heavy work session, your window may not have started yet, or an earlier one-off request may already have used part of it.

My solution is to use Claude Code's built-in Scheduled cloud agents, commonly called routines. A few minutes before each real work session, a routine sends one near-zero-effort message. It calls no tools and performs no substantive task. Its only purpose is to align the start of the window with my schedule.

> Checked on August 28, 2026. Separate five-hour windows for Opus and Sonnet are my own observed behavior, not an explicit promise in the official documentation. Product behavior may change.

<figure>
  <img src="/assets/img/posts/claude-code-quota-keepalive/cover.png" alt="A scheduled request warming up a Claude Code usage window before a real work session">
  <figcaption>Window “warm-up”: use one minimal request shortly before heavy work to align the start time.</figcaption>
</figure>

## The boundary: schedule your quota, do not increase it

This setup does not increase the total quota included with your subscription, and it does not bypass any restriction. It uses Anthropic's official scheduling feature to place the starting point of your existing usage window near the time you actually need it.

The warm-up request is deliberately minimal: no tool calls, repository access, or real work. This is not high-frequency or attack-style request abuse, and it is not an exploit. Usage allowances vary by subscription tier and may change, so this guide makes no claims about a fixed number of messages or tokens per window.

## How the window works, and why both models need a trigger

The first actual request starts a rolling five-hour window. If you send a casual request earlier in the day, the window may already be partly consumed by the time a serious coding session begins. If you send nothing, there is no universal reset time that automatically aligns it with your workday.

There is one more important detail. In my own testing and observation, Opus and Sonnet use separate quota pools and calculate their five-hour windows independently. Warming up one model therefore does not start the other model's window. This is an observed result, not an official guarantee of future behavior.

<figure>
  <img src="/assets/img/posts/claude-code-quota-keepalive/mechanism.png" alt="Five-hour rolling windows with separate observed quota pools for Claude Opus and Sonnet">
  <figcaption>The window starts with the first request. Separate Opus and Sonnet pools are an observed behavior, not an explicitly documented specification.</figcaption>
</figure>

For each planned work session, I therefore schedule one request for Opus and another for Sonnet, separated by a few minutes.

## Create a Scheduled cloud agent

Most users can use either of these entry points:

- Open the management panel at <https://claude.ai/code/routines>
- Run `/schedule` inside Claude Code and follow the interactive flow

Routines can also be created programmatically with command-line tooling, but that is unnecessary for this setup. You do not need to connect a GitHub repository. Select the default Environment and leave sources empty.

Each of the four periods has a small, everyday topic. The two model-specific routines within a period use the same prompt; the Chinese production prompts are reproduced exactly below:

| Period | Topic | Exact prompt |
| --- | --- | --- |
| Morning (07:30/07:35) | Weather or the morning commute | `我准备开始上班了，随口问我一句今天天气怎么样或者早高峰堵不堵（自己选一个话题，说法别老一样），像朋友聊天那样简单回一句就行。` |
| After lunch (13:01/13:07) | What to eat for lunch | `到午休时间了，随口问我中午吃点什么好，像朋友聊天那样简单回一句就行，说法别老一样。` |
| End of workday (18:10/18:14) | The evening commute | `我准备下班了，随口问一下现在下班路上堵不堵，像朋友聊天那样简单回一句就行，说法别老一样。` |
| Evening (23:20/23:23) | TV series recommendations | `晚上有点空，随口问我最近有什么好看的剧集值得推荐，像朋友聊天那样简单回一句就行，说法别老一样。` |

Even when its content is harmless, an identical message sent at the same exact times every day is itself a recognizable automation pattern. These prompts therefore fix only a natural topic for each period and ask the model to compose fresh wording each time, rather than selecting from a hard-coded question bank.

Keep permissions minimal, for example:

```json
{
  "allowed_tools": ["Read"],
  "sources": []
}
```

`Read` is not there because the routine should read anything; it merely keeps the allowed set minimal. This configuration — not the prompt wording — is what actually prevents any real tool use, and the empty sources list means no repository is attached.

## My example: four work periods, eight routines

I picked four points when I genuinely expect heavy Claude usage: the start of the workday, after lunch, after work, and before a late-night session. With separate Opus and Sonnet triggers, that becomes four periods × two models, or eight scheduled routines.

Here is my schedule in China Standard Time (CST). It is an example of the method, not a schedule to copy blindly:

| Work period | Opus | Sonnet |
| --- | ---: | ---: |
| Start of workday | 07:30 | 07:35 |
| After lunch | 13:01 | 13:07 |
| After work | 18:10 | 18:14 |
| Before late-night work | 23:20 | 23:23 |

The two model triggers are separated by five to seven minutes so they do not run in the same second. The useful part is not the exact clock time; it is matching the schedule to actual work.

## Adapt it to your own day

Start with the four times when you actually expect substantial Claude usage, then work backward:

1. Trigger each routine a few minutes early to allow time for it to run.
2. Create separate Opus and Sonnet routines for each period.
3. Stagger the two models by a few minutes rather than sending both simultaneously.
4. Keep adjacent triggers for the same model more than five hours apart.

That last rule is essential. If the next trigger arrives while the previous five-hour window is still active, it falls into that existing window instead of opening a fresh one. You spend a request without gaining a newly aligned window. Map your own timeline before copying any cron schedule.

## Four observed gotchas

First, cron scheduling is deterministic and does not support random jitter. It fires at the configured time every run; there is no option to vary it randomly by a few minutes.

Second, a newly created routine may occasionally queue for a few minutes on its first run. A task scheduled for 23:30 might initially appear around 23:34, for example. Later runs generally correct themselves. If a persistent offset remains, move the cron time a few minutes earlier to compensate.

Third, these routines currently cannot be deleted through the command line or API. To delete one or change its time, use the web panel at <https://claude.ai/code/routines>.

Fourth, routines created under an old Claude Code account do not migrate when you switch accounts. Recreate them while signed in to the new account.

## Final checklist

For every work period, verify that you have one Opus routine and one Sonnet routine, sources are empty, each period uses its corresponding everyday prompt and asks for varied wording, the two models are staggered, and adjacent windows are genuinely more than five hours apart.

This is not a way to obtain more quota. It is a way to prevent the quota you already have from starting at the wrong time. For a reasonably regular workday, that small scheduling change can make heavy sessions begin much more consistently inside a fresh, full five-hour window.

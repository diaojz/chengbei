# Why I Self-Host a Claude Code Gateway

A friend saw I was using `gw.chengbei.org` in one of my courses and asked why I don't just subscribe to Claude Pro.

"It's $240 a year. Way less hassle than what you're doing."

He's right. But I didn't switch.

Not because I'm cheap — $240 a year I can afford. It's because this thing was never really about money. I thought it was at the start. Only after I built it did I figure out what it actually was.

## At first I really was trying to save money

The original need was plain: I use Claude Code, Cursor, and similar tools heavily. Monthly subscriptions + API was creeping toward $50.

For me alone, fine. But a few students and friends were involved too. Each one would need their own Pro — and most of them only used it a few times a month, getting locked into $20 anyway.

The naive idea: **what if we share a pool and split by usage?**

I looked around and found open-source projects that do exactly this — wrap the official OpenAI / Anthropic accounts, expose a multi-user gateway with per-token billing. I picked sub2api (the CRS 2.0 one).

A VPS in Japan, $10/month. Installed sub2api. Caddy reverse-proxied it to `gw.chengbei.org`.

That day I did the math: me plus four friends, monthly cost about $2 per person.

Saving money: done. But that wasn't the most satisfying part.

## What kept me hooked was the control

After a week of using it, I started feeling things **a commercial subscription can never give you.**

**One**: I can see how many tokens each person used. Pro is a black box — all you know is "limit not reached yet today." With self-hosting, I can see — this friend ran 2M tokens yesterday looping a weird prompt; that student steadily uses 50k a day.

Once you can see, you can act in finer ways: set token caps per student, prepay-per-month for friends, leave unlimited for myself. The commercial side can't do this — it gives you one uniform "Pro."

**Two**: I control which provider I connect to. It's not just Anthropic — add OpenAI, Google, DeepSeek, Kimi, whoever is cheaper or stronger. Model switching happens at the API layer, not the product layer. Downstream apps don't feel it.

**Three**: Stability. Claude Pro from mainland China gets flaky from time to time — IP ranges flagged, Cloudflare challenges, session expiries. Subscription users can only wait. My gateway runs on my VPS, my IP, my certificate. When it breaks, I fix it myself.

I'm not saying commercial products are bad. I'm saying their boundary **is always drawn by their product manager** — not by you.

## On the act of self-hosting

People misunderstand self-hosting — they think it's "to save money" or "to look cool."

For me it's one thing: **how far does my control over this tool reach?**

A commercial product gives you a surface. You can change a few knobs on that surface. The logic underneath — how much quota, who can use it, which model, how it degrades when something fails — is all decided by someone else.

Self-hosting brings those decisions back to you. You become **a designer of the product**, not just a user.

The cost: you have to maintain it. Adapt to API changes. Rotate credentials. Watch monitoring, edit configs, read logs. I spend an hour or two a month on this — not nothing, not a lot.

The payoff: when I need to build a new tool, a new course, a new experiment, **the gateway is already there**, ready to plug in. That feeling of "I have my own infrastructure" is something a Pro subscription can't sell you.

## To indie hackers

The scarcest thing for an indie hacker isn't the ability to write code — code is cheap in the AI era.

The scarcest thing is the judgment to say **"I can roll my own."** Look at a commercial product and immediately gauge its boundary, what it costs to take over, whether it's worth taking over.

That judgment isn't trained by reading articles. It's trained by **actually taking over a few times.**

The VPS behind `gw.chengbei.org` is, to me, much more than a few hundred saved on subscriptions. It's concrete evidence that "I can do it myself" — evidence sitting in DNS records, Caddy configs, a couple of monthly cron jobs.

Next time a commercial product annoys you, don't pay immediately.

Ask yourself: **the core of this thing is really just a few steps — could I run it myself?**

Often the answer is yes. Choosing not to is also a choice. But it only counts as a choice if you could have.

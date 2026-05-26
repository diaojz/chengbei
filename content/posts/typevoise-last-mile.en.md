# Typevoise's Last Mile

Before I built Typevoise, I thought the hard part was recognition.

The idea was simple: I was tired of typing all day. What if I could hit a hotkey, talk to my Mac for a few seconds, and have clean text land at my cursor. I assumed the core of this product was **making the machine hear me accurately**.

So for the next several weeks, every hour went into recognition.

## Weeks of grinding on recognition

First version used Whisper. I swapped models from tiny to small to medium. Accuracy went up. So did latency — a 5-second clip took 4 seconds to come back. I tried GPU acceleration, fought with Metal, eventually realized medium is about the ceiling for a regular Mac.

Then I switched to Apple's Speech Framework. Much faster — nearly realtime — but visibly less accurate. I switched back to Whisper. Then back to Apple. Back and forth.

I kept believing that if I tuned one more parameter, the output would become "clean."

Until one day I sat staring at this on screen:

> "uh you know like um so I think this thing is basically saying"

Technically **perfect**. That's exactly what I said. But this isn't text — this is a transcript of speech.

That was when it hit me: **the bottleneck in voice input was never "can the machine hear me." It was "can it give me back a paragraph that reads like I typed it."**

## Adding one more step

What I did was simple. After recognition, pipe the rough transcript through Claude with one instruction:

> This was spoken aloud. Strip the fillers, false starts, and repetitions. Return a clean version that could be sent or pasted directly. Preserve the meaning. Don't elaborate.

The app instantly became usable.

Where before I'd said "uh you know like um so I think this thing is basically saying we should ship that feature first" — out came:

> I think we should ship this feature first.

That was the text I wanted to type.

## Why most voice tools die at this last mile

Later I looked into other voice input tools. There's a counterintuitive pattern: **they all grind recognition accuracy. No one spends the 0.2 seconds on polishing**.

There's an obsession in tech — push every measurable number to its limit. Recognition accuracy from 93% to 95% to 97%, every fraction publishable in a paper, every fraction in the release notes.

But users don't care about those two percentage points.

What users want has never been "accurate." It's "I speak, and what comes out is something I can ship."

The 0.2 seconds of polishing in between is a chasm almost every tool fails to see. They fail to see it because it isn't in any engineer's OKR — you can't prove with a single number that "polishing made the product usable." But users feel it instantly.

## The last mile

This eventually became a rule for how I build things:

**The bottleneck in user experience is almost never on the metric you've been grinding hardest.**

It's in the last mile — the step that looks "minor," "throw it in," "we'll get to it later" — and that step decides whether the whole product is usable.

Typevoise's biggest feature is not recognition. It's that polishing step. It's the experience of hitting a hotkey and having clean text appear at your cursor. It's the kind of fault tolerance where even if a few words were misheard, the polished sentence still reads right.

If I build another tool one day, the first question won't be "what's the core technology here?"

It'll be — **when the user receives the final result, where is the last mile that's missing?**

That's where the product actually starts.

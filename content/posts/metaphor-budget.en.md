# A Course's Metaphor Budget

Everyone who designs a course faces the same temptation: **assign a metaphor to every concept.**

Teaching git? Five metaphors: commit is a snapshot in time, branch is a parallel universe, the staging area is a shipping box, HEAD is a cursor, rebase is rewriting history.

Teaching pointers? Three: variables are rooms, addresses are doorplates, pointers are notes that say which door.

Teaching databases? Six, eight, ten.

The instructor thinks they're "helping students understand." Actually they're **helping themselves understand** — piling up metaphors until they feel like the concept is clear.

Students don't work that way. A student's brain has maybe three metaphor slots. Beyond that, new metaphors aren't bonus — they **collide with each other**.

## A real collapse

I once taught a git class I'd prepared very carefully.

"A commit is like a save point."
"A branch is a parallel universe forking off."
"A merge is two timelines converging."
"A rebase is like walking history again with new equipment."
"A reset is going back to a past point and erasing everything that happened after."
"A cherry-pick is reaching into another universe and pulling out one event."
"A stash is freezing what you're currently doing."

Done. A student raised a hand:

> "Teacher... so which universe am I in right now?"

That moment I realized — **I wasn't teaching git. I was teaching a fantasy novel.**

After seven metaphors rolling over them, the student didn't remember any of the concepts. Instead, "universe" had become a sticky word they couldn't escape.

## Three is enough

When I rewrote that course, I kept only three metaphors:

- **Git is a time machine.** You can return to any saved point.
- **A branch is a drawer.** You can have several drawers open and try different approaches in each.
- **A commit is a save.** A game save. If you mess up, reload.

Just three. When teaching rebase, I don't add a new metaphor — I say "rearrange the saves inside one drawer." For cherry-pick: "grab one save from another drawer." For stash: "close the drawer for now and clear the table."

**Every later operation reuses the first three metaphors.**

The student carries only three metaphors in their head, but each one gets used heavily. Used often, each metaphor sinks in deeper. By the eighth time you say "drawer," they're picturing it without conscious effort.

That works an order of magnitude better than stacking seven new ones.

## The marginal value of metaphors drops fast

The first metaphor gives the student an **anchor**. The initial understanding of "oh, X works kind of like Y" gets formed.

The second metaphor covers a side the first didn't.

The third covers most of the edge cases.

You should stop here.

The fourth metaphor isn't supplementary; it's **competing**. It fights the first three for the student's mental capacity. One concept with four analogies — students unconsciously try to align them: "wait, is the staging area a shipping box, a transit station, a cache, or...?" That alignment work itself drains their attention.

Past the fifth, metaphors **hurt**. Students stop trusting you — why does this one thing have so many faces? That isn't richness. That's vagueness.

## A course's "metaphor budget"

Now when I build a course, I set myself a metaphor budget before I start: **3.**

Once they're used, no new metaphor enters the course, no matter how good. I switch to other tools — concrete examples, diagrams, contrasts, rewording. But I don't add metaphor number four.

It's hard at first. I keep thinking "but this one is so clever, I have to use it."

But the quality of a course isn't whether the instructor enjoyed it. It's what stays in the student's head. The more "clever" metaphors I leave in their head, **the less they can actually build** — their head fills up with imagery and runs out of space for actions.

The instructor's restraint is a kind of craft students can't see but can feel.

Next time you design a class, open a blank page first and write down your metaphor budget. Then spend the whole class driving those three home.

The other seven, no matter how good — swallow them.

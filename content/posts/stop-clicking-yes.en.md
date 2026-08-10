# Stop Being a Yes Engineer: Choose the Tool You Actually Use

AI coding was supposed to make me a 10x engineer. For a while, it made me a full-time **Yes engineer** instead.

Read a file: Yes. Run tests: Yes. Install a dependency: Yes. The cost is not the click itself; it is the repeated interruption of attention.

The answer is not disabling every safeguard. A useful permission system has three layers: an operating boundary, routine passes for reversible work, and hard red lines for deletion, secrets, force pushes, and privilege escalation.

Codex and Claude Code implement these layers differently. Most people use only one, so combining both configurations in a single walkthrough makes copying mistakes more likely. Choose your path:

## I use Codex

Configure approvals, sandbox boundaries, writable roots, project trust, and persistent command-prefix rules in `~/.codex/config.toml` and `~/.codex/rules/default.rules`.

**[Open the complete Codex guide →](#/p/codex-permissions-guide)**

## I use Claude Code

Configure `defaultMode`, allow/deny rules, project settings, and programmable pre-execution hooks in `~/.claude/settings.json`.

**[Open the complete Claude Code guide →](#/p/claude-code-permissions-guide)**

Whichever path you choose: back up first, merge fields instead of replacing the file, keep allowlists narrow, and test both productive work and attempted boundary violations.

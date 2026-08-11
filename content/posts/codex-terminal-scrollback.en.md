# Codex CLI Mouse Wheel Cycles Input History? Restore Full Conversation Scrolling

When I used Codex CLI in Ghostty, scrolling up did not move through the conversation. Instead, the input box cycled through commands I had typed earlier.

The tempting fix is to change Ghostty's mouse bindings or scrollback settings. The actual cause is Codex TUI's **alternate screen** mode.

## The immediate fix

Exit the current Codex session and run:

```bash
codex --no-alt-screen
```

To restore the most recent conversation as well:

```bash
codex --no-alt-screen resume --last
```

`resume --last` restores the latest session. `--no-alt-screen` runs the TUI inline, preserving the terminal's native scrollback history. Your mouse wheel or trackpad can then scroll through both your prompts and the AI output.

> Verified with Codex CLI 0.147.0: the option is documented as “Disable alternate screen mode,” with inline mode preserving terminal scrollback history.

## Why the wheel cycled input history

Full-screen terminal applications often switch to a temporary alternate screen. It keeps the original terminal clean when the program exits, but content shown there may not enter the terminal's normal scrollback buffer.

Mouse-wheel events may also be translated into arrow-key events in this mode. The Codex input box receives Up and Down, so it navigates previous input instead of scrolling the conversation.

Disabling the alternate screen makes Codex render into the normal terminal page, where Ghostty can handle scrolling as usual.

## Make it the default

If Ghostty is using zsh, add this to `~/.zshrc`:

```bash
alias codex='codex --no-alt-screen'
```

Reload the configuration:

```bash
source ~/.zshrc
```

For another shell, place the alias in its startup file. Check your current shell with:

```bash
echo $SHELL
```

## Two details worth knowing

1. **The current session cannot switch modes live.** Exit first, then use `codex --no-alt-screen resume --last`.
2. **This is a Codex option, not a Ghostty option.** The same fix can help in Terminal or iTerm2, though terminal-specific mouse mappings may still matter.

To undo the change, remove the alias from `~/.zshrc` and reload it. One option is all it takes to give the mouse wheel back its original job.


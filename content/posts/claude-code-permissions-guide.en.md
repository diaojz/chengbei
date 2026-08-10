# Stop Clicking Yes in Claude Code: Complete settings.json and Hooks Guide

This is the standalone path for Claude Code users. Back up `~/.claude/settings.json`, then merge precise `permissions.allow`, `permissions.deny`, and a `PreToolUse` guard. Use `defaultMode: "auto"` only on a version that supports it; otherwise keep `default`.

```json
{
  "permissions": {
    "defaultMode": "auto",
    "allow": [
      "Read", "Edit", "Write",
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(npm run test *)",
      "Bash(npm run lint *)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(//Users/<YOUR_NAME>/.ssh/**)",
      "Bash(rm -rf *)",
      "Bash(git push --force *)"
    ]
  }
}
```

Do not use `Bash(*)`. Add a synchronous fail-closed `PreToolUse` hook before introducing unattended execution, validate JSON with `jq`, inspect sources with `/permissions`, and test both normal work and rejected secret/deletion operations. `PermissionRequest` HTTP hooks are optional infrastructure and should not be copied without a running approval service.

See the Chinese version for the complete wrapper script, JavaScript guard, copy-ready configuration prompt, verification, and rollback workflow.

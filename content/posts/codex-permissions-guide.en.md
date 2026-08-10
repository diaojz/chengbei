# Stop Repeated Codex Approvals: Complete config.toml and Rules Guide

This is the standalone path for Codex users. Back up `~/.codex/config.toml`, then merge — never replace — the following boundary settings:

```toml
approval_policy = "on-request"
sandbox_mode = "workspace-write"

[sandbox_workspace_write]
network_access = true
writable_roots = [
  "/Users/<YOUR_NAME>/.cache",
  "/Users/<YOUR_NAME>/.npm",
  "/Users/<YOUR_NAME>/Library/Caches",
]

[projects."/Users/<YOUR_NAME>/Projects/my-app"]
trust_level = "trusted"
```

Use `~/.codex/rules/default.rules` for precise, reversible command prefixes:

```python
prefix_rule(pattern=["git", "status"], decision="allow")
prefix_rule(pattern=["git", "diff"], decision="allow")
prefix_rule(pattern=["npm", "run"], decision="allow")
prefix_rule(pattern=["pnpm", "test"], decision="allow")
prefix_rule(pattern=["pytest"], decision="allow")
prefix_rule(pattern=["ruff"], decision="allow")
```

Avoid broad shell, interpreter, deletion, and privilege rules. Validate with Python `tomllib`, then test both normal work inside a disposable repository and an attempted write outside it. For delegated MCP execution only, `approval_policy=never` may be combined with `workspace-write`; do not turn that scenario override into a normal workstation default.

See the Chinese version of this article for the complete step-by-step prompt, validation, and rollback commands.

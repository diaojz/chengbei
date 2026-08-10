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

**Correction (2026-08-10):** this section previously described a `~/.codex/rules/default.rules` file with a `prefix_rule()` syntax for pinning individual command prefixes as always-allowed. That mechanism does not exist — checked against the official [Codex Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference). Codex has no persistent per-command allowlist comparable to Claude Code's `permissions.allow`. Sorry for the earlier error.

The real lever, once `on-request` still feels noisy, is splitting `approval_policy` into `granular` categories instead of flipping the whole thing to `never`:

```toml
[approval_policy.granular]
sandbox_approval = false   # routine in-sandbox actions stop asking
rules = true                 # policy/rule changes still ask
mcp_elicitations = true
request_permissions = true
skill_approval = true
```

`sandbox_mode = "workspace-write"` already caps *where* Codex can reach; `granular` only decides whether it still asks *within* that boundary. Avoid broad shell, interpreter, deletion, and privilege rules, and avoid setting `approval_policy = "never"` outright — that removes prompts for out-of-bounds actions too. Validate with Python `tomllib`, then test both normal work inside a disposable repository and an attempted write outside it. For delegated MCP execution only, `approval_policy=never` may be combined with `workspace-write`; do not turn that scenario override into a normal workstation default.

See the Chinese version of this article for the complete step-by-step prompt, validation, and rollback commands.

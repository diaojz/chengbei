# Codex CLI 里鼠标滚轮只翻输入历史？一行切回完整对话滚动

我在 Ghostty 里使用 Codex CLI 时，遇到过一个很反直觉的问题：想向上翻 AI 刚才的长回答，鼠标滚轮却只会切换输入框里的历史命令。

第一反应很容易是去改 Ghostty 的鼠标映射、scrollback 或快捷键。其实问题不在 Ghostty，而在 Codex TUI 默认使用的 **alternate screen（备用屏幕）**。

## 直接解决

退出当前 Codex 会话，重新运行：

```bash
codex --no-alt-screen
```

如果还想接着刚才的对话：

```bash
codex --no-alt-screen resume --last
```

`resume --last` 会恢复最近一次会话；`--no-alt-screen` 会让 TUI 使用 inline mode（内联模式），把输出保留在终端原生的 scrollback 里。

之后用鼠标滚轮或触控板向上滑，看到的就是完整对话，包括你的输入和 AI 输出。

> 本文已在 Codex CLI 0.147.0 核对：`--no-alt-screen` 的命令说明是 “Disable alternate screen mode”，并明确写明 inline mode 会保留 terminal scrollback history。

## 为什么滚轮原来会变成“翻输入历史”

很多全屏终端程序会切换到一块临时的备用屏幕。这样做的好处是退出程序后，原来的终端画面仍然干净；代价是这块屏幕里的内容不一定进入终端自己的回滚区。

在这种模式下，终端或 TUI 还可能把鼠标滚轮转换成方向键事件。Codex 输入框收到向上、向下事件后，就会切换你之前输入过的内容。于是你明明在“滚动”，实际触发的却是输入历史。

`--no-alt-screen` 关闭备用屏幕后，Codex 的输出直接进入普通终端页面，Ghostty 就能按原本的方式滚动整段内容。

## 永久生效

如果你每次都想使用这种模式，可以在 `~/.zshrc` 里添加：

```bash
alias codex='codex --no-alt-screen'
```

然后刷新配置：

```bash
source ~/.zshrc
```

以后输入 `codex`，就会自动带上该参数。

如果你使用的不是 zsh，请把别名写进对应 shell 的启动文件，例如 Bash 常见的是 `~/.bashrc`。可以先执行下面这条命令确认当前 shell：

```bash
echo $SHELL
```

## 两个注意点

### 1. 当前会话不能动态切换

已经打开的 Codex TUI 无法在运行中切换屏幕模式。先退出，再用下面的命令恢复最近会话：

```bash
codex --no-alt-screen resume --last
```

### 2. 这不是 Ghostty 专属参数

`--no-alt-screen` 是 Codex CLI 的参数，不是 Ghostty 配置。Terminal、iTerm2 等终端里如果遇到相同现象，也可以使用。

但不同终端对滚轮事件、备用屏幕和 scrollback 的处理细节可能不同。如果关闭备用屏幕后仍无法滚动，再检查终端自身的鼠标映射和回滚行数设置。

## 如何撤销

删除 `~/.zshrc` 里的这行别名：

```bash
alias codex='codex --no-alt-screen'
```

重新执行 `source ~/.zshrc`，或者打开一个新的终端窗口即可。

这个问题没有复杂配置。一个参数，只是把滚轮重新还给滚轮。


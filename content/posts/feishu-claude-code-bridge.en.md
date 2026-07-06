# 让 Claude Code 接入飞书：人不在电脑前，也能用飞书遥控它持续干活

我想解决的痛点很具体：Claude Code 干活很猛，但它绑在我的电脑前——我一走开、一锁屏、一出门，它就没人管了。任务跑一半卡住等我确认，我在外面根本不知道。于是我做了一个「飞书 ⇄ Claude Code 桥」：在任何项目目录里，用飞书消息驱动本机已经登录好的 Claude Code 干活，进度和结果实时回推到飞书；它遇到要决策的地方就把问题发到飞书，我回一句，它 `--resume` 续上接着干。一句话说清最终效果：**我人在地铁上，用手机飞书发一句「把登录页的报错修了」，回到家发现它已经改完、跑过测试、把 diff 贴回飞书了。**

这篇教程我会把整个东西是怎么搭起来的、飞书后台每一步怎么配、代码大致怎么跑通，全都写清楚，尤其是那个折腾了我很久的「私聊死活不回」的坑——我会用最醒目的方式讲，让你别再踩一遍。文末附上桥的**完整可复制代码**，配好飞书直接就能用。

![人在外面用手机飞书遥控电脑里的 Claude Code 干活](/assets/img/posts/feishu-bridge/cover.png)

## 这套东西到底解决了什么

传统的「后台 AI 任务」有两个老大难：一是**得盯着**，你不看它就停在那；二是**会卡死**，任务跑到需要你拍板的地方，它在后台干等，你在前台也不知道要等什么，双向干瞪眼。

这个桥把这两件事一起解决了。异步协作是核心：我发任务 → 它干 → 它遇到岔路口就问 → 我在飞书回 → 它接着干。全程我不用守着电脑，飞书消息推过来我随手回一句就行。它本质上把「一个需要长时间盯守的同步任务」变成了「一段可以随时插话的异步对话」。

## 为什么能用订阅，不额外花 API 的钱

这是很多人第一反应会担心的点：接一个机器人天天调 Claude，API 账单会不会爆？

不会。因为这个桥的「大脑」不是去调 Anthropic 的 API，而是**直接调用你本机已经登录好的 Claude CLI**，用的是 headless 模式：

```bash
claude -p "你的任务" --output-format stream-json
```

关键在于 `claude -p` 默认会复用你本机 claude CLI 已登录的订阅凭证（也就是你的 Claude Max/Pro 订阅）。我实测过它的输出，里面 `apiKeySource` 是 `none`，命中的是订阅的 `five_hour` 额度池——也就是说走的是你订阅本来就包含的额度，**不额外产生 API 费用**。

为了保险，我在代码里还主动把 `ANTHROPIC_*` 相关的环境变量剥掉再启动子进程，防止某个残留的 `ANTHROPIC_API_KEY` 把它「兜底」切到 API 计费上去。确保它老老实实走订阅。

## 准备工作

在碰飞书之前，先确认本机的 Claude CLI 是好的：

1. 装好 Claude CLI，并且已经 `claude login` 登录过、能正常用你的订阅。
2. 在命令行里手动跑一次 headless 验证：

```bash
claude -p "用一句话介绍你自己" --output-format stream-json
```

能看到一行行 JSON 流式吐出来，就说明订阅链路是通的。这一步很重要——桥只是在外面套了一层，真正干活的还是这个命令。如果这里就不通，后面全白搭。

3. 装好 Node.js（桥是 Node 写的），准备好飞书官方 SDK：

```bash
npm install @larksuiteoapi/node-sdk
```

## 飞书自建应用配置（重点，尤其权限那块）

打开飞书开放平台 [open.feishu.cn](https://open.feishu.cn)，创建一个「自建应用」。下面每一步都要做，缺一个都可能出现「连上了但收不到消息」的诡异现象。

### 第一步：拿 App ID / App Secret

进「凭证与基础信息」，把 **App ID** 和 **App Secret** 记下来，这俩是桥连飞书用的钥匙，等下要填到代码里（用环境变量存，别硬编码）。

### 第二步：开启机器人能力

进「添加应用能力」，把**机器人**这个能力加上。不加这个，你的应用就没法收发消息。

### 第三步：权限管理（这一步最容易漏，逐条开）

进「权限管理」，把下面这几条权限都开通。我把每条是干嘛的都写清楚：

| 权限 | 作用 |
| --- | --- |
| `im:message` | 收发单聊/群组消息的基础权限，最基本的一条 |
| `im:message:send_as_bot` | 以应用（机器人）身份主动发消息，回推进度靠它 |
| `im:message.group_at_msg:readonly` | 群里被 @ 时能收到那条消息 |
| `im:message.p2p_msg:readonly` | 读取用户跟机器人的**单聊**消息——**这条是重中之重** |

前三条大多数人配的时候都会顺手开，唯独最后那条 `im:message.p2p_msg:readonly` 特别容易漏，而它恰恰是让「私聊能用」的关键。下面我单独拿一大段来讲它，请务必看完。

### 第四步：事件与回调，用长连接

进「事件与回调」，订阅方式选 **「使用长连接接收事件」**。

这里说明一下为什么用长连接：飞书官方 SDK `@larksuiteoapi/node-sdk` 提供了 `WSClient`，本地起一个进程就能和飞书建立一条 WebSocket 长连接，飞书有新消息就顺着这条连接推给你。**它不是 Webhook**——意味着你不需要公网 IP、不需要域名、不需要内网穿透，家里的电脑、笔记本直接就能跑。这对个人用户太友好了。

选好长连接后，添加要订阅的事件：**「接收消息 im.message.receive_v1」**。这是用户给机器人发消息时飞书推给你的事件。

### 第五步：创建版本并发布

进「版本管理与发布」，**创建一个版本并提交发布**。

这一步千万别忘：**上面所有的配置，不发布版本就全部不生效**。你权限勾得再全、事件订阅得再对，不发布，飞书那边一律当没配。很多「怎么配了还是不行」的问题，根子就是忘了发布，或者改了权限后没重新发布。记住一条铁律：**每次改动权限/事件，都要重新发一个版本。**

## 血泪坑：私聊死活不回，根因是缺一条独立权限

这是整篇教程我最想让你记住的地方，专门加粗醒目地讲。

![群里@能用、私聊却不回：根因是缺一条独立的 p2p 权限](/assets/img/posts/feishu-bridge/perm.png)

我当时的现象是这样的：桥的日志显示长连接**明明连上了**，我在**群里 @ 机器人**它能正常收到、能干活；可我一旦跟它**单聊**（私聊），它就**死活不回**——飞书那边压根没往我这推单聊的消息事件。日志干干净净，一点动静都没有，像是石沉大海。

我一开始以为是长连接的问题、是代码没处理好 p2p 分支、是 chat_type 判断错了……排查了很久，最后才定位到根因：

> **飞书推送单聊（p2p）消息事件，校验的是一条独立的权限 `im:message.p2p_msg:readonly`，而不是 `im:message`。**

坑就坑在，`im:message` 的权限说明里明明白白写着「接收单聊消息」，这句话极具误导性。实际上飞书内部是分成两条独立通道放行的：

- **群里被 @** → 靠 `im:message.group_at_msg:readonly` 放行；
- **私聊（p2p）** → 靠 `im:message.p2p_msg:readonly` 放行。

`im:message` 只是个基础位，它并不能单独让飞书把单聊事件推给你。所以当你只开了 `im:message`（甚至加了群 @ 那条）时，就会出现那个诡异组合：**长连接连上了、群消息收得到，唯独单聊死活收不到。**

**解法很简单，但你得先知道是这里的问题**：去权限管理开通 `im:message.p2p_msg:readonly`，然后**重新创建版本并发布**。发布完再私聊机器人，秒回，问题瞬间消失。

如果你现在正卡在「群里能用、私聊没反应」，别怀疑代码，先去检查这条权限有没有开、有没有发布。九成九是它。

## 实用技巧：怎么激活「真正的单聊窗口」

把 p2p 权限配好之后，还有一个容易让人误判的小陷阱，我也踩过。

飞书里有一种会话，**标题是机器人的名字、长得跟私聊一模一样，但它其实是个「双人群」**（一个只有你和机器人两个人的群）。这种会话的行为跟真单聊不同：它走的是群的逻辑，**你不 @ 机器人它就不理你**。于是你会以为「p2p 权限白配了，私聊还是不回」，其实是你压根没在真单聊里说话。

最稳的激活办法是：**让机器人用你的 open_id 主动给你发一条单聊消息**。飞书收到机器人发来的这条 p2p 消息后，会给你弹出一个**真正的单聊窗口**，之后你在这个窗口里说话就是纯 p2p、不用 @、直接就回。

那你的 open_id 从哪来？很简单——先随便跟机器人互动一下（哪怕在双人群里 @ 它一句），桥在处理消息事件时会把发消息人的 open_id 打进调试日志，你从日志里把那串 `ou_` 开头的 id 拿出来，让桥用它主动发一条消息给你即可。弹出真单聊窗口后，一切就顺了。

## 桥的核心代码原理

代码整体不复杂，文末会附完整可复制版本，这里只讲清楚数据是怎么流的和几个关键点。整条链路就三段：**收飞书消息 → 调 `claude -p` → 把输出回推飞书。**

![飞书消息 → 桥 → claude -p → 进度回推 的三段链路](/assets/img/posts/feishu-bridge/arch.png)

### 收消息：WSClient 长连接

用官方 SDK 起一个 `WSClient`，注册 `im.message.receive_v1` 事件的回调。飞书有新消息时，回调里能拿到消息内容、发消息人的 open_id、以及会话的 chat_id。桥以 chat_id 为单位维护会话状态——**一个飞书会话对应一份上下文**。

### 项目路由：/bind

我设计了一个约定：在飞书里发 `/bind <目录>`，就把当前这个飞书会话绑定到某个本地项目目录，比如：

```
/bind ~/code/myapp
```

绑定之后，这个会话里发的所有任务，都会在 `~/code/myapp` 这个目录里执行 `claude -p`。**一个飞书会话绑一个项目**，互不干扰。你可以开好几个群分别绑不同项目，井水不犯河水。

### 调 claude -p：headless + 流式输出

拿到任务文本后，桥在绑定的目录里起一个子进程：

```bash
claude -p "<任务>" \
  --output-format stream-json \
  --permission-mode <模式> \
  --resume <session_id>   # 续接时才带
```

几个关键点：

- **剥环境变量**：起子进程前把 `ANTHROPIC_*` 清掉，确保走订阅（前面讲过了）。
- **stream-json**：让它一行行地流式吐 JSON，桥逐行解析。
- **`--permission-mode`**：headless 下用它来控制权限模式（后面「权限与安全」细说）。

### 进度回推：把 tool_use 翻成人话

桥逐行解析 stream-json 的输出，重点盯 `tool_use` 类型的事件——Claude Code 每次要写文件、跑命令，都会吐一个对应的 tool_use。桥把这些翻译成人能看懂的一句话推到飞书，比如：

- 写文件 → `📝 写文件 src/login.tsx`
- 跑命令 → `⚙️ 跑命令 npm test`

这样我在飞书里就能**实时**看到它在干嘛，而不是干等一个最终结果。任务跑完，再把最终回复整段推过来。

### 多轮续接：resume 保持同一个 session

Claude Code 每次运行会给出一个 `session_id`。桥把它跟飞书会话（chat_id）存成对应关系。下一轮我再在这个会话里发消息，桥就带上 `--resume <session_id>` 起子进程，Claude Code 就能续上之前的完整上下文接着干。

我实测过一个很关键的行为：**`--resume` 之后 session_id 保持不变**。所以一个飞书会话对应一个固定的 session_id，多轮来回都是同一条上下文线，不会越聊越乱。

### 它提问 → 飞书答 → 继续（这是最爽的一环）

这是整个设计的点睛之笔。headless 模式下，当 Claude Code 遇到需要用户决策的地方（比如「我要不要删掉这个文件」「有两种改法你选哪个」），它**不会卡死在那干等**——而是把这个问题当作**本轮的回复内容**返回，然后**本轮就正常结束**。

桥拿到这个「其实是个提问」的回复，照常推到飞书。我在飞书里回一句「选第二种」，桥就把我的回答通过 `--resume` 喂回去，Claude Code 续上上下文、拿到我的决定，接着干下去。

这个机制从根上消除了「后台任务卡死、双向干等」的痛点：**它永远不会挂起，只会把球踢回给我；我什么时候回，它什么时候接着跑。** 异步协作的手感就是这么来的。

## 在飞书里到底怎么用

配好之后，日常用起来就这么几个动作：

1. **绑项目**：在一个飞书会话里发 `/bind ~/code/myapp`，把这个会话绑到你要干活的目录。
2. **发任务**：直接发自然语言，比如「给登录页加一个记住密码的选项，然后跑一下测试」。
3. **看进度**：桥会实时把 `📝 写文件` / `⚙️ 跑命令` 推给你，最后推最终结果。
4. **多轮续接**：结果不满意，直接再发一句「按钮再往下挪 8px」，它 `--resume` 续上接着改，不用重头讲背景。
5. **回答它的提问**：它问你「A 方案还是 B 方案」，你回一句它就接着干。

整个过程你可以人在任何地方，用手机飞书就能推进。

## 权限与安全说明

这套东西本质上是**让飞书消息能在你本机执行命令**，所以安全边界你必须想清楚：

- **权限模式**：headless 下用 `--permission-mode` 控制放行尺度。想省心可以放宽，但那意味着它可以自主写文件、跑命令；想稳妥就收紧，让敏感操作有约束。自己权衡，别无脑全放开。
- **谁能发消息**：这个机器人谁能拉进群、谁能私聊到，就等于谁能遥控你的电脑。建议只在你自己、或极小范围可信的人里用，别把它拉进大群。
- **凭证保管**：App ID / App Secret 用环境变量存，别提交进 Git。
- **绑定目录要清楚**：`/bind` 到哪个目录，它就能动那个目录里的东西，绑之前想清楚。

一句话：**方便和权限是一体两面，这东西越好用就越要管好谁能碰它。**

## 常见坑排查清单

把我踩过和可能踩的坑集中列一下，出问题照着这个顺序查：

| 现象 | 大概率原因 | 解法 |
| --- | --- | --- |
| 群里 @ 能用，**私聊死活不回** | 缺 `im:message.p2p_msg:readonly` 权限 | 开通该权限，**重新发布版本** |
| 私聊也不回，但看着像私聊 | 其实是「双人群」，不 @ 不理你 | 让机器人用你 open_id 主动发一条，弹出真单聊窗口 |
| 长连接连上了，但**任何消息都收不到** | 事件没订阅，或改了配置**没发布** | 检查订阅了 `im.message.receive_v1`，并重新发布 |
| 完全连不上飞书 | App ID / Secret 填错 | 核对凭证，确认没写错、没带空格 |
| 突然开始走 API 计费 | 残留的 `ANTHROPIC_*` 环境变量把它切到 API 了 | 起子进程前剥掉 `ANTHROPIC_*`，确认 `apiKeySource: none` |
| Claude 本身跑不起来 | 本机 CLI 没登录/订阅没通 | 先单独跑 `claude -p` 验证订阅链路 |

排查的总原则：**先分清是「飞书没把消息推过来」还是「Claude 没干活」**。前者去查权限和发布，后者去单独跑 `claude -p`。两段分开验，问题定位会快很多。

## 完整代码

下面是桥的完整代码，四个文件，配好飞书后直接就能跑。用 Node.js（20+）。先建个空目录，`npm init -y && npm install @larksuiteoapi/node-sdk`，把下面文件放进去。

### 1. `claude-code.js` —— 调本机 Claude Code

这是「大脑」适配层：拼 `claude -p` 命令、解析 stream-json、抽 session_id、把 tool_use 翻成进度。

```js
// claude-code.js —— 用 headless 模式调用本机已登录的 Claude Code
import { spawn } from "node:child_process";

const CLAUDE_BIN = process.env.CLAUDE_BIN || "claude";
// 权限模式：想完全无人值守用 bypassPermissions；想稳妥用 acceptEdits / default
const PERMISSION_MODE = process.env.FEISHU_PERMISSION_MODE || "bypassPermissions";
const TASK_TIMEOUT_MS = Number(process.env.FEISHU_TASK_TIMEOUT_MS || 30 * 60 * 1000);

function truncate(s, n) {
  if (!s) return "";
  s = String(s).replace(/\s+/g, " ").trim();
  return s.length > n ? s.slice(0, n) + "…" : s;
}

// 把一次 tool_use 渲染成一句「正在干什么」
function formatToolUse(b) {
  const i = b.input || {};
  switch (b.name) {
    case "Bash":  return `  ⚙️ 跑命令：${truncate(i.command, 80)}`;
    case "Read":  return `  📖 读文件：${i.file_path || ""}`;
    case "Edit":  return `  ✏️ 改文件：${i.file_path || ""}`;
    case "Write": return `  📝 写文件：${i.file_path || ""}`;
    case "Grep":  return `  🔍 搜索：${truncate(i.pattern, 60)}`;
    case "Task":  return `  🤖 子任务：${truncate(i.description || i.prompt, 60)}`;
    default:      return `  🛠️ ${b.name}`;
  }
}

function eventToProgress(ev) {
  if (ev?.type === "assistant" && ev.message?.content) {
    const lines = ev.message.content
      .filter((b) => b.type === "tool_use")
      .map(formatToolUse);
    return lines.length ? lines.join("\n") : null;
  }
  return null;
}

/**
 * 在指定目录里以 headless 模式驱动一次 Claude Code。
 * @returns {Promise<{text, sessionId, isError, durationMs}>}
 */
export function runClaudeCode({ prompt, cwd, sessionId, onProgress, signal } = {}) {
  return new Promise((resolve) => {
    const args = [
      "-p", prompt,
      "--output-format", "stream-json",
      "--verbose",
      "--permission-mode", PERMISSION_MODE,
    ];
    if (sessionId) args.push("--resume", sessionId);

    // 关键：剥掉 ANTHROPIC_*，强制走本机登录态（订阅），而不是 API key
    const env = { ...process.env };
    delete env.ANTHROPIC_API_KEY;
    delete env.ANTHROPIC_AUTH_TOKEN;
    delete env.ANTHROPIC_BASE_URL;
    delete env.ANTHROPIC_MODEL;

    const startedAt = Date.now();
    const child = spawn(CLAUDE_BIN, args, { cwd: cwd || process.cwd(), env, stdio: ["ignore", "pipe", "pipe"] });

    let resolvedSessionId = sessionId || null;
    let finalText = "", isError = false, stderrBuf = "", settled = false, lineBuf = "";

    const timer = setTimeout(() => {
      if (!settled) { child.kill("SIGKILL"); isError = true; finalText = `任务超时，已中断。`; }
    }, TASK_TIMEOUT_MS);

    if (signal) {
      if (signal.aborted) child.kill("SIGKILL");
      else signal.addEventListener("abort", () => child.kill("SIGKILL"), { once: true });
    }

    child.stdout.on("data", (chunk) => {
      lineBuf += chunk.toString();
      let idx;
      while ((idx = lineBuf.indexOf("\n")) >= 0) {
        const line = lineBuf.slice(0, idx);
        lineBuf = lineBuf.slice(idx + 1);
        if (line.trim()) handleLine(line);
      }
    });
    child.stderr.on("data", (c) => { stderrBuf += c.toString(); });

    function handleLine(line) {
      let ev; try { ev = JSON.parse(line); } catch { return; }
      if (ev.session_id) resolvedSessionId = ev.session_id;
      if (ev.type === "result") {
        finalText = typeof ev.result === "string" ? ev.result : finalText;
        if (ev.is_error || ev.subtype?.startsWith?.("error")) isError = true;
        return;
      }
      if (onProgress) {
        const p = eventToProgress(ev);
        if (p) { try { onProgress(p); } catch {} }
      }
    }

    child.on("error", (err) => finish(`无法启动 Claude Code（${err.message}）。确认本机装了 claude CLI。`, true));
    child.on("close", (code) => {
      if (lineBuf.trim()) handleLine(lineBuf.trim());
      if (settled) return;
      if (code !== 0 && !finalText) finish(stderrBuf.trim() || `Claude Code 退出码 ${code}`, true);
      else finish(finalText || "（这一轮没有产出文字）", isError);
    });

    function finish(text, err) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ text, sessionId: resolvedSessionId, isError: !!err, durationMs: Date.now() - startedAt });
    }
  });
}
```

### 2. `bridge-state.js` —— 项目路由 + 会话续接 + 落盘

管两件「记忆」：每个飞书会话绑哪个目录、对应哪个 session_id，落盘到 `.bridge/state.json`，重启不丢。

```js
// bridge-state.js —— 项目路由 + 会话续接 + 落盘
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const STATE_DIR = path.join(process.cwd(), ".bridge");
const STATE_FILE = path.join(STATE_DIR, "state.json");
let state = { chats: {} };

export function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      if (!state.chats) state.chats = {};
    }
  } catch { state = { chats: {} }; }
  return state;
}

function saveState() {
  try {
    if (!fs.existsSync(STATE_DIR)) fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (e) { console.error(`[bridge] 写 state 失败：${e.message}`); }
}

function expandPath(p) {
  if (!p) return p;
  if (p === "~") return os.homedir();
  if (p.startsWith("~/")) return path.join(os.homedir(), p.slice(2));
  return path.resolve(p);
}

export function getChat(chatId) { return state.chats[chatId] || null; }

export function bindProject(chatId, target) {
  if (!target?.trim()) return { ok: false, error: "请给出项目目录，例如 /bind ~/code/myapp" };
  const dir = expandPath(target.trim());
  if (!fs.existsSync(dir)) return { ok: false, error: `目录不存在：${dir}` };
  if (!fs.statSync(dir).isDirectory()) return { ok: false, error: `不是目录：${dir}` };
  // 换目录 = 开新上下文，sessionId 清空，避免跨项目串上下文
  state.chats[chatId] = { projectDir: dir, sessionId: null, name: path.basename(dir) };
  saveState();
  return { ok: true, dir };
}

export function updateSession(chatId, sessionId) {
  if (!state.chats[chatId]) return;
  state.chats[chatId].sessionId = sessionId || null;
  saveState();
}

export function resetSession(chatId) {
  if (!state.chats[chatId]) return false;
  state.chats[chatId].sessionId = null;
  saveState();
  return true;
}
```

### 3. `feishu-bridge.js` —— 飞书适配器（收发 + 命令 + 进度）

用官方 SDK 长连接收消息，把 `handleMessage` 接到 `runClaudeCode`，支持 `/bind` `/new` `/stop` 等命令。

```js
// feishu-bridge.js —— 飞书 ⇄ Claude Code 桥 · 适配器
import * as lark from "@larksuiteoapi/node-sdk";
import { runClaudeCode } from "./claude-code.js";
import { loadState, getChat, bindProject, updateSession, resetSession } from "./bridge-state.js";

const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;
const PROGRESS_FLUSH_MS = Number(process.env.FEISHU_PROGRESS_FLUSH_MS || 4000);

export function assertBridgeConfig() {
  if (APP_ID && APP_SECRET) return;
  console.error("❌ 缺少飞书凭证，请在 .env 里配 FEISHU_APP_ID / FEISHU_APP_SECRET");
  process.exit(1);
}

function makeClients() {
  const base = { appId: APP_ID, appSecret: APP_SECRET };
  const wsClient = new lark.WSClient({ ...base, loggerLevel: lark.LoggerLevel.error });
  const client = new lark.Client({ ...base, appType: lark.AppType.SelfBuild, domain: lark.Domain.Feishu });
  return { wsClient, client };
}

const seenMessageIds = new Set();
const running = new Map(); // chatId -> { abort }

function stripMentions(text, mentions) {
  let out = text;
  for (const m of mentions || []) if (m.key) out = out.split(m.key).join("");
  return out.trim();
}

// 粗判这一轮是不是「在提问 / 等你决策」，是则飞书提示语改醒目
function looksLikeQuestion(text) {
  if (!text) return false;
  if (/[?？]\s*$/.test(text.trim().slice(-40))) return true;
  return /(请(告诉|问|确认|选择|回复)|哪一?个|还是|需要你|你定|等你(确认|回复|定)|要不要|是否需要)/.test(text);
}

async function sendText(client, chatId, text) {
  const safe = (text && String(text).trim()) || "（这一轮没有产出文字）";
  const CHUNK = 3500; // 飞书单条文本有长度上限，过长切片发
  for (let i = 0; i < safe.length; i += CHUNK) {
    await client.im.message.create({
      params: { receive_id_type: "chat_id" },
      data: { receive_id: chatId, msg_type: "text", content: JSON.stringify({ text: safe.slice(i, i + CHUNK) }) },
    }).catch((e) => console.error(`发送失败：${e.message}`));
  }
}

async function handleCommand(client, chatId, text) {
  if (!text.startsWith("/")) return false;
  const [cmd, ...rest] = text.slice(1).split(/\s+/);
  const arg = rest.join(" ").trim();
  switch (cmd.toLowerCase()) {
    case "bind": {
      const r = bindProject(chatId, arg);
      await sendText(client, chatId, r.ok ? `✅ 已绑定项目目录：\n${r.dir}\n\n直接发任务即可。` : `❌ ${r.error}`);
      return true;
    }
    case "where": {
      const c = getChat(chatId);
      await sendText(client, chatId, c?.projectDir ? `📁 ${c.projectDir}\n🧵 ${c.sessionId ? "续接中" : "新会话"}` : "还没绑定，发 /bind <目录>");
      return true;
    }
    case "new": { resetSession(chatId); await sendText(client, chatId, "🆕 已开新会话。"); return true; }
    case "stop": {
      const r = running.get(chatId);
      if (r) { r.abort.abort(); await sendText(client, chatId, "🛑 已中断。"); }
      else await sendText(client, chatId, "当前没有正在跑的任务。");
      return true;
    }
    case "help":
      await sendText(client, chatId, "/bind <目录> 绑项目\n/where 看状态\n/new 开新会话\n/stop 中断\n绑定后直接发任务。");
      return true;
    default: return false;
  }
}

export function startFeishuBridge({ clients } = {}) {
  loadState();
  const { wsClient, client } = clients || makeClients();

  const onMessage = async (data) => {
    try {
      const message = data?.message || data?.event?.message;
      if (!message) return;
      const mid = message.message_id;
      if (mid && seenMessageIds.has(mid)) return; // 去重：飞书超时会重投同一条
      if (mid) seenMessageIds.add(mid);
      if (message.message_type !== "text") return;

      let text = "";
      try { text = JSON.parse(message.content || "{}").text || ""; } catch {}
      text = stripMentions(text, message.mentions);
      if (!text) return;

      handleMessage(message.chat_id, text).catch((e) =>
        sendText(client, message.chat_id, `❌ 出错了：${e.message}`).catch(() => {}));
    } catch (e) { console.error(`处理事件出错：${e.message}`); }
  };

  async function handleMessage(chatId, text) {
    if (await handleCommand(client, chatId, text)) return;
    const chat = getChat(chatId);
    if (!chat?.projectDir) { await sendText(client, chatId, "👋 还没绑定项目。先发：/bind ~/你的项目路径"); return; }
    if (running.has(chatId)) { await sendText(client, chatId, "⏳ 上个任务还在跑，/stop 可中断。"); return; }

    const abort = new AbortController();
    running.set(chatId, { abort });

    let buf = [], timer = null;
    const flush = () => { if (buf.length) { sendText(client, chatId, buf.join("\n")).catch(() => {}); buf = []; } };
    const onProgress = (line) => { buf.push(line); if (!timer) timer = setTimeout(() => { timer = null; flush(); }, PROGRESS_FLUSH_MS); };

    await sendText(client, chatId, `🚀 开始干活（${chat.name}）…`);
    try {
      const r = await runClaudeCode({ prompt: text, cwd: chat.projectDir, sessionId: chat.sessionId, onProgress, signal: abort.signal });
      if (timer) clearTimeout(timer);
      flush();
      updateSession(chatId, r.sessionId);
      const took = (r.durationMs / 1000).toFixed(0);
      const head = r.isError ? "⚠️ 结束（有异常）"
        : looksLikeQuestion(r.text) ? "🤔 需要你回一句（它在等你决策，回复后接着干）"
        : "✅ 完成";
      await sendText(client, chatId, `${head}（${took}s）\n\n${r.text}`);
    } finally { running.delete(chatId); }
  }

  const dispatcher = new lark.EventDispatcher({}).register({ "im.message.receive_v1": onMessage });
  wsClient.start({ eventDispatcher: dispatcher });
  console.log("🌉 飞书 ⇄ Claude Code 桥已启动（长连接）。先 /bind 一个项目目录再发任务。");
  return { onMessage, handleMessage, client, wsClient };
}
```

### 4. `index.js` —— 入口

```js
// index.js —— 桥入口
import { assertBridgeConfig, startFeishuBridge } from "./feishu-bridge.js";

assertBridgeConfig();
startFeishuBridge();

process.on("SIGINT", () => { console.log("\n👋 已停止。"); process.exit(0); });
await new Promise(() => {}); // 永不 resolve：吊住进程，让长连接常驻在线
```

### package.json 与启动

`package.json` 里加 `"type": "module"`（因为用了 ESM import），然后：

```bash
# .env 里填飞书凭证
# FEISHU_APP_ID=cli_xxxx
# FEISHU_APP_SECRET=xxxx

# 启动（剥掉 ANTHROPIC_* 确保走订阅）
env -u ANTHROPIC_API_KEY -u ANTHROPIC_AUTH_TOKEN -u ANTHROPIC_BASE_URL \
  node --env-file=.env index.js
```

看到「🌉 桥已启动」就成了。去飞书私聊机器人，发 `/bind ~/你的项目`，再发任务，它就在那个目录里干活、把进度和结果回推给你。

## 结尾

这套「飞书 ⇄ Claude Code 桥」我实际用下来最大的感受是：它把 Claude Code 从「一个绑在电脑前、需要我盯着的工具」，变成了「一个我随时能用手机指挥、它自己会推进、卡住了会主动问我的异步同事」。人不在电脑前，活照样往前走。

而且成本几乎为零——用的是你本来就在付的 Claude 订阅，飞书长连接不要公网、不要服务器，一台开着的电脑就够了。

如果你也想搭，把这篇里飞书那几步权限配对（**尤其别忘了 `im:message.p2p_msg:readonly` 和每次改完都发版本**），本机 `claude -p` 先验通，剩下的桥接代码文末都给全了。祝你也能早点体验到「在外面发一句、回家发现活干完了」的爽感。

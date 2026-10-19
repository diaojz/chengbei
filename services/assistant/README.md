# 城北站内助手服务端（后端已部署，聊天未开放）

GitHub Pages 继续托管网站，Node 24 + SQLite 服务部署在独立服务器。Cloudflare Worker 需要不同运行时适配，本实现不直接运行在 Worker。当前 `content/assistant.json` 关闭AI，线上原文检索不变。日本网关独立容器已部署，DeepSeek Key已由本机钥匙串安全传入并加密存储；HTTPS地址为 `https://assistant.chengbei.org/health`。仍缺Turnstile生产配置，健康检查 `ready:false`；尚未做真实付费模型问答验收。

## 默认限制

- DeepSeek官方 `deepseek-flash`，关闭思考模式；不提供工具、联网搜索、用户URL抓取或自定义模型参数。
- 单问题400字、最多600输出token；仅检索50份本站公开资料，无资料不调用模型。每次独立回答，不传整段聊天历史。
- 同一IP每分钟3次、每天10次；全站每天200次；全站并发3个，同一IP并发1个。共享网络可能共用额度，换IP可能绕过单IP限额。
- 生产必须验证Turnstile的hostname及action。Origin只防浏览器跨站调用，不能当作身份验证；不能保证完全杜绝攻击。
- SQLite持久化计数，必须挂载数据卷，重启不清零；多实例只能共享同一个本地SQLite文件，不能各自复制账本。
- 缓存相同问题24小时；命中仍消耗请求次数，但不调用模型。发布新内容时重新生成语料，revision自动使旧缓存失效。
- 月预算必须显式设置，按最坏请求先预留；有可信usage才结算，超时等未知结果保留预留额度。只保存IP的HMAC、额度、缓存答案及来源，不保存原始IP与提问日志。

## 价格与预算边界

2026-10-19查询官方 https://api-docs.deepseek.com/quick_start/pricing 和 https://api-docs.deepseek.com/api/create-chat-completion ：Flash高峰缓存未命中输入$0.30/百万token、输出$1.20/百万token。按高峰、未命中价格估算。模型默认开启思考，因此请求显式 `thinking: {type: disabled}`。

用户已确认模型费每月¥10；服务端按保守汇率8换算为$1.25预留额度，配置高于$1.25时拒绝启动，避免误配扩大预算。预留输入按消息UTF-8字节数加1024模板余量估算，输出按上限计。模型价格可能变动，估算不等同于供应商账单硬限额；上线时使用独立API Key，并在供应商控制台设置余额/限额以形成第二道止损。外部托管/验证码费用不在token预算内。

## 配置与上线顺序

1. 预算已确认每月¥10；API Key已保存本机钥匙串，目标为日本网关aigw。密钥不得粘贴到公开仓库或前端；复制 `.env.example` 到服务器私有环境文件填写。`CHAT_IP_SECRET`用32字节以上随机值。
2. 为 `chengbei.org` 创建Turnstile组件；服务端保存secret，前端只放公开site key。
3. `npm run build && node scripts/build-assistant-corpus.mjs` 生成只含公开内容的服务端语料。
4. 仓库根目录构建：`docker build -f services/assistant/Dockerfile -t chengbei-assistant .`。容器只绑定服务器回环接口：`-p 127.0.0.1:8787:8787`；挂载受保护的持久化 `/data` 数据卷，传入环境文件。数据目录需由容器node用户拥有，勿将SQLite放进公开静态目录。
5. 通过HTTPS反向代理暴露独立API域名；限制body到4KiB、连接频率、超时。只有代理覆盖 `X-Real-IP` 且容器端口不对公网开放时，才设 `CHAT_TRUST_PROXY=1`；否则保持0。示例Nginx：`proxy_set_header X-Real-IP $remote_addr;`。代理禁止日志记录Authorization及请求体。
6. 验证 `/health`、验证码失败、站外来源、无关问题、次数/预算耗尽、重启后账本保留，以及真实模型引用与实际usage。仅在用户授权预算后做真实付费测试。
7. 最后修改 `content/assistant.json` 为 `enabled:true`，配置HTTPS `/chat` 及公开Turnstile key，再正常提交推送部署前端。前端限额/验证码失败自动回退原文检索，不影响看文章。

## 运维

账本丢失会丢失额度记录，备份SQLite需使用SQLite备份API或停服后同时处理WAL，不能只复制活动主文件。IP密钥轮换会重置访客识别，但全站额度/月预算仍保留。停用可设前端开关false并停止服务；停止服务不删除账本。复用现有服务器，未新购服务器；真实模型调用按供应商账单计费。

## 密钥与代码管理

- 生产优先使用平台提供的加密Secret存储并挂载文件；服务端支持 `DEEPSEEK_API_KEY_FILE`、`CHAT_IP_SECRET_FILE`、`TURNSTILE_SECRET_KEY_FILE`。同一项不能同时设置内联值和文件路径；文件需服务账号可读，权限0400/0600。容器镜像不包含任何秘密。
- 文件权限不等于静态加密。静态加密由部署平台Secret服务或宿主机密钥/加密卷管理完成，解密根密钥不得与加密内容一起放仓库。传输使用浏览器到API及API到DeepSeek的HTTPS。服务器管理员或服务器失陷仍可能获取运行中的密钥，不能承诺绝对安全。
- `.dockerignore` 按白名单构建上下文；`.gitignore` 排除环境文件、secrets目录、私钥、数据库。示例文件只能放空值和路径说明。
- `npm run secret:scan` 检查常见密钥格式；构建结束额外检查公开dist。提交可使用 `git -c core.hooksPath=.githooks commit ...`；仓库维护者也可在合适工作区启用hooks。hook读取真正暂存的blob，避免工作区与暂存区内容不一致导致漏检。
- GitHub已开启Secret Scanning与Push Protection，2026-10-19查询未发现告警。公共规则与本地扫描都不能识别所有可能的凭证格式；若误推送，先撤销/轮换Key，再清理历史，不能只删最新文件。
- 密钥只在服务端内存及发往官方HTTPS接口的Authorization头中使用，不进入模型上下文、前端响应或应用日志。部署时不要在反向代理、APM和错误收集中记录请求凭证/环境变量；不要将私有配置或Secret备份到公开仓库。
- 聊天目前仍未启用；静态加密和HTTPS已部署，密钥轮换仍需后续实际演练。独立Key、每月10元预算及供应商余额止损一起使用。

## 日本网关机部署（2026-10-19）

目标为现有 `aigw`，网站仍托管 GitHub Pages。新增独立 `chengbei-assistant` systemd服务与容器；只监听127.0.0.1:8787，不修改原网关和VPN配置。`CHAT_ENABLED` 必须显式为1才开放；默认0时健康接口 `ready:false`，聊天503，前端继续关闭。

`deploy/credential-store.py` 由root运行，使用AES-256-GCM加密凭据；密文在 `/var/lib/chengbei-assistant/secrets.aesgcm`，主机根密钥在 `/etc/chengbei-assistant/host.key`，均不得进入仓库、镜像或普通备份。启动时仅解密到 `/run/chengbei-assistant`，以0400文件逐个只读挂载。此方式不能抵御同机root失陷。原始DeepSeek Key从本机钥匙串经SSH标准输入传递，不写本机明文临时文件。

容器限制192MiB内存、0.35 CPU、64进程、只读根文件系统；持久账本位于 `/var/lib/chengbei-assistant/data`。部署前保存Caddy配置和原容器ID。仅在真实验证码、HTTPS和问答验收通过后开启前端。

回滚：将前端开关关闭；`systemctl disable --now chengbei-assistant` 停止独立服务，保留密文及账本。镜像版本由 `/etc/chengbei-assistant/runtime.env` 的 `ASSISTANT_IMAGE` 指定，切回原版本后只重启助手服务。若增加独立Caddy站点，移除该站点后先validate再reload；勿直接恢复旧全量配置覆盖后续其它变更。不得删除原网关容器。

### 本次部署证据

- 版本 `1583c0d`，45项本地测试通过，Astro构建及dist密钥扫描通过。
- 健康接口HTTPS正常，`ready:false`，聊天503；这是安全关闭状态，不代表模型问答已验收。
- 助手空闲约44MiB内存；原有三个网关容器ID、Caddy和x-ui主进程ID均保持不变。
- 独立DNS记录ID `47be2fcd9a5370907279c9fa9ab51a9c`，仅新增assistant子域名。Caddy原配置备份在服务器 `/opt/chengbei-assistant/backups/Caddyfile.initial`（含私有配置，不应下载提交）。
- 本机代理路径访问新子域出现TLS握手错误；本机绕过代理并指定目标IP的HTTPS已通过。其它网络访问另行验证，不把服务启动当作所有网络均可用。

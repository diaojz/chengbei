# 城北站内助手服务端（尚未上线）

GitHub Pages 继续托管网站，Node 24 + SQLite 服务部署在独立服务器。Cloudflare Worker 需要不同运行时适配，本实现不直接运行在 Worker。当前 `content/assistant.json` 关闭AI，线上原文检索不变。没有真实模型调用、密钥配置或生产服务验收。

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

服务端预算使用USD；¥30若按保守汇率8换算约$3.75，须用户确认。预留输入按消息UTF-8字节数加1024模板余量估算，输出按上限计。模型价格可能变动，估算不等同于供应商账单硬限额；上线时使用独立API Key，并在供应商控制台设置余额/限额以形成第二道止损。外部托管/验证码费用不在token预算内。

## 配置与上线顺序

1. 用户确认预算、API Key安全位置和服务器。密钥不得粘贴到公开仓库或前端；复制 `.env.example` 到服务器私有环境文件填写。`CHAT_IP_SECRET`用32字节以上随机值。
2. 为 `chengbei.org` 创建Turnstile组件；服务端保存secret，前端只放公开site key。
3. `npm run build && node scripts/build-assistant-corpus.mjs` 生成只含公开内容的服务端语料。
4. 仓库根目录构建：`docker build -f services/assistant/Dockerfile -t chengbei-assistant .`。容器只绑定服务器回环接口：`-p 127.0.0.1:8787:8787`；挂载受保护的持久化 `/data` 数据卷，传入环境文件。数据目录需由容器node用户拥有，勿将SQLite放进公开静态目录。
5. 通过HTTPS反向代理暴露独立API域名；限制body到4KiB、连接频率、超时。只有代理覆盖 `X-Real-IP` 且容器端口不对公网开放时，才设 `CHAT_TRUST_PROXY=1`；否则保持0。示例Nginx：`proxy_set_header X-Real-IP $remote_addr;`。代理禁止日志记录Authorization及请求体。
6. 验证 `/health`、验证码失败、站外来源、无关问题、次数/预算耗尽、重启后账本保留，以及真实模型引用与实际usage。仅在用户授权预算后做真实付费测试。
7. 最后修改 `content/assistant.json` 为 `enabled:true`，配置HTTPS `/chat` 及公开Turnstile key，再正常提交推送部署前端。前端限额/验证码失败自动回退原文检索，不影响看文章。

## 运维

账本丢失会丢失额度记录，备份SQLite需使用SQLite备份API或停服后同时处理WAL，不能只复制活动主文件。IP密钥轮换会重置访客识别，但全站额度/月预算仍保留。停用可设前端开关false并停止服务；停止服务不删除账本。部署计费由账号决定，尚未创建任何付费资源。

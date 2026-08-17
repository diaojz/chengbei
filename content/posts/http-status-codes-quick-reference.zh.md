# HTTP 状态码速查：看到 401、404、500，先往哪查？

Vibe Coding 让写代码变快了，但报错并没有消失。屏幕上突然出现 `401`、`404`、`500`，很多人的第一反应仍然是把整段代码丢给 AI，然后等它猜。

其实 HTTP 状态码不是最终诊断书，更像一块路标。先看第一位，就能快速判断问题大致出在成功处理、跳转缓存、请求一侧，还是服务器一侧。

这篇按“最常用在前，完整扩展在后”的顺序整理，适合遇到问题时直接搜索数字。

> 本文依据 IANA HTTP Status Code Registry 与 RFC 9110 核对。某些网站会在标准含义上增加自己的业务解释，最终仍要以该产品的响应正文和文档为准。

## 先记这一张：第一位决定排查方向

| 范围 | 大意 | 第一排查方向 |
| --- | --- | --- |
| `1xx` | 处理中 | 协议协商、长连接；普通用户很少需要处理 |
| `2xx` | 成功 | 再看响应正文和业务结果 |
| `3xx` | 跳转或缓存 | `Location`、缓存、域名与路由规则 |
| `4xx` | 请求一侧未满足要求 | URL、参数、认证、权限、请求方法 |
| `5xx` | 服务一侧未完成请求 | 服务日志、网关、数据库、上游依赖 |

两条边界一定要记住：

- `4xx` 不一定是“用户操作错了”。前端拼错参数、SDK 过期、网关改写请求，也会制造 `4xx`。
- `5xx` 不一定是当前服务的代码有 bug。数据库、DNS、TLS、反向代理和第三方 API 都可能是根因。

## 高频速查：先认这 10 个

### 400 Bad Request：请求写得不对

服务器无法按当前格式理解或接受请求。优先检查：

- JSON 有没有少逗号、引号或括号；
- 字段名、类型和必填项是否正确；
- URL 参数和字符编码是否符合接口要求；
- 请求正文是否被网关或客户端改坏。

### 401 Unauthorized：没有通过身份认证

名称里虽然写着 `Unauthorized`，实际更接近“我还不能确认你是谁”。

检查 Token、Cookie、登录态、签名、过期时间，以及请求有没有真的带上 `Authorization`。有些接口还会通过响应头 `WWW-Authenticate` 告诉你应该使用哪种认证方式。

### 403 Forbidden：知道你是谁，但不允许

身份通常已经明确，只是当前账号或请求条件没有权限。检查角色与权限、资源归属、IP 或地域限制、CSRF、防火墙和 WAF 规则。

一句话区分：`401` 是“没认出你”，`403` 是“认出你也不让进”。

### 404 Not Found：路径或资源找不到

检查 URL 拼写、前后端路由、资源 ID、接口前缀、部署版本和反向代理配置。

但 `404` 也可能是有意隐藏：为了防止陌生人通过返回结果推测某个资源是否存在，服务端可能对无权访问者统一返回 `404`，而不是 `403`。

### 429 Too Many Requests：请求太频繁

你碰到了限流或配额。查看响应头 `Retry-After`，使用指数退避，减少并发和无意义重试。不要立刻开更多循环继续撞接口。

### 500 Internal Server Error：服务端内部异常

这是服务器无法给出更具体解释时的兜底错误。后端优先查同一时间点的日志、异常栈和 Request ID，再看数据库、环境变量、磁盘、内存及第三方依赖。

### 502 Bad Gateway：网关收到上游的无效响应

入口网关还活着，但后面的服务没有给它一个正常答案。常见方向：上游进程崩溃、端口错误、DNS 或 TLS 失败、反向代理指错地址、返回内容被中途截断。

### 503 Service Unavailable：服务暂时不可用

通常是过载、维护、实例尚未就绪，或所有健康检查都失败。它强调“现在无法服务”，不一定表示程序永久损坏。

### 504 Gateway Timeout：网关等上游超时

网关能找到上游，但等不到及时响应。检查慢查询、死锁、第三方接口、任务卡死，以及网关和应用两侧的超时设置。

一句话区分：`502` 是上游回答得不对，`504` 是上游迟迟不回答，`503` 是服务当前明确接不了活。

### 200 OK：HTTP 成功，不代表业务一定成功

`200` 只说明 HTTP 请求被成功处理。响应正文如果是下面这样，业务仍然失败：

```json
{
  "success": false,
  "code": 500,
  "message": "余额不足"
}
```

调试时必须同时看 HTTP 状态码和响应正文，不能只看到绿色的 `200` 就结束。

## 常用 2xx：成功也有不同阶段

| 状态码 | 含义 | 实际提示 |
| --- | --- | --- |
| `200 OK` | 请求成功 | 继续检查业务字段与数据是否正确 |
| `201 Created` | 资源已创建 | 查新资源 ID 或 `Location` 响应头 |
| `202 Accepted` | 请求已接收 | 异步任务可能尚未完成，还要查任务状态 |
| `204 No Content` | 成功但没有响应正文 | 不要强行把空响应解析成 JSON |
| `206 Partial Content` | 只返回部分内容 | 视频拖动、分段下载和断点续传常见 |

## 常用 3xx：看跳去哪，也看请求方法变没变

| 状态码 | 含义 | 注意点 |
| --- | --- | --- |
| `301 Moved Permanently` | 永久跳转 | 浏览器和搜索引擎可能长期缓存 |
| `302 Found` | 临时跳转 | 登录流程和临时网关规则常见 |
| `303 See Other` | 去另一个地址获取结果 | 后续通常使用 `GET` |
| `304 Not Modified` | 缓存仍有效 | 不是失败；客户端直接使用本地副本 |
| `307 Temporary Redirect` | 临时跳转 | 保持原请求方法和正文 |
| `308 Permanent Redirect` | 永久跳转 | 保持原请求方法和正文 |

调 API 时，特别留意 `POST` 跳转以后有没有被改成 `GET`，以及请求正文是否仍然保留。

## 其他常用 4xx：请求哪里不合要求

| 状态码 | 含义 | 优先检查 |
| --- | --- | --- |
| `405 Method Not Allowed` | 请求方法不允许 | `GET`、`POST`、`PUT`、`DELETE` 是否用错 |
| `408 Request Timeout` | 服务器等待请求超时 | 网络、上传速度和超时设置 |
| `409 Conflict` | 与资源当前状态冲突 | 重复创建、版本冲突、并发写入 |
| `410 Gone` | 资源明确永久下线 | 不要再按临时 `404` 处理 |
| `413 Content Too Large` | 请求体太大 | 文件大小、应用和网关上传限制 |
| `414 URI Too Long` | URL 太长 | 把大段参数改放请求正文 |
| `415 Unsupported Media Type` | 内容类型不支持 | `Content-Type` 和文件格式 |
| `422 Unprocessable Content` | 格式能读，但内容校验失败 | 字段规则、业务校验和语义错误 |
| `425 Too Early` | 请求来得太早 | 重放风险与 TLS early data |
| `428 Precondition Required` | 必须带前置条件 | `If-Match` 等条件请求，避免覆盖冲突 |
| `431 Request Header Fields Too Large` | 请求头过大 | Cookie、Token 或自定义 Header 过多 |
| `451 Unavailable For Legal Reasons` | 因法律原因不可用 | 法规、版权或地区限制 |

### 402 和 418，网上最容易讲歪的两个

`402 Payment Required` 在标准中仍是“保留供未来使用”。现实中，一些 API 会自定义为余额不足、套餐过期或需要付费，但这不是所有服务都必须遵循的统一业务语义。

`418` 在 RFC 9110 中标为 `Unused`。它因“I'm a teapot”成为程序员彩蛋，但不应该被当作正式、通用的业务错误判断。

## 常用 5xx：服务、网关还是协议问题

| 状态码 | 含义 | 优先检查 |
| --- | --- | --- |
| `500 Internal Server Error` | 服务内部异常 | 本服务日志、异常栈、数据库 |
| `501 Not Implemented` | 不支持该功能或方法 | 服务能力、协议或版本 |
| `502 Bad Gateway` | 网关收到无效上游响应 | 反向代理、上游进程、DNS、TLS |
| `503 Service Unavailable` | 服务暂时不可用 | 过载、维护、实例健康状态 |
| `504 Gateway Timeout` | 网关等待上游超时 | 慢查询、卡死、依赖与超时配置 |
| `505 HTTP Version Not Supported` | 不支持请求使用的 HTTP 版本 | 客户端、代理和协议协商 |
| `507 Insufficient Storage` | 服务端存储不足 | WebDAV、磁盘或存储配额 |
| `508 Loop Detected` | 检测到循环 | WebDAV 或代理/依赖循环 |
| `511 Network Authentication Required` | 需要网络认证 | 公共 Wi-Fi 门户登录页常见 |

## 499、520、522、524 为什么也经常见？

它们并不是 IANA 注册的通用 HTTP 状态码，而是服务器软件或平台的扩展：

- `499` 常被 Nginx 用来表示客户端在服务器响应前主动断开；
- `520`、`521`、`522`、`524` 常见于 Cloudflare，用来细分源站或连接问题。

看到这些码时，不要套用通用 HTTP 标准表，直接查对应厂商文档。

## 真正实用的排查顺序

### 第一步：看状态码家族

先判断是 `2xx`、`3xx`、`4xx` 还是 `5xx`，把搜索范围砍掉一大半。

### 第二步：看完整请求

至少核对 URL、Method、Query、Headers 和 Body。很多问题在 Network 面板里一眼就能发现。

### 第三步：看完整响应

不要只抄一个三位数。把错误正文、响应头、Request ID、`Location`、`Retry-After` 一起保留。

### 第四步：做最小复现

用 `curl` 或 Postman 直接请求接口，排除 UI、状态管理和浏览器缓存的干扰：

```bash
curl -i "https://api.example.com/users/123" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

`-i` 会同时显示响应头和正文，排查跳转、认证和限流尤其方便。分享日志前记得隐藏 Token、Cookie 和个人数据。

### 第五步：再把证据交给 AI

不要只说“接口报错了”。至少提供：

```text
请求：POST /api/orders
状态码：409
响应正文：{"message":"version conflict"}
Request ID：abc-123
已确认：同一订单没有重复点击
```

证据越完整，AI 越不需要猜。

## 最后一句

状态码只能告诉你“哪一层观察到了什么结果”，不能单独证明最终根因。

看到错误码时，先分家族，再看请求与响应，最后用日志和最小复现收口。会读这三位数字，Vibe Coding 才真正从“让 AI 猜”走向“和 AI 一起排查”。

## 参考资料

- [IANA HTTP Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml)
- [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 6585 — Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585)
- [RFC 7725 — 451 Unavailable For Legal Reasons](https://www.rfc-editor.org/rfc/rfc7725)

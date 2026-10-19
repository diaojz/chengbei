# 城北 · 个人站

[chengbei.org](https://chengbei.org)

独立开发者的个人站，记录 AI 开发、工具使用和产品实践。默认采用 Astro 静态站：按目的进入的首页、可筛选的文章库、带目录的阅读页、项目与岗位集锦。原三栏站点保留在 `/classic/`，可通过导航切换。

**第 1 栏的 Ships 区充当所有上线项目的统一入口**，下面列出当前所有已上线项目。

部署在 GitHub Pages，自定义域名 `chengbei.org`。

---

## Ships · 上线项目集合

数据源在 `js/i18n.js` 的 `artifacts` 字段（zh / en 双语对齐维护）。当前列表：

| 项目 | 地址 | 说明 |
|---|---|---|
| 面试岗位集锦 | /ai-jobs/ | 2026-09-20 · AI 岗位详情与面试准备页；首批接入 FDE、AI 产品经理、AI 应用工程师和大模型算法工程师。AI 产品经理已有 25 条去重样本，AI 应用工程师保留 30 条候选样本的待核验边界。 |
| 一个人的 Mac 直播间 | /mac-livestream-setup/ | 2026-08-31 · 从0搭建个人直播间实录：调研→制定计划→两次被B站账号权限推翻（5000粉门槛+Mac客户端无开播）→改道微信视频号跑通 · Codex 生封面图 + Figma 流程图 · 站内独立页 |
| AI 原生 SDLC 六阶段闭环 | #/p/ai-native-sdlc-playbook | 2026-08-26 · Claude 官方《The AI-native SDLC playbook》中文通俗解读 · Plan/Design/Build/Test/Deploy/Maintain 六阶段怎么重做一遍 · 随笔文章，非独立页 |
| AI 求职每日一课 | /tech-notes/ | 2026-08-24 · 面向 AI 应用/Agent 工程岗位的 12 周递进课程：会调用→会构建→会上生产；每天一个可验证技能，每周一个项目；原 438 条技术笔记保留为知识库 |
| Codex 重连问题修复指南 | /codex-reconnect/ | 2026-08-05 · 2026-10-19 更新 · 重连诊断提示词、条件配置与验证方法 · 站内独立页 |
| 手工短视频 SOP 拆解 | /sop-teardown/ | 2026-07-27 · 手工赛道 SOP 逐页拆解 · 工具全不通用但判据通用 · 12 条发布检查清单（流程图依赖共享 `/lib/`）|
| 裁判模型准确率提升清单 | /judge-accuracy/ | 2026-07-24 · LLM-judge 从 88% 提到 90% · 按性价比排的 8 条方法 + 执行顺序 · 站内独立页 |
| 苹果开发者迁移指南 | /apple-dev-migration/ | 2026-06-12 · 换电脑证书迁移 · 三条路线（流程图依赖站点共享 `/lib/mermaid.min.js`）|
| 置身钉内 | /dingtalk-one/ | 2026-06-10 · 钉钉 ONE 项目深度复盘 · 产品手记（流程图依赖共享 `/lib/`）|
| Ghostty 终端配置 | /ghostty-terminal/ | 2026-06-04 · 课件总览 · 站内独立页 |
| Ghostty 配置清单 | /ghostty-checklist/ | 2026-06-04 · 照抄即用清单 · 与课件总览互链 |
| mini-harness 代码精讲 | /mini-harness/ | 2026-06-03 · Harness 是什么 · 三件套带可跑代码逐段精讲 |
| AI 情报站 | https://news.diaoye.org | 每日 AI 大事件 · Top 10 情报站（Vercel · daily-claude-news）|
| cc-doctor | https://github.com/diaojz/cc-doctor | 一键拯救 Claude Code（fork 自 farion1231/cc-switch）|
| Balatro Web | https://diaojz.github.io/balatro-game/ | 8 轮课程演示（GitHub Pages）|
| Typevoise | https://github.com/diaojz/Typevoise | macOS 语音输入 App |

加 / 删 / 调顺序 → 改 `js/i18n.js` 里 zh / en 两个 `artifacts` 数组（必须同步改两边，否则切语言后会看到不一致的列表）。

**首页只展示前 5 条**，其余收进全屏目录页 `#/all`（「全部作品 →」入口）——目录页自动列出 Ships 全量 + 全部文章（带日期），不需要单独维护。

**排序规则：按创作日期倒排（最新在前），无日期的外链项目排在最后**——新文章上站时插到数组里对应日期位置即可。

### 把课件 HTML 集成上站的固定套路

源文件在课程仓库 `课件/` 下（**只挑文章式滚动页，PPT 翻页形态的课件不适合当文章读**），步骤：

1. 复制为 `<slug>/index.html`（站内 URL 即 `/<slug>/`）
2. `<title>` 加 ` · 城北` 后缀，补 `meta description` + 四条 `og:` 标签（`og:url` 写最终地址）
3. 加返回链接 `← 城北 · chengbei.org`（带投影模式的页面记得 `.projection .back-home{display:none}`）
4. 全文检查并清掉「讲师」等字眼（站点身份是独立开发者）
5. hero 区加发布日期行 `发布于 YYYY-MM-DD` + 左下角水印 —— 日期用**创作日期**而非上站日（取证顺序：课程仓库 git 首次提交 > 源文件出生时间 `stat -f %SB`），定了之后不改
6. `</body>` 前加 GoatCounter 计数脚本（抄首页那行 `data-goatcounter`）
7. `js/i18n.js` zh / en 两个 `artifacts` 数组加入口 + 更新本 README 的 Ships 表
8. 页面若依赖 mermaid 等本地库：改用站点共享 `/lib/`（绝对路径 `<script src="/lib/mermaid.min.js">`），不要每页塞一份副本

---

## 文章体系（中栏随笔 + Help 答疑）

中栏随笔已从 `data.json` 短文本升级为完整文章体系：

- **文章正文**：默认使用 `content/posts/<slug>.zh.md` + `<slug>.en.md`（双语成对）。若用户明确要求只写中文，则只创建 `.zh.md`，索引只填中文字段；英文界面会回退显示中文。
- **文章索引**：`content/posts/index.json` —— 每篇有 `slug` / `category` / `title` / `ts`
  - `category: "thought"` → 出现在中栏（摘要卡 + 「阅读全文」）
  - `category: "help"` → 出现在第一栏 Help 学员答疑区（入口同时写在 `js/i18n.js` 的 `help` 数组）
  - `hidden: true` → 下架但保留文件，随时可恢复（当前 Writing 四篇就是这么下架的）
- **详情页路由**：Hash 路由 `#/p/<slug>`，由 `js/posts.js` 渲染（marked 按需从 CDN 加载）

加一篇新随笔 = 写中英文两个 md + 在 `index.json` 加一条（默认 zh/en 标题都要填）。如果用户明确要求中文单语，则只写中文 md 和中文索引字段。

**发布日期纪律**：`index.json` 里的 `ts` 是文章的正式发布时间，**发布后永不修改**（修订正文可以，改 `ts` 不行）。详情页会显示「发布于 YYYY年M月D日」。不可篡改性由 git 公开历史背书——仓库 `github.com/diaojz/chengbei` 是公开的，任何对 `ts` 的改动都会留下带时间戳的 commit 记录，等于公开的审计链。

---

## 买房与租房文章（2026-10-09）

[线上文章](https://chengbei.org/articles/buying-vs-renting-fangshan/) · [发布、数据口径与维护记录](artifacts/housing-20261009/README.md)

已发布双语正文、每种语言 3 张图表及 JSON/CSV 复算资料。房价由作者提供，贷款利息为固定利率情景估算；报价截至 2026-09-27，不能写成实际成交或实际银行账单。构建和线上资源已验证，桌面/手机浏览器可视验收仍待补充，具体证据与限制见维护记录。

## 项目卡片封面（2026-10-19）

项目页中英文共用 `src/components/ProjectsPage.astro`，16 个项目均有封面，首页代表作品共用 `src/data/projects.ts` 的必填 `cover` 字段。新增或调整项目时，封面随项目数据维护，不按列表序号绑定。

本次新增 8 张原生生成插画，压缩复用 4 张原有项目封面，并使用 4 张关于页插画；素材和提示词见 [封面说明](assets/img/project-covers/README.md)。封面均为静态 WebP，完整集合预算 900 KiB，首屏之后懒加载。项目页采用紧凑标题和响应式图文网格，保留原项目地址与日期。

回滚基线标签：`backup/pre-project-covers-20261019`（指向 `cf3cc37`）。需要回滚时，对本次封面改造提交执行 `git revert` 后正常推送部署，避免影响后续文章。

## 侧边导航与关于页（2026-10-19）

[关于页](https://chengbei.org/about/) 改为独立图文首屏、三张插画卡片和简短阅读入口；中英文共用 `src/components/AboutPage.astro`。产品页桌面采用左侧导航，小屏恢复顶部导航。**首次默认浅色**，保留用户主动切换后的主题选择。

新增四张 Codex 原生生成插画，压缩为 WebP，总预算 240 KiB；动画仅一次性淡入与悬停，尊重减少动态效果偏好。维护、验证边界与回滚见 [侧栏与关于页记录](docs/sidebar-about-20261019.md)，配图来源及提示词见 [资源说明](assets/img/about-studio/README.md)。备份标签：`backup/pre-sidebar-about-20261019`。

## 内容发现与阅读体验改版（2026-10-19）

参考 useHook 的公开导航、学习路径结构及中性配色，优化首页入口、文章发现和长文阅读。实施范围、证据边界和回滚流程见 [改版维护记录](docs/site-refresh-20261019.md)。

- `src/components/HomePage.astro`：中英文共用首页，工具入门、系列学习和岗位准备入口；项目图片按实际项目绑定。
- `src/components/ArticleLibrary.astro`：主题和标题/摘要筛选，数量、空状态、重置，以及可分享的 `topic` / `q` URL；浏览器前后退恢复条件。
- `src/components/ArticlePage.astro`：桌面目录、手机折叠目录、预计阅读时间、系列前后篇和返回入口；`src/lib/content.ts` 在构建时生成目录。
- `src/styles/discovery.css`：本次视觉和响应式调整；`tests/discovery-reading.test.mjs` 覆盖筛选、锚点、系列边界与阅读进度。
- 改版前线上提交 `73e006b`；远程备份标签 `backup/pre-usehook-refresh-20261019`。本机另存仓库 bundle、未提交差异和改版前静态产物。
- 回滚使用 `git revert <本次改版提交>` 产生新提交后正常推送部署，不强推、不覆盖后续文章。文章正文、首次发布日期及经典版原地址保留。

## npm / npx / Node.js 科普文章（2026-10-19）

- [中文文章](https://chengbei.org/articles/npm-npx-node-explained/) · [English](https://chengbei.org/en/articles/npm-npx-node-explained/)。归类 Help，沿用现有 Markdown 文章模板，经典版 Help 入口中英文同步。
- 正文：`content/posts/npm-npx-node-explained.{zh,en}.md`；索引：`content/posts/index.json`；旧版入口：`js/i18n.js`；新增正文后同步更新 `content-integrity.json`。
- 基于 Node.js 官方资料及 npm CLI v11 文档，解释运行时、包与命令、依赖安装、项目脚本、npx 缓存执行、全局安装、lock 文件和 `npm ci`；示例命令用于说明，不代表已在读者设备执行。
- 维护重点：不要把 npx 写成“完全不安装”，不要假定包名等于命令名，也不要把本地预览等同生产发布。版本、下载确认行为及参数说明需以对应工具的当前文档为准。

## Codex 重连指南维护记录（2026-10-19）

- 页面：[`codex-reconnect/index.html`](codex-reconnect/index.html)；线上地址：[Codex 重连问题修复指南](https://chengbei.org/codex-reconnect/)。这是独立 HTML 页，不需要新增 Markdown 文章或修改文章完整性清单。
- 保留首次发布日期 `2026-08-05`、角落水印和 `js/i18n.js` 的入口日期；正文单独标注 `2026-10-19` 更新。
- 本次将固定配置教程改为“先诊断，再最小修改”：提供可复制提示词，检查版本、实际登录、配置覆盖关系与错误日志；仅在证据支持时考虑关闭 WebSocket。
- 修正旧说法：N/5 不能直接证明 WebSocket 失败；官方参考中的 `stream_max_retries` 是 SSE 流中断重试次数；不再统一增加重试、超时或要求按固定版本门槛升级。
- ChatGPT 订阅、API Key 和第三方 provider 必须保留各自认证及端点；登录状态不能仅凭旧字段判断。TOML 解析通过也不等于字段受支持、配置已加载或故障已解决。
- 官方核对来源：[配置参考](https://developers.openai.com/codex/config-reference/)、[基础配置](https://developers.openai.com/codex/config-basic/)、[认证](https://developers.openai.com/codex/auth/)。后续更新需重新核对当前版本，不能把本次资料快照当作永久结论。
- 发布提交：`2353867`；[GitHub Pages 部署 39195033263](https://github.com/diaojz/chengbei/actions/runs/39195033263) 成功。发布前现有 9 项测试、构建通过；发布后用带版本参数的线上请求确认更新日期、新提示词和修正说明已返回。
- 验证边界：上述验证证明文章已发布；不代表已在读者设备上修复 Codex，也未完成桌面和手机的浏览器可视验收。

## 访问统计（GoatCounter）

[GoatCounter](https://www.goatcounter.com)：开源、免费托管、无 Cookie（不用挂隐私横幅）。

- **计数**：新版公共布局 `BaseLayout.astro` 为全部新版页面加载一次 GoatCounter；经典版与已有课件页保留原计数脚本，经典版 hash 路由由 `js/stats.js` 补计。
- **展示**：新版页脚 `VisitStats.astro` 展示「总访问 / 今日」，今日按北京时间计算；接口失败保留统计看板链接，数字显示 —，不伪造为零。经典版仍在第一栏底部展示。
- **看板**：https://chengbei.goatcounter.com —— 已设为 **Anyone 公开**，访客点首页「统计 ↗」即可看路径/来源/地区/设备等完整维度

账号状态（2026-06-12 已全部开通，无需重复操作）：

- 账号：diaojz@126.com，code = `chengbei`（代码里写死的子域名），邮箱已验证
- Settings 已勾选 "Allow adding visitor counts on your website"（counter API 开放，首页数字依赖它）
- "Dashboard viewable by" = Anyone（公开看板）
- 换账号时同步修改 `VisitStats.astro`、`BaseLayout.astro`、`js/stats.js` 及旧页 `data-goatcounter`。

---

## 致谢

视觉与代码结构改编自 [tianruian.com](https://tianruian.com)（[github.com/realruian/personal-os](https://github.com/realruian/personal-os)），感谢原作者 [@realruian](https://github.com/realruian) 把这么好看的站开源。已替换全部个人内容（i18n、data.json、logo SVG），并删除原作者图像/管理面板/Vercel 配置。

## 技术栈

当前站点使用 **Astro + TypeScript + Markdown + Pagefind** 构建静态页面；经典版与独立旧页继续保留 HTML / CSS / JS。运行 `npm ci` 安装锁定依赖，`npm run check` 检查，`npm run build` 产出 `dist/`；push main 后由 GitHub Actions 测试、构建并部署 GitHub Pages。

- 主题切换：D（白昼）/ N（夜晚）/ S（晚夏 + 飘叶森林音）/ M（深夜 + 月色虫鸣）/ R（雨天 + 雨声）/ C（混沌坍塌）/ Q（安静模式 · 一键关全部动效，省电防发烫）
  - 快捷键用 `e.code` 物理键位，中文输入法下也能用
- 中英双语：右上 `中/EN` 切换，无刷新
- Shader 背景：图片用 `@paper-design/shaders-react` 的 HalftoneDots 半色调点阵（常开）
- 物理坍塌：Matter.js 按需从 CDN 加载
- 弱网优化：首屏单次渲染 + 正文加载失败自动重试

## AI 求职每日一课

`tech-notes/` 不再是一次铺开的题库首页，而是持续更新的课程入口：

- `tech-notes/data/season-1.json`：第一季课程唯一数据源，包含 3 个阶段、12 周路线、当前周计划和已发布课程。
- `tech-notes/index.html`：今日主课、周计划、路线图、归档和旧知识库入口。
- `tech-notes/lessons/YYYY-MM-DD-<slug>.html`：每日详情页。固定包含学习目标、心智模型、最小示例、生产陷阱、面试表达、练习、自测和来源。
- `tech-notes/assets/course.css` / `course.js`：课程页面视觉与数据渲染。
- `tech-notes/tests/validate-course.mjs`：检查阶段、周次、课程字段、HTTPS 来源和详情页是否存在。

新增日更时必须同步：新增详情页 → 向 `lessons` 追加元数据 → 更新 `currentWeek.days` 状态 → 运行课程校验。每日三道题必须是同一主题的递进自测，不能重新退化成三个无关知识点。

## 面试岗位集锦

`/ai-jobs/` 是面向求职准备的 AI 岗位研究页，不把单个 JD 写成行业结论。

- `content/ai-jobs/index.json`：岗位唯一数据源，包含状态、样本量、更新时间、JD 要点、公开来源和卡片路径。
- `src/pages/ai-jobs/`：聚合页与静态详情路由；聚合页支持关键词和岗位方向筛选。
- 详情页优先展示 JD 交付、要求、面试深挖与样本边界；研究依据和外链统一放页面末尾。
- `tests/ai-jobs.test.mjs`：检查首批岗位数据、图片存在与静态路由。

数据约定：`published` 只用于已完成样本去重与研究的岗位；`researching` 可展示已归档的候选样本或准备方向，但必须明确待核验范围。发布前运行 `npm run check && npm run build`，并以带缓存参数的线上路由确认 Pages 生效。

## 本地预览

```bash
python3 -m http.server 5173
# 打开 http://localhost:5173
```

## 更新内容的地方

- **Ships / 个人信息（名字 / bio / artifacts / help / social）**：`js/i18n.js` 顶部 `window.I18N` 字典
  - 加新项目时 zh 和 en 的 `artifacts` 数组都要改一遍，保持长度和顺序一致
- **随笔 / Help 文章**：`content/posts/`（md 正文 + `index.json` 索引，见上面「文章体系」）
- **images（第三栏画廊）**：`content/data.json`
- **面试岗位集锦**：`content/ai-jobs/index.json`；页面与路由在 `src/pages/ai-jobs/`
- **Writing**：当前已下架（`index.json` 里四篇标了 `hidden: true`，`data.json` 的 `writing` 为空）；恢复时去掉 `hidden` 即可
- **SEO meta / title**：`index.html` 顶部
- **logo 字母**：`index.html` 里 `<svg class="logo">` 节点

## 发布更新

任何改动 commit + push 到 `main` 分支即可。GitHub Actions（`.github/workflows/`）会自动构建 + 部署到 GitHub Pages，约 1-2 分钟（GitHub 拥堵时可能更长）。

```bash
git add -A
git commit -m "..."
git push
# 看部署进度：
gh run watch --repo diaojz/chengbei
```

## 改了 JS 必跑

```bash
node -c js/app.js
node -c js/i18n.js
node -c js/posts.js
node -c js/themes.js
node -c js/chaos.js
node -c js/quiet.js
node -c js/shaders.js
node -c js/stats.js
python3 -c "import json; json.load(open('content/data.json'))"
python3 -c "import json; json.load(open('content/posts/index.json'))"
node tech-notes/tests/validate-course.mjs
```

## 全站配图维护

文章封面统一由 `content/visuals.json` 管理；项目封面由 `src/data/projects.ts` 管理。首页三个入口、文章列表、系列目录和中英文页面复用相同资源。正文已有封面的文章不再重复插入主题图；步骤截图与图表保留原图。八个旧独立页使用 `assets/site-context-covers.css`。

新增配图优先使用静态 WebP，声明尺寸并延迟加载；避免循环动画、视频背景和持续绘制。概念插画不作为产品截图或操作证据。详情见 `docs/site-visual-audit-20261019.md`。

## 默认布局

根地址 `/` 始终使用新版布局，不根据历史 `chengbei-layout` 偏好自动跳转。需要时点击「经典布局」进入 `/classic/`，经典版的「新版布局」可返回首页。

## 页面打磨与交互

文章列表页头由 `LibraryHeading.astro` 统一中英文；项目分类在 `ProjectsPage.astro`，相关推荐在 `ArticlePage.astro`。全局视觉规则集中在 `studio.css`；动效仅短暂入场或悬停，必须支持 `prefers-reduced-motion`。复用既有静态 WebP，禁止为装饰增加常驻绘制循环。检查记录见 `docs/global-polish-20261019.md`。

## 移动阅读与内容发现

- `ReadingTools.astro` 管理移动目录/字号/图片查看；字号本地保存，正文图片宽高由 `image-dimensions.mjs` 在构建时读取。阅读进度复用原有滚动调度，不增加持续循环。
- `assets/brand/` 保存原生生成 Logo 及说明；新版 Logo/favicon 共用。
- `llms.txt` 与 `content-index.json` 由公开文章、项目数据生成；构建后 `write-discovery.mjs` 输出 sitemap，robots 声明入口。Article JSON-LD 保留真实首次发布日期，不伪造修订日期。
- `AskArticles.astro` 当前为带来源的对话式原文检索，不调用模型。真实AI聊天需独立服务端，公开仓库和前端不得存放模型密钥。
- 备案号尚未提供，不应虚构。完整说明见 `docs/reading-brand-discovery-20261019.md`。

新版 GoatCounter 客户端从 `/assets/vendor/goatcounter.js` 加载，官方来源与许可见同目录 README；数据仍进入原账号，避免外部脚本域名超时导致漏计。

## 受限模型助手（接入准备）

`services/assistant/` 是独立 Node 24 服务，带SQLite持久化额度、Turnstile、站内检索与DeepSeek接口。模型费预算已确认每月¥10；密钥和部署位置仍待提供，`content/assistant.json` 默认关闭，不会产生模型调用。限制、测试和部署步骤见服务目录README；上线前不得把原文检索宣传成已接入模型。

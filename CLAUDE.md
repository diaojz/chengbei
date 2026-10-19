# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库定位

城北个人站（[chengbei.org](https://chengbei.org)），独立 git 仓 `github.com/diaojz/chengbei`（**公开**）。当前默认站点为 **Astro + TypeScript + Markdown + Pagefind** 静态构建；经典版及独立旧页保留 HTML / CSS / JS。push 到 `main` 后由 GitHub Actions 安装依赖、测试、构建并部署 GitHub Pages。

站点身份是**独立开发者**——全站（含文章正文、课件页）**禁止出现「讲师 / Instructor」字眼**，需要表达教课角色时用「讲课的人」「我」等中性/第一人称表述（2026-06-12 用户定规，已全站清理过一轮）。

## 常用命令

```bash
# 当前站点：npm ci 安装依赖；npm run dev 本地开发
# 完整检查与构建：npm run check && npm run build
# 仅预览旧版静态资源时，可用：
python3 -m http.server 5173
open "http://localhost:5173/"        # 一律用系统默认浏览器

# 改了 JS / JSON 必跑（语法校验，全套）
node -c js/app.js && node -c js/i18n.js && node -c js/posts.js && \
node -c js/themes.js && node -c js/chaos.js && node -c js/quiet.js && \
node -c js/shaders.js && node -c js/stats.js
python3 -c "import json; json.load(open('content/data.json')); json.load(open('content/posts/index.json'))"

# 发布 = 直接 push main，看部署进度：
gh run watch --repo diaojz/chengbei
# 部署后线上验证注意 CDN 缓存（js 缓存约 10 分钟），用 ?v=时间戳 绕过
```

## 侧栏、主题与动效规则（2026-10-19）

- 产品页公共侧栏在 `BaseLayout.astro`，最新样式 `src/styles/studio.css` 最后加载。宽度 >1000px 为侧栏，较小屏幕恢复顶部导航；变更时同时检查首页、文章库与阅读页。
- **首次默认浅色，不跟随系统暗色偏好**；保留用户手动保存的主题。localStorage 不可用时仍应可初始化与切换。
- 关于页中英文共用 `src/components/AboutPage.astro`。图片与文字分区，不恢复大幅空白背景加贴边标题，不添加大段自我评价。
- 新图在 `assets/img/about-studio/`，静态 WebP，总预算 240 KiB。动效采用短暂、一次性 CSS transform/opacity 和悬停；尊重减少动态效果，禁用装饰性持续动画/视频/Canvas。
- 备份及回滚见 `docs/sidebar-about-20261019.md`；检查入口为 `npm run check`、`npm run build`。

## 当前产品版入口（2026-10-19）

- 首页 `src/components/HomePage.astro`、文章库 `ArticleLibrary.astro` 和阅读页 `ArticlePage.astro` 为中英文共用组件；页面路由在 `src/pages/`。
- 公共导航与主题逻辑在 `src/layouts/BaseLayout.astro`；本次内容发现样式在 `src/styles/discovery.css`，其加载顺序晚于旧样式。
- 文章库主题链接使用真实 `?topic=` 条件；`q` 仅筛选列表标题、摘要与标签，全文搜索仍走 Pagefind。新增筛选需保持 URL 分享、前后退、重置和空状态可用。
- 目录由 `src/lib/content.ts` 在构建时生成，渲染使用每篇独立 heading collector。不得给重复标题生成相同锚点，也不得更改源文章或首次发布日期来实现界面改版。
- 修改后执行 `npm run check`、`npm run build`；保留经典版切换和独立旧页。备份与回滚见 `docs/site-refresh-20261019.md`。

## 架构速览（以下为经典版）

三栏 grid 布局（`styles.css` 的 `.page`），每栏 `100vh` 独立滚动，**没有页级 footer**——「站点最底部」类需求放第一栏（`.col-1`，overflow hidden 固定不滚）底部，如现有的访问统计条。

- `index.html`：唯一主页面；SEO/OG meta 在顶部；第一栏 = 身份 + Ships + Help + Writing + Social + 访问统计
- `js/i18n.js`：**所有面向用户的文案**（zh / en 两个字典）。⚠️ 改 `artifacts` / `social` / `help` 数组必须 zh / en 两边同步，长度顺序一致，否则切语言后列表不一致
- `js/app.js`：拉 `content/data.json` + `content/posts/index.json`，渲染中栏（thought 摘要卡 + 媒体）和第三栏画廊
- `js/posts.js`：文章详情页（hash 路由 `#/p/<slug>`，marked 按需 CDN 加载，弱网有纯文本兜底）
- `js/stats.js`：GoatCounter 访问统计（见下）
- `js/themes.js` / `quiet.js` / `chaos.js` / `shaders.js`：主题、安静模式、物理坍塌、halftone shader
- `content/posts/`：文章正文 `<slug>.{zh,en}.md` 成对 + `index.json` 索引（category: thought/help，hidden 软下架）
- 独立课件页：`ghostty-terminal/` `ghostty-checklist/` `mini-harness/`（单文件 HTML，来自课程仓库 `课件/`）
- AI 求职每日一课：`tech-notes/data/season-1.json` 是课程路线和归档的唯一数据源，`tech-notes/lessons/` 存每日详情，旧分类页作为知识库保留

## 关键纪律

1. **发布日期不可篡改**：`content/posts/index.json` 的 `ts` 和课件页 hero 的「发布于 YYYY-MM-DD」一经定下**永不修改**（修订正文可以）。课件页日期 = **创作日期**而非上站日（取证：课程仓库 git 首提 > 源文件出生时间），同一日期同步出现在 hero 行、角落水印、`i18n.js` 的 `date` 字段三处。背书 = 本仓库公开 git 历史。
2. **i18n 双语对齐**：见上，zh/en 必须同步改。
3. **课件 HTML 上站**：走 README「把课件 HTML 集成上站的固定套路」七步（复制 → meta → 返回链接 → 清「讲师」→ 发布日期 → GoatCounter 脚本 → Ships 入口）。只挑**文章式滚动页**，PPT 翻页形态的课件不上站。
4. **终端/代码块配色**：浅色方案 = 用户 Ghostty 的 `GitHub Light Default`（bg `#ffffff` / fg `#1f2328` / 注释 `#6e7781` / 绿 `#116329`，嵌在白卡内的命令条用 `#f6f8fa` + 边框 `#d0d7de`）。不要用纯黑底（用户明确否决过 `#12161c`）。
5. **README 的 Ships 表必须和 `js/i18n.js` 实际展示一致**——上下架项目时两处一起改。
6. **课程必须形成依赖链**：按 3 个月 / 12 周路线由浅入深；每天只讲一个主问题，三道题是递进自测；每周必须有可运行成果。新增课程后运行 `node tech-notes/tests/validate-course.mjs`。

## Codex 重连指南维护

- 对应 `codex-reconnect/index.html`，更新记录见 README「Codex 重连指南维护记录」。修改现有独立 HTML 即可，不新增同主题文章。
- 首发日期 `2026-08-05`、水印和 `js/i18n.js` 日期不变；修订日期单独展示，README 入口说明同步更新。
- 先核对当前官方文档与版本支持，再写诊断和配置方案。不得把所有 Reconnecting N/5 归因于 WebSocket，不得承诺固定五次重试后必然降级成功。
- `stream_max_retries` 的本次文档定义为 SSE 流中断重试次数；不得为了“加固”统一增加重试次数或超时。HTTP/SSE 方案须注明适用条件，保留原有认证、provider 与计费方式。
- 区分 TOML 语法通过、配置实际加载、真实请求成功和重启复测通过；错误表作用域可能语法合法但设置无效。不得将登录刷新错误当作传输问题处理。
- 文章发布验证与用户设备故障修复是两件事。发布后核实部署结果和绕过缓存的线上正文；未做浏览器可视验收或用户环境实测时明确说明。

## 访问统计（GoatCounter）

开源托管方案，账号 2026-06-12 已开通（详见 README「访问统计」节）：code = `chengbei`，counter API 已开放，看板 chengbei.goatcounter.com 已设 Anyone 公开。

- 计数脚本挂在 4 个页面 `</body>` 前；`js/stats.js` 负责 SPA 路由补计 + 首页「总访问/今日」展示（接口失败自动隐藏整条）
- 换账号 / 改 code 时：同步改 `js/stats.js` 的 `SITE` 常量 + 4 处 `data-goatcounter` 地址

## 全站配图维护

文章封面映射在 `content/visuals.json`，项目封面在 `src/data/projects.ts`；优先静态 WebP，尺寸明确、懒加载。概念插画不能充当产品截图。正文原图和发布日期不得随配图更新改写。构建后运行 `python3 scripts/audit-site-images.py` 检查全站本地图片路径。

## 移动阅读、统计和内容发现

新版统计在 `VisitStats.astro` 与 `BaseLayout.astro`，沿用 GoatCounter chengbei；不要改版时漏接或重复计数。Logo 在 `assets/brand/`。移动阅读工具由 `ReadingTools.astro` 管理，本地图片尺寸在构建时提取。canonical/JSON-LD/llms.txt/content-index.json/sitemap 随内容构建。`AskArticles.astro` 当前只检索原文，不生成回答；未获服务端/模型配置前不得宣称AI聊天可用，前端禁止密钥。备案号必须真实提供，不造占位号。

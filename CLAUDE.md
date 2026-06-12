# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库定位

城北个人站（[chengbei.org](https://chengbei.org)），独立 git 仓 `github.com/diaojz/chengbei`（**公开**）。纯 HTML / CSS / JS，**无构建工具、无依赖安装**，push 到 `main` 即由 GitHub Actions 自动部署到 GitHub Pages。

站点身份是**独立开发者**——全站（含文章正文、课件页）**禁止出现「讲师 / Instructor」字眼**，需要表达教课角色时用「讲课的人」「我」等中性/第一人称表述（2026-06-12 用户定规，已全站清理过一轮）。

## 常用命令

```bash
# 本地预览（无构建，起静态服务即可）
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

## 架构速览

三栏 grid 布局（`styles.css` 的 `.page`），每栏 `100vh` 独立滚动，**没有页级 footer**——「站点最底部」类需求放第一栏（`.col-1`，overflow hidden 固定不滚）底部，如现有的访问统计条。

- `index.html`：唯一主页面；SEO/OG meta 在顶部；第一栏 = 身份 + Ships + Help + Writing + Social + 访问统计
- `js/i18n.js`：**所有面向用户的文案**（zh / en 两个字典）。⚠️ 改 `artifacts` / `social` / `help` 数组必须 zh / en 两边同步，长度顺序一致，否则切语言后列表不一致
- `js/app.js`：拉 `content/data.json` + `content/posts/index.json`，渲染中栏（thought 摘要卡 + 媒体）和第三栏画廊
- `js/posts.js`：文章详情页（hash 路由 `#/p/<slug>`，marked 按需 CDN 加载，弱网有纯文本兜底）
- `js/stats.js`：GoatCounter 访问统计（见下）
- `js/themes.js` / `quiet.js` / `chaos.js` / `shaders.js`：主题、安静模式、物理坍塌、halftone shader
- `content/posts/`：文章正文 `<slug>.{zh,en}.md` 成对 + `index.json` 索引（category: thought/help，hidden 软下架）
- 独立课件页：`ghostty-terminal/` `ghostty-checklist/` `mini-harness/`（单文件 HTML，来自课程仓库 `课件/`）

## 关键纪律

1. **发布日期不可篡改**：`content/posts/index.json` 的 `ts` 和课件页 hero 的「发布于 YYYY-MM-DD」一经定下**永不修改**（修订正文可以）。课件页日期 = **创作日期**而非上站日（取证：课程仓库 git 首提 > 源文件出生时间），同一日期同步出现在 hero 行、角落水印、`i18n.js` 的 `date` 字段三处。背书 = 本仓库公开 git 历史。
2. **i18n 双语对齐**：见上，zh/en 必须同步改。
3. **课件 HTML 上站**：走 README「把课件 HTML 集成上站的固定套路」七步（复制 → meta → 返回链接 → 清「讲师」→ 发布日期 → GoatCounter 脚本 → Ships 入口）。只挑**文章式滚动页**，PPT 翻页形态的课件不上站。
4. **终端/代码块配色**：浅色方案 = 用户 Ghostty 的 `GitHub Light Default`（bg `#ffffff` / fg `#1f2328` / 注释 `#6e7781` / 绿 `#116329`，嵌在白卡内的命令条用 `#f6f8fa` + 边框 `#d0d7de`）。不要用纯黑底（用户明确否决过 `#12161c`）。
5. **README 的 Ships 表必须和 `js/i18n.js` 实际展示一致**——上下架项目时两处一起改。

## 访问统计（GoatCounter）

开源托管方案，账号 2026-06-12 已开通（详见 README「访问统计」节）：code = `chengbei`，counter API 已开放，看板 chengbei.goatcounter.com 已设 Anyone 公开。

- 计数脚本挂在 4 个页面 `</body>` 前；`js/stats.js` 负责 SPA 路由补计 + 首页「总访问/今日」展示（接口失败自动隐藏整条）
- 换账号 / 改 code 时：同步改 `js/stats.js` 的 `SITE` 常量 + 4 处 `data-goatcounter` 地址

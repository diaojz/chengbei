# Dify Series Entry Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为 chengbei.org 增加醒目的 Dify 十篇教程入口，并产出两套符合小红书规范的图文素材。

**Architecture:** 复用现有 `content/series.json` 与 `#/series/dify` 路由，不复制文章数据；首页增加一张由系列数据渲染的重点卡片，系列页增加学习路线与逐篇收益。小红书素材独立写入 `/Users/diaoye/Documents/BD/App Store/xhs/20260914_dify-series-xhs/`。

**Tech Stack:** 原生 HTML/CSS/JavaScript、JSON、Markdown、Codex 原生 `image_gen`。

---

### Task 1: 扩展 Dify 系列数据

**Files:**
- Modify: `content/series.json`

1. 为 Dify 系列补充首页标记、学习路线和十篇一句话收益。
2. 运行 JSON 解析校验，确认字段合法。

### Task 2: 实现首页重点入口与系列导览

**Files:**
- Modify: `js/posts.js`
- Modify: `styles.css`
- Modify: `js/i18n.js`

1. 让首页 `Series` 区把 Dify 渲染为重点卡片。
2. 在现有系列页渲染“适合谁、三条阅读路线、十篇目录”。
3. 同步中英文界面词，并保持英文缺失文章的现有回退行为。
4. 运行全套 JavaScript 语法校验。

### Task 3: 编写两篇小红书文章

**Files:**
- Create: `/Users/diaoye/Documents/BD/App Store/xhs/20260914_dify-series-xhs/01-学Dify别急着拖节点/meta.json`
- Create: `/Users/diaoye/Documents/BD/App Store/xhs/20260914_dify-series-xhs/01-学Dify别急着拖节点/文案.txt`
- Create: `/Users/diaoye/Documents/BD/App Store/xhs/20260914_dify-series-xhs/02-Dify-Demo为什么不能上线/meta.json`
- Create: `/Users/diaoye/Documents/BD/App Store/xhs/20260914_dify-series-xhs/02-Dify-Demo为什么不能上线/文案.txt`

1. 从十篇教程提炼两个互补主题，正文控制在 500–800 字。
2. 使用真实经验口吻，避免套路化 AI 文风。
3. 只使用合规主页引导，不放外链、二维码、联系方式或互动换资料。

### Task 4: 生成两套 3:4 图集

**Files:**
- Create: 每篇目录下 `01-cover.png` 至 `06-end.png`

1. 用 Codex 原生 `image_gen__imagegen` 生成电影海报级系列视觉。
2. 每张图保持同一套深色玻璃与节点光轨语言，文字短且准确。
3. 检查实际尺寸、图中文字、结构和裁切；不合格则重生。

### Task 5: 验证与本地预览

1. 运行项目规定的 JavaScript 与 JSON 校验。
2. 启动静态服务器并用系统默认浏览器打开实际 localhost 地址。
3. 检查首页入口、`#/series/dify`、移动端布局及两套素材清单。
4. 不推送、不部署、不发布小红书；保留给用户终审。

# Sitewide Visual Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 把 About 已确认的“未来实验室 × 独立编辑部”明暗视觉系统扩展到新版 Astro 首页、列表页、系列页和文章详情页。

**Architecture:** 用一组明暗配对的 WebP 视觉资产和页面级 CSS 变量统一主题切换。首页、通用内容索引和 Dify 系列各有一组主视觉；文章详情通过统一头部、阅读轨迹和正文媒体框架升级，不改 Markdown 正文。

**Tech Stack:** Astro、CSS、自带主题脚本、Codex 原生 GPT Image 2、ImageMagick WebP 转换、Node 测试。

---

### Task 1: 生成并验收视觉资产

**Files:**
- Create: `assets/img/site-visuals/home-hero-{light,dark}.webp`
- Create: `assets/img/site-visuals/library-hero-{light,dark}.webp`
- Create: `assets/img/site-visuals/dify-hero-{light,dark}.webp`

1. 使用 Codex 原生 GPT Image 2 生成三组明暗配对素材。
2. 放大检查无文字、Logo 和明显结构错误。
3. 转换为 WebP，并用 `magick identify` 核对尺寸。

### Task 2: 升级首页与通用内页头部

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`
- Modify: `src/pages/articles/index.astro`
- Modify: `src/pages/en/articles/index.astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/en/projects/index.astro`
- Modify: `src/styles/product.css`

1. 首页加入同主题视觉舞台，不改变现有项目与文章数据。
2. 为文章和项目列表页加入可复用的 `visual-heading` 结构。
3. 优化项目卡片编号、层级、悬停和明暗主题表现。

### Task 3: 升级系列页与文章详情模板

**Files:**
- Modify: `src/pages/series/[id].astro`
- Modify: `src/components/ArticlePage.astro`
- Modify: `src/styles/product.css`

1. Dify 系列使用专属十节点视觉头部。
2. 文章详情加入阅读轨迹、标题序号感和正文媒体框架。
3. 不写入或改动任何 `content/posts/*.md`。

### Task 4: 双语、响应式与验证

1. 核对中英文页面结构和链接一致。
2. 用 `agent-browser` 检查桌面与 390px 手机端的明暗主题。
3. 运行 `npm test`、`npm run build`、`npm run check`、`git diff --check`。
4. 用系统默认浏览器打开首页和代表性内页。

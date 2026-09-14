# Chengbei Site Restructure Implementation Plan

> **For Codex:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将城北个人站重构为高效、可搜索的内容站，保留全部现有文章正文与独立专题页，并上线直播合规手册。

**Architecture:** 使用 Astro 生成静态页面，以 content collections 管理文章元数据，以 Pagefind 索引构建后的全部 HTML。现有独立专题和课程页先作为原样静态资源保留，新首页、文章、项目、关于和搜索使用统一布局。

**Tech Stack:** Astro、TypeScript、Pagefind、原生 CSS、GitHub Pages、Node.js 内容一致性测试。

---

### Task 1: 建立内容不可变基线

**Files:**
- Create: `scripts/content-manifest.mjs`
- Create: `tests/content-integrity.test.mjs`
- Create: `content-integrity.json`

**Steps:**
1. 编写测试，校验当前 `content/posts/*.md` 的 SHA-256 清单。
2. 运行测试并确认缺少基线时失败。
3. 生成正文哈希基线，排除仅做迁移适配的新元数据。
4. 再次运行并确认全部正文一致。
5. 提交内容保护测试。

### Task 2: 建立 Astro 静态站骨架

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/styles/global.css`
- Modify: `.github/workflows/*`

**Steps:**
1. 配置 Astro 的静态输出、GitHub Pages 域名和 Pagefind 构建步骤。
2. 建立全局布局、导航、语言与主题控制。
3. 安装依赖并运行空站构建。
4. 校验 `dist/` 输出和 CNAME。
5. 提交框架骨架。

### Task 3: 统一内容目录与路由

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/posts/*`
- Create: `src/data/projects.ts`
- Create: `src/data/series.ts`
- Create: `src/pages/articles/index.astro`
- Create: `src/pages/articles/[slug].astro`
- Create: `src/pages/projects/index.astro`

**Steps:**
1. 为文章索引和中英正文建立只读适配器，不修改原文文本。
2. 将 `thought/help/series` 转换为标签和筛选维度，不再作为互斥一级导航。
3. 将现有 Ships 条目整理为项目数据，保留原 URL。
4. 构建文章、系列和项目页面。
5. 运行正文哈希测试与路由测试。
6. 提交统一内容模型。

### Task 4: 重做首页与响应式 UI

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/about.astro`
- Create: `src/components/*`
- Modify: `src/styles/global.css`

**Steps:**
1. 实现顶部全局导航和首屏身份区。
2. 实现最近更新、精选文章、项目和画廊区块。
3. 保留白昼、晚夏、深夜、雨天、安静与混沌彩蛋入口。
4. 完成桌面、平板、手机响应式布局。
5. 运行无障碍和基础 DOM 测试。
6. 提交新版 UI。

### Task 5: 接入 Pagefind 全文搜索

**Files:**
- Create: `src/components/Search.astro`
- Create: `src/scripts/search.ts`
- Modify: `package.json`
- Modify: `src/layouts/BaseLayout.astro`

**Steps:**
1. 构建后生成全文搜索索引。
2. 实现搜索弹层、`/` 唤起、`Escape` 关闭和键盘导航。
3. 返回标题、命中片段、内容类型、标签与日期。
4. 验证中文关键词“直播”“违禁词”“薪资承诺”及英文关键词。
5. 提交搜索功能。

### Task 6: 上线直播合规手册

**Files:**
- Create: `livestream-compliance/index.html` or equivalent Astro content page
- Create: `livestream-compliance/assets/*`
- Modify: `src/data/projects.ts`

**Steps:**
1. 从源文稿复制现有正文与素材，不改写内容。
2. 补齐站点导航、SEO、发布日期和 GoatCounter。
3. 检查并清除站点禁止身份词。
4. 验证 Pagefind 能命中正文敏感词和合规表达。
5. 提交直播合规手册。

### Task 7: 保留独立专题并完成迁移验证

**Files:**
- Create/Modify: `public/*`
- Create: `tests/routes.test.mjs`
- Modify: `README.md`

**Steps:**
1. 原样保留所有独立专题、课件、媒体和共享库路径。
2. 校验旧 URL 均生成且关键正文存在。
3. 校验中英文文章数量、发布日期与正文哈希。
4. 运行 `npm test`、`npm run build` 和 `git diff --check`。
5. 启动本地预览并在桌面、手机尺寸验证首页、搜索、文章和专题页。
6. 更新维护说明并提交。

### Task 8: 交付预览

**Steps:**
1. 汇总分支提交与未解决问题。
2. 用系统默认浏览器打开实际预览地址。
3. 等用户确认后再决定合并、推送和部署；未经确认不改 `main`。

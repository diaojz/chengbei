# AI Career Daily Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将技术笔记重构为 12 周递进式 AI 求职日更课程，并同步升级日报与飞书分发格式。

**Architecture:** 个人站使用纯 HTML/CSS/JS 与 JSON 元数据渲染课程首页，每日课程使用独立静态详情页；日报站通过课程化提示词产出 Markdown/HTML，并由飞书脚本解析结构化章节。两个仓库独立提交、独立验证。

**Tech Stack:** HTML5、CSS、原生 JavaScript、JSON、Python 3、Node.js 静态门户生成器、GitHub Pages。

---

### Task 1: 课程数据契约与测试

创建 `tech-notes/data/season-1.json` 与 `tech-notes/tests/validate-course.mjs`。先让测试因缺数据失败，再加入三个阶段、12 周、当前周七日内容和首期课程元数据，验证必填字段、来源链接与详情页存在。

### Task 2: 技术笔记首页

重构 `tech-notes/index.html`，创建 `tech-notes/assets/course.css` 和 `course.js`。实现今日课程、12 周路线、周计划、往期归档、岗位能力映射、旧知识库入口以及无 JavaScript 回退；完成桌面与移动端验证后提交。

### Task 3: 首期完整课程

创建 `tech-notes/lessons/2026-09-10-structured-output.html`。内容包括学习目标、心智模型、Schema、后端校验与重试、流式交互、生产陷阱、面试 30 秒/3 分钟表达、练习、自测和官方来源；验证链接、标题层级和代码块后提交。

### Task 4: 个人站入口与文档

更新 `js/i18n.js`、`README.md`、`CLAUDE.md`，保持中英文入口对齐，补充日更步骤和验证命令；运行全套 JS/JSON 校验后提交。

### Task 5: 日报课程化生成规范

在 `daily-claude-news` 仓库增加 `_CURRICULUM.md`，重写 `ai-interview-news/_PROMPT.md`，并用测试锁定阶段、周次、主课、面试表达、练习、自测和来源字段；提交后再进入展示层。

### Task 6: 门户与飞书卡片

修改 `portal/templates/interview.mjs` 和 `push-feishu-merged.py`，先补解析/渲染测试，再让门户展示课程进度，让飞书卡片展示学习成果、三个核心要点与一道自测，同时兼容旧日报格式。

### Task 7: 联合验收与发布

两个仓库分别运行完整测试、`git diff --check` 和范围检查；通过本地 HTTP 检查 390px 与桌面布局；分别推送并观察 GitHub Actions。飞书真实发送保留给现有香港 cron，避免本机重复推送。

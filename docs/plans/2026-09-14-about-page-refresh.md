# About Page Refresh Implementation Plan

**Goal:** 把中英文 About 从简短宣言升级为能说明“城北是谁、在做什么、如何做事、从哪里继续阅读”的完整入口，同时保持现有极简黑白视觉。

**Scope:** 只修改中英文 About 页面与对应全局样式；不改文章正文、项目数据、发布日期和其他页面。

## Tasks

1. 重写中文 About，加入自然个人介绍、三个长期方向、做事原则和站内内容入口。
2. 同步英文 About，保持信息、链接和语气对齐。
3. 扩展 About 专用样式，使用排版、细线和留白组织信息，并补齐移动端布局。
4. 运行 `npm test`、`npm run build`、`npm run check` 与 `git diff --check`。
5. 本地启动预览并打开 `/about/`，检查桌面和移动端可读性。

## Guardrails

- 不出现公司、客户、医疗业务背景。
- 不使用“讲师 / Instructor”。
- 不修改受内容哈希保护的 Markdown。
- 保留未跟踪的 `output/`，不纳入提交。
- 未经用户要求不 push、不部署。

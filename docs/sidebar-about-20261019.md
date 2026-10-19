# 侧边导航与关于页重做 · 2026-10-19

## 变更

用户反馈旧关于页图片留白过多、文字贴边、介绍过长。新版采用全站产品页共用的桌面侧栏，关于页图文分区、三张内容卡片、简短工作方法与阅读入口；中英文由 `src/components/AboutPage.astro` 共用。

- 全站侧栏与布局：`src/layouts/BaseLayout.astro`、`src/styles/studio.css`。
- 1000px 及以下恢复顶部导航；700px 及以下关于页单栏。经典版和独立旧页保留原样式。
- 首次主题固定浅色，不跟随系统自动深色；用户手动保存的浅/深色选择继续生效。存储禁用时可正常初始化与切换。
- 新增四张 Codex 原生生成插画，实际资源与提示词摘要见 `assets/img/about-studio/README.md`。
- 动效仅 CSS transform/opacity 一次性入场与鼠标悬停；约 420ms，最大延迟 120ms。尊重 prefers-reduced-motion，无循环动画、视频、Canvas 或新增持续渲染逻辑。未做真实耗电仪器测量，不把实现策略当作电量实测。

## 验证

`npm run check` 与 `npm run build` 通过，共 19 项测试；主题逻辑在隔离 JS 环境中验证了首次访问、已保存偏好、无效值与存储不可用。图片总预算 240 KiB，首屏图和卡片图片均声明尺寸。

已在实际 Chrome 桌面预览中检查侧栏、首屏图文留白和三张配图卡片。浏览器扩展控制调用超时，通过原生只读截图确认桌面显示；没有以原生点击绕过浏览器限制。移动端实际视觉/触控验收仍待补充。

## 备份与回滚

改版前线上基线：`d75a98f`。备份标签：`backup/pre-sidebar-about-20261019`。本机 `/Users/diaoye/.codex/backups/chengbei-site/20261019-sidebar-about/` 保存 Git bundle、改版前主工作区差异与基线源码归档。

出现问题时，从最新 origin/main 的干净分支 `git revert <本次提交 SHA>`，检查冲突后正常推送并等待 Pages 部署。不要强推，也不要覆盖其他文章或用户未提交改动。

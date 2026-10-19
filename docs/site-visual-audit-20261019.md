# 全站配图检查 2026-10-19

## 范围

首页三个入口与最近文章、16 个项目、中英文文章列表、38 篇文章、Dify 十章目录及系列介绍、八个旧独立页增加或优化配图。已有正文截图、岗位缩略图和经典版图集保持。文章正文与发布日期不变。静态 WebP、固定尺寸与懒加载，无新增持续动画。

发现 fable-5-four-days 三张正文图使用相对路径，在两个语言详情页失效；在 Markdown 渲染时将 assets 图片路径标准化为站点绝对路径。

## 验证

执行 npm run check、npm run build、python3 scripts/audit-site-images.py，并检查生成页面内部链接与同页锚点。桌面预览已经打开，移动端尚未实机验收，未做耗电测量。

## 回滚

基线 cf3cc37，备份标签 backup/pre-project-covers-20261019。本机 bundle 与差异保存在 ~/.codex/backups/chengbei-site/20261019-site-visuals/。发布后可 revert 本轮提交再推送 main，触发正常部署。

# 城北 · 个人站

[chengbei.org](https://chengbei.org)

独立开发者的个人站，把 AI 开发带给零基础学员。三栏布局：第一栏身份 + Ships + Help 学员答疑 + Writing + Social，第二栏随笔文章流（摘要卡，点开进详情页），第三栏图片画廊。

**第 1 栏的 Ships 区充当所有上线项目的统一入口**，下面列出当前所有已上线项目。

部署在 GitHub Pages，自定义域名 `chengbei.org`。

---

## Ships · 上线项目集合

数据源在 `js/i18n.js` 的 `artifacts` 字段（zh / en 双语对齐维护）。当前列表：

| 项目 | 地址 | 说明 |
|---|---|---|
| Ghostty 终端配置 | /ghostty-terminal/ | 课件总览 · 站内独立页（`ghostty-terminal/index.html`）|
| Ghostty 配置清单 | /ghostty-checklist/ | 照抄即用清单 · 站内独立页，与课件总览互链 |
| mini-harness 代码精讲 | /mini-harness/ | Harness 是什么 · 三件套带可跑代码逐段精讲 |
| 苹果开发者迁移指南 | /apple-dev-migration/ | 换电脑证书迁移 · 三条路线（流程图依赖站点共享 `/lib/mermaid.min.js`）|
| 置身钉内 | /dingtalk-one/ | 钉钉 ONE 项目深度复盘 · 产品手记（流程图依赖站点共享 `/lib/mermaid.min.js`）|
| App Store 上架 | https://news.diaoye.org | 完整上架资料站（Vercel · appstore-portal）|
| cc-doctor | https://www.ccswitch.io | 一键拯救 Claude Code |
| Balatro Web | https://diaojz.github.io/balatro-game/ | 8 轮课程演示（GitHub Pages）|
| Typevoise | https://github.com/diaojz/Typevoise | macOS 语音输入 App |
| Vibe Coding Survey | https://vibe-coding-survey.vercel.app | 调研问卷 |

加 / 删 / 调顺序 → 改 `js/i18n.js` 里 zh / en 两个 `artifacts` 数组（必须同步改两边，否则切语言后会看到不一致的列表）。

**首页只展示前 5 条精选**（`artifacts` 数组顺序即策展顺序），其余收进全屏目录页 `#/all`（「全部作品 →」入口）——目录页自动列出 Ships 全量 + 全部文章（带日期），不需要单独维护。

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

- **文章正文**：`content/posts/<slug>.zh.md` + `<slug>.en.md`（双语成对）
- **文章索引**：`content/posts/index.json` —— 每篇有 `slug` / `category` / `title` / `ts`
  - `category: "thought"` → 出现在中栏（摘要卡 + 「阅读全文」）
  - `category: "help"` → 出现在第一栏 Help 学员答疑区（入口同时写在 `js/i18n.js` 的 `help` 数组）
  - `hidden: true` → 下架但保留文件，随时可恢复（当前 Writing 四篇就是这么下架的）
- **详情页路由**：Hash 路由 `#/p/<slug>`，由 `js/posts.js` 渲染（marked 按需从 CDN 加载）

加一篇新随笔 = 写两个 md + 在 `index.json` 加一条（zh/en 标题都要填）。

**发布日期纪律**：`index.json` 里的 `ts` 是文章的正式发布时间，**发布后永不修改**（修订正文可以，改 `ts` 不行）。详情页会显示「发布于 YYYY年M月D日」。不可篡改性由 git 公开历史背书——仓库 `github.com/diaojz/chengbei` 是公开的，任何对 `ts` 的改动都会留下带时间戳的 commit 记录，等于公开的审计链。

---

## 访问统计（GoatCounter）

[GoatCounter](https://www.goatcounter.com)：开源、免费托管、无 Cookie（不用挂隐私横幅）。

- **计数**：四个页面（首页 + 三个课件页）`</body>` 前都挂了 `data-goatcounter` 脚本；SPA 文章路由（`#/p/slug`）由 `js/stats.js` 监听 hashchange 补计
- **展示**：首页第一栏底部「总访问 / 今日」，数据来自公开 counter API（`/counter/TOTAL.json`），拿不到数据时整条自动隐藏
- **看板**：https://chengbei.goatcounter.com —— 已设为 **Anyone 公开**，访客点首页「统计 ↗」即可看路径/来源/地区/设备等完整维度

账号状态（2026-06-12 已全部开通，无需重复操作）：

- 账号：diaojz@126.com，code = `chengbei`（代码里写死的子域名），邮箱已验证
- Settings 已勾选 "Allow adding visitor counts on your website"（counter API 开放，首页数字依赖它）
- "Dashboard viewable by" = Anyone（公开看板）
- ⚠️ 若以后换账号/改 code，需同步改 `js/stats.js` 的 `SITE` 常量和 4 个页面里的 `data-goatcounter` 地址

---

## 致谢

视觉与代码结构改编自 [tianruian.com](https://tianruian.com)（[github.com/realruian/personal-os](https://github.com/realruian/personal-os)），感谢原作者 [@realruian](https://github.com/realruian) 把这么好看的站开源。已替换全部个人内容（i18n、data.json、logo SVG），并删除原作者图像/管理面板/Vercel 配置。

## 技术栈

纯 HTML / CSS / JS，**无构建工具**。修改后直接 commit push → GitHub Actions 自动部署到 GitHub Pages。

- 主题切换：D（白昼）/ N（夜晚）/ S（晚夏 + 飘叶森林音）/ M（深夜 + 月色虫鸣）/ R（雨天 + 雨声）/ C（混沌坍塌）/ Q（安静模式 · 一键关全部动效，省电防发烫）
  - 快捷键用 `e.code` 物理键位，中文输入法下也能用
- 中英双语：右上 `中/EN` 切换，无刷新
- Shader 背景：图片用 `@paper-design/shaders-react` 的 HalftoneDots 半色调点阵（常开）
- 物理坍塌：Matter.js 按需从 CDN 加载
- 弱网优化：首屏单次渲染 + 正文加载失败自动重试

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
```

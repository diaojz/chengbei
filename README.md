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
| App Store 上架 | https://news.diaoye.org | 完整上架资料站（Vercel · appstore-portal）|
| cc-doctor | https://www.ccswitch.io | 一键拯救 Claude Code |
| Balatro Web | https://diaojz.github.io/balatro-game/ | 8 轮课程演示（GitHub Pages）|
| Typevoise | https://github.com/diaojz/Typevoise | macOS 语音输入 App |
| Vibe Coding Survey | https://vibe-coding-survey.vercel.app | 调研问卷 |

加 / 删 / 调顺序 → 改 `js/i18n.js` 里 zh / en 两个 `artifacts` 数组（必须同步改两边，否则切语言后会看到不一致的列表）。

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
python3 -c "import json; json.load(open('content/data.json'))"
python3 -c "import json; json.load(open('content/posts/index.json'))"
```

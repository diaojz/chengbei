# 城北 · 个人站

[chengbei.org](https://chengbei.org)

零基础 AI 开发课讲师 + 独立开发者的个人站。三栏布局，第一栏身份 + Ships + Writing + Social，第二栏 thoughts/voice/video 时间线，第三栏图片画廊。

**第 1 栏的 Ships 区充当所有上线项目的统一入口**，下面列出当前所有已上线项目。

部署在 GitHub Pages，自定义域名 `chengbei.org`。

---

## Ships · 上线项目集合

数据源在 `js/i18n.js` 的 `artifacts` 字段（zh / en 双语对齐维护）。当前列表：

| 项目 | 地址 | 说明 |
|---|---|---|
| 分账计算器 | https://coding.chengbei.org | 课程收入按比例分账（Vercel）|
| AI Gateway | https://gw.diaoye.org | Claude Code 中转（自建服务器）|
| VPN Fleet | https://vpn.chengbei.org | 节点调度面板（chengbei-fleet）|
| App Store 上架 | https://news.diaoye.org | 完整上架资料站（Vercel · appstore-portal）|
| cc-doctor | https://www.ccswitch.io | 一键拯救 Claude Code |
| Balatro Web | https://diaojz.github.io/balatro-game/ | 8 轮课程演示（GitHub Pages）|
| Typevoise | https://github.com/diaojz/Typevoise | macOS 语音输入 App |
| Vibe Coding Survey | https://vibe-coding-survey.vercel.app | 调研问卷 |

加 / 删 / 调顺序 → 改 `js/i18n.js` 里 zh / en 两个 `artifacts` 数组（必须同步改两边，否则切语言后会看到不一致的列表）。

---

## 致谢

视觉与代码结构改编自 [tianruian.com](https://tianruian.com)（[github.com/realruian/personal-os](https://github.com/realruian/personal-os)），感谢原作者 [@realruian](https://github.com/realruian) 把这么好看的站开源。已替换全部个人内容（i18n、data.json、logo SVG），并删除原作者图像/管理面板/Vercel 配置。

## 技术栈

纯 HTML / CSS / JS，**无构建工具**。修改后直接 commit push → GitHub Actions 自动部署到 GitHub Pages。

- 主题切换：D（白昼）/ N（夜晚）/ S（晚夏 + 飘叶森林音）/ M（深夜 + 月色虫鸣）/ R（雨天 + 雨声）/ C（混沌坍塌）
- 中英双语：右上 `中/EN` 切换，无刷新
- Shader 背景：图片用 `@paper-design/shaders-react` 的 HalftoneDots 半色调点阵
- 物理坍塌：Matter.js 按需从 CDN 加载

## 本地预览

```bash
python3 -m http.server 5173
# 打开 http://localhost:5173
```

## 更新内容的地方

- **Ships / 个人信息（名字 / bio / artifacts / social）**：`js/i18n.js` 顶部 `window.I18N` 字典
  - 加新项目时 zh 和 en 的 `artifacts` 数组都要改一遍，保持长度和顺序一致
- **thoughts / images / writing**：`content/data.json`
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
node -c js/themes.js
node -c js/chaos.js
python3 -c "import json; json.load(open('content/data.json'))"
```

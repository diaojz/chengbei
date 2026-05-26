# 城北 · 个人站

[chengbei.org](https://chengbei.org)

零基础 AI 开发课讲师 + 独立开发者的个人站。三栏布局，第一栏身份 + Ships + Writing + Social，第二栏 thoughts/voice/video 时间线，第三栏图片画廊。

部署在 GitHub Pages，自定义域名 `chengbei.org`。

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

- **个人信息（名字 / bio / artifacts / social）**：`js/i18n.js` 顶部 `window.I18N` 字典
- **thoughts / images / writing**：`content/data.json`
- **SEO meta / title**：`index.html` 顶部
- **logo 字母**：`index.html` 里 `<svg class="logo">` 节点

## 改了 JS 必跑

```bash
node -c js/app.js
node -c js/i18n.js
node -c js/themes.js
node -c js/chaos.js
python3 -c "import json; json.load(open('content/data.json'))"
```

# 关于页插画

2026-10-19 使用 `diao-gpt-image` 指定的 Codex 原生 `image_gen` 生成。未使用其他生图服务或独立 API Key。原始图片保留在本机 Codex generated_images；本目录是实际用于网站的压缩 WebP。

| 文件 | 显示用途 | 尺寸 |
|---|---|---|
| workspace.webp | 关于页首屏独立图像 | 1200 × 800 |
| build.webp | AI 应用与工具卡片 | 720 × 480 |
| learn.webp | 教程与实践笔记卡片 | 720 × 480 |
| explore.webp | 个人产品与实验卡片 | 720 × 480 |

生成约束：独立画面、无文字/品牌/水印；象牙白、钴蓝和暖橙的统一视觉；主体充分占据画面，不预留大幅空白供文字叠加。文案全部由页面 HTML 承担。

## 提示词记录

### workspace

Refined editorial 3D illustration, landscape 3:2. A creative coding desk: matte ivory laptop with an abstract blue window, modular cobalt blocks, an unmarked open cream notebook, and a warm orange desk lamp on a pale architectural plinth. Ceramic and paper materials, studio daylight and soft shadows. Subject fills 75 percent of image, no large blank copy area. Premium contemporary magazine art direction. No people, logos, letters, words or watermark.

### build

Premium editorial 3D still life, landscape 3:2. Three ivory ceramic blocks connected by a single cobalt blue curved tube; a translucent warm orange glass sphere seated in a circular socket; a small matte blue arch. Physically plausible on a pale studio surface, fine-grain tactile materials and soft daylight. Close-up, composition fills frame. No laptop, screens, arrows, people, text, labels, logos or watermark. Standalone artwork, no UI panels.

### learn

Art-directed editorial 3D still life, landscape 3:2. Three unmarked cream notebooks with cobalt and peach cloth bindings, an open blank notebook, a cobalt pencil across its lower margin and an orange ceramic bookmark arch. Warm ivory tabletop, realistic paper and cloth textures, soft daylight shadows, slightly overhead. No writing, printed lines, graphs, labels, logos, people or watermark. No oversized empty copy area.

### explore

Premium editorial 3D still life, landscape 3:2. A rounded cobalt freestanding doorway, an ivory staircase of four clearly separated steps, an orange folded paper airplane beside the bottom step, and a small peach sphere. Coherent physical geometry, warm ivory surface, fine tactile materials, soft daylight. Subject fills the frame. No people, text, logos, UI panels or watermark.

## 验图与资源策略

逐张查看原图，并对电脑键盘/纸页、模块连接、铅笔笔尖和阶梯区域放大 200% 检查；无乱码或明显主体结构问题。插画用于氛围，不作为硬件或系统架构图。

压缩时只调整尺寸与编码（WebP quality 82）；四张合计不超过 240 KiB。首屏图声明宽高并设置高优先级，其余三张懒加载。禁止改用动画图片或视频背景。

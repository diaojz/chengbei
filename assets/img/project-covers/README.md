# 项目封面素材 · 2026-10-19

新增八张封面通过 diao-gpt-image 指定的 Codex 原生 image_gen 生成；没有使用其他生图服务。压缩版本保存在本目录，原始 PNG 保留在本机生成目录。四张已有项目封面压缩复用，另复用四张关于页插画。

所有生成图共用要求：独立 3:2 编辑式 3D 静物，象牙白/钴蓝/暖橙，陶瓷、纸和玻璃材质，柔和自然光；主体占据画面，无文字、标识、水印、人物或 UI 拼版。每张逐图查看并放大关键区域验图。

## 各图主题提示词

### reconnect.webp

Two clearly separated cobalt blue cable connectors aligned and securely joined at center, with a small ivory computer terminal tile behind them showing only one abstract blue line. The theme is restoring a reliable connection. No literal text or technical diagrams.

### video.webp

A miniature creative video editing set: three ivory film frame tiles arranged in sequence, one warm orange play triangle as a physical object, a small cobalt film reel and a neatly coiled strip. The theme is a reusable video production workflow. No tiny interface, lettering or numbers.

### evaluation.webp

A carefully constructed small balanced two-pan ivory precision scale, cobalt blue sample blocks on both pans and a warm orange calibration sphere beside the base. Straight symmetrical mechanical geometry, each pan attached correctly. The theme is reliable model evaluation. No tick marks, numbers or claims.

### migration.webp

Two small ivory laptop-like sculptural panels facing one another across a short cobalt blue bridge, one orange translucent cube resting at the bridge center. The panels contain abstract solid-color screens only. The theme is moving a developer setup between computers. No Apple logo, arrows or text.

### news.webp

A tactile stack of unmarked ivory folded newspapers and editorial cards with a cobalt blue magnifying glass and one orange glass orb, neatly composed. Blank surfaces with abstract blue and peach geometric rectangles, absolutely no writing or fake words. The theme is curated technology news.

### diagnostics.webp

An ivory open tool tray holding one cobalt blue screwdriver, one warm orange wrench, and a single small ivory circuit tile with three clearly separated blue nodes. Realistic coherent tool geometry. The theme is diagnosing a developer environment. No brand marks, writing or miniature UI.

### cards.webp

A premium playful still-life of exactly four ivory playing cards fanned neatly, each with one simple large cobalt-blue or warm-orange suit shape in the center, and three small cobalt gaming chips stacked on the right. The theme is an independent browser card game. No numbers, words or gambling advertisements.

### voice.webp

A single beautifully designed cobalt-blue desktop microphone with an ivory circular base, beside a sculptural warm orange audio waveform made of seven smoothly rounded vertical bars. Clear coherent microphone geometry and a subtle ivory cable. The theme is native voice input. No headphones, letters, branding or UI.

## 使用规则

所有项目必须在 src/data/projects.ts 绑定 cover 字段。首页和项目列表共用该字段；不要使用数组序号来关联封面。封面为概念插画或原有配图，不应描述成产品界面截图。图片统一静态 WebP，声明宽高，首屏之后懒加载，不使用循环动画。正式路径与项目对应关系以数据文件为准。


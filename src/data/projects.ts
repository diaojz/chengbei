import type { Lang } from '../lib/content';

export type Project = {
  titleZh: string;
  titleEn: string;
  href: string;
  date?: string;
  kind: '专题' | '课程' | '工具' | '项目';
  descriptionZh: string;
  descriptionEn: string;
  featured?: boolean;
};

export const projects: Project[] = [
  { titleZh: 'AI 就业直播合规与增长手册', titleEn: 'AI Career Livestream Compliance Guide', href: '/livestream-compliance/', date: '2026-09-10', kind: '课程', descriptionZh: '直播违禁表达、就业与薪资承诺边界、选题、话术和开播自检。', descriptionEn: 'Compliance boundaries, topics, scripts and a pre-flight checklist for AI career livestreams.', featured: true },
  { titleZh: '一个人的 Mac 直播间', titleEn: 'A Solo Mac Livestream Setup', href: '/mac-livestream-setup/', date: '2026-08-31', kind: '专题', descriptionZh: '从调研、踩坑到跑通视频号直播的一次真实搭建记录。', descriptionEn: 'A field log of building a Mac-based livestream workflow.', featured: true },
  { titleZh: 'AI 求职每日一课', titleEn: 'AI Career Daily', href: '/tech-notes/', date: '2026-08-24', kind: '课程', descriptionZh: '12 周从会调用到会上生产的 AI 应用工程学习路线。', descriptionEn: 'A 12-week path from API calls to production AI applications.', featured: true },
  { titleZh: 'Codex 重连修复指南', titleEn: 'Codex Reconnect Guide', href: '/codex-reconnect/', date: '2026-08-05', kind: '专题', descriptionZh: '定位并解决 Codex CLI 反复重连。', descriptionEn: 'Diagnose and fix recurring Codex CLI reconnects.' },
  { titleZh: '手工短视频 SOP 拆解', titleEn: 'Manual Video SOP', href: '/sop-teardown/', date: '2026-07-27', kind: '专题', descriptionZh: '从具体工具里抽出真正可复用的内容生产判据。', descriptionEn: 'Reusable production criteria extracted from a manual video workflow.' },
  { titleZh: '裁判模型准确率提升清单', titleEn: 'LLM Judge Accuracy Playbook', href: '/judge-accuracy/', date: '2026-07-24', kind: '专题', descriptionZh: '将 LLM Judge 从 88% 推到 90% 的实践清单。', descriptionEn: 'A practical checklist for improving an LLM judge.' },
  { titleZh: '苹果开发者账号迁移指南', titleEn: 'Apple Developer Migration', href: '/apple-dev-migration/', date: '2026-06-12', kind: '专题', descriptionZh: '换 Mac 时迁移证书和开发者环境的三条路线。', descriptionEn: 'Three routes for moving Apple developer credentials to a new Mac.' },
  { titleZh: '置身钉内', titleEn: 'Inside DingTalk', href: '/dingtalk-one/', date: '2026-06-10', kind: '项目', descriptionZh: '钉钉 ONE 项目的产品复盘。', descriptionEn: 'A product postmortem of the DingTalk ONE project.' },
  { titleZh: 'Ghostty 终端配置', titleEn: 'Ghostty Terminal Setup', href: '/ghostty-terminal/', date: '2026-06-04', kind: '课程', descriptionZh: 'Ghostty 配置课件与完整讲解。', descriptionEn: 'A complete Ghostty configuration course.' },
  { titleZh: 'Ghostty 配置清单', titleEn: 'Ghostty Checklist', href: '/ghostty-checklist/', date: '2026-06-04', kind: '专题', descriptionZh: '可以照抄即用的终端配置清单。', descriptionEn: 'A copy-ready terminal setup checklist.' },
  { titleZh: 'mini-harness', titleEn: 'mini-harness', href: '/mini-harness/', date: '2026-06-03', kind: '课程', descriptionZh: 'Harness 三件套的可运行代码精讲。', descriptionEn: 'A runnable code walkthrough of a minimal harness.' },
  { titleZh: 'AI 情报站', titleEn: 'AI Daily', href: 'https://news.diaoye.org', kind: '项目', descriptionZh: '每日 AI 大事件 Top 10。', descriptionEn: 'A daily top-ten AI news briefing.' },
  { titleZh: 'cc-doctor', titleEn: 'cc-doctor', href: 'https://github.com/diaojz/cc-doctor', kind: '工具', descriptionZh: '一键诊断 Claude Code 常见环境问题。', descriptionEn: 'One-command diagnostics for Claude Code environments.' },
  { titleZh: 'Balatro Web', titleEn: 'Balatro Web', href: 'https://diaojz.github.io/balatro-game/', kind: '项目', descriptionZh: '8 轮课程演示项目。', descriptionEn: 'An eight-round course demo project.' },
  { titleZh: 'Typevoise', titleEn: 'Typevoise', href: 'https://github.com/diaojz/Typevoise', kind: '工具', descriptionZh: 'macOS 原生语音输入工具。', descriptionEn: 'A native voice-input utility for macOS.' }
];

export function projectText(project: Project, lang: Lang) {
  return {
    title: lang === 'zh' ? project.titleZh : project.titleEn,
    description: lang === 'zh' ? project.descriptionZh : project.descriptionEn
  };
}

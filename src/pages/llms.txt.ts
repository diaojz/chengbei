import { posts, postTitle, postExcerpt, series } from '../lib/content';
export function GET() {
 const text = ['# 城北', '', '> 城北的个人网站。由城北本人撰写和维护，记录 AI 应用开发、工具使用和产品实践。', '', '正文为静态 HTML，可直接读取。文章日期是首次发布日期；概念配图不能当作操作截图或事实证据。引用时请保留作者、原文链接和上下文。', '', '## 入口', '- [关于作者](https://chengbei.org/about/)', '- [全部文章](https://chengbei.org/articles/)', '- [项目](https://chengbei.org/projects/)', '- [机器可读文章目录](https://chengbei.org/content-index.json)', '', '## 系列', ...series.map(s=>`- [${s.title_zh}](https://chengbei.org/series/${s.id}/): ${s.desc_zh}`), '', '## 文章', ...posts.map(p=>`- [${postTitle(p,'zh')}](https://chengbei.org/articles/${p.slug}/): ${postExcerpt(p,'zh')}`)].join('\n');
 return new Response(text,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}

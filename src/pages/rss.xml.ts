import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { posts, postExcerpt, postTitle } from '../lib/content';

export function GET(context: APIContext) {
  return rss({
    title: '城北',
    description: '城北的文章、项目与实践记录。',
    site: context.site!,
    items: posts.map((post) => ({
      title: postTitle(post, 'zh'),
      description: postExcerpt(post, 'zh'),
      pubDate: new Date(post.ts),
      link: `/articles/${post.slug}/`
    })),
    customData: '<language>zh-CN</language>'
  });
}

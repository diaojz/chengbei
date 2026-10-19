import { projects } from '../data/projects';
import { posts, postTitle, postExcerpt, postTags } from '../lib/content';
export function GET() {
 return new Response(JSON.stringify({author:'城北',site:'https://chengbei.org',articles:posts.map(p=>({title:postTitle(p,'zh'),description:postExcerpt(p,'zh'),url:`https://chengbei.org/articles/${p.slug}/`,published:new Date(p.ts).toISOString(),topics:postTags(p,'zh'),markdown:`https://chengbei.org/content/posts/${p.slug}.zh.md` })),projects:projects.filter(p=>p.href.startsWith('/')).map(p=>({title:p.titleZh,description:p.descriptionZh,url:`https://chengbei.org${p.href}`,topics:[p.kind]}))}),{headers:{'Content-Type':'application/json; charset=utf-8'}});
}

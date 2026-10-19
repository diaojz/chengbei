import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const visuals=JSON.parse(await readFile('content/visuals.json','utf8')).articles;
test('全部38篇文章都有有效WebP封面，Dify十篇封面各异',async()=>{
 assert.equal(Object.keys(visuals).length,38);
 const dify=Object.entries(visuals).filter(([slug])=>slug.startsWith('dify-'));
 assert.equal(dify.length,10); assert.equal(new Set(dify.map(([,v])=>v.src)).size,10);
 for(const [slug,v] of Object.entries(visuals)){const b=await readFile(v.src.slice(1));assert.equal(b.toString('ascii',8,12),'WEBP',slug);}
});
test('首页三个起点都有静态封面',async()=>{const s=await readFile('src/components/HomePage.astro','utf8');assert.equal((s.match(/icon:.*?cover:/g)||[]).length,3);assert.match(s,/class="entry-cover"/);});

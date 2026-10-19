import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {rankArticles} from '../src/lib/site-retrieval.mjs';
test('自然语言检索优先匹配相关原文，不把无关问题伪造为答案',()=>{
 const articles=[{title:'Codex 重连修复指南',description:'定位并解决反复重连',topics:['Codex']},{title:'Dify 部署',description:'服务器',topics:['Dify']},{title:'Codex 权限',description:'配置命令',topics:['Codex']}];
 assert.equal(rankArticles('Codex 重连怎么办',articles)[0].title,'Codex 重连修复指南');
 assert.equal(rankArticles('Dify 如何部署',articles)[0].title,'Dify 部署');
 assert.equal(rankArticles('冰岛火山',articles).length,0);
});
test('移动阅读工具支持目录、字号、图片查看和安全区',async()=>{
 const source=await readFile('src/components/ReadingTools.astro','utf8');const css=await readFile('src/styles/studio.css','utf8');
 for(const key of ['data-reader-font','data-reader-toc-dialog','data-reader-image-dialog','data-image-zoom'])assert.ok(source.includes(key));
 assert.match(source,/sizes=\[17,19,21\]/);assert.match(source,/preventScroll:true/);assert.match(css,/safe-area-inset-bottom/);assert.match(css,/overflow-x:auto/);
});
test('新版恢复原 GoatCounter，失败不显示伪造数字',async()=>{
 const layout=await readFile('src/layouts/BaseLayout.astro','utf8');const stats=await readFile('src/components/VisitStats.astro','utf8');
 assert.match(layout,/data-goatcounter="https:\/\/chengbei.goatcounter.com\/count"/);
 assert.equal((layout.match(/data-goatcounter=/g)||[]).length,1);assert.match(stats,/Asia\/Shanghai/);assert.match(stats,/AbortSignal.timeout/);assert.match(stats,/data-visit-total>—/);
});
test('提供机器可读目录和文章结构化数据，无模型密钥进前端',async()=>{
 const layout=await readFile('src/layouts/BaseLayout.astro','utf8');const article=await readFile('src/components/ArticlePage.astro','utf8');const ask=await readFile('src/components/AskArticles.astro','utf8');
 assert.match(layout,/rel="canonical"/);assert.match(layout,/application\/ld\+json/);assert.match(article,/BlogPosting/);assert.match(article,/datePublished/);
 assert.match(ask,/当前只检索原文，不生成答案/);assert.doesNotMatch(ask,/api_key|Bearer |\bsk-[A-Za-z0-9]{20,}\b/);
});

test('本地图文在构建时读取尺寸，避免懒加载时版面跳动',async()=>{
 const {localImageDimensions}=await import('../src/lib/image-dimensions.mjs');
 const png=await localImageDimensions('/assets/brand/chengbei-logo-original.png');assert.ok(png.width>1000&&png.height>1000);
 const webp=await localImageDimensions('/assets/brand/chengbei-logo.webp');assert.equal(webp.width,192);assert.equal(webp.height,192);
 assert.equal(await localImageDimensions('https://example.com/image.png'),null);assert.equal(await localImageDimensions('../../etc/passwd'),null);
});

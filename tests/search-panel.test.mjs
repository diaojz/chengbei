import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {Script} from 'node:vm';
const source=await readFile('src/components/Search.astro','utf8');
test('搜索面板包含可访问名称、四个快捷主题和推荐阅读',()=>{
 assert.match(source,/aria-label=\{copy.title\}/);
 assert.match(source,/\['Dify', 'Codex', 'npm', 'AI Agent'\]/);
 assert.match(source,/data-search-discover/);
 assert.match(source,/series\/dify/);
 assert.match(source,/articles\/npm-npx-node-explained/);
 new Script(source.split('<script is:inline define:vars={{ copy }}>')[1].split('</script>')[0]);
});
test('搜索清空后恢复推荐，并防止旧异步结果覆盖新查询',()=>{
 assert.match(source,/discover.hidden = Boolean\(query\)/);
 assert.match(source,/current !== generation/);
 assert.match(source,/data-search-term/);
 assert.match(source,/timer = setTimeout\(search, 120\)/);
});

test('搜索弹窗解除底部约束，窄屏按内容高度展示',async()=>{const css=await readFile('src/styles/studio.css','utf8');assert.match(css,/\.search-dialog\s*\{\s*bottom:auto;/);});

test('桌面搜索位于导航前，小屏保留顶部导航搜索',async()=>{
 const layout=await readFile('src/layouts/BaseLayout.astro','utf8');
 assert.ok(layout.indexOf('nav-action sidebar-search')<layout.indexOf('class="sidebar-label"'));
 assert.ok(layout.indexOf('nav-action sidebar-search')<layout.indexOf('<nav class="site-nav"'));
 assert.match(layout,/nav-action mobile-search/);
 const css=await readFile('src/styles/studio.css','utf8');
 assert.match(css,/\.site-header \.mobile-search\s*\{\s*display:none/);
});

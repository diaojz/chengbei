import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import ts from 'typescript';

test('项目分类使用实际脚本过滤卡片并更新可访问状态', async () => {
 const source=await readFile('src/components/ProjectsPage.astro','utf8');
 const callbacks=new Map();
 const buttons=['','工具','专题'].map(kind=>({dataset:{projectKind:kind},setAttribute(k,v){this[k]=v;},addEventListener(_,fn){callbacks.set(this,fn);}}));
 const cards=['工具','专题','课程','工具'].map(kind=>({dataset:{projectCard:kind},hidden:false}));
 const status={textContent:''};
 const document={documentElement:{lang:'zh-CN'},querySelectorAll(selector){return selector==='[data-project-kind]'?buttons:cards;},querySelector(){return status;}};
 const js=ts.transpileModule(source.split('<script>')[1].split('</script>')[0],{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
 new Script(js).runInNewContext({document});
 callbacks.get(buttons[1])();
 assert.deepEqual(cards.map(c=>c.hidden),[false,true,true,false]);
 assert.equal(status.textContent,'共 2 个项目与专题');assert.equal(buttons[1]['aria-pressed'],'true');
 callbacks.get(buttons[0])();assert.ok(cards.every(c=>!c.hidden));assert.equal(buttons[1]['aria-pressed'],'false');
});
test('中英文文章页共用配图页头，推荐阅读排除当前和前后章', async()=>{
 for(const p of ['src/pages/articles/index.astro','src/pages/en/articles/index.astro'])assert.match(await readFile(p,'utf8'),/<LibraryHeading/);
 const article=await readFile('src/components/ArticlePage.astro','utf8');
 assert.match(article,/item.slug !== post.slug/);assert.match(article,/item.slug !== previous\?\.slug/);assert.match(article,/slice\(0, 3\)/);
 assert.match(article,/related-reading[\s\S]*data-pagefind-ignore/);
});
test('新增动效有限且支持减少动态效果，无持续动画或新增绘制循环',async()=>{
 const css=await readFile('src/styles/studio.css','utf8');
 assert.match(css,/@media \(prefers-reduced-motion:no-preference\)/);assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
 assert.doesNotMatch(css,/animation:[^;]*infinite/);
 assert.match(css,/\.portfolio-card\[hidden\] \{ display:none/);
});

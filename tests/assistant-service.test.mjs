import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {Ledger} from '../services/assistant/ledger.mjs';
import {DEFAULTS,validateQuestion,retrieve,buildMessages,reservation,validateAnswer,configuredBudget} from '../services/assistant/policy.mjs';
import {createHandler} from '../services/assistant/server.mjs';
function ledger(t,config={}){const dir=mkdtempSync(path.join(tmpdir(),'chengbei-ledger-'));const file=path.join(dir,'usage.sqlite');const value=new Ledger(file,config);t.after(()=>{value.close();rmSync(dir,{recursive:true,force:true});});return {value,file};}
test('额度跨实例持久化，访客次数和全站次数均无法靠重启清零',t=>{
 const {value,file}=ledger(t,{visitorDaily:2,globalDaily:3});const now=Date.UTC(2026,9,19);
 value.rate('a',now);value.rate('a',now);assert.throws(()=>value.rate('a',now),/次数/);
 const other=new Ledger(file,{visitorDaily:2,globalDaily:3});t.after(()=>other.close());assert.throws(()=>other.rate('a',now),/次数/);other.rate('b',now);assert.throws(()=>other.rate('c',now),/次数/);
});
test('预算先预留，未知结果不退款，并发限制与单访客并发均执行',t=>{
 const {value}=ledger(t,{monthlyNanoUsd:100,concurrency:2});const now=Date.UTC(2026,9,19);
 const first=value.reserve(40,now,'a');assert.throws(()=>value.reserve(10,now,'a'),/上一条/);
 const second=value.reserve(40,now,'b');assert.throws(()=>value.reserve(5,now,'c'),/较多/);
 value.fail(first);assert.throws(()=>value.reserve(30,now,'c'),/本月/);value.settle(second,10);const third=value.reserve(40,now,'c');assert.ok(third);
});
test('分钟限额不依赖客户端cookie，缓存不修改已结算的成本',t=>{
 const {value}=ledger(t,{minute:2});value.gate('ip',1);value.gate('ip',1);assert.throws(()=>value.gate('ip',1),/太快/);
 value.setCache('q',{answer:'source'},1);assert.equal(value.getCache('q',2).answer,'source');assert.equal(value.getCache('q',86400002),null);
});
test('拒绝通用代写，资料不足不召回，模型引用必须属于服务端来源',()=>{
 assert.throws(()=>validateQuestion('帮我写一首诗'),/本站/);assert.throws(()=>validateQuestion('x'.repeat(401)),/400/);
 const corpus=[{title:'Codex 重连',description:'代理排错',text:'检查代理\n\n查看日志',url:'https://chengbei.org/codex-reconnect/'}];
 assert.equal(retrieve('冰岛火山旅游',corpus).length,0);assert.equal(retrieve('Codex 重连',corpus).length,1);
 const {messages,sources}=buildMessages('Codex 重连',corpus);assert.ok(reservation(messages)>0);assert.throws(()=>validateAnswer({answer:'x',citations:[99]},sources),/citations/);
 assert.deepEqual(validateAnswer({answer:'没有资料却生成的文字',citations:[]},sources).sources,[]);
});
test('真实HTTP链路：非法来源和无关问题不调用模型，缓存命中不重复付费',async t=>{
 const {value}=ledger(t);let calls=0;const config={...DEFAULTS,origin:'https://chengbei.org',ipSecret:'x'.repeat(32),requireChallenge:false,apiURL:'https://api.deepseek.com/chat/completions',apiKey:'test-only',model:'deepseek-flash'};
 const corpus={revision:'test',docs:[{title:'Codex 重连',description:'重连修复',text:'检查代理并查看日志。',url:'https://chengbei.org/codex-reconnect/'}]};
 const server=http.createServer(createHandler({ledger:value,corpus,config,fetchImpl:async(_url,init)=>{calls++;const body=JSON.parse(init.body);assert.equal(body.max_tokens,600);assert.equal(body.thinking.type,'disabled');assert.equal(body.messages.length,2);return new Response(JSON.stringify({usage:{prompt_tokens:50,completion_tokens:20},choices:[{message:{content:JSON.stringify({answer:'先检查代理[1]。',citations:[1]})}}]}));}}));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>server.close());const url=`http://127.0.0.1:${server.address().port}/chat`;
 const send=(question,origin='https://chengbei.org')=>fetch(url,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({question})});
 assert.equal((await send('Codex 重连','https://evil.example')).status,403);
 assert.equal((await send('冰岛火山旅游')).status,200);assert.equal(calls,0);
 const answer=await (await send('Codex 重连')).json();assert.equal(answer.sources[0].url,corpus.docs[0].url);assert.equal(calls,1);
 const cached=await (await send('Codex 重连')).json();assert.equal(cached.cached,true);assert.equal(calls,1);
});

test('生产验证码校验拒绝错误hostname/action，失败不调用模型',async t=>{
 const {value}=ledger(t);let calls=0;
 const config={...DEFAULTS,origin:'https://chengbei.org',ipSecret:'s'.repeat(32),requireChallenge:true,challengeSecret:'test-only',apiURL:'https://api.deepseek.com/chat/completions'};
 const server=http.createServer(createHandler({ledger:value,corpus:{revision:'x',docs:[]},config,fetchImpl:async()=>{calls++;return new Response(JSON.stringify({success:true,hostname:'evil.example',action:'site_chat'}));}}));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>server.close());const url=`http://127.0.0.1:${server.address().port}/chat`;
 const request=body=>fetch(url,{method:'POST',headers:{Origin:config.origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
 assert.equal((await request({question:'Codex 重连'})).status,403);assert.equal(calls,0);
 assert.equal((await request({question:'Codex 重连',challenge:'token'})).status,403);assert.equal(calls,1);
});

test('用户月预算10元不能因环境变量误配而提高',()=>{
 assert.equal(configuredBudget('1.25'),1_250_000_000);assert.equal(configuredBudget('0.5'),500_000_000);
 for(const value of ['',undefined,'0','-1','3.75','NaN','Infinity'])assert.throws(()=>configuredBudget(value));
});

test('部署未开放时健康检查报告未就绪，聊天不触碰账本和上游',async t=>{
 const server=http.createServer(createHandler({ledger:{},corpus:{},config:{enabled:false,origin:'https://chengbei.org'},fetchImpl:()=>{throw new Error('must not call');}}));
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));t.after(()=>server.close());
 const base=`http://127.0.0.1:${server.address().port}`;
 assert.deepEqual(await (await fetch(base+'/health')).json(),{ok:true,ready:false});
 assert.equal((await fetch(base+'/chat',{method:'POST',headers:{Origin:'https://chengbei.org'}})).status,503);
});

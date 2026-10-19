import http from 'node:http';
import { readFileSync,mkdirSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import { Ledger } from './ledger.mjs';
import { DEFAULTS,validateQuestion,retrieve,buildMessages,reservation,cacheKey,validateAnswer } from './policy.mjs';

export function createHandler({ledger,corpus,config,fetchImpl=fetch}){
 const origin=config.origin;
 const respond=(res,status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin','Access-Control-Allow-Origin':origin});res.end(JSON.stringify(data));};
 return async(req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(req.method==='GET'&&pathname==='/health')return respond(res,200,{ok:true,ready:true});
  if(req.headers.origin!==origin)return respond(res,403,{error:'此服务仅供城北网站使用。'});
  if(req.method==='OPTIONS'){res.writeHead(204,{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600','Vary':'Origin'});return res.end();}
  if(req.method!=='POST'||pathname!=='/chat')return respond(res,404,{error:'Not found'});
  let job;
  try{
   if(!String(req.headers['content-type']||'').startsWith('application/json'))throw Object.assign(new Error('JSON required'),{status:415});
   let bytes=0;const chunks=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>4096)throw Object.assign(new Error('问题过长。'),{status:413});chunks.push(chunk);}
   let data;try{data=JSON.parse(Buffer.concat(chunks).toString('utf8'));}catch{throw Object.assign(new Error('Invalid JSON'),{status:400});}
   const question=validateQuestion(data.question);
   const ip=config.trustProxy?String(req.headers['x-real-ip']||''):req.socket.remoteAddress;
   if(!ip)throw Object.assign(new Error('访客地址不可用。'),{status:403});
   const visitor=createHmac('sha256',config.ipSecret).update(ip).digest('hex');ledger.gate(visitor);
   if(config.requireChallenge){
    if(typeof data.challenge!=='string'||data.challenge.length>2048)throw Object.assign(new Error('请先完成人机验证。'),{status:403});
    const verified=await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:config.challengeSecret,response:data.challenge,remoteip:ip}),signal:AbortSignal.timeout(8000)});
    if(!verified.ok)throw Object.assign(new Error('人机验证暂不可用。'),{status:503});
    const verdict=await verified.json();if(!verdict.success||verdict.hostname!==new URL(origin).hostname||verdict.action!=='site_chat')throw Object.assign(new Error('人机验证未通过，请重试。'),{status:403});
   }
   ledger.rate(visitor);
   const key=cacheKey(question,corpus.revision);const cached=ledger.getCache(key);if(cached)return respond(res,200,{...cached,cached:true});
   const docs=retrieve(question,corpus.docs);if(!docs.length)return respond(res,200,{answer:'本站还没有与这个问题足够相关的资料，可以试试更具体的工具名或文章主题。',sources:[],mode:'no-source'});
   const {messages,sources}=buildMessages(question,docs);job=ledger.reserve(reservation(messages,config),Date.now(),visitor);
   const upstream=await fetchImpl(config.apiURL,{method:'POST',headers:{'Authorization':`Bearer ${config.apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:config.model,messages,thinking:{type:'disabled'},max_tokens:config.maxOutput,temperature:0.2,response_format:{type:'json_object'},stream:false}),signal:AbortSignal.timeout(25000)});
   if(!upstream.ok)throw new Error('Upstream unavailable');
   const text=await upstream.text();if(text.length>100000)throw new Error('Upstream response too large');const result=JSON.parse(text);
   let used;const usage=result.usage;if(Number.isSafeInteger(usage?.prompt_tokens)&&usage.prompt_tokens>=0&&Number.isSafeInteger(usage?.completion_tokens)&&usage.completion_tokens>=0)used=usage.prompt_tokens*config.inputNanoUsd+usage.completion_tokens*config.outputNanoUsd;
   // Settle known token use even if the model produced malformed or uncited output.
   ledger.settle(job,used);job=undefined;
   const answer=validateAnswer(JSON.parse(result.choices?.[0]?.message?.content),sources);
   ledger.setCache(key,answer);return respond(res,200,{...answer,mode:'grounded-answer'});
  }catch(error){if(job)ledger.fail(job);return respond(res,error.status||503,{error:error.status?error.message:'暂时无法生成回答，请使用原文检索。'});}
 };
}

if(process.argv[1]&&new URL(import.meta.url).pathname===process.argv[1]){
 const env=process.env;const budget=Number(env.CHAT_MONTHLY_BUDGET_USD);
 if(!env.DEEPSEEK_API_KEY||!env.CHAT_IP_SECRET||env.CHAT_IP_SECRET.length<32||!Number.isFinite(budget)||budget<=0)throw new Error('Set DEEPSEEK_API_KEY, CHAT_IP_SECRET (32+ chars), CHAT_MONTHLY_BUDGET_USD before starting.');
 const production=!['development','test'].includes(env.NODE_ENV);if(production&&!env.TURNSTILE_SECRET_KEY)throw new Error('Production requires TURNSTILE_SECRET_KEY.');
 const dataDir=env.CHAT_DATA_DIR||'./data';mkdirSync(dataDir,{recursive:true});
 const config={...DEFAULTS,apiKey:env.DEEPSEEK_API_KEY,apiURL:'https://api.deepseek.com/chat/completions',model:'deepseek-flash',origin:env.CHAT_ALLOWED_ORIGIN||'https://chengbei.org',ipSecret:env.CHAT_IP_SECRET,monthlyNanoUsd:Math.floor(budget*1e9),requireChallenge:production,challengeSecret:env.TURNSTILE_SECRET_KEY,trustProxy:env.CHAT_TRUST_PROXY==='1'};
 const corpus=JSON.parse(readFileSync(new URL('./generated/corpus.json',import.meta.url),'utf8'));
 const ledger=new Ledger(`${dataDir}/usage.sqlite`,config);
 const server=http.createServer(createHandler({ledger,corpus,config}));server.requestTimeout=35000;server.headersTimeout=10000;server.listen(Number(env.PORT)||8787,'0.0.0.0',()=>console.log('Site assistant listening; budget and challenge checks enabled according to configuration.'));
}

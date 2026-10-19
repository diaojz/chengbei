import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const index=JSON.parse(await readFile('dist/content-index.json','utf8'));
const docs=[];
for(const item of [...index.articles,...index.projects]){
 const url=new URL(item.url);let text=item.description;
 try{if(item.markdown){text=await readFile(new URL(item.markdown).pathname.slice(1),'utf8');}else{text=await readFile(path.join('dist',url.pathname,'index.html'),'utf8');text=text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/[ \t]+/g,' ');}}catch{}
 docs.push({title:item.title,description:item.description,url:item.url,text:text.slice(0,80000)});
}
const revision=createHash('sha256').update(JSON.stringify(docs)).digest('hex');
await mkdir('services/assistant/generated',{recursive:true});await writeFile('services/assistant/generated/corpus.json',JSON.stringify({revision,docs}));console.log(`Assistant corpus: ${docs.length} public documents, ${revision.slice(0,12)}`);

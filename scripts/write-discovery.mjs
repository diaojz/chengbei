import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const files=await readdir(root,{recursive:true});
const urls=files.filter(p=>p.endsWith('index.html')&&!p.startsWith('classic/')).map(p=>'https://chengbei.org/'+p.replace(/index\.html$/,'').split(path.sep).join('/'));
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
await writeFile(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>`<url><loc>${escape(url)}</loc></url>`).join('')+'</urlset>\n');
console.log(`Sitemap: ${urls.length} URLs`);

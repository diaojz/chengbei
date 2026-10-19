import {execFileSync} from 'node:child_process';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
export function secretFindings(text){
 const rules=[['provider-token',/\bsk-[A-Za-z0-9_-]{20,}\b/g],['aws-access-key',/\bAKIA[0-9A-Z]{16}\b/g],['private-key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g]];
 const found=[];
 for(const [rule,re]of rules)for(const match of text.matchAll(re))found.push({rule,line:text.slice(0,match.index).split('\n').length});
 const assignment=/\b(?:DEEPSEEK_API_KEY|TURNSTILE_SECRET_KEY|CHAT_IP_SECRET)[ \t]*[=:][ \t]*["']?([^\s"'`,;#]+)/g;
 for(const match of text.matchAll(assignment)){
  const value=match[1];if(/^(?:CHANGE_ME|REPLACE_ME|YOUR_[A-Z_]+|test-only|\$\{?[A-Z_][A-Z0-9_]*\}?|<[^>]+>)$/.test(value))continue;
  found.push({rule:'secret-assignment',line:text.slice(0,match.index).split('\n').length});
 }
 return found;
}
export async function scanFiles(files){const found=[];for(const file of files){let bytes;try{bytes=await readFile(file);}catch{continue;}if(bytes.includes(0))continue;for(const finding of secretFindings(bytes.toString('utf8')))found.push({file,...finding});}return found;}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const staged=process.argv.includes('--staged');
 let files=execFileSync('git',staged?['diff','--cached','--name-only','--diff-filter=ACMR','-z']:['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean);
 if(process.argv.includes('--dist'))files.push(...(await readdir('dist',{recursive:true})).map(p=>path.join('dist',p)));
 let found;
 if(staged){found=[];for(const file of files){const bytes=execFileSync('git',['show',`:${file}`]);if(bytes.includes(0))continue;for(const finding of secretFindings(bytes.toString('utf8')))found.push({file,...finding});}}
 else found=await scanFiles(files);
for(const item of found)console.error(`${item.file}:${item.line} [${item.rule}] value redacted`);
 console.log(`Secret scan: ${files.length} paths, ${found.length} findings (common patterns; not a proof against every possible secret format).`);if(found.length)process.exitCode=1;
}

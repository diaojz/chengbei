import {readFileSync,statSync} from 'node:fs';
// Production secret storage must be supplied by the host; no cryptographic key is bundled here.
export function loadSecret(name,env=process.env,{required=true,minLength=1}={}){
 const file=env[`${name}_FILE`];const inline=env[name];
 if(file&&inline)throw new Error(`${name}: configure either a secret file or environment value, not both.`);
 let value=inline||'';
 if(file){
  let stat;try{stat=statSync(file);}catch{throw new Error(`${name}: secret file unavailable.`);}
  if(!stat.isFile()||(stat.mode&0o077)!==0)throw new Error(`${name}: secret file must be a regular file with owner-only permissions (0400/0600).`);
  try{value=readFileSync(file,'utf8').trim();}catch{throw new Error(`${name}: secret file cannot be read by the service account.`);}
 }
 if((required&&!value)||(value&&value.length<minLength))throw new Error(`${name}: secret missing or too short.`);
 return value;
}

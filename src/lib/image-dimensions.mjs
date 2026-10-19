import { readFile } from 'node:fs/promises';
import path from 'node:path';
const cache=new Map();
export function dimensions(bytes){
 if(bytes.length>=24&&bytes.toString('ascii',1,4)==='PNG')return {width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20)};
 if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'){
  const type=bytes.toString('ascii',12,16);
  if(type==='VP8X'&&bytes.length>=30)return {width:bytes.readUIntLE(24,3)+1,height:bytes.readUIntLE(27,3)+1};
  if(type==='VP8 '&&bytes.length>=30)return {width:bytes.readUInt16LE(26)&0x3fff,height:bytes.readUInt16LE(28)&0x3fff};
  if(type==='VP8L'&&bytes.length>=25){const n=bytes.readUInt32LE(21);return {width:(n&0x3fff)+1,height:((n>>>14)&0x3fff)+1};}
 }
 if(bytes[0]===0xff&&bytes[1]===0xd8){let p=2;while(p+8<bytes.length){if(bytes[p]!==0xff){p++;continue;}const mark=bytes[p+1];if([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(mark))return {height:bytes.readUInt16BE(p+5),width:bytes.readUInt16BE(p+7)};const size=bytes.readUInt16BE(p+2);if(size<2)break;p+=2+size;}}
 return null;
}
export async function localImageDimensions(src){
 if(!src||/^(?:https?:|data:|\/\/)/i.test(src))return null;
 const name=src.split(/[?#]/)[0].replace(/^\//,'');const root=process.cwd();const file=path.resolve(root,name);
 if(!file.startsWith(root+path.sep))return null;
 if(!cache.has(file))cache.set(file,readFile(file).then(dimensions).catch(()=>null));
 return cache.get(file);
}

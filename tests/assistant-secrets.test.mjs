import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,chmodSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {loadSecret} from '../services/assistant/secrets.mjs';
import {secretFindings} from '../scripts/check-secrets.mjs';
test('Secret文件拒绝其他用户可读权限，报错不包含密钥',t=>{
 const dir=mkdtempSync(path.join(tmpdir(),'chengbei-secret-'));t.after(()=>rmSync(dir,{recursive:true,force:true}));const file=path.join(dir,'key');const secret='runtime-test-value';writeFileSync(file,secret,{mode:0o600});
 assert.equal(loadSecret('PROVIDER',{PROVIDER_FILE:file}),secret);chmodSync(file,0o644);
 assert.throws(()=>loadSecret('PROVIDER',{PROVIDER_FILE:file}),error=>!error.message.includes(secret)&&/owner-only/.test(error.message));
 assert.throws(()=>loadSecret('PROVIDER',{PROVIDER_FILE:file,PROVIDER:secret}));assert.throws(()=>loadSecret('PROVIDER',{}));
});
test('扫描常见令牌和私钥，扫描报告不回显秘密',()=>{
 const token=['sk','-','x'.repeat(32)].join('');const key=['-----BEGIN ','PRIVATE KEY-----'].join('');
 assert.ok(secretFindings(token).some(f=>f.rule==='provider-token'));assert.ok(secretFindings(key).some(f=>f.rule==='private-key'));
 const assignment=['DEEPSEEK_API_KEY','=','unexpected-value'].join('');assert.ok(secretFindings(assignment).some(f=>f.rule==='secret-assignment'));
 assert.equal(secretFindings('CHAT_MONTHLY_BUDGET_USD=1.25').length,0);assert.equal(secretFindings(['DEEPSEEK_API_KEY','=','\n'].join('')).length,0);
 assert.equal(secretFindings('DEEPSEEK_API_KEY_FILE=/run/secrets/provider').length,0);
});

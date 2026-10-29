import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {retrieval,writingCases} from '../site/assets/examples.js';
const root=path.resolve('site');
const pages=['index.html','paperpilot.html','swarmops.html','evidence.html'];
let links=0;
for(const page of pages){
  const html=await fs.readFile(path.join(root,page),'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${page}: one main heading`);
  assert(html.includes('lang="zh-CN"')&&html.includes('viewport'),`${page}: language and viewport`);
  for(const [,url] of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
    if(/^(https?:|mailto:|data:)/.test(url))continue;
    const [target,anchor]=url.split('#');
    const file=path.join(root,target||page);
    await fs.access(file);links++;
    if(anchor&&file.endsWith('.html'))assert((await fs.readFile(file,'utf8')).includes(`id="${anchor}"`),`${page}: anchor ${url}`);
  }
}
const metrics=JSON.parse(await fs.readFile(path.join(root,'assets/metrics.json'),'utf8'));
assert.equal(metrics.paperpilot.topic_retrieval.cases,46);
assert.equal(metrics.paperpilot.preflight.cases,80);
assert.equal(metrics.swarmops.queries.in_scope,108);
assert.equal(metrics.swarmops.verification.after_sse_fix_tests,351);
for(const row of retrieval){const actual=metrics.swarmops.strategies.find(s=>s.strategy===row.id);assert(Math.abs(row.recall-actual.recall_at_5*100)<.001);assert(Math.abs(row.mrr-actual.mrr)<.0001)}
const quantities=s=>s.match(/\d+(?:\.\d+)?/g);
assert.deepEqual(quantities(writingCases.scope.original),quantities(writingCases.scope.candidate));
assert.notDeepEqual(quantities(writingCases.numbers.original),quantities(writingCases.numbers.candidate));
const manifest=JSON.parse(await fs.readFile(path.join(root,'assets/asset-manifest.json'),'utf8'));
for(const asset of manifest){const bytes=await fs.readFile(path.join(root,asset.file));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),asset.sha256)}
async function scan(dir){for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await scan(file);else{assert(!/\.(pdf|db|sqlite3?|env)$/i.test(entry.name),`private file: ${entry.name}`);if(/\.(html|js|json|css|md)$/.test(entry.name)){const body=await fs.readFile(file,'utf8');assert(!/sk-[a-zA-Z0-9_-]{24,}|-----BEGIN .*PRIVATE KEY|DESKTOP-[A-Z0-9]{5,}/.test(body),`secret/host candidate: ${entry.name}`)}}}}
await scan(root);
process.stdout.write(`Static checks passed: ${pages.length} pages, ${links} local links, ${manifest.length} unchanged source images, metric scopes and demo facts.\n`);

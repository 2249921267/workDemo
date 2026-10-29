import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';

test('recruiter journey: product preview, case navigation and public evidence',async({page,request})=>{
  await page.goto('./');
  await expect(page.getByRole('heading',{level:1})).toContainText('有依据的 AI 产品');
  await page.getByRole('tab',{name:'SwarmOps',exact:true}).click();
  await expect(page.locator('.preview-titlebar')).toContainText('SwarmOps');
  await expect(page.locator('.preview-metrics')).toContainText('80.6%');
  await page.locator('.preview-metrics a').click();
  await expect(page).toHaveURL(/swarmops\.html$/);
  const snapshot=await (await request.get('assets/metrics.json')).json();
  expect(snapshot.swarmops.queries.in_scope).toBe(108);
  await page.goto('evidence.html');
  await expect(page.getByRole('heading',{level:1})).toContainText('实测记录');
  await expect(page.locator('#paperpilot')).toContainText('80 合成样例');
  await expect(page.locator('#swarmops')).toContainText('11/108');
});

test('public identity and metadata stay project-focused',async({page})=>{
  for(const file of ['index.html','paperpilot.html','swarmops.html','evidence.html']){
    await page.goto(file);
    await expect(page.locator('.identity strong')).toContainText('AI 产品作品集');
    const publicText=await page.locator('body').innerText();
    expect(publicText).not.toMatch(/大学|学院|硕士|本科|联系电话|电子邮箱/);
    expect(await page.title()).toContain('AI 产品作品集');
  }
  await page.goto('index.html');
  await expect(page.locator('#about h2')).toHaveText('产品设计方法');
  expect(await page.locator('meta[property="og:image"]').getAttribute('content')).toContain('portfolio-preview-anonymous.png');
});

test('PaperPilot: reversible decision, immutable quantities and insufficient evidence',async({page})=>{
  await page.goto('paperpilot.html#experience');
  const demo=page.locator('[data-writing-demo]');
  await demo.getByRole('button',{name:'检查这段表达'}).click();
  const original=await demo.locator('.revision-demo p').innerText();
  await demo.getByRole('button',{name:'采纳修改'}).click();
  await expect(demo.locator('.revision-demo p')).not.toHaveText(original);
  await expect(demo.locator('.revision-demo p')).toContainText('91.2%');
  await demo.getByRole('button',{name:'撤销采纳'}).click();
  await expect(demo.locator('.revision-demo p')).toHaveText(original);
  await demo.getByRole('tab',{name:'数值保护'}).click();
  await demo.getByRole('button',{name:'检查这段表达'}).click();
  await expect(demo.locator('.review-status')).toContainText('数值变化已拦截');
  await expect(demo.getByRole('button',{name:'采纳修改'})).toBeDisabled();
  await expect(demo.locator('.revision-demo p')).toContainText('18 ms');
  await demo.getByRole('tab',{name:'来源不足'}).click();
  await demo.getByRole('button',{name:'检查这段表达'}).click();
  await expect(demo.locator('.review-status')).toContainText('研究证据不足');
});

test('SwarmOps: offline suppression, acknowledgment and no-model branches',async({page})=>{
  await page.goto('swarmops.html#experience');
  const demo=page.locator('[data-ops-demo]');
  await demo.getByRole('button',{name:'查看诊断路径'}).click();
  await expect(demo.locator('.ops-report h4')).toHaveText('节点离线');
  await demo.getByRole('button',{name:'确认接手'}).click();
  await expect(demo.locator('.ack-row')).toContainText('异常仍待恢复');
  await expect(demo.locator('.ops-report h4')).toHaveText('节点离线');
  await demo.getByLabel('SwarmOps 演示场景').selectOption('degraded');
  await demo.getByRole('button',{name:'查看诊断路径'}).click();
  await expect(demo.locator('.ops-report h4')).toContainText('高延迟');
  await expect(demo.locator('.ops-report h4')).toContainText('高丢包');
  await demo.getByLabel('SwarmOps 演示场景').selectOption('invalid');
  await demo.getByRole('button',{name:'查看诊断路径'}).click();
  await expect(demo.locator('.ops-report')).toContainText('绕过模型');
  await expect(demo.locator('.ops-report')).toContainText('输入校验未通过');
});

test('retrieval replay and original Dify image are inspectable',async({page})=>{
  await page.goto('swarmops.html#evaluation');
  const explorer=page.locator('[data-retrieval-explorer]');
  await expect(explorer.locator('.strategy-number')).toContainText('80.6');
  await explorer.getByRole('tab',{name:'Dense'}).click();
  await expect(explorer.locator('.strategy-number')).toContainText('74.1');
  await explorer.getByRole('tab',{name:'RRF + 重排'}).click();
  await expect(explorer.locator('.strategy-number')).toContainText('81.5');
  await expect(explorer.locator('.rank-replay li').first()).toContainText('SOP-009');
  await expect(explorer.locator('.refusal-note')).toContainText('11/108');
  await page.getByRole('button',{name:'放大 Dify 完整工作流'}).click();
  await expect(page.locator('#image-dialog')).toBeVisible();
  await expect.poll(()=>page.locator('#viewer-image').evaluate(img=>img.naturalWidth)).toBe(6682);
  await page.getByLabel('图片缩放').fill('200');
  await expect(page.locator('#zoom-output')).toHaveText('200%');
  await page.keyboard.press('Escape');
  await expect(page.locator('#image-dialog')).not.toBeVisible();
});

test('all four pages: responsive layout, working assets and zero API calls',async({page})=>{
  const errors=[],bad=[],api=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)bad.push(r.url())});
  page.on('request',r=>{if(/\/api\/|api\.dify|dashscope/.test(r.url()))api.push(r.url())});
  await fs.mkdir('.local/screenshots',{recursive:true});
  for(const width of [1440,1280,768,390]){
    await page.setViewportSize({width,height:1000});
    for(const file of ['index.html','paperpilot.html','swarmops.html','evidence.html']){
      await page.goto(file);await expect(page.locator('#site-header .identity')).toBeVisible();
      await page.locator('#site-footer').scrollIntoViewIfNeeded();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${file} at ${width}`).toBeTruthy();
      await page.evaluate(()=>scrollTo(0,0));
      if(width===1440||width===390)await page.screenshot({path:`.local/screenshots/${file.replace('.html','')}-${width}.png`,fullPage:true,animations:'disabled'});
    }
  }
  expect(errors).toEqual([]);expect(bad).toEqual([]);expect(api).toEqual([]);
});

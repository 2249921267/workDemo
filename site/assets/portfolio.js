import {projects, retrieval, sopNames, writingCases, operations} from './examples.js';

const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>[...root.querySelectorAll(q)];
const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>';
const icon='<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M6 20 15 5l9 15M9 15h12M6 25h18"/><circle cx="15" cy="5" r="2"/></svg>';
const onCase = document.body.dataset.page !== 'home';
const base = onCase ? 'index.html' : '';

$('#site-header').innerHTML=`<a class="identity" href="index.html" aria-label="AI 产品作品集首页"><span class="identity-mark">${icon}</span><strong>AI 产品作品集<span>AI PRODUCT PORTFOLIO</span></strong></a><nav aria-label="主导航"><a href="${base}#work">精选项目</a><a href="${base}#experience">交互体验</a><a href="${base}#decisions">产品思考</a><a href="${base}#about">产品方法</a></nav><a class="nav-evidence" href="evidence.html">查看实测依据 ${arrow}</a><button class="menu-toggle" aria-label="展开导航" aria-expanded="false"><span></span><span></span></button>`;
$('#site-footer').innerHTML=`<div class="footer-main"><div><span class="eyebrow">FROM TASKS TO VALIDATED PRODUCTS.</span><h2>从具体任务出发，<br>把方案做成可验证的体验。</h2></div><a class="button dark" href="evidence.html">查看实测记录 ${arrow}</a></div><div class="footer-bottom"><span>AI 产品作品集</span><span>项目实践 · AI 辅助开发 · 2026</span><a href="evidence.html">指标口径与展示边界</a><a href="https://github.com/2249921267/workDemo" target="_blank" rel="noreferrer">作品集源码 ↗</a></div>`;
$('.menu-toggle').addEventListener('click',e=>{const expanded=e.currentTarget.getAttribute('aria-expanded')==='true';e.currentTarget.setAttribute('aria-expanded',String(!expanded));$('#site-header').classList.toggle('menu-open',!expanded)});
$$('#site-header nav a').forEach(a=>a.addEventListener('click',()=>{$('#site-header').classList.remove('menu-open');$('.menu-toggle').setAttribute('aria-expanded','false')}));

const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduce) {
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});
  $$('.reveal').forEach(el=>{el.classList.add('will-reveal');observer.observe(el)});
} else $$('.reveal').forEach(el=>el.classList.add('visible'));

function renderPreview(id){const p=projects[id];const root=$('#product-preview');if(!root)return;$$('[data-preview]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.preview===id)));root.innerHTML=`<div class="preview-titlebar"><span class="traffic"><i></i><i></i><i></i></span><span>${p.name} <b>${p.category}</b></span><small>实际产品截图 · 合成样例界面</small></div><button class="preview-image" data-view-image="${p.image}" data-caption="${p.name} 实际产品界面；界面数据为合成样例。" aria-label="放大 ${p.name} 产品截图"><img src="${p.image}" alt="${p.name} 实际产品界面" fetchpriority="high" width="1440" height="1000"><span class="zoom-hint">查看完整界面 ↗</span></button><div class="preview-metrics">${p.metrics.map(([v,l])=>`<div><strong>${v}</strong><span>${l}</span></div>`).join('')}<a href="${p.href}">查看产品案例 ${arrow}</a></div>`;}
$$('[data-preview]').forEach(b=>b.addEventListener('click',()=>renderPreview(b.dataset.preview)));
renderPreview('paperpilot');

if(!$('#image-dialog'))document.body.insertAdjacentHTML('beforeend',`<dialog id="image-dialog" class="image-dialog" aria-labelledby="viewer-caption"><div class="viewer-toolbar"><p id="viewer-caption"></p><label>缩放 <input id="viewer-zoom" type="range" min="100" max="300" step="25" value="100" aria-label="图片缩放"><output id="zoom-output">100%</output></label><a id="viewer-original" target="_blank" rel="noreferrer">打开原图 ↗</a><button id="viewer-close" aria-label="关闭图片">×</button></div><div class="viewer-scroll"><img id="viewer-image" alt="项目截图"></div></dialog>`);
const imageDialog=$('#image-dialog');
imageDialog?.setAttribute('aria-labelledby','viewer-caption');
let previousFocus=null;
document.addEventListener('click',e=>{
  const target=e.target.closest('[data-view-image]');
  if(!target)return;
  previousFocus=target;
  const image=$('#viewer-image'); image.src=target.dataset.viewImage;image.alt=target.dataset.caption || '项目截图';
  $('#viewer-caption').textContent=target.dataset.caption || '项目截图';
  $('#viewer-original').href=target.dataset.viewImage;
  $('#viewer-zoom').value='100';$('#zoom-output').textContent='100%';image.style.width='100%';
  imageDialog.showModal();document.body.classList.add('dialog-open');
});
if(imageDialog){
  $('#viewer-close').addEventListener('click',()=>imageDialog.close());
  imageDialog.addEventListener('click',e=>{if(e.target===imageDialog)imageDialog.close()});
  imageDialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');previousFocus?.focus()});
  $('#viewer-zoom').addEventListener('input',e=>{$('#viewer-image').style.width=e.target.value+'%';$('#zoom-output').textContent=e.target.value+'%'});
}

export function initWriting(root){
  if(!root)return;
  let active='scope',checked=false,accepted=false;
  function draw(){const c=writingCases[active];root.innerHTML=`<div class="demo-toolbar"><div class="demo-label"><span></span>预设合成样例 · 浏览器交互演示</div><div class="small-tabs" role="tablist" aria-label="写作演示案例">${Object.entries(writingCases).map(([id,v])=>`<button role="tab" aria-selected="${id===active}" data-writing-case="${id}">${v.label}</button>`).join('')}</div></div><div class="writing-surface"><div class="writing-heading"><span class="app-icon paper-icon">P</span><div><h3>一次有依据的修改</h3><p>修改权在作者，范例和证据各有用途。</p></div><span class="soft-tag">CVM EDITION</span></div><div class="writing-columns"><section><span class="field-label">原始段落</span><p class="academic-text">${c.original}</p><div class="original-foot">数字、公式、引用标记均需保留</div></section><section class="proposal-column"><span class="field-label">${checked?'审阅建议':'等待预检'}</span>${checked?`<div class="review-status ${c.kind}">${c.kind==='blocked'?'数值变化已拦截':c.kind==='insufficient'?'研究证据不足':'可审阅的修改'}</div><p class="academic-text">${c.kind==='blocked'?c.original:c.candidate}</p><p class="proposal-reason">${c.reason}</p>`:`<div class="demo-idle"><span class="idle-orbit">✦</span><p>体验事实校验与人工审阅，<br>无需调用模型。</p></div>`}</section></div><div class="demo-action-row"><span>${checked?(accepted?'已采纳 · 修订稿已更新':'预检完成 · 等待人工决定'):'示例内容预先定义，未运行真实模型'}</span>${!checked?'<button class="button blue" data-writing-check>检查这段表达 <span>↗</span></button>':`<button class="button ${accepted?'subtle':'blue'}" data-writing-accept ${c.kind!=='valid'?'disabled':''}>${accepted?'撤销采纳':'采纳修改'}</button>`}</div>${checked?`<details class="evidence-drawer"><summary>查看依据与边界 <span>＋</span></summary><div><span class="field-label">${c.sources.length?'研究证据 · CC0 合成文献':'需人工复核'}</span><p>${c.evidence}</p>${c.sources.map(s=>`<small>${s}</small>`).join('')}${active==='numbers'?'<small>候选修改曾试图将 91.2% / 18 ms 改为 96.2% / 12 ms；不可采纳。</small>':''}<p class="evidence-note">CVM 范例用于组织表达，研究证据用于核查主张。</p></div></details><div class="revision-demo" aria-live="polite"><span class="field-label">当前修订稿</span><p>${accepted?c.candidate:c.original}</p></div>`:''}</div>`;
    $$('[data-writing-case]',root).forEach(b=>b.addEventListener('click',()=>{active=b.dataset.writingCase;checked=false;accepted=false;draw();$(`[data-writing-case="${active}"]`,root).focus()}));
    $('[data-writing-check]',root)?.addEventListener('click',()=>{checked=true;draw();$('.review-status',root)?.scrollIntoView({block:'nearest',behavior:reduce?'instant':'smooth'})});
    $('[data-writing-accept]',root)?.addEventListener('click',()=>{accepted=!accepted;draw();$('[data-writing-accept]',root).focus()});
  }draw();
}

export function initOps(root){
  if(!root)return;
  let scenario='offline',node='UAV-04',diagnosed=false,acknowledged=false;
  function draw(){const s=operations[scenario];const fault=scenario==='offline'||scenario==='degraded';const values=node==='UAV-04'?s:{heartbeat:2,rtt:28,loss:1,routes:0};
    root.innerHTML=`<div class="demo-toolbar"><div class="demo-label"><span></span>合成遥测 · 本地规则演示</div><label class="scenario-picker">切换场景<select aria-label="SwarmOps 演示场景">${Object.entries(operations).map(([id,v])=>`<option value="${id}" ${id===scenario?'selected':''}>${v.name}</option>`).join('')}</select></label></div><div class="ops-surface"><div class="writing-heading"><span class="app-icon swarm-icon">S</span><div><h3>先理解状态，再决定行动。</h3><p>点击节点查看指标，切换场景体验告警边界。</p></div><span class="soft-tag ${fault?'amber':''}">${fault?'网络需关注':scenario==='invalid'?'输入无效':'网络平稳'}</span></div><div class="ops-grid"><div class="topology" aria-label="合成集群拓扑"><svg class="topology-links" viewBox="0 0 480 260" aria-hidden="true"><path d="M84 132 220 53 384 99 319 219 84 132M220 53 319 219M84 132 178 213 384 99" class="${fault?'fault-link':''}"/></svg>${[['GCS',17,48],['UAV-01',46,20],['UAV-02',80,37],['UAV-03',37,79],['UAV-04',67,81]].map(([id,x,y])=>`<button class="topology-node ${id===node?'selected':''} ${id==='UAV-04'&&fault?'node-fault':''}" style="--x:${x}%;--y:${y}%" data-node="${id}" aria-pressed="${id===node}"><span>${id==='GCS'?'⌂':'⌁'}</span><b>${id}</b><small>${id==='UAV-04'&&fault?(scenario==='offline'?'离线':'链路退化'):'在线'}</small></button>`).join('')}</div><section class="node-details"><span class="field-label">节点详情</span><h4>${node}</h4><dl><div><dt>心跳间隔</dt><dd>${values.heartbeat??'—'}<small> s</small></dd></div><div><dt>RTT</dt><dd>${values.rtt??'—'}<small> ms</small></dd></div><div><dt>丢包率</dt><dd>${values.loss??'—'}<small> %</small></dd></div><div><dt>路由变化</dt><dd>${values.routes??'—'}<small> 次 / 窗口</small></dd></div></dl></section></div><div class="ops-context"><span class="context-dot ${fault?'warning':''}"></span><p>${s.note}</p></div><div class="demo-action-row"><span>示例阈值：心跳 10 s · RTT 150 ms · 丢包 10%</span><button class="button blue" data-ops-run>查看诊断路径 ${arrow}</button></div>${diagnosed?`<div class="ops-report" aria-live="polite"><div class="report-title"><span class="field-label">${s.branch==='anomaly'?'异常分支 · RAG + 模型辅助':s.branch==='invalid'?'无效分支 · 直接返回':'正常分支 · 规则报告'}</span><span class="soft-tag">${s.branch==='anomaly'?'流程回放':'绕过模型'}</span></div><h4>${s.find.length?s.find.join(' / '):'未发现阈值异常'}</h4><p>${s.branch==='anomaly'?(scenario==='offline'?'优先核验节点供电、网络连接和日志。失联是已观察的症状，供电或射频问题仅是待确认假设。':'先查看链路质量与路由变化，结合 SOP 安排排查。结合链路指标和时间窗口核查候选原因。'):s.note}</p>${s.branch==='anomaly'?`<details class="ops-evidence"><summary>依据：SOP-${scenario==='offline'?'001':'002'} · 原创教学知识</summary><p>${scenario==='offline'?'先确认节点是否仍供电与运行，再核查本地链路状态、地址配置和近期日志；不要把心跳失联直接等同于某个物理根因。':'对照 RTT、丢包和路由变化发生的时间窗口；区分链路退化与节点失联，逐步验证候选原因。'}</p></details><div class="ack-row"><span>${acknowledged?'已确认接手 · 异常仍待恢复':'待人工确认与排查'}</span><button class="button subtle" data-ops-ack>${acknowledged?'撤销确认':'确认接手'}</button></div>`:'<p class="evidence-note">联调记录中，正常与无效输入成功样例均为 0 tokens；此处展示预设流程。</p>'}</div>`:''}</div>`;
    $('select',root).addEventListener('change',e=>{scenario=e.target.value;diagnosed=false;acknowledged=false;node='UAV-04';draw()});
    $$('[data-node]',root).forEach(b=>b.addEventListener('click',()=>{node=b.dataset.node;draw();$(`[data-node="${node}"]`,root).focus()}));
    $('[data-ops-run]',root).addEventListener('click',()=>{diagnosed=true;draw();$('.ops-report',root)?.scrollIntoView({block:'nearest',behavior:reduce?'instant':'smooth'})});
    $('[data-ops-ack]',root)?.addEventListener('click',()=>{acknowledged=!acknowledged;draw();$('[data-ops-ack]',root).focus()});
  }draw();
}

$$('[data-writing-demo]').forEach(initWriting);$$('[data-ops-demo]').forEach(initOps);
$$('[data-demo-switch]').forEach(button=>button.addEventListener('click',()=>{const selected=button.dataset.demoSwitch;$$('[data-demo-switch]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.demoSwitch===selected)));$$('[data-demo-panel]').forEach(p=>p.hidden=p.dataset.demoPanel!==selected)}));

$$('[data-retrieval-explorer]').forEach(root=>{
  let active='hybrid';
  function draw(){const s=retrieval.find(v=>v.id===active);root.innerHTML=`<div class="demo-toolbar"><div class="demo-label"><span></span>冻结评测快照 · 非在线检索</div><span class="small-muted">108 条范围内测试 · 文档级 Top-5</span></div><div class="retrieval-explorer"><div class="strategy-controls" role="tablist" aria-label="检索策略">${retrieval.map(v=>`<button role="tab" aria-selected="${v.id===active}" data-strategy="${v.id}"><b>${v.name}</b><small>${v.short}</small></button>`).join('')}</div><div class="strategy-summary"><div class="strategy-number"><span>Recall@5</span><strong>${s.recall.toFixed(1)}<em>%</em></strong></div><div><span>MRR</span><strong>${s.mrr.toFixed(3)}</strong></div><div><span>暖模型 P95</span><strong>${s.p95.toFixed(2)}<em> ms</em></strong></div></div><p class="strategy-description">${s.description}</p><div class="rank-replay"><span class="field-label">冻结单例回放 · Q-009-2</span><h4>套隧道之后大报文不通，如何检查路径 MTU？</h4><ol>${s.ranks.map((id,i)=>`<li class="${id==='009'?'rank-gold':''}"><span>${i+1}</span><b>SOP-${id}</b><p>${sopNames[id]}</p>${id==='009'?'<small>目标文档</small>':''}</li>`).join('')}</ol><p class="evidence-note">切换展示已保存的同一查询结果；该冻结单例耗时 ${s.sampleMs.toFixed(3)} ms；整体指标见上方测试结果。</p></div><div class="refusal-note"><strong>10.2%</strong><div><b>范围内误拒答，仍需改进。</b><p>11/108 条范围内查询被拒答。拒答边界与漏答成本一起评估。</p></div></div></div>`;
    $$('[data-strategy]',root).forEach(b=>b.addEventListener('click',()=>{active=b.dataset.strategy;draw();$(`[data-strategy="${active}"]`,root).focus()}));
  }draw();
});

const decisions={
  evidence:{number:'01',title:'范例归范例，证据归证据。',text:'CVM 范例提供论证组织参考，项目证据支撑研究主张。两类来源分别进入模型上下文，研究证据 ID 单独校验。',reason:'来源、修改理由与作者决定共同构成审阅依据。',project:'PaperPilot · RAG 边界',href:'paperpilot.html#decisions'},
  routing:{number:'02',title:'让模型出现在需要它的地方。',text:'正常网络直接返回规则报告，无效输入直接拒绝。只有异常分支进入检索和模型分析，同时保留人工核查的责任边界。',reason:'真实联调中，正常与无效输入成功样例均为 0 tokens。',project:'SwarmOps · Workflow 分流',href:'swarmops.html#workflow'},
  evaluation:{number:'03',title:'默认策略，由开发集决定。',text:'冻结测试中，特征重排的 Recall@5 略高于默认 RRF。保留实验结果，同时保持开发集确定的默认策略，避免测试集反向参与选择。',reason:'先定义评价方式，再比较结果，结合命中率和误拒答确定迭代重点。',project:'SwarmOps · 评测决策',href:'swarmops.html#evaluation'}
};
const decisionRoot=$('#decision-detail');
function drawDecision(id){if(!decisionRoot)return;const d=decisions[id];$$('[data-decision]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.decision===id)));decisionRoot.innerHTML=`<span class="decision-number">${d.number}</span><span class="eyebrow">${d.project}</span><h3>${d.title}</h3><p>${d.text}</p><div class="decision-reason">${d.reason}</div><a class="text-link" href="${d.href}">查看方案与依据 ${arrow}</a>`;}
$$('[data-decision]').forEach(b=>b.addEventListener('click',()=>drawDecision(b.dataset.decision)));drawDecision('evidence');

// Project navigation marks the visible chapter without intercepting native anchor behavior.
if('IntersectionObserver' in window && $('.case-chapters')){
  const chapterObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){$$('.case-chapters a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}}),{rootMargin:'-20% 0px -60% 0px'});
  $$('main section[id]').forEach(s=>chapterObserver.observe(s));
}

document.addEventListener('keydown',e=>{
  const tab=e.target.closest('[role="tab"]');
  if(!tab || !['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
  const tabs=$$('[role="tab"]',tab.closest('[role="tablist"]'));
  let i=tabs.indexOf(tab);
  i=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  e.preventDefault();tabs[i].focus();tabs[i].click();
});

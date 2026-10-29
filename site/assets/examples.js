export const projects = {
  paperpilot: {
    name: 'PaperPilot', category: '科研写作 · CVM 投稿', version: '3.0',
    headline: '让研究表达，\n有据可循。',
    summary: '围绕 CVM 投稿，把写作范例、研究证据、修改审阅与投稿检查组织到同一个工作空间。',
    image: 'assets/images/paperpilot-workspace.png',
    metrics: [['23', '篇论文范例'], ['2,076', '个正文块'], ['0.988', '合成预检 F1']],
    href: 'paperpilot.html'
  },
  swarmops: {
    name: 'SwarmOps', category: '集群运维 · 证据诊断', version: '2.0 + SSE',
    headline: '看见异常，\n也看见依据。',
    summary: '把分散的网络状态转为可排查的事件，通过规则分流、混合检索与 Dify Workflow 提供有来源的诊断建议。',
    image: 'assets/images/swarmops-overview.png',
    metrics: [['36', '份原创教学 SOP'], ['80.6%', '冻结测试 Recall@5'], ['351', '项本地回归通过']],
    href: 'swarmops.html'
  }
};

export const retrieval = [
  {id:'bm25', name:'BM25', short:'关键词', recall:80.5556, mrr:.6647, p95:6.75, ranks:['009','012','016','011','002'], sampleMs:5.706, description:'直接匹配术语与故障词，采用本地词项索引。'},
  {id:'dense', name:'Dense', short:'语义向量', recall:74.0741, mrr:.5360, p95:8.85, ranks:['009','028','012','025','035'], sampleMs:7.968, description:'本地 BGE 中文模型产生 512 维向量，按语义相似度检索。'},
  {id:'hybrid', name:'RRF', short:'默认混合', recall:80.5556, mrr:.6670, p95:10.58, ranks:['009','012','035','015','014'], sampleMs:9.920, description:'融合关键词与向量的排名。默认策略在开发集确定，测试后保持不变。'},
  {id:'hybrid_rerank', name:'RRF + 重排', short:'特征重排', recall:81.4815, mrr:.6707, p95:10.76, ranks:['009','012','035','014','015'], sampleMs:10.556, description:'对 RRF 加入向量相似度与标题/章节覆盖特征，进行加权重排。'}
];

export const sopNames = {'001':'节点离线与心跳排查','002':'链路延迟与丢包排查','009':'路径 MTU 与隧道封装','012':'链路吞吐与带宽瓶颈','016':'组播与广播边界','011':'网络接口与驱动','028':'端到端连通性检查','025':'地址与子网规划','035':'链路证据与复核','015':'协议端口与业务连通','014':'路由路径与转发检查'};

export const writingCases = {
  scope: {
    label:'结论范围', original:'Our method always outperforms all alternatives. Accuracy was 91.2% on the synthetic benchmark [1].',
    candidate:'Our method achieved 91.2% accuracy on the synthetic benchmark [1]. Comparisons were limited to the evaluated baselines.',
    reason:'把结论范围收敛到已测基准，保留数值与引文标记。',
    evidence:'The comparison was limited to two baseline methods on one dataset. These observations do not demonstrate universal superiority.',
    sources:['synthetic-reference.pdf · 物理第 1 页'], kind:'valid'
  },
  numbers: {
    label:'数值保护', original:'The accuracy was 91.2%, with an inference time of 18 ms [2].',
    candidate:'The accuracy was 96.2%, with an inference time of 12 ms [2].',
    reason:'候选文本改变了实验数值。系统拦截这条修改，保留原文供作者复核。',
    evidence:'发现数字变化时拦截修改，并保留原文供复核。',
    sources:[], kind:'blocked'
  },
  source: {
    label:'来源不足', original:'The approach generalizes to all unseen environments [3].',
    candidate:'The approach generalizes to all unseen environments [3].',
    reason:'当前研究证据不足。保留原句，并提示补充泛化验证。',
    evidence:'此项研究主张需要补充实验或支持文献，写作范例用于参考组织方式。',
    sources:[], kind:'insufficient'
  }
};

export const operations = {
  normal:{name:'正常网络', heartbeat:2,rtt:28,loss:1,routes:0, find:[], branch:'normal', note:'指标在阈值内，规则返回正常报告。此分支绕过模型。'},
  offline:{name:'节点离线',heartbeat:24,rtt:0,loss:100,routes:0,find:['节点离线'],branch:'anomaly',note:'离线时 RTT 0 / 丢包 100% 是不可测占位，不再叠加独立链路告警。'},
  degraded:{name:'链路退化',heartbeat:2,rtt:210,loss:19,routes:8,find:['高延迟','高丢包','路由波动'],branch:'anomaly',note:'心跳已恢复，链路指标仍异常。确认接手后，事件继续等待指标恢复。'},
  recovered:{name:'指标恢复',heartbeat:2,rtt:31,loss:1,routes:0,find:[],branch:'normal',note:'指标恢复后才可归档；人工确认记录接手状态，指标恢复后完成归档。'},
  invalid:{name:'无效输入',heartbeat:null,rtt:null,loss:null,routes:null,find:['输入校验未通过'],branch:'invalid',note:'输入不满足协议，直接返回校验提示；不做检索和模型调用。'}
};

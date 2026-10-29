# 展示与维护说明

## 面向 AI 产品经理的内容结构

首页帮助招聘方快速理解定位与两个项目的差异，交互区展示产品的控制边界。
案例页分别提供用户任务、流程、RAG/Workflow 方案、实测条件和后续迭代。
实测依据页与筛选后的 JSON 使外部访客不必拥有源项目仓库权限，也能阅读指标口径。

角色描述聚焦产品实践与 AI 辅助工程实现，展示任务拆解、方案与验证。
页面采用项目品牌与产品方法介绍。公开内容聚焦产品方案、交互和实测结果。

## 指标来源

PaperPilot：源项目 `docs/CVM_METRICS.json`、`CVM_EVALUATION.md`、`CVM_RELEASE_CHECKLIST.md`；
v3.0.0。96 后端测试、本机 10 浏览器通过与 3 付费跳过，和 CI 的 7 公开浏览器场景分开描述。

SwarmOps：源项目 `evaluation/results/v2/retrieval-test.json`、`docs/v2-release-facts.json`、
`docs/V2_EVALUATION.md`，以及其后 `LIVE_V2_VALIDATION.md` / `live-v2-regression.xml`。
342 为发布基线，351 为后续 SSE 回归。主检索指标以冻结 JSON 为准，未使用另一轮 experiments.png 中不同的成绩。

公开 JSON 删除了机器 hostname、本地服务地址、Cloud 运行标识和其他与展示无关的字段。
源工程保持只读，未复制 .env、数据库、私有草稿或论文原文。作品集采用纯静态页面与浏览器交互。

## 演示的范围

写作演示为预设 CC0 合成段落，解释数字保护、证据不足及可逆审阅，不模仿在线模型响应。
运维演示使用预设合成遥测，呈现规则路径与处置状态。
检索策略展示为 Q-009-2 的真实冻结结果回放，不执行在线向量检索。
Dify 截图证明画布结构，单次 API/SSE 记录证明特定联调，不承担批量质量或模型版本证明。

## 前端与发布

原生静态站点，四个入口：index、paperpilot、swarmops、evidence。
资产使用相对路径，支持 `/workDemo/` 子路径。关键数字与安全展示范围由 `scripts/check.mjs` 验证，
浏览器回归覆盖读者路径、交互、图片、移动布局和零 API 调用。
GitHub Pages 只发布 site/；README 为仓库直接访客提供入口。

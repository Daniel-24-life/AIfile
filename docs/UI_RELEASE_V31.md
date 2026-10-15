# 四项界面更新 · v3.1

2026-10-15。面向招聘者和技术合作者，保留“体验 → 架构 → 源码 → 验证”的阅读路径。本轮不新增在线托管；所有界面按对应仓库 README 在本地运行。

| 项目 | 本轮变化 | 验证入口 |
| --- | --- | --- |
| [航序](https://github.com/Daniel-24-life/logistics-workbench) | 异常队列优先；事实、缺口、建议与审核；键盘焦点管理 | [UI QA](https://github.com/Daniel-24-life/logistics-workbench/blob/main/docs/UI_QA.md) |
| [买家研究](https://github.com/Daniel-24-life/buyer-research-agent) | 分类与选中证据优先；连接失败、旧状态及重试 | [UI QA](https://github.com/Daniel-24-life/buyer-research-agent/blob/main/docs/UI_QA.md) |
| [BTC 治理](https://github.com/Daniel-24-life/btc-agent-governance) | 四场景历史合成记录查看器；未运行与阻断分别呈现 | [UI QA](https://github.com/Daniel-24-life/btc-agent-governance/blob/main/docs/UI_QA.md) |
| [AgentPlatform](https://github.com/Daniel-24-life/agentplatform-case-study) | 只读案例页；停止结论、试点位置、工程取舍与源码导航 | [UI QA](https://github.com/Daniel-24-life/agentplatform-case-study/blob/main/docs/UI_QA.md) |

## 验证记录

- pass：四项页面在 320、375、768、1440 CSS px 下无页面横向溢出；200% 全元素文字放大与文字间距覆盖。
- pass：实际浏览器中检查代表性文字的计算前景/背景色；不等同于全页面无障碍审计。
- pass：航序审核、重复阻断、角色边界、过期证据和任务关闭；买家筛选、证据、队列、取消导出及失败恢复；BTC 四场景原始 JSON；AgentPlatform 导航与源码链接。
- pass：三个演示仓库分别从干净本地克隆启动；航序 5 项、买家 19 项、BTC 28 项测试通过。
- pass：AgentPlatform 新增案例页的 4 项定向测试；执行内核未修改，不改变历史验收结果。
- not tested：Safari、屏幕阅读器、真实业务接入、真实模型或交易执行。只检查现有支持的界面主题，不宣称完整 WCAG 合规。

本地浏览器复核脚本为 [browser-qa-v31.cjs](../scripts/browser-qa-v31.cjs)。复用现有 Playwright 环境，分别启动四个 README 所述服务后运行；脚本输出在忽略的 `tmp/ui-v31/`。代码不携带个人浏览器资料。

## 公开边界

截图仅显示公开合成数据或已公开的合成夹具。买家输入只在本地浏览器会话中保留；没有真实外联或订单。BTC 仅查看记录，所有场景执行权限为 false。AgentPlatform 仍已停止，不恢复产品开发。本轮不新增或替换许可证。

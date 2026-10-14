const exceptions = [
  {
    id: "EX-1042", container: "TLLU 4829017", bill: "BL-7A49K", customer: "Northstar Home",
    type: "LFD 临期 / 未预约", risk: "high", riskLabel: "高风险", status: "待审核", owner: "未分配",
    deadline: "剩余 09:42", deadlineHours: 9.7, impact: "$1,280", freshness: "2 分钟前", stale: false,
    port: "Newark, NJ", destination: "Edison DC", eta: "09-28 14:30", lfd: "09-29 17:00",
    facts: [
      ["柜已落地，码头状态为 Available", "Terminal feed · 2分钟前"],
      ["船司 Release 已确认", "Carrier EDI · 18分钟前"],
      ["当前没有有效码头预约", "Appointment API · 2分钟前"],
      ["尚未分配司机和底盘", "Internal TMS · 4分钟前"]
    ],
    missing: ["司机可用性尚未确认", "明日 14:00 后仓库时间窗待确认"],
    timeline: [
      ["09-28 09:12", "柜状态更新为 Available", "码头数据通道"],
      ["09-28 08:56", "船司 Release 确认", "Carrier EDI"],
      ["09-27 22:18", "集装箱完成卸船", "Terminal feed"],
      ["09-27 16:40", "船舶到港", "AIS / Carrier"]
    ],
    aiSummary: "该柜已具备提取条件，但距离 LFD 不足 10 小时仍无有效预约和司机。若未在今日 13:00 前锁定预约，预计产生首日滞箱费用。",
    recommendations: ["立即查询今日 14:00—18:00 的码头预约余量", "同步确认司机与底盘可用性，优先匹配距 Newark 40 英里内运力", "若 13:00 前仍未获得预约，升级运营经理并向客户发送风险说明草稿"],
    confidence: 87
  },
  {
    id: "EX-1041", container: "MSCU 7391842", bill: "BL-8Q22M", customer: "Atlas Commerce",
    type: "海关 Hold", risk: "high", riskLabel: "高风险", status: "处理中", owner: "周宁",
    deadline: "剩余 16:20", deadlineHours: 16.3, impact: "$960", freshness: "12 分钟前", stale: false,
    port: "Savannah, GA", destination: "Pooler WH", eta: "09-29 09:00", lfd: "09-30 17:00",
    facts: [["码头显示 Customs Hold", "Terminal feed · 12分钟前"], ["查验文件已提交", "Document center · 41分钟前"]],
    missing: ["海关放行预计时间未知"], timeline: [["09-28 08:30", "文件补充完成", "Internal"], ["09-27 19:05", "Customs Hold", "Terminal"]],
    aiSummary: "当前阻碍为海关 Hold，码头预约和派车应暂缓。建议优先确认查验状态，并设置 2 小时后复核。",
    recommendations: ["联系报关代理确认查验进度", "暂停创建码头预约", "在客户视图显示‘监管查验处理中’"], confidence: 81
  },
  {
    id: "EX-1039", container: "CMAU 2187440", bill: "BL-2D18S", customer: "BrightPeak Retail",
    type: "预约冲突", risk: "medium", riskLabel: "中风险", status: "待处理", owner: "陈楠",
    deadline: "剩余 21:10", deadlineHours: 21.2, impact: "$420", freshness: "36 分钟前", stale: true,
    port: "Los Angeles, CA", destination: "Ontario DC", eta: "09-29 16:00", lfd: "10-01 17:00",
    facts: [["码头预约 09:00—09:30", "Appointment API"], ["仓库接收窗口 08:30—09:30", "Warehouse portal"]],
    missing: ["预计闸口等待时间未更新"], timeline: [["09-28 07:45", "仓库窗口调整", "Warehouse"], ["09-27 20:10", "预约确认", "Terminal"]],
    aiSummary: "码头与仓库时间窗存在执行冲突，当前路线无法在 SLA 内完成。",
    recommendations: ["申请将仓库窗口延后至 11:00", "保留码头预约，避免重新排队", "若仓库拒绝则重新预约次日第一时段"], confidence: 76
  },
  {
    id: "EX-1037", container: "OOLU 5501893", bill: "BL-5L77T", customer: "Harbor & Pine",
    type: "POD 缺失", risk: "medium", riskLabel: "中风险", status: "待补证", owner: "李舟",
    deadline: "剩余 1天 04时", deadlineHours: 28, impact: "$180", freshness: "9 分钟前", stale: false,
    port: "Houston, TX", destination: "Katy DC", eta: "已送达", lfd: "已完成",
    facts: [["司机状态为 Delivered", "Driver App"], ["仓库已签收", "Warehouse portal"]],
    missing: ["签字 POD 未上传", "等待费照片证据缺失"], timeline: [["09-27 17:42", "仓库签收", "Warehouse"], ["09-27 17:18", "司机标记送达", "Driver App"]],
    aiSummary: "业务节点已完成，但结算证据不完整。若未补齐 POD，财务无法核验附加费。",
    recommendations: ["向司机发送 POD 补传任务", "暂缓开票", "证据补齐后自动通知财务复核"], confidence: 93
  },
  {
    id: "EX-1035", container: "SEGU 6182034", bill: "BL-9P14C", customer: "Morrow Supply",
    type: "数据源冲突", risk: "low", riskLabel: "低风险", status: "观察中", owner: "周宁",
    deadline: "剩余 2天", deadlineHours: 48, impact: "待评估", freshness: "1 小时前", stale: true,
    port: "Norfolk, VA", destination: "Chesapeake WH", eta: "09-30 11:00", lfd: "10-02 17:00",
    facts: [["船司显示 Discharged", "Carrier EDI"], ["码头仍显示 On vessel", "Terminal feed"]],
    missing: ["权威状态待二次确认"], timeline: [["09-28 06:10", "状态冲突被识别", "Rule engine"]],
    aiSummary: "两个数据源对卸船状态存在冲突，不建议创建执行任务。",
    recommendations: ["等待下一次码头数据更新", "2 小时后仍冲突则人工核验"], confidence: 54
  },
  {
    id: "EX-1032", container: "TRHU 3308451", bill: "BL-3W61B", customer: "Luma Living",
    type: "空柜待还", risk: "low", riskLabel: "低风险", status: "已指派", owner: "陈楠",
    deadline: "剩余 3天", deadlineHours: 72, impact: "$0", freshness: "6 分钟前", stale: false,
    port: "Long Beach, CA", destination: "Carson Depot", eta: "已卸货", lfd: "已完成",
    facts: [["仓库卸货完成", "Warehouse portal"], ["空柜还箱点已确认", "Carrier EDI"]],
    missing: [], timeline: [["09-28 08:50", "还箱任务已指派", "Internal TMS"]],
    aiSummary: "空柜还箱任务已创建，当前无费用风险。",
    recommendations: ["保持任务跟踪", "完成后上传闸口回执"], confidence: 96
  }
];

let tasks = [
  { id: "TK-208", title: "确认 Customs Hold 查验进度", container: "MSCU 7391842", owner: "周宁", due: "今天 12:00", status: "doing", priority: "high", dependency: "报关代理回复", evidence: "查验状态截图" },
  { id: "TK-205", title: "协调仓库接收窗口", container: "CMAU 2187440", owner: "陈楠", due: "今天 14:30", status: "todo", priority: "medium", dependency: "仓库确认", evidence: "新时间窗确认" },
  { id: "TK-199", title: "补传签字 POD", container: "OOLU 5501893", owner: "李舟", due: "今天 17:00", status: "blocked", priority: "medium", dependency: "司机上传", evidence: "签字 POD" }
];

const roles = {
  operator: { label: "物流操作", name: "林序", canApprove: true, canExecute: false, view: "internal" },
  dispatcher: { label: "调度人员", name: "陈楠", canApprove: false, canExecute: true, view: "internal" },
  service: { label: "客服人员", name: "李舟", canApprove: false, canExecute: false, view: "internal" },
  manager: { label: "运营经理", name: "周宁", canApprove: true, canExecute: true, view: "internal" },
  customer: { label: "客户用户", name: "客户访客", canApprove: false, canExecute: false, view: "external" }
};

const lifecycleSteps = ["新发现", "待确认", "待审核", "已创建任务", "处理中", "待验证", "已关闭"];
const auditLog = [
  { time: "09:12", actor: "规则引擎", action: "识别 LFD 临期且未预约，创建高风险异常" },
  { time: "09:14", actor: "AI Copilot", action: "生成处置建议，置信度 87%" },
  { time: "09:16", actor: "林序", action: "打开异常并核对数据来源" }
];

const dataSources = [
  { id:"terminal", name:"码头事件流", type:"Terminal API", status:"ok", statusLabel:"正常", sync:"2 分钟前", latency:"1.8s", quality:"98.6%", icon:"T" },
  { id:"carrier", name:"船司 EDI", type:"Carrier EDI 315/322", status:"ok", statusLabel:"正常", sync:"18 分钟前", latency:"4.2s", quality:"96.9%", icon:"C" },
  { id:"appointment", name:"码头预约", type:"Appointment API", status:"warn", statusLabel:"延迟", sync:"36 分钟前", latency:"18.4s", quality:"92.1%", icon:"A" },
  { id:"tms", name:"内部 TMS", type:"REST / Webhook", status:"ok", statusLabel:"正常", sync:"4 分钟前", latency:"0.9s", quality:"99.2%", icon:"M" },
  { id:"warehouse", name:"仓库门户", type:"Portal / Email", status:"warn", statusLabel:"需核验", sync:"1 小时前", latency:"—", quality:"88.4%", icon:"W" },
  { id:"documents", name:"文件中心", type:"SFTP / Upload", status:"ok", statusLabel:"正常", sync:"9 分钟前", latency:"2.6s", quality:"97.5%", icon:"D" }
];

const mappingIssues = [
  { source:"Carrier EDI", field:"container_status", raw:"DISCHARGED", normalized:"AVAILABLE", rule:"状态映射 v2.3", result:"待码头复核" },
  { source:"Warehouse", field:"appointment_time", raw:"09/29 2PM EST", normalized:"2026-09-29 14:00 -04:00", rule:"时区标准化", result:"已转换" },
  { source:"Terminal API", field:"container_no", raw:"TLLU4829017", normalized:"TLLU 4829017", rule:"柜号格式化", result:"已转换" }
];

const initialExceptions = JSON.parse(JSON.stringify(exceptions));
const initialTasks = JSON.parse(JSON.stringify(tasks));

let currentView = "exceptions";
let activeException = null;
let toastTimer = null;
let activeQuickView = "all";
let tableDensity = "comfortable";
let currentRole = "operator";

const root = document.getElementById("viewRoot");
const breadcrumb = document.getElementById("breadcrumb");
const detailSheet = document.getElementById("detailSheet");
const sheetBackdrop = document.getElementById("sheetBackdrop");
const modalBackdrop = document.getElementById("modalBackdrop");
const editModal = document.getElementById("editModal");

function esc(value) {
  return String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function riskTag(item) {
  return `<span class="tag ${item.risk}">${esc(item.riskLabel)}</span>`;
}

function statusTag(status) {
  const type = status === "已关闭" || status === "已完成" ? "low" : status === "处理中" || status === "执行中" ? "info" : status === "阻塞" ? "high" : "neutral";
  return `<span class="tag ${type}">${esc(status)}</span>`;
}

function updateNavCounts() {
  document.getElementById("navRiskCount").textContent = exceptions.filter(x => x.risk === "high" && x.status !== "已关闭").length;
  document.getElementById("navTaskCount").textContent = tasks.filter(x => x.status !== "done").length;
}

function role() {
  return roles[currentRole];
}

function logAudit(actor, action) {
  const now = new Date();
  auditLog.unshift({ time: `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`, actor, action });
}

function lifecycleIndex(status) {
  const map = { "待处理":1, "观察中":1, "待补证":1, "待审核":2, "待人工复核":2, "已指派":3, "已创建任务":3, "处理中":4, "待验证":5, "已关闭":6 };
  return map[status] ?? 0;
}

function setView(view) {
  if (role().view === "external" && view !== "customer") {
    showToast("客户用户仅可访问对外状态视图");
    view = "customer";
  }
  currentView = view;
  document.querySelectorAll(".nav-item").forEach(button => {
    const active = button.dataset.view === view;
    button.classList.toggle("active", active);
    active ? button.setAttribute("aria-current", "page") : button.removeAttribute("aria-current");
  });
  const labels = { exceptions: "运营工作台 / 异常中心", tasks: "运营工作台 / 调度任务", containers: "运营工作台 / 集装箱查询", customer: "客户协同 / 状态门户", integrations: "企业能力 / 数据接入", system: "企业能力 / 系统适配", product: "作品集 / 产品说明" };
  breadcrumb.textContent = labels[view];
  closeDetail();
  if (view === "exceptions") renderExceptions();
  if (view === "tasks") renderTasks();
  if (view === "containers") renderContainers();
  if (view === "customer") renderCustomer();
  if (view === "integrations") renderIntegrations();
  if (view === "system") renderSystem();
  if (view === "product") renderProduct();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderExceptions() {
  root.innerHTML = `
    <section class="page-head">
      <div><span class="eyebrow">Risk-to-action workspace</span><h1>异常中心</h1><p class="page-subtitle">先处理最接近截止、影响最大且责任不清的异常。所有信息均为虚构脱敏数据。</p></div>
      <div class="page-actions"><button class="button secondary" id="savedView">保存当前视图</button><button class="button primary" id="focusHighRisk">聚焦高风险</button></div>
    </section>
    <section class="metrics" aria-label="异常指标">
      <article class="metric" style="--metric-color:var(--red)"><span class="metric-label">高风险异常</span><div class="metric-row"><strong class="metric-value" id="metricHigh">0</strong><span class="metric-note">需要立即处理</span></div></article>
      <article class="metric" style="--metric-color:var(--amber)"><span class="metric-label">24小时内到期</span><div class="metric-row"><strong class="metric-value" id="metricDue">0</strong><span class="metric-note">按截止时间排序</span></div></article>
      <article class="metric" style="--metric-color:var(--cyan)"><span class="metric-label">未分配负责人</span><div class="metric-row"><strong class="metric-value" id="metricUnassigned">0</strong><span class="metric-note">责任待明确</span></div></article>
      <article class="metric" style="--metric-color:var(--green)"><span class="metric-label">本周已关闭</span><div class="metric-row"><strong class="metric-value">31</strong><span class="metric-note">证据完整后关闭</span></div></article>
    </section>
    <section class="ops-strip" aria-label="运营质量演示指标">
      <div class="ops-stat"><span>平均首次响应</span><strong>18 分钟</strong></div>
      <div class="ops-stat"><span>平均闭环时间</span><strong>3.4 小时</strong></div>
      <div class="ops-stat"><span>AI 建议采纳率</span><strong>68%</strong></div>
      <div class="ops-stat"><span>数据过期率</span><strong>4.8% <small class="demo-metric">演示指标</small></strong></div>
    </section>
    <section class="quick-view-bar" aria-label="快捷视图">
      <div class="quick-views">
        <button class="quick-chip active" data-quick="all">全部异常 <span>${exceptions.filter(x => x.status !== "已关闭").length}</span></button>
        <button class="quick-chip" data-quick="mine">我的待办 <span>${exceptions.filter(x => x.owner === "陈楠" && x.status !== "已关闭").length}</span></button>
        <button class="quick-chip" data-quick="high">高风险 <span>${exceptions.filter(x => x.risk === "high" && x.status !== "已关闭").length}</span></button>
        <button class="quick-chip" data-quick="due">24 小时内到期 <span>${exceptions.filter(x => x.deadlineHours <= 24 && x.status !== "已关闭").length}</span></button>
        <button class="quick-chip" data-quick="stale">数据需核验 <span>${exceptions.filter(x => x.stale).length}</span></button>
      </div>
      <div class="view-tools"><span id="resultCount">0 条结果</span><button class="text-button mobile-filter-toggle" id="mobileFilters" aria-expanded="false">展开筛选</button><button class="text-button" id="clearFilters">清除筛选</button></div>
    </section>
    <section class="panel filters" aria-label="异常筛选">
      <div class="field"><label for="searchInput">搜索</label><input id="searchInput" type="search" placeholder="柜号、提单号或客户"></div>
      <div class="field"><label for="riskFilter">风险等级</label><select id="riskFilter"><option value="all">全部风险</option><option value="high">高风险</option><option value="medium">中风险</option><option value="low">低风险</option></select></div>
      <div class="field"><label for="statusFilter">处理状态</label><select id="statusFilter"><option value="all">全部状态</option><option>待审核</option><option>待人工复核</option><option>已创建任务</option><option>处理中</option><option>待验证</option><option>待处理</option><option>待补证</option><option>观察中</option><option>已指派</option><option>已关闭</option></select></div>
      <div class="field"><label for="ownerFilter">负责人</label><select id="ownerFilter"><option value="all">全部负责人</option><option>未分配</option><option>周宁</option><option>陈楠</option><option>李舟</option></select></div>
      <div class="field"><label for="sortFilter">排序</label><select id="sortFilter"><option value="urgency">紧急程度</option><option value="impact">潜在影响</option><option value="freshness">数据新鲜度</option></select></div>
    </section>
    <section class="panel table-wrap" aria-label="异常列表"><table><thead><tr><th>风险</th><th>异常 / 业务对象</th><th>客户</th><th>截止时间</th><th>潜在影响</th><th>负责人</th><th>数据新鲜度</th><th>状态</th><th></th></tr></thead><tbody id="exceptionRows"></tbody></table></section>
  `;

  const filters = ["searchInput", "riskFilter", "statusFilter", "ownerFilter", "sortFilter"];
  filters.forEach(id => document.getElementById(id).addEventListener(id === "searchInput" ? "input" : "change", updateExceptionRows));
  root.querySelectorAll("[data-quick]").forEach(button => button.addEventListener("click", () => {
    activeQuickView = button.dataset.quick;
    root.querySelectorAll("[data-quick]").forEach(x => x.classList.toggle("active", x === button));
    updateExceptionRows();
  }));
  document.getElementById("clearFilters").addEventListener("click", () => {
    ["searchInput", "riskFilter", "statusFilter", "ownerFilter"].forEach((id, index) => { document.getElementById(id).value = index === 0 ? "" : "all"; });
    document.getElementById("sortFilter").value = "urgency";
    activeQuickView = "all";
    root.querySelectorAll("[data-quick]").forEach(x => x.classList.toggle("active", x.dataset.quick === "all"));
    updateExceptionRows(); showToast("筛选条件已清除");
  });
  document.getElementById("mobileFilters").addEventListener("click", event => {
    const panel = root.querySelector(".filters");
    const expanded = panel.classList.toggle("filters-expanded");
    event.currentTarget.setAttribute("aria-expanded", String(expanded));
    event.currentTarget.textContent = expanded ? "收起筛选" : "展开筛选";
  });
  document.getElementById("focusHighRisk").addEventListener("click", () => { activeQuickView = "high"; root.querySelectorAll("[data-quick]").forEach(x => x.classList.toggle("active", x.dataset.quick === "high")); updateExceptionRows(); showToast("已聚焦高风险异常"); });
  document.getElementById("savedView").addEventListener("click", () => showToast("当前筛选已保存为本地演示视图"));
  updateExceptionRows();
}

function updateExceptionRows() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const risk = document.getElementById("riskFilter").value;
  const status = document.getElementById("statusFilter").value;
  const owner = document.getElementById("ownerFilter").value;
  const sort = document.getElementById("sortFilter").value;
  const list = exceptions.filter(item => {
    const haystack = `${item.container} ${item.bill} ${item.customer} ${item.type}`.toLowerCase();
    const quickMatch = activeQuickView === "all"
      || (activeQuickView === "mine" && item.owner === "陈楠" && item.status !== "已关闭")
      || (activeQuickView === "high" && item.risk === "high" && item.status !== "已关闭")
      || (activeQuickView === "due" && item.deadlineHours <= 24 && item.status !== "已关闭")
      || (activeQuickView === "stale" && item.stale);
    return quickMatch && (!query || haystack.includes(query)) && (risk === "all" || item.risk === risk) && (status === "all" || item.status === status) && (owner === "all" || item.owner === owner);
  }).sort((a, b) => sort === "impact" ? numericImpact(b.impact) - numericImpact(a.impact) : sort === "freshness" ? Number(b.stale) - Number(a.stale) : a.deadlineHours - b.deadlineHours);
  document.getElementById("resultCount").textContent = `${list.length} 条结果`;
  const rows = document.getElementById("exceptionRows");
  rows.innerHTML = list.length ? list.map(item => `
    <tr>
      <td data-label="风险">${riskTag(item)}</td>
      <td data-label="异常"><span class="strong-cell">${esc(item.type)}</span><span class="sub-cell">${esc(item.container)} · ${esc(item.bill)}</span></td>
      <td data-label="客户">${esc(item.customer)}</td>
      <td data-label="截止"><span class="deadline ${item.deadlineHours > 20 ? "safe" : ""}">${esc(item.deadline)}</span></td>
      <td data-label="影响"><strong>${esc(item.impact)}</strong></td>
      <td data-label="负责人">${esc(item.owner)}</td>
      <td data-label="新鲜度"><span class="freshness ${item.stale ? "stale" : ""}">${esc(item.freshness)}</span></td>
      <td data-label="状态">${statusTag(item.status)}</td>
      <td><button class="row-action" data-open="${esc(item.id)}">查看 →</button></td>
    </tr>`).join("") : `<tr><td colspan="9"><div class="empty-state"><strong>没有匹配的异常</strong>调整筛选条件后重试。</div></td></tr>`;
  rows.querySelectorAll("[data-open]").forEach(button => button.addEventListener("click", () => openDetail(button.dataset.open)));
  document.getElementById("metricHigh").textContent = exceptions.filter(x => x.risk === "high" && x.status !== "已关闭").length;
  document.getElementById("metricDue").textContent = exceptions.filter(x => x.deadlineHours <= 24 && x.status !== "已关闭").length;
  document.getElementById("metricUnassigned").textContent = exceptions.filter(x => x.owner === "未分配").length;
}

function numericImpact(value) {
  return Number(String(value).replace(/[^0-9.]/g, "")) || 0;
}

function openDetail(id) {
  activeException = exceptions.find(item => item.id === id);
  if (!activeException || !role().canApprove) return;
  const item = activeException;
  const currentStep = lifecycleIndex(item.status);
  const canApprove = LogisticsPolicy.canApprove(role(), item);
  detailSheet.innerHTML = `
    <header class="sheet-head"><div><span class="eyebrow">${esc(item.id)} · ${esc(item.riskLabel)}</span><h2>${esc(item.type)}</h2><p>${esc(item.container)} · ${esc(item.customer)}</p></div><button class="icon-button" data-close-sheet aria-label="关闭详情">×</button></header>
    <div class="sheet-body">
      <section class="section-card"><div class="section-title"><h3>异常生命周期</h3><span class="tag neutral">${esc(item.status)}</span></div><div class="lifecycle">${lifecycleSteps.map((step,index) => `<div class="lifecycle-step ${index < currentStep ? "done" : index === currentStep ? "current" : ""}">${esc(step)}</div>`).join("")}</div></section>
      <section class="detail-grid">
        <div class="detail-stat"><span>提柜港口</span><strong>${esc(item.port)}</strong></div>
        <div class="detail-stat"><span>目的地</span><strong>${esc(item.destination)}</strong></div>
        <div class="detail-stat"><span>最后免堆日 LFD</span><strong>${esc(item.lfd)}</strong></div>
        <div class="detail-stat"><span>潜在影响</span><strong>${esc(item.impact)}</strong></div>
        <div class="detail-stat"><span>负责人</span><strong>${esc(item.owner)}</strong></div>
        <div class="detail-stat"><span>状态</span><strong>${esc(item.status)}</strong></div>
      </section>
      <section class="section-card"><div class="section-title"><h3>已确认事实</h3><span class="tag info">事实层</span></div><ul class="fact-list">${item.facts.map(f => `<li><span>${esc(f[0])}</span><span class="fact-source">${esc(f[1])}</span></li>`).join("")}</ul></section>
      ${item.missing.length ? `<section class="section-card"><div class="section-title"><h3>缺失或待确认信息</h3><span class="tag medium">需人工核对</span></div><ul class="missing-list">${item.missing.map(m => `<li><span>${esc(m)}</span><span></span></li>`).join("")}</ul></section>` : ""}
      <section class="section-card ai-card"><div class="section-title"><h3>AI 处置建议</h3><span class="confidence">置信度 ${item.confidence}%</span></div><p class="ai-summary">${esc(item.aiSummary)}</p><div class="decision-layer"><div><span>事实</span><p>${esc(item.facts[0]?.[0] || "等待事实数据")}</p></div><div><span>推断</span><p>${esc(item.riskLabel)}，${esc(item.impact)} 潜在影响</p></div><div><span>建议</span><p>经人工审核后转为可追踪任务</p></div></div><ol class="recommendation-list">${item.recommendations.map(r => `<li>${esc(r)}</li>`).join("")}</ol>${item.stale || item.confidence < 60 ? `<div class="guardrail">当前数据过期或置信度不足，必须先完成人工核验，系统不会允许直接采纳。</div>` : ""}<div class="ai-evidence">依据：业务规则、外部事件、内部任务状态与异常 SOP。AI 不会直接执行预约、派车或客户承诺。</div><div class="ai-actions"><button class="button primary small" data-accept ${canApprove ? "" : "disabled"}>审核并创建任务</button><button class="button secondary small" data-edit ${role().canApprove ? "" : "disabled"}>编辑建议</button><button class="button danger small" data-reject ${role().canApprove ? "" : "disabled"}>拒绝</button></div>${!role().canApprove ? `<div class="guardrail">当前角色“${esc(role().label)}”没有审核权限，请切换为物流操作或运营经理。</div>` : ""}</section>
      <section class="section-card"><div class="section-title"><h3>事件时间线</h3><span class="freshness ${item.stale ? "stale" : ""}">${esc(item.freshness)}</span></div><div class="timeline">${item.timeline.map(t => `<div class="timeline-item"><time>${esc(t[0])}</time><strong>${esc(t[1])}</strong><p>${esc(t[2])}</p></div>`).join("")}</div></section>
      <section class="section-card"><div class="section-title"><h3>操作审计</h3><span class="tag info">可追溯</span></div><div class="audit-list">${auditLog.slice(0,5).map(row => `<div class="audit-row"><time>${esc(row.time)}</time><strong>${esc(row.actor)}</strong><span>${esc(row.action)}</span></div>`).join("")}</div></section>
      <p class="audit-note">每次建议、人工修改和执行结果均进入审计记录。本 Demo 仅演示产品机制，不连接真实业务系统。</p>
    </div>`;
  detailSheet.querySelector("[data-close-sheet]").addEventListener("click", closeDetail);
  detailSheet.querySelector("[data-accept]").addEventListener("click", () => createTaskFromSuggestion(item, item.recommendations.join("；"), item.owner === "未分配" ? "陈楠 · 调度" : item.owner));
  detailSheet.querySelector("[data-edit]").addEventListener("click", openEditModal);
  detailSheet.querySelector("[data-reject]").addEventListener("click", () => rejectSuggestion(item));
  sheetBackdrop.hidden = false;
  detailSheet.setAttribute("aria-hidden", "false");
  requestAnimationFrame(() => detailSheet.classList.add("open"));
}

function closeDetail() {
  detailSheet.classList.remove("open");
  detailSheet.setAttribute("aria-hidden", "true");
  setTimeout(() => { sheetBackdrop.hidden = true; }, 220);
}

function openEditModal() {
  if (!activeException) return;
  document.getElementById("suggestionText").value = activeException.recommendations.join("\n");
  editModal.hidden = false;
  modalBackdrop.hidden = false;
  setTimeout(() => document.getElementById("suggestionText").focus(), 0);
}

function closeEditModal() {
  editModal.hidden = true;
  modalBackdrop.hidden = true;
}

function createTaskFromSuggestion(item, suggestion, owner) {
  if (!item || !LogisticsPolicy.canApprove(role(), item)) { showToast("当前权限或证据状态不允许创建任务"); return; }
  if (item.status === "已创建任务" || item.status === "已关闭") { showToast("该异常已有任务或已关闭"); return; }
  const normalizedOwner = owner.split(" · ")[0];
  tasks.unshift({ id: `TK-${210 + tasks.length}`, title: suggestion.split(/[；\n]/)[0], container: item.container, owner: normalizedOwner, due: "今天 13:00", status: "todo", priority: item.risk, dependency: "预约与运力确认", evidence: "预约确认号 + 司机回执" });
  item.owner = normalizedOwner;
  item.status = "已创建任务";
  logAudit(role().name, `审核 AI 建议并创建任务，指派给 ${normalizedOwner}`);
  closeEditModal(); closeDetail(); updateNavCounts();
  if (currentView === "exceptions") renderExceptions();
  showToast(`已创建任务并指派给 ${normalizedOwner}`);
}

function rejectSuggestion(item) {
  if (!role().canApprove) { showToast("当前角色没有审核权限"); return; }
  item.status = "待人工复核";
  logAudit(role().name, "拒绝 AI 建议，转入人工复核");
  closeDetail();
  if (currentView === "exceptions") renderExceptions();
  showToast("AI 建议已拒绝，异常转入人工复核");
}

function renderTasks() {
  const columns = [
    ["todo", "待处理"], ["doing", "执行中"], ["blocked", "阻塞"], ["verifying", "待验证"], ["done", "已完成"]
  ];
  root.innerHTML = `
    <section class="page-head"><div><span class="eyebrow">Execution workspace</span><h1>调度任务</h1><p class="page-subtitle">AI 建议只有在进入责任明确的任务、获得执行结果并回写状态后，才产生业务价值。</p></div><div class="page-actions"><button class="button secondary" id="taskFilter">只看高风险</button><button class="button primary" id="newTask">新建任务</button></div></section>
    ${role().canExecute ? `<div class="permission-note">当前角色：${esc(role().label)}。你可以推进任务、提交完成证据并验证回写。</div>` : `<div class="permission-note">当前角色：${esc(role().label)}。任务状态仅供查看；切换为调度人员或运营经理后可执行。</div>`}
    <section class="task-board">${columns.map(([key,label]) => `<div class="task-column"><div class="task-column-head"><h3>${label}</h3><span>${tasks.filter(t => t.status === key).length} 项</span></div><div>${renderTaskCards(key)}</div></div>`).join("")}</section>`;
  root.querySelectorAll("[data-advance]").forEach(button => button.addEventListener("click", () => advanceTask(button.dataset.advance)));
  document.getElementById("taskFilter").addEventListener("click", () => showToast("高风险任务共 " + tasks.filter(t => t.priority === "high").length + " 项"));
  document.getElementById("newTask").addEventListener("click", () => showToast("请从异常详情审核建议后创建任务"));
}

function renderTaskCards(status) {
  const list = tasks.filter(task => task.status === status);
  if (!list.length) return `<div class="empty-state"><strong>暂无任务</strong>任务会在审核建议后进入这里。</div>`;
  return list.map(task => `<article class="task-card"><span class="tag ${task.priority}">${task.priority === "high" ? "高优先级" : "普通"}</span><h3>${esc(task.title)}</h3><p>${esc(task.container)} · ${esc(task.id)}</p><div class="task-detail-line"><span>依赖：${esc(task.dependency)}</span><span>证据：${esc(task.evidence)}</span></div><div class="task-meta"><span>${esc(task.owner)}</span><time>${esc(task.due)}</time></div>${status !== "done" ? `<div class="task-card-actions"><button class="button primary small" data-advance="${esc(task.id)}" ${role().canExecute ? "" : "disabled"}>${status === "todo" ? "开始执行" : status === "doing" ? "提交完成证据" : status === "verifying" ? "验证并回写" : "解除阻塞"}</button></div>` : ""}</article>`).join("");
}

function advanceTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  if (!LogisticsPolicy.canAdvance(role(), task)) { showToast("当前角色或任务状态不允许执行"); return; }
  const related = exceptions.find(e => e.container === task.container);
  if (task.status === "todo" || task.status === "blocked") {
    task.status = "doing";
    if (related) related.status = "处理中";
    logAudit(role().name, `开始执行任务 ${task.id}`);
  }
  else if (task.status === "doing") {
    task.status = "verifying";
    if (related) related.status = "待验证";
    logAudit(role().name, `为任务 ${task.id} 提交完成证据`);
  } else if (task.status === "verifying") {
    task.status = "done";
    if (related) related.status = "已关闭";
    logAudit(role().name, `验证任务 ${task.id} 并回写异常状态`);
  }
  renderTasks(); updateNavCounts();
  showToast(task.status === "done" ? "证据验证通过，相关异常已关闭" : task.status === "verifying" ? "完成证据已提交，等待验证" : "任务已进入执行中");
}

function renderContainers() {
  const stages = ["可提柜", "监管查验", "待预约", "已送达", "状态核验", "空柜待还"];
  root.innerHTML = `
    <section class="page-head"><div><span class="eyebrow">Shipment object workspace</span><h1>集装箱查询</h1><p class="page-subtitle">以业务对象为主线汇总状态、异常、预约、责任人和数据新鲜度，避免在多个系统之间反复查询。</p></div><div class="page-actions"><button class="button secondary" id="printContainers">打印当前视图</button></div></section>
    <section class="container-summary">
      <div class="summary-card"><span>在途集装箱</span><strong>42</strong></div><div class="summary-card"><span>可提柜</span><strong>8</strong></div><div class="summary-card"><span>存在异常</span><strong>${exceptions.filter(x => x.status !== "已关闭").length}</strong></div><div class="summary-card"><span>24 小时内 LFD</span><strong>${exceptions.filter(x => x.deadlineHours <= 24 && x.status !== "已关闭").length}</strong></div><div class="summary-card"><span>数据待核验</span><strong>${exceptions.filter(x => x.stale).length}</strong></div>
    </section>
    <section class="panel filters"><div class="field"><label for="containerSearch">柜号、提单号或客户</label><input id="containerSearch" type="search" placeholder="例如 TLLU 4829017"></div><div class="field"><label for="containerStage">运输阶段</label><select id="containerStage"><option value="all">全部阶段</option>${stages.map(x => `<option>${x}</option>`).join("")}</select></div><div class="field"><label for="containerException">异常状态</label><select id="containerException"><option value="all">全部</option><option value="open">存在异常</option><option value="closed">已关闭</option></select></div></section>
    <section class="panel table-wrap"><table><thead><tr><th>柜号 / 提单</th><th>客户</th><th>运输阶段</th><th>关键节点</th><th>异常</th><th>负责人</th><th>数据新鲜度</th><th></th></tr></thead><tbody id="containerRows"></tbody></table></section>`;
  const update = () => {
    const q = document.getElementById("containerSearch").value.trim().toLowerCase();
    const stage = document.getElementById("containerStage").value;
    const exceptionState = document.getElementById("containerException").value;
    const list = exceptions.map((item,index) => ({...item, stage:stages[index]})).filter(item => {
      const match = `${item.container} ${item.bill} ${item.customer}`.toLowerCase().includes(q);
      const open = item.status !== "已关闭";
      return match && (stage === "all" || item.stage === stage) && (exceptionState === "all" || (exceptionState === "open" ? open : !open));
    });
    document.getElementById("containerRows").innerHTML = list.length ? list.map(item => `<tr><td data-label="柜号"><span class="strong-cell">${esc(item.container)}</span><span class="sub-cell">${esc(item.bill)}</span></td><td data-label="客户">${esc(item.customer)}</td><td data-label="阶段"><span class="tag info">${esc(item.stage)}</span></td><td data-label="节点">LFD ${esc(item.lfd)}<span class="sub-cell">ETA ${esc(item.eta)}</span></td><td data-label="异常">${riskTag(item)}<span class="sub-cell">${esc(item.type)}</span></td><td data-label="负责人">${esc(item.owner)}</td><td data-label="新鲜度"><span class="freshness ${item.stale ? "stale" : ""}">${esc(item.freshness)}</span></td><td><button class="row-action" data-container-open="${esc(item.id)}">查看异常 →</button></td></tr>`).join("") : `<tr><td colspan="8"><div class="empty-state"><strong>没有匹配的集装箱</strong>请调整查询条件。</div></td></tr>`;
    root.querySelectorAll("[data-container-open]").forEach(button => button.addEventListener("click", () => openDetail(button.dataset.containerOpen)));
  };
  ["containerSearch","containerStage","containerException"].forEach(id => document.getElementById(id).addEventListener(id === "containerSearch" ? "input" : "change", update));
  document.getElementById("printContainers").addEventListener("click", () => window.print());
  update();
}

function renderIntegrations() {
  root.innerHTML = `
    <section class="page-head"><div><span class="eyebrow">Enterprise integration layer</span><h1>数据接入与治理</h1><p class="page-subtitle">统一查看外部物流事件和内部业务系统的同步状态、数据质量及字段冲突。以下均为模拟连接。</p></div><div class="page-actions"><button class="button secondary" id="retryWarnings">重试异常连接</button><button class="button primary" id="viewMapping">查看字段映射</button></div></section>
    <section class="architecture-flow">${[
      ["01","客户系统","TMS / WMS / OMS"],["02","数据接入","API / EDI / 文件"],["03","标准化","字段、状态与时区"],["04","异常识别","规则与数据冲突"],["05","AI + 人审","建议、审批与任务"],["06","结果回写","内部与客户视图"]
    ].map(n => `<div class="architecture-node"><span>${n[0]}</span><strong>${n[1]}</strong><p>${n[2]}</p></div>`).join("")}</section>
    <section class="enterprise-grid">${dataSources.map(source => `<article class="integration-card"><div class="integration-head"><div class="integration-name"><span class="integration-icon">${esc(source.icon)}</span><div><h3>${esc(source.name)}</h3><p>${esc(source.type)}</p></div></div><span class="health-status ${esc(source.status)}">${esc(source.statusLabel)}</span></div><div class="integration-metrics"><div><span>最近同步</span><strong>${esc(source.sync)}</strong></div><div><span>延迟</span><strong>${esc(source.latency)}</strong></div><div><span>质量</span><strong>${esc(source.quality)}</strong></div></div></article>`).join("")}</section>
    <section class="panel mapping-table" id="mappingPanel"><div style="padding:16px 16px 0"><div class="section-title"><h3>字段标准化与冲突处理</h3><span class="tag medium">2 项需关注</span></div></div><div class="table-wrap"><table><thead><tr><th>来源</th><th>原始字段</th><th>原始值</th><th>标准化值</th><th>处理规则</th><th>结果</th></tr></thead><tbody>${mappingIssues.map(row => `<tr><td>${esc(row.source)}</td><td>${esc(row.field)}</td><td><code>${esc(row.raw)}</code></td><td><code>${esc(row.normalized)}</code></td><td>${esc(row.rule)}</td><td>${statusTag(row.result)}</td></tr>`).join("")}</tbody></table></div></section>`;
  document.getElementById("retryWarnings").addEventListener("click", () => { dataSources.filter(x => x.status === "warn").forEach(x => x.sync = "刚刚重试"); logAudit(role().name,"重试异常数据连接"); showToast("已发起重试，连接状态将在下一轮同步更新"); renderIntegrations(); });
  document.getElementById("viewMapping").addEventListener("click", () => document.getElementById("mappingPanel").scrollIntoView({behavior:"smooth"}));
}

function renderSystem() {
  const terminals = [
    ["办公桌面","1440×900 起","高密度表格、键盘操作和多任务"],["企业笔记本","1366×768","首屏保留风险与核心动作"],["调度平板","768px 起","加大触控区域，支持横竖屏"],["仓库触屏","触控终端","简化操作、突出扫描与确认"],["移动设备","390px 起","快速审核、查看状态和处理待办"],["运营大屏","1920×1080","只读风险监控与系统健康"]
  ];
  root.innerHTML = `
    <section class="page-head"><div><span class="eyebrow">Runtime & terminal readiness</span><h1>系统与终端适配</h1><p class="page-subtitle">说明产品如何进入企业软件环境、现场终端和受限网络。Demo 不直接控制真实硬件。</p></div><div class="page-actions"><button class="button secondary" id="printSystem">打印适配说明</button><button class="button primary" id="resetDemo">重置演示数据</button></div></section>
    <div class="system-grid">
      <section class="panel health-panel"><div class="section-title"><h3>系统健康</h3><span class="health-status ok">可用</span></div><div class="health-overview"><div class="health-score">97</div><div><strong>核心服务运行正常</strong><p class="page-subtitle">2 个外部数据源存在延迟或待核验，不影响核心工作台。</p></div></div><div class="health-lines"><div class="health-line"><span>页面可用性</span><div class="health-bar"><span style="width:99%"></span></div><strong>99.9%</strong></div><div class="health-line"><span>事件同步</span><div class="health-bar"><span style="width:93%"></span></div><strong>93%</strong></div><div class="health-line"><span>数据质量</span><div class="health-bar"><span style="width:96%"></span></div><strong>96.4%</strong></div></div></section>
      <section class="panel health-panel"><div class="section-title"><h3>软件兼容</h3><span class="tag info">演示范围</span></div><table class="compat-table"><thead><tr><th>环境</th><th>状态</th><th>说明</th></tr></thead><tbody><tr><td>Chrome / Edge</td><td>${statusTag("已验证")}</td><td>桌面主流程</td></tr><tr><td>Safari 移动端</td><td>${statusTag("设计适配")}</td><td>基础响应式</td></tr><tr><td>SSO / RBAC</td><td>${statusTag("方案设计")}</td><td>未接真实认证</td></tr><tr><td>API / Webhook</td><td>${statusTag("Mock")}</td><td>接口状态演示</td></tr></tbody></table></section>
    </div>
    <section class="container-summary" style="margin-top:15px"><div class="summary-card"><span>访问域名</span><strong>${esc(location.host || "本地预览")}</strong></div><div class="summary-card"><span>访问策略</span><strong>账号私有</strong></div><div class="summary-card"><span>当前版本</span><strong>Demo V3</strong></div><div class="summary-card"><span>数据模式</span><strong>虚构 / Mock</strong></div><div class="summary-card"><span>恢复能力</span><strong>一键重置</strong></div></section>
    <section class="enterprise-grid" style="margin-top:15px">${terminals.map((t,index) => `<article class="terminal-card"><div class="terminal-head"><div><h3>${esc(t[0])}</h3><p>${esc(t[1])}</p></div><span class="tag ${index < 3 ? "info" : "neutral"}">${index < 3 ? "已适配" : "方案"}</span></div><p>${esc(t[2])}</p></article>`).join("")}</section>
    <section class="panel" style="padding:18px;margin-top:15px"><div class="section-title"><h3>现场外设与弱网策略</h3><span class="tag neutral">接口设计</span></div><div class="mode-cards"><div class="mode-card"><strong>扫描枪与标签</strong><span>扫描枪按键盘输入处理；标签和单据使用打印友好视图，不直接连接真实设备。</span></div><div class="mode-card"><strong>弱网与同步</strong><span>持续显示最近同步时间；失败时保留已确认状态并提供显式重试，不使用无提示的静默覆盖。</span></div></div><div class="reset-zone"><div><strong>演示环境恢复</strong><p>恢复全部虚构异常、任务、角色和筛选状态，适合面试前快速重置。</p></div><button class="button danger" id="resetDemoInline">恢复初始数据</button></div></section>`;
  const reset = () => resetDemoState();
  document.getElementById("resetDemo").addEventListener("click", reset);
  document.getElementById("resetDemoInline").addEventListener("click", reset);
  document.getElementById("printSystem").addEventListener("click", () => window.print());
}

function resetDemoState() {
  exceptions.splice(0, exceptions.length, ...JSON.parse(JSON.stringify(initialExceptions)));
  tasks = JSON.parse(JSON.stringify(initialTasks));
  currentRole = "operator";
  activeQuickView = "all";
  document.getElementById("roleSelect").value = "operator";
  document.getElementById("operatorName").textContent = roles.operator.name;
  document.getElementById("operatorRole").textContent = roles.operator.label;
  logAudit("系统", "恢复演示环境初始数据");
  updateNavCounts();
  setView("exceptions");
  showToast("演示数据已恢复，可以重新开始主流程");
}

function renderCustomer() {
  const item = exceptions[0];
  root.innerHTML = `
    <section class="page-head"><div><span class="eyebrow">External visibility</span><h1>客户状态视图</h1><p class="page-subtitle">对外只展示经过确认的事实、可解释的状态和下一步，不暴露内部责任、费用争议或 AI 推理过程。</p></div><div class="page-actions"><button class="button secondary" id="copyPublicLink">复制演示链接</button></div></section>
    <div class="customer-shell">
      <section class="customer-hero"><div><span class="eyebrow">Shipment BL-7A49K</span><h1>进口集装箱运输中</h1><p>柜号 ${esc(item.container)} · 状态更新时间 09-28 09:12</p><div class="progress-track" aria-label="运输进度 62%"><span></span></div></div><div class="route">Newark Port<br>→ Edison Distribution Center</div></section>
      <div class="customer-grid">
        <section class="section-card"><div class="section-title"><h3>运输里程碑</h3><span class="tag info">公开状态</span></div><div class="milestone-list">
          <div class="milestone"><span class="milestone-dot">✓</span><div><strong>船舶已到港</strong><span>已确认事实</span></div><time>09-27 16:40</time></div>
          <div class="milestone"><span class="milestone-dot">✓</span><div><strong>集装箱已卸船</strong><span>已确认事实</span></div><time>09-27 22:18</time></div>
          <div class="milestone"><span class="milestone-dot">✓</span><div><strong>集装箱已可提</strong><span>已完成放行</span></div><time>09-28 09:12</time></div>
          <div class="milestone pending"><span class="milestone-dot">4</span><div><strong>安排提柜</strong><span>运营团队处理中</span></div><time>预计今日</time></div>
          <div class="milestone pending"><span class="milestone-dot">5</span><div><strong>送达仓库</strong><span>等待调度确认</span></div><time>${esc(item.eta)}</time></div>
        </div></section>
        <div><section class="section-card"><div class="section-title"><h3>当前说明</h3></div><div class="public-alert">集装箱已具备提取条件，运营团队正在确认码头预约和车辆安排。预计到仓时间将在预约确认后更新。</div></section><section class="section-card" style="margin-top:15px"><div class="section-title"><h3>可用文件</h3></div><p class="page-subtitle">提单副本 · 到港通知 · 放行确认</p><button class="button secondary small" id="downloadPlaceholder">查看文件清单</button></section></div>
      </div>
    </div>`;
  document.getElementById("copyPublicLink").addEventListener("click", () => showToast("客户视图链接已复制（演示）"));
  document.getElementById("downloadPlaceholder").addEventListener("click", () => showToast("演示环境不包含真实业务文件"));
}

function renderProduct() {
  root.innerHTML = `
    <section class="page-head"><div><span class="eyebrow">Portfolio reconstruction</span><h1>产品说明</h1><p class="page-subtitle">基于跨境物流异常协同问题重建的公开产品演示；所有记录、指标、接口状态和 AI 建议均为固定样例。</p></div><div class="page-actions"><button class="button secondary" id="viewEnterprise">查看企业适配</button><button class="button primary" id="startJourney">体验主流程</button></div></section>
    <div class="product-layout">
      <section class="panel" style="padding:22px"><span class="eyebrow">Product thesis</span><h2>让物流状态变成可执行任务</h2><p class="page-subtitle">优秀的物流产品不只是展示更多轨迹，而是回答：发生了什么、影响多大、谁应处理、何时完成以及下一步做什么。</p><div class="product-flow">
        <div class="flow-node"><span>01</span><strong>事件汇聚</strong><p>船司、码头、仓库和内部状态</p></div>
        <div class="flow-node"><span>02</span><strong>异常识别</strong><p>规则、截止时间和数据冲突</p></div>
        <div class="flow-node"><span>03</span><strong>AI 建议</strong><p>摘要、依据、缺失信息和动作</p></div>
        <div class="flow-node"><span>04</span><strong>人工审核</strong><p>接受、修改、拒绝或升级</p></div>
        <div class="flow-node"><span>05</span><strong>执行回写</strong><p>任务、证据、状态和审计闭环</p></div>
      </div><div class="disclosure">所有公司、客户、柜号、费用和业务记录均为虚构或脱敏内容。本 Demo 不代表客户已正式上线的生产系统。</div></section>
      <aside class="panel" style="padding:22px"><span class="eyebrow">Design principles</span><h2>产品原则</h2><div class="principles"><div class="principle">事实、预测和任务必须分层</div><div class="principle">异常必须有责任人和截止时间</div><div class="principle">AI 建议必须展示依据和不确定性</div><div class="principle">高风险动作必须由人工确认</div><div class="principle">客户与内部运营使用不同视图</div><div class="principle">完成由状态和证据共同定义</div></div><div class="disclosure"><strong>落地边界</strong><br>本 Demo 展示 TMS/WMS/OMS、API、SSO、扫描枪和打印机的产品适配方案，不代表已经连接任何真实客户系统或硬件。</div></aside>
    </div>`;
  document.getElementById("startJourney").addEventListener("click", () => { setView("exceptions"); setTimeout(() => openDetail("EX-1042"), 120); });
  document.getElementById("viewEnterprise").addEventListener("click", () => setView("integrations"));
}

document.querySelectorAll(".nav-item").forEach(button => button.addEventListener("click", () => setView(button.dataset.view)));
sheetBackdrop.addEventListener("click", closeDetail);
modalBackdrop.addEventListener("click", closeEditModal);
document.getElementById("closeModal").addEventListener("click", closeEditModal);
document.getElementById("cancelEdit").addEventListener("click", closeEditModal);
document.getElementById("saveSuggestion").addEventListener("click", () => {
  const suggestion = document.getElementById("suggestionText").value.trim();
  const owner = document.getElementById("ownerSelect").value;
  if (!suggestion) { showToast("请填写处置方案"); return; }
  createTaskFromSuggestion(activeException, suggestion, owner);
});
document.getElementById("refreshButton").addEventListener("click", () => showToast("模拟数据已刷新，最近同步时间已更新"));
document.getElementById("roleSelect").addEventListener("change", event => {
  closeDetail(); closeEditModal();
  currentRole = event.target.value;
  document.getElementById("operatorName").textContent = role().name;
  document.getElementById("operatorRole").textContent = role().label;
  logAudit(role().name, `切换到${role().label}视角`);
  if (role().view === "external") setView("customer");
  else setView(currentView === "customer" ? "exceptions" : currentView);
  showToast(`已切换为${role().label}`);
});
document.getElementById("densityButton").addEventListener("click", event => {
  tableDensity = tableDensity === "comfortable" ? "compact" : "comfortable";
  document.body.classList.toggle("compact-density", tableDensity === "compact");
  event.currentTarget.setAttribute("aria-pressed", String(tableDensity === "compact"));
  event.currentTarget.textContent = tableDensity === "compact" ? "舒适视图" : "紧凑视图";
  showToast(tableDensity === "compact" ? "已切换为紧凑视图" : "已切换为舒适视图");
});
document.addEventListener("keydown", event => { if (event.key === "Escape") { closeEditModal(); closeDetail(); } });

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const tool = (spec) => Promise.resolve(context.registerTool(spec)).catch(() => {});
  tool({
    name: "list_logistics_exceptions", title: "读取物流异常", description: "读取当前 Demo 中按风险和状态筛选后的物流异常，不修改页面状态。",
    inputSchema: { type: "object", properties: { risk: { type: "string", enum: ["all","high","medium","low"] } }, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute(input) { const risk = input?.risk || "all"; return exceptions.filter(x => risk === "all" || x.risk === risk).map(x => ({ id:x.id, container:x.container, type:x.type, risk:x.risk, status:x.status, owner:x.owner, deadline:x.deadline })); }
  });
  tool({
    name: "open_exception_detail", title: "打开异常详情", description: "在可见界面打开指定异常的详情和 AI 建议。",
    inputSchema: { type: "object", properties: { exceptionId: { type: "string" } }, required: ["exceptionId"], additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute(input) { const item = exceptions.find(x => x.id === input?.exceptionId); if (!item) throw new Error("Exception not found"); setView("exceptions"); openDetail(item.id); return { id:item.id, status:item.status, opened:true }; }
  });
  tool({
    name: "approve_exception_recommendation", title: "批准异常建议", description: "批准指定异常的 AI 建议并在可见任务工作台创建任务。",
    inputSchema: { type: "object", properties: { exceptionId: { type:"string" }, owner: { type:"string" } }, required:["exceptionId","owner"], additionalProperties:false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) { const item = exceptions.find(x => x.id === input?.exceptionId); if (!item) throw new Error("Exception not found"); if (!input.owner.trim()) throw new Error("Owner required"); createTaskFromSuggestion(item, item.recommendations.join("；"), input.owner); return { exceptionId:item.id, status:item.status, owner:item.owner, taskCreated:true }; }
  });
  tool({
    name: "get_logistics_system_health", title: "读取系统健康", description: "读取 Demo 数据源连接、同步延迟和数据质量摘要。",
    inputSchema: { type:"object", properties:{}, additionalProperties:false },
    annotations: { readOnlyHint:true, untrustedContentHint:false },
    execute() { return { score:97, environment:"demo", sources:dataSources.map(x => ({name:x.name,status:x.status,lastSync:x.sync,quality:x.quality})) }; }
  });
  tool({
    name: "reset_logistics_demo", title: "重置物流演示", description: "将异常、任务、角色和视图恢复为初始虚构数据。",
    inputSchema: { type:"object", properties:{ confirm:{ type:"boolean" } }, required:["confirm"], additionalProperties:false },
    annotations: { readOnlyHint:false, destructiveHint:true, untrustedContentHint:false },
    execute(input) { if (!input?.confirm) throw new Error("Confirmation required"); resetDemoState(); return { reset:true, exceptionCount:exceptions.length, taskCount:tasks.length }; }
  });
}

updateNavCounts();
renderExceptions();
registerWebMCP();

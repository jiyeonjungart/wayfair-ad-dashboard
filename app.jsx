/* global React, ReactDOM, Icon, GOALS, GOAL_KPIS, CAMPAIGNS, SpendChart, CampaignTable, LaunchMilestones, GoalModal */
const { useState, useEffect, useMemo } = React;

const TWEAKS = /*EDITMODE-BEGIN*/{
  "iconSize": "medium",
  "accentColor": "#782b7f",
  "density": "comfortable",
  "showExplainability": true,
  "insightLevel": "product"
} /*EDITMODE-END*/;

function AdvantageScore({ goal, onClick }) {
  const total = 7;
  const needAction = CAMPAIGNS.filter((c) => c.status !== "good").length;
  const healthy = total - needAction;
  const score = Math.round(healthy / total * 100);

  // ring
  const R = 40,C = 2 * Math.PI * R;
  const fill = score / 100 * C;

  return (
    <div className="advantage-card" style={{ fontSize: "22px" }}>
      <div className="label">AdVantage Score <span className="badge-beta">NEW</span></div>
      <div className="gauge" style={{ fontSize: "22px" }}>
        <div className="gauge-ring" style={{ fontSize: "22px" }}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={R} fill="none" stroke="#ecd9f0" strokeWidth="8" />
            <circle cx="50" cy="50" r={R} fill="none" stroke="#782b7f" strokeWidth="8"
            strokeDasharray={`${fill} ${C}`} strokeLinecap="round" />
          </svg>
          <div className="val" style={{ fontSize: "22px", textAlign: "center", width: "96px" }}>{score}%</div>
        </div>
        <div className="txt">
          <div><strong>{healthy} of {total} campaigns</strong> are healthy.</div>
          <div style={{ marginTop: 4 }}>{needAction} need attention — mostly around bid & budget configuration.</div>
        </div>
      </div>
      <button className="cta" onClick={onClick}>Review {needAction} recommendations →</button>
    </div>);

}

function KpiTile({ k, highlight, onInfoEnter, onInfoLeave }) {
  const pct = Math.abs(k.delta);
  return (
    <div className={`kpi ${highlight ? "highlight" : ""}`}>
      <div className="k-label">
        {k.label}
        {k.help &&
        <span className="i"
        onMouseEnter={(e) => onInfoEnter(k.help, e.target)}
        onMouseLeave={onInfoLeave}>
          i</span>
        }
      </div>
      <div className="k-val">{k.val}</div>
      <span className={`k-delta ${k.delta > 0 ? "up" : k.delta < 0 ? "down" : "flat"}`}>
        <span className="arrow">
          <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1,10 7,5 11,8 19,2" />
            <polyline points="14,2 19,2 19,7" />
          </svg>
        </span>
        <span><span className="pct">{pct}{k.unit || "%"}</span> vs. last 28d</span>
      </span>
    </div>);

}

function Tip({ data }) {
  if (!data) return null;
  const { text, rect } = data;
  const top = rect.top + window.scrollY + rect.height + 6;
  const left = rect.left + window.scrollX - 10;
  return (
    <div className="tip show" style={{ top, left, position: "absolute" }}>
      {text}
    </div>);

}

function InfoPanel({ open, onClose, anchorRect, onGo }) {
  if (!open) return null;
  const top = anchorRect.top + window.scrollY + anchorRect.height + 8;
  const left = Math.max(anchorRect.left + window.scrollX - 40, window.scrollX + 88);
  return (
    <div className="info-panel show" style={{ top, left, position: "absolute" }} onClick={(e) => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h5>What drives this status?</h5>
        <span style={{ cursor: "pointer", color: "var(--ink-3)" }} onClick={onClose}><Icon.X /></span>
      </div>
      <div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}>
        AdVantage aggregates four signals. A status drops to "Needs Action" when two or more score red.
      </div>
      <div className="factor"><b>Bid competitiveness</b><span className="v neg">● Below market</span></div>
      <div className="factor"><b>Budget utilization</b><span className="v neg">● Capped daily</span></div>
      <div className="factor"><b>Funnel health (CTR → Buy)</b><span className="v pos">● Healthy</span></div>
      <div className="factor"><b>Creative quality</b><span className="v">● Neutral</span></div>
      <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 8, lineHeight: 1.4 }}>
        We only surface factors the ad system can influence. Issues like pricing or checkout sit with other teams.
      </div>
      {onGo && <button className="btn btn-primary" style={{ width: "100%", marginTop: 12, justifyContent: "center" }} onClick={onGo}>Go to recommendations →</button>}
    </div>);

}

function App() {
  const [t, setTweak] = useTweaks(TWEAKS);
  const [goal, setGoal] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [tip, setTip] = useState(null);
  const [info, setInfo] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null); // { product, campaign }
  const [filterOpen, setFilterOpen] = useState(false);
  const [colsOpen, setColsOpen] = useState(false);
  const [focus, setFocus] = useState(null);
  const goToRecs = () => {
    setInfo(null);
    setSelectedProduct(null);
    setFilterStatus("all");
    const first = CAMPAIGNS.find((c) => c.status === "bad") || CAMPAIGNS.find((c) => c.status !== "good");
    if (first) { setGoal("all"); setFocus({ id: first.id, t: Date.now() }); }
    setTimeout(() => {
      const el = document.querySelector(".table-wrap");
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
    }, 60);
  };
  const [advFilters, setAdvFilters] = useState({
    activeOnly: false,
    minRoas: 0,
    minSpend: 0,
    goals: { bestsellers: true, launch: true, inventory: true, other: true }
  });
  const ALL_COLS = [
  { id: "campaign", label: "Campaign", required: true },
  { id: "status", label: "Status" },
  { id: "insight", label: "Insight" },
  { id: "roas", label: "RoAS" },
  { id: "spend", label: "Spend" },
  { id: "attrSpend", label: "Attributed Spend" },
  { id: "ctr", label: "CTR" },
  { id: "revenue", label: "Revenue" }];

  const [visibleCols, setVisibleCols] = useState(() =>
  Object.fromEntries(ALL_COLS.map((c) => [c.id, true]))
  );

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2600);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const rows = useMemo(() => {
    let r = CAMPAIGNS;
    if (goal !== "all") r = r.filter((c) => c.goal === goal);
    if (filterStatus !== "all") r = r.filter((c) => c.status === filterStatus);
    if (advFilters.activeOnly) r = r.filter((c) => c.active);
    if (advFilters.minRoas > 0) r = r.filter((c) => c.roas >= advFilters.minRoas);
    if (advFilters.minSpend > 0) r = r.filter((c) => c.spend >= advFilters.minSpend);
    const goalKeys = Object.keys(advFilters.goals).filter((k) => advFilters.goals[k]);
    if (goalKeys.length < 4) {
      r = r.filter((c) => goalKeys.includes(c.goal) || goalKeys.includes("other") && !["bestsellers", "launch", "inventory"].includes(c.goal));
    }
    return r;
  }, [goal, filterStatus, advFilters]);

  const kpis = GOAL_KPIS[goal] || GOAL_KPIS.all;

  const onInfoEnter = (text, el) => {
    setTip({ text, rect: el.getBoundingClientRect() });
  };
  const onInfoLeave = () => setTip(null);

  const showInfoPanel = (el) => {
    setInfo({ rect: el.getBoundingClientRect() });
  };

  const applyChange = (name) => {
    setToast(`Change applied to “${name.slice(0, 36)}…”`);
  };

  const iconSizes = {
    small: { xs: 10, sm: 12, md: 14, lg: 16 },
    medium: { xs: 12, sm: 14, md: 18, lg: 22 },
    large: { xs: 14, sm: 18, md: 22, lg: 28 }
  };
  const iz = iconSizes[t.iconSize] || iconSizes.medium;
  const densityPad = t.density === "compact" ? 10 : t.density === "spacious" ? 20 : 14;

  const rootStyle = {
    "--icon-xs": iz.xs + "px",
    "--icon-sm": iz.sm + "px",
    "--icon-md": iz.md + "px",
    "--icon-lg": iz.lg + "px",
    "--accent": t.accentColor,
    "--row-pad-y": densityPad + "px"
  };

  return (
    <div className="shell" style={rootStyle}>
      <aside className="sidebar">
        <div className="nav-item nav-hamburger"><Icon.Hamburger /></div>
        <div className="nav">
          <div className="nav-item" title="Performance"><Icon.Bars /></div>
          <div className="nav-item" title="Insights"><Icon.Diamond /></div>
          <div className="nav-item" title="Account"><Icon.Lock /></div>
          <div className="nav-item" title="Catalog"><Icon.Grid4 /></div>
          <div className="nav-item active" title="Advertising"><Icon.Storefront /></div>
          <div className="nav-item" title="Promotions"><Icon.TagSimple /></div>
          <div className="nav-item" title="Listings"><Icon.Monitor /></div>
          <div className="nav-item" title="Operations"><Icon.HexGrid /></div>
          <div className="nav-item" title="Reports"><Icon.Document /></div>
          <div className="nav-item" title="Inbox"><Icon.Inbox /></div>
          <div className="nav-item" style={{ marginTop: "auto" }} title="Help"><Icon.Help /></div>
        </div>
      </aside>

      <div className="content">
        <header className="topbar" style={{ fontSize: "15px" }}>
          <div className="brand" style={{ alignItems: "center", gap: "2px" }}>
            <img src="wayfair-logo.png" alt="wayfair" className="wayfair-logo" style={{ display: "block", height: "20px", width: "79px" }} />
            <span className="divider"></span>
            <span style={{ color: "var(--ink-3)", fontWeight: 500, fontSize: "16px", height: "20px", width: "112px" }}>Partner Home</span>
          </div>
          <div className="right">
            <span>Store: <b style={{ color: "var(--ink)" }}>Northfield Furniture Co.</b></span>
            <span>·</span>
            <span>Last 30 days ▾</span>
            <div className="avatar">NF</div>
          </div>
        </header>

        <div className="page-head">
          <div className="breadcrumb">
            <span>Home</span><span className="sep">/</span><span className="current">Advertising</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
            <h1>Advertising</h1>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-secondary">Bulk Updates</button>
              <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                <Icon.Plus /> Create Campaign
              </button>
            </div>
          </div>
        </div>

        <nav className="subnav">
          <a className="active">Campaigns</a>
          <a>Bulk Updates</a>
          <a>Reports</a>
          <a>Wallet</a>
        </nav>

        {/* Goal tabs — solution 2 */}
        <div className="goal-tabs">
          {GOALS.map((g) => {const Ic = Icon[g.icon] || Icon.Target;
            return (
              <button key={g.id}
              className={`goal-tab ${goal === g.id ? "active" : ""}`}
              onClick={() => setGoal(g.id)}>
                <Ic />
                {g.label}
                {g.count > 0 && <span className="count">{g.count}</span>}
              </button>);

          })}
        </div>

        <div className="dash">
          {selectedProduct ?
          <ProductDetail
            product={selectedProduct.product}
            campaign={selectedProduct.campaign}
            onBack={() => setSelectedProduct(null)}
            onApply={applyChange} /> :


          <React.Fragment>
          {/* Row 1 — AdVantage + KPI grid (solutions 9, 2) */}
          <div className="advantage-row" style={{ fontSize: "22px" }}>
            <AdvantageScore goal={goal} onClick={(e) => {
                if (e && e.currentTarget) showInfoPanel(e.currentTarget);
              }} />
            <div className="kpi-grid">
              {kpis.map((k, i) =>
                <KpiTile key={i} k={k} highlight={i === 0 && goal !== "all"}
                onInfoEnter={onInfoEnter} onInfoLeave={onInfoLeave} />
                )}
            </div>
          </div>

          {/* Chart */}
          <div className="chart-card">
            <div className="chart-head">
              <div>
                <h3>
                  {goal === "bestsellers" ? "Rank change · Spend" :
                    goal === "launch" ? "New-buyer reach · Impressions" :
                    goal === "inventory" ? "Sell-through · Spend" :
                    "Spend · Impressions"}
                </h3>
                <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
                  Metrics adapt to this goal. {goal === "inventory" && "Budget cap shaded in red."}
                </div>
              </div>
              <div className="chart-legend">
                <span><i style={{ background: "#782b7f" }} />Spend</span>
                <span><i style={{ background: "#a59726", height: 2, borderRadius: 0 }} />Impressions</span>
                {goal === "inventory" && <span><i style={{ background: "#c54549", opacity: .4 }} />Budget cap hit</span>}
              </div>
            </div>
            <SpendChart highlightDip={goal === "inventory"} />
          </div>

          {/* Launch gamification — solution 10 */}
          <LaunchMilestones goal={goal} />

          {/* Campaign table — solutions 3, 4 */}
          <div className="section-head">
            <h2>
              {goal === "all" ? "All campaigns" :
                goal === "bestsellers" ? "Bestseller campaigns" :
                goal === "launch" ? "Launch campaigns" :
                "Inventory campaigns"}
            </h2>
            <div className="hint"></div>
          </div>

          <div className="table-wrap">
            <div className="table-toolbar">
              <div className="searchbar">
                <Icon.Search />
                <input placeholder="Search campaigns, SKUs, products" />
              </div>
              <div className="chip-row">
                <button className={`chip ${filterStatus === "all" ? "active" : ""}`} onClick={() => setFilterStatus("all")}>All ({CAMPAIGNS.length})</button>
                <button className={`chip ${filterStatus === "bad" ? "active" : ""}`} onClick={() => setFilterStatus("bad")}>
                  <span className="dot bad" />Needs Action ({CAMPAIGNS.filter((c) => c.status === "bad").length})
                </button>
                <button className={`chip ${filterStatus === "warn" ? "active" : ""}`} onClick={() => setFilterStatus("warn")}>
                  <span className="dot warn" />Attention ({CAMPAIGNS.filter((c) => c.status === "warn").length})
                </button>
                <button className={`chip ${filterStatus === "good" ? "active" : ""}`} onClick={() => setFilterStatus("good")}>
                  <span className="dot good" />Healthy ({CAMPAIGNS.filter((c) => c.status === "good").length})
                </button>
                <button className="chip" onClick={(e) => showInfoPanel(e.currentTarget)}>
                  <Icon.Info /> How status is scored
                </button>
                <div className="toolbar-spacer" />
                <div className="popover-host">
                  <button className={`chip chip-tool ${filterOpen ? "active" : ""}`} onClick={() => {setFilterOpen(!filterOpen);setColsOpen(false);}} style={{ fontWeight: "500" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1em", height: "1em" }}><path d="M3 5h18M6 12h12M10 19h4" /></svg>
                    Filter
                    {(advFilters.activeOnly || advFilters.minRoas > 0 || advFilters.minSpend > 0 || Object.values(advFilters.goals).some((v) => !v)) && <span className="filter-badge" />}
                  </button>
                  {filterOpen &&
                    <div className="popover" onClick={(e) => e.stopPropagation()}>
                      <div className="popover-head">
                        <h5>Filter campaigns</h5>
                        <span className="po-close" onClick={() => setFilterOpen(false)}><Icon.X /></span>
                      </div>
                      <div className="po-section">
                        <div className="po-label">State</div>
                        <label className="po-row">
                          <input type="checkbox" checked={advFilters.activeOnly} onChange={(e) => setAdvFilters({ ...advFilters, activeOnly: e.target.checked })} />
                          <span>Active campaigns only</span>
                        </label>
                      </div>
                      <div className="po-section">
                        <div className="po-label">Goal</div>
                        {[
                        { k: "bestsellers", l: "Boost Bestsellers" },
                        { k: "launch", l: "New Product Launch" },
                        { k: "inventory", l: "Faster Inventory Turnover" },
                        { k: "other", l: "Other / Uncategorized" }].
                        map((g) =>
                        <label key={g.k} className="po-row">
                            <input type="checkbox" checked={advFilters.goals[g.k]} onChange={(e) => setAdvFilters({ ...advFilters, goals: { ...advFilters.goals, [g.k]: e.target.checked } })} />
                            <span>{g.l}</span>
                          </label>
                        )}
                      </div>
                      <div className="po-section">
                        <div className="po-label">Min RoAS · {advFilters.minRoas}%</div>
                        <input type="range" min="0" max="500" step="10" value={advFilters.minRoas}
                        onChange={(e) => setAdvFilters({ ...advFilters, minRoas: +e.target.value })} className="po-slider" />
                      </div>
                      <div className="po-section">
                        <div className="po-label">Min Spend · ${advFilters.minSpend.toLocaleString()}</div>
                        <input type="range" min="0" max="50000" step="500" value={advFilters.minSpend}
                        onChange={(e) => setAdvFilters({ ...advFilters, minSpend: +e.target.value })} className="po-slider" />
                      </div>
                      <div className="po-foot">
                        <button className="btn btn-ghost" onClick={() => setAdvFilters({ activeOnly: false, minRoas: 0, minSpend: 0, goals: { bestsellers: true, launch: true, inventory: true, other: true } })}>Reset</button>
                        <button className="btn btn-primary" onClick={() => setFilterOpen(false)}>Apply</button>
                      </div>
                    </div>
                    }
                </div>
                <div className="popover-host">
                  <button className={`chip chip-tool ${colsOpen ? "active" : ""}`} onClick={() => {setColsOpen(!colsOpen);setFilterOpen(false);}} style={{ fontWeight: "500" }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "1em", height: "1em" }}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></svg>
                    Customize columns
                  </button>
                  {colsOpen &&
                    <div className="popover" onClick={(e) => e.stopPropagation()}>
                      <div className="popover-head">
                        <h5>Customize columns</h5>
                        <span className="po-close" onClick={() => setColsOpen(false)}><Icon.X /></span>
                      </div>
                      <div className="po-section">
                        <div className="po-label">Show columns</div>
                        {ALL_COLS.map((col) =>
                        <label key={col.id} className={`po-row ${col.required ? "disabled" : ""}`}>
                            <input type="checkbox"
                          checked={!!visibleCols[col.id]}
                          disabled={col.required}
                          onChange={(e) => setVisibleCols({ ...visibleCols, [col.id]: e.target.checked })} />
                            <span>{col.label}{col.required && <em style={{ color: "var(--ink-3)", fontStyle: "normal", marginLeft: 6, fontSize: 11 }}>required</em>}</span>
                          </label>
                        )}
                      </div>
                      <div className="po-foot">
                        <button className="btn btn-ghost" onClick={() => setVisibleCols(Object.fromEntries(ALL_COLS.map((c) => [c.id, true])))}>Reset</button>
                        <button className="btn btn-primary" onClick={() => setColsOpen(false)}>Done</button>
                      </div>
                    </div>
                    }
                </div>
              </div>
            </div>
            <CampaignTable rows={rows} onApply={applyChange} insightLevel={t.insightLevel} onProductOpen={(product, campaign) => setSelectedProduct({ product, campaign })} visibleCols={visibleCols} focus={focus} />
          </div>

          <div style={{ fontSize: 12, color: "var(--ink-3)", textAlign: "center", marginTop: 8, lineHeight: 1.6 }}>
            Recommendations are generated automatically from bid, budget, funnel and creative signals. <br />
            We only flag issues the advertising engine can improve.
          </div>
          </React.Fragment>
          }
        </div>
      </div>

      <GoalModal open={modalOpen} initial="bestsellers"
      onClose={() => setModalOpen(false)}
      onSelect={(g) => {
        setModalOpen(false);
        setGoal(g);
        setToast("Campaign goal set — dashboard re-tuned");
      }} />

      {tip && <Tip data={tip} />}
      {info && <InfoPanel open={!!info} anchorRect={info.rect} onClose={() => setInfo(null)} onGo={goToRecs} />}

      <div className={`toast ${toast ? "show" : ""}`}>
        <span className="tick-ico"><Icon.Check /></span>{toast}
      </div>

      <TweaksPanel>
        <TweakSection label="Icons" />
        <TweakRadio label="Icon size" value={t.iconSize}
        options={["small", "medium", "large"]}
        onChange={(v) => setTweak("iconSize", v)} />
        <TweakSection label="Layout" />
        <TweakRadio label="Density" value={t.density}
        options={["compact", "comfortable", "spacious"]}
        onChange={(v) => setTweak("density", v)} />
        <TweakSection label="Theme" />
        <TweakColor label="Accent color" value={t.accentColor}
        onChange={(v) => setTweak("accentColor", v)} />
        <TweakSection label="Features" />
        <TweakToggle label="Show explainability tips" value={t.showExplainability}
        onChange={(v) => setTweak("showExplainability", v)} />
        <TweakRadio label="Insight level" value={t.insightLevel}
        options={["campaign", "product"]}
        onChange={(v) => setTweak("insightLevel", v)} />
      </TweaksPanel>
    </div>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
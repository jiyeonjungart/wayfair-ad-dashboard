/* global React */
const { useState: useStateP } = React;

function ProductDetail({ product, campaign, onBack, onApply }) {
  const [tab, setTab] = useStateP("overview");

  // Synthesize a 28-day timeseries deterministically
  let seed = product.nm.length * 13 + (campaign.id.charCodeAt(1) || 99);
  const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  const series = Array.from({length: 28}, (_, i) => {
    const wobble = (rand() - 0.5) * 0.4;
    const trend = product.status === "bad" ? -i*0.008 : product.status === "good" ? i*0.005 : 0;
    return {
      day: i + 1,
      spend: Math.max(2, (product.spend / 28) * (1 + wobble + trend)),
      revenue: Math.max(2, (product.revenue / 28) * (1 + wobble + trend * 1.4)),
      impressions: Math.round(800 + rand() * 1400),
      clicks: Math.round(15 + rand() * 25),
    };
  });

  const REC_DETAILS = {
    scale: { title: "Increase budget allocation", primary: "Increase SKU budget", icon: "▲" },
    hold: { title: "Performing within target", primary: null, icon: "✓" },
    creative: { title: "Refresh creative", primary: "Request creative refresh", icon: "✦" },
    bid: { title: "Lower bid", primary: "Apply bid change", icon: "◆" },
    listing: { title: "Review listing quality", primary: "Open listing diagnostic", icon: "!" },
    pause: { title: "Consider pausing", primary: "Pause SKU", icon: "■" },
  };
  const rec = REC_DETAILS[product.rec.kind];

  const totalImp = series.reduce((s, d) => s + d.impressions, 0);
  const totalClicks = series.reduce((s, d) => s + d.clicks, 0);
  const cvr = (product.revenue / 80 / totalClicks * 100).toFixed(1); // synthetic conv

  // Build chart paths
  const W = 720, H = 180, P = 20;
  const maxR = Math.max(...series.map(d => d.revenue));
  const maxS = Math.max(...series.map(d => d.spend));
  const x = i => P + (i / (series.length - 1)) * (W - 2*P);
  const yR = v => H - P - (v / maxR) * (H - 2*P);
  const yS = v => H - P - (v / maxS) * (H - 2*P);
  const pathR = series.map((d, i) => `${i===0?"M":"L"}${x(i)},${yR(d.revenue)}`).join(" ");
  const pathS = series.map((d, i) => `${i===0?"M":"L"}${x(i)},${yS(d.spend)}`).join(" ");
  const areaR = pathR + ` L${x(series.length-1)},${H-P} L${x(0)},${H-P} Z`;

  return (
    <div className="product-detail">
      <div className="pd-back-bar">
        <button className="pd-back" onClick={onBack}>
          ← Back to campaigns
        </button>
        <div className="pd-breadcrumbs">
          <span className="bc">Campaigns</span>
          <span className="bc-sep">/</span>
          <span className="bc">{campaign.name}</span>
          <span className="bc-sep">/</span>
          <span className="bc current">{product.nm}</span>
        </div>
      </div>

      <div className="pd-hero">
        <div className="pd-hero-left">
          <div className="pd-eyebrow">SKU · {campaign.sub}</div>
          <h1 className="pd-title">{product.nm}</h1>
          <div className="pd-meta">
            <span className={`pd-status status-pill ${product.status === "good" ? "good" : product.status === "warn" ? "warn" : "bad"}`}>
              <span className="d"/>
              {product.status === "good" ? "Healthy" : product.status === "warn" ? "Attention" : "Needs Action"}
            </span>
            <span className="pd-divider"/>
            <span className="pd-meta-item">Part of <strong>{campaign.name}</strong></span>
            <span className="pd-divider"/>
            <span className="pd-meta-item">SKU ID · {campaign.id.toUpperCase()}-{product.nm.split(" ").map(w=>w[0]).join("").toUpperCase()}</span>
          </div>
        </div>
        <div className="pd-hero-right">
          {rec.primary && (
            <button className="btn btn-primary pd-cta" onClick={() => onApply(product.nm)}>
              {rec.icon} {rec.primary}
            </button>
          )}
          <button className="btn btn-secondary">View on Wayfair</button>
        </div>
      </div>

      <div className="pd-tabs">
        {["overview","performance","recommendations","creative","placements"].map(tb => (
          <button key={tb} className={`pd-tab ${tab===tb?"active":""}`} onClick={()=>setTab(tb)}>
            {tb.charAt(0).toUpperCase() + tb.slice(1)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="pd-content">
          <div className="pd-kpi-row">
            <div className="pd-kpi">
              <div className="pd-kpi-label">RoAS</div>
              <div className={`pd-kpi-val ${product.roas >= 200 ? "good" : product.roas >= 130 ? "warn" : "bad"}`}>
                {product.roas}%
              </div>
              <div className="pd-kpi-sub">Target: 180%</div>
            </div>
            <div className="pd-kpi">
              <div className="pd-kpi-label">Spend (28d)</div>
              <div className="pd-kpi-val">${Math.round(product.spend).toLocaleString()}</div>
              <div className="pd-kpi-sub">${(product.spend/28).toFixed(2)}/day avg</div>
            </div>
            <div className="pd-kpi">
              <div className="pd-kpi-label">Revenue (28d)</div>
              <div className="pd-kpi-val">${Math.round(product.revenue).toLocaleString()}</div>
              <div className="pd-kpi-sub">{product.roas >= 180 ? "+" : ""}{(product.roas - 180).toFixed(0)}% vs. target</div>
            </div>
            <div className="pd-kpi">
              <div className="pd-kpi-label">CTR</div>
              <div className="pd-kpi-val">{product.ctr}%</div>
              <div className="pd-kpi-sub">{(totalClicks/totalImp*100).toFixed(2)}% benchmark</div>
            </div>
            <div className="pd-kpi">
              <div className="pd-kpi-label">Impressions</div>
              <div className="pd-kpi-val">{totalImp.toLocaleString()}</div>
              <div className="pd-kpi-sub">{totalClicks.toLocaleString()} clicks</div>
            </div>
          </div>

          <div className="pd-chart-card">
            <div className="pd-chart-head">
              <div>
                <h3>Revenue · Spend</h3>
                <div className="pd-chart-sub">Last 28 days</div>
              </div>
              <div className="pd-chart-legend">
                <span><i style={{background:"#782b7f"}}/>Revenue</span>
                <span><i style={{background:"#a59726"}}/>Spend</span>
              </div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="pd-chart">
              <defs>
                <linearGradient id="pdRevFill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#782b7f" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#782b7f" stopOpacity="0"/>
                </linearGradient>
              </defs>
              {[0.25, 0.5, 0.75].map(p => (
                <line key={p} x1={P} x2={W-P} y1={P + (H-2*P)*p} y2={P + (H-2*P)*p}
                  stroke="#eee" strokeWidth="1"/>
              ))}
              <path d={areaR} fill="url(#pdRevFill)"/>
              <path d={pathR} fill="none" stroke="#782b7f" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d={pathS} fill="none" stroke="#a59726" strokeWidth="2" strokeDasharray="4 3" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="pd-cols">
            <div className="pd-card">
              <h4>Conversion funnel</h4>
              <div className="pd-funnel">
                {[
                  { lbl: "Impressions", n: totalImp.toLocaleString(), pct: 100 },
                  { lbl: "Clicks", n: totalClicks.toLocaleString(), pct: 8, problem: product.ctr < 1.2 },
                  { lbl: "Add to cart", n: Math.round(totalClicks * 0.18).toLocaleString(), pct: 4 },
                  { lbl: "Purchase", n: Math.round(totalClicks * cvr / 100).toLocaleString(), pct: 2 },
                ].map((f, i) => (
                  <div key={i} className={`pd-fstep ${f.problem ? "problem" : ""}`}>
                    <div className="pd-flbl">{f.lbl}</div>
                    <div className="pd-fbar"><i style={{ width: Math.max(f.pct, 4) + "%" }}/></div>
                    <div className="pd-fnum">{f.n}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="pd-card">
              <h4>Listing quality</h4>
              <div className="pd-listing">
                <div className="pd-listing-row">
                  <span>Hero image</span>
                  <span className="pd-score good">9.1 / 10</span>
                </div>
                <div className="pd-listing-row">
                  <span>Title clarity</span>
                  <span className="pd-score good">8.4 / 10</span>
                </div>
                <div className="pd-listing-row">
                  <span>Description completeness</span>
                  <span className={`pd-score ${product.ctr < 1.2 ? "warn" : "good"}`}>{product.ctr < 1.2 ? "6.2" : "8.0"} / 10</span>
                </div>
                <div className="pd-listing-row">
                  <span>Customer reviews</span>
                  <span className="pd-score good">4.6 ★ (218)</span>
                </div>
                <div className="pd-listing-row">
                  <span>Price competitiveness</span>
                  <span className="pd-score warn">Market avg +4%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "recommendations" && (
        <div className="pd-content">
          <div className={`pd-rec-hero ${product.status}`}>
            <div className="pd-rec-icon">{rec.icon}</div>
            <div>
              <div className="pd-rec-eyebrow">Primary recommendation</div>
              <h2 className="pd-rec-title">{rec.title}</h2>
              <p className="pd-rec-body">{product.rec.text}. Detailed projection and lever shown below.</p>
              {rec.primary && (
                <div style={{display:"flex",gap:8,marginTop:14}}>
                  <button className="btn btn-primary" onClick={() => onApply(product.nm)}>{rec.primary}</button>
                  <button className="btn btn-secondary">Customize</button>
                  <button className="btn btn-ghost">Dismiss</button>
                </div>
              )}
            </div>
          </div>
          <div className="pd-card" style={{marginTop:20}}>
            <h4>Other levers we considered</h4>
            <div style={{display:"flex",flexDirection:"column",gap:8,fontSize:13,marginTop:10}}>
              {[
                { nm: "Adjust bid", impact: "Med", effort: "Low", picked: product.rec.kind === "bid" },
                { nm: "Refresh creative", impact: "High", effort: "Med", picked: product.rec.kind === "creative" },
                { nm: "Expand keywords", impact: "Low", effort: "Low" },
                { nm: "Increase budget", impact: "High", effort: "Low", picked: product.rec.kind === "scale" },
                { nm: "Review listing", impact: "High", effort: "High", picked: product.rec.kind === "listing" },
              ].map((r, i) => (
                <div key={i} className={`pd-lever ${r.picked ? "picked" : ""}`}>
                  <span>{r.nm}</span>
                  <span className="pd-lever-meta">Impact: <b>{r.impact}</b> · Effort: <b>{r.effort}</b></span>
                  {r.picked && <span className="pd-lever-tag">Recommended</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "performance" && (
        <div className="pd-content">
          <div className="pd-card">
            <h4>Daily breakdown</h4>
            <table className="pd-table">
              <thead>
                <tr><th>Day</th><th style={{textAlign:"right"}}>Spend</th><th style={{textAlign:"right"}}>Revenue</th><th style={{textAlign:"right"}}>Impressions</th><th style={{textAlign:"right"}}>Clicks</th><th style={{textAlign:"right"}}>RoAS</th></tr>
              </thead>
              <tbody>
                {series.slice(-10).reverse().map((d, i) => (
                  <tr key={i}>
                    <td>Day {d.day}</td>
                    <td style={{textAlign:"right"}}>${d.spend.toFixed(2)}</td>
                    <td style={{textAlign:"right",fontWeight:600}}>${d.revenue.toFixed(2)}</td>
                    <td style={{textAlign:"right"}}>{d.impressions.toLocaleString()}</td>
                    <td style={{textAlign:"right"}}>{d.clicks}</td>
                    <td style={{textAlign:"right"}}>{Math.round(d.revenue/d.spend*100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "creative" && (
        <div className="pd-content">
          <div className="pd-card">
            <h4>Active creative</h4>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginTop:12}}>
              {[1,2,3].map(i => (
                <div key={i} className="pd-creative-card">
                  <div className="pd-creative-img" style={{background:`hsl(${(seed*i)%360}, 25%, 88%)`}}>
                    <span>{product.nm.split(" ").map(w=>w[0]).slice(0,2).join("")}</span>
                  </div>
                  <div className="pd-creative-meta">
                    <div style={{fontWeight:600}}>Variant {i}</div>
                    <div style={{fontSize:11,color:"var(--ink-3)"}}>CTR: {(product.ctr * (0.8 + i*0.15)).toFixed(2)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "placements" && (
        <div className="pd-content">
          <div className="pd-card">
            <h4>Top placements</h4>
            <table className="pd-table">
              <thead><tr><th>Placement</th><th style={{textAlign:"right"}}>Impressions</th><th style={{textAlign:"right"}}>Clicks</th><th style={{textAlign:"right"}}>Revenue</th></tr></thead>
              <tbody>
                {[
                  { p: "Search results — page 1", i: Math.round(totalImp * 0.42), c: Math.round(totalClicks * 0.55), r: product.revenue * 0.6 },
                  { p: "Category browse", i: Math.round(totalImp * 0.28), c: Math.round(totalClicks * 0.22), r: product.revenue * 0.18 },
                  { p: "Related products", i: Math.round(totalImp * 0.18), c: Math.round(totalClicks * 0.14), r: product.revenue * 0.12 },
                  { p: "Homepage promo", i: Math.round(totalImp * 0.12), c: Math.round(totalClicks * 0.09), r: product.revenue * 0.10 },
                ].map((r, i) => (
                  <tr key={i}>
                    <td>{r.p}</td>
                    <td style={{textAlign:"right"}}>{r.i.toLocaleString()}</td>
                    <td style={{textAlign:"right"}}>{r.c}</td>
                    <td style={{textAlign:"right",fontWeight:600}}>${Math.round(r.r).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

window.ProductDetail = ProductDetail;

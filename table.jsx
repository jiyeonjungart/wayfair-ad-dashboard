/* global React, Icon, CAMPAIGNS, EfficientFrontier */
const { useState: useStateT } = React;

function StatusPill({ s }) {
  const map = { good: { c: "good", t: "Healthy" }, warn: { c: "warn", t: "Attention" }, bad: { c: "bad", t: "Needs Action" } };
  const v = map[s];
  return <span className={`status-pill ${v.c}`}><span className="d" />{v.t}</span>;
}

function DeltaPill({ v, unit = "%" }) {
  const cls = v > 0 ? "up" : v < 0 ? "down" : "flat";
  const sign = v > 0 ? "+" : "";
  const I = v > 0 ? Icon.Arrow : v < 0 ? () => <Icon.Arrow dir="down" /> : Icon.Dash;
  return <span className={`k-delta ${cls}`}><I />{sign}{v}{unit}</span>;
}

function RecBlock({ rec, campaign, onChange }) {
  if (rec.kind === "bid-roas") {
    return (
      <div className="drawer">
        <div className="rec-block">
          <h4>Recommendation</h4>
          <div className="title">{rec.title}</div>
          <div className="body">{rec.body}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--line)", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Current bid</div>
              <div style={{ fontSize: 20, fontWeight: 700 }}>${campaign.currentBid.toFixed(2)}</div>
            </div>
            <div style={{ fontSize: 20, color: "var(--accent)" }}>→</div>
            <div>
              <div style={{ fontSize: 11, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Suggested bid</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>${campaign.suggestedBid.toFixed(2)}</div>
            </div>
            <div style={{ flex: 1, textAlign: "right", fontSize: 12, color: "var(--ink-2)" }}>
              <div>Projected revenue lift: <b style={{ color: "var(--good)" }}>+$10,800/mo</b></div>
              <div>Projected RoAS: <b>~260%</b> (still efficient)</div>
            </div>
          </div>
          <div className="rec-actions">
            <button className="btn btn-primary" onClick={onChange}>Apply bid change</button>
            <button className="btn btn-secondary">Customize bid</button>
            <button className="btn btn-ghost">Dismiss recommendation</button>
          </div>
        </div>
        <div className="frontier-card">
          <h4>RoAS Efficient Frontier</h4>
          <div className="sub">Why a high RoAS can be a problem.</div>
          <EfficientFrontier />
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6, lineHeight: 1.4 }}>
            Above the curve = under-bidding. Below = over-bidding. You want to sit in the sweet spot where an additional dollar of spend still returns more than it costs.
          </div>
        </div>
      </div>);

  }
  if (rec.kind === "funnel-ctr") {
    const funnel = [
    { lbl: "Impressions", n: "143,000", pct: 100, problem: false },
    { lbl: "Click-through", n: "858", pct: 0.6 * 30, problem: true },
    { lbl: "Add to cart", n: "104", pct: 8, problem: false },
    { lbl: "Purchase", n: "42", pct: 4, problem: false }];

    return (
      <div className="drawer">
        <div className="rec-block">
          <h4>Root-cause diagnosis</h4>
          <div className="title">{rec.title}</div>
          <div className="body">{rec.body}</div>
          <div className="mini-funnel">
            <h5>Product conversion funnel — where it's breaking</h5>
            {funnel.map((f, i) =>
            <div key={i} className={`fstep ${f.problem ? "problem" : ""}`}>
                <div className="lbl">{f.lbl}</div>
                <div className="bar"><i style={{ width: Math.max(f.pct, 4) + "%" }} /></div>
                <div className="num">{f.n}</div>
              </div>
            )}
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <span style={{ color: "var(--bad)", fontWeight: 600 }}>● Actionable drop-off</span>
              <span>CTR is below benchmark — likely a creative / listing issue.</span>
            </div>
          </div>
          <div className="rec-actions" style={{ marginTop: 14 }}>
            <button className="btn btn-primary">Review listing quality</button>
            <button className="btn btn-secondary">Request creative refresh</button>
            <button className="btn btn-ghost">Dismiss</button>
          </div>
        </div>
        <div className="frontier-card">
          <h4>What the ad system can't fix</h4>
          <div className="sub">Separating ad problems from product problems.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
            <div style={{ padding: "10px 12px", background: "#f4e9f6", borderRadius: 8, borderLeft: "3px solid var(--accent)" }}>
              <b>We can influence:</b> Impressions, CTR via bid & targeting.
            </div>
            <div style={{ padding: "10px 12px", background: "#fbf4fd", borderRadius: 8, borderLeft: "3px solid var(--accent-2)" }}>
              <b>Creative team can influence:</b> Thumbnail, title, copy → CTR quality.
            </div>
            <div style={{ padding: "10px 12px", background: "#f3dede", borderRadius: 8, borderLeft: "3px solid var(--bad)" }}>
              <b>Out of ad scope:</b> Add-to-cart rate, checkout friction, pricing.
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 10, lineHeight: 1.4 }}>
            We only flag issues the ad engine can realistically improve.
          </div>
        </div>
      </div>);

  }
  // budget
  return (
    <div className="drawer">
      <div className="rec-block">
        <h4>Recommendation</h4>
        <div className="title">{rec.title}</div>
        <div className="body">{rec.body}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", padding: "12px 14px", borderRadius: 10, border: "1px solid var(--line)", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Current daily cap</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>${campaign.budgetCap}</div>
          </div>
          <div style={{ fontSize: 20, color: "var(--accent)" }}>→</div>
          <div>
            <div style={{ fontSize: 11, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600 }}>Suggested cap</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>$165</div>
          </div>
          <div style={{ flex: 1, textAlign: "right", fontSize: 12, color: "var(--ink-2)" }}>
            <div>Unlocked impressions: <b style={{ color: "var(--good)" }}>+38%</b></div>
            <div>Projected sell-through: <b>78%</b> by target date</div>
          </div>
        </div>
        <div className="rec-actions">
          <button className="btn btn-primary" onClick={onChange}>Raise daily budget</button>
          <button className="btn btn-secondary">Schedule budget</button>
          <button className="btn btn-ghost">Dismiss</button>
        </div>
      </div>
      <div className="frontier-card">
        <h4>Prioritization</h4>
        <div className="sub">Why budget is the top lever here.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
          {[
          { nm: "Raise daily budget cap", eff: "High", ef: "Low", act: true },
          { nm: "Increase bid per click", eff: "Med", ef: "Low" },
          { nm: "Expand targeting keywords", eff: "Med", ef: "Med" },
          { nm: "Refresh creative", eff: "Low", ef: "High" }].
          map((r, i) =>
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 50px 50px", gap: 8, padding: "8px 10px", borderRadius: 6,
            background: r.act ? "#f4e9f6" : "#fafafc",
            border: r.act ? "1px solid #d8bbde" : "1px solid transparent" }}>
              <div style={{ fontWeight: r.act ? 700 : 500, color: r.act ? "var(--accent)" : "var(--ink)" }}>{r.nm}</div>
              <div style={{ fontSize: 11, color: "var(--ink-2)", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "var(--ink-3)" }}>Impact</div>{r.eff}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink-2)", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "var(--ink-3)" }}>Effort</div>{r.ef}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>);

}

function getProductRowsRaw(campaign) {
  const skuMatch = (campaign.sub || "").match(/(\d+)\s*SKU/i);
  const skuCount = skuMatch ? Math.min(parseInt(skuMatch[1], 10), 8) : 4;
  const pools = {
    "c1": ["Velvet Sloan 3-Seat Sofa", "Velvet Mira Loveseat", "Velvet Pierce Sectional", "Velvet Astor Chaise", "Velvet Halston Bench", "Velvet Ridge Ottoman", "Velvet Ellis Armchair", "Velvet Cleo Settee"],
    "c2": ["Oakwood Queen Platform", "Oakwood Queen Storage", "Oakwood Queen Canopy", "Oakwood Queen Slat", "Oakwood Headboard Set", "Oakwood Footboard Add-on"],
    "c3": ["Arcadia Dining Table 72\"", "Arcadia Dining Bench", "Arcadia Side Chair (set/4)"],
    "c4": ["Heritage Wool Rug 8x10", "Coastal Jute 6x9", "Persian Loom 5x8", "Shag Cloud 9x12", "Outdoor Weave 4x6", "Vintage Kilim 8x10", "Modern Geometric 6x9", "Soft Touch Plush 5x7"],
    "c5": ["Mid-Century Walnut Chair", "Mid-Century Velvet Tufted", "Mid-Century Boucle", "Mid-Century Leather", "Mid-Century Linen", "Mid-Century Curved Arm", "Mid-Century Swivel", "Mid-Century Lounger"],
    "c6": ["Bentwood Round Coffee Table", "Bentwood Oval Coffee Table"],
    "c7": ["Outdoor Sectional 5pc", "Outdoor Dining Set 7pc", "Outdoor Loveseat", "Outdoor Lounger", "Outdoor Side Table", "Outdoor Umbrella", "Outdoor Cushion Pack", "Outdoor Fire Pit"]
  };
  const names = pools[campaign.id] || Array.from({ length: skuCount }, (_, i) => `SKU #${i + 1}`);
  const products = names.slice(0, skuCount);
  let seed = campaign.id.charCodeAt(1) * 7;
  const rand = () => {seed = (seed * 9301 + 49297) % 233280;return seed / 233280;};
  const weights = products.map(() => 0.4 + rand());
  const wSum = weights.reduce((a, b) => a + b, 0);
  const ctrJitter = products.map(() => 0.7 + rand() * 0.7);
  const roasJitter = products.map(() => 0.6 + rand() * 0.9);
  return products.map((nm, i) => {
    const share = weights[i] / wSum;
    const spend = campaign.spend * share;
    const revenue = campaign.revenue * share * (0.7 + roasJitter[i] * 0.3);
    const roas = Math.round(revenue / spend * 100);
    const ctr = +(campaign.ctr * ctrJitter[i]).toFixed(2);
    let status, rec;
    if (roas >= 220) {
      status = "good";
      rec = ctr < campaign.ctr * 0.85 ?
      { kind: "scale", text: "Increase budget — high RoAS, room to scale" } :
      { kind: "hold", text: "Performing well — no action" };
    } else if (roas >= 140) {
      status = "warn";
      rec = ctr < 1.2 ?
      { kind: "creative", text: "Refresh creative — low CTR dragging RoAS" } :
      { kind: "bid", text: "Lower bid — diminishing returns" };
    } else {
      status = "bad";
      rec = ctr < 1.0 ?
      { kind: "listing", text: "Review listing quality — clicks not converting" } :
      { kind: "pause", text: "Consider pausing — RoAS below floor" };
    }
    return { nm, spend, revenue, roas, ctr, status, rec };
  });
}

// Ensure per-SKU product health is consistent with the campaign's overall status.
// e.g. a campaign flagged "Needs Action" must surface at least one SKU that needs action.
function reconcileProductRowsToCampaignStatus(rows, campaign) {
  if (!rows.length) return rows;
  const hasBad = rows.some((r) => r.status === "bad");
  const hasWarn = rows.some((r) => r.status === "warn");
  const demote = (r) => {
    // pick a rec that matches what the campaign-level recommendation is saying
    const kind = campaign.rec && campaign.rec.kind;
    let rec;
    if (kind === "bid-roas") {
      rec = { kind: "listing", text: "Under-bid — losing impressions to competitors" };
    } else if (kind === "budget") {
      rec = { kind: "listing", text: "Budget-capped — not reaching qualified shoppers" };
    } else if (kind === "funnel-ctr") {
      rec = { kind: "listing", text: "Review listing quality — clicks not converting" };
    } else {
      rec = r.ctr < 1.0 ?
      { kind: "listing", text: "Review listing quality — clicks not converting" } :
      { kind: "pause", text: "Consider pausing — RoAS below floor" };
    }
    return { ...r, status: "bad", rec };
  };
  const softDemote = (r) => ({
    ...r,
    status: "warn",
    rec: r.ctr < 1.2 ?
    { kind: "creative", text: "Refresh creative — low CTR dragging RoAS" } :
    { kind: "bid", text: "Lower bid — diminishing returns" }
  });

  if (campaign.status === "bad" && !hasBad) {
    // Demote the lowest-RoAS SKU to "bad".
    let worstIdx = 0;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].roas < rows[worstIdx].roas) worstIdx = i;
    }
    rows = rows.map((r, i) => i === worstIdx ? demote(r) : r);
  } else if (campaign.status === "warn" && !hasBad && !hasWarn) {
    let worstIdx = 0;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].roas < rows[worstIdx].roas) worstIdx = i;
    }
    rows = rows.map((r, i) => i === worstIdx ? softDemote(r) : r);
  }
  return rows;
}

function getProductRows(campaign) {
  return reconcileProductRowsToCampaignStatus(getProductRowsRaw(campaign), campaign);
}

function ProductBreakdown({ campaign, onApply, onProductOpen }) {
  const rows = getProductRows(campaign);
  const skuMatch = (campaign.sub || "").match(/(\d+)\s*SKU/i);
  const products = rows.map((r) => r.nm);
  const roasVals = rows.map((r) => r.roas);
  const maxR = Math.max(...roasVals);
  const minR = Math.min(...roasVals);
  let seed = campaign.id.charCodeAt(1) * 7;
  const [expProduct, setExpProduct] = useStateT(null);

  return (
    <div className="product-breakdown">
      <div className="pb-head">
        <h4>Product breakdown</h4>
        <div className="pb-sub">{products.length} of {skuMatch ? skuMatch[1] : products.length} SKUs in this campaign</div>
      </div>
      <table className="pb-table">
        <thead>
          <tr>
            <th style={{ width: 24 }}></th>
            <th>Product</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>RoAS</th>
            <th style={{ textAlign: "right" }}>Spend</th>
            <th style={{ textAlign: "right" }}>CTR</th>
            <th style={{ textAlign: "right" }}>Revenue</th>
            <th>Recommendation</th>
            <th style={{ width: 80 }}></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const tag = r.roas === maxR ? "top" : r.roas === minR && rows.length > 2 ? "bot" : null;
            const exp = expProduct === i;
            const actionable = r.rec.kind !== "hold";
            return (
              <React.Fragment key={i}>
                <tr className={exp ? "pb-expanded" : ""}
                onClick={() => setExpProduct(exp ? null : i)}
                onDoubleClick={(e) => {e.stopPropagation();onProductOpen && onProductOpen(r, campaign);}}
                title="Double-click to open product detail"
                style={{ cursor: "pointer" }}>
                  <td><span className={`expand-chev ${exp ? "open" : ""}`}><Icon.ChevronRight /></span></td>
                  <td>
                    <div className="pb-product">
                      <div>
                        <div className="pb-nm" style={{ fontSize: "13px" }}>{r.nm}</div>
                        {tag === "top" && <span className="pb-tag good">Top performer</span>}
                        {tag === "bot" && <span className="pb-tag bad">Underperforming</span>}
                      </div>
                    </div>
                  </td>
                  <td><StatusPill s={r.status} /></td>
                  <td style={{ textAlign: "right" }}>
                    <span className={`pb-roas ${r.roas >= 200 ? "good" : r.roas >= 130 ? "warn" : "bad"}`}>
                      {r.roas}%
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>${Math.round(r.spend).toLocaleString()}</td>
                  <td style={{ textAlign: "right" }}>{r.ctr}%</td>
                  <td style={{ textAlign: "right", fontWeight: 600 }}>${Math.round(r.revenue).toLocaleString()}</td>
                  <td>
                    <div className={`pb-rec ${r.status}`}>
                      <span className="pb-rec-icon">
                        {r.rec.kind === "scale" && "▲"}
                        {r.rec.kind === "hold" && "✓"}
                        {r.rec.kind === "creative" && "✦"}
                        {r.rec.kind === "bid" && "◆"}
                        {r.rec.kind === "listing" && "!"}
                        {r.rec.kind === "pause" && "■"}
                      </span>
                      <span className="pb-rec-text">{r.rec.text}</span>
                    </div>
                  </td>
                  <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                    {actionable &&
                    <button className="pb-take-action" onClick={() => setExpProduct(exp ? null : i)}>
                        {exp ? "Close" : "Take action"}
                      </button>
                    }
                  </td>
                </tr>
                {exp &&
                <tr className="pb-drawer-row">
                    <td colSpan={9}>
                      <ProductActionDrawer
                      product={r}
                      campaign={campaign}
                      onApply={(nm) => {onApply && onApply(nm);setExpProduct(null);}}
                      onDismiss={() => setExpProduct(null)} />
                    
                    </td>
                  </tr>
                }
              </React.Fragment>);

          })}
        </tbody>
      </table>
    </div>);

}

function ProductActionDrawer({ product, campaign, onApply, onDismiss }) {
  const REC_DETAILS = {
    scale: {
      title: "Increase budget allocation for this SKU",
      body: `${product.nm} is delivering ${product.roas}% RoAS — well above the campaign target. Shifting budget toward this SKU should drive incremental revenue without efficiency loss.`,
      primary: "Increase SKU budget",
      secondary: "Customize allocation",
      lever: { label: "Daily SKU budget", from: `$${(product.spend / 30).toFixed(2)}`, to: `$${(product.spend / 30 * 1.4).toFixed(2)}`, lift: "+$1,840 projected revenue/mo" }
    },
    hold: {
      title: "Performing within target — no action needed",
      body: `${product.nm} is hitting its goal metrics. We'll alert you if anything changes.`,
      primary: null, secondary: null, lever: null
    },
    creative: {
      title: "Refresh creative for this SKU",
      body: `Click-through rate (${product.ctr}%) is below benchmark, dragging down RoAS despite healthy impressions. The image, title, or copy is likely the bottleneck.`,
      primary: "Request creative refresh",
      secondary: "View current creative",
      lever: { label: "Current CTR", from: `${product.ctr}%`, to: "1.8% target", lift: "Closes ~60% of the RoAS gap" }
    },
    bid: {
      title: "Lower bid on this SKU",
      body: `${product.nm} is overbidding — RoAS sits at ${product.roas}% with diminishing returns. A small bid reduction will improve efficiency without losing meaningful volume.`,
      primary: "Apply bid change",
      secondary: "Customize bid",
      lever: { label: "Current bid", from: "$0.88", to: "$0.72", lift: "+18% RoAS, −5% impressions" }
    },
    listing: {
      title: "Review listing quality",
      body: `${product.nm} is getting clicks but not converting (CTR ${product.ctr}%, RoAS ${product.roas}%). The product detail page — images, description, reviews, price — is the likely culprit. The ad system can't fix this.`,
      primary: "Open listing diagnostic",
      secondary: "Flag for merch team",
      lever: null
    },
    pause: {
      title: "Pause this SKU",
      body: `RoAS is at ${product.roas}%, well below your floor. After ${Math.round(product.spend)}$ spent, the data suggests this SKU isn't a fit for paid placement right now.`,
      primary: "Pause SKU",
      secondary: "Keep running",
      lever: null
    }
  };
  const d = REC_DETAILS[product.rec.kind];
  return (
    <div className={`product-action ${product.status}`}>
      <div className="pa-head">
        <div className="pa-icon">
          {product.rec.kind === "scale" && "▲"}
          {product.rec.kind === "hold" && "✓"}
          {product.rec.kind === "creative" && "✦"}
          {product.rec.kind === "bid" && "◆"}
          {product.rec.kind === "listing" && "!"}
          {product.rec.kind === "pause" && "■"}
        </div>
        <div className="pa-titles">
          <div className="pa-eyebrow">SKU recommendation · {product.nm}</div>
          <div className="pa-title">{d.title}</div>
        </div>
      </div>
      <div className="pa-body">{d.body}</div>
      {d.lever &&
      <div className="pa-lever">
          <div className="pa-lever-col">
            <div className="pa-lever-label">{d.lever.label}</div>
            <div className="pa-lever-from">{d.lever.from}</div>
          </div>
          <div className="pa-arrow">→</div>
          <div className="pa-lever-col">
            <div className="pa-lever-label suggested">Suggested</div>
            <div className="pa-lever-to">{d.lever.to}</div>
          </div>
          <div className="pa-lift">{d.lever.lift}</div>
        </div>
      }
      {d.primary &&
      <div className="pa-actions">
          <button className="btn btn-primary" onClick={() => onApply(product.nm)}>{d.primary}</button>
          {d.secondary && <button className="btn btn-secondary">{d.secondary}</button>}
          <button className="btn btn-ghost" onClick={onDismiss}>Dismiss</button>
        </div>
      }
    </div>);

}

function CampaignTable({ rows, onApply, insightLevel = "campaign", onProductOpen, visibleCols, focus }) {
  const [expanded, setExpanded] = useStateT(null);
  React.useEffect(() => { if (focus && focus.id) setExpanded(focus.id); }, [focus]);
  const [hover, setHover] = useStateT(null);
  const productMode = insightLevel === "product";
  const vc = visibleCols || { campaign: true, status: true, insight: true, roas: true, spend: true, attrSpend: true, ctr: true, revenue: true };
  const colSpan = 1 + ["campaign", "status", "insight", "roas", "spend", "attrSpend", "ctr", "revenue"].filter((k) => vc[k]).length;

  // Pre-compute per-campaign product rollups for product mode
  const rollups = React.useMemo(() => {
    const m = {};
    rows.forEach((r) => {
      const prods = getProductRows(r);
      const bad = prods.filter((p) => p.status === "bad").length;
      const warn = prods.filter((p) => p.status === "warn").length;
      const good = prods.filter((p) => p.status === "good").length;
      const worstType = bad > 0 ? "bad" : warn > 0 ? "warn" : "good";
      m[r.id] = { total: prods.length, bad, warn, good, worstType };
    });
    return m;
  }, [rows]);

  return (
    <table className="campaigns">
      <thead>
        <tr>
          <th style={{ width: 30 }}></th>
          {vc.campaign && <th>Campaign</th>}
          {vc.status && <th>Status</th>}
          {vc.insight && <th>{productMode ? "Product Health" : "Insight"}</th>}
          {vc.roas && <th style={{ textAlign: "right" }}>RoAS</th>}
          {vc.spend && <th style={{ textAlign: "right" }}>Spend</th>}
          {vc.attrSpend && <th style={{ textAlign: "right" }}>Attributed Spend</th>}
          {vc.ctr && <th style={{ textAlign: "right" }}>CTR</th>}
          {vc.revenue && <th style={{ textAlign: "right" }}>Revenue</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const exp = expanded === r.id;
          const ru = rollups[r.id];
          return (
            <React.Fragment key={r.id}>
              <tr className={exp ? "expanded" : ""} onClick={() => setExpanded(exp ? null : r.id)}>
                <td><span className="expand-chev"><Icon.ChevronRight /></span></td>
                {vc.campaign && <td>
                  <div className="campaign-name">
                    <span className="nm">
                      <span className={`active-dot ${r.active ? "on" : "off"}`} title={r.active ? "Active" : "Paused"} />
                      {r.name}
                    </span>
                    <span className="sub">
                      <span className={`active-tag ${r.active ? "on" : "off"}`}>
                        {r.active ? "Active" : "Paused"}
                      </span>
                      {r.sub}
                    </span>
                  </div>
                </td>}
                {vc.status && <td><StatusPill s={r.status} /></td>}
                {vc.insight && <td style={{ position: "relative" }}
                onMouseEnter={() => setHover(r.id)} onMouseLeave={() => setHover(null)}>
                  {productMode ?
                  <div className="rollup-cell">
                      <div className="rollup-bar">
                        {ru.bad > 0 && <span className="seg bad" style={{ flex: ru.bad }} title={`${ru.bad} need action`} />}
                        {ru.warn > 0 && <span className="seg warn" style={{ flex: ru.warn }} title={`${ru.warn} attention`} />}
                        {ru.good > 0 && <span className="seg good" style={{ flex: ru.good }} title={`${ru.good} healthy`} />}
                      </div>
                      <div className="rollup-text">
                        {ru.bad > 0 && <span className="rt bad"><b>{ru.bad}</b> need action</span>}
                        {ru.warn > 0 && <span className="rt warn"><b>{ru.warn}</b> attention</span>}
                        {ru.bad === 0 && ru.warn === 0 && <span className="rt good">All {ru.total} healthy</span>}
                        <span className="rt sub">of {ru.total} SKUs</span>
                      </div>
                    </div> :

                  <span className={`insight-cell ${r.insightType}`}>
                      <span className="ico">
                        {r.insightType === "bad" ? <Icon.Alert /> : r.insightType === "warn" ? <Icon.Alert /> : <Icon.Check />}
                      </span>
                      {r.insight}
                    </span>
                  }
                  {!productMode && hover === r.id && r.rec &&
                  <div className="tip show" style={{ top: "100%", left: 16, marginTop: 6 }}>
                      <strong>Why this was flagged</strong>
                      <div style={{ marginTop: 4 }}>{r.rec.body.slice(0, 140)}…</div>
                      <div style={{ marginTop: 6, fontSize: 11, opacity: .7 }}>Click the row for full recommendation.</div>
                    </div>
                  }
                </td>}
                {vc.roas && <td style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600 }}>{r.roas}%</div>
                  <div style={{ fontSize: 11, color: r.roasDelta > 0 ? "var(--good)" : "var(--bad)" }}>
                    {r.roasDelta > 0 ? "+" : ""}{r.roasDelta}%
                  </div>
                </td>}
                {vc.spend && <td style={{ textAlign: "right" }}>${r.spend.toLocaleString()}</td>}
                {vc.attrSpend && <td style={{ textAlign: "right" }}>
                  <div>${(r.attrSpend ?? Math.round(r.spend * 0.88)).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "var(--ink-3)" }}>
                    {Math.round((r.attrSpend ?? r.spend * 0.88) / r.spend * 100)}% of spend
                  </div>
                </td>}
                {vc.ctr && <td style={{ textAlign: "right" }}>{r.ctr}%</td>}
                {vc.revenue && <td style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 600 }}>${r.revenue.toLocaleString()}</div>
                  {typeof r.revenueDelta === "number" &&
                  <div style={{ fontSize: 11, color: r.revenueDelta > 0 ? "var(--good)" : "var(--bad)" }}>
                      {r.revenueDelta > 0 ? "+" : ""}{r.revenueDelta}%
                    </div>
                  }
                </td>}
              </tr>
              {exp && productMode &&
              <tr className="drawer-row"><td colSpan={colSpan}>
                  <ProductBreakdown campaign={r} onApply={onApply} onProductOpen={onProductOpen} />
                </td></tr>
              }
              {exp && !productMode && r.rec &&
              <tr className="drawer-row"><td colSpan={colSpan}>
                  <RecBlock rec={r.rec} campaign={r} onChange={() => onApply(r.name)} />
                  <ProductBreakdown campaign={r} onApply={onApply} onProductOpen={onProductOpen} />
                </td></tr>
              }
              {exp && !productMode && !r.rec &&
              <tr className="drawer-row"><td colSpan={colSpan}>
                  <div className="drawer" style={{ gridTemplateColumns: "1fr" }}>
                    <div className="rec-block">
                      <h4>No action needed</h4>
                      <div className="title">Performing within target</div>
                      <div className="body">
                        This campaign is meeting its goal criteria. We'll let you know if anything changes.
                      </div>
                    </div>
                  </div>
                  <ProductBreakdown campaign={r} onApply={onApply} onProductOpen={onProductOpen} />
                </td></tr>
              }
            </React.Fragment>);

        })}
      </tbody>
    </table>);

}

window.CampaignTable = CampaignTable;
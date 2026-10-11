/* global React, Icon */
const { useState } = React;

function GoalModal({ open, onSelect, onClose, initial }) {
  const [picked, setPicked] = useState(initial || "bestsellers");

  const opts = [
  { id: "bestsellers", Ic: Icon.Crown, nm: "Boost Bestsellers",
    desc: "Promote products that are already performing well to amplify sales velocity.",
    down: "→ Analytics optimize for rank change, SoV, and units sold." },
  { id: "launch", Ic: Icon.Rocket, nm: "New Product Launch",
    desc: "Drive first-time visibility and review volume for a recently introduced product.",
    down: "→ Analytics optimize for new-buyer reach, CTR, and review growth." },
  { id: "inventory", Ic: Icon.Inventory, nm: "Faster Inventory Turnover",
    desc: "Clear aging stock or seasonal inventory before it depreciates.",
    down: "→ Analytics optimize for sell-through rate and days of supply left." },
  { id: "standard", Ic: Icon.Target, nm: "Standard Campaign",
    desc: "A general-purpose campaign with no specific goal optimization applied.",
    down: "→ Analytics show the classic generic metrics view." }];


  return (
    <div className={`modal-overlay ${open ? "open" : ""}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: "720px", height: "541px" }}>
        <h2>Your Goals <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-3)" }}>Step 1 of 4</span></h2>
        <div className="sub">What should this campaign achieve? Your choice tailors the dashboard, success criteria, and recommendations.</div>
        <div className="goal-grid">
          {opts.map((o) =>
          <div key={o.id} className={`goal-opt ${picked === o.id ? "selected" : ""}`} onClick={() => setPicked(o.id)}>
              <div className="icon"><o.Ic /></div>
              <div className="nm">{o.nm}</div>
              <div className="desc">{o.desc}</div>
              <div className="downstream">{o.down}</div>
            </div>
          )}
        </div>
        <div className="modal-foot">
          <span className="hint">You can change this later from campaign settings.</span>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary">
              Continue <Icon.ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>);

}
window.GoalModal = GoalModal;
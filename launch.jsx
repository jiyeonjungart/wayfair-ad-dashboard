/* global React, Icon */
const { useState: useStateL } = React;

function LaunchMilestones({ goal }) {
  if (goal !== "launch" && goal !== "all") return null;

  const [done, setDone] = useStateL({
    photos: true,
    keywords: true,
    reviews: false,
    bid: false,
  });

  const items = [
    { k: "photos", ic: "Camera", title: "Upload 5+ photos", cap: "2 more to unlock boosted placements" },
    { k: "keywords", ic: "Tag", title: "Keyword coverage", cap: "Targeting 24/30 recommended terms" },
    { k: "reviews", ic: "Star", title: "Collect first 10 reviews", cap: "3 of 10 — send review requests" },
    { k: "bid", ic: "Bolt", title: "Set launch boost bid", cap: "Set a 30-day boost bid to accelerate" },
  ];

  const completed = Object.values(done).filter(Boolean).length;
  const pct = (completed/items.length)*100;

  return (
    <div className="launch-card">
      <div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"4px 10px",background:"rgba(151,71,255,0.2)",
          borderRadius:999,fontSize:11,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",color:"#e0bce8"}}>
          <Icon.Rocket/> Launch Readiness
        </div>
        <h3 style={{marginTop:10}}>Arcadia Dining Set 2026</h3>
        <div className="launch-sub">
          Complete these actions to unlock better placement and stronger early performance. Products that hit 100% readiness see <b style={{color:"#fff"}}>2.3× faster</b> time-to-first-sale on average.
        </div>
        <div className="launch-progress"><i style={{width: pct+"%"}}/></div>
        <div className="launch-progress-text">{completed} of {items.length} milestones complete · {Math.round(pct)}% ready</div>
      </div>
      <div className="milestones">
        {items.map(it => {
          const Ic = Icon[it.ic];
          return (
            <div key={it.k} className={`milestone ${done[it.k]?"done":""}`}
              onClick={() => setDone({...done, [it.k]: !done[it.k]})}>
              <span className="tick"><Icon.Check/></span>
              <div className="badge"><Ic/></div>
              <div className="title">{it.title}</div>
              <div className="cap">{it.cap}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
window.LaunchMilestones = LaunchMilestones;

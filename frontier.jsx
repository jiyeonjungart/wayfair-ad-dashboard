/* global React */
function EfficientFrontier() {
  const W = 420, H = 260, cx = 40, cy = 230, R = 190;
  const zones = [
    { from: 0, to: 150, color: "#d9b8d9", label: null },
    { from: 150, to: 250, color: "#f5eeb0", label: "150%" },
    { from: 250, to: 600, color: "#8fce8f", label: "250%" },
    { from: 600, to: 750, color: "#f5eeb0", label: "600%" },
    { from: 750, to: 1000, color: "#d9b8d9", label: "750%" },
  ];
  const maxVal = 1000;
  const angleFor = v => (v / maxVal) * (Math.PI / 2);
  const arcPath = (a0, a1) => {
    const x0 = cx + R * Math.cos(Math.PI/2 - a0), y0 = cy - R * Math.sin(Math.PI/2 - a0);
    const x1 = cx + R * Math.cos(Math.PI/2 - a1), y1 = cy - R * Math.sin(Math.PI/2 - a1);
    return `M${cx},${cy} L${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} Z`;
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"flex-end"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"85%",maxWidth:520,height:"auto",display:"block"}}>
        <line x1={cx} y1={cy} x2={cx} y2={20} stroke="#4a4550" strokeWidth="1.5" markerEnd="url(#arrY)"/>
        <line x1={cx} y1={cy} x2={W-30} y2={cy} stroke="#4a4550" strokeWidth="1.5" markerEnd="url(#arrX)"/>
        <defs>
          <marker id="arrY" viewBox="0 0 10 10" refX="5" refY="0" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,10 L5,0 L10,10 Z" fill="#4a4550"/>
          </marker>
          <marker id="arrX" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 Z" fill="#4a4550"/>
          </marker>
        </defs>
        {zones.map((z, i) => (
          <path key={i} d={arcPath(angleFor(z.from), angleFor(z.to))} fill={z.color} opacity="0.85"/>
        ))}
        {[150, 250, 600, 750].map((v, i) => {
          const a = angleFor(v);
          const x = cx + R * Math.cos(Math.PI/2 - a), y = cy - R * Math.sin(Math.PI/2 - a);
          return (
            <g key={i}>
              <line x1={cx} y1={cy} x2={x} y2={y} stroke="#666" strokeWidth="1" strokeDasharray="2 2"/>
              <text x={x + (i<2 ? -4 : 4)} y={cy + 18} fontSize="13" fill="#333" textAnchor="middle" fontWeight="600">{v}%</text>
            </g>
          );
        })}
        <text x={cx + R * Math.cos(Math.PI/2 - angleFor(425))}
              y={cy - R * Math.sin(Math.PI/2 - angleFor(425)) - 8}
              fontSize="14" fill="#2d5a2d" fontWeight="700" textAnchor="middle">250%–600%</text>
        <text x={cx - 26} y={cy - R + 10} fontSize="13" fill="#333" fontWeight="600" transform={`rotate(-90 ${cx-26} ${cy-R+10})`}>Sale Volume</text>
        <text x={W - 30} y={cy + 30} fontSize="13" fill="#333" fontWeight="600" textAnchor="end">ROAs</text>
      </svg>
      </div>
      <div style={{fontSize:11,color:"var(--accent)",fontWeight:700,textAlign:"center",marginTop:4}}>
        Shown only when the recommendation is low bid due to high RoAS
      </div>
    </div>
  );
}
window.EfficientFrontier = EfficientFrontier;

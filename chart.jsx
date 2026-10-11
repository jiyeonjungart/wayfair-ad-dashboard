/* global React */
const { useRef: useRefC, useEffect: useEffectC, useState: useStateC } = React;

function SpendChart({ highlightDip }) {
  const days = ["6/01","6/03","6/05","6/07","6/09","6/11","6/13","6/15","6/17","6/19","6/21","6/23","6/25","6/27","6/29","7/01"];
  const spend   = [380, 420, 460, 510, 540, 590, 620, 650, 710, 740, 790, 820, 840, 860, 520, 460];
  const imprs   = [18, 22, 26, 30, 32, 36, 41, 44, 48, 52, 57, 61, 63, 65, 38, 30];

  const W = 960, H = 280, padL = 44, padR = 24, padT = 16, padB = 34;
  const chartW = W - padL - padR, chartH = H - padT - padB;
  const xs = days.map((_,i) => padL + (i/(days.length-1)) * chartW);
  const maxS = 1000, maxI = 70;
  const ysSpend = spend.map(v => padT + chartH - (v/maxS)*chartH);
  const ysImpr = imprs.map(v => padT + chartH - (v/maxI)*chartH);

  const line = (pts) => pts.map((p,i)=> (i?"L":"M")+p[0]+","+p[1]).join(" ");
  const area = (pts) => line(pts) + ` L ${pts[pts.length-1][0]} ${padT+chartH} L ${pts[0][0]} ${padT+chartH} Z`;

  const spendPts = xs.map((x,i)=>[x, ysSpend[i]]);
  const imprPts = xs.map((x,i)=>[x, ysImpr[i]]);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="280">
      <defs>
        <linearGradient id="gradSpend" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#782b7f" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#782b7f" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0,0.25,0.5,0.75,1].map((t,i)=>(
        <g key={i}>
          <line x1={padL} x2={W-padR} y1={padT+chartH*(1-t)} y2={padT+chartH*(1-t)} stroke="#f1eff3" />
          <text x={padL-8} y={padT+chartH*(1-t)+4} fontSize="10" fill="#8a8690" textAnchor="end">
            ${Math.round(maxS*t)}
          </text>
        </g>
      ))}
      {highlightDip && (
        <g>
          <rect x={xs[13]-10} y={padT} width={xs[15]-xs[13]+20} height={chartH}
            fill="rgba(197,69,73,0.08)" stroke="#c54549" strokeDasharray="3 3" rx="4" />
          <text x={xs[14]} y={padT+14} fontSize="10" fill="#c54549" textAnchor="middle" fontWeight="600">
            Budget cap hit
          </text>
        </g>
      )}
      <path d={area(spendPts)} fill="url(#gradSpend)" />
      <path d={line(spendPts)} fill="none" stroke="#782b7f" strokeWidth="2" />
      <path d={line(imprPts)} fill="none" stroke="#a59726" strokeWidth="1.6" strokeDasharray="4 3" />
      {xs.map((x,i)=>(
        <g key={i}>
          <circle cx={x} cy={ysSpend[i]} r="3" fill="#fff" stroke="#782b7f" strokeWidth="1.6" />
          {i%2===0 && <text x={x} y={H-12} fontSize="10" fill="#8a8690" textAnchor="middle">{days[i]}</text>}
        </g>
      ))}
    </svg>
  );
}
window.SpendChart = SpendChart;

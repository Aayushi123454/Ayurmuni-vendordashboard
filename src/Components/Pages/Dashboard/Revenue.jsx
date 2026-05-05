import { useState, useRef, useCallback } from "react";
import "./Revenue.css";


const monthlyData = [
  { month: "Jan", profit: 18000, invest: 22000 },
  { month: "Feb", profit: 15000, invest: 25000 },
  { month: "Mar", profit: 22000, invest: 20000 },
  { month: "Apr", profit: 19000, invest: 28000 },
  { month: "May", profit: 28000, invest: 24000 },
  { month: "Jun", profit: 24000, invest: 33000 },
  { month: "Jul", profit: 35000, invest: 26000 },
  { month: "Aug", profit: 28000, invest: 38000 },
  { month: "Sep", profit: 20000, invest: 32000 },
];


const SVG_W = 700;
const SVG_H = 260;
const PAD = { top: 30, right: 30, bottom: 40, left: 20 };
const INNER_W = SVG_W - PAD.left - PAD.right;
const INNER_H = SVG_H - PAD.top - PAD.bottom;


function formatRs(value) {
  if (value >= 1000) return `Rs. ${(value / 1000).toFixed(0)}K`;
  return `Rs. ${value}`;
}

function getPoints(data, key, minV, maxV) {
  return data.map((d, i) => {
    const x = PAD.left + (i / (data.length - 1)) * INNER_W;
    const y = PAD.top + INNER_H - ((d[key] - minV) / (maxV - minV)) * INNER_H;
    return [x, y];
  });
}

function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cp1x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) / 3;
    const cp1y = pts[i][1];
    const cp2x = pts[i + 1][0] - (pts[i + 1][0] - pts[i][0]) / 3;
    const cp2y = pts[i + 1][1];
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
}

function areaPath(pts) {
  const line = smoothPath(pts);
  const lastX = pts[pts.length - 1][0];
  const firstX = pts[0][0];
  return `${line} L ${lastX},${SVG_H - PAD.bottom} L ${firstX},${SVG_H - PAD.bottom} Z`;
}


export default function RevenueChart() {
  const [activeIdx, setActiveIdx] = useState(6); // July by default
  const svgRef = useRef(null);

  const allValues = monthlyData.flatMap((d) => [d.profit, d.invest]);
  const minV = Math.min(...allValues) * 0.85;
  const maxV = Math.max(...allValues) * 1.05;

  const profitPts = getPoints(monthlyData, "profit", minV, maxV);
  const investPts = getPoints(monthlyData, "invest", minV, maxV);

  const profitLinePath = smoothPath(profitPts);
  const investLinePath = smoothPath(investPts);
  const profitAreaPath = areaPath(profitPts);
  const investAreaPath = areaPath(investPts);

  const handleMouseMove = useCallback((e) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scaleX = SVG_W / rect.width;
    const mx = (e.clientX - rect.left) * scaleX - PAD.left;
    const step = INNER_W / (monthlyData.length - 1);
    const idx = Math.round(mx / step);
    setActiveIdx(Math.max(0, Math.min(monthlyData.length - 1, idx)));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setActiveIdx(6);
  }, []);

  const active = monthlyData[activeIdx];
  const px = profitPts[activeIdx];
  const ix = investPts[activeIdx];

  const toPercX = (x) => `${(x / SVG_W) * 100}%`;
  const toPercY = (y) => `${(y / SVG_H) * 100}%`;

  return (
    <div className="revnue-section">
     
      <div className="rc-header">
        <span className="rc-title">Revenue</span>
        <span className="rc-amount">Rs. 125,200</span>
        <span className="rc-badge">+15% Compared to last month</span>
        <button className="rc-period">Monthly</button>
      </div>

     
      <div className="rc-legend">
        <div className="rc-legend-item">
          <div className="rc-dot rc-dot--profit" />
          Profit
        </div>
        <div className="rc-legend-item">
          <div className="rc-dot rc-dot--invest" />
          Invest
        </div>
      </div>

  
      <div
        className="rc-chart-area"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="gInvest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
            </linearGradient>
          </defs>

         
          {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
            const y = PAD.top + INNER_H * (1 - t);
            return (
              <line
                key={i}
                x1={PAD.left} y1={y}
                x2={PAD.left + INNER_W} y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            );
          })}

         
          <path d={investAreaPath} fill="url(#gInvest)" />
          <path d={profitAreaPath} fill="url(#gProfit)" />

       
          <path d={investLinePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={profitLinePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

          
          {activeIdx !== null && (
            <line
              x1={px[0]} y1={PAD.top}
              x2={px[0]} y2={SVG_H - PAD.bottom}
              stroke="#d1d5db"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          )}

          
          {monthlyData.map((d, i) => (
            <text
              key={d.month}
              x={profitPts[i][0]}
              y={SVG_H - 8}
              textAnchor="middle"
              fontSize="12"
              fill={i === activeIdx ? "#111827" : "#9ca3af"}
              fontWeight={i === activeIdx ? "700" : "400"}
              fontFamily="DM Sans, sans-serif"
            >
              {d.month}
            </text>
          ))}

          
          {activeIdx !== null && (
            <>
              <circle cx={px[0]} cy={px[1]} r="5" fill="#fff" stroke="#10b981" strokeWidth="2.5" />
              <circle cx={ix[0]} cy={ix[1]} r="5" fill="#fff" stroke="#3b82f6" strokeWidth="2.5" />
            </>
          )}
        </svg>

      
        {activeIdx !== null && (
          <>
           
            <div className="rc-tooltip" style={{ left: toPercX(px[0]), top: toPercY(px[1] - 34) }}>
              <div className="rc-tooltip-profit">{formatRs(active.profit)}</div>
            </div>

            
            <div className="rc-tooltip" style={{ left: toPercX(ix[0]), top: toPercY(ix[1] - 34) }}>
              <div className="rc-tooltip-invest">{formatRs(active.invest)}</div>
            </div>

           
            <div className="rc-tooltip" style={{ left: toPercX(px[0]), bottom: "2px" }}>
              <div className="rc-month-label">{active.month}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
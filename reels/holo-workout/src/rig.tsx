// 2D front-view rig: poses are joint positions, interpolated per move.
import React from 'react';
import {C} from './theme';

type P2 = [number, number];
export type Pose = Record<'head' | 'neck' | 'lS' | 'rS' | 'lE' | 'rE' | 'lHd' | 'rHd' | 'pel' | 'lHp' | 'rHp' | 'lK' | 'rK' | 'lF' | 'rF', P2>;

const S: Pose = {
  head: [0, -835], neck: [0, -760], lS: [-108, -722], rS: [108, -722], lE: [-128, -575], rE: [128, -575],
  lHd: [-118, -430], rHd: [118, -430], pel: [0, -440], lHp: [-62, -430], rHp: [62, -430],
  lK: [-70, -225], rK: [70, -225], lF: [-76, -10], rF: [76, -10],
};
const w = (o: Partial<Pose>): Pose => ({...S, ...o});

const SQUAT = w({head: [0, -645], neck: [0, -570], lS: [-108, -532], rS: [108, -532], lE: [-120, -450], rE: [120, -450], lHd: [-92, -555], rHd: [92, -555], pel: [0, -250], lHp: [-66, -245], rHp: [66, -245], lK: [-160, -180], rK: [160, -180], lF: [-92, -10], rF: [92, -10]});
const PRESS = w({lE: [-128, -880], rE: [128, -880], lHd: [-118, -1030], rHd: [118, -1030]});
const HANG = w({head: [0, -800], neck: [0, -730], lS: [-108, -695], rS: [108, -695], lE: [-120, -555], rE: [120, -555], lHd: [-100, -420], rHd: [100, -420], lK: [-80, -215], rK: [80, -215], pel: [0, -425], lHp: [-62, -415], rHp: [62, -415]});
const RACK = w({lE: [-122, -610], rE: [122, -610], lHd: [-100, -735], rHd: [100, -735]});
const BENT = w({head: [0, -660], neck: [0, -615], lS: [-122, -590], rS: [122, -590], pel: [0, -470], lHp: [-72, -470], rHp: [72, -470], lK: [-118, -250], rK: [118, -250], lF: [-112, -10], rF: [112, -10], lE: [-132, -440], rE: [132, -440], lHd: [-122, -295], rHd: [122, -295]});
const MARCH = w({rE: [128, -880], rHd: [118, -1035]});

const lerp = (a: Pose, b: Pose, u: number): Pose => {
  const o: any = {};
  for (const k of Object.keys(a)) o[k] = [a[k][0] + (b[k][0] - a[k][0]) * u, a[k][1] + (b[k][1] - a[k][1]) * u];
  return o;
};
const cyc = (t: number, period: number) => 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / period);

/** pose of a move at local time t (seconds since the move started) */
export const poseAt = (move: string, t: number): Pose => {
  if (move === 'thruster') return lerp(SQUAT, PRESS, cyc(t, 1.3));
  if (move === 'clean') {
    const u = cyc(t, 1.3);
    const p = lerp(HANG, RACK, u);
    const dip = Math.sin(u * Math.PI) * 45; // small knee dip through the catch
    for (const k of ['head', 'neck', 'lS', 'rS', 'lE', 'rE', 'lHd', 'rHd', 'pel', 'lHp', 'rHp'] as const) p[k] = [p[k][0], p[k][1] + dip];
    p.lK = [p.lK[0] - dip * 0.5, p.lK[1] + dip * 0.5];
    p.rK = [p.rK[0] + dip * 0.5, p.rK[1] + dip * 0.5];
    return p;
  }
  if (move === 'row') {
    const ph = (t % 1.2) / 1.2;
    const r = Math.max(0, Math.sin(ph * 2 * Math.PI)), l = Math.max(0, -Math.sin(ph * 2 * Math.PI));
    const p = lerp(BENT, BENT, 0);
    p.rE = [132 + 80 * r, -440 - 200 * r];
    p.rHd = [122 + 30 * r, -295 - 230 * r];
    p.lE = [-132 - 80 * l, -440 - 200 * l];
    p.lHd = [-122 - 30 * l, -295 - 230 * l];
    return p;
  }
  // march: alternate knees, right DB overhead, left DB at the side
  const ph = (t % 1.8) / 1.8;
  const L = Math.max(0, Math.sin(ph * 2 * Math.PI)), R = Math.max(0, -Math.sin(ph * 2 * Math.PI));
  const p = lerp(MARCH, MARCH, 0);
  p.lK = [-70 + 15 * L, -225 - 245 * L];
  p.lF = [-76 + 6 * L, -10 - 270 * L];
  p.rK = [70 - 15 * R, -225 - 245 * R];
  p.rF = [76 - 6 * R, -10 - 270 * R];
  return p;
};

const LIMB = {arm: 46, fore: 40, thigh: 66, shin: 52};

const Dumbbell: React.FC<{x: number; y: number; tint: string}> = ({x, y, tint}) => {
  const hex = (cx: number) => {
    const pts = Array.from({length: 6}, (_, i) => `${cx + Math.cos((i * Math.PI) / 3 + Math.PI / 6) * 30},${y + Math.sin((i * Math.PI) / 3 + Math.PI / 6) * 30}`).join(' ');
    return <polygon points={pts} fill={C.body} stroke={tint} strokeWidth={5} />;
  };
  return (
    <g>
      <rect x={x - 46} y={y - 7} width={92} height={14} rx={7} fill={tint} />
      {hex(x - 52)}
      {hex(x + 52)}
    </g>
  );
};

/** the hologram athlete. tint lets the glitch draw red/cyan ghost copies */
export const Figure: React.FC<{p: Pose; tint?: string; db?: string; ghost?: boolean}> = ({p, tint = C.accent, db = C.accent2, ghost}) => {
  const seg = (a: P2, b: P2, wdt: number, k: string) => (
    <g key={k}>
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={tint} strokeWidth={wdt + 8} strokeLinecap="round" />
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={ghost ? 'none' : 'url(#holo-scan)'} strokeWidth={wdt} strokeLinecap="round" />
    </g>
  );
  const joint = (q: P2, k: string) => <circle key={k} cx={q[0]} cy={q[1]} r={9} fill="#fff" opacity={ghost ? 0 : 0.95} />;
  const mix = (a: P2, b: P2, k: number): P2 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const lW = mix(p.lS, p.lHp, 0.62), rW = mix(p.rS, p.rHp, 0.62);
  const waist = (q: P2, c: P2): P2 => [c[0] + (q[0] - c[0]) * 0.72, q[1]];
  const mid = mix(p.neck, p.pel, 0.62);
  const torso = [p.neck, p.rS, waist(rW, mid), p.rHp, p.pel, p.lHp, waist(lW, mid), p.lS].map((q) => q.join(',')).join(' ');
  const chestY = mix(p.neck, p.pel, 0.3);
  return (
    <g>
      {seg(p.lHp, p.lK, LIMB.thigh, 'lt')}
      {seg(p.lK, p.lF, LIMB.shin, 'ls')}
      {seg(p.rHp, p.rK, LIMB.thigh, 'rt')}
      {seg(p.rK, p.rF, LIMB.shin, 'rs')}
      <ellipse cx={p.lF[0] - 6} cy={p.lF[1] + 4} rx={42} ry={18} fill={tint} />
      <ellipse cx={p.rF[0] + 6} cy={p.rF[1] + 4} rx={42} ry={18} fill={tint} />
      <polygon points={torso} fill={tint} stroke={tint} strokeWidth={22} strokeLinejoin="round" />
      <polygon points={torso} fill={ghost ? 'none' : 'url(#holo-scan)'} stroke={ghost ? 'none' : C.body} strokeWidth={6} strokeLinejoin="round" />
      {!ghost && (
        <g stroke={tint} strokeWidth={3} opacity={0.7} fill="none">
          <line x1={p.neck[0]} y1={chestY[1] - 20} x2={p.pel[0]} y2={p.pel[1] - 10} />
          <path d={`M${p.lS[0] + 20},${chestY[1] - 30} Q${chestY[0] - 40},${chestY[1] + 25} ${chestY[0]},${chestY[1] + 5} Q${chestY[0] + 40},${chestY[1] + 25} ${p.rS[0] - 20},${chestY[1] - 30}`} />
          {[0.48, 0.62, 0.76].map((k) => { const q = mix(p.neck, p.pel, k); return <line key={k} x1={q[0] - 38} y1={q[1]} x2={q[0] + 38} y2={q[1]} />; })}
        </g>
      )}
      {seg(p.neck, p.head, 30, 'nk')}
      <circle cx={p.head[0]} cy={p.head[1]} r={52} fill={tint} />
      <circle cx={p.head[0]} cy={p.head[1]} r={44} fill={ghost ? 'none' : 'url(#holo-scan)'} />
      {seg(p.lS, p.lE, LIMB.arm, 'la')}
      {seg(p.lE, p.lHd, LIMB.fore, 'lf')}
      {seg(p.rS, p.rE, LIMB.arm, 'ra')}
      {seg(p.rE, p.rHd, LIMB.fore, 'rf')}
      {[p.lS, p.rS, p.lE, p.rE, p.lHp, p.rHp, p.lK, p.rK].map((q, i) => joint(q, `j${i}`))}
      <Dumbbell x={p.lHd[0]} y={p.lHd[1]} tint={ghost ? tint : db} />
      <Dumbbell x={p.rHd[0]} y={p.rHd[1]} tint={ghost ? tint : db} />
    </g>
  );
};

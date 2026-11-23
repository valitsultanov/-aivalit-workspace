// The coach as a graphite pencil sketch in a sketchbook: cross-hatching, paper grain,
// line boil every few frames like hand-drawn animation. Camera never moves.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {useT, rnd} from './anim';
import {cap, ell, d, Pt, rrect} from './geom';
import {poseAt} from './rig';

const W = 1080, H = 1920, FLOOR = 1520, SC = 1.12;
const INK = '#1C1C20', PAPER = '#F4F0E6';

const Pencil: React.FC<{pts: Pt[]; fill?: string; w?: number; double?: boolean; op?: number}> = ({pts, fill = PAPER, w = 4.4, double = true, op = 1}) => (
  <g opacity={op}>
    <path d={d(pts)} fill={fill} stroke={INK} strokeWidth={w} strokeLinejoin="round" />
    {double && <path d={d(pts)} fill="none" stroke={INK} strokeWidth={w * 0.45} strokeOpacity={0.55} transform="translate(2.5,-1.8)" />}
  </g>
);

const Line: React.FC<{a: Pt; b: Pt; w?: number; op?: number}> = ({a, b, w = 2.4, op = 0.85}) => (
  <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={INK} strokeWidth={w} strokeOpacity={op} strokeLinecap="round" />
);

const Dumbbell: React.FC<{x: number; y: number}> = ({x, y}) => {
  const hex = (cx: number): Pt[] => Array.from({length: 6}, (_, i) => [cx + Math.cos((i * Math.PI) / 3 + Math.PI / 6) * 32, y + Math.sin((i * Math.PI) / 3 + Math.PI / 6) * 32] as Pt);
  return (
    <g>
      <Pencil pts={rrect(x - 40, y - 8, 80, 16, 6, 2)} fill="url(#hatch-dark)" />
      <Pencil pts={hex(x - 54)} fill="url(#hatch-dark)" />
      <Pencil pts={hex(x + 54)} fill="url(#hatch-dark)" />
    </g>
  );
};

const Coach: React.FC<{t: number}> = ({t}) => {
  const p = poseAt('thruster', t); // starts in the squat, like the base frame
  const mix = (a: Pt, b: Pt, k: number): Pt => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
  const waist = (q: Pt, c: Pt): Pt => [c[0] + (q[0] - c[0]) * 0.78, q[1]];
  const mid = mix(p.neck as Pt, p.pel as Pt, 0.62);
  const lW = mix(p.lS as Pt, p.lHp as Pt, 0.62), rW = mix(p.rS as Pt, p.rHp as Pt, 0.62);
  const torso: Pt[] = [mix(p.neck as Pt, p.lS as Pt, 0.35), p.lS as Pt, waist(lW, mid), [p.lHp[0] - 14, p.lHp[1] + 20], [p.rHp[0] + 14, p.rHp[1] + 20], waist(rW, mid), p.rS as Pt, mix(p.neck as Pt, p.rS as Pt, 0.35)];
  const head = p.head as Pt;
  const smile = 0.5 + 0.5 * Math.sin(t * 2.2);
  return (
    <g>
      {/* ground shadow */}
      <ellipse cx={0} cy={6} rx={230} ry={34} fill="url(#hatch)" opacity={0.7} />
      {/* legs: cargo joggers, cuffs, white socks, low-top sneakers */}
      {[['l', p.lHp, p.lK, p.lF], ['r', p.rHp, p.rK, p.rF]].map(([k, hp, kn, ft]: any) => (
        <g key={k}>
          <Pencil pts={cap(hp[0], hp[1], kn[0], kn[1], 92, 8)} fill="url(#hatch-dark)" />
          <Pencil pts={cap(kn[0], kn[1], ft[0], ft[1] - 46, 74, 8)} fill="url(#hatch-dark)" />
          <Pencil pts={rrect((kn[0] + ft[0]) / 2 - 22 + (ft[0] - kn[0]) * 0.32, (kn[1] + ft[1]) / 2 + 10, 44, 46, 8, 2)} fill="url(#hatch-dark)" double={false} op={0.6} />
          <Pencil pts={rrect(ft[0] - 34, ft[1] - 64, 68, 26, 10, 2)} fill="url(#hatch-dark)" />
          <Pencil pts={rrect(ft[0] - 30, ft[1] - 40, 60, 26, 6, 2)} />
          <Pencil pts={[[ft[0] - 46, ft[1] - 14], [ft[0] + 50, ft[1] - 14], [ft[0] + 54, ft[1] + 10], [ft[0] - 50, ft[1] + 10]]} />
          <Line a={[ft[0] - 40, ft[1] - 2]} b={[ft[0] + 44, ft[1] - 2]} w={2} />
          <Pencil pts={rrect(ft[0] - 30, ft[1] - 28, 34, 14, 6, 2)} fill="url(#hatch-dark)" double={false} />
        </g>
      ))}
      {/* tank top, heavy cross-hatching */}
      <Pencil pts={torso} fill="url(#hatch-dark)" w={3.6} />
      <Line a={mix(p.neck as Pt, p.lS as Pt, 0.35)} b={[p.neck[0], p.neck[1] + 36]} w={3} />
      <Line a={[p.neck[0], p.neck[1] + 36]} b={mix(p.neck as Pt, p.rS as Pt, 0.35)} w={3} />
      {/* neck + head */}
      <Pencil pts={cap(p.neck[0], p.neck[1] + 20, head[0], head[1] + 30, 54, 6)} fill="url(#hatch-light)" />
      <Pencil pts={ell(head[0], head[1], 62, 72, 36)} fill={PAPER} w={4.4} />
      {/* curtain haircut with a middle part */}
      <Pencil pts={[[head[0] - 58, head[1] + 4], [head[0] - 60, head[1] - 40], [head[0] - 30, head[1] - 72], [head[0], head[1] - 76], [head[0] + 30, head[1] - 72], [head[0] + 60, head[1] - 40], [head[0] + 58, head[1] + 4], [head[0] + 40, head[1] - 26], [head[0] + 6, head[1] - 46], [head[0], head[1] - 40], [head[0] - 6, head[1] - 46], [head[0] - 40, head[1] - 26]]} fill="url(#hatch-dark)" />
      {/* glasses */}
      <Pencil pts={rrect(head[0] - 42, head[1] - 12, 34, 22, 4, 2)} fill="none" w={2.6} double={false} />
      <Pencil pts={rrect(head[0] + 8, head[1] - 12, 34, 22, 4, 2)} fill="none" w={2.6} double={false} />
      <Line a={[head[0] - 8, head[1] - 4]} b={[head[0] + 8, head[1] - 4]} w={2} />
      <circle cx={head[0] - 25} cy={head[1] - 1} r={3.4} fill={INK} />
      <circle cx={head[0] + 25} cy={head[1] - 1} r={3.4} fill={INK} />
      <Line a={[head[0], head[1] + 6]} b={[head[0] - 4, head[1] + 22]} w={2} />
      <path d={`M${head[0] - 16},${head[1] + 36} Q${head[0]},${head[1] + 36 + 8 * smile} ${head[0] + 16},${head[1] + 35}`} stroke={INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      {/* huge arms: upper arm, forearm, hand + muscle contours */}
      {[['l', p.lS, p.lE, p.lHd, -1], ['r', p.rS, p.rE, p.rHd, 1]].map(([k, s, e, h, side]: any) => (
        <g key={k}>
          <Pencil pts={cap(s[0], s[1], e[0], e[1], 96, 10)} fill="url(#hatch-light)" />
          <Pencil pts={cap(e[0], e[1], h[0], h[1], 76, 10)} fill="url(#hatch-light)" />
          <path d={`M${s[0] + side * 10},${s[1] + 30} Q${(s[0] + e[0]) / 2 + side * 34},${(s[1] + e[1]) / 2} ${e[0] + side * 4},${e[1] - 10}`} stroke={INK} strokeWidth={1.8} strokeOpacity={0.6} fill="none" />
          <path d={`M${e[0]},${e[1] + 8} q${side * 14},${(h[1] - e[1]) * 0.4} ${(h[0] - e[0]) * 0.6},${(h[1] - e[1]) * 0.75}`} stroke={INK} strokeWidth={1.4} strokeOpacity={0.5} fill="none" />
          <Pencil pts={ell(s[0], s[1] + 10, 52, 40, 20)} fill="url(#hatch-light)" />
          <Dumbbell x={h[0]} y={h[1]} />
          <Pencil pts={ell(h[0], h[1] + 4, 28, 24, 16)} />
        </g>
      ))}
    </g>
  );
};

/* the gym, sketched lightly behind him */
const Gym: React.FC = () => (
  <g opacity={0.55}>
    <Line a={[120, FLOOR - 10]} b={[960, FLOOR - 16]} w={2.6} />
    <Line a={[60, FLOOR + 120]} b={[1020, FLOOR + 110]} w={1.6} op={0.4} />
    {/* dumbbell rack */}
    <Pencil pts={[[640, 1180], [960, 1180], [970, 1200], [630, 1200]]} double={false} w={2.2} />
    <Line a={[660, 1200]} b={[650, FLOOR - 14]} w={2.2} />
    <Line a={[940, 1200]} b={[950, FLOOR - 14]} w={2.2} />
    {[680, 740, 800, 860, 920].map((x) => <circle key={x} cx={x} cy={1160} r={20} fill="url(#hatch-dark)" stroke={INK} strokeWidth={2} />)}
    {/* soft spotlights */}
    {[220, 540, 860].map((x) => (
      <g key={x}>
        <Line a={[x - 40, 470]} b={[x + 40, 470]} w={2.4} />
        <path d={`M${x - 36},474 L${x - 150},${FLOOR - 30} M${x + 36},474 L${x + 150},${FLOOR - 30}`} stroke={INK} strokeWidth={1.2} strokeOpacity={0.25} strokeDasharray="10 14" />
      </g>
    ))}
  </g>
);

export const Sketch: React.FC = () => {
  const {t, frame} = useT();
  const boil = Math.floor(frame / 3) % 4; // new pencil wobble every 3 frames
  return (
    <AbsoluteFill style={{background: PAPER}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <pattern id="hatch-light" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
            <rect width="11" height="11" fill={PAPER} />
            <line x1="0" y1="0" x2="0" y2="11" stroke={INK} strokeWidth="1.5" strokeOpacity="0.6" />
          </pattern>
          <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
            <line x1="0" y1="0" x2="0" y2="7" stroke={INK} strokeWidth="1.3" strokeOpacity="0.6" />
          </pattern>
          <pattern id="hatch-dark" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#6E6A63" />
            <line x1="0" y1="0" x2="0" y2="6" stroke={INK} strokeWidth="2.4" />
            <line x1="0" y1="3" x2="6" y2="3" stroke={INK} strokeWidth="1.8" strokeOpacity="0.85" />
          </pattern>
          <filter id="pencil" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={boil + 1} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed={boil + 7} result="g" />
            <feColorMatrix in="g" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -0.9 0.75" result="holes" />
            <feComposite in="holes" in2="d" operator="in" result="gr" />
            <feMerge><feMergeNode in="d" /><feMergeNode in="gr" /></feMerge>
          </filter>
          <filter id="paper" filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75">
            <stop offset="0.6" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#5A4A30" stopOpacity="0.25" />
          </radialGradient>
        </defs>
        {/* sketchbook page: spiral binding and faint margin */}
        <line x1={0} y1={150} x2={W} y2={150} stroke="#C9BFAE" strokeWidth={2} />
        {Array.from({length: 13}, (_, i) => (
          <g key={i}>
            <circle cx={60 + i * 80} cy={95} r={12} fill="#CFC6B6" />
            <path d={`M${60 + i * 80},40 q22,30 0,55`} stroke="#8C8478" strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>
        ))}
        <g filter="url(#pencil)">
          <Gym />
          <g transform={`translate(540,${FLOOR}) scale(${SC})`}>
            <Coach t={t} />
          </g>
          {/* a few loose construction strokes, like an artist's warm-up lines */}
          {Array.from({length: 6}, (_, i) => (
            <path key={i} d={`M${120 + rnd(i) * 200},${1650 + rnd(i + 4) * 120} q120,${-20 + rnd(i + 9) * 40} ${260 + rnd(i + 2) * 120},${rnd(i + 3) * 30}`} stroke={INK} strokeOpacity={0.18} strokeWidth={1.6} fill="none" />
          ))}
        </g>
        <rect width={W} height={H} fill="#fff" filter="url(#paper)" opacity={0.18} style={{mixBlendMode: 'multiply'}} />
        <rect width={W} height={H} fill="url(#vig)" />
      </svg>
    </AbsoluteFill>
  );
};

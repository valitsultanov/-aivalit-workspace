// LEGO look for the X TOKEN reel: brick-mosaic space, a printed round tile coin,
// brick stairs, a minifigure astronaut and a brick-built planet.
import React from 'react';
import {C, FONT} from './theme';
import {clamp, E, p, rnd} from './anim';
import {T, end} from './timeline';

const W = 1080, H = 1920, B = 36; // brick size in px
const CIF = {colorInterpolationFilters: 'sRGB' as const};

export const L = {
  base: '#0B1E57', base2: '#13307E', purple: '#6B2FB0', teal: '#0099B5', magenta: '#C8338E',
  yellow: '#F8C21C', yellow2: '#FFE27A', yellowDark: '#B8860B', white: '#F4F4F4', red: '#D0261C', blue: '#1C6BD0',
};

const Pixelate = ({id, b}: {id: string; b: number}) => (
  <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H} {...CIF}>
    <feFlood x={b / 2 - 1} y={b / 2 - 1} width="2" height="2" floodColor="#000" />
    <feComposite width={b} height={b} />
    <feTile result="a" />
    <feComposite in="SourceGraphic" in2="a" operator="in" />
    <feMorphology operator="dilate" radius={b / 2} />
  </filter>
);

/** stud pattern: highlight top-left, shadow bottom-right, a round stud per brick */
const StudDefs = ({id, b = B}: {id: string; b?: number}) => (
  <>
    <radialGradient id={`${id}-g`} cx="0.35" cy="0.3" r="0.75">
      <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
      <stop offset="0.45" stopColor="#fff" stopOpacity="0.06" />
      <stop offset="1" stopColor="#000" stopOpacity="0.28" />
    </radialGradient>
    <pattern id={id} width={b} height={b} patternUnits="userSpaceOnUse">
      <rect width={b} height={b * 0.07} fill="#fff" fillOpacity="0.16" />
      <rect width={b * 0.07} height={b} fill="#fff" fillOpacity="0.12" />
      <rect y={b * 0.92} width={b} height={b * 0.08} fill="#000" fillOpacity="0.3" />
      <rect x={b * 0.92} width={b * 0.08} height={b} fill="#000" fillOpacity="0.24" />
      <circle cx={b * 0.54} cy={b * 0.57} r={b * 0.28} fill="#000" fillOpacity="0.25" />
      <circle cx={b * 0.5} cy={b * 0.5} r={b * 0.28} fill={`url(#${id}-g)`} />
    </pattern>
  </>
);

const STARS = Array.from({length: 38}, (_, i) => ({cx: Math.floor(rnd(i) * (W / B)), cy: Math.floor(rnd(i + 400) * (H / B)), ph: rnd(i + 9) * 6, c: i % 5 === 0 ? L.yellow : L.white, sp: 1 + Math.floor(rnd(i + 70) * 3)}));

export const LegoSpace: React.FC<{t: number; warp: number}> = ({t, warp}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
    <defs>
      <Pixelate id="lg-px" b={B} />
      <StudDefs id="lg-studs" />
      {[L.purple, L.teal, L.magenta].map((c, i) => (
        <radialGradient key={i} id={`lneb${i}`}>
          <stop offset="0" stopColor={c} stopOpacity="1" />
          <stop offset="0.55" stopColor={c} stopOpacity="0.7" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
      ))}
    </defs>
    <g filter="url(#lg-px)">
      <rect width={W} height={H} fill={L.base} />
      <ellipse cx={240 + Math.round(Math.sin(t * 0.3) * 2) * B} cy={540} rx={520} ry={330} fill="url(#lneb0)" opacity={0.85} />
      <ellipse cx={880} cy={1180 + Math.round(Math.cos(t * 0.25) * 2) * B} rx={460} ry={400} fill="url(#lneb1)" opacity={0.75} />
      <ellipse cx={540} cy={1760} rx={640} ry={300} fill="url(#lneb2)" opacity={0.7} />
    </g>
    {STARS.map((s, i) => {
      const shift = Math.floor(t * s.sp * (1 + warp * 8)) % Math.round(H / B);
      const row = (s.cy + shift) % Math.round(H / B);
      const tw = 0.45 + 0.55 * (Math.sin(t * 2 + s.ph) > 0 ? 1 : 0.4);
      const len = warp > 0.2 ? 1 + Math.round(warp * 2) : 0;
      return len ? (
        <rect key={i} x={s.cx * B + 4} y={(row - len) * B + 4} width={B - 8} height={(len + 1) * B - 8} rx={6} fill={s.c} opacity={tw} />
      ) : (
        <g key={i} opacity={tw}>
          <circle cx={s.cx * B + B / 2} cy={row * B + B / 2} r={B * 0.42} fill={s.c} />
        </g>
      );
    })}
    <rect width={W} height={H} fill="url(#lg-studs)" />
    <defs>
      <linearGradient id="lg-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#020A24" stopOpacity="0.75" />
        <stop offset="1" stopColor="#020A24" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width={W} height={480} fill="url(#lg-top)" />
  </svg>
);

/** a round 2x2 tile, seen from the front and a little above, with X printed on top */
export const LegoCoin: React.FC<{x: number; y: number; r: number; spin: number; glow: number}> = ({x, y, r, spin, glow}) => {
  const ry = r * 0.5, h = r * 0.32;
  const deg = (spin * 180) / Math.PI;
  const dots = Array.from({length: 12}, (_, i) => {
    const a = spin * 0.55 + (i * Math.PI * 2) / 12;
    return {x: Math.cos(a) * r * 1.65, y: Math.sin(a) * r * 0.62 + h * 0.5, front: Math.sin(a) > 0, c: i % 3 === 0 ? L.white : L.yellow};
  });
  const plate = (d: {x: number; y: number; c: string}, i: number) => (
    <g key={i} transform={`translate(${d.x},${d.y})`}>
      <rect x={-r * 0.09} y={0} width={r * 0.18} height={r * 0.07} fill={d.c === L.white ? '#BDBDBD' : L.yellowDark} />
      <ellipse cy={r * 0.07} rx={r * 0.09} ry={r * 0.045} fill={d.c === L.white ? '#BDBDBD' : L.yellowDark} />
      <ellipse rx={r * 0.09} ry={r * 0.045} fill={d.c} />
    </g>
  );
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="lc-glow">
          <stop offset="0.3" stopColor={L.yellow} stopOpacity="0.55" />
          <stop offset="1" stopColor={L.yellow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lc-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={L.yellowDark} />
          <stop offset="0.35" stopColor={L.yellow} />
          <stop offset="0.6" stopColor={L.yellow2} />
          <stop offset="1" stopColor={L.yellowDark} />
        </linearGradient>
        <linearGradient id="lc-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={L.yellow2} />
          <stop offset="1" stopColor={L.yellow} />
        </linearGradient>
      </defs>
      <g transform={`translate(${x},${y - h / 2})`}>
        <ellipse rx={r * 2.2} ry={r * 1.6} cy={h / 2} fill="url(#lc-glow)" opacity={glow} />
        {dots.filter((d) => !d.front).map(plate)}
        <ellipse cy={h} rx={r} ry={ry} fill={L.yellowDark} />
        <rect x={-r} y={0} width={r * 2} height={h} fill="url(#lc-side)" />
        <ellipse rx={r} ry={ry} fill="url(#lc-top)" />
        <ellipse rx={r * 0.9} ry={ry * 0.9} fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={r * 0.03} />
        <g transform={`scale(1,0.5) rotate(${deg * 0.35})`}>
          <text y={r * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={r * 1.05} fill={L.base}>X</text>
        </g>
        <ellipse cx={-r * 0.35} cy={-ry * 0.45} rx={r * 0.28} ry={ry * 0.18} fill="#fff" opacity={0.4} />
        {dots.filter((d) => d.front).map(plate)}
      </g>
    </svg>
  );
};

/** one brick seen from the front: body + studs on top */
const Brick: React.FC<{x: number; y: number; w: number; h: number; c: string; studs: number}> = ({x, y, w, h, c, studs}) => {
  const sw = w / studs;
  return (
    <g>
      {Array.from({length: studs}, (_, i) => (
        <g key={i}>
          <rect x={x + i * sw + sw * 0.2} y={y - h * 0.22} width={sw * 0.6} height={h * 0.24} rx={sw * 0.08} fill={c} />
          <rect x={x + i * sw + sw * 0.2} y={y - h * 0.22} width={sw * 0.18} height={h * 0.24} fill="#fff" opacity={0.35} />
        </g>
      ))}
      <rect x={x} y={y} width={w} height={h} rx={h * 0.08} fill={c} />
      <rect x={x} y={y} width={w} height={h * 0.16} fill="#fff" opacity={0.3} />
      <rect x={x} y={y + h * 0.84} width={w} height={h * 0.16} fill="#000" opacity={0.25} />
    </g>
  );
};

export const LegoStairs: React.FC<{t: number}> = ({t}) => {
  const t0 = T.dream;
  const N = 9;
  const steps = Array.from({length: N}, (_, i) => {
    const k = i / (N - 1);
    const y = 1560 - k * 900;
    const w = 580 * (1 - 0.76 * k);
    const h = 54 * (1 - 0.6 * k);
    const a = p(t, t0 + 0.1 + i * 0.07, 0.45, E.outBack);
    return {y: y + (1 - a) * 90, w, h, a, studs: Math.max(2, Math.round(w / 64))};
  });
  const climb = clamp((t - t0 - 0.6) / 2.8) * (N - 2.5);
  const si = Math.floor(climb), fr = climb - si;
  const s0 = steps[Math.min(si, N - 1)], s1 = steps[Math.min(si + 1, N - 1)];
  const ay = s0.y + (s1.y - s0.y) * E.inOut(fr) - Math.sin(fr * Math.PI) * 30 - s0.h * 0.2;
  const sc = (1 - 0.7 * ((1560 - ay) / 900)) * 1.25;
  const sw = Math.sin(fr * Math.PI * 2) * 14;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 9}, (_, i) => {
        const a = Math.PI / 2 + (i - 4) * 0.13;
        const w = 0.03;
        return <path key={i} d={`M540,560 L${540 + Math.cos(a - w) * 1600},${560 + Math.sin(a - w) * 1600} L${540 + Math.cos(a + w) * 1600},${560 + Math.sin(a + w) * 1600} Z`} fill={L.yellow2} opacity={0.06 * steps[N - 1].a} />;
      })}
      {steps.map((s, i) => (
        <g key={i} opacity={s.a}>
          <Brick x={540 - s.w / 2} y={s.y - s.h / 2} w={s.w} h={s.h} c={i % 2 ? L.yellow : '#F2A900'} studs={s.studs} />
        </g>
      ))}
      {t > t0 + 0.4 && (
        <g transform={`translate(540,${ay}) scale(${sc})`} opacity={clamp((t - t0 - 0.4) * 3)}>
          {/* minifigure astronaut: legs, hips, torso, arms, head, helmet */}
          <rect x={-26} y={-44} width={24} height={44} rx={3} fill={L.white} transform={`rotate(${sw},-14,-44)`} />
          <rect x={2} y={-44} width={24} height={44} rx={3} fill={L.white} transform={`rotate(${-sw},14,-44)`} />
          <rect x={-27} y={-56} width={54} height={14} rx={3} fill="#CFCFCF" />
          <path d="M-27,-56 L27,-56 L20,-118 L-20,-118 Z" fill={L.white} />
          <rect x={-10} y={-104} width={20} height={20} rx={3} fill={L.red} />
          <rect x={-38} y={-116} width={16} height={46} rx={7} fill={L.white} transform="rotate(14,-30,-116)" />
          <rect x={22} y={-116} width={16} height={46} rx={7} fill={L.white} transform={`rotate(${-150 + sw},30,-116)`} />
          <rect x={-18} y={-152} width={36} height={34} rx={8} fill={L.yellow} />
          <rect x={-26} y={-166} width={52} height={52} rx={18} fill="none" stroke={L.white} strokeWidth={8} />
          <rect x={-22} y={-160} width={44} height={22} rx={8} fill="#7CF3FF" opacity={0.35} />
          <circle cx={-6} cy={-138} r={3} fill="#111" />
          <circle cx={6} cy={-138} r={3} fill="#111" />
          <path d="M-7,-128 Q0,-122 7,-128" stroke="#111" strokeWidth={2.4} fill="none" />
        </g>
      )}
    </svg>
  );
};

export const LegoPortal: React.FC<{t: number}> = ({t}) => {
  const t0 = T.game;
  const o = p(t, t0 - 0.1, 0.9, E.outExpo);
  const pl = p(t, t0 + 0.5, 1.0, E.outBack);
  const cx = 540, cy = 800, R = 200 * pl;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <Pixelate id="lp-px" b={30} />
        <StudDefs id="lp-studs" b={30} />
        <radialGradient id="lp-in">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="0.4" stopColor={L.teal} stopOpacity="0.7" />
          <stop offset="1" stopColor={L.purple} stopOpacity="0" />
        </radialGradient>
        <clipPath id="lp-clip"><circle cx={cx} cy={cy} r={R} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={420 * o} fill="url(#lp-in)" opacity={0.85} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={cx} cy={cy} r={(320 + i * 50) * o} fill="none" stroke={[L.yellow, L.teal, L.white][i]} strokeWidth={18 - i * 4} strokeDasharray={`${44 - i * 8} 6`} transform={`rotate(${t * (30 - i * 22)},${cx},${cy})`} opacity={0.9} />
      ))}
      {pl > 0.01 && (
        <g>
          <g clipPath="url(#lp-clip)">
            <g filter="url(#lp-px)">
              <circle cx={cx} cy={cy} r={R + 30} fill={L.blue} />
              {[0, 1, 2, 3].map((i) => (
                <ellipse key={i} cx={cx + ((t * 40 + i * 140) % 560) - 280} cy={cy - 120 + i * 75} rx={170} ry={26} fill={i % 2 ? L.teal : L.white} />
              ))}
              <circle cx={cx + 70} cy={cy + 60} r={R * 0.9} fill="#0A2F7A" opacity={0.45} />
            </g>
            <rect x={cx - R - 30} y={cy - R - 30} width={2 * R + 60} height={2 * R + 60} fill="url(#lp-studs)" />
          </g>
          <circle cx={cx} cy={cy} r={R} fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={4} />
          {Array.from({length: 22}, (_, i) => {
            const a = t * 0.4 + (i * Math.PI * 2) / 22;
            const front = Math.sin(a) > 0;
            if (!front) return null;
            const px = cx + Math.cos(a) * 330 * pl, py = cy + Math.sin(a) * 80 * pl - Math.cos(a) * 60 * pl;
            return <rect key={i} x={px - 16} y={py - 10} width={32} height={20} rx={4} fill={i % 2 ? L.yellow : L.white} stroke="#000" strokeOpacity={0.25} />;
          })}
        </g>
      )}
    </svg>
  );
};

/** a text chip that looks like a brick with studs */
export const BrickChip: React.FC<{children: React.ReactNode; size?: number; color?: string; dark?: boolean}> = ({children, size = 46, color = L.red, dark}) => (
  <div style={{position: 'relative', display: 'inline-block', marginTop: 16}}>
    <div style={{position: 'absolute', top: -14, left: 18, right: 18, display: 'flex', justifyContent: 'space-between'}}>
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{width: 34, height: 16, borderRadius: '5px 5px 0 0', background: color, boxShadow: 'inset 6px 0 0 rgba(255,255,255,0.3), inset -4px 0 0 rgba(0,0,0,0.15)'}} />
      ))}
    </div>
    <div style={{padding: '16px 34px', borderRadius: 8, background: color, color: dark ? '#111' : '#fff', fontFamily: FONT, fontWeight: 900, fontSize: size, boxShadow: 'inset 0 6px 0 rgba(255,255,255,0.28), inset 0 -8px 0 rgba(0,0,0,0.22), 0 12px 30px rgba(0,0,0,0.45)', display: 'flex', gap: 14, alignItems: 'center'}}>
      {children}
    </div>
  </div>
);

export const legoCoinColor = C.gold2;
export const LEGO_END = end('save');

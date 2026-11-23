// Claymation: the coach's arms get pumped from thin plasticine noodles into huge arms.
// Each curl rep a lump of clay flies in, slaps onto the arm and the arm grows.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp, E, p, rnd, useT} from './anim';

const W = 1080, H = 1920, FLOOR = 1600, SC = 1.08;
const FONT = "'Inter Display', 'Inter', sans-serif";
const K = {
  skin: '#E2AE8A', skinDark: '#C98E6A', vein: '#C9876A', hair: '#3B2A20', black: '#1E1D22', blackHi: '#2E2D33',
  white: '#F1ECE2', grey: '#9A9AA2', wall: '#7FB3AE', wall2: '#6FA39E', floor: '#C9A27A', floor2: '#B58E68', lens: '#BFE3EA',
};

/* ---------------- timeline ---------------- */
const INTRO = 1.3, REP = 1.2, REPS = 4, FLEX_IN = INTRO + REP * REPS; // 6.1
const CTA_AT = FLEX_IN + 2.4, SAVE_AT = CTA_AT + 1.8;
export const CLAY_TOTAL = SAVE_AT + 1.4; // 11.7
const KSTEP = [0.1, 0.38, 0.62, 0.83, 1.0];
const impact = (i: number) => INTRO + REP * i + 0.55; // forearm at the top of the curl

type Pt = [number, number];
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const lerp = (a: Pt, b: Pt, u: number): Pt => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];

/** one limb segment as a clay sausage with a muscle bulge */
const limb = (a: Pt, b: Pt, wa: number, wm: number, wb: number, bulgeOut = 0.5, flip = 1): string => {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const L = Math.hypot(dx, dy) || 1;
  const n: Pt = [(-dy / L) * flip, (dx / L) * flip];
  const m = lerp(a, b, 0.45);
  const P = (q: Pt, s: number): Pt => [q[0] + n[0] * s, q[1] + n[1] * s];
  const a1 = P(a, wa / 2), a2 = P(a, -wa / 2), b1 = P(b, wb / 2), b2 = P(b, -wb / 2);
  const m1 = P(m, wm * (0.5 + bulgeOut * 0.5)), m2 = P(m, -wm * (1 - bulgeOut * 0.5));
  const r = wb / 2;
  const sw = flip > 0 ? 1 : 0;
  return `M${a1} Q${m1} ${b1} A${r} ${r} 0 0 ${sw} ${b2} Q${m2} ${a2} A${wa / 2} ${wa / 2} 0 0 ${sw} ${a1} Z`;
};

const Part: React.FC<{d?: string; children?: React.ReactNode; fill?: string; seed?: number}> = ({d, children, fill}) => (
  <g filter="url(#clay)">{d ? <path d={d} fill={fill} /> : children}</g>
);

/* ---------------- arms ---------------- */
const Arm: React.FC<{S: Pt; Eb: Pt; Hd: Pt; k: number; side: number; veins: number; db: number}> = ({S, Eb, Hd, k, side, veins, db}) => {
  const up = limb(S, Eb, 30 + 44 * k, 28 + 92 * k, 24 + 30 * k, 0.8, -side);
  const fo = limb(Eb, Hd, 24 + 30 * k, 22 + 50 * k, 18 + 12 * k, 0.6, -side);
  const delt = 22 + 46 * k;
  const midU = lerp(S, Eb, 0.5), midF = lerp(Eb, Hd, 0.5);
  return (
    <g>
      <Part d={up} fill={K.skin} />
      <Part d={fo} fill={K.skin} />
      <Part><ellipse cx={S[0] + side * 6 * k} cy={S[1] + 8} rx={delt} ry={delt * 0.9} fill={K.skin} /></Part>
      {db > 0.01 && (
        <Part>
          <g opacity={db}>
            <rect x={Hd[0] - 44} y={Hd[1] - 8} width={88} height={16} rx={8} fill={K.grey} />
            {[-48, 48].map((dx) => <polygon key={dx} points={Array.from({length: 6}, (_, i) => `${Hd[0] + dx + Math.cos(i * Math.PI / 3 + Math.PI / 6) * 30},${Hd[1] + Math.sin(i * Math.PI / 3 + Math.PI / 6) * 30}`).join(' ')} fill={K.black} />)}
          </g>
        </Part>
      )}
      <Part><ellipse cx={Hd[0]} cy={Hd[1] + 4} rx={22 + 18 * k} ry={24 + 16 * k} fill={K.skin} /></Part>
      {veins > 0.01 && (
        <g opacity={veins} filter="url(#clay)">
          {[[S, Eb, 0.22], [Eb, Hd, 0.14]].map(([a, b, w]: any, j) => {
            const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
            const n: Pt = [-dy / L, dx / L];
            const pt = (u: number, o: number): Pt => [a[0] + dx * u + n[0] * o, a[1] + dy * u + n[1] * o];
            const o = (j ? 14 : 22) * k * side;
            const q = [pt(0.2, o), pt(0.38, o * 1.8), pt(0.55, o * 0.6), pt(0.72, o * 1.5), pt(0.88, o * 0.8)];
            return <path key={j} d={`M${q[0]} Q${q[1]} ${q[2]} T${q[4]}`} stroke={K.vein} strokeWidth={j ? 7 : 9} fill="none" strokeLinecap="round" />;
          })}
        </g>
      )}
    </g>
  );
};

/* ---------------- the coach ---------------- */
const Coach: React.FC<{t: number}> = ({t}) => {
  // muscle factor: steps up at each clay impact, with a springy overshoot
  let k = KSTEP[0];
  for (let i = 0; i < REPS; i++) {
    const u = p(t, impact(i) + 0.08, 0.35, E.outBack);
    k += (KSTEP[i + 1] - KSTEP[i]) * u;
  }
  const flexU = p(t, FLEX_IN, 0.45, E.inOut);
  const pulse = t > FLEX_IN + 0.5 ? Math.sin((t - FLEX_IN) * 7) * 0.04 : 0;
  const kk = k + pulse;
  const veins = p(t, FLEX_IN + 0.6, 0.6, E.outCubic);

  const curl = (side: number) => {
    // 0 = arm down, 1 = dumbbell at the shoulder
    if (t < INTRO) return 0;
    const rt = (t - INTRO) % REP;
    return t >= FLEX_IN ? 0 : Math.sin((rt / REP) * Math.PI);
  };
  const armPose = (side: number) => {
    const S: Pt = [side * (132 + 30 * kk), -860];
    const c = curl(side);
    const restE = add(S, [side * (24 + 30 * kk), 200]);
    const restH = add(restE, [side * 14, 190]);
    const upH = add(restE, [side * 34, -150]);
    let Eb = restE, Hd = lerp(restH, upH, c);
    const flexE = add(S, [side * (210 + 20 * kk), -20]);
    const flexH = add(flexE, [side * 18, -200]);
    Eb = lerp(Eb, flexE, flexU);
    Hd = lerp(Hd, flexH, flexU);
    return {S, Eb, Hd};
  };
  const L = armPose(-1), R = armPose(1);
  const look = t < INTRO ? Math.sin(p(t, 0.2, 0.6) * Math.PI) * -10 : 0;
  const db = 1 - p(t, FLEX_IN - 0.05, 0.2, E.linear);
  const smile = p(t, FLEX_IN + 0.3, 0.4);
  const hx = 0, hy = -1005;

  return (
    <g>
      {/* shadow */}
      <ellipse cx={0} cy={8} rx={250 + 40 * kk} ry={36} fill="#000" opacity={0.18} />
      {/* legs: cargo joggers, cuffs, white socks, panda low-tops */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <Part d={`M${s * 8},-560 L${s * 108},-560 Q${s * 112},-300 ${s * 96},-104 L${s * 26},-104 Q${s * 18},-300 ${s * 8},-560 Z`} fill={K.black} />
          <Part><rect x={s > 0 ? 78 : -120} y={-420} width={42} height={70} rx={8} fill={K.blackHi} /></Part>
          <Part><rect x={s > 0 ? 22 : -100} y={-112} width={78} height={34} rx={14} fill={K.blackHi} /></Part>
          <Part><rect x={s > 0 ? 28 : -94} y={-82} width={66} height={46} rx={10} fill={K.white} /></Part>
          <Part><path d={`M${s * 6},-44 L${s * 120},-44 Q${s * 142},-30 ${s * 136},-2 L${s * 6},-2 Z`} fill={K.white} /></Part>
          <Part><path d={`M${s * 40},-44 L${s * 104},-44 Q${s * 118},-34 ${s * 112},-22 L${s * 40},-22 Z`} fill={K.black} /></Part>
          <Part><rect x={s > 0 ? 6 : -142} y={-10} width={136} height={12} rx={6} fill="#E6DCC8" /></Part>
        </g>
      ))}
      {/* tank top with the VERSH print */}
      <Part d="M-112,-878 Q-60,-892 -40,-890 Q0,-840 40,-890 Q60,-892 112,-878 Q96,-760 104,-700 Q92,-620 112,-548 L-112,-548 Q-92,-620 -104,-700 Q-96,-760 -112,-878 Z" fill={K.black} />
      <g filter="url(#clay)">
        <rect x={-150} y={-810} width={300} height={110} fill="none" stroke="none" />
        <text x={0} y={-735} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={46} fill={K.white} letterSpacing={1} transform="skewX(-4)">VERSH</text>
      </g>
      {/* neck and head */}
      <Part><rect x={-24} y={-930} width={48} height={70} rx={20} fill={K.skin} /></Part>
      <g transform={`rotate(${look},${hx},${hy + 60})`}>
        <Part><ellipse cx={hx} cy={hy} rx={66} ry={84} fill={K.skin} /></Part>
        <Part><ellipse cx={hx - 64} cy={hy + 8} rx={12} ry={20} fill={K.skinDark} /></Part>
        <Part><ellipse cx={hx + 64} cy={hy + 8} rx={12} ry={20} fill={K.skinDark} /></Part>
        {/* curtain haircut, centre part */}
        <Part d={`M${hx - 72},${hy + 10} Q${hx - 82},${hy - 70} ${hx - 30},${hy - 96} Q${hx},${hy - 104} ${hx + 30},${hy - 96} Q${hx + 82},${hy - 70} ${hx + 72},${hy + 10} Q${hx + 58},${hy - 40} ${hx + 8},${hy - 52} L${hx},${hy - 66} L${hx - 8},${hy - 52} Q${hx - 58},${hy - 40} ${hx - 72},${hy + 10} Z`} fill={K.hair} />
        {/* glasses: thin wire frames */}
        <g filter="url(#clay)">
          <rect x={hx - 54} y={hy - 18} width={44} height={32} rx={10} fill={K.lens} fillOpacity={0.35} stroke={K.grey} strokeWidth={5} />
          <rect x={hx + 10} y={hy - 18} width={44} height={32} rx={10} fill={K.lens} fillOpacity={0.35} stroke={K.grey} strokeWidth={5} />
          <line x1={hx - 10} y1={hy - 6} x2={hx + 10} y2={hy - 6} stroke={K.grey} strokeWidth={5} />
        </g>
        <circle cx={hx - 32} cy={hy - 2} r={7} fill="#1A120E" />
        <circle cx={hx + 32} cy={hy - 2} r={7} fill="#1A120E" />
        <circle cx={hx - 30} cy={hy - 5} r={2.4} fill="#fff" />
        <circle cx={hx + 34} cy={hy - 5} r={2.4} fill="#fff" />
        <Part><ellipse cx={hx} cy={hy + 24} rx={9} ry={14} fill={K.skinDark} /></Part>
        <path d={`M${hx - 18},${hy + 52} Q${hx},${hy + 52 + 4 + 12 * smile} ${hx + 18},${hy + 52}`} stroke="#7A3B2E" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
      {/* arms on top */}
      <Arm {...L} k={kk} side={-1} veins={veins} db={db} />
      <Arm {...R} k={kk} side={1} veins={veins} db={db} />
    </g>
  );
};

/* lumps of clay that fly in and slap onto the upper arms */
const Lumps: React.FC<{t: number}> = ({t}) => (
  <g>
    {Array.from({length: REPS}, (_, i) =>
      [-1, 1].map((side) => {
        const ti = impact(i);
        const fly = p(t, ti - 0.42, 0.42, E.inCubic);
        if (t < ti - 0.42 || t > ti + 0.25) return null;
        const tx = 540 + side * 190, ty = FLOOR + SC * -760;
        const sx = 540 + side * 720, sy = 700 + rnd(i * 2 + side) * 200;
        const x = sx + (tx - sx) * fly, y = sy + (ty - sy) * fly - Math.sin(fly * Math.PI) * 160;
        const squash = t > ti ? p(t, ti, 0.25) : 0;
        return (
          <g key={`${i}${side}`} filter="url(#clay)" opacity={1 - squash}>
            <ellipse cx={x} cy={y} rx={46 * (1 + squash * 0.9)} ry={40 * (1 - squash * 0.6)} fill={K.skin} transform={`rotate(${fly * 220 * side},${x},${y})`} />
          </g>
        );
      }),
    )}
  </g>
);

const Caption: React.FC<{text: string; sub?: string; t: number; tin: number; tout: number}> = ({text, sub, t, tin, tout}) => {
  const a = p(t, tin, 0.35, E.outBack) * (1 - p(t, tout - 0.2, 0.2));
  if (a <= 0.001) return null;
  return (
    <g transform={`translate(540,250) scale(${0.6 + 0.4 * a}) rotate(${-2 + Math.sin(t * 3) * 0.8})`} opacity={clamp(a * 2)} filter="url(#clay)">
      <rect x={-450} y={-80} width={900} height={sub ? 210 : 150} rx={40} fill="#F4E3C1" />
      <text x={0} y={22} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={68} fill="#3B2A20">{text}</text>
      {sub && <text x={0} y={98} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill="#6B4A36">{sub}</text>}
    </g>
  );
};

export const ClayPump: React.FC<{lang?: 'ru' | 'en'}> = ({lang = 'ru'}) => {
  const {t: rt} = useT();
  const step = Math.floor(rt * 12);
  const t = step / 12; // stop-motion: 12 drawings per second
  const seed = step % 4;
  const jit: Pt = [Math.sin(step * 91.7) * 1.6, Math.cos(step * 37.3) * 1.6];
  const T1 = lang === 'ru' ? 'Руки из макарон?' : 'Noodle arms?';
  const T2 = lang === 'ru' ? '4 подхода пластилина' : '4 sets of clay';
  const T3 = lang === 'ru' ? 'Банки готовы 💪' : 'Pump complete 💪';
  const T4 = lang === 'ru' ? 'Напиши «БАНКИ»' : 'Comment "PUMP"';
  const T4s = lang === 'ru' ? 'пришлю план тренировки рук' : "I'll send you the arm plan";
  const T5 = lang === 'ru' ? 'Сохрани' : 'Save this';
  const T5s = lang === 'ru' ? 'чтобы не потерять' : 'for your next arm day';
  return (
    <AbsoluteFill style={{background: K.wall}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="clay" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves={2} seed={seed + 1} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" result="dsp" />
            <feTurbulence type="fractalNoise" baseFrequency="0.09 0.3" numOctaves={2} seed={seed + 11} result="fine" />
            <feGaussianBlur in="dsp" stdDeviation="8" result="bl" />
            <feComposite in="fine" in2="bl" operator="arithmetic" k2={0.1} k3={1} result="hm" />
            <feDiffuseLighting in="hm" surfaceScale="6" diffuseConstant="1.05" lightingColor="#fff" result="dl">
              <feDistantLight azimuth="235" elevation="52" />
            </feDiffuseLighting>
            <feSpecularLighting in="hm" surfaceScale="6" specularConstant="0.5" specularExponent="16" lightingColor="#fff" result="sl">
              <feDistantLight azimuth="235" elevation="48" />
            </feSpecularLighting>
            <feComposite in="dsp" in2="dl" operator="arithmetic" k1={1.18} result="lit" />
            <feComposite in="sl" in2="dsp" operator="in" result="sl2" />
            <feComposite in="lit" in2="sl2" operator="arithmetic" k2={1} k3={0.5} result="o" />
            <feComposite in="o" in2="dsp" operator="in" />
          </filter>
          <radialGradient id="cv" cx="0.5" cy="0.45" r="0.75">
            <stop offset="0.5" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#1B2420" stopOpacity="0.45" />
          </radialGradient>
        </defs>
        <g transform={`translate(${jit[0]},${jit[1]})`}>
          {/* clay set: wall slabs, a little dumbbell rack, the floor */}
          <g filter="url(#clay)">
            <rect x={-60} y={-60} width={W + 120} height={FLOOR + 80} rx={30} fill={K.wall} />
            {[0, 1, 2, 3].map((i) => <rect key={i} x={-40 + i * 290} y={380} width={250} height={700} rx={26} fill={K.wall2} />)}
          </g>
          <g filter="url(#clay)">
            <rect x={760} y={1240} width={240} height={26} rx={10} fill="#8A6A4E" />
            <rect x={770} y={1266} width={18} height={FLOOR - 1266} fill="#8A6A4E" />
            <rect x={972} y={1266} width={18} height={FLOOR - 1266} fill="#8A6A4E" />
            {[790, 850, 910, 970].map((x, i) => <circle key={x} cx={x} cy={1214} r={26} fill={i % 2 ? K.black : '#C2463A'} />)}
          </g>
          <g filter="url(#clay)">
            <rect x={-60} y={FLOOR - 20} width={W + 120} height={H - FLOOR + 80} rx={30} fill={K.floor} />
            <rect x={-60} y={FLOOR + 140} width={W + 120} height={30} fill={K.floor2} />
          </g>
          <g transform={`translate(540,${FLOOR}) scale(${SC})`}>
            <Coach t={t} />
          </g>
          <Lumps t={t} />
          <Caption text={T1} t={t} tin={-0.4} tout={INTRO + 0.1} />
          <Caption text={T2} t={t} tin={INTRO + 0.2} tout={FLEX_IN} />
          <Caption text={T3} t={t} tin={FLEX_IN + 0.3} tout={CTA_AT} />
          <Caption text={T4} sub={T4s} t={t} tin={CTA_AT + 0.15} tout={SAVE_AT} />
          <Caption text={T5} sub={T5s} t={t} tin={SAVE_AT + 0.15} tout={CLAY_TOTAL + 1} />
        </g>
        <rect width={W} height={H} fill="url(#cv)" />
      </svg>
    </AbsoluteFill>
  );
};

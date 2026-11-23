import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from './theme';
import {CTA_D, END_START, MOVES, SEG, TOTAL} from './timeline';
import {clamp, E, p, rnd, useT} from './anim';
import {RollText} from './components/primitives';
import {Figure, poseAt} from './rig';

const W = 1080, H = 1920, FLOOR = 1400, SC = 1.02;
const GLITCH = 0.32; // RGB-split window around each cut

/* neon gym: back wall light bars, perspective floor grid, floating particles */
const Gym: React.FC<{t: number}> = ({t}) => {
  const vx = 540, vy = 980;
  const rows = Array.from({length: 14}, (_, i) => FLOOR + 6 + Math.pow(i / 13, 1.8) * (H - FLOOR));
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#060B22" />
          <stop offset="1" stopColor="#0B1236" />
        </linearGradient>
        <filter id="neon" x="-20%" y="-200%" width="140%" height="500%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="spot" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.accent} stopOpacity="0.22" />
          <stop offset="1" stopColor={C.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={FLOOR} fill="url(#wall)" />
      <rect y={FLOOR} width={W} height={H - FLOOR} fill="#02030A" />
      {/* back wall: vertical panels + neon bars */}
      {Array.from({length: 9}, (_, i) => <line key={i} x1={i * 135} y1={0} x2={i * 135} y2={FLOOR} stroke={C.grid} strokeOpacity={0.08} strokeWidth={2} />)}
      <g filter="url(#neon)">
        {[[60, 300, 360, 270], [720, 260, 1020, 300], [90, 640, 300, 600], [800, 620, 1010, 660], [380, 150, 700, 150]].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 2 ? C.accent2 : C.accent} strokeWidth={7} strokeLinecap="round" opacity={0.75 + 0.25 * Math.sin(t * 3 + i * 1.7)} />
        ))}
      </g>
      {/* floor grid */}
      <g stroke={C.grid} strokeWidth={2}>
        {Array.from({length: 21}, (_, i) => {
          const x = -1400 + i * 194;
          return <line key={i} x1={vx + (x - vx) * 0.04} y1={FLOOR} x2={x} y2={H} strokeOpacity={0.35} />;
        })}
        {rows.map((y, i) => <line key={`h${i}`} x1={0} y1={y} x2={W} y2={y} strokeOpacity={0.15 + 0.25 * (i / 13)} />)}
      </g>
      <line x1={0} y1={FLOOR} x2={W} y2={FLOOR} stroke={C.accent} strokeWidth={3} opacity={0.6} filter="url(#neon)" />
      <ellipse cx={540} cy={FLOOR + 10} rx={330} ry={46} fill="url(#spot)" />
      {Array.from({length: 40}, (_, i) => {
        const y = (rnd(i) * FLOOR - t * (20 + rnd(i + 3) * 40)) % FLOOR;
        return <circle key={`p${i}`} cx={rnd(i + 50) * W} cy={y < 0 ? y + FLOOR : y} r={1.5 + rnd(i + 9) * 2.5} fill={i % 3 ? C.accent : C.accent2} opacity={0.35 + 0.4 * Math.abs(Math.sin(t + i))} />;
      })}
    </svg>
  );
};

/* the athlete with glow, a floor reflection and RGB ghosts during cuts */
const Athlete: React.FC<{move: string; lt: number; t: number; glitch: number}> = ({move, lt, t, glitch}) => {
  const pose = poseAt(move, lt);
  const off = glitch * 22;
  const scanY = (t * 40) % 10;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <pattern id="holo-scan" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform={`translate(0,${scanY})`}>
          <rect width="10" height="10" fill={C.body} fillOpacity="0.82" />
          <rect width="10" height="2.4" fill={C.accent} fillOpacity="0.55" />
        </pattern>
        <filter id="glow" x="-30%" y="-20%" width="160%" height="140%">
          <feGaussianBlur stdDeviation="12" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="refl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="refl-mask"><rect y={FLOOR} width={W} height={H - FLOOR} fill="url(#refl)" /></mask>
      </defs>
      <g mask="url(#refl-mask)" opacity={0.6}>
        <g transform={`translate(540,${FLOOR}) scale(${SC},${-SC})`}><Figure p={pose} /></g>
      </g>
      {glitch > 0.01 && (
        <g style={{mixBlendMode: 'screen'}} opacity={0.8}>
          <g transform={`translate(${540 - off},${FLOOR}) scale(${SC})`}><Figure p={pose} tint="#FF2244" ghost /></g>
          <g transform={`translate(${540 + off},${FLOOR + off * 0.3}) scale(${SC})`}><Figure p={pose} tint="#22FFAA" ghost /></g>
        </g>
      )}
      <g filter="url(#glow)" transform={`translate(540,${FLOOR}) scale(${SC})`}>
        <Figure p={pose} />
      </g>
    </svg>
  );
};

/* text that decodes from random symbols, left to right */
const GLYPHS = '#$%&*+=?/\\<>01XZ';
const scramble = (s: string, t: number, start: number, frame: number) =>
  s.split('').map((ch, i) => {
    if (ch === ' ') return ' ';
    const settle = start + 0.12 + i * 0.025;
    if (t >= settle) return ch;
    if (t < start + i * 0.012) return '';
    return GLYPHS[Math.floor(rnd(i * 31 + frame) * GLYPHS.length)];
  }).join('');

const Title: React.FC<{text: string; reps: string; t: number; start: number; frame: number}> = ({text, reps, t, start, frame}) => {
  const segEnd = Math.ceil((start + 0.01) / SEG + (start < 0 ? 1 : 0)) * SEG || SEG;
  const out = p(t, segEnd - 0.45, 0.3, E.inCubic);
  const flare = Math.max(0, 1 - Math.abs(t - (segEnd - 0.35)) / 0.12);
  return (
    <div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: FONT, fontWeight: 900, color: C.text, opacity: 1 - out, textShadow: `0 0 24px ${C.accent}, 0 4px 18px rgba(0,0,0,0.8)`}}>
      <div style={{fontSize: 84, letterSpacing: 1}}>{scramble(text, t, start, frame)}</div>
      <div style={{fontSize: 64, color: C.accent, marginTop: 4}}>{scramble(reps, t, start + 0.2, frame)}</div>
      {flare > 0 && <div style={{position: 'absolute', left: '50%', top: 40, width: 600 * flare, height: 6, marginLeft: -300 * flare, background: '#fff', boxShadow: `0 0 40px 14px ${C.accent}`, borderRadius: 3}} />}
    </div>
  );
};

/* left rail: 4 segments, the current one fills over its 5.25 s (replaces the reference's logo rail) */
const Progress: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', left: 36, top: 520, display: 'flex', flexDirection: 'column', gap: 12}}>
    {MOVES.map((m, i) => {
      const f = clamp((t - i * SEG) / SEG);
      return (
        <div key={m.id} style={{width: 10, height: 120, borderRadius: 5, background: 'rgba(61,245,255,0.15)', overflow: 'hidden'}}>
          <div style={{width: '100%', height: `${f * 100}%`, background: C.accent, boxShadow: `0 0 16px ${C.accent}`}} />
        </div>
      );
    })}
  </div>
);

export const Reel: React.FC = () => {
  const {t, frame} = useT();
  const idx = Math.min(MOVES.length - 1, Math.floor(t / SEG));
  const move = MOVES[idx];
  const lt = t - idx * SEG;
  // glitch around each cut (and a beat before the end card)
  const cuts = [SEG, 2 * SEG, 3 * SEG, END_START];
  const glitch = cuts.reduce((g, c) => Math.max(g, 1 - Math.abs(t - c) / GLITCH), 0);
  const jitter = glitch > 0 ? Math.sin(frame * 7.3) * 18 * glitch : 0;
  const endT = t - END_START;
  const dim = clamp(endT / 0.3);
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <AbsoluteFill style={{transform: `translateX(${jitter}px)`}}>
        <Gym t={t} />
        <Athlete move={endT > 0 ? 'march' : move.id} lt={endT > 0 ? endT + SEG : lt} t={t} glitch={glitch} />
      </AbsoluteFill>
      {/* glitch slices */}
      {glitch > 0.2 && [0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 300 + rnd(frame + i * 13) * 1200, height: 18 + rnd(frame + i) * 50, background: i % 2 ? 'rgba(255,61,203,0.35)' : 'rgba(61,245,255,0.35)', transform: `translateX(${(rnd(frame * 3 + i) - 0.5) * 120}px)`, mixBlendMode: 'screen'}} />
      ))}
      {/* scanlines + vignette */}
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 5px)', mixBlendMode: 'multiply'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)'}} />

      {endT < 0 && <Title text={move.title} reps={move.reps} t={t} start={idx === 0 ? -0.6 : idx * SEG} frame={frame} />}
      {endT < 0 && <Progress t={t} />}

      {/* end card: CTA first, "save" last */}
      {endT >= 0 && (
        <AbsoluteFill style={{background: `rgba(3,5,15,${0.55 * dim})`}}>
          <AbsoluteFill style={{top: 170, alignItems: 'center'}}>
            <RollText text="Comment *HOLO*" t={t} tin={END_START + 0.05} tout={END_START + CTA_D - 0.25} size={110} />
            <RollText text="for the full 4-round plan" t={t} tin={END_START + 0.15} tout={END_START + CTA_D - 0.25} size={58} style={{fontWeight: 700}} />
          </AbsoluteFill>
          <AbsoluteFill style={{top: 170, alignItems: 'center'}}>
            <RollText text="*Save* this" t={t} tin={END_START + CTA_D} size={130} />
            <RollText text="workout" t={t} tin={END_START + CTA_D + 0.1} size={130} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
export const SECONDS = TOTAL;

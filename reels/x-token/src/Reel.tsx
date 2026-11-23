import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT} from './theme';
import {T, TOTAL, end} from './timeline';
import {blink, clamp, E, p, rnd, sp, SPR, track, typed, useT} from './anim';
import {Pop, RollText} from './components/primitives';

const W = 1080, H = 1920;

/* ---------------- space background ---------------- */
const STARS = Array.from({length: 170}, (_, i) => ({x: rnd(i) * W, y: rnd(i + 500) * H, r: 0.8 + rnd(i + 900) * 2.4, ph: rnd(i + 77) * 6, sp: 6 + rnd(i + 33) * 18}));

const Space: React.FC<{t: number; warp: number}> = ({t, warp}) => (
  <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
    <defs>
      <linearGradient id="sp-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.space1} />
        <stop offset="1" stopColor={C.space2} />
      </linearGradient>
      {[C.neb1, C.neb2, C.neb3].map((c, i) => (
        <radialGradient key={i} id={`neb${i}`}>
          <stop offset="0" stopColor={c} stopOpacity="0.55" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
      ))}
    </defs>
    <rect width={W} height={H} fill="url(#sp-bg)" />
    <ellipse cx={260 + Math.sin(t * 0.3) * 40} cy={520} rx={620} ry={420} fill="url(#neb0)" />
    <ellipse cx={860 + Math.cos(t * 0.25) * 50} cy={1150} rx={560} ry={480} fill="url(#neb1)" opacity={0.8} />
    <ellipse cx={540} cy={1700 + Math.sin(t * 0.4) * 30} rx={700} ry={360} fill="url(#neb2)" opacity={0.6} />
    {STARS.map((s, i) => {
      const y = (s.y + s.sp * t * (1 + warp * 6)) % H;
      const len = warp * s.r * 14;
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.7 + s.ph));
      return len > 1 ? (
        <line key={i} x1={s.x} y1={y} x2={s.x} y2={y - len} stroke="#fff" strokeOpacity={tw} strokeWidth={s.r * 0.8} strokeLinecap="round" />
      ) : (
        <circle key={i} cx={s.x} cy={y} r={s.r} fill="#fff" opacity={tw} />
      );
    })}
  </svg>
);

/* ---------------- the X coin ---------------- */
const Coin: React.FC<{x: number; y: number; r: number; spin: number; glow: number}> = ({x, y, r, spin, glow}) => {
  const c = Math.cos(spin);
  const sx = Math.max(0.1, Math.abs(c));
  const edge = (c >= 0 ? 1 : -1) * r * 0.1 * (1 - sx);
  const shine = ((spin * 0.6) % 2) - 0.5; // -0.5..1.5
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="coin-glow">
          <stop offset="0.35" stopColor={C.gold2} stopOpacity="0.55" />
          <stop offset="1" stopColor={C.gold2} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="coin-face" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={C.gold1} />
          <stop offset="0.45" stopColor={C.gold2} />
          <stop offset="1" stopColor={C.gold3} />
        </linearGradient>
        <linearGradient id="coin-x" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.gold3} />
          <stop offset="1" stopColor={C.gold4} />
        </linearGradient>
        <clipPath id="coin-clip"><circle r={r} /></clipPath>
      </defs>
      <g transform={`translate(${x},${y})`}>
        <circle r={r * 2.3} fill="url(#coin-glow)" opacity={glow} />
        <g transform={`scale(${sx},1)`}>
          <circle cx={edge / sx} r={r} fill={C.gold4} />
          <circle r={r} fill="url(#coin-face)" />
          <circle r={r * 0.84} fill="none" stroke={C.gold1} strokeOpacity={0.8} strokeWidth={r * 0.045} />
          <circle r={r * 0.84} fill="none" stroke={C.gold4} strokeOpacity={0.35} strokeWidth={r * 0.02} transform={`translate(${r * 0.015},${r * 0.02})`} />
          <text y={r * 0.38} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={r * 1.15} fill="url(#coin-x)">X</text>
          <g clipPath="url(#coin-clip)">
            <rect x={shine * r * 2 - r} y={-r * 1.5} width={r * 0.35} height={r * 3} fill="#fff" opacity={0.45} transform="rotate(20)" />
          </g>
        </g>
      </g>
    </svg>
  );
};

/* ---------------- small pieces ---------------- */
const Chip: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({children, size = 48, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 16, padding: '16px 32px', borderRadius: 999, background: C.chip, border: `2px solid ${C.chipLine}`, boxShadow: C.shadow, fontFamily: FONT, fontWeight: 800, fontSize: size, color: C.text, ...style}}>
    {children}
  </div>
);

const fade = (t: number, a: number, b: number, d = 0.25) => clamp(p(t, a, d, E.linear)) * (1 - clamp(p(t, b - d, d, E.linear)));

/* stairs of light up to the coin, and an astronaut climbing them */
const Stairs: React.FC<{t: number}> = ({t}) => {
  const t0 = T.dream;
  const N = 9;
  const steps = Array.from({length: N}, (_, i) => {
    const k = i / (N - 1);
    const y = 1560 - k * 900;
    const w = 560 * (1 - 0.78 * k);
    const h = 46 * (1 - 0.6 * k);
    const a = p(t, t0 + 0.1 + i * 0.07, 0.5, E.outBack);
    return {y: y + (1 - a) * 80, w, h, a};
  });
  const climb = clamp((t - t0 - 0.6) / 2.8) * (N - 2.5);
  const si = Math.floor(climb), fr = climb - si;
  const s0 = steps[Math.min(si, N - 1)], s1 = steps[Math.min(si + 1, N - 1)];
  const ay = s0.y + (s1.y - s0.y) * E.inOut(fr) - Math.sin(fr * Math.PI) * 30;
  const scale = 1 - 0.7 * ((1560 - ay) / 900);
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <linearGradient id="step" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.gold1} />
          <stop offset="1" stopColor={C.gold3} />
        </linearGradient>
        <filter id="step-glow" x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="10" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path d={`M${540 - 300},1600 L${540 - 60},640 L${540 + 60},640 L${540 + 300},1600 Z`} fill={C.gold2} opacity={0.08 * steps[N - 1].a} />
      {steps.map((s, i) => (
        <rect key={i} x={540 - s.w / 2} y={s.y - s.h / 2} width={s.w} height={s.h} rx={s.h / 2} fill="url(#step)" opacity={s.a} filter="url(#step-glow)" />
      ))}
      {t > t0 + 0.4 && (
        <g transform={`translate(540,${ay - 30 * scale}) scale(${scale * 1.4})`} opacity={clamp((t - t0 - 0.4) * 3)}>
          <rect x={-34} y={-60} width={24} height={60} rx={10} fill="#C9D2E8" />
          <rect x={-28} y={-70} width={56} height={74} rx={22} fill="#FFFFFF" />
          <rect x={-22} y={0} width={18} height={44} rx={8} fill="#E9EEF8" transform={`rotate(${Math.sin(fr * Math.PI * 2) * 18},-13,0)`} />
          <rect x={4} y={0} width={18} height={44} rx={8} fill="#E9EEF8" transform={`rotate(${-Math.sin(fr * Math.PI * 2) * 18},13,0)`} />
          <rect x={22} y={-62} width={16} height={50} rx={8} fill="#FFFFFF" transform="rotate(-150,30,-60)" />
          <circle cy={-104} r={38} fill="#FFFFFF" />
          <ellipse cx={0} cy={-104} rx={27} ry={22} fill="#183A5A" />
          <ellipse cx={-9} cy={-112} rx={9} ry={6} fill="#7CF3FF" opacity={0.8} />
        </g>
      )}
    </svg>
  );
};

/* portal + planet of the game */
const Portal: React.FC<{t: number}> = ({t}) => {
  const t0 = T.game;
  const o = p(t, t0 - 0.1, 0.9, E.outExpo);
  const pl = p(t, t0 + 0.5, 1.0, E.outBack);
  const cx = 540, cy = 800;
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="portal-in">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="0.35" stopColor={C.neb2} stopOpacity="0.8" />
          <stop offset="1" stopColor={C.neb1} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="planet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8CF8FF" />
          <stop offset="0.5" stopColor="#5B5CFF" />
          <stop offset="1" stopColor="#2A0E6E" />
        </linearGradient>
        <clipPath id="planet-clip"><circle cx={cx} cy={cy} r={190 * pl} /></clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={420 * o} fill="url(#portal-in)" opacity={0.9} />
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={(330 + i * 55) * o} ry={(330 + i * 55) * o} fill="none" stroke={i === 1 ? C.accent : C.accent2} strokeWidth={4 - i} strokeDasharray={`${40 + i * 30} ${24 + i * 10}`} transform={`rotate(${t * (40 - i * 25)},${cx},${cy})`} opacity={0.85} />
      ))}
      {pl > 0.01 && (
        <g>
          <ellipse cx={cx} cy={cy} rx={330 * pl} ry={70 * pl} fill="none" stroke={C.accent} strokeWidth={14} strokeOpacity={0.6} transform={`rotate(-14,${cx},${cy})`} />
          <circle cx={cx} cy={cy} r={190 * pl} fill="url(#planet)" />
          <g clipPath="url(#planet-clip)" opacity={0.35}>
            {[0, 1, 2, 3].map((i) => (
              <ellipse key={i} cx={cx + ((t * 30 + i * 120) % 500) - 250} cy={cy - 120 + i * 70} rx={160} ry={18} fill="#FFFFFF" />
            ))}
          </g>
          <path d={`M${cx - 330 * pl * 0.97},${cy + 20 * pl} A ${330 * pl} ${70 * pl} 0 0 0 ${cx + 330 * pl * 0.97},${cy - 20 * pl}`} fill="none" stroke={C.accent} strokeWidth={14} strokeOpacity={0.9} transform={`rotate(-14,${cx},${cy})`} />
        </g>
      )}
    </svg>
  );
};

/* ---------------- the reel ---------------- */
export const Reel: React.FC = () => {
  const {t: realT, fps} = useT();
  // freeze frame during the "stop" beat
  const frozen = realT >= T.stop && realT < T.game;
  const t = frozen ? T.stop : realT;

  const coin = track(t, [
    [0, {x: 540, y: 960, r: 165, glow: 0.7}, E.outBack],
    [0.45, {x: 540, y: 960, r: 215, glow: 1}],
    [T.token, {x: 540, y: 960, r: 215, glow: 1}],
    [T.token + 0.6, {x: 540, y: 760, r: 190, glow: 0.9}],
    [T.dream, {x: 540, y: 760, r: 190, glow: 0.9}],
    [T.dream + 0.7, {x: 540, y: 560, r: 105, glow: 1.3}],
  ]);
  const ctaCoin = track(realT, [[T.cta, {y: 1100, r: 40}], [T.cta + 0.6, {y: 560, r: 130}, E.outBack]]);
  const spin = realT * 1.8 + (1 - p(realT, 0, 0.9)) * Math.PI * 4;
  const warp = p(t, T.dream, 0.6) * (1 - p(t, end('dream') - 0.3, 0.3));
  const flash = 1 - p(realT, 0.1, 0.7, E.outCubic);

  return (
    <AbsoluteFill style={{background: C.space1}}>
      <AbsoluteFill style={{filter: frozen ? 'grayscale(1) contrast(1.3) brightness(0.7)' : undefined}}>
        <Space t={t} warp={warp} />
        {t < T.dream + 3.6 && <AbsoluteFill style={{opacity: fade(t, T.dream - 0.1, T.game + 0.3, 0.3)}}><Stairs t={t} /></AbsoluteFill>}
        {realT < T.game + 0.1 && <Coin x={coin.x} y={coin.y} r={coin.r} spin={spin} glow={coin.glow} />}
      </AbsoluteFill>

      {/* ignition flash on the first frames */}
      <AbsoluteFill style={{background: `radial-gradient(circle at 540px 960px, rgba(255,236,170,${0.85 * flash}) 0%, rgba(255,200,61,${0.35 * flash}) ${18 + 40 * (1 - flash)}%, rgba(0,0,0,0) ${30 + 60 * (1 - flash)}%)`}} />

      {/* 1. hook */}
      {realT < T.token + 0.3 && (
        <AbsoluteFill style={{top: 200, alignItems: 'center'}}>
          <RollText text="Одна монета." t={realT} tin={-0.6} tout={T.token - 0.3} size={112} />
          <RollText text="Целая *вселенная*." t={realT} tin={-0.45} tout={T.token - 0.3} size={112} />
        </AbsoluteFill>
      )}

      {/* 2. token: three things it does */}
      {realT >= T.token - 0.1 && realT < T.dream + 0.2 && (
        <AbsoluteFill>
          <AbsoluteFill style={{top: 200, alignItems: 'center'}}>
            <RollText text="*X* — токен" t={realT} tin={T.token + 0.05} tout={T.dream - 0.3} size={120} />
            <RollText text="игровой вселенной" t={realT} tin={T.token + 0.15} tout={T.dream - 0.3} size={76} style={{fontWeight: 800}} />
          </AbsoluteFill>
          {[
            {txt: 'Платишь в игре', x: 120, y: 1060, d: 0.7},
            {txt: 'Получаешь награды', x: 360, y: 1170, d: 1.5},
            {txt: 'Владеешь предметами', x: 150, y: 1280, d: 2.3},
          ].map((c, i) => (
            <div key={i} style={{position: 'absolute', left: c.x, top: c.y}}>
              <Pop t={realT} fps={fps} tin={T.token + c.d} tout={T.dream - 0.3}>
                <Chip><span style={{color: C.accent}}>{['01', '02', '03'][i]}</span>{c.txt}</Chip>
              </Pop>
            </div>
          ))}
        </AbsoluteFill>
      )}

      {/* 3. dream */}
      {t >= T.dream - 0.1 && realT < T.stop && (
        <AbsoluteFill style={{top: 190, alignItems: 'center'}}>
          <RollText text="Для тех, кто" t={t} tin={T.dream + 0.2} tout={T.stop - 0.25} size={92} style={{fontWeight: 800}} />
          <RollText text="мечтает о *большем*" t={t} tin={T.dream + 0.32} tout={T.stop - 0.25} size={104} />
        </AbsoluteFill>
      )}

      {/* 4. stop: freeze + glitch */}
      {frozen && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)'}}>
          {[0, 1, 2].map((i) => {
            const j = Math.sin(Math.floor(realT * 24) * (3.1 + i)) * 14;
            return (
              <div key={i} style={{position: 'absolute', top: 760 + i * 4, left: 0, right: 0, textAlign: 'center', transform: `translateX(${i === 0 ? 0 : j}px)`, fontFamily: FONT, fontWeight: 900, fontSize: 190, color: i === 0 ? '#fff' : i === 1 ? '#FF3EA5' : '#7CF3FF', opacity: i === 0 ? 1 : 0.55, mixBlendMode: i === 0 ? 'normal' : 'screen'}}>
                СТОП.
              </div>
            );
          })}
          <div style={{position: 'absolute', top: 1000, width: '100%', textAlign: 'center'}}>
            <Pop t={realT} fps={fps} tin={T.stop + 0.45}>
              <Chip size={54}>Главное — дальше</Chip>
            </Pop>
          </div>
        </AbsoluteFill>
      )}

      {/* 5. the game */}
      {realT >= T.game - 0.1 && realT < T.cta + 0.3 && (
        <AbsoluteFill style={{opacity: fade(realT, T.game - 0.1, T.cta + 0.3)}}>
          <Portal t={realT} />
          <AbsoluteFill style={{top: 190, alignItems: 'center'}}>
            <RollText text="Добро пожаловать в" t={realT} tin={T.game + 0.2} tout={T.cta - 0.3} size={70} style={{fontWeight: 800}} />
            <RollText text="*X GAME*" t={realT} tin={T.game + 0.35} tout={T.cta - 0.3} size={170} />
          </AbsoluteFill>
          <div style={{position: 'absolute', top: 1110, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 24}}>
            {[
              ['⚔️', 'Арена'],
              ['🗺️', 'Квесты'],
              ['🏆', 'Награды в X'],
            ].map(([e, l], i) => (
              <Pop key={i} t={realT} fps={fps} tin={T.game + 1.4 + i * 0.35} tout={T.cta - 0.3}>
                <div style={{width: 290, height: 190, borderRadius: 32, background: 'rgba(20,12,60,0.78)', border: `2px solid ${i === 2 ? C.accent : 'rgba(124,243,255,0.45)'}`, boxShadow: C.shadow, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: FONT}}>
                  <div style={{fontSize: 72}}>{e}</div>
                  <div style={{fontSize: 40, fontWeight: 800, color: i === 2 ? C.accent : C.text}}>{l}</div>
                </div>
              </Pop>
            ))}
          </div>
          <div style={{position: 'absolute', top: 1340, width: '100%', textAlign: 'center'}}>
            <Pop t={realT} fps={fps} tin={T.game + 2.7} tout={T.cta - 0.3}>
              <Chip size={40} style={{fontWeight: 700}}>токен X работает внутри игры</Chip>
            </Pop>
          </div>
        </AbsoluteFill>
      )}

      {/* 6. CTA + 7. save */}
      {realT >= T.cta && (
        <AbsoluteFill>
          <Coin x={540} y={ctaCoin.y} r={ctaCoin.r} spin={spin} glow={1} />
          <AbsoluteFill style={{top: 190, alignItems: 'center'}}>
            <RollText text="Напиши *X*" t={realT} tin={T.cta + 0.1} tout={T.save - 0.25} size={130} />
            <RollText text="пришлю гайд, как начать" t={realT} tin={T.cta + 0.22} tout={T.save - 0.25} size={62} style={{fontWeight: 700}} />
          </AbsoluteFill>
          <div style={{position: 'absolute', top: 820, width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Pop t={realT} fps={fps} tin={T.cta + 0.4} tout={T.save - 0.25}>
              {(() => {
                const typeAt = T.cta + 0.8;
                const posted = realT > typeAt + 0.5;
                return (
                  <div style={{width: 820, height: 116, borderRadius: 58, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 18px 0 44px', boxSizing: 'border-box', fontFamily: FONT, boxShadow: C.shadow}}>
                    <div style={{flex: 1, fontSize: 52, fontWeight: 900, color: '#111'}}>
                      {typed('X', realT, typeAt, 6) || <span style={{color: '#999', fontWeight: 600, fontSize: 44}}>Комментарий…</span>}
                      {!posted && realT > typeAt && <span style={{opacity: blink(realT), color: C.gold3}}>|</span>}
                    </div>
                    <div style={{height: 82, padding: '0 32px', borderRadius: 41, display: 'flex', alignItems: 'center', background: posted ? '#22C55E' : C.gold3, color: '#fff', fontSize: 36, fontWeight: 900}}>{posted ? 'Отправлено ✓' : 'Отправить'}</div>
                  </div>
                );
              })()}
            </Pop>
          </div>
          <AbsoluteFill style={{top: 860, alignItems: 'center'}}>
            <RollText text="Сохрани," t={realT} tin={T.save + 0.05} size={120} />
            <RollText text="чтобы не *потерять*" t={realT} tin={T.save + 0.15} size={88} />
          </AbsoluteFill>
          <div style={{position: 'absolute', top: 1300, width: '100%', textAlign: 'center', fontFamily: FONT, fontSize: 30, fontWeight: 600, color: 'rgba(255,255,255,0.75)', opacity: clamp((realT - T.save) * 3)}}>
            Не финансовая рекомендация. Криптоактивы связаны с риском.
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const SECONDS = TOTAL;

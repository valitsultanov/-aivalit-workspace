import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Scene} from './scene/Scene';
import {BASE_STYLE, STYLES} from './scene/styles';
import {BEATS, T, TOTAL, dur} from './timeline';
import {C, FONT} from './theme';
import {blink, clamp, E, p, sp, SPR, typed, useT} from './anim';
import {Pop, RollText} from './components/primitives';

const REVEAL = 0.4; // circle wipe into each new style

const Chip: React.FC<{children: React.ReactNode; size?: number; style?: React.CSSProperties}> = ({children, size = 54, style}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, padding: '18px 34px', borderRadius: 999, background: C.chip, border: `2px solid ${C.chipLine}`, boxShadow: C.shadow, fontFamily: FONT, fontWeight: 900, fontSize: size, color: C.text, letterSpacing: -0.5, ...style}}>
    {children}
  </div>
);

const StyleSeg: React.FC<{i: number; t: number; frame: number; fps: number}> = ({i, t, frame, fps}) => {
  const st = STYLES[i];
  const t0 = T[st.key];
  const local = t - t0;
  const r = p(t, t0 - REVEAL, REVEAL, E.inOutSoft) * 2300;
  const end = t0 + dur(st.key);
  return (
    <AbsoluteFill style={{clipPath: `circle(${r}px at 540px 900px)`}}>
      <Scene t={local + 1} frame={frame} st={st} />
      <AbsoluteFill style={{alignItems: 'center', top: 190}}>
        <Pop t={t} fps={fps} tin={t0 + 0.05} tout={end - 0.3}>
          <Chip>
            <span style={{color: C.accent}}>{st.n}</span>
            <span>{st.name}</span>
          </Chip>
        </Pop>
      </AbsoluteFill>
      <AbsoluteFill style={{alignItems: 'center', top: 1440}}>
        <Pop t={t} fps={fps} tin={t0 + 0.25} tout={end - 0.3}>
          <Chip size={40} style={{fontWeight: 700, padding: '14px 28px'}}>{st.ru}</Chip>
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Hook: React.FC<{t: number; frame: number; fps: number}> = ({t, frame, fps}) => {
  const out = T.hook + dur('hook') - 0.35;
  return (
    <AbsoluteFill>
      <Scene t={t} frame={frame} st={BASE_STYLE} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,20,60,0.55) 0%, rgba(10,20,60,0) 32%)'}} />
      <AbsoluteFill style={{top: 150, alignItems: 'center'}}>
        <RollText text="Одна сцена —" t={t} tin={-0.6} tout={out} size={112} />
        <RollText text="*10* стилей" t={t} tin={-0.45} tout={out} size={150} />
        <Pop t={t} fps={fps} tin={0.7} tout={out} style={{marginTop: 26}}>
          <Chip size={38} style={{fontWeight: 700}}>нарисовано кодом · 0 AI-кредитов</Chip>
        </Pop>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{t: number; frame: number; fps: number}> = ({t, frame, fps}) => {
  const t0 = T.cta;
  const tSave = T.save;
  const kw = 'СТИЛИ';
  const typeAt = t0 + 1.0;
  const posted = t > typeAt + kw.length / 9 + 0.45;
  const tileW = 196, tileH = 348;
  const outTiles = p(t, tSave - 0.25, 0.35, E.inCubic);
  return (
    <AbsoluteFill style={{background: '#0F0E1E'}}>
      <AbsoluteFill style={{top: 200, alignItems: 'center'}}>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(5, ${tileW}px)`, gap: 12, opacity: 1 - outTiles * 0.75, transform: `scale(${1 - outTiles * 0.06})`}}>
          {STYLES.map((st, i) => {
            const a = sp(t, t0 + i * 0.05, fps, SPR.pop);
            return (
              <div key={st.key} style={{position: 'relative', width: tileW, height: tileH, borderRadius: 18, overflow: 'hidden', transform: `scale(${0.5 + 0.5 * a})`, opacity: clamp(a * 2), boxShadow: '0 8px 24px rgba(0,0,0,0.4)'}}>
                <Img src={staticFile(`thumbs/${i}.jpg`)} style={{width: tileW, height: tileH, transform: `scale(${1.04 + 0.04 * Math.sin(t * 2 + i)})`}} />
                <div style={{position: 'absolute', left: 10, top: 8, fontFamily: FONT, fontWeight: 900, fontSize: 30, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)'}}>{st.n}</div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{top: 990, alignItems: 'center'}}>
        <RollText text="Напиши *СТИЛИ*" t={t} tin={t0 + 0.3} tout={tSave - 0.45} size={104} />
        <RollText text="пришлю все 10 промптов" t={t} tin={t0 + 0.45} tout={tSave - 0.45} size={60} style={{fontWeight: 700, marginTop: 10, opacity: 0.85}} />
        <Pop t={t} fps={fps} tin={t0 + 0.7} tout={tSave - 0.45} style={{marginTop: 50}}>
          <div style={{width: 820, height: 120, borderRadius: 60, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 20px 0 44px', boxSizing: 'border-box', fontFamily: FONT, boxShadow: C.shadow}}>
            <div style={{flex: 1, fontSize: 50, fontWeight: 800, color: '#111'}}>
              {typed(kw, t, typeAt, 9) || <span style={{color: '#999', fontWeight: 600}}>Комментарий…</span>}
              {!posted && t > typeAt && <span style={{opacity: blink(t), color: C.accent}}>|</span>}
            </div>
            <div style={{height: 84, padding: '0 34px', borderRadius: 42, display: 'flex', alignItems: 'center', background: posted ? '#22C55E' : C.accent, color: '#fff', fontSize: 38, fontWeight: 900}}>
              {posted ? 'Отправлено ✓' : 'Отправить'}
            </div>
          </div>
        </Pop>
      </AbsoluteFill>
      <AbsoluteFill style={{top: 1080, alignItems: 'center'}}>
        <RollText text="Сохрани," t={t} tin={tSave + 0.1} size={130} />
        <RollText text="чтобы не *потерять*" t={t} tin={tSave + 0.22} size={96} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Reel: React.FC<{captions?: boolean}> = () => {
  const {t, frame, fps} = useT();
  const active = STYLES.map((s, i) => i).filter((i) => {
    const t0 = T[STYLES[i].key];
    return t >= t0 - REVEAL && t < t0 + dur(STYLES[i].key);
  });
  return (
    <AbsoluteFill style={{background: '#0F0E1E'}}>
      {t < T[STYLES[0].key] + 0.05 && <Hook t={t} frame={frame} fps={fps} />}
      {active.map((i) => <StyleSeg key={i} i={i} t={t} frame={frame} fps={fps} />)}
      {t >= T.cta - REVEAL && (
        <AbsoluteFill style={{clipPath: `circle(${p(t, T.cta - REVEAL, REVEAL, E.inOutSoft) * 2300}px at 540px 900px)`}}>
          <Cta t={t} frame={frame} fps={fps} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const REEL_SECONDS = TOTAL;
export {BEATS};

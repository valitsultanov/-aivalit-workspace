import React from 'react';
import {C, FONT} from '../theme';
import {clamp, E, p, sp, SPR} from '../anim';

/** headline words rise out of a mask; *word* = italic orange accent */
export const RollText: React.FC<{text: string; t: number; tin: number; tout?: number; size?: number; stagger?: number; style?: React.CSSProperties}> = ({text, t, tin, tout, size = 120, stagger = 0.07, style}) => {
  const words = text.split(' ');
  const out = tout == null ? 0 : p(t, tout, 0.35, E.inCubic);
  return (
    <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1.02, color: C.text, textAlign: 'center', letterSpacing: -size * 0.03, textShadow: '0 6px 28px rgba(0,0,0,0.35)', ...style, opacity: ((style?.opacity as number) ?? 1) * (1 - out)}}>
      {words.map((w, i) => {
        const acc = w.startsWith('*');
        const clean = w.replace(/\*/g, '');
        const k = p(t, tin + i * stagger, 0.7, E.outExpo);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0 0.12em 0.14em', margin: '-0.06em 0 -0.14em'}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - k) * 110}%)`, color: acc ? '#3DF5FF' : C.text, fontStyle: acc ? 'italic' : 'normal'}}>{clean}</span>
          </span>
        );
      })}
    </div>
  );
};

/** springs anything in at tin, fades it out at tout */
export const Pop: React.FC<{t: number; fps: number; tin: number; tout?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({t, fps, tin, tout, children, style}) => {
  const a = sp(t, tin, fps, SPR.pop);
  const e = tout == null ? 0 : p(t, tout, 0.3, E.inCubic);
  return <div style={{transform: `scale(${0.6 + 0.4 * a})`, opacity: clamp(a * 1.8) * (1 - e), ...style}}>{children}</div>;
};

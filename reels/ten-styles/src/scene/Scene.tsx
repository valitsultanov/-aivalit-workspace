import React from 'react';
import {LookCtx, Part, useN} from './draw';
import {cap, ell, rrect, Pt} from './geom';
import {Pal} from './palette';
import {Cat, Man, MiniCat, MiniMan} from './characters';
import type {StyleDef} from './styles';

export const W = 1080, H = 1920;

/** where everything is at time t (shared by styles that add wires, shadows...) */
export const layout = (t: number) => {
  const hb = 0.5 - 0.5 * Math.cos((Math.PI * 2 * t) / 0.9);
  const cb = 0.5 - 0.5 * Math.cos((Math.PI * 2 * (t + 0.3)) / 0.9);
  return {
    hop: hb,
    man: [540, 1330 - 72 * hb] as Pt,
    cat: [826, 1010 - 56 * cb] as Pt,
    catRot: -12 + Math.sin(t * Math.PI * 2 * 0.55) * 7,
    sun: [870, 272] as Pt,
    balloon: [236 - 9 * t, 610 - 7 * t + Math.sin(t * 1.7) * 9] as Pt,
  };
};

export const CLOUDS = [
  {x: 150, y: 330, r: 60, v: 24},
  {x: 640, y: 660, r: 42, v: 16},
  {x: 960, y: 760, r: 66, v: 20},
  {x: 120, y: 1050, r: 52, v: 28},
  {x: 1010, y: 1260, r: 46, v: 22},
  {x: 260, y: 1330, r: 40, v: 18},
];

const Cloud: React.FC<{x: number; y: number; r: number; p: Pal}> = ({x, y, r, p}) => {
  const N = useN(36);
  return (
    <Part
      s={[
        {pts: rrect(x - 1.55 * r, y - 0.1 * r, 3.1 * r, 0.75 * r, 0.37 * r, Math.max(2, N / 6)), fill: p.cloud},
        {pts: ell(x - 0.85 * r, y + 0.05 * r, 0.62 * r, 0.58 * r, N), fill: p.cloud},
        {pts: ell(x + 0.9 * r, y + 0.1 * r, 0.55 * r, 0.5 * r, N), fill: p.cloud},
        {pts: ell(x - 0.1 * r, y - 0.35 * r, 0.82 * r, 0.8 * r, N), fill: p.cloud},
        {pts: rrect(x - 1.35 * r, y + 0.38 * r, 2.7 * r, 0.24 * r, 0.12 * r, 2), fill: p.cloudShade, noLine: true, flat: true},
      ]}
    />
  );
};

const Balloon: React.FC<{x: number; y: number; p: Pal}> = ({x, y, p}) => {
  const N = useN(36);
  const steps = Math.max(6, Math.round(N / 2));
  const Hh = 270, Wh = 108;
  const w = (u: number) => (u < 0.45 ? Wh * Math.sqrt(Math.max(0, 1 - ((u - 0.45) / 0.45) ** 2)) : Wh * (0.2 + 0.8 * Math.cos(((u - 0.45) / 0.55) * (Math.PI / 2))));
  const G = 8;
  const gores = [];
  for (let g = 0; g < G; g++) {
    const u0 = -1 + (2 * g) / G, u1 = -1 + (2 * (g + 1)) / G;
    const pts: Pt[] = [];
    for (let i = 0; i <= steps; i++) { const v = i / steps; pts.push([x + w(v) * Math.sin((u0 * Math.PI) / 2), y + v * Hh]); }
    for (let i = steps; i >= 0; i--) { const v = i / steps; pts.push([x + w(v) * Math.sin((u1 * Math.PI) / 2), y + v * Hh]); }
    gores.push({pts, fill: g % 2 ? p.bal2 : p.bal1, flat: true});
  }
  const by = y + Hh + 48;
  return (
    <g>
      <Part s={[{pts: cap(x - 20, y + Hh, x - 22, by, 4, 2), fill: p.rope}, {pts: cap(x + 20, y + Hh, x + 22, by, 4, 2), fill: p.rope}]} fx={null} />
      <Part s={[{pts: rrect(x - 30, by - 4, 60, 44, 8, 2), fill: p.basket}]} />
      <Part s={[{pts: ell(x, y + Hh * 0.42, Wh, Hh * 0.47, N), fill: p.bal1, op: 0}, ...gores, {pts: rrect(x - 22, y + Hh - 12, 44, 16, 4, 2), fill: p.basket, noLine: true}]} />
    </g>
  );
};

const Hills: React.FC<{p: Pal}> = ({p}) => {
  const N = useN(64);
  return (
    <>
      <Part s={[{pts: ell(140, 1720, 600, 270, N), fill: p.hillBack}, {pts: ell(1000, 1740, 520, 250, N), fill: p.hillBack}]} />
      <Part s={[{pts: ell(540, 1995, 960, 525, N), fill: p.hill}]} />
    </>
  );
};

export const Scene: React.FC<{t: number; frame: number; st: StyleDef; w?: number; h?: number}> = ({t, frame, st, w = W, h = H}) => {
  const tt = st.step ? Math.floor(t * st.step) / st.step : t;
  const L = layout(tt);
  const P = st.pal;
  const jit = st.jitter ? [Math.sin(Math.floor(t * (st.step || 12)) * 91.7) * st.jitter, Math.cos(Math.floor(t * (st.step || 12)) * 37.3) * st.jitter] : [0, 0];
  const ManC = st.mini ? MiniMan : Man;
  const CatC = st.mini ? MiniCat : Cat;
  const clouds = CLOUDS.map((c, i) => {
    let x = c.x + c.v * tt;
    if (x > W + 140) x -= W + 280;
    return <Cloud key={i} x={x} y={c.y} r={c.r} p={P} />;
  });

  const bg = (
    <g filter={st.bgFilter ? `url(#${st.bgFilter})` : undefined}>
      {st.sky ? st.sky(tt, P, frame) : <rect width={W} height={H} fill={`url(#sky-${st.key})`} />}
      {st.behind?.(tt, P, frame)}
      <Part s={[{pts: ell(L.sun[0], L.sun[1], 92, 92, st.look.poly || 48), fill: P.sun}]} />
      {clouds.slice(0, 3)}
      <Balloon x={L.balloon[0]} y={L.balloon[1]} p={P} />
      {clouds.slice(3)}
      <Hills p={P} />
      {st.afterHill?.(tt, P, frame)}
      {st.bgOver?.(tt, P, frame)}
    </g>
  );
  const fg = (
    <g filter={st.fgFilter ? `url(#${st.fgFilter})` : undefined}>
      <g transform={`translate(${L.cat[0]},${L.cat[1]}) rotate(${L.catRot})`}>
        <CatC t={tt} p={P} />
      </g>
      <g transform={`translate(${L.man[0]},${L.man[1]})`}>
        <ManC t={tt} p={P} hop={L.hop} />
      </g>
    </g>
  );
  const content = (
    <g filter={st.sceneFilter ? `url(#${st.sceneFilter})` : undefined}>
      <g transform={`translate(${jit[0]},${jit[1]})`}>
        {bg}
        {st.mid?.(tt, P, frame)}
        {fg}
      </g>
    </g>
  );

  let body: React.ReactNode = content;
  if (st.special === 'riso') {
    body = (
      <>
        <rect width={W} height={H} fill="#F4EEE2" />
        <g filter="url(#riso-pink)" style={{mixBlendMode: 'multiply'}}>{content}</g>
        <g filter="url(#riso-blue)" style={{mixBlendMode: 'multiply'}} transform="translate(9,-7)">{content}</g>
      </>
    );
  } else if (st.special === 'tilt') {
    body = (
      <>
        {content}
        <g filter="url(#tilt-blur)" mask="url(#tilt-mask)">{content}</g>
      </>
    );
  }

  return (
    <LookCtx.Provider value={st.look}>
      <svg width={w} height={h} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0}}>
        <defs>
          <linearGradient id={`sky-${st.key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={P.sky1} />
            <stop offset="1" stopColor={P.sky2} />
          </linearGradient>
          {st.defs?.(tt, frame)}
        </defs>
        <g filter={st.finalFilter ? `url(#${st.finalFilter})` : undefined}>{body}</g>
        {st.over?.(tt, P, frame)}
      </svg>
    </LookCtx.Provider>
  );
};

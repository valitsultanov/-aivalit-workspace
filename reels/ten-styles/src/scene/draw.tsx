import React, {createContext, useContext} from 'react';
import {Pt, d} from './geom';

/** how shapes are drawn in the current style */
export type Look = {
  poly: number; // 0 = smooth curves, otherwise number of sides for round shapes
  facet: number; // 0..1 strength of flat-shaded facets (low poly / PS2)
  stroke: number; // outline width, 0 = none
  strokeC: string;
  fx: string | null; // filter id applied to every part
};

export const LookCtx = createContext<Look>({poly: 0, facet: 0, stroke: 0, strokeC: '#000', fx: null});
export const useLook = () => useContext(LookCtx);
/** number of points for a round shape in this look */
export const useN = (smooth = 40) => {
  const l = useLook();
  return l.poly ? l.poly : smooth;
};

export type Sh = {pts: Pt[]; fill: string; op?: number; flat?: boolean; noLine?: boolean};

const LIGHT: Pt = [-0.55, -0.83];

const Facets: React.FC<{pts: Pt[]; k: number; seed: number}> = ({pts, k, seed}) => {
  let cx = 0, cy = 0;
  for (const [x, y] of pts) { cx += x; cy += y; }
  cx /= pts.length; cy /= pts.length;
  return (
    <>
      {pts.map((a, i) => {
        const b = pts[(i + 1) % pts.length];
        const mx = (a[0] + b[0]) / 2 - cx, my = (a[1] + b[1]) / 2 - cy;
        const L = Math.hypot(mx, my) || 1;
        const jitter = Math.sin((i + 1) * 12.9898 + seed * 78.233) * 0.25;
        const dot = (mx / L) * LIGHT[0] + (my / L) * LIGHT[1] + jitter;
        const fill = dot > 0 ? '#ffffff' : '#000000';
        const op = (dot > 0 ? dot * 0.32 : -dot * 0.3) * k;
        return <path key={i} d={d([[cx, cy], a, b])} fill={fill} opacity={op} stroke={fill} strokeOpacity={op} strokeWidth={0.8} />;
      })}
    </>
  );
};

/** one object made of several polygons: outline only around the outside, one shading filter */
export const Part: React.FC<{s: Sh[]; fx?: string | null; seed?: number}> = ({s, fx, seed = 1}) => {
  const l = useLook();
  const filt = fx === undefined ? l.fx : fx;
  return (
    <g>
      {l.stroke > 0 && (
        <g>
          {s.filter((x) => !x.noLine).map((x, i) => (
            <path key={i} d={d(x.pts)} fill={l.strokeC} stroke={l.strokeC} strokeWidth={l.stroke * 2} strokeLinejoin="round" />
          ))}
        </g>
      )}
      <g filter={filt ? `url(#${filt})` : undefined}>
        {s.map((x, i) => (
          <g key={i} opacity={x.op ?? 1}>
            <path d={d(x.pts)} fill={x.fill} stroke={x.fill} strokeWidth={0.6} />
            {l.facet > 0 && !x.flat && <Facets pts={x.pts} k={l.facet} seed={seed + i} />}
          </g>
        ))}
      </g>
    </g>
  );
};

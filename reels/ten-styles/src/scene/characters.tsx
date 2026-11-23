import React from 'react';
import {Part, useN} from './draw';
import {cap, ell, poly, rotate, rrect, Pt} from './geom';
import {Pal} from './palette';

const halfDown = (cx: number, cy: number, rx: number, ry: number, n: number): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI;
    out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return out;
};

/** the young man, origin = between his feet. t drives the arm wiggle and leg tuck */
export const Man: React.FC<{t: number; p: Pal; hop: number}> = ({t, p, hop}) => {
  const N = useN(36);
  const n = Math.max(4, Math.round(N / 4));
  const wig = Math.sin(t * Math.PI * 2 * 1.1) * 14;
  const tuck = hop * 18;
  const lh: Pt = [-188 - wig, -792 + Math.abs(wig) * 0.4];
  const rh: Pt = [188 + wig, -792 + Math.abs(wig) * 0.4];
  const la: Pt = [-62 - tuck * 0.6, -48 + tuck];
  const ra: Pt = [62 + tuck * 0.6, -48 + tuck];
  const hairBalls: Pt[] = [];
  for (let i = 0; i <= 9; i++) {
    const a = Math.PI + (i / 9) * Math.PI;
    hairBalls.push([Math.cos(a) * 66, -668 + Math.sin(a) * 70]);
  }
  hairBalls.push([-30, -712], [8, -720], [40, -706], [-52, -690], [56, -684]);
  return (
    <g>
      {/* legs + shoes */}
      <Part s={[{pts: cap(-40, -262, la[0], la[1], 66, n), fill: p.jeans}, {pts: cap(40, -262, ra[0], ra[1], 66, n), fill: p.jeans}]} />
      <Part s={[{pts: ell(la[0] - 12, la[1] + 18, 46, 25, N), fill: p.shoe}, {pts: ell(ra[0] + 12, ra[1] + 18, 46, 25, N), fill: p.shoe}]} />
      {/* arms */}
      <Part s={[{pts: cap(-72, -505, lh[0], lh[1], 60, n), fill: p.hoodie}, {pts: cap(72, -505, rh[0], rh[1], 60, n), fill: p.hoodie}]} />
      <Part s={[{pts: ell(lh[0], lh[1] - 16, 30, 30, N), fill: p.skin}]} />
      {/* camera in the right hand */}
      <Part
        s={[
          {pts: rrect(rh[0] - 30, rh[1] - 92, 96, 62, 12, n), fill: p.camera},
          {pts: rrect(rh[0] - 18, rh[1] - 106, 30, 18, 4, 2), fill: p.camera},
          {pts: ell(rh[0] + 18, rh[1] - 61, 21, 21, N), fill: p.lens, noLine: true},
          {pts: ell(rh[0] + 18, rh[1] - 61, 11, 11, N), fill: p.camera, noLine: true},
        ]}
      />
      <Part s={[{pts: ell(rh[0], rh[1] - 18, 30, 30, N), fill: p.skin}]} />
      {/* torso */}
      <Part
        s={[
          {pts: rrect(-102, -548, 204, 306, 62, n), fill: p.hoodie},
          {pts: rrect(-62, -366, 124, 62, 22, n), fill: p.hoodieDark, noLine: true, flat: true},
          {pts: cap(-22, -520, -26, -448, 9, 3), fill: p.shoe, noLine: true, flat: true},
          {pts: cap(22, -520, 26, -448, 9, 3), fill: p.shoe, noLine: true, flat: true},
        ]}
      />
      <Part s={[{pts: ell(0, -546, 84, 30, N), fill: p.hoodieDark}]} />
      {/* head */}
      <Part s={[{pts: rrect(-22, -590, 44, 54, 10, 2), fill: p.skin}, {pts: ell(-70, -645, 15, 21, N), fill: p.skin}, {pts: ell(70, -645, 15, 21, N), fill: p.skin}, {pts: ell(0, -648, 70, 78, N), fill: p.skin}]} />
      <Part s={hairBalls.map((c) => ({pts: ell(c[0], c[1], 29, 29, N), fill: p.hair}))} />
      {/* face */}
      <Part
        fx={null}
        s={[
          {pts: ell(-26, -652, 8, 11, N), fill: p.ink, noLine: true, flat: true},
          {pts: ell(26, -652, 8, 11, N), fill: p.ink, noLine: true, flat: true},
          {pts: cap(-40, -682, -14, -688, 8, 3), fill: p.hair, noLine: true, flat: true},
          {pts: cap(14, -688, 40, -682, 8, 3), fill: p.hair, noLine: true, flat: true},
          {pts: halfDown(0, -616, 34, 30, Math.max(5, N / 2)), fill: p.mouth, noLine: true, flat: true},
          {pts: rrect(-27, -617, 54, 10, 4, 2), fill: '#ffffff', noLine: true, flat: true},
          {pts: ell(-46, -618, 13, 8, N), fill: p.cheek, op: 0.6, noLine: true, flat: true},
          {pts: ell(46, -618, 13, 8, N), fill: p.cheek, op: 0.6, noLine: true, flat: true},
        ]}
      />
    </g>
  );
};

/** the ginger cat, origin = body centre */
export const Cat: React.FC<{t: number; p: Pal}> = ({t, p}) => {
  const N = useN(30);
  const n = Math.max(3, Math.round(N / 5));
  const leg = (x: number, y: number, base: number, ph: number) => {
    const a = ((base + Math.sin(t * Math.PI * 2 * 2.4 + ph) * 26) * Math.PI) / 180;
    const ex = x + Math.cos(a) * 66, ey = y + Math.sin(a) * 66;
    return [{pts: cap(x, y, ex, ey, 25, n), fill: p.cat}, {pts: ell(ex, ey, 15, 13, N), fill: p.catLight}];
  };
  const tail: Pt[] = [];
  for (let i = 0; i <= 6; i++) tail.push([-86 - i * 20, -8 - i * 17 + Math.sin(t * 6 + i * 0.7) * i * 3]);
  return (
    <g>
      <Part s={[...leg(-48, 22, 155, 0), ...leg(62, 18, 25, 1.4)]} seed={4} />
      <Part s={tail.slice(0, -1).map((a, i) => ({pts: cap(a[0], a[1], tail[i + 1][0], tail[i + 1][1], 24 - i, n), fill: i > 3 ? p.catDark : p.cat}))} seed={5} />
      <Part
        s={[
          {pts: ell(0, 0, 96, 50, N), fill: p.cat},
          {pts: ell(6, 24, 60, 18, N), fill: p.catLight, noLine: true, flat: true},
          {pts: rotate(ell(-42, -30, 9, 17, N), -42, -30, 0.3), fill: p.catDark, noLine: true, flat: true},
          {pts: rotate(ell(-12, -34, 9, 17, N), -12, -34, 0.15), fill: p.catDark, noLine: true, flat: true},
          {pts: ell(18, -33, 9, 16, N), fill: p.catDark, noLine: true, flat: true},
        ]}
        seed={6}
      />
      <Part s={[...leg(-24, 30, 140, 2.2), ...leg(82, 22, 45, 3.1)]} seed={7} />
      <Part
        s={[
          {pts: poly([66, -60], [74, -112], [104, -76]), fill: p.cat},
          {pts: poly([112, -78], [146, -104], [144, -54]), fill: p.cat},
          {pts: ell(102, -36, 48, 44, N), fill: p.cat},
          {pts: poly([76, -70], [80, -98], [96, -76]), fill: p.catPink, noLine: true, flat: true},
          {pts: ell(122, -20, 25, 16, N), fill: p.catLight, noLine: true, flat: true},
        ]}
        seed={8}
      />
      <Part
        fx={null}
        s={[
          {pts: ell(90, -44, 6, 9, N), fill: p.ink, noLine: true, flat: true},
          {pts: ell(124, -46, 6, 9, N), fill: p.ink, noLine: true, flat: true},
          {pts: ell(132, -28, 7, 5, N), fill: p.catPink, noLine: true, flat: true},
          {pts: cap(140, -18, 176, -26, 3, 2), fill: p.ink, noLine: true, flat: true},
          {pts: cap(140, -12, 176, -6, 3, 2), fill: p.ink, noLine: true, flat: true},
        ]}
      />
    </g>
  );
};

/** C-shaped minifigure hand */
const claw = (cx: number, cy: number, R: number, r: number, gap: number, n = 14): Pt[] => {
  const out: Pt[] = [];
  const a0 = gap + 0.6, a1 = gap + Math.PI * 2 - 0.6;
  for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; out.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); }
  for (let i = n; i >= 0; i--) { const a = a0 + ((a1 - a0) * i) / n; out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return out;
};

/** toy-brick minifigure version of the man */
export const MiniMan: React.FC<{t: number; p: Pal; hop: number}> = ({t, p, hop}) => {
  const wig = Math.sin(t * Math.PI * 2 * 1.1) * 12;
  const lh: Pt = [-132 - wig, -680], rh: Pt = [132 + wig, -680];
  const kick = hop * 10;
  const bumps: Pt[] = [[-48, -640], [-20, -652], [12, -652], [42, -642], [-62, -610], [62, -610]];
  return (
    <g>
      <Part s={[{pts: rotate(rrect(-64, -238, 58, 228, 8, 2), -35, -238, (kick * Math.PI) / 180), fill: p.jeans}, {pts: rotate(rrect(6, -238, 58, 228, 8, 2), 35, -238, (-kick * Math.PI) / 180), fill: p.jeans}]} />
      <Part s={[{pts: rotate(rrect(-68, -46, 64, 38, 8, 2), -35, -238, (kick * Math.PI) / 180), fill: p.shoe}, {pts: rotate(rrect(4, -46, 64, 38, 8, 2), 35, -238, (-kick * Math.PI) / 180), fill: p.shoe}]} />
      <Part s={[{pts: rrect(-66, -270, 132, 42, 6, 2), fill: p.jeansDark}]} />
      <Part s={[{pts: cap(-52, -450, lh[0], lh[1] + 26, 46, 4), fill: p.hoodie}, {pts: cap(52, -450, rh[0], rh[1] + 26, 46, 4), fill: p.hoodie}]} />
      <Part s={[{pts: claw(lh[0], lh[1], 28, 13, -Math.PI / 2 - 0.4), fill: p.skin}]} />
      <Part s={[{pts: rrect(rh[0] - 40, rh[1] - 82, 96, 60, 8, 2), fill: p.camera}, {pts: ell(rh[0] + 8, rh[1] - 52, 20, 20, 24), fill: p.lens, noLine: true}, {pts: ell(rh[0] + 8, rh[1] - 52, 10, 10, 20), fill: p.camera, noLine: true}]} />
      <Part s={[{pts: claw(rh[0], rh[1], 28, 13, -Math.PI / 2 + 0.4), fill: p.skin}]} />
      <Part
        s={[
          {pts: poly([-66, -268], [66, -268], [48, -472], [-48, -472]), fill: p.hoodie},
          {pts: rrect(-38, -350, 76, 44, 10, 2), fill: p.hoodieDark, noLine: true, flat: true},
          {pts: cap(-16, -460, -18, -400, 7, 2), fill: p.shoe, noLine: true, flat: true},
          {pts: cap(16, -460, 18, -400, 7, 2), fill: p.shoe, noLine: true, flat: true},
        ]}
      />
      <Part s={[{pts: rrect(-24, -494, 48, 28, 4, 2), fill: p.skin}, {pts: rrect(-58, -604, 116, 112, 26, 5), fill: p.skin}]} />
      <Part s={[{pts: rrect(-64, -642, 128, 78, 34, 5), fill: p.hair}, ...bumps.map((b) => ({pts: ell(b[0], b[1], 22, 22, 20), fill: p.hair}))]} />
      <Part
        fx={null}
        s={[
          {pts: ell(-22, -552, 7, 10, 16), fill: p.ink, noLine: true, flat: true},
          {pts: ell(22, -552, 7, 10, 16), fill: p.ink, noLine: true, flat: true},
          {pts: halfDown(0, -530, 28, 22, 10), fill: p.ink, noLine: true, flat: true},
          {pts: rrect(-20, -531, 40, 7, 3, 2), fill: '#ffffff', noLine: true, flat: true},
        ]}
      />
    </g>
  );
};

export const MiniCat: React.FC<{t: number; p: Pal}> = ({t, p}) => {
  const legR = (x: number, y: number, base: number, ph: number) => {
    const a = ((base + Math.sin(t * Math.PI * 2 * 2.4 + ph) * 24) * Math.PI) / 180;
    return {pts: rotate(rrect(x - 14, y, 28, 70, 5, 2), x, y, a - Math.PI / 2), fill: p.cat};
  };
  const studs = [-60, -20, 20].map((x) => ({pts: rrect(x, -62, 30, 16, 3, 2), fill: p.cat}));
  return (
    <g>
      <Part s={[legR(-50, 18, 155, 0), legR(58, 18, 25, 1.4)]} />
      <Part s={[0, 1, 2].map((i) => ({pts: rotate(rrect(-150 - i * 2, -40 - i * 34, 70, 26, 5, 2), -95, -20, -0.6 - Math.sin(t * 6 + i) * 0.08 * i), fill: i === 2 ? p.catDark : p.cat}))} />
      <Part s={[...studs, {pts: rrect(-92, -48, 184, 92, 12, 3), fill: p.cat}, {pts: rrect(-60, 14, 120, 20, 6, 2), fill: p.catLight, noLine: true, flat: true}]} />
      <Part s={[legR(-24, 26, 140, 2.2), legR(80, 20, 45, 3.1)]} />
      <Part
        s={[
          {pts: poly([62, -88], [70, -132], [100, -92]), fill: p.cat},
          {pts: poly([110, -92], [142, -132], [146, -88]), fill: p.cat},
          {pts: rrect(56, -96, 96, 82, 12, 3), fill: p.cat},
          {pts: rrect(104, -46, 44, 28, 8, 2), fill: p.catLight, noLine: true, flat: true},
        ]}
      />
      <Part
        fx={null}
        s={[
          {pts: ell(86, -60, 6, 9, 14), fill: p.ink, noLine: true, flat: true},
          {pts: ell(122, -60, 6, 9, 14), fill: p.ink, noLine: true, flat: true},
          {pts: ell(132, -42, 7, 5, 14), fill: p.catPink, noLine: true, flat: true},
        ]}
      />
    </g>
  );
};

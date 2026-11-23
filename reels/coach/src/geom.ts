export type Pt = [number, number];

export const ell = (cx: number, cy: number, rx: number, ry: number, n = 40, rot = 0): Pt[] => {
  const out: Pt[] = [];
  const c = Math.cos(rot), s = Math.sin(rot);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * rx, y = Math.sin(a) * ry;
    out.push([cx + x * c - y * s, cy + x * s + y * c]);
  }
  return out;
};

/** a thick limb between two points with round ends */
export const cap = (x1: number, y1: number, x2: number, y2: number, w: number, n = 10): Pt[] => {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const r = w / 2;
  const out: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = a - Math.PI / 2 + (i / n) * Math.PI;
    out.push([x2 + Math.cos(t) * r, y2 + Math.sin(t) * r]);
  }
  for (let i = 0; i <= n; i++) {
    const t = a + Math.PI / 2 + (i / n) * Math.PI;
    out.push([x1 + Math.cos(t) * r, y1 + Math.sin(t) * r]);
  }
  return out;
};

export const rrect = (x: number, y: number, w: number, h: number, r: number, n = 6): Pt[] => {
  r = Math.min(r, w / 2, h / 2);
  const out: Pt[] = [];
  const corners: [number, number, number][] = [
    [x + w - r, y + r, -Math.PI / 2],
    [x + w - r, y + h - r, 0],
    [x + r, y + h - r, Math.PI / 2],
    [x + r, y + r, Math.PI],
  ];
  for (const [cx, cy, a0] of corners) {
    for (let i = 0; i <= n; i++) {
      const a = a0 + (i / n) * (Math.PI / 2);
      out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  }
  return out;
};

export const poly = (...pts: Pt[]) => pts;

export const move = (pts: Pt[], dx: number, dy: number): Pt[] => pts.map(([x, y]) => [x + dx, y + dy]);

export const rotate = (pts: Pt[], ox: number, oy: number, a: number): Pt[] => {
  const c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y]) => [ox + (x - ox) * c - (y - oy) * s, oy + (x - ox) * s + (y - oy) * c]);
};

export const d = (pts: Pt[]) => 'M' + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L') + 'Z';

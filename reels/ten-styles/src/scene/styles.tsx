import React from 'react';
import {Look, Part} from './draw';
import {ell, poly, rrect, Pt} from './geom';
import {BASE, Pal, pal} from './palette';
import {layout, W, H} from './Scene';
import {rnd} from '../anim';

type Fn = (t: number, p: Pal, frame: number) => React.ReactNode;
export type StyleDef = {
  key: string; n: string; name: string; ru: string;
  pal: Pal; look: Look; step?: number; jitter?: number; mini?: boolean;
  special?: 'riso' | 'tilt';
  defs?: (t: number, frame: number) => React.ReactNode;
  bgFilter?: string; fgFilter?: string; sceneFilter?: string; finalFilter?: string;
  sky?: Fn; behind?: Fn; afterHill?: Fn; bgOver?: Fn; mid?: Fn; over?: Fn;
};

const look = (o: Partial<Look>): Look => ({poly: 0, facet: 0, stroke: 0, strokeC: '#000', fx: null, ...o});
const CIF = {colorInterpolationFilters: 'sRGB' as const};

/* ---------- reusable filters ---------- */
const Inner = ({id, color = '#1b1640', op = 0.2, blur = 0, dx = 16, dy = 14, hi = 0}: {id: string; color?: string; op?: number; blur?: number; dx?: number; dy?: number; hi?: number}) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%" {...CIF}>
    <feOffset in="SourceAlpha" dx={-dx} dy={-dy} result="o" />
    <feGaussianBlur in="o" stdDeviation={blur} result="ob" />
    <feComposite in="SourceAlpha" in2="ob" operator="out" result="rim" />
    <feFlood floodColor={color} floodOpacity={op} result="c" />
    <feComposite in="c" in2="rim" operator="in" result="sh" />
    <feOffset in="SourceAlpha" dx={dx * 0.6} dy={dy * 0.6} result="o2" />
    <feGaussianBlur in="o2" stdDeviation={blur * 0.8} result="ob2" />
    <feComposite in="SourceAlpha" in2="ob2" operator="out" result="rim2" />
    <feFlood floodColor="#ffffff" floodOpacity={hi} result="w" />
    <feComposite in="w" in2="rim2" operator="in" result="hl" />
    <feMerge>
      <feMergeNode in="SourceGraphic" />
      <feMergeNode in="sh" />
      <feMergeNode in="hl" />
    </feMerge>
  </filter>
);

const Pixelate = ({id, b, levels}: {id: string; b: number; levels?: string}) => (
  <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H} {...CIF}>
    <feFlood x={b / 2 - 1} y={b / 2 - 1} width="2" height="2" floodColor="#000" />
    <feComposite width={b} height={b} />
    <feTile result="a" />
    <feComposite in="SourceGraphic" in2="a" operator="in" />
    <feMorphology operator="dilate" radius={b / 2} result="px" />
    {levels && (
      <feComponentTransfer>
        <feFuncR type="discrete" tableValues={levels} />
        <feFuncG type="discrete" tableValues={levels} />
        <feFuncB type="discrete" tableValues={levels} />
      </feComponentTransfer>
    )}
  </filter>
);

const Grain = ({id, frame, freq = 0.85}: {id: string; frame: number; freq?: number}) => (
  <filter id={id} filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H} {...CIF}>
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} seed={frame % 9} />
    <feColorMatrix type="saturate" values="0" />
  </filter>
);

const Vignette = ({id, op = 0.35, inner = 0.55}: {id: string; op?: number; inner?: number}) => (
  <radialGradient id={id} cx="0.5" cy="0.48" r="0.75">
    <stop offset={inner} stopColor="#000" stopOpacity="0" />
    <stop offset="1" stopColor="#000" stopOpacity={op} />
  </radialGradient>
);

const full = (fill: string, extra: any = {}) => <rect width={W} height={H} fill={fill} {...extra} />;

/* ---------- the base flat-vector scene ---------- */
export const BASE_STYLE: StyleDef = {
  key: 'base', n: '00', name: 'FLAT VECTOR', ru: 'исходник',
  pal: BASE,
  look: look({fx: 'base-soft'}),
  defs: () => <Inner id="base-soft" blur={10} op={0.16} hi={0.12} />,
};

/* ---------- 01 pixel art ---------- */
const PIXEL: StyleDef = {
  key: 'pixel', n: '01', name: 'PIXEL ART', ru: '16-бит, крупные пиксели',
  pal: pal({sky1: '#3C7CFC', sky2: '#7CC8FC', hill: '#00B800', hillBack: '#58D854', sun: '#FCE000', cloudShade: '#BCDCFC', hoodie: '#F83800', hoodieDark: '#A81000', jeans: '#0058F8', skin: '#FCA044', hair: '#503000', cat: '#FC7400', catDark: '#C84C0C', catLight: '#FCD8A8', bal1: '#E40058', bal2: '#FCE0A8'}),
  look: look({stroke: 5, strokeC: '#1A0F2E', poly: 0}),
  step: 12,
  sceneFilter: 'px-13',
  defs: () => <Pixelate id="px-13" b={12} levels="0 0.25 0.5 0.75 1" />,
  sky: (t, p) => (
    <>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <rect key={i} y={i * 200} width={W} height={i === 7 ? H : 200} fill={i < 3 ? p.sky1 : i < 5 ? '#5C9CFC' : p.sky2} />
      ))}
    </>
  ),
  afterHill: () => (
    <>
      {[[200, 1560], [360, 1640], [760, 1600], [900, 1680], [540, 1760]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={26} height={26} fill={i % 2 ? '#FCFCFC' : '#F8B800'} />
      ))}
    </>
  ),
};

/* ---------- 02 PS2 ---------- */
const PS2: StyleDef = {
  key: 'ps2', n: '02', name: 'PS2 STYLE', ru: 'low-poly 3D, туман, 2002 год',
  pal: pal({sky1: '#4D78A8', sky2: '#B9C9CF', sun: '#E8D27A', cloud: '#D9DEE0', cloudShade: '#AEB6BA', hill: '#5E8A45', hillBack: '#7D9B66', hoodie: '#B8352B', hoodieDark: '#7E2019', jeans: '#3B5A8C', shoe: '#D8D8D2', skin: '#C99272', hair: '#2E2420', cat: '#C9772F', catDark: '#94521C', catLight: '#D9B58E', bal1: '#B8383A', bal2: '#D9CDB2'}),
  look: look({poly: 7, facet: 1}),
  sceneFilter: 'ps2-tex',
  defs: () => (
    <>
      <filter id="ps2-tex" filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H} {...CIF}>
        <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={3} seed={4} result="n" />
        <feColorMatrix in="n" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" result="g" />
        <feComposite in="SourceGraphic" in2="g" operator="arithmetic" k1={0.75} k2={0.68} result="m" />
        <feColorMatrix in="m" type="saturate" values="0.78" result="s" />
        <feFlood x="2" y="2" width="2" height="2" floodColor="#000" />
        <feComposite width="5" height="5" />
        <feTile result="a" />
        <feComposite in="s" in2="a" operator="in" />
        <feMorphology operator="dilate" radius="2.5" />
      </filter>
      <linearGradient id="ps2-fog" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C7D2D4" stopOpacity="0.05" />
        <stop offset="0.6" stopColor="#C7D2D4" stopOpacity="0.55" />
        <stop offset="0.8" stopColor="#C7D2D4" stopOpacity="0.35" />
        <stop offset="1" stopColor="#C7D2D4" stopOpacity="0.1" />
      </linearGradient>
    </>
  ),
  behind: () => (
    <>
      <Part s={[{pts: poly([-40, 1560], [150, 1290], [330, 1470], [520, 1250], [720, 1460], [900, 1300], [1120, 1520], [1120, 1640], [-40, 1640]), fill: '#7F92A0'}]} />
      <Part s={[{pts: poly([-40, 1600], [260, 1430], [460, 1560], [800, 1400], [1120, 1580], [1120, 1700], [-40, 1700]), fill: '#8DA08A'}]} />
    </>
  ),
  afterHill: () => (
    <>
      {[[70, 1560, 0.8], [210, 1600, 1], [880, 1590, 0.9], [1010, 1550, 0.7], [330, 1680, 1.2], [760, 1700, 1.1]].map(([x, y, s], i) => (
        <g key={i}>
          <Part s={[{pts: rrect(x - 9 * s, y - 20 * s, 18 * s, 40 * s, 2, 1), fill: '#5A3F2A'}]} />
          <Part s={[{pts: poly([x, y - 150 * s], [x + 55 * s, y - 20 * s], [x - 55 * s, y - 20 * s]), fill: '#3F6B39'}, {pts: poly([x, y - 190 * s], [x + 40 * s, y - 90 * s], [x - 40 * s, y - 90 * s]), fill: '#4A7A40'}]} seed={i} />
        </g>
      ))}
    </>
  ),
  mid: () => full('url(#ps2-fog)'),
};

/* ---------- 03 comic ---------- */
const COMIC: StyleDef = {
  key: 'comic', n: '03', name: 'COMIC ART', ru: 'чернила, растр, звёздный взрыв',
  pal: pal({sky1: '#1E9BFF', sky2: '#8FD3FF', sun: '#FFE23B', hill: '#3DBA4E', hillBack: '#7ED957', hoodie: '#F2242B', hoodieDark: '#B3121A', jeans: '#2457D6', skin: '#F2B07E', cat: '#FF8A1F', catDark: '#D45E00'}),
  look: look({stroke: 7, strokeC: '#0E0E12', fx: 'comic-cel'}),
  defs: () => (
    <>
      <Inner id="comic-cel" color="#0b0820" op={0.3} blur={0} dx={18} dy={16} hi={0.18} />
      <pattern id="comic-dots" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <circle cx="10" cy="10" r="4.6" fill="#0B3A8C" fillOpacity="0.4" />
      </pattern>
      <linearGradient id="comic-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="1" />
        <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <mask id="comic-mask"><rect width={W} height={H} fill="url(#comic-fade)" /></mask>
      <pattern id="comic-dots2" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <circle cx="7" cy="7" r="2.6" fill="#0E0E12" fillOpacity="0.35" />
      </pattern>
    </>
  ),
  bgOver: () => (
    <>
      <rect width={W} height={1500} fill="url(#comic-dots)" mask="url(#comic-mask)" />
      <rect y={1480} width={W} height={440} fill="url(#comic-dots2)" />
    </>
  ),
  mid: () => {
    const cx = 540, cy = 930;
    const burst: Pt[] = [];
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * Math.PI * 2;
      const r = i % 2 ? 300 + rnd(i) * 40 : 430 + rnd(i + 9) * 70;
      burst.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r * 1.12]);
    }
    const lines = [];
    for (let i = 0; i < 46; i++) {
      const a = (i / 46) * Math.PI * 2 + rnd(i) * 0.05;
      const r0 = 600 + rnd(i * 3) * 160, r1 = 1300;
      const w = 0.012 + rnd(i * 7) * 0.01;
      lines.push(poly([cx + Math.cos(a) * r0, cy + Math.sin(a) * r0], [cx + Math.cos(a - w) * r1, cy + Math.sin(a - w) * r1], [cx + Math.cos(a + w) * r1, cy + Math.sin(a + w) * r1]));
    }
    return (
      <>
        {lines.map((l, i) => <path key={i} d={'M' + l.map((q) => q.join(',')).join('L') + 'Z'} fill="#0E0E12" opacity={0.85} />)}
        <Part s={[{pts: burst, fill: '#FFF27A'}]} fx={null} />
      </>
    );
  },
};

/* ---------- 04 lego ---------- */
const LEGO: StyleDef = {
  key: 'lego', n: '04', name: 'LEGO STYLE', ru: 'всё из пластиковых кубиков',
  pal: pal({sky1: '#3E9DE0', sky2: '#78C3F0', sun: '#FFCD03', cloud: '#F4F4F4', cloudShade: '#F4F4F4', hill: '#4B9F4A', hillBack: '#7DBB46', hoodie: '#C91A09', hoodieDark: '#9A1406', jeans: '#0D69AB', jeansDark: '#0A4F82', shoe: '#F4F4F4', skin: '#F6CB3B', hair: '#5C3A1E', cat: '#E8872A', catDark: '#B8611A', catLight: '#F2CD9A', bal1: '#C91A09', bal2: '#E4CD9E', basket: '#7C5130'}),
  look: look({fx: 'lego-plastic', stroke: 2, strokeC: 'rgba(0,0,0,0.35)'}),
  mini: true,
  bgFilter: 'lego-px',
  defs: () => (
    <>
      <Pixelate id="lego-px" b={36} />
      <Inner id="lego-plastic" color="#000" op={0.22} blur={6} dx={12} dy={12} hi={0.4} />
      <radialGradient id="lego-stud" cx="0.35" cy="0.3" r="0.75">
        <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="0.45" stopColor="#fff" stopOpacity="0.08" />
        <stop offset="1" stopColor="#000" stopOpacity="0.25" />
      </radialGradient>
      <pattern id="lego-bricks" width="36" height="36" patternUnits="userSpaceOnUse">
        <rect width="36" height="2.5" fill="#fff" fillOpacity="0.28" />
        <rect width="2.5" height="36" fill="#fff" fillOpacity="0.2" />
        <rect y="33" width="36" height="3" fill="#000" fillOpacity="0.28" />
        <rect x="33" width="3" height="36" fill="#000" fillOpacity="0.22" />
        <circle cx="19.5" cy="20.5" r="10" fill="#000" fillOpacity="0.2" />
        <circle cx="18" cy="18" r="10" fill="url(#lego-stud)" />
      </pattern>
    </>
  ),
  mid: () => full('url(#lego-bricks)'),
};

/* ---------- 05 claymation ---------- */
const CLAY: StyleDef = {
  key: 'clay', n: '05', name: 'CLAYMATION', ru: 'пластилин, отпечатки, стоп-моушн',
  pal: pal({sky1: '#6FB6E3', sky2: '#BFE3F2', sun: '#F6C945', cloud: '#F7F3EA', cloudShade: '#E4DDD0', hill: '#6FAE4F', hillBack: '#9BC86A', hoodie: '#D8473A', hoodieDark: '#A8332A', jeans: '#4D72B8', skin: '#E2A57E', cat: '#E98C3A', catDark: '#B8682A', catLight: '#F5D2A8', bal1: '#D8473A', bal2: '#F3E6CC'}),
  look: look({fx: 'clay'}),
  step: 12,
  jitter: 1.6,
  defs: (t) => {
    const seed = Math.floor(t * 12) % 4;
    return (
      <>
        <filter id="clay" x="-15%" y="-15%" width="130%" height="130%" {...CIF}>
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves={2} seed={seed + 1} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="11" xChannelSelector="R" yChannelSelector="G" result="dsp" />
          <feTurbulence type="fractalNoise" baseFrequency="0.09 0.3" numOctaves={2} seed={seed + 11} result="fine" />
          <feGaussianBlur in="dsp" stdDeviation="9" result="bl" />
          <feComposite in="fine" in2="bl" operator="arithmetic" k2={0.1} k3={1} result="hm" />
          <feDiffuseLighting in="hm" surfaceScale="6" diffuseConstant="1.05" lightingColor="#fff" result="dl">
            <feDistantLight azimuth="235" elevation="52" />
          </feDiffuseLighting>
          <feSpecularLighting in="hm" surfaceScale="6" specularConstant="0.5" specularExponent="16" lightingColor="#fff" result="sl">
            <feDistantLight azimuth="235" elevation="48" />
          </feSpecularLighting>
          <feComposite in="dsp" in2="dl" operator="arithmetic" k1={1.18} result="lit" />
          <feComposite in="sl" in2="dsp" operator="in" result="sl2" />
          <feComposite in="lit" in2="sl2" operator="arithmetic" k2={1} k3={0.55} result="o" />
          <feComposite in="o" in2="dsp" operator="in" />
        </filter>
        <Vignette id="clay-vig" op={0.4} />
      </>
    );
  },
  sky: (t, p) => (
    <>
      {full(p.sky1)}
      <Part s={[{pts: rrect(-80, -80, W + 160, 1640, 90, 4), fill: 'url(#sky-clay)'}]} />
    </>
  ),
  over: () => full('url(#clay-vig)'),
};

/* ---------- 06 paper cutout ---------- */
const PAPER: StyleDef = {
  key: 'paper', n: '06', name: 'PAPER CUTOUT', ru: 'слои картона и мягкие тени',
  pal: pal({sky1: '#5BA8D8', sky2: '#BFE0EE', sun: '#F7C548', cloud: '#FBF8F1', cloudShade: '#FBF8F1', hill: '#6DAF5A', hillBack: '#A4CC7A', hoodie: '#D9473B', hoodieDark: '#B23A30', jeans: '#4F79B8', jeansDark: '#3E639A', skin: '#E7B089', cat: '#EA8B3C', catDark: '#C46E2A', catLight: '#F7D8B4', bal1: '#D9473B', bal2: '#F6EAD2'}),
  look: look({fx: 'paper'}),
  defs: () => (
    <>
      <filter id="paper" x="-15%" y="-15%" width="130%" height="130%" {...CIF}>
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={2} seed={7} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" result="dsp" />
        <feDropShadow in="dsp" dx="5" dy="10" stdDeviation="7" floodColor="#2A1C10" floodOpacity="0.4" />
      </filter>
      <filter id="paper-tex" filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H} {...CIF}>
        <feTurbulence type="fractalNoise" baseFrequency="0.6 0.9" numOctaves={3} seed={3} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </>
  ),
  sky: (t, p) => {
    const bands = ['#4E9BCF', '#67AEDB', '#82C0E4', '#9ED0EC', '#BCE0F1'];
    return (
      <>
        {full(bands[0])}
        {bands.slice(1).map((c, i) => (
          <Part key={i} s={[{pts: ell(540 + (i % 2 ? -120 : 120), 2350, 1500 - i * 150, 1700 - i * 250, 64), fill: c}]} />
        ))}
      </>
    );
  },
  over: () => full('#fff', {filter: 'url(#paper-tex)', opacity: 0.22, style: {mixBlendMode: 'multiply'}}),
};

/* ---------- 07 retro anime ---------- */
const ANIME: StyleDef = {
  key: 'anime', n: '07', name: 'RETRO ANIME', ru: 'аниме 90-х, акварельное небо',
  pal: pal({sky1: '#3C8FD6', sky2: '#BFE6F5', sun: '#FFE07A', cloud: '#FFFDF6', cloudShade: '#C9C6E8', hill: '#5DAF58', hillBack: '#9ACB72', hoodie: '#E2403A', hoodieDark: '#A92A35', jeans: '#3E63B8', skin: '#F2BE98', hair: '#3A2420', cat: '#F09A40', catDark: '#C46A2C'}),
  look: look({stroke: 3.2, strokeC: '#3A2228', fx: 'anime-cel'}),
  defs: (t, frame) => (
    <>
      <Inner id="anime-cel" color="#3B2A70" op={0.26} blur={0} dx={16} dy={14} hi={0.14} />
      <filter id="anime-wc" x="-30%" y="-30%" width="160%" height="160%" {...CIF}>
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={2} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="110" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="14" />
      </filter>
      <Grain id="anime-grain" frame={frame} />
      <Vignette id="anime-vig" op={0.32} inner={0.5} />
    </>
  ),
  sky: (t, p) => (
    <>
      {full('url(#sky-anime)')}
      <g filter="url(#anime-wc)">
        <ellipse cx="200" cy="200" rx="420" ry="220" fill="#2F78C4" opacity="0.5" />
        <ellipse cx="900" cy="560" rx="380" ry="200" fill="#6FB8E8" opacity="0.5" />
        <ellipse cx="380" cy="820" rx="460" ry="160" fill="#E8F4FA" opacity="0.55" />
        <ellipse cx="760" cy="1180" rx="480" ry="180" fill="#FCE9D8" opacity="0.45" />
      </g>
    </>
  ),
  over: (t, p, frame) => (
    <>
      {full('#808080', {filter: 'url(#anime-grain)', opacity: 0.16, style: {mixBlendMode: 'overlay'}})}
      {full('#FFB36B', {opacity: 0.08, style: {mixBlendMode: 'soft-light'}})}
      {full('url(#anime-vig)')}
    </>
  ),
};

/* ---------- 08 low poly ---------- */
const LOWPOLY: StyleDef = {
  key: 'lowpoly', n: '08', name: 'LOW POLY 3D', ru: 'грани и пастельный свет',
  pal: pal({sky1: '#8EC5F0', sky2: '#F6D9E8', sun: '#FFE29A', cloud: '#FFFFFF', cloudShade: '#E6E8F7', hill: '#8FD3A8', hillBack: '#B8E6C2', hoodie: '#F07A7A', hoodieDark: '#D45E66', jeans: '#7C9BE0', jeansDark: '#6681C4', shoe: '#FBFBFF', skin: '#F4C7A6', hair: '#5A4256', cat: '#F6AE6A', catDark: '#E08F52', catLight: '#FFE2C4', bal1: '#F07A7A', bal2: '#FFF3E2', camera: '#3A3550'}),
  look: look({poly: 8, facet: 1.1}),
  behind: () => (
    <>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${i * 220 - 80},0 L${i * 220 + 160},0 L${i * 220 + 40},${600 + rnd(i) * 500} Z`} fill="#fff" opacity={0.06 + rnd(i + 3) * 0.06} />
      ))}
    </>
  ),
};

/* ---------- 09 risograph ---------- */
const RISO: StyleDef = {
  key: 'riso', n: '09', name: 'RISOGRAPH', ru: 'розовая и синяя краска, зерно',
  pal: pal({sky1: '#5AB8F2', sky2: '#C4ECFF', sun: '#FF4F95', cloud: '#FFFFFF', cloudShade: '#FFE4F0', hill: '#62AEF5', hillBack: '#A6D6FF', hoodie: '#FF2A6E', hoodieDark: '#C0105A', jeans: '#2F7CFF', jeansDark: '#1D4FB0', skin: '#FFA9A0', hair: '#141428', ink: '#101030', cat: '#FF7A55', catDark: '#E23C62', bal1: '#FF2A6E', bal2: '#FFFFFF', basket: '#5A2A7A'}),
  look: look({}),
  special: 'riso',
  defs: (t, frame) => (
    <>
      <filter id="riso-pink" filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H} {...CIF}>
        <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 0.28  0 0 0 0 0.64  0 -1.35 0 0 1.12" />
        <feComponentTransfer><feFuncA type="discrete" tableValues="0 0.32 0.62 0.92" /></feComponentTransfer>
      </filter>
      <filter id="riso-blue" filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H} {...CIF}>
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0.45  0 0 0 0 0.78  -1.35 0 0 0 1.15" />
        <feComponentTransfer><feFuncA type="discrete" tableValues="0 0.3 0.6 0.9" /></feComponentTransfer>
      </filter>
      <Grain id="riso-grain" frame={Math.floor(frame / 3)} freq={1.1} />
    </>
  ),
  over: () => full('#808080', {filter: 'url(#riso-grain)', opacity: 0.5, style: {mixBlendMode: 'soft-light'}}),
};

/* ---------- 10 miniature diorama ---------- */
const DIORAMA: StyleDef = {
  key: 'diorama', n: '10', name: 'MINIATURE DIORAMA', ru: 'тилт-шифт, игрушечный макет',
  pal: pal({sky1: '#4AA9EE', sky2: '#CDEBFA', sun: '#FFD54A', hill: '#58C25C', hillBack: '#86D46E', hoodie: '#F0362B', jeans: '#2F6CE0', cat: '#FF8C24', bal1: '#EE3340', bal2: '#FFF3DA'}),
  look: look({fx: 'dio-plastic'}),
  special: 'tilt',
  finalFilter: 'dio-pop',
  defs: () => (
    <>
      <Inner id="dio-plastic" color="#1a1030" op={0.24} blur={8} dx={14} dy={12} hi={0.3} />
      <filter id="dio-pop" filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H} {...CIF}>
        <feColorMatrix type="saturate" values="1.35" />
        <feComponentTransfer>
          <feFuncR type="linear" slope="1.12" intercept="-0.05" />
          <feFuncG type="linear" slope="1.12" intercept="-0.05" />
          <feFuncB type="linear" slope="1.12" intercept="-0.05" />
        </feComponentTransfer>
      </filter>
      <filter id="tilt-blur" filterUnits="userSpaceOnUse" x="0" y="0" width={W} height={H} {...CIF}>
        <feGaussianBlur stdDeviation="11" />
      </filter>
      <linearGradient id="tilt-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" />
        <stop offset="0.17" stopColor="#fff" stopOpacity="0.85" />
        <stop offset="0.3" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.8" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.92" stopColor="#fff" stopOpacity="1" />
      </linearGradient>
      <mask id="tilt-mask"><rect width={W} height={H} fill="url(#tilt-g)" /></mask>
      <linearGradient id="dio-wood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#B57B48" />
        <stop offset="1" stopColor="#6E4422" />
      </linearGradient>
      <Vignette id="dio-vig" op={0.38} inner={0.5} />
    </>
  ),
  behind: (t) => {
    const L = layout(t);
    return (
      <g stroke="#ffffff" strokeOpacity={0.55} strokeWidth={2}>
        <line x1={L.sun[0]} y1={0} x2={L.sun[0]} y2={L.sun[1]} />
        <line x1={L.balloon[0]} y1={0} x2={L.balloon[0]} y2={L.balloon[1]} />
      </g>
    );
  },
  afterHill: () => (
    <>
      {[[120, 1610, 1], [250, 1560, 0.8], [880, 1600, 1.1], [990, 1650, 0.8], [400, 1690, 0.7], [700, 1660, 0.9]].map(([x, y, s], i) => (
        <g key={i}>
          <Part s={[{pts: rrect(x - 6 * s, y - 40 * s, 12 * s, 50 * s, 3, 1), fill: '#7A4E2A'}]} />
          <Part s={[{pts: ell(x, y - 70 * s, 42 * s, 46 * s, 30), fill: i % 2 ? '#2E9E48' : '#3DB55A'}]} />
        </g>
      ))}
      {[...Array(14)].map((_, i) => (
        <circle key={i} cx={60 + rnd(i) * 960} cy={1560 + rnd(i + 30) * 150} r={7} fill={['#FFE14D', '#FF6FA0', '#FFFFFF'][i % 3]} />
      ))}
      <rect y={1745} width={W} height={H - 1745} fill="url(#dio-wood)" />
      <rect y={1745} width={W} height={7} fill="#E6B07C" />
      {[...Array(9)].map((_, i) => (
        <path key={i} d={`M0,${1780 + i * 18} C300,${1770 + i * 18 + rnd(i) * 20} 700,${1795 + i * 18} 1080,${1782 + i * 18}`} stroke="#5A3618" strokeOpacity={0.35} strokeWidth={2} fill="none" />
      ))}
    </>
  ),
  over: () => full('url(#dio-vig)'),
};

export const STYLES: StyleDef[] = [PIXEL, PS2, COMIC, LEGO, CLAY, PAPER, ANIME, LOWPOLY, RISO, DIORAMA];

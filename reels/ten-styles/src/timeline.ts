import {STYLES} from './scene/styles';

/** one beat = one on-screen sentence. `*word*` = orange accent. d = seconds */
export type Beat = {id: string; text: string; d: number};

export const BEATS: Beat[] = [
  {id: 'hook', text: 'Одна сцена — *10* стилей', d: 3.2},
  ...STYLES.map((s) => ({id: s.key, text: s.ru, d: 3})),
  {id: 'cta', text: 'Напиши *СТИЛИ* — пришлю все 10 промптов', d: 3.6},
  {id: 'save', text: 'Сохрани, чтобы не потерять', d: 1.8},
];

let acc = 0;
/** start time (s) of every beat by id */
export const T: Record<string, number> = {};
for (const b of BEATS) { T[b.id] = acc; acc += b.d; }
export const TOTAL = acc;
export const dur = (id: string) => BEATS.find((b) => b.id === id)!.d;

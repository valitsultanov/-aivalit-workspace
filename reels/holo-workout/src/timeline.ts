// same structure as the reference: 4 moves x ~5.25 s, then our own CTA + save line
export type Move = {id: string; title: string; reps: string};
export const MOVES: Move[] = [
  {id: 'thruster', title: 'DB THRUSTERS', reps: '×10'},
  {id: 'clean', title: 'DB HANG CLEAN', reps: '×10'},
  {id: 'row', title: 'DB GORILLA ROW', reps: '×10'},
  {id: 'march', title: 'MIXED RACK MARCH', reps: '×10'},
];
export const SEG = 5.25;
export const END_START = MOVES.length * SEG; // 21.0
export const CTA_D = 1.2, SAVE_D = 1.3;
export const TOTAL = END_START + CTA_D + SAVE_D; // 23.5

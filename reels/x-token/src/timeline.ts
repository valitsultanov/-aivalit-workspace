/** one beat = one on-screen idea. `*word*` = accent. d = seconds. Total 20 s */
export type Beat = {id: string; text: string; d: number};

export const BEATS: Beat[] = [
  {id: 'hook', text: 'Одна монета. Целая *вселенная*.', d: 2.6},
  {id: 'token', text: '*X* — токен игровой вселенной: платишь, получаешь награды, владеешь предметами', d: 3.8},
  {id: 'dream', text: 'Для тех, кто мечтает о *большем*', d: 3.6},
  {id: 'stop', text: 'Стоп. Главное — дальше', d: 1.4},
  {id: 'game', text: 'Добро пожаловать в *X GAME*', d: 5.0},
  {id: 'cta', text: 'Напиши *X* — пришлю гайд, как начать', d: 2.2},
  {id: 'save', text: 'Сохрани, чтобы не потерять', d: 1.4},
];

let acc = 0;
export const T: Record<string, number> = {};
for (const b of BEATS) { T[b.id] = acc; acc += b.d; }
export const TOTAL = acc;
export const end = (id: string) => T[id] + BEATS.find((b) => b.id === id)!.d;

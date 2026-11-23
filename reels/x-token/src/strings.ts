// every on-screen line, per language. `*word*` = gold accent
export type Lang = 'ru' | 'en';
export const STR = {
  ru: {
    hook1: 'Одна монета.', hook2: 'Целая *вселенная*.',
    tok1: '*X* — токен', tok2: 'игровой вселенной',
    c1: 'Платишь в игре', c2: 'Получаешь награды', c3: 'Владеешь предметами',
    dream1: 'Для тех, кто', dream2: 'мечтает о *большем*',
    stop: 'СТОП.', stop2: 'Главное — дальше',
    game1: 'Добро пожаловать в', g1: 'Арена', g2: 'Квесты', g3: 'Награды в X', game2: 'токен X работает внутри игры',
    cta1: 'Напиши *X*', cta2: 'пришлю гайд, как начать', ph: 'Комментарий…', post: 'Отправить', posted: 'Отправлено ✓',
    save1: 'Сохрани,', save2: 'чтобы не *потерять*',
    disc: 'Не финансовая рекомендация. Криптоактивы связаны с риском.',
  },
  en: {
    hook1: 'One coin.', hook2: 'A whole *universe*.',
    tok1: 'Meet *X*', tok2: 'the token of a game universe',
    c1: 'Pay in the game', c2: 'Earn rewards', c3: 'Own your items',
    dream1: 'For those who', dream2: 'dream *bigger*',
    stop: 'STOP.', stop2: 'The best part is next',
    game1: 'Welcome to', g1: 'Arena', g2: 'Quests', g3: 'Rewards in X', game2: 'X powers everything in the game',
    cta1: 'Comment *X*', cta2: "I'll send you the starter guide", ph: 'Add a comment…', post: 'Post', posted: 'Posted ✓',
    save1: 'Save this', save2: 'for *later*',
    disc: 'Not financial advice. Crypto assets carry risk.',
  },
};

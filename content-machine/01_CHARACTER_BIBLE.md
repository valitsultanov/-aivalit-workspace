# 01 — Библия персонажа: Peach (аватар AiValit)

Постоянная звезда серии. Любое отклонение дизайна между кадрами ломает
серийность — поэтому промпты ниже используются ДОСЛОВНО.

## Мастер-промпт персонажа (базовый образ, full body)

```text
Pixar-style 3D anthropomorphic peach character, plump round peach body shape,
soft fuzzy peach skin texture with warm orange-pink gradient, vertical center
crease line down the front of the body, short dark brown bob haircut with
side-swept bangs, full glam makeup: thick dramatic eyelashes, defined brown
eyebrows, rosy blush cheeks, subtle lip gloss, wearing an oversized leopard
print faux fur coat, cream/beige mini structured handbag with gold clasp held
in one hand, small peach-toned hands, cream high heel pumps, diamond pendant
necklace, confident neutral expression, full body portrait, standing pose,
soft rose-pink solid background, warm studio lighting, ultra-detailed 3D
render, Pixar animation style
```

## Вариант: профиль (для reveal-кадров)

```text
Pixar-style 3D anthropomorphic peach character, side profile view, standing
pose, enormous round peach-shaped backside prominently visible, soft fuzzy
peach skin texture, orange-pink gradient with red blush tones, short dark
brown bob haircut with side-swept bangs, full glam makeup visible from side:
dramatic eyelashes, rosy blush cheeks, diamond pendant necklace, small round
hands at side, cream high heel pumps, no coat, no bag, soft rose-pink solid
background, warm studio lighting, ultra-detailed 3D render, Pixar animation
style, vertical portrait
```

## Идентичность (чек-лист неизменных деталей)

- Тело: круглый персик, вертикальная центральная «щёлка», пушистая текстура,
  оранжево-розовый градиент с румянцем
- Волосы: тёмно-коричневое каре с косой чёлкой
- Лицо: драматичные ресницы, коричневые брови, румяна, блеск на губах
- Аксессуары: пирсинг (пупок), кулон с бриллиантом, кремовые лодочки
- Опционально по сцене: леопардовая шуба, кремовая сумка с золотой застёжкой

## REFERENCE CHARACTER LOCK (вставлять в КАЖДЫЙ промпт с персонажем)

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original lips, eyes, nose, skin texture, hair, body shape, proportions,
colors, piercing, arms, legs and shoes. Do not redesign, enlarge, reshape or
modify any part of the character. Character identity must remain 100%
unchanged.
```

> Если по сюжету часть тела ИЗМЕНИЛАСЬ (губы после филлера и т.п.) — убери её
> из перечисления LOCK и опиши новое состояние отдельной строкой, например:
> `the peach's lips are bigger and glossy now because of filler in the lips`.

## Правила референсов

1. **Фон удаляем.** Референс персонажа подаётся вырезанным — фон путает модель.
2. Для сцен «персонаж + человек» — референс-коллаж: персик (без фона) + фото
   реального человека (например, доктор).
3. Изменённые состояния персонажа (новые губы и т.п.) генерируются командой
   **«Keep the same picture, only make …»** от мастер-кадра — и новый кадр
   становится референсом для последующих сцен.

## Главный герой серии — Доктор AiValit ⭐

**Постоянный персонаж КАЖДОГО эпизода.** Реальный человек, генерируется по
фото-референсу (фото хранить в `episodes/<ep>/refs/doctor_aivalit.jpg`).

Внешность (для текстовой части промпта, фото-референс обязателен):

```text
a real human male doctor, young man in his early 30s, wavy medium-length
brown hair swept back, light green-hazel eyes, bold black glasses with thick
frames, light stubble on the chin and upper lip, warm friendly smile, wearing
white medical scrubs with gold AiValit embroidery on the chest
```

Правила:
1. Доктор AiValit — во всех эпизодах, независимо от локации и процедуры
   (в стоматологии, барбершопе и т.д. он «резидент-специалист» в
   соответствующей форме, но лицо/очки/причёска неизменны).
2. Фирменные детали не терять: **чёрные очки в толстой оправе** и лёгкая
   небритость — его CHARACTER LOCK.
3. Брендинг формы: AiValit (вместо HiSep.ai в новых эпизодах).
4. Смена позы между смежными кадрами обязательна (анти-заморозка в i2v).

## Пациенты серии (ротация)

Пациенты меняются под задачу и смысл контента: фрукты, овощи, звери,
рептилии — 3D Pixar-style антропоморфы. Полный кастинг с процедурами и
оценкой виральности — `05_CAST_LIBRARY.md`. Каждому пациенту при вводе в
серию создаётся мастер-кадр по образцу Peach (см. выше) и свой блок
CHARACTER LOCK.

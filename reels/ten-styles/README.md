# 10 стилей — одна сцена (Remotion reel)

Анимированный рилс 1080x1920, ~38 с. Всё нарисовано кодом (SVG + фильтры), без AI-видео и кредитов.

## Запуск
```
npm install
npx remotion studio                                   # живой превью
npx remotion render src/index.ts Explainer out/reel.mp4      # 30 fps
npx remotion render src/index.ts Explainer60 out/reel60.mp4  # 60 fps
npx remotion render src/index.ts Style out/pixel.mp4 --props='{"i":0}'  # отдельный 3-сек клип стиля (i = 0..9, -1 = исходник)
```

## Где что
- `src/timeline.ts` — тайминг битов (хук, 10 стилей по 3 с, CTA, «Сохрани»)
- `src/scene/Scene.tsx` — сцена и движение (прыжок, кот, облака, шар; камера стоит)
- `src/scene/characters.tsx` — парень, кот, минифигурки для LEGO
- `src/scene/styles.tsx` — 10 стилей: палитры и SVG-фильтры
- `src/theme.ts` — шрифт и цвета текста
- `public/thumbs/` — превью для финальной сетки (перерендерить при смене стилей)

## Таймкоды
| Время | Что на экране |
|---|---|
| 0:00–0:03 | Хук: «Одна сцена — 10 стилей», «нарисовано кодом · 0 AI-кредитов» |
| 0:03 | 01 Pixel art — 16 бит, крупные пиксели |
| 0:06 | 02 PS2 — low-poly 3D, туман |
| 0:09 | 03 Comic — чернила, растр, звёздный взрыв |
| 0:12 | 04 LEGO — кубики и минифигурка |
| 0:15 | 05 Claymation — пластилин, стоп-моушн |
| 0:18 | 06 Paper cutout — слои картона |
| 0:21 | 07 Retro anime — аниме 90-х |
| 0:24 | 08 Low poly 3D — грани, пастель |
| 0:27 | 09 Risograph — розовая + синяя краска |
| 0:30 | 10 Miniature diorama — тилт-шифт |
| 0:33 | Сетка всех 10 + «Напиши СТИЛИ — пришлю все 10 промптов» |
| 0:36.8 | «Сохрани, чтобы не потерять» |

## Подпись к посту
Одна сцена — 10 стилей 🎨

01 Pixel art
02 PS2
03 Comic art
04 LEGO
05 Claymation
06 Paper cutout
07 Retro anime
08 Low poly 3D
09 Risograph
10 Miniature diorama

Какой твой? Пиши номер в комментариях 👇
Напиши «СТИЛИ» — пришлю все 10 промптов.

Made with @trycuttr

Remotion бесплатен для частных лиц и компаний до 3 человек; командам больше нужна лицензия (remotion.dev/license).

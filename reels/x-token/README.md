# X TOKEN — 20 s reel (Remotion)

Space style, 1080x1920, 20 s. Render:
```
cd reels/x-token && npm install   # or symlink node_modules from ../ten-styles
npx remotion render src/index.ts XToken out/x-token.mp4 --timeout=120000 --concurrency=3      # RU
npx remotion render src/index.ts XTokenEN out/x-token-en.mp4 --timeout=120000 --concurrency=3  # EN
npx remotion render src/index.ts XTokenLegoEN out/x-token-lego-en.mp4 --timeout=120000 --concurrency=3  # LEGO, EN (XTokenLego = RU)
```
All on-screen text (RU and EN) lives in `src/strings.ts`. Timing in `src/timeline.ts`, scenes in `src/Reel.tsx`, colours in `src/theme.ts`.

| Time | Beat | On screen |
|---|---|---|
| 0:00 | Hook | Coin ignites: «Одна монета. Целая вселенная.» |
| 0:02.6 | Token | «X — токен игровой вселенной» + 3 things it does |
| 0:06.4 | Dream | Warp stars, golden staircase, astronaut climbs to the coin: «Для тех, кто мечтает о большем» |
| 0:10.0 | Stop | Freeze, grey, glitch «СТОП. Главное — дальше» |
| 0:11.4 | Game | Portal opens, planet: «Добро пожаловать в X GAME», Arena / Quests / Rewards in X |
| 0:16.4 | CTA | «Напиши X — пришлю гайд», comment typed and sent |
| 0:18.6 | Save | «Сохрани, чтобы не потерять» + risk disclaimer |

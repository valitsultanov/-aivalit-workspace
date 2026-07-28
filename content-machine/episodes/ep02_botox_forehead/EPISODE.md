# Эпизод 02 — Клиника: ботокс (лоб и межбровье)

Статус: 🟡 в производстве (промпты готовы, кадры не сгенерированы).
Локация: люкс бьюти-клиника **HiSep.ai** (та же, что в ep01 — интерьер и
доктор переиспользуются). Специалист: тот же доктор.
Процедура: ботокс — точечные микроинъекции в лоб и межбровье.
Reveal/панчлайн: чёлку приподняли — лоб гладкий и сияющий, персик радостно
тестирует брови «вверх-вниз».
Ограничитель трансформации: smoother 20-30% only, no frozen face, no shape change.

Правила: ChatGPT + Gemini параллельно, ретраи до попадания, референсы
персонажа БЕЗ фона, i2v — Omni Flash, точные шоты — Kling (first/last frame),
монтаж — CapCut. Шаблоны: `../../02_PROMPT_TEMPLATES.md`.

Переиспользуем из ep01: мастер-кадр персонажа (S0), кадр клиники с доктором
без персонажа (ep01/S2) — экономия 2 генераций.

---

## S0. Кадры-полуфабрикаты

- [x] Персонаж — мастер-кадр из `01_CHARACTER_BIBLE.md` (образ с шубой и сумкой)
- [x] Клиника + доктор без персонажа — из ep01/S2
- [ ] Промежуточный кадр «чёлка убрана назад» (нужен для S3–S6):

```text
Keep the same picture, only pin the peach character's side-swept bangs back
with a small gold hair clip so the forehead area between the eyebrows is
fully visible. Do not change anything else.
```

## S1. Персонаж сидит на кушетке, доктор рядом (last frame акта 1)

**Референсы:** персик без фона + кадр клиники с доктором.

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original lips, eyes, nose, skin texture, hair, body shape, proportions,
colors, piercing, arms, legs and shoes. Do not redesign or modify any part of
the character. Character identity must remain 100% unchanged.

Medium shot inside the luxury aesthetic clinic. The peach character sits
upright on the white treatment bed, wearing her oversized leopard print faux
fur coat, holding her cream structured handbag on her lap, looking up at the
doctor with wide expressive eyes and slightly worried eyebrows. A real human
male doctor stands beside the bed, short dark hair, neat beard, warm
reassuring smile, wearing white medical scrubs with gold HiSep.ai embroidery,
holding a small tablet and gently explaining the procedure.

luxury beauty clinic interior: cream and white tones, gold accents, brass
floor lamp, glass shelf with gold luxury skincare bottles, round mirror on
wall, soft warm lighting, photorealistic background with 3D animated
character, vertical portrait composition, cinematic realism, shallow depth of
field.
```

## S2. Клиника без персонажа (first frame акта 1)

Переиспользуем ep01/S2 (доктор смотрит в камеру). ❗ Если поза доктора
совпадает с S1 — перегенерировать правкой:

```text
Keep the picture, only change the doctor's pose: he is standing beside the
bed holding a small tablet and looking at the camera.
```

**Видео акта 1 (Kling):** first = S2, last = S1.

```text
The peach character walks into the frame and sits on the treatment bed. The
doctor turns toward her and greets her with a warm smile. Camera stays still.
No other movement.
```

---

## S3. Осмотр: доктор изучает лоб (акт 2а, close-up)

**Референсы:** персик с убранной чёлкой (S0) + доктор.

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original lips, eyes, nose, skin texture, hair, body shape, proportions,
colors, piercing, arms, legs and shoes. The bangs are pinned back with a
small gold hair clip. Character identity must remain 100% unchanged.

Close-up shot. The peach character sits on the treatment bed with her bangs
pinned back, forehead fully visible, eyes looking up nervously. The doctor's
hands gently hold her head steady while he leans in and studies the area
between her eyebrows with a professional assessing gaze. Clean modern
aesthetic clinic, soft medical lighting, cinematic realism, shallow depth of
field, professional consultation atmosphere.
```

**I2V (Kling):**

```text
Static camera. The doctor gently examines the peach character's forehead. He
softly presses the area between her eyebrows with one finger, tilts his head,
studies the skin, then nods professionally as if confirming the treatment
plan. The peach character blinks nervously and glances up at him. Subtle
natural movements only, realistic clinical assessment, luxury clinic
interior, soft warm lighting, cinematic realism, no camera movement.
```

---

## S4. Разметка: белые точки на лбу (акт 2б, пара frame)

**Кадр с разметкой** (референс — S3):

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original face, skin texture, hair with pinned-back bangs, proportions and
colors. Do not redesign or modify any part of the character. Character
identity must remain 100% unchanged.

Close-up of the peach character's forehead area. The doctor's blue
medical-gloved hand uses a white surgical marker to place several small neat
white dots across the forehead and between the eyebrows, classic botox
injection mapping. The dots are clearly visible against the peach skin. The
peach character's eyes look upward toward the marker with comic suspicion.
Clean modern aesthetic clinic, realistic pre-procedure preparation, soft
medical lighting, shallow depth of field, cinematic realism.
```

**Кадр без разметки** (правка):

```text
Keep the picture, only remove the white dots from the forehead.
```

**Видео акта 2б (Kling):** first = без точек, last = с точками.

```text
A gloved hand holding a white marker gently places small white dots one by
one on the peach character's forehead. Camera stays still. No other movement.
```

---

## S5. Процедура: микроинъекции (акт 3, extreme close-up)

**Референс:** кадр S4 (с точками).

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original face, skin texture, hair with pinned-back bangs, proportions and
colors. Do not redesign, enlarge, reshape or modify any part of the
character. Character identity must remain 100% unchanged.

Extreme close-up of the peach character's forehead with the white dot
markings clearly visible. The doctor's blue medical-gloved hands enter the
frame holding a very fine professional botox syringe. The ultra-thin needle
gently touches the first marked dot, performing a careful micro-injection
with subtle realistic movements. Camera tightly focused on the forehead area
only. Clean luxury aesthetic clinic environment, realistic cosmetic
procedure, soft clinical lighting, shallow depth of field, cinematic realism,
high-detail macro shot.
```

**I2V (только Kling):**

```text
Static camera. Extreme close-up of the peach character's forehead. A doctor
wearing blue medical gloves performs a professional botox procedure using a
fine syringe, moving precisely from one white dot to the next. Realistic and
delicate treatment movements. The peach character remains completely still.
During the procedure, the skin on the forehead gradually becomes slightly
smoother and more even with a very subtle natural change (20-30% only).
Natural result, the face keeps its full expressiveness, no frozen face, no
swelling, no deformation, no change to the character's face shape.
Professional aesthetic clinic environment, soft medical lighting, cinematic
realism, shallow depth of field, no camera movement.
```

---

## S6. Reveal — ручное зеркало (акт 4а, close-up)

**Референс:** персик с убранной чёлкой и гладким лбом. Правка от S4:

```text
Keep the picture, only remove the white dots and make the forehead smooth and
subtly glowing.
```

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original lips, eyes, nose, skin texture, hair with pinned-back bangs, body
shape, proportions, colors. Character identity must remain 100% unchanged.

Close-up of the peach character sitting on the luxury clinic treatment bed.
The peach character looks into a handheld mirror, pleasantly surprised and
delighted with the result of the botox treatment. The forehead appears
slightly smoother and subtly glowing while still looking natural and matching
the original character design. The peach character raises her eyebrows
playfully, admires the result and gently touches her forehead. Only subtle
natural movements. Clean modern aesthetic clinic, soft medical lighting,
cinematic realism, shallow depth of field, beauty treatment reveal shot.

Doctor isn't visible in the picture.
```

**I2V (только Kling):**

```text
The peach character sits on the clinic treatment bed holding a handheld
mirror. She looks at her reflection with excitement and satisfaction. She
raises her eyebrows up and down playfully, testing the result, gently touches
her smooth forehead with one finger, smiles proudly, and nods in approval.
Natural blinking, happy facial expression, subtle head tilt, realistic mirror
reflection, luxury aesthetic clinic interior, soft lighting, cinematic
realism, smooth natural movements.
```

---

## S7. Reveal — большое зеркало (акт 4б, medium)

**Референсы:** персик (лоб гладкий, чёлка снова уложена) + интерьер клиники.

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original body shape, proportions, colors, skin texture, hair, piercing, arms,
legs and shoes. Do not redesign or modify any part of the character.
Character identity must remain 100% unchanged.

Medium shot inside the luxury aesthetic clinic. The peach character stands
confidently in front of a large full-length mirror, smiling and admiring her
refreshed face. The camera is positioned behind and slightly to the side of
the peach character. The mirror clearly reflects her face, revealing the
smooth, glowing forehead result from the botox procedure. Her side-swept
bangs are styled back in place. She looks pleased and satisfied while gently
posing and checking the outcome in the mirror. Clean modern clinic interior,
elegant lighting, realistic reflections, cinematic realism, subtle natural
movements, shallow depth of field.

the doctor is not visible.

the peach's forehead is smoother and glowing now because of the botox
treatment.
```

**I2V (только Kling):**

```text
Static camera. The peach character stands in front of a full-length mirror
and looks at her reflection with excitement. She smiles broadly, raises her
eyebrows a few times admiring how smooth her forehead is, gently sweeps her
bangs aside to see it better, then proudly places her hands on her waist and
nods with satisfaction. Natural blinking, realistic mirror reflection, luxury
clinic interior, soft warm lighting, smooth natural motion, no camera
movement.
```

---

## S8. Прощание у входа (акт 5)

**Промежуточный кадр** — мастер-кадр с обновлённым лбом:

```text
Keep the same picture, only make the peach character's forehead a bit
smoother and subtly glowing because it took a botox treatment. Keep the bangs
and everything else exactly the same.
```

**Референсы:** персик с обновлённым лбом + кадр клиники с доктором.

```text
Make this exact character and composition.

The peach character is standing at the entrance of a luxury beauty clinic
after completing a botox treatment. Her forehead is smooth and glowing and
she is standing near the clinic entrance doors. She is smiling warmly and
waving goodbye with one hand.

The doctor is standing at the doorway of the clinic, smiling and waving
goodbye back to the peach character.

No handshake. Both characters are simply waving goodbye to each other in a
friendly and natural way.

The elegant glass entrance doors of the clinic are clearly visible. Natural
daylight shines through the entrance, creating a bright, welcoming atmosphere.

The peach character occupies approximately 70% of the frame. She looks
confident, happy, and satisfied with the results.

Luxury beauty clinic entrance, modern glass doors, marble walls, gold
accents, premium interior design, sophisticated atmosphere, professional
beauty clinic environment.

Heartwarming farewell moment, satisfied customer, successful beauty
treatment, premium salon experience, luxury beauty advertisement photography.

Ultra-detailed 3D render, realistic textures, cinematic depth of field,
vibrant colors, vertical 9:16 composition.
```

**I2V:**

```text
The peach character gently turns her head toward the doctor, smiles warmly,
raises her eyebrows playfully one last time, and gives a friendly goodbye
wave with one hand. After waving, she turns back toward the exit and walks
naturally toward the camera. The doctor smiles and waves back. Natural body
movement, realistic walking animation, subtle hair movement, luxury beauty
clinic atmosphere. No dialogue. Smooth cinematic motion.
```

---

## Финальный монтаж

CapCut: склейка по актам 1→5, SFX (маркер-точки «тук-тук», тонкий «пшик»
шприца, «дзынь» на подъём бровей в reveal, каблуки, дверь), трендовый звук.
Кадр для обложки: S6 — игривый подъём бровей у зеркала.

## Чеклист (из `03_EPISODE_FORMULA.md`)

- [ ] Персонаж идентичен во всех шотах (+ заколка на чёлке только в S3–S6)
- [ ] Доктор не заморожен
- [ ] Трансформация ≤ 20–30%, лицо живое (no frozen face)
- [ ] Все кадры 9:16
- [ ] Хук в первые 1–2 сек, хронометраж 20–35 сек
- [ ] Музыка + SFX

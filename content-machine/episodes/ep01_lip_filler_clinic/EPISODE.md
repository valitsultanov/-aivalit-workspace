# Эпизод 01 — Бьюти-клиника: филлеры (исходная связка)

Статус: ✅ произведён (оригинальная связка Валита).
Локация: люкс бьюти-клиника **HiSep.ai**. Специалист: доктор (реальный
человек, белая форма, борода, тёплая улыбка).

Общие правила: ChatGPT + Gemini параллельно, ретраи до попадания (иногда
10+), референсы персонажа без фона, i2v — Google Omni Flash, точные шоты —
Kling AI (first/last frame). Финал — CapCut.

---

## S0. Мастер-кадр персонажа

Промпт — см. `01_CHARACTER_BIBLE.md` (базовый образ). Розовый фон, шуба,
сумка. Из него делается вырезка без фона → референс для всех сцен.

---

## S1. Персонаж на кушетке с доктором (last frame акта 1)

**Референсы:** персик без фона + фото реального доктора.

```text
Pixar-style 3D anthropomorphic peach character lying on a white luxury beauty
clinic treatment bed, wearing oversized leopard print faux fur coat, holding
cream structured handbag, diamond pendant necklace, full glam makeup, short
dark brown bob hair, looking up directly at the doctor with wide expressive
eyes and rosy cheeks, a real human male doctor is sitting on a stool behind
the bed, short dark hair, neat beard, warm smile looking down at the peach
character, wearing white medical scrubs.

luxury beauty clinic interior: cream and white tones, gold accents, brass
floor lamp, glass shelf with gold luxury skincare bottles, round mirror on
wall, soft warm lighting, photorealistic background with 3D animated
character, vertical portrait composition, warm soft light
```

## S2. Клиника без персика (first frame акта 1)

**Референс:** кадр S1.

```text
The Peach should be removed from this photo and the doctor is looking at the
camera.
```

> ❗ Критично: поза доктора должна ИЗМЕНИТЬСЯ относительно S1 — иначе он
> будет заморожен в видео.

**Видео акта 1:** first frame = S2, last frame = S1 (появление персонажа).

---

## S3. Реакция с ручным зеркалом — губы (акт 4а, close-up)

**Референс:** персик без фона.

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original lips, eyes, nose, skin texture, hair, body shape, proportions,
colors, piercing, arms, legs and shoes. Character identity must remain 100%
unchanged.

Close-up of the peach character sitting on the luxury clinic treatment bed.
The peach character looks into a handheld mirror, pleasantly surprised and
happy with the result of the lip filler. The lips appear slightly fuller and
well-shaped while still looking natural and matching the original character
design. The peach character smiles confidently, admires the result and gently
touches her lips. Only subtle natural movements. Clean modern aesthetic
clinic, soft medical lighting, cinematic realism, shallow depth of field,
beauty treatment reveal shot.

Doctor isn't visible in the picture.
```

**I2V (только Kling):**

```text
The peach character sits on the clinic treatment bed holding a handheld
mirror. She looks at her reflection with excitement and satisfaction. She
gently taps her upper lip with one finger, smiles proudly, and nods in
approval. Natural blinking, happy facial expression, subtle head tilt,
realistic mirror reflection, luxury aesthetic clinic interior, soft lighting,
cinematic realism, smooth natural movements.
```

---

## S4. Лицом вниз на кушетке, доктор рядом (акт 2а, medium)

**Референс:** коллаж — персик (розовый фон) + доктор у кушетки.

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original character design unchanged.

Medium shot. The peach character is already lying face-down on the luxury
clinic treatment bed. The camera shows the back view of the peach character
resting comfortably and preparing for the next procedure. The doctor stands
beside the bed. Clean modern aesthetic clinic, soft medical lighting,
realistic clinic atmosphere, cinematic realism, subtle natural movements.
```

**I2V (только Kling):**

```text
Static camera. The peach character lies face-down on the clinic treatment bed
while the doctor stands beside her. The doctor focuses on the right side of
the peach character's lower body. Using a pen, he points to several specific
locations on the right side, comparing positions and visually measuring
proportions. He carefully studies the area, makes small measuring gestures
with the pen, pauses to calculate and evaluate the shape, then points again
to different spots as if planning the treatment markings. The peach character
remains still and relaxed. Professional aesthetic consultation, realistic
assessment process, natural hand movements, luxury clinic environment, soft
warm lighting, cinematic realism, no camera movement.
```

---

## S5. Top-down: разметка маркером (акт 2б)

**Референс:** кадр S4 (вид сверху на голову — промежуточный кадр).

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original body shape, proportions, colors, skin texture, hair, piercing, arms,
legs and shoes. Do not redesign or modify any part of the character.
Character identity must remain 100% unchanged.

Top-down close-up. Camera directly above the treatment bed, focused on the
right lower back side of the peach character's body while she lies face-down
on the luxury clinic treatment bed. The doctor's gloved hand uses a white
surgical marker to draw a neat circular treatment marking on the right lower
body area. The marking is clearly visible against the peach skin. Clean
modern aesthetic clinic, realistic pre-procedure preparation, soft medical
lighting, shallow depth of field, cinematic realism, subtle natural movements.
```

**Пара для Kling:** сначала кадр БЕЗ круга:

```text
Keep the picture, only remove the white circle.
```

First frame = без круга, end frame = с кругом. Промпт:

```text
A gloved hand holding a white marker slowly draws a white circle on the peach
character's back. Camera stays still. No other movement.
```

---

## S6. Extreme close-up: инъекция филлера (акт 3)

**Референс:** кадр S5 (с кругом).

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original body shape, proportions, colors, skin texture, hair, piercing, arms,
legs and shoes. Do not redesign, enlarge, reshape or modify any part of the
character. Character identity must remain 100% unchanged.

Extreme close-up of the marked treatment area on the right lower back side of
the peach character's body. The white circular marker drawn in the previous
shot is clearly visible. The doctor's blue medical-gloved hands enter the
frame holding a professional dermal filler syringe. The needle gently enters
the center of the marked circle and performs a careful filler injection with
subtle realistic movements. Camera tightly focused on the injection area
only. Clean luxury aesthetic clinic environment, realistic cosmetic
procedure, soft clinical lighting, shallow depth of field, cinematic realism,
high-detail macro shot.
```

**I2V (только Kling):**

```text
Static camera. Extreme close-up of the peach character's lower body. A doctor
wearing blue medical gloves performs a professional cosmetic filler procedure
using a syringe within the white treatment marking. Realistic and precise
treatment movements. The peach character remains completely still. During the
procedure, the treated area gradually becomes slightly fuller, rounder, and
smoother with a very subtle natural volume increase (20-30% only). Natural
result, balanced proportions, no exaggerated enlargement, no sudden swelling,
no deformation. Professional aesthetic clinic environment, soft medical
lighting, cinematic realism, shallow depth of field, no camera movement.
```

---

## S7. Full-length зеркало: результат (акт 4б)

**Промежуточный кадр** — профиль на розовом фоне (промпт «профиль» из
`01_CHARACTER_BIBLE.md`, без шубы и сумки).

**Референсы:** профиль + кадр клиники/доктора.

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original body shape, proportions, colors, skin texture, hair, piercing, arms,
legs and shoes. Do not redesign or modify any part of the character.
Character identity must remain 100% unchanged.

Medium shot inside the luxury aesthetic clinic. The peach character stands
confidently in front of a large full-length mirror, smiling and admiring the
results. The camera is positioned behind and slightly to the side of the
peach character. The mirror clearly reflects the peach character from the
rear angle, revealing the enhanced, fuller lower body result from the
procedure. The peach character looks pleased and satisfied while gently
posing and checking the outcome in the mirror. The doctor stands nearby,
smiling. Clean modern clinic interior, elegant lighting, realistic
reflections, cinematic realism, subtle natural movements, shallow depth of
field.

the doctor is not visible.

the peach's lip is bigger and glossy now because of filler in the lips
```

**I2V (только Kling):**

```text
Static camera. The peach character stands in front of a full-length mirror
and looks at her reflection with excitement. She smiles broadly, looks
pleasantly surprised, gently touches her cheek, then proudly places her hands
on her waist. She slightly turns her body to admire the result from different
angles, nods with satisfaction, and gives a happy smile to her reflection.
Natural blinking, realistic mirror reflection, luxury clinic interior, soft
warm lighting, smooth natural motion, no camera movement.
```

---

## S8. Прощание у входа (акт 5)

**Промежуточный кадр** — мастер-кадр с новыми губами:

```text
Keep the same picture, only make the peach character's lips a bit bigger and
glossy because it took lip filler.
```

**Референсы:** персик с новыми губами + кадр клиники с доктором.

```text
Make this exact character and composition.

The peach character is standing at the entrance of a luxury beauty clinic
after completing treatment. Her lips has been fully transformed and she is
standing near the clinic entrance doors. She is smiling warmly and waving
goodbye with one hand.

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
and gives a friendly goodbye wave with one hand. After waving, she turns back
toward the exit and walks naturally toward the camera. The doctor smiles and
waves back. Natural body movement, realistic walking animation, subtle hair
movement, luxury beauty clinic atmosphere. No dialogue. Smooth cinematic
motion.
```

---

## Финальный монтаж

CapCut (или любой редактор): склейка видео S1→S8 по актам, музыка, SFX
(маркер, шприц, каблуки, дверь). Проверка по чеклистам из
`03_EPISODE_FORMULA.md`.

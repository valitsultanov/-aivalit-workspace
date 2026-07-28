# Barbie Salon — Эпизод 01 «Макияж» (полный шот-лист)

Статус: 🟡 в производстве. Персонажи и их LOCK — в `PROMPTS.md` (этот же
каталог). Процедура: восстановление макияжа (face-up) кукле со стёртым лицом.

Один набор кадров → три монтажа под три линии (`../../CONTENT_LINES.md`):
- 😂 Юмор: с субтитрами-диалогами и панчлайном
- 💎 Real Beauty: с титрами-этапами («Диагностика» → «Брови» → «Губы»...)
- 🎧 ASMR: длинные версии шотов S4–S6 без слов, только звуки кисти

Блок мира — В КАЖДЫЙ промпт сцены:

```text
The dolls have glossy plastic skin, molded seams and doll proportions. The
environment, furniture, tools and products are fully photorealistic
real-world objects. Only the dolls are dolls.
```

---

## S1. Салон без клиентки (first frame акта 1)

Мастер-кадр Барби из `PROMPTS.md` уже содержит салон. Для first frame —
правка позы (анти-заморозка):

```text
Keep the picture, only change the master doll's pose: she is standing by the
styling chair, wiping a real makeup brush with a cloth, looking at the
camera with a welcoming smile.
```

## S2. Клиентка входит (last frame акта 1)

Референсы: обе куклы без фона + кадр салона.

```text
[LOCK мастера] + [LOCK клиентки] + [блок мира]

Medium shot inside the real luxury beauty salon. The client doll with worn
faded makeup stands at the salon entrance area, holding her crossbody bag
strap with both hands, shy hopeful posture. The master doll turns toward
her from the styling chair with a warm welcoming gesture, inviting her in.
Soft warm salon lighting, cinematic realism, shallow depth of field,
vertical 9:16 composition.
```

**Видео акта 1 (Kling, first = S1, last = S2):**

```text
The client doll walks into the salon and stops shyly. The master doll turns
toward her and welcomes her with an inviting gesture. Camera stays still.
No other movement.
```

## S3. Консультация в кресле (акт 2)

Сцена из `PROMPTS.md` §3 (клиентка в кресле, мастер с кистью изучает лицо).

**I2V (Kling):**

```text
Static camera. The master doll gently tilts the client doll's chin up with
one hand and studies her faded face closely, moving her head slightly left
and right like a professional makeup artist assessing a canvas. She nods
confidently as if saying "I can fix this". The client doll blinks and looks
up hopefully. Subtle natural doll movements, soft salon lighting, cinematic
realism, no camera movement.
```

Юмор-версия: субтитры «— Кто это с вами сделал? — Хозяйка. В 2009-м.»

## S4. Макро: брови и стрелки (акт 3, часть 1)

Референс: клиентка в кресле (S3).

```text
[LOCK клиентки] + [блок мира]

Extreme close-up of the client doll's face, worn faded makeup clearly
visible. A real fine detail brush held by the master doll's plastic hand
enters the frame and begins painting a crisp brown eyebrow stroke by stroke
on the doll's face. Real professional paint palette blurred in the
foreground. The contrast between the real brush bristles and the glossy
plastic skin is clearly visible. Macro photography detail, soft focused
lighting, shallow depth of field, cinematic realism, vertical 9:16.
```

**I2V (Kling):**

```text
Static camera. Extreme close-up of the doll's face. A real fine brush
paints a defined eyebrow with short precise strokes, then draws a crisp
black eyeliner line in one smooth motion. The painted makeup appears
gradually and realistically (20-30% progress only in this shot). The doll
remains completely still. No deformation, the face stays a painted doll
face. Realistic brush movements, macro detail, soft lighting, no camera
movement.
```

## S5. Макро: румяна и губы (акт 3, часть 2)

Правка от S4-результата:

```text
Keep the picture, only the brush is now a real fluffy blush brush applying
soft pink blush to the doll's cheek, the eyebrows and eyeliner are already
freshly painted.
```

**I2V (Kling):**

```text
Static camera. Extreme close-up of the doll's face. A real fluffy brush
sweeps soft pink blush onto the cheeks, then a fine lip brush fills the
lips with glossy rose color, restoring the doll's painted smile. Gradual
realistic progress (20-30% only in this shot), the face stays a painted
doll face, no deformation. Realistic brush movements, macro detail, soft
lighting, no camera movement.
```

## S6. Reveal у зеркала (акт 4)

Кадр «после» — правка из `PROMPTS.md` §4. Затем сцена:

```text
[LOCK клиентки — версия «после»] + [блок мира]

Close-up. The client doll sits in the styling chair in front of the large
round illuminated mirror, seeing her fully restored painted makeup for the
first time: defined brows, crisp eyeliner, pink blush, glossy rose lips.
Her reflection is clearly visible in the real mirror. Delighted, amazed
posture, hands raised to her cheeks. The master doll stands behind the
chair with a proud smile. Warm salon lighting, realistic mirror
reflection, cinematic realism, vertical 9:16.
```

**I2V (Kling):**

```text
Static camera. The client doll leans toward the mirror, touches her cheek
gently, turns her head left and right admiring her restored makeup, then
claps her hands with joy. The master doll behind the chair nods proudly.
Natural doll movements, realistic mirror reflection, warm lighting, no
camera movement.
```

**Пара для Kling (альтернатива):** first = лицо «до», last = лицо «после»:

```text
A real makeup brush gently sweeps across the doll's face, and her painted
makeup gradually appears: eyebrows, eyeliner, blush and glossy lips. Camera
stays still. No other movement.
```

## S7. Прощание (акт 5)

```text
[LOCK мастера] + [LOCK клиентки «после»] + [блок мира]

Medium shot at the salon entrance. The client doll with her fresh painted
makeup waves goodbye happily, glowing with confidence, her crossbody bag on
her shoulder. The master doll stands by the styling chair waving back with
a warm smile. Real salon interior with warm daylight from the entrance.
The client doll occupies about 70% of the frame. Cinematic realism,
vertical 9:16.
```

**I2V:**

```text
The client doll waves goodbye, turns and walks toward the camera with a
happy confident doll walk. The master doll waves back and returns to her
station. Natural doll movements, subtle hair movement, warm lighting,
smooth cinematic motion. No dialogue.
```

---

## Монтажи

| Линия | Хронометраж | Сборка |
|---|---|---|
| 😂 Юмор | 20–30 сек | S1→S7 целиком, субтитры-диалоги, панч в S3, трендовый звук |
| 💎 Real Beauty | 30–45 сек | S3→S6 с титрами этапов («Диагностика», «Брови», «Стрелки», «Румяна», «Губы», «Reveal»), закадр или каптions |
| 🎧 ASMR | 60–120 сек | Длинные дубли S4–S5 (генерить по 2–3 варианта движений кисти), звуки: шорох кисти по пластику, щелчок палетки, без музыки |

SFX-библиотека эпизода: шорох кисти, щелчок палетки, скрип пластика,
«дзынь» на reveal, шаги-каблучки.

## Чеклист

- [ ] Обе куклы идентичны своим референсам во всех шотах
- [ ] Куклы НЕ очеловечились (проверять каждый кадр: швы, пластик, painted face)
- [ ] Инструменты и салон фотореальны в каждом кадре
- [ ] Прогресс макияжа ступенчатый (20–30% на шот), без морфа
- [ ] Все кадры 9:16
- [ ] Три монтажа собраны с одного набора кадров

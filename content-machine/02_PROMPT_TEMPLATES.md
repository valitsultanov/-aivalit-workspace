# 02 — Шаблоны промптов

Все шаблоны — на английском (модели работают лучше). Плейсхолдеры в `{фигурных скобках}`.

---

## T1. Кадр «персонаж в сцене» (image, с референсами)

Референсы: персонаж без фона (+ фото специалиста/локации при необходимости).

```text
REFERENCE CHARACTER LOCK:
Use the exact same peach character from the reference image. Keep the exact
original lips, eyes, nose, skin texture, hair, body shape, proportions,
colors, piercing, arms, legs and shoes. Do not redesign or modify any part of
the character. Character identity must remain 100% unchanged.

{Тип кадра: Medium shot / Close-up / Extreme close-up / Top-down close-up}.
{Что делает персонаж, где находится, куда смотрит}.
{Кто ещё в кадре и что делает / "the doctor is not visible"}.

{Локация}: {ключевые детали интерьера, брендинг}, soft warm lighting,
photorealistic background with 3D animated character, vertical portrait
composition, cinematic realism, shallow depth of field.
```

## T2. Кадр локации без персонажа (для first frame)

```text
{Локация и специалист: поза, взгляд в камеру или в сторону}.
The {peach character} should be removed from this photo and the {specialist}
is looking at the camera.
```

> ❗ Обязательно ИЗМЕНИ позу специалиста относительно кадра с персонажем —
> иначе он будет заморожен в видео.

## T3. Минимальная правка кадра (edit)

```text
Keep the picture, only {remove the white circle / make the peach character's
lips a bit bigger and glossy because it took lip filler / …}.
```

## T4. Пара first/last frame для Kling

1. Кадр А (состояние «до») — first frame.
2. Кадр Б (состояние «после») — end frame.
3. Промпт описывает ТОЛЬКО переход, одним действием:

```text
{Одно действие: A gloved hand holding a white marker slowly draws a white
circle on the peach character's back}. Camera stays still. No other movement.
```

## T5. Image-to-video (одиночный кадр, Kling / Omni Flash)

```text
Static camera. {Кто и где}. {2–4 микро-движения: smiles, taps her lip, nods,
turns head}. Natural blinking, {happy/relaxed} facial expression, subtle head
tilt, {realistic mirror reflection — если есть зеркало}, {локация} interior,
soft lighting, cinematic realism, smooth natural movements, no camera movement.
```

## T6. I2V с трансформацией (ограничители обязательны)

```text
Static camera. Extreme close-up of {зона}. {Специалист} performs a
professional {процедура} using {инструмент} within the {разметка}. Realistic
and precise treatment movements. The peach character remains completely
still. During the procedure, the treated area gradually becomes slightly
{fuller/whiter/smoother} with a very subtle natural change (20-30% only).
Natural result, balanced proportions, no exaggerated enlargement, no sudden
swelling, no deformation. Professional {локация} environment, soft medical
lighting, cinematic realism, shallow depth of field, no camera movement.
```

## T7. Финальный кадр-прощание (outro)

```text
Make this exact character and composition.

The peach character is standing at the entrance of a {локация} after
completing {процедура}. Her {результат} has been fully transformed and she is
standing near the entrance doors. She is smiling warmly and waving goodbye
with one hand.

The {специалист} is standing at the doorway, smiling and waving goodbye back
to the peach character.

No handshake. Both characters are simply waving goodbye to each other in a
friendly and natural way.

The elegant glass entrance doors are clearly visible. Natural daylight shines
through the entrance, creating a bright, welcoming atmosphere.

The peach character occupies approximately 70% of the frame. She looks
confident, happy, and satisfied with the results.

{Локация} entrance, modern glass doors, marble walls, gold accents, premium
interior design, sophisticated atmosphere.

Heartwarming farewell moment, satisfied customer, premium experience, luxury
advertisement photography.

Ultra-detailed 3D render, realistic textures, cinematic depth of field,
vibrant colors, vertical 9:16 composition.
```

I2V к нему:

```text
The peach character gently turns her head toward the {специалист}, smiles
warmly, and gives a friendly goodbye wave with one hand. After waving, she
turns back toward the exit and walks naturally toward the camera. The
{специалист} smiles and waves back. Natural body movement, realistic walking
animation, subtle hair movement, {локация} atmosphere. No dialogue. Smooth
cinematic motion.
```

---

## Приёмы-модификаторы

| Проблема | Приём |
|---|---|
| Персонаж «уплывает» | Усилить LOCK, референс без фона, меньше новых деталей в промпте |
| Модель меняет лишнее при правке | T3: «Keep the picture, only …» |
| Специалист заморожен в видео | Разные позы в first/last frame (T2) |
| Трансформация ломает анатомию | T6: «20-30% only, no deformation…» |
| Камера дёргается | «Static camera … no camera movement» в начале И в конце промпта |
| Два действия слиплись | Разбить на два шота / две пары frame |

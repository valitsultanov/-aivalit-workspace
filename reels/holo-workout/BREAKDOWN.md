# Reverse engineering: 4-move dumbbell workout reel

## What the reference is

| Parameter | Value |
|---|---|
| Format | 720×1280, 30 fps, 21.2 s, AAC stereo, loudness −14.1 LUFS |
| Character | one consistent 3D figure: a smooth beige mannequin with no face, white sneakers, black shorts |
| Setting | dark industrial gym, two-level balcony, slanted yellow neon tubes, dumbbell racks, glossy floor |
| Camera | static, full body, centred, lots of headroom |
| Structure | 4 moves × ~5.25 s, no hook card or end card: the first move *is* the hook |
| Text | the move name + reps (“DB Thrusters x10”) at the top in a heavy grotesk, white |
| Branding | vertical channel logo on the left edge (theirs, not copied) |

### Beats

| Time | Move | Transition into the next |
|---|---|---|
| 0:00–0:05 | DB Thrusters ×10 | 0.2–0.3 s RGB split glitch; the title flares out, the new one *decodes* from random symbols |
| 0:05.25–0:10.5 | DB Hang Clean ×10 | the same glitch and decode |
| 0:10.5–0:15.75 | Gorilla Row Sprawl Combo ×10 | the same glitch and decode |
| 0:15.75–0:21.2 | Mixed Rack March ×10 | ends on the move, no CTA |

### How it is most likely made

1. One character reference image (a mannequin in a gym) → image-to-video clips of 5 s, one per move (Kling / Seedance class models), with the same start frame for consistency.
2. Clips joined end to end; the RGB-split glitch hides the jump between clips.
3. Title overlay with a “decode” text animation and a light flare on exit (CapCut / After Effects preset).
4. A music bed normalised to −14 LUFS.

### Why it works

- **No intro:** the first move is already the content, so the hold rate in the first second is high.
- **Repeatable format:** 4 moves × 5 s, same character, same set → a series you can make every day.
- **Saveable:** a workout is a list people come back to, so saves drive the reach.
- **The glitch gives rhythm** without cuts that would break the illusion of one take.

## Our version: “Neon Hologram”

Same structure and pacing, new style, all drawn in code (Remotion), no AI video credits:

- a glowing cyan hologram athlete (scanline body, white joint nodes, magenta hex dumbbells) on a synthwave floor grid with neon wall bars, floor reflection and floating particles;
- move titles decode from symbols, flare out, RGB-ghost glitch + slice bars on every cut;
- a 4-segment progress rail on the left instead of a logo;
- **added** (the reference has none): CTA “Comment HOLO for the full 4-round plan” and “Save this workout” last;
- 23.5 s, 1080×1920.

Render: `npx remotion render src/index.ts Holo out/holo-workout.mp4 --timeout=120000 --concurrency=3`.
Poses are in `src/rig.tsx` (`poseAt`), timing in `src/timeline.ts`.

## Prompts to make it with AI video instead (Higgsfield)

Character image (once):
> A full-body glowing cyan hologram of an athletic man made of scanlines and wireframe, white glowing joint nodes, holding two magenta neon hex dumbbells, standing centred on a dark synthwave gym floor grid with cyan and magenta neon bars on the back wall, 9:16, lots of headroom, no text, no logos.

Per move (image-to-video, 5 s, static camera):
> The hologram athlete performs [DB thrusters: a front squat with dumbbells at the shoulders, then drives up and presses both dumbbells overhead], smooth continuous reps, the camera stays still, full body in frame, subtle hologram flicker.

Swap the bracket for: hang clean (dumbbells at the thighs → racked at the shoulders), gorilla row (bent over, alternating one-arm rows), mixed rack march (one dumbbell overhead, one at the side, alternating high knees).

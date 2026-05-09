#!/usr/bin/env python3
"""
Instagram Carousel Generator for @sultanov.valit
Editorial / magazine style — cream background, serif fonts, olive accent.

Usage:
    python carousel_generator.py --demo
    python carousel_generator.py --config my_carousel.json --name my_post
"""

import argparse
import json
import os
from pathlib import Path
from typing import Optional

from PIL import Image, ImageDraw, ImageFont, ImageFilter

from brand_config import CANVAS, COLORS, FONTS, FONT_SIZES, LAYOUT, BRAND


OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)

W = CANVAS["width"]
H = CANVAS["height"]
M = LAYOUT["margin"]


# ──────────────────────────────────────────────
# Font cache
# ──────────────────────────────────────────────

_font_cache: dict = {}

def font(style: str, size: int) -> ImageFont.FreeTypeFont:
    key = (style, size)
    if key not in _font_cache:
        path = FONTS.get(style, FONTS["sans_regular"])
        try:
            _font_cache[key] = ImageFont.truetype(path, size)
        except OSError:
            _font_cache[key] = ImageFont.load_default()
    return _font_cache[key]


# ──────────────────────────────────────────────
# Drawing primitives
# ──────────────────────────────────────────────

def text_w(f: ImageFont.FreeTypeFont, text: str) -> int:
    bb = f.getbbox(text)
    return bb[2] - bb[0]

def text_h(f: ImageFont.FreeTypeFont, text: str = "Hg") -> int:
    bb = f.getbbox(text)
    return bb[3] - bb[1]


def wrap_text(f: ImageFont.FreeTypeFont, text: str, max_w: int) -> list[str]:
    words = text.split()
    lines, cur = [], ""
    for word in words:
        candidate = f"{cur} {word}".strip()
        if text_w(f, candidate) <= max_w:
            cur = candidate
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def draw_wrapped(draw: ImageDraw.Draw, text: str, f: ImageFont.FreeTypeFont,
                 x: int, y: int, max_w: int, fill: str,
                 line_gap: float = 1.35, align: str = "left") -> int:
    lines = wrap_text(f, text, max_w)
    lh = int(text_h(f) * line_gap)
    for line in lines:
        if align == "center":
            offset = (max_w - text_w(f, line)) // 2
            draw.text((x + offset, y), line, font=f, fill=fill)
        elif align == "right":
            offset = max_w - text_w(f, line)
            draw.text((x + offset, y), line, font=f, fill=fill)
        else:
            draw.text((x, y), line, font=f, fill=fill)
        y += lh
    return y


def draw_multipart_heading(draw: ImageDraw.Draw,
                            parts: list[dict], x: int, y: int, max_w: int,
                            line_gap: float = 1.2) -> int:
    """
    Render a heading made of parts, each with {text, style, color}.
    Parts flow word-by-word; a part with "newline": true forces a line break.
    Simple approach: render each part on its own line for now.
    """
    for part in parts:
        txt = part.get("text", "")
        style = part.get("style", "serif_bold")
        color = part.get("color", COLORS["text_primary"])
        size = part.get("size", FONT_SIZES["heading_xl"])
        f = font(style, size)
        y = draw_wrapped(draw, txt, f, x, y, max_w, color, line_gap=line_gap)
    return y


def draw_rounded_rect(draw: ImageDraw.Draw, box: tuple, radius: int,
                      fill: str, outline: Optional[str] = None, width: int = 2):
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def draw_ghost_number(draw: ImageDraw.Draw, number: int):
    f = font("serif_bold", FONT_SIZES["ghost"])
    txt = str(number)
    tw = text_w(f, txt)
    th = text_h(f, txt)
    # Right-anchored, vertically centered, slightly cut off
    x = W - tw + tw // 5
    y = (H - th) // 2 + 60
    draw.text((x, y), txt, font=f, fill=COLORS["ghost"])


def draw_top_bar(draw: ImageDraw.Draw, slide_n: int, total: int,
                 channel: str = BRAND["channel"]):
    f = font("sans_regular", FONT_SIZES["topbar"])
    y = M - 10
    draw.text((M, y), channel.upper(), font=f, fill=COLORS["text_secondary"])
    num_text = f"{slide_n:02d}/{total:02d}"
    draw.text((W - M - text_w(f, num_text), y), num_text, font=f, fill=COLORS["text_secondary"])


def draw_bottom_bar(draw: ImageDraw.Draw, hashtag: str = BRAND["hashtag"],
                    cta: str = BRAND["nav_cta"], is_last: bool = False):
    f = font("sans_regular", FONT_SIZES["bottom_bar"])
    y = H - M - text_h(f) - 4
    # thin divider line
    draw.rectangle([M, y - 16, W - M, y - 14], fill=COLORS["divider"])
    draw.text((M, y), hashtag, font=f, fill=COLORS["text_secondary"])
    right_text = BRAND["handle"] if is_last else cta
    draw.text((W - M - text_w(f, right_text), y), right_text,
              font=f, fill=COLORS["accent"] if is_last else COLORS["text_primary"])


def draw_category_label(draw: ImageDraw.Draw, label: str, x: int, y: int) -> int:
    f = font("sans_regular", FONT_SIZES["category"])
    draw.text((x, y), label.upper(), font=f, fill=COLORS["accent"])
    return y + text_h(f) + 14


def draw_olive_divider(draw: ImageDraw.Draw, x: int, y: int, w: int):
    draw.rectangle([x, y, x + w, y + 2], fill=COLORS["divider"])


# ──────────────────────────────────────────────
# Card row (label | description)
# ──────────────────────────────────────────────

def measure_card_height(label: str, description: str, available_w: int) -> int:
    lc_w = LAYOUT["label_col_w"]
    gap = LAYOUT["col_gap"]
    desc_w = available_w - lc_w - gap
    px, py = LAYOUT["card_padding_x"], LAYOUT["card_padding_y"]

    f_lbl = font("serif_italic", FONT_SIZES["card_label"])
    f_desc = font("sans_regular", FONT_SIZES["card_body"])

    lbl_lines = wrap_text(f_lbl, label, lc_w - px)
    desc_lines = wrap_text(f_desc, description, desc_w - px)

    lbl_h = len(lbl_lines) * int(text_h(f_lbl) * 1.3)
    desc_h = len(desc_lines) * int(text_h(f_desc) * 1.35)

    return max(lbl_h, desc_h) + py * 2


def draw_card_row(draw: ImageDraw.Draw, label: str, description: str,
                  x: int, y: int, card_w: int) -> int:
    lc_w = LAYOUT["label_col_w"]
    gap = LAYOUT["col_gap"]
    desc_w = card_w - lc_w - gap
    px, py = LAYOUT["card_padding_x"], LAYOUT["card_padding_y"]
    card_h = measure_card_height(label, description, card_w)

    draw_rounded_rect(draw, (x, y, x + card_w, y + card_h),
                      radius=LAYOUT["card_radius"],
                      fill=COLORS["bg_card"],
                      outline=COLORS["card_border"],
                      width=LAYOUT["card_border"])

    f_lbl = font("serif_italic", FONT_SIZES["card_label"])
    draw_wrapped(draw, label, f_lbl, x + px, y + py, lc_w - px,
                 COLORS["accent"], line_gap=1.3)

    f_desc = font("sans_regular", FONT_SIZES["card_body"])
    draw_wrapped(draw, description, f_desc, x + lc_w + gap, y + py,
                 desc_w - px, COLORS["text_primary"], line_gap=1.35)

    return y + card_h


def paste_photo(img: Image.Image, photo_path: str,
                box: tuple, blend: float = 1.0):
    """Paste a photo cropped to box dimensions."""
    try:
        ph = Image.open(photo_path).convert("RGBA")
        bx, by, bw, bh = box
        # Resize to fill box (crop center)
        ratio = max(bw / ph.width, bh / ph.height)
        new_w, new_h = int(ph.width * ratio), int(ph.height * ratio)
        ph = ph.resize((new_w, new_h), Image.LANCZOS)
        ox = (new_w - bw) // 2
        oy = (new_h - bh) // 2
        ph = ph.crop((ox, oy, ox + bw, oy + bh))
        img.paste(ph, (bx, by), ph)
    except Exception:
        pass  # photo optional — skip silently


# ──────────────────────────────────────────────
# Slide builders
# ──────────────────────────────────────────────

def base_image() -> tuple[Image.Image, ImageDraw.Draw]:
    img = Image.new("RGB", (W, H), COLORS["bg"])
    draw = ImageDraw.Draw(img)
    return img, draw


def slide_cover(data: dict, index: int, total: int) -> Image.Image:
    """Photo cover with bold white headline overlay."""
    img, draw = base_image()

    photo = data.get("photo", "")
    if photo:
        # Full-bleed photo
        paste_photo(img, photo, (0, 0, W, H))
        # Dark overlay for readability
        overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ov_draw = ImageDraw.Draw(overlay)
        ov_draw.rectangle([0, 0, W, H // 2 + 100],
                          fill=(0, 0, 0, 160))
        img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")
        draw = ImageDraw.Draw(img)
        text_color = COLORS["white"]
        sub_color = "#CCCCCC"
    else:
        # No photo — styled cream cover
        # Accent block top-left
        draw.rectangle([0, 0, W, 420], fill="#1A1A1A")
        text_color = COLORS["white"]
        sub_color = COLORS["accent_light"]

    # Heading
    heading = data.get("heading", "")
    f_h = font("sans_bold", FONT_SIZES["cover_heading"])
    y = M + 40
    y = draw_wrapped(draw, heading, f_h, M, y, W - M * 2, text_color, line_gap=1.2)

    # Subheading
    sub = data.get("subheading", "")
    if sub:
        y += 20
        f_s = font("sans_regular", FONT_SIZES["cover_sub"])
        draw_wrapped(draw, sub, f_s, M, y, W - M * 2, sub_color)

    # Bottom credit
    f_c = font("sans_regular", FONT_SIZES["caption"])
    credit = data.get("credit", BRAND["handle"])
    draw.text((M, H - M - text_h(f_c)), credit, font=f_c, fill="#AAAAAA")

    return img


def slide_content(data: dict, index: int, total: int) -> Image.Image:
    """Main editorial content slide with card rows."""
    img, draw = base_image()

    is_last = index == total
    draw_ghost_number(draw, index)
    draw_top_bar(draw, index, total)
    draw_bottom_bar(draw, is_last=is_last)

    content_top = M + LAYOUT["topbar_height"]
    content_bottom = H - M - LAYOUT["bottom_bar_h"] - 20
    available_h = content_bottom - content_top
    card_w = W - M * 2

    y = content_top

    # Category
    category = data.get("category", "")
    if category:
        y = draw_category_label(draw, category, M, y)

    # Heading parts or simple string
    heading = data.get("heading", "")
    heading_parts = data.get("heading_parts", [])

    if heading_parts:
        # Multi-style heading
        y = draw_multipart_heading(draw, heading_parts, M, y, W - M * 2)
    elif heading:
        italic_word = data.get("heading_italic", "")
        f_bold = font("serif_bold", FONT_SIZES["heading_xl"])
        f_ital = font("serif_italic", FONT_SIZES["heading_xl"])
        if italic_word:
            # heading on one line(s), then italic word below in olive
            y = draw_wrapped(draw, heading, f_bold, M, y,
                             W - M * 2, COLORS["text_primary"], line_gap=1.1)
            y = draw_wrapped(draw, italic_word, f_ital, M, y,
                             W - M * 2, COLORS["accent"], line_gap=1.1)
        else:
            y = draw_wrapped(draw, heading, f_bold, M, y,
                             W - M * 2, COLORS["text_primary"], line_gap=1.1)

    # Subheading
    subheading = data.get("subheading", "")
    if subheading:
        y += 10
        f_sub = font("sans_regular", FONT_SIZES["subheading"])
        draw_wrapped(draw, subheading, f_sub, M, y, W - M * 2,
                     COLORS["text_secondary"])
        y += text_h(f_sub) + 24

    # Divider
    draw_olive_divider(draw, M, y, W - M * 2)
    y += 28

    # Card rows
    cards = data.get("cards", [])
    for card in cards:
        lbl = card.get("label", "")
        desc = card.get("description", "")
        y = draw_card_row(draw, lbl, desc, M, y, card_w)
        y += LAYOUT["card_gap"]

    # Optional photo at bottom (cutout style)
    photo = data.get("photo", "")
    if photo and y < content_bottom - 100:
        photo_h = content_bottom - y - 20
        paste_photo(img, photo, (0, y + 10, W, photo_h))

    # Optional italic caption near photo
    caption = data.get("caption", "")
    if caption:
        f_cap = font("serif_italic", FONT_SIZES["subheading"])
        cap_y = content_bottom - text_h(f_cap) - 60
        draw.text((M + 40, cap_y), caption, font=f_cap, fill=COLORS["text_primary"])

    return img


def slide_quote(data: dict, index: int, total: int) -> Image.Image:
    """Full-slide pull quote."""
    img, draw = base_image()

    is_last = index == total
    draw_ghost_number(draw, index)
    draw_top_bar(draw, index, total)
    draw_bottom_bar(draw, is_last=is_last)

    quote = data.get("quote", "")
    author = data.get("author", "")

    f_q = font("serif_italic", FONT_SIZES["heading_lg"])
    f_a = font("sans_regular", FONT_SIZES["subheading"])

    # Opening mark
    f_mark = font("serif_bold", 200)
    draw.text((M - 10, H // 2 - 260), "“", font=f_mark, fill=COLORS["accent_light"])

    y = H // 2 - 160
    y = draw_wrapped(draw, quote, f_q, M, y, W - M * 2, COLORS["text_primary"], line_gap=1.3)

    if author:
        y += 40
        draw_olive_divider(draw, M, y, 100)
        y += 20
        draw.text((M, y), f"— {author}", font=f_a, fill=COLORS["accent"])

    return img


def slide_cta(data: dict, index: int, total: int) -> Image.Image:
    """Call-to-action final slide."""
    img, draw = base_image()

    draw_top_bar(draw, index, total)
    draw_bottom_bar(draw, is_last=True)

    # Big accent block
    block_y = H // 3
    draw.rectangle([0, block_y, W, block_y + 6], fill=COLORS["accent"])

    heading = data.get("heading", "Сохрани и поделись!")
    subheading = data.get("subheading", "")

    f_h = font("serif_bold", FONT_SIZES["heading_lg"])
    f_s = font("sans_regular", FONT_SIZES["subheading"])

    y = block_y + 60
    y = draw_wrapped(draw, heading, f_h, M, y, W - M * 2, COLORS["text_primary"])

    if subheading:
        y += 20
        draw_wrapped(draw, subheading, f_s, M, y, W - M * 2, COLORS["text_secondary"])
        y += text_h(f_s) * 2 + 20

    # Handle pill button
    btn_y = y + 40
    btn_h = 90
    draw_rounded_rect(draw, (M + 80, btn_y, W - M - 80, btn_y + btn_h),
                      radius=45, fill=COLORS["text_primary"])
    f_btn = font("sans_bold", FONT_SIZES["heading_md"] - 4)
    btn_text = BRAND["handle"]
    bw = text_w(f_btn, btn_text)
    draw.text(((W - bw) // 2, btn_y + (btn_h - text_h(f_btn)) // 2),
              btn_text, font=f_btn, fill=COLORS["white"])

    return img


SLIDE_BUILDERS = {
    "cover":   slide_cover,
    "content": slide_content,
    "quote":   slide_quote,
    "cta":     slide_cta,
}


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────

def generate_carousel(config: dict, folder_name: str = "carousel") -> Path:
    slides_data = config.get("slides", [])
    total = len(slides_data)
    out_dir = OUTPUT_DIR / folder_name
    out_dir.mkdir(exist_ok=True)

    print(f"Generating {total} slides → {out_dir}")
    for i, slide in enumerate(slides_data, start=1):
        slide_type = slide.get("type", "content")
        builder = SLIDE_BUILDERS.get(slide_type, slide_content)
        img = builder(slide, i, total)
        path = out_dir / f"slide_{i:02d}.jpg"
        img.save(path, "JPEG", quality=96)
        print(f"  [{i}/{total}] {slide_type:10s} → {path.name}")

    print("Done.")
    return out_dir


# ──────────────────────────────────────────────
# Demo config — AI tools carousel
# ──────────────────────────────────────────────

DEMO_CONFIG = {
    "slides": [
        {
            "type": "cover",
            "heading": "что читают топ-маркетологи и AI-предприниматели",
            "subheading": "большой пак ресурсов и инструментов",
            "credit": "тгк: sultanov.valit",
        },
        {
            "type": "content",
            "category": "Блок 1 · Основы",
            "heading": "Синергия с",
            "heading_italic": "ИИ",
            "subheading": "AI Synergy — автоматизируй рутину",
            "cards": [
                {"label": "Claude + ChatGPT",
                 "description": "Глубокие тексты, анализ данных, скрипты продаж — ваш 24/7 копирайтер"},
                {"label": "Midjourney",
                 "description": "Генерация визуала для постов и рекламы без дизайнера"},
                {"label": "Make (Integromat)",
                 "description": "Автоматизация любых процессов без кода — 24/7 без менеджера"},
                {"label": "HeyGen / Synthesia",
                 "description": "Видео-аватары для масштабирования контента без съёмок"},
            ],
            "caption": "ИИ у нас дома...",
        },
        {
            "type": "content",
            "category": "Блок 2 · Мышление",
            "heading": "Нетривиальные",
            "heading_italic": "фокусы",
            "subheading": "Углы, которых нет в стандартном тулките",
            "cards": [
                {"label": "Reddit Answers",
                 "description": "Правда без фильтров — реальные боли аудитории из сабреддитов"},
                {"label": "Wait But Why",
                 "description": "Сложнейшие темы от ИИ до Марса, разложенные на понятные концепции"},
                {"label": "Not Boring",
                 "description": "Бизнес- и тех-тренды через призму стратегии и сторителлинга"},
            ],
            "caption": "ну и фокусы у вас, пацаны...",
        },
        {
            "type": "quote",
            "quote": "AI не заменит тебя. Тебя заменит человек, который умеет работать с AI.",
            "author": "Valit Sultanov",
        },
        {
            "type": "content",
            "category": "Блок 3 · Рост",
            "heading": "Проактивность",
            "subheading": "Инициатива, которая делает незаменимым",
            "cards": [
                {"label": "Product Hunt",
                 "description": "Как бренды представляют себя миру — главная площадка запуска"},
                {"label": "«So Good They Can't Ignore You»",
                 "description": "Кэл Ньюпорт: драйв приходит с мастерством, а не с поиском призвания"},
                {"label": "MakerPad",
                 "description": "No-code сообщество: собирай прототипы сам, без программистов"},
            ],
            "caption": "никакой активности, коллеги",
        },
        {
            "type": "cta",
            "heading": "Сохрани чтобы не потерять",
            "subheading": "Подписывайся — каждую неделю AI-инструменты и стратегии для роста",
        },
    ]
}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Instagram Carousel Generator — editorial style")
    parser.add_argument("--config", help="Path to JSON config file")
    parser.add_argument("--demo", action="store_true", help="Generate demo carousel")
    parser.add_argument("--name", default="carousel", help="Output folder name")
    args = parser.parse_args()

    if args.demo:
        generate_carousel(DEMO_CONFIG, folder_name="demo_editorial")
    elif args.config:
        with open(args.config) as f:
            cfg = json.load(f)
        generate_carousel(cfg, folder_name=args.name)
    else:
        parser.print_help()

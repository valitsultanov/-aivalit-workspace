#!/usr/bin/env python3
"""
Instagram Carousel Generator for @sultanov.valit
Usage:
    python carousel_generator.py --config my_carousel.json
    python carousel_generator.py --demo
"""

import argparse
import json
import math
import os
import textwrap
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

from PIL import Image, ImageDraw, ImageFont

from brand_config import CANVAS, COLORS, FONTS, FONT_SIZES, LAYOUT, BRAND


OUTPUT_DIR = Path(__file__).parent / "output"
OUTPUT_DIR.mkdir(exist_ok=True)


# ──────────────────────────────────────────────
# Font cache
# ──────────────────────────────────────────────

_font_cache: dict[tuple, ImageFont.FreeTypeFont] = {}

def get_font(style: str, size: int) -> ImageFont.FreeTypeFont:
    key = (style, size)
    if key not in _font_cache:
        path = FONTS.get(style, FONTS["body"])
        try:
            _font_cache[key] = ImageFont.truetype(path, size)
        except OSError:
            _font_cache[key] = ImageFont.load_default()
    return _font_cache[key]


# ──────────────────────────────────────────────
# Drawing helpers
# ──────────────────────────────────────────────

def hex_to_rgb(h: str) -> tuple:
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def draw_rounded_rect(draw: ImageDraw.Draw, xy: tuple, radius: int, fill: str, outline: Optional[str] = None, outline_width: int = 2):
    x1, y1, x2, y2 = xy
    draw.rounded_rectangle([x1, y1, x2, y2], radius=radius, fill=fill, outline=outline, width=outline_width)


def draw_text_wrapped(draw: ImageDraw.Draw, text: str, font: ImageFont.FreeTypeFont,
                       x: int, y: int, max_width: int, fill: str,
                       line_spacing: float = 1.4, align: str = "left") -> int:
    """Draw wrapped text, return final Y position."""
    words = text.split()
    lines = []
    current = ""
    for word in words:
        test = f"{current} {word}".strip()
        bbox = font.getbbox(test)
        if bbox[2] - bbox[0] <= max_width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)

    line_h = int((font.getbbox("Hg")[3] - font.getbbox("Hg")[1]) * line_spacing)
    for line in lines:
        if align == "center":
            w = font.getbbox(line)[2] - font.getbbox(line)[0]
            draw.text((x + (max_width - w) // 2, y), line, font=font, fill=fill)
        else:
            draw.text((x, y), line, font=font, fill=fill)
        y += line_h
    return y


def draw_handle_bar(draw: ImageDraw.Draw, img_w: int, img_h: int):
    m = LAYOUT["margin"]
    font = get_font("body", FONT_SIZES["handle"])
    text = BRAND["handle"]
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    x = img_w - m - tw
    y = img_h - m - (bbox[3] - bbox[1]) - 10
    draw.text((x, y), text, font=font, fill=COLORS["accent_muted"])


def draw_slide_number(draw: ImageDraw.Draw, current: int, total: int, img_w: int):
    m = LAYOUT["margin"]
    font = get_font("body", FONT_SIZES["slide_number"])
    text = f"{current}/{total}"
    draw.text((m, m), text, font=font, fill=COLORS["text_secondary"])


def draw_accent_line(draw: ImageDraw.Draw, x: int, y: int, length: int = 80):
    draw.rectangle([x, y, x + length, y + 5], fill=COLORS["accent"])


def draw_tag(draw: ImageDraw.Draw, tag: str, x: int, y: int) -> int:
    """Draw a pill-shaped tag, return width consumed."""
    font = get_font("body", FONT_SIZES["tag"])
    bbox = font.getbbox(tag)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad_x, pad_y = 24, 14
    w = tw + pad_x * 2
    h = th + pad_y * 2
    draw_rounded_rect(draw, (x, y, x + w, y + h), radius=h // 2,
                      fill=COLORS["tag_bg"], outline=COLORS["accent"], outline_width=1)
    draw.text((x + pad_x, y + pad_y - 2), tag, font=font, fill=COLORS["tag_text"])
    return w


# ──────────────────────────────────────────────
# Slide types
# ──────────────────────────────────────────────

def make_base_image() -> tuple[Image.Image, ImageDraw.Draw]:
    img = Image.new("RGB", (CANVAS["width"], CANVAS["height"]), COLORS["bg_dark"])
    draw = ImageDraw.Draw(img)
    return img, draw


def slide_cover(data: dict, index: int, total: int) -> Image.Image:
    """Full-bleed title slide."""
    img, draw = make_base_image()
    m = LAYOUT["margin"]
    w, h = CANVAS["width"], CANVAS["height"]

    # Background accent block (top-right corner)
    block_size = 340
    draw.rectangle([w - block_size, 0, w, block_size], fill=COLORS["tag_bg"])

    # Tag(s)
    tags = data.get("tags", [])
    tx = m
    ty = m + 60
    for tag in tags:
        tw = draw_tag(draw, tag, tx, ty)
        tx += tw + 16

    # Heading
    heading = data.get("heading", "")
    font_h = get_font("heading", FONT_SIZES["heading"])
    y = ty + 100
    y = draw_text_wrapped(draw, heading, font_h, m, y, w - m * 2, COLORS["text_primary"])

    # Accent line
    draw_accent_line(draw, m, y + 30)

    # Subheading
    sub = data.get("subheading", "")
    if sub:
        font_s = get_font("body", FONT_SIZES["subheading"])
        y = draw_text_wrapped(draw, sub, font_s, m, y + 70, w - m * 2, COLORS["text_secondary"])

    # Bottom brand strip
    draw.rectangle([0, h - 140, w, h], fill=COLORS["bg_card"])
    font_brand = get_font("heading", FONT_SIZES["cta"])
    tagline_bbox = font_brand.getbbox(BRAND["tagline"])
    draw.text((m, h - 100), BRAND["handle"], font=font_brand, fill=COLORS["accent"])
    font_tag = get_font("body", FONT_SIZES["caption"])
    draw.text((m, h - 50), BRAND["tagline"], font=font_tag, fill=COLORS["text_secondary"])

    draw_slide_number(draw, index, total, w)
    return img


def slide_content(data: dict, index: int, total: int) -> Image.Image:
    """Standard content slide with heading + body bullets."""
    img, draw = make_base_image()
    m = LAYOUT["margin"]
    w, h = CANVAS["width"], CANVAS["height"]

    # Slide number
    draw_slide_number(draw, index, total, w)

    y = m + 80

    # Tag
    tag = data.get("tag", "")
    if tag:
        draw_tag(draw, tag, m, y)
        y += 80

    # Heading
    heading = data.get("heading", "")
    font_h = get_font("heading", FONT_SIZES["subheading"])
    y = draw_text_wrapped(draw, heading, font_h, m, y, w - m * 2, COLORS["accent"])
    y += 20

    draw_accent_line(draw, m, y)
    y += 50

    # Body bullets
    bullets = data.get("bullets", [])
    font_b = get_font("body", FONT_SIZES["body"])
    font_bullet = get_font("heading", FONT_SIZES["body"])
    for bullet in bullets:
        # bullet dot
        draw.ellipse([m, y + 10, m + 18, y + 28], fill=COLORS["accent"])
        y = draw_text_wrapped(draw, bullet, font_b, m + 36, y, w - m * 2 - 36, COLORS["text_primary"])
        y += 20

    # Optional note
    note = data.get("note", "")
    if note:
        y += 20
        draw_rounded_rect(draw, (m, y, w - m, y + 120), radius=16,
                          fill=COLORS["bg_card"], outline=COLORS["divider"])
        font_note = get_font("body", FONT_SIZES["caption"])
        draw_text_wrapped(draw, note, font_note, m + 24, y + 28, w - m * 2 - 48, COLORS["text_secondary"])

    draw_handle_bar(draw, w, h)
    return img


def slide_quote(data: dict, index: int, total: int) -> Image.Image:
    """Full-slide quote / highlight."""
    img, draw = make_base_image()
    m = LAYOUT["margin"]
    w, h = CANVAS["width"], CANVAS["height"]

    draw_slide_number(draw, index, total, w)

    # Big opening quote mark
    font_quote = get_font("heading", 200)
    draw.text((m - 20, h // 2 - 280), "“", font=font_quote, fill=COLORS["tag_bg"])

    quote = data.get("quote", "")
    font_q = get_font("heading", FONT_SIZES["heading"] - 8)
    center_x = m
    y = h // 2 - 160
    y = draw_text_wrapped(draw, quote, font_q, center_x, y, w - m * 2, COLORS["text_primary"])

    author = data.get("author", "")
    if author:
        y += 40
        draw_accent_line(draw, m, y)
        y += 30
        font_a = get_font("body", FONT_SIZES["caption"])
        draw.text((m, y), f"— {author}", font=font_a, fill=COLORS["accent_muted"])

    draw_handle_bar(draw, w, h)
    return img


def slide_cta(data: dict, index: int, total: int) -> Image.Image:
    """Call-to-action final slide."""
    img, draw = make_base_image()
    m = LAYOUT["margin"]
    w, h = CANVAS["width"], CANVAS["height"]

    # Full accent block background stripe
    draw.rectangle([0, h // 3, w, h // 3 + 8], fill=COLORS["accent"])

    draw_slide_number(draw, index, total, w)

    # Emoji / icon area
    icon = data.get("icon", "\U0001f4a1")
    font_icon = get_font("body", 120)
    draw.text((w // 2 - 60, h // 4 - 60), icon, font=font_icon, fill=COLORS["text_primary"])

    y = h // 3 + 80

    heading = data.get("heading", "Сохрани и поделись!")
    font_h = get_font("heading", FONT_SIZES["cta"])
    y = draw_text_wrapped(draw, heading, font_h, m, y, w - m * 2, COLORS["text_primary"], align="center")

    y += 40
    sub = data.get("subheading", "")
    if sub:
        font_s = get_font("body", FONT_SIZES["body"])
        y = draw_text_wrapped(draw, sub, font_s, m, y, w - m * 2, COLORS["text_secondary"], align="center")

    # CTA button shape
    btn_y = y + 60
    btn_h = 100
    draw_rounded_rect(draw, (m + 60, btn_y, w - m - 60, btn_y + btn_h),
                      radius=50, fill=COLORS["accent"])
    btn_text = data.get("button", "Подписаться")
    font_btn = get_font("heading", FONT_SIZES["cta"] - 4)
    bbox = font_btn.getbbox(btn_text)
    bw = bbox[2] - bbox[0]
    draw.text(((w - bw) // 2, btn_y + 22), btn_text, font=font_btn, fill=COLORS["bg_dark"])

    # Handle
    font_handle = get_font("body", FONT_SIZES["handle"])
    hb = font_handle.getbbox(BRAND["handle"])
    hw = hb[2] - hb[0]
    draw.text(((w - hw) // 2, h - m - 40), BRAND["handle"], font=font_handle, fill=COLORS["text_secondary"])
    return img


SLIDE_BUILDERS = {
    "cover":   slide_cover,
    "content": slide_content,
    "quote":   slide_quote,
    "cta":     slide_cta,
}


# ──────────────────────────────────────────────
# Main generator
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
        img.save(path, "JPEG", quality=95)
        print(f"  [{i}/{total}] {slide_type:10s} → {path.name}")

    print("Done.")
    return out_dir


# ──────────────────────────────────────────────
# Demo
# ──────────────────────────────────────────────

DEMO_CONFIG = {
    "slides": [
        {
            "type": "cover",
            "tags": ["AI", "Бизнес"],
            "heading": "5 инструментов AI которые заменят целый отдел",
            "subheading": "Читай до конца — последний пункт удивит",
        },
        {
            "type": "content",
            "tag": "№1",
            "heading": "ChatGPT / Claude",
            "bullets": [
                "Пишет тексты, письма, скрипты продаж",
                "Анализирует данные и таблицы",
                "Заменяет копирайтера и аналитика",
            ],
            "note": "Экономия: от 50 000 ₽/мес на одном инструменте",
        },
        {
            "type": "content",
            "tag": "№2",
            "heading": "Midjourney / DALL·E",
            "bullets": [
                "Генерирует визуал для постов и рекламы",
                "Логотипы, баннеры, концепт-арт",
                "Нет нужды в дизайнере для базовых задач",
            ],
        },
        {
            "type": "quote",
            "quote": "AI не заменит тебя. Тебя заменит человек, который умеет работать с AI.",
            "author": "Valit Sultanov",
        },
        {
            "type": "content",
            "tag": "№3",
            "heading": "Make (Integromat) + AI",
            "bullets": [
                "Автоматизирует рутинные процессы",
                "Связывает любые сервисы без кода",
                "Обрабатывает лиды 24/7 без менеджера",
            ],
        },
        {
            "type": "cta",
            "icon": "\U0001f525",
            "heading": "Сохрани чтобы не потерять",
            "subheading": "Подписывайся — каждую неделю практические AI-инструменты для бизнеса",
            "button": "@sultanov.valit",
        },
    ]
}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Instagram Carousel Generator")
    parser.add_argument("--config", help="Path to JSON config file")
    parser.add_argument("--demo", action="store_true", help="Generate demo carousel")
    parser.add_argument("--name", default="carousel", help="Output folder name")
    args = parser.parse_args()

    if args.demo:
        generate_carousel(DEMO_CONFIG, folder_name="demo_carousel")
    elif args.config:
        with open(args.config) as f:
            cfg = json.load(f)
        generate_carousel(cfg, folder_name=args.name)
    else:
        parser.print_help()

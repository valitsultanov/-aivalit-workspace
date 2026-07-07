#!/usr/bin/env python3
"""Создаёт папку нового эпизода из EPISODE_TEMPLATE.md.

Использование:
    python3 content-machine/generator/new_episode.py ep02_dentist_veneers "Стоматология: виниры"
"""
import re
import sys
from pathlib import Path

GENERATOR_DIR = Path(__file__).resolve().parent
TEMPLATE = GENERATOR_DIR / "EPISODE_TEMPLATE.md"
EPISODES_DIR = GENERATOR_DIR.parent / "episodes"


def main() -> None:
    if len(sys.argv) < 3:
        sys.exit('Использование: new_episode.py <ep_id> "<Название эпизода>"\n'
                 'Пример: new_episode.py ep02_dentist_veneers "Стоматология: виниры"')

    ep_id, ep_title = sys.argv[1], sys.argv[2]
    if not re.fullmatch(r"ep\d{2,}[a-z0-9_]*", ep_id):
        sys.exit(f"ep_id должен быть вида ep02_snake_case, получено: {ep_id}")

    episode_dir = EPISODES_DIR / ep_id
    episode_file = episode_dir / "EPISODE.md"
    if episode_file.exists():
        sys.exit(f"Эпизод уже существует: {episode_file}")

    content = TEMPLATE.read_text(encoding="utf-8")
    content = content.replace("{EP_ID}", ep_id).replace("{EP_TITLE}", ep_title)

    episode_dir.mkdir(parents=True)
    (episode_dir / "refs").mkdir()
    (episode_dir / "frames").mkdir()
    (episode_dir / "videos").mkdir()
    episode_file.write_text(content, encoding="utf-8")

    print(f"Создан {episode_file}")
    print("Подпапки: refs/ (референсы без фона), frames/ (кадры), videos/ (фрагменты)")
    print("Дальше: заполни промпты по 02_PROMPT_TEMPLATES.md и 03_EPISODE_FORMULA.md")


if __name__ == "__main__":
    main()

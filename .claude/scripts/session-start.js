#!/usr/bin/env node
/**
 * SessionStart Hook — автозагрузка контекста воркспейса AiValit.
 *
 * При старте сессии выводит в контекст: напоминание о ключевых файлах
 * идентичности и содержимое последних записей памяти из memory/.
 * Адаптировано из everything-claude-code (memory-persistence) под этот репозиторий:
 * память живёт в git (memory/), а не в ~/.claude.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const MEMORY_DIR = path.join(ROOT, 'memory');
const MAX_CHARS = 3000;

function main() {
  const lines = [];
  lines.push('[SessionStart] Воркспейс AiValit. Прочитай SOUL.md, USER.md, AGENTS.md перед работой.');

  if (fs.existsSync(MEMORY_DIR)) {
    const files = fs
      .readdirSync(MEMORY_DIR)
      .filter((f) => f.endsWith('.md'))
      .sort();

    if (files.length > 0) {
      const recent = files.slice(-2);
      lines.push(`[SessionStart] Записей памяти: ${files.length}. Последние: ${recent.join(', ')}`);

      const latest = path.join(MEMORY_DIR, files[files.length - 1]);
      let content = fs.readFileSync(latest, 'utf8');
      if (content.length > MAX_CHARS) {
        content = content.slice(0, MAX_CHARS) + '\n…(обрезано, читай файл целиком)';
      }
      lines.push(`--- Последняя память (${files[files.length - 1]}) ---`);
      lines.push(content);
    } else {
      lines.push('[SessionStart] Папка memory/ пуста — это первая сессия с памятью.');
    }
  }

  const learnedDir = path.join(ROOT, '.claude', 'skills', 'learned');
  if (fs.existsSync(learnedDir)) {
    const skills = fs.readdirSync(learnedDir).filter((f) => f.endsWith('.md'));
    if (skills.length > 0) {
      lines.push(`[SessionStart] Выученные паттерны (${skills.length}): ${skills.join(', ')} — в .claude/skills/learned/`);
    }
  }

  console.log(lines.join('\n'));
}

try {
  main();
} catch (err) {
  console.error('[SessionStart] Error:', err.message);
}
process.exit(0);

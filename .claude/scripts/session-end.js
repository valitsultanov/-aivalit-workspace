#!/usr/bin/env node
/**
 * SessionEnd Hook — заготовка дневной записи памяти.
 *
 * При завершении сессии создаёт memory/YYYY-MM-DD.md (если его ещё нет)
 * с шаблоном для итогов дня и отмечает время последней сессии.
 * Адаптировано из everything-claude-code (memory-persistence): память
 * хранится в репозитории и коммитится вместе с остальными файлами.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const MEMORY_DIR = path.join(ROOT, 'memory');

function main() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);
  const file = path.join(MEMORY_DIR, `${today}.md`);

  fs.mkdirSync(MEMORY_DIR, { recursive: true });

  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (/\*\*Последняя сессия:\*\*.*/.test(content)) {
      content = content.replace(/\*\*Последняя сессия:\*\*.*/, `**Последняя сессия:** ${time}`);
    } else {
      content += `\n**Последняя сессия:** ${time}\n`;
    }
    fs.writeFileSync(file, content);
    console.log(`[SessionEnd] Обновлена память: memory/${today}.md`);
  } else {
    const template = `# ${today}

**Последняя сессия:** ${time}

## Сделано
-

## В работе
-

## Заметки для следующей сессии
-
`;
    fs.writeFileSync(file, template);
    console.log(`[SessionEnd] Создан файл памяти: memory/${today}.md — заполни итоги дня.`);
  }
}

try {
  main();
} catch (err) {
  console.error('[SessionEnd] Error:', err.message);
}
process.exit(0);

#!/usr/bin/env node
/**
 * Strategic Compact — подсказка о ручном сжатии контекста.
 *
 * Считает вызовы инструментов и на пороге предлагает /compact:
 * ручное сжатие в логичной точке (после исследования, перед новой фазой)
 * сохраняет контекст лучше, чем авто-сжатие посреди задачи.
 * Адаптировано из everything-claude-code (strategic-compact).
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

const sessionId = process.env.CLAUDE_SESSION_ID || process.ppid || 'default';
const counterFile = path.join(os.tmpdir(), `aivalit-tool-count-${sessionId}`);
const threshold = parseInt(process.env.COMPACT_THRESHOLD || '50', 10);

try {
  let count = 1;
  if (fs.existsSync(counterFile)) {
    count = parseInt(fs.readFileSync(counterFile, 'utf8').trim(), 10) + 1;
  }
  fs.writeFileSync(counterFile, String(count));

  if (count === threshold) {
    console.log(`[StrategicCompact] ${threshold} вызовов инструментов — если переходишь к новой фазе, подходящий момент для /compact`);
  } else if (count > threshold && count % 25 === 0) {
    console.log(`[StrategicCompact] ${count} вызовов — хорошая точка для /compact, если контекст устарел`);
  }
} catch (err) {
  console.error('[StrategicCompact] Error:', err.message);
}
process.exit(0);

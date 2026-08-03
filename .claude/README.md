# .claude — конфигурация Claude Code для воркспейса AiValit

Точечная адаптация компонентов из [everything-claude-code](https://github.com/worldflowai/everything-claude-code) под этот воркспейс: взяты только память, обучение и режимы; всё «девелоперское» (TDD, билды, e2e) намеренно опущено.

## Хуки (`settings.json` + `scripts/`)

| Хук | Скрипт | Что делает |
|---|---|---|
| SessionStart | `scripts/session-start.js` | Подгружает в контекст последние записи `memory/` и список выученных паттернов |
| SessionEnd | `scripts/session-end.js` | Создаёт/обновляет дневной файл `memory/YYYY-MM-DD.md` с шаблоном итогов |
| PreToolUse (Edit\|Write) | `scripts/suggest-compact.js` | После 50 вызовов инструментов подсказывает момент для `/compact` |

Память хранится в `memory/` и коммитится в git — это и есть долговременная память ассистента.

## Команды (`commands/`)

- `/learn` — извлечь из сессии переиспользуемые паттерны → `.claude/skills/learned/`
- `/checkpoint [имя]` — зафиксировать рабочую точку (коммит + `.claude/checkpoints.log`)
- `/art [задача]` — режим АРТ: креатив и генерация без менеджерской суеты
- `/content [задача]` — режим КОНТЕНТ: посты, боты, курсы в тоне AiValit
- `/producer [задача]` — режим ПРОДЮСЕР: план, деньги, календарь (использует `content/Personal_Producer_Assistant_Prompt_v1.md`)

## Что сознательно НЕ взято из everything-claude-code

- Хук, блокирующий создание `.md` файлов — сломал бы контентный workflow этого репо.
- Хуки tmux для dev-серверов, агенты и скиллы про TDD/билды/фронтенд/бэкенд.
- MCP-конфиги Supabase/Vercel/Railway/Cloudflare — не используются.

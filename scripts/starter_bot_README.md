# Starter Sales Bot (Telegram)

MVP-бот для продажи `AI Content Starter Pack`:
- /start — оффер + кнопка оплаты
- "Я оплатил" — запрос чека
- После отправки чека — выдача ссылки в приватный канал
- Опционально уведомляет админа о новых чеках

## 1) Установка
```bash
cd /Users/aivalit/.openclaw/workspace
python3 -m venv .venv
source .venv/bin/activate
pip install python-telegram-bot==21.10
```

## 2) Конфиг
```bash
cp scripts/starter_bot.env.example .env.starter
# заполни значения
```

## 3) Запуск
```bash
set -a
source .env.starter
set +a
python scripts/starter_bot.py
```

## 4) Рекомендованный флоу
1. Пользователь пишет `/start`
2. Нажимает "Купить за $10"
3. После оплаты нажимает "Я оплатил"
4. Скидывает чек
5. Получает ссылку в приватный канал

## 5) Что улучшить дальше
- Автоподтверждение оплаты через webhook платёжки
- Авто-добавление в приватный канал по transaction id
- CRM-метки (оплатил/не оплатил/апселл)

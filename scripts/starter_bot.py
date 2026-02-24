#!/usr/bin/env python3
import logging
import os
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes, MessageHandler, filters

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

TOKEN = os.getenv("STARTER_BOT_TOKEN", "")
PAYMENT_URL = os.getenv("STARTER_PAYMENT_URL", "https://example.com/pay")
PRIVATE_CHANNEL_INVITE = os.getenv("STARTER_PRIVATE_CHANNEL_INVITE", "https://t.me/+your_invite")
MANAGER_USERNAME = os.getenv("STARTER_MANAGER_USERNAME", "aivalitgolovanebolit")
_admin_raw = (os.getenv("STARTER_ADMIN_CHAT_ID", "") or "").strip()
ADMIN_CHAT_ID = int(_admin_raw) if _admin_raw.isdigit() else 0


WELCOME = (
    "🔥 *AI Content Starter Pack*\n\n"
    "Контент на 7 дней за 60 минут.\n"
    "Внутри: 30 промптов + 10 хуков + 10 CTA + план на 7 дней.\n"
    "Цена доступа: *1200 ₽*.\n\n"
    "Нажми кнопку ниже, чтобы оплатить и получить доступ."
)


TRACK_BASE = "https://teletype.in/@aivalit/Nnkm6bQJmkw"
TRACK_EXPERT = "https://teletype.in/@aivalit/oG5qJHji17_"
TRACK_INFOBIZ = "https://teletype.in/@aivalit/4ONC4ZP346W"
TRACK_VISUAL = "https://teletype.in/@aivalit/ScNH4NCfxHe"


def main_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        [
            [InlineKeyboardButton("💳 Купить за 1200 ₽", url=PAYMENT_URL)],
            [InlineKeyboardButton("🧭 Выбрать трек", callback_data="tracks")],
            [InlineKeyboardButton("🎁 Что я получу", callback_data="value")],
            [InlineKeyboardButton("❓ Что внутри", callback_data="inside")],
            [InlineKeyboardButton("✅ Я оплатил", callback_data="paid")],
        ]
    )


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(WELCOME, parse_mode="Markdown", reply_markup=main_kb())


async def inside(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    text = (
        "📦 *Что внутри Starter Pack:*\n"
        "• 30 рабочих промптов (TG/IG/X)\n"
        "• 10 хук-формул\n"
        "• 10 CTA-формул\n"
        "• 7-дневный план публикаций\n"
        "• Инструкция для новичков (бесплатный старт)"
    )
    await q.message.reply_text(text, parse_mode="Markdown", reply_markup=main_kb())


async def value(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    text = (
        "🎁 *Что вы получите после оплаты 1200 ₽:*\n\n"
        "1) *Мгновенный доступ* в приватный канал с материалами.\n"
        "2) *Пошаговую инструкцию* «как начать за 15 минут».\n"
        "3) *Готовые инструменты:* промпты, хуки, CTA и план на 7 дней.\n"
        "4) *Понятный формат:* открыл → скопировал → применил → опубликовал.\n"
        "5) *Поддержку по вопросам* — если застряли, пишете и получаете направление.\n\n"
        "✅ Без сложной теории.\n"
        "✅ Подходит новичкам.\n"
        "✅ Первый результат можно получить в день покупки."
    )
    await q.message.reply_text(text, parse_mode="Markdown", reply_markup=main_kb())


async def tracks(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    text = (
        "🧭 *Выбери трек под свою задачу:*\n\n"
        f"• База (старт): {TRACK_BASE}\n"
        f"• Эксперт/наставник: {TRACK_EXPERT}\n"
        f"• Инфобиз: {TRACK_INFOBIZ}\n"
        f"• Коммерческий визуал: {TRACK_VISUAL}\n\n"
        "Начни с базы, потом переходи в профильный трек."
    )
    await q.message.reply_text(text, parse_mode="Markdown", disable_web_page_preview=True, reply_markup=main_kb())


async def paid(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    context.user_data["awaiting_proof"] = True
    await q.message.reply_text(
        "Отлично 🙌\n"
        "Отправь сюда скрин/чек оплаты.\n"
        "После проверки я сразу дам доступ в приватный канал."
    )


async def proof_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.user_data.get("awaiting_proof"):
        return

    user = update.effective_user
    username = f"@{user.username}" if user.username else str(user.id)

    # notify admin if configured
    if ADMIN_CHAT_ID:
        caption = (
            f"Новая оплата на проверку\n"
            f"Пользователь: {username}\n"
            f"ID: {user.id}"
        )
        if update.message.photo:
            file_id = update.message.photo[-1].file_id
            await context.bot.send_photo(ADMIN_CHAT_ID, file_id, caption=caption)
        else:
            await context.bot.send_message(ADMIN_CHAT_ID, caption)

    context.user_data["awaiting_proof"] = False
    await update.message.reply_text(
        "✅ Чек получен.\n"
        "Пока проверяем оплату, держи ссылку в приватный канал:\n"
        f"{PRIVATE_CHANNEL_INVITE}\n\n"
        f"Если будут вопросы — напиши @{MANAGER_USERNAME}"
    )


async def buy(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        f"Оплата здесь: {PAYMENT_URL}\nПосле оплаты нажми кнопку 'Я оплатил' в /start",
    )


async def paid_hint(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Нажми кнопку 'Я оплатил' в /start")


def run() -> None:
    if not TOKEN:
        raise SystemExit("Set STARTER_BOT_TOKEN env var")

    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("buy", buy))
    app.add_handler(CommandHandler("paid", paid_hint))
    app.add_handler(CallbackQueryHandler(tracks, pattern="^tracks$"))
    app.add_handler(CallbackQueryHandler(value, pattern="^value$"))
    app.add_handler(CallbackQueryHandler(inside, pattern="^inside$"))
    app.add_handler(CallbackQueryHandler(paid, pattern="^paid$"))
    app.add_handler(MessageHandler(filters.PHOTO | filters.TEXT, proof_handler))

    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    run()

#!/usr/bin/env python3
import logging
import os
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, Update
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes, MessageHandler, filters

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

TOKEN = os.getenv("STARTER_BOT_TOKEN", "")
PAYMENT_URL = os.getenv("STARTER_PAYMENT_URL", "https://example.com/pay")

WELCOME = (
    "👋 *Добро пожаловать в AI Starter*\n\n"
    "Сейчас только один фокус: получить *первый результат* с нейросетью без перегруза.\n"
    "Я проведу тебя по шагам."
)


def main_kb() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup(
        [[InlineKeyboardButton("🚀 Начать первый шаг", callback_data="start_round_1")]]
    )


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(WELCOME, parse_mode="Markdown", reply_markup=main_kb())


async def start_round_1(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    context.user_data["awaiting_report"] = False
    text = (
        "🎯 *Раунд 1: первый результат с Kimi*\n\n"
        "1) Открой: https://www.kimi.com/\n"
        "2) Вставь промпт:\n\n"
        "`Помоги мне найти 3 направления, где нейросети дадут быстрый результат за 7 дней. "
        "Мой контекст: [кто я и что делаю]. Для каждого направления дай: что делать, результат, план на 7 дней.`\n\n"
        "3) Выбери 1 направление и сделай 1 шаг сегодня.\n\n"
        "Когда сделаешь — нажми кнопку ниже."
    )
    kb = InlineKeyboardMarkup(
        [[InlineKeyboardButton("✅ Я получил первый результат", callback_data="round_1_done")]]
    )
    await q.message.reply_text(text, parse_mode="Markdown", reply_markup=kb)


async def round_1_done(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    context.user_data["awaiting_report"] = True
    await q.message.reply_text(
        "🔥 Супер, это уже прогресс!\n\n"
        "Напиши короткий отчёт одним сообщением:\n"
        "1) Какое направление выбрал\n"
        "2) Что сделал сегодня\n"
        "3) Где было сложно"
    )


async def report_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.user_data.get("awaiting_report"):
        return

    context.user_data["awaiting_report"] = False
    kb = InlineKeyboardMarkup(
        [[InlineKeyboardButton("💳 Войти в 7-дневный старт за 1200 ₽", callback_data="buy_offer")]]
    )
    await update.message.reply_text(
        "🏅 Отлично! Ты дошёл до первого результата.\n"
        "По готовности ты уже на рабочем уровне старта.\n"
        "Обычный вход: 3900 ₽, для тебя сейчас: *1200 ₽*.\n\n"
        "Если готов — переходи дальше:",
        parse_mode="Markdown",
        reply_markup=kb,
    )


async def buy_offer(update: Update, context: ContextTypes.DEFAULT_TYPE):
    q = update.callback_query
    await q.answer()
    await q.message.reply_text(f"Оплата старта: {PAYMENT_URL}")


def run() -> None:
    if not TOKEN:
        raise SystemExit("Set STARTER_BOT_TOKEN env var")

    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(start_round_1, pattern="^start_round_1$"))
    app.add_handler(CallbackQueryHandler(round_1_done, pattern="^round_1_done$"))
    app.add_handler(CallbackQueryHandler(buy_offer, pattern="^buy_offer$"))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, report_handler))
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    run()

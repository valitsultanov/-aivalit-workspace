"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJourney, useSettings } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, Copy, ArrowRight, Trophy } from "lucide-react";

const SCRIPTS = [
  {
    label: "Первое сообщение",
    text: (productName: string) =>
      `Привет! Я делаю ${productName}. Вижу, что вы интересовались / среагировали на мой пост.\n\nЕсть ли у вас такая проблема: [опиши проблему]?\n\nЕсли да — готов помочь. Цена: [сумма]. Займёт [время].\n\nИнтересно?`,
  },
  {
    label: "Обработка «подумаю»",
    text: (productName: string) =>
      `Понимаю, что надо подумать.\n\nЧтобы помочь с решением: что именно смущает — цена, формат, или сомневаетесь, что поможет?\n\nЯ готов ответить на любой вопрос.`,
  },
  {
    label: "Закрытие сделки",
    text: (productName: string) =>
      `Отлично! Вот ссылка для оплаты: [ссылка]\n\nПосле оплаты напишите мне — начнём сразу.\n\nСпасибо за доверие! 🙌`,
  },
];

export default function SalePage() {
  const router = useRouter();
  const { journey, patch } = useJourney();
  const { settings } = useSettings();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [celebrating, setCelebrating] = useState(false);

  const idea = journey.chosenIdea;
  const sale = journey.firstSale;

  if (!idea) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <p className="text-muted-foreground">Сначала выбери продукт и протестируй спрос.</p>
        <Button onClick={() => router.push("/idea")}>Начать с идеи</Button>
      </div>
    );
  }

  // Already sold — show celebration permanently
  if (sale || celebrating) {
    return <CelebrationScreen sale={sale} settings={settings} idea={idea} />;
  }

  function copyScript(idx: number, text: string) {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  function recordSale() {
    const saleRecord = {
      amount: parseFloat(amount) || idea!.priceFrom,
      currency: settings.currency || "$",
      date: new Date().toISOString(),
      note: note.trim(),
    };
    patch({ firstSale: saleRecord, stage: "done" });
    setCelebrating(true);
  }

  const totalReactions = journey.demandPost
    ? journey.demandPost.likes + journey.demandPost.comments + journey.demandPost.dms
    : 0;

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-lg">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Финальный шаг</p>
        <h1 className="text-2xl font-bold">Первая продажа</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {totalReactions >= 10
            ? `${totalReactions} реакций. Спрос есть. Осталось закрыть первую сделку.`
            : "Скрипты готовы. Пиши потенциальным клиентам."}
        </p>
      </div>

      {/* Product reminder */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0 mt-0.5">
          <Trophy className="h-4.5 w-4.5 text-orange-500" />
        </div>
        <div>
          <p className="font-medium">{idea.name}</p>
          <p className="text-sm text-muted-foreground">{idea.tagline}</p>
          <p className="text-sm text-orange-400 mt-1">${idea.priceFrom}–${idea.priceTo}</p>
        </div>
      </div>

      {/* Scripts */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Скрипты продажи</h2>
        {SCRIPTS.map((script, i) => {
          const text = script.text(idea.name);
          return (
            <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{script.label}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyScript(i, text)}
                  className="gap-1 text-xs"
                >
                  {copiedIdx === i ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedIdx === i ? "Скопировано" : "Копировать"}
                </Button>
              </div>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed bg-muted/30 rounded-lg p-3">
                {text}
              </pre>
            </div>
          );
        })}
      </div>

      {/* Payment links guide */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h2 className="text-sm font-semibold">Как принять оплату</h2>
        <div className="space-y-2 text-sm text-muted-foreground">
          {[
            { name: "Stripe", desc: "Международные карты — stripe.com/links" },
            { name: "ЮMoney", desc: "Для РФ — yoomoney.ru/transfer/mylink" },
            { name: "Tinkoff", desc: "Форма приёма денег в приложении банка" },
            { name: "Telegram", desc: "Telegram Stars или @wallet бот" },
          ].map(p => (
            <div key={p.name} className="flex items-start gap-2">
              <span className="font-medium text-foreground shrink-0">{p.name}</span>
              <span>{p.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Record sale */}
      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 space-y-4">
        <h2 className="font-semibold">Деньги пришли? Отметь!</h2>
        <p className="text-sm text-muted-foreground">Это важный момент. Зафикси его.</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Сумма</Label>
            <Input
              type="number"
              placeholder={String(idea.priceFrom)}
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Заметка (не обязательно)</Label>
            <Input
              placeholder="Первый клиент!"
              value={note}
              onChange={e => setNote(e.target.value)}
            />
          </div>
        </div>
        <Button className="w-full" size="lg" onClick={recordSale}>
          🎉 Отметить первую продажу
        </Button>
      </div>
    </div>
  );
}

function CelebrationScreen({ sale, settings, idea }: any) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 max-w-sm mx-auto pb-20">
      <div className="text-6xl">🏆</div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Первая продажа!</h1>
        <p className="text-muted-foreground">
          Ты больше не просто наёмный сотрудник.
        </p>
      </div>
      {sale && (
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-6 w-full space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Сумма</p>
          <p className="hero-number text-5xl font-bold text-orange-500">
            {settings.currency}{sale.amount}
          </p>
          {sale.note && <p className="text-sm text-muted-foreground mt-2">{sale.note}</p>}
        </div>
      )}
      <div className="space-y-2 text-sm text-muted-foreground">
        <p>Продукт: <strong className="text-foreground">{idea?.name}</strong></p>
        <p>Дата: <strong className="text-foreground">{sale ? new Date(sale.date).toLocaleDateString("ru") : "сегодня"}</strong></p>
      </div>
      <div className="w-full space-y-2">
        <p className="text-sm font-medium">Что дальше?</p>
        <p className="text-sm text-muted-foreground">
          Повтори с следующим клиентом. Оптимизируй с AI. Увеличь цену.
        </p>
        <Button className="w-full mt-2" onClick={() => router.push("/")}>
          Вернуться к трекеру <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

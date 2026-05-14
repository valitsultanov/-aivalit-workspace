"use client";

import { usePaywall } from "@/hooks/usePaywall";
import { useTasks } from "@/hooks/useStore";
import { Button } from "@/components/ui/button";
import { formatHours } from "@/lib/calculations";
import { Lock, Zap, Check } from "lucide-react";

const INCLUDED = [
  "Idea Finder — 3 продуктовые идеи под тебя",
  "Build Sprint — 5 задач от идеи до MVP",
  "Тест спроса — пост + трекер реакций",
  "Скрипты первой продажи",
  "Гид по приёму оплаты",
];

interface Props {
  children: React.ReactNode;
  feature?: string;
}

export function PaywallGate({ children, feature }: Props) {
  const { unlocked, unlock } = usePaywall();
  const { tasks } = useTasks();

  const totalSaved = tasks.reduce(
    (s, t) => s + Math.max(0, t.timeWithoutAI - t.timeWithAI), 0
  );

  if (unlocked) return <>{children}</>;

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-lg">
      {/* Teaser header */}
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {feature ?? "Полный путь к первой продаже"}
        </p>
        <h1 className="text-2xl font-bold">Разблокировать Result Engine</h1>
      </div>

      {/* Pain hook */}
      {totalSaved > 0 && (
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 px-4 py-4 space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <p className="text-sm font-semibold text-orange-300">
              Ты уже сэкономил {formatHours(totalSaved)} с AI
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Это время сейчас просто исчезает. Result Engine превращает его в продукт, который продаётся.
          </p>
        </div>
      )}

      {/* Lock visual */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Blurred preview */}
        <div className="relative h-32 bg-gradient-to-b from-card to-muted/50 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 select-none pointer-events-none text-xs space-x-6 px-6">
            <div className="space-y-1">
              <div className="h-2 w-24 bg-foreground rounded" />
              <div className="h-2 w-16 bg-foreground rounded" />
              <div className="h-2 w-20 bg-foreground rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-2 w-20 bg-foreground rounded" />
              <div className="h-2 w-24 bg-foreground rounded" />
              <div className="h-2 w-14 bg-foreground rounded" />
            </div>
          </div>
          <div className="relative z-10 h-12 w-12 rounded-full bg-card border border-border flex items-center justify-center shadow-lg">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Offer */}
        <div className="p-5 space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold hero-number">$49</span>
            <span className="text-muted-foreground text-sm">единоразово</span>
          </div>

          <ul className="space-y-2">
            {INCLUDED.map(item => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button className="w-full" size="lg" onClick={unlock}>
            <Zap className="h-4 w-4 mr-2" />
            Разблокировать за $49
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Один платёж — навсегда. Без подписок.
          </p>
        </div>
      </div>

      {/* Social proof hint */}
      <p className="text-xs text-muted-foreground text-center">
        Если твой первый продукт продастся хотя бы за $50 — инструмент окупится в первый же день.
      </p>
    </div>
  );
}
